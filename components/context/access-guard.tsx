'use client'

import React, { useEffect, useState } from 'react'
import { ShieldAlert, LogOut } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

export function AccessGuard({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<'active' | 'blocked' | 'loading'>('loading')

  useEffect(() => {
    async function checkStatus() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setStatus('active') // Let the login page handle it
        return
      }

      const { data } = await supabase
        .from('profiles')
        .select('access_status')
        .eq('id', user.id)
        .single()

      if (data?.access_status === 'blocked') {
        setStatus('blocked')
      } else {
        setStatus('active')
      }
    }

    checkStatus()

    // Listen for status changes
    const channel = supabase
      .channel('access-control')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles' }, (payload) => {
        if (payload.new.access_status === 'blocked') {
          setStatus('blocked')
        } else {
          setStatus('active')
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  if (status === 'loading') {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (status === 'blocked') {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0c0c0c] px-6 text-center">
        <div className="w-24 h-24 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center justify-center text-red-500 mb-8 shadow-[0_0_50px_rgba(239,68,68,0.2)] animate-pulse">
          <ShieldAlert size={48} />
        </div>
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic text-white mb-4">
          Access <span className="text-red-500">Suspended</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-lg mb-12 font-medium">
          Your account has been temporarily restricted by the system administrator. This is usually due to pending payments or a violation of terms.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            variant="outline" 
            className="h-14 px-10 rounded-2xl border-white/10 bg-white/5 text-white font-bold uppercase tracking-widest text-xs"
            onClick={() => window.location.href = 'mailto:support@showready.app'}
          >
            Contact Support
          </Button>
          <Button 
            className="h-14 px-10 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold uppercase tracking-widest text-xs"
            onClick={async () => {
              await supabase.auth.signOut()
              window.location.href = '/login'
            }}
          >
            <LogOut size={16} className="mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
