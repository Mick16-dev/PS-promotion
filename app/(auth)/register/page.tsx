'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Music, ArrowRight, UserPlus, ShieldCheck } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [fullName, setFullName] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Call our custom registration API that uses the service role bypass
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName })
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || 'Registration failed')
      }

      if (result.success) {
        // Auto-login after registration
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password
        })
        
        if (loginError) {
          toast.info('Account created! Please log in manually.')
          router.push('/login')
          return
        }

        toast.success('Welcome to ShowReady!')
        router.push('/')
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.')
      toast.error(err.message || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0c0c0c] px-4 py-12 sm:px-6 lg:px-8">
      {/* Background Glow Layer */}
      <div className="absolute inset-0 pointer-events-none lumina-glow opacity-30 z-0" />
      
      <div className="relative z-10 w-full max-w-sm space-y-10">
        {/* Branding Area */}
        <div className="text-center group">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 mb-6 group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(79,70,229,0.2)]">
             <UserPlus className="h-7 w-7 text-primary" />
          </div>
          <h2 className="text-4xl font-black tracking-tighter text-white italic uppercase">
            Get <span className="text-primary">Started</span>
          </h2>
          <p className="mt-3 text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-bold opacity-60">
            Join the Elite Promoter Network
          </p>
        </div>

        {/* Input Area */}
        <form onSubmit={handleRegister} className="space-y-5">
          {error && (
            <div className="p-4 text-xs font-bold text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl text-center animate-in fade-in zoom-in duration-300 uppercase tracking-widest">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Michael Chen"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 text-white transition-all outline-none placeholder:text-muted-foreground/30 hover:border-white/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@agency.com"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 text-white transition-all outline-none placeholder:text-muted-foreground/30 hover:border-white/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-2">Secure Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 text-white transition-all outline-none placeholder:text-muted-foreground/30 hover:border-white/20"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative flex w-full justify-center overflow-hidden rounded-2xl bg-primary px-4 py-5 text-xs font-black text-white transition-all hover:bg-primary/90 focus:ring-4 focus:ring-primary/20 active:scale-[0.98] uppercase tracking-[0.2em] shadow-xl shadow-primary/30"
          >
            {isLoading ? (
              <span className="flex items-center border-t-2 border-white/30 border-solid rounded-full w-4 h-4 animate-spin" />
            ) : (
              <span className="flex items-center">
                Create My Account
                <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </button>
        </form>

        {/* Footer Area */}
        <div className="text-center space-y-6 pt-4">
           <p className="text-xs font-medium text-muted-foreground">
             Already part of the roster?{' '}
             <Link href="/login" className="text-primary font-bold hover:underline">Sign In</Link>
           </p>
           
           <div className="pt-6 border-t border-white/5">
              <div className="flex items-center justify-center gap-2 text-muted-foreground/40 mb-3">
                 <ShieldCheck size={14} />
                 <span className="text-[10px] font-black uppercase tracking-widest">Enterprise Security Active</span>
              </div>
              <p className="text-[10px] text-muted-foreground/40 leading-relaxed font-medium">
                By creating an account, you agree to our <br />
                <span className="text-white/20">Terms of Service</span> and <span className="text-white/20">Privacy Protocol</span>.
              </p>
           </div>
        </div>
      </div>
    </div>
  )
}
