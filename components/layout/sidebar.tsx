'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Music, 
  Calendar, 
  Users, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  User 
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Shows', href: '/shows', icon: Music },
  { name: 'Artists', href: '/artists', icon: Users },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [profile, setProfile] = useState<{ full_name: string; role: string } | null>(null)

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('full_name, role')
          .eq('id', user.id)
          .single()
        
        if (data) {
          setProfile(data)
        }
      }
    }
    loadProfile()

    // Listen for realtime updates to profiles
    const channel = supabase
      .channel('profile-updates')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles' }, (payload) => {
        setProfile(payload.new as any)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <div 
      className={cn(
        "relative flex flex-col h-screen border-r border-border bg-background transition-all duration-300 ease-in-out z-40",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Branding Header */}
      <div className="flex items-center h-16 px-6 border-b border-border mb-4">
        {!isCollapsed && (
          <span className="text-xl font-black uppercase italic tracking-tighter text-foreground">
            Show<span className="text-primary">Ready</span>
          </span>
        )}
        {isCollapsed && (
          <span className="text-xl font-black italic tracking-tighter text-primary">SR</span>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group relative flex items-center px-3 py-2.5 rounded-lg transition-all duration-200",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              {/* Active Glow Accent */}
              {isActive && (
                <div className="absolute left-0 w-1 h-6 bg-primary rounded-full blur-[2px] transition-all" />
              )}
              
              <item.icon className={cn(
                "w-5 h-5 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
              )} />
              
              {!isCollapsed && (
                <span className="ml-3 font-medium tracking-tight">
                  {item.name}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer / Profile / Toggle */}
      <div className="p-4 border-t border-border mt-auto space-y-4">
        {!isCollapsed && profile && (
          <div className="px-3 py-4 rounded-2xl bg-muted/30 border border-white/5 animate-in fade-in slide-in-from-bottom-2 duration-500">
             <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                   <User size={20} />
                </div>
                <div className="overflow-hidden">
                   <p className="text-sm font-bold text-white truncate">{profile.full_name || 'Promoter'}</p>
                   <p className="text-[10px] font-pro-data uppercase tracking-widest text-muted-foreground truncate">{profile.role || 'Access Level 1'}</p>
                </div>
             </div>
          </div>
        )}

        {isCollapsed && (
          <div className="flex justify-center py-2">
             <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <User size={20} />
             </div>
          </div>
        )}

        <div className="space-y-1">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center justify-center w-full p-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            {!isCollapsed && <span className="ml-2 text-sm font-medium">Collapse</span>}
          </button>
          
          <button 
            onClick={handleSignOut}
            className="flex items-center w-full px-3 py-2.5 rounded-lg text-red-500/80 hover:text-red-500 hover:bg-red-500/10 transition-all font-medium"
          >
            <LogOut size={18} />
            {!isCollapsed && <span className="ml-3 text-sm">Sign Out</span>}
          </button>
        </div>
      </div>
    </div>
  )
}
