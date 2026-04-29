'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Music, ArrowRight, Github, ShieldCheck, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/input-otp'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [otp, setOtp] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [isCheckingSession, setIsCheckingSession] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [showMFA, setShowMFA] = React.useState(false)
  const [mfaFactorId, setMfaFactorId] = React.useState<string | null>(null)
  const [mfaChallengeId, setMfaChallengeId] = React.useState<string | null>(null)
  const [cooldownUntil, setCooldownUntil] = React.useState<number | null>(null)
  const [redirectedFrom, setRedirectedFrom] = React.useState<string>('/')
  const failedAttemptsRef = React.useRef(0)
  const cooldownTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    let isMounted = true

    async function checkSession() {
      const { data } = await supabase.auth.getSession()
      if (!isMounted) return

      if (data.session) {
        router.replace('/')
        return
      }

      setIsCheckingSession(false)
    }

    checkSession()

    return () => {
      isMounted = false
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current)
    }
  }, [router])

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setRedirectedFrom(params.get('redirectedFrom') || '/')
  }, [])

  const safeRedirect =
    redirectedFrom.startsWith('/') && !redirectedFrom.startsWith('//')
      ? redirectedFrom
      : '/'

  const isInCooldown = cooldownUntil !== null && Date.now() < cooldownUntil

  const [turnstileToken, setTurnstileToken] = React.useState<string | null>(null)

  React.useEffect(() => {
    // Load Cloudflare Turnstile script
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    script.async = true
    script.defer = true
    document.head.appendChild(script)

    // Handle global callback
    ;(window as any).onTurnstileSuccess = (token: string) => {
      setTurnstileToken(token)
    }

    return () => {
      document.head.removeChild(script)
      delete (window as any).onTurnstileSuccess
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isInCooldown || !turnstileToken) return
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) {
        failedAttemptsRef.current += 1
        setError('Invalid email or password.')
        if (failedAttemptsRef.current >= 5) {
          const until = Date.now() + 30_000
          setCooldownUntil(until)
          failedAttemptsRef.current = 0
          cooldownTimerRef.current = setTimeout(() => setCooldownUntil(null), 30_000)
        }
        return
      }

      // Check for MFA requirement
      const { data: factors, error: mfaError } = await supabase.auth.mfa.listFactors()
      if (factors?.totp?.length > 0) {
        // User has MFA enabled, trigger challenge
        const factor = factors.totp[0]
        setMfaFactorId(factor.id)
        
        const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
          factorId: factor.id
        })
        
        if (challengeError) throw challengeError
        
        setMfaChallengeId(challenge.id)
        setShowMFA(true)
        setIsLoading(false)
        return
      }

      if (data.session) {
        failedAttemptsRef.current = 0
        router.replace(safeRedirect)
        router.refresh()
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMFAVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!mfaFactorId || otp.length < 6) return
    
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.mfa.verify({
        factorId: mfaFactorId,
        challengeId: mfaChallengeId || '',
        code: otp
      })

      if (error) {
        setError('Invalid verification code.')
        return
      }

      router.replace(safeRedirect)
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'MFA verification failed.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="absolute inset-0 pointer-events-none lumina-glow opacity-30 z-0" />
      
      <div className="relative z-10 w-full max-w-sm space-y-12">
        <div className="text-center group">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 mb-6 group-hover:scale-110 transition-transform">
             <Music className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-foreground">
            {showMFA ? 'Security Check' : 'Welcome Back'}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground uppercase tracking-widest font-mono">
            {showMFA ? 'Enter Verification Code' : 'ShowReady Dashboard'}
          </p>
        </div>

        {isCheckingSession ? (
          <div className="space-y-6">
            <div className="h-12 rounded-xl bg-muted/30 animate-pulse" />
            <div className="h-12 rounded-xl bg-muted/30 animate-pulse" />
            <div className="h-12 rounded-xl bg-primary/30 animate-pulse" />
          </div>
        ) : showMFA ? (
          /* MFA Verification View */
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {error && (
              <div className="p-3 text-xs font-semibold text-red-500 bg-red-400/10 border border-red-500/20 rounded-lg text-center">
                {error}
              </div>
            )}
            
            <div className="flex flex-col items-center space-y-6">
              <div className="bg-primary/5 p-4 rounded-full border border-primary/10">
                <ShieldCheck size={32} className="text-primary" />
              </div>
              <p className="text-center text-xs text-muted-foreground max-w-[240px] leading-relaxed">
                Please enter the 6-digit code from your authenticator app to continue.
              </p>
              
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={setOtp}
                onComplete={() => handleMFAVerify()}
                containerClassName="group flex items-center justify-center"
              >
                <InputOTPGroup className="gap-2">
                  <InputOTPSlot index={0} className="w-12 h-14 text-xl border-white/10 bg-white/5 rounded-xl font-black text-primary" />
                  <InputOTPSlot index={1} className="w-12 h-14 text-xl border-white/10 bg-white/5 rounded-xl font-black text-primary" />
                  <InputOTPSlot index={2} className="w-12 h-14 text-xl border-white/10 bg-white/5 rounded-xl font-black text-primary" />
                </InputOTPGroup>
                <InputOTPSeparator className="text-white/20 mx-1" />
                <InputOTPGroup className="gap-2">
                  <InputOTPSlot index={3} className="w-12 h-14 text-xl border-white/10 bg-white/5 rounded-xl font-black text-primary" />
                  <InputOTPSlot index={4} className="w-12 h-14 text-xl border-white/10 bg-white/5 rounded-xl font-black text-primary" />
                  <InputOTPSlot index={5} className="w-12 h-14 text-xl border-white/10 bg-white/5 rounded-xl font-black text-primary" />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => handleMFAVerify()}
                disabled={isLoading || otp.length < 6}
                className="group relative flex w-full justify-center overflow-hidden rounded-xl bg-primary px-4 py-4 text-sm font-bold text-white transition-all hover:bg-primary/90 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : 'Verify & Sign In'}
              </button>
              <button
                onClick={() => setShowMFA(false)}
                className="w-full text-xs font-bold text-muted-foreground hover:text-white transition-colors"
              >
                Back to Login
              </button>
            </div>
          </div>
        ) : (
          /* Standard Login View */
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-3 text-xs font-semibold text-red-500 bg-red-400/10 border border-red-500/20 rounded-lg text-center animate-in fade-in slide-in-from-top-2 duration-300">
                {error}
              </div>
            )}
            {isInCooldown && (
              <div className="p-3 text-xs font-semibold text-amber-500 bg-amber-400/10 border border-amber-500/20 rounded-lg text-center animate-in fade-in slide-in-from-top-2 duration-300">
                Too many attempts. Please wait a moment and try again.
              </div>
            )}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-muted/30 border border-border/80 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary/50 text-foreground transition-all outline-none placeholder:text-muted-foreground/40"
                autoComplete="email"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between px-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Password</label>
                <Link href="/forgot-password" className="text-[10px] font-bold text-primary/80 hover:text-primary transition-colors uppercase tracking-tight">Forgot?</Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-muted/30 border border-border/80 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary/50 text-foreground transition-all outline-none placeholder:text-muted-foreground/40"
                autoComplete="current-password"
              />
            </div>

            {/* Cloudflare Turnstile CAPTCHA */}
            <div className="flex justify-center py-2">
              <div 
                className="cf-turnstile" 
                data-sitekey="1x00000000000000000000AA"
                data-callback="onTurnstileSuccess"
                data-theme="dark"
              ></div>
            </div>

            <button
              type="submit"
              disabled={isLoading || isInCooldown || !turnstileToken}
              className="group relative flex w-full justify-center overflow-hidden rounded-xl bg-primary px-4 py-4 text-sm font-bold text-white transition-all hover:bg-primary/90 focus:ring-2 focus:ring-primary/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <span className="flex items-center">
                  Sign in to ShowReady
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>
        )}

        <div className="text-center pt-8 border-t border-border/50">
           <p className="text-xs font-medium text-muted-foreground mb-6">
             Don't have an account?{' '}
             <Link href="/register" className="text-primary font-bold hover:underline transition-all">Register Now</Link>
           </p>
           <button disabled className="flex items-center justify-center w-full space-x-2 text-xs font-medium text-muted-foreground/50 cursor-not-allowed mb-4">
             <Github size={14} />
             <span>GitHub sign-in unavailable</span>
           </button>
           <p className="text-[11px] text-muted-foreground/60 leading-relaxed px-4">
             Access is restricted to authorized music promoters. By continuing, you agree to our professional terms.
           </p>
        </div>
      </div>
    </div>
  )
}
