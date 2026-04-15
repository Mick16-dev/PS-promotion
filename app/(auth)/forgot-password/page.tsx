'use client'

import React from 'react'
import Link from 'next/link'
import { Music, ArrowRight, ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [message, setMessage] = React.useState<string | null>(null)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setMessage(null)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        setError(error.message)
      } else {
        setMessage('Check your email for the password reset link.')
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
            Reset Password
          </h2>
          <p className="mt-2 text-sm text-muted-foreground uppercase tracking-widest font-mono">
            Enter your email to continue
          </p>
        </div>

        {/* Form Area */}
        <form onSubmit={handleReset} className="space-y-6">
          {error && (
            <div className="p-3 text-xs font-semibold text-red-500 bg-red-400/10 border border-red-500/20 rounded-lg text-center animate-in fade-in slide-in-from-top-2 duration-300">
              {error}
            </div>
          )}
          {message && (
            <div className="p-3 text-xs font-semibold text-emerald-500 bg-emerald-400/10 border border-emerald-500/20 rounded-lg text-center animate-in fade-in slide-in-from-top-2 duration-300">
              {message}
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

          <button
            type="submit"
            disabled={isLoading}
            className="group relative flex w-full justify-center overflow-hidden rounded-xl bg-primary px-4 py-4 text-sm font-bold text-white transition-all hover:bg-primary/90 focus:ring-2 focus:ring-primary/20 active:scale-[0.98]"
          >
            {isLoading ? (
              <span className="flex items-center border-t-2 border-white/30 border-solid rounded-full w-4 h-4 animate-spin" />
            ) : (
              <span className="flex items-center">
                Send Reset Link
                <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </button>

          <div className="text-center">
            <Link 
              href="/login" 
              className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={14} className="mr-2" />
              Back to login
            </Link>
          </div>
        </form>

        {/* Footer Area */}
        <div className="text-center pt-8 border-t border-border/50">
           <p className="text-[11px] text-muted-foreground/60 leading-relaxed px-4">
             Access is restricted to authorized music promoters. By continuing, you agree to our professional terms.
           </p>
        </div>
      </div>
    </div>
  )
}
