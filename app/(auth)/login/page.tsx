'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Music, ArrowRight, Github } from 'lucide-react'
import { cn } from '@/lib/utils'

import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [isCheckingSession, setIsCheckingSession] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

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
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) {
        setError(error.message)
        return
      }

      if (data.session) {
        router.replace('/')
        router.refresh()
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      {/* Background Glow Layer */}
      <div className="absolute inset-0 pointer-events-none lumina-glow opacity-30 z-0" />
      
      <div className="relative z-10 w-full max-w-sm space-y-12">
        {/* Branding Area */}
        <div className="text-center group">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 mb-6 group-hover:scale-110 transition-transform">
             <Music className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-foreground">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-muted-foreground uppercase tracking-widest font-mono">
            PS-promotion Dashboard
          </p>
        </div>

        {/* Input Area */}
        {isCheckingSession ? (
          <div className="space-y-6">
            <div className="h-12 rounded-xl bg-muted/30 animate-pulse" />
            <div className="h-12 rounded-xl bg-muted/30 animate-pulse" />
            <div className="h-12 rounded-xl bg-primary/30 animate-pulse" />
          </div>
        ) : (
        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-3 text-xs font-semibold text-red-500 bg-red-400/10 border border-red-500/20 rounded-lg text-center animate-in fade-in slide-in-from-top-2 duration-300">
              {error}
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
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between px-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Password</label>
              <a href="#" className="text-[10px] font-bold text-primary/80 hover:text-primary transition-colors uppercase tracking-tight">Forgot?</a>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-muted/30 border border-border/80 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary/50 text-foreground transition-all outline-none placeholder:text-muted-foreground/40"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative flex w-full justify-center overflow-hidden rounded-xl bg-primary px-4 py-4 text-sm font-bold text-white transition-all hover:bg-primary/90 focus:ring-2 focus:ring-primary/20 active:scale-[0.98]"
          >
            {isLoading ? (
              <span className="flex items-center border-t-2 border-white/30 border-solid rounded-full w-4 h-4 animate-spin" />
            ) : (
              <span className="flex items-center">
                Sign in to ShowReady
                <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </button>
        </form>
        )}

        {/* Footer Area */}
        <div className="text-center pt-8 border-t border-border/50">
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
