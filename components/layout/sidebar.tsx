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
  User,
  BarChart3,
  ShieldAlert
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

const navigation = [
  { name: 'Overview', href: '/overview', icon: LayoutDashboard },
  { name: 'Shows', href: '/shows', icon: Music },
  { name: 'Artists', href: '/artists', icon: Users },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [profile, setProfile] = useState<{ full_name: string; role: string; is_super_admin: boolean } | null>(null)

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('full_name, role, is_super_admin')
          .eq('id', user.id)
          .single()
        
        if (data) {
          setProfile(data as any)
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

  // Dynamic navigation items
  const menuItems = [...navigation]
  if (profile?.is_super_admin) {
    menuItems.push({ name: 'Admin', href: '/admin', icon: ShieldAlert as any })
  }

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
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group relative flex items-center px-4 py-3 rounded-xl transition-all duration-300",
                isActive 
                  ? "bg-primary/15 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              {/* Active Glow Accent - More Prominent */}
              {isActive && (
                <div className="absolute left-0 w-1.5 h-7 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.8)] transition-all" />
              )}
              
              <item.icon className={cn(
                "w-5 h-5 transition-all duration-300",
                isActive ? "text-primary scale-110 drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]" : "text-muted-foreground group-hover:text-foreground"
              )} />
              
              {!isCollapsed && (
                <span className={cn(
                  "ml-3 font-bold tracking-tight transition-all",
                  isActive ? "translate-x-1" : ""
                )}>
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
