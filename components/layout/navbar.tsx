'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Search, User, LogOut, CheckCircle2, AlertCircle, Clock3, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { supabase } from '@/lib/supabase'

export function Navbar() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<any[]>([])
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false)
  const notificationCount = notifications.length

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  useEffect(() => {
    async function fetchNotifications() {
      try {
        setIsLoadingNotifications(true)
        const { data, error } = await supabase
          .from('materials')
          .select(`
            id,
            status,
            document_name,
            submitted_at,
            deadline,
            shows (
              venue_name,
              artist ( name )
            )
          `)
          .order('submitted_at', { ascending: false })
          .limit(3)
        
        if (data && !error) {
           const formatted = data.map(mat => {
             const showData = Array.isArray(mat.shows) ? mat.shows[0] : mat.shows
             const artistData = showData?.artist ? (Array.isArray(showData.artist) ? showData.artist[0] : showData.artist) : null
             
             const now = new Date()
             const submissionDate = mat.submitted_at ? new Date(mat.submitted_at) : null
             const deadlineDate = mat.deadline ? new Date(mat.deadline) : null
             
             let timeStr = 'Recently'
             if (submissionDate) {
               const diffHours = Math.floor((now.getTime() - submissionDate.getTime()) / (1000 * 3600))
               if (diffHours < 1) timeStr = 'Just now'
               else if (diffHours < 24) timeStr = `${diffHours} hours ago`
               else timeStr = `${Math.floor(diffHours / 24)} days ago`
             }
             
             let type: 'delivered' | 'late' | 'upcoming' = 'upcoming'
             if (mat.status?.toLowerCase() === 'delivered' || mat.status?.toLowerCase() === 'submitted') {
               type = 'delivered'
             } else if (deadlineDate && deadlineDate < now) {
               type = 'late'
             }
             
             return {
               id: mat.id,
               type,
              artist: artistData?.name || 'Unnamed Artist',
               document: mat.document_name || 'Document',
               venue: showData?.venue_name || 'Venue',
               time: timeStr
             }
           })
           setNotifications(formatted)
        }
      } catch (err) {
        console.error("Error fetching notifications:", err)
      } finally {
        setIsLoadingNotifications(false)
      }
    }
    fetchNotifications()
  }, [])

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center border-b border-white/5 bg-background/80 backdrop-blur-xl px-10">
      <div className="flex flex-1 items-center space-x-6">
        {/* Search Bar */}
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
          <input
            type="text"
            placeholder="Search by artist or venue..."
            className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 py-3 text-sm font-bold tracking-tight focus:border-primary/50 focus:bg-white/10 transition-all outline-none text-white placeholder:text-muted-foreground/40"
          />
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative p-3 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group">
              <Bell className="h-5 w-5 text-muted-foreground group-hover:text-white" />
              {notificationCount > 0 && (
                <span className="absolute top-2 right-2 h-4 min-w-4 px-1 rounded-full bg-red-500 border-[3px] border-background animate-pulse flex items-center justify-center text-[8px] font-black text-white">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-96 bg-ebony-900/95 backdrop-blur-3xl border-white/10 p-2 rounded-3xl shadow-2xl">
              <DropdownMenuLabel className="font-pro-data uppercase tracking-widest text-[10px] text-muted-foreground/60 px-4 py-3 border-b border-white/5 mb-2">Recent Notifications</DropdownMenuLabel>
              
              {isLoadingNotifications ? (
                <div className="p-12 flex flex-col items-center justify-center">
                  <Loader2 className="h-6 w-6 text-primary animate-spin" />
                  <p className="text-[10px] font-pro-data uppercase tracking-widest text-muted-foreground mt-4">Syncing...</p>
                </div>
              ) : notifications.length > 0 ? (
                notifications.map((notif) => (
                  <DropdownMenuItem key={notif.id} className="p-4 rounded-2xl hover:bg-white/5 cursor-pointer flex gap-4 items-start mb-1 transition-all">
                    <div className={cn(
                      "h-10 w-10 shrink-0 rounded-xl flex items-center justify-center mt-0.5",
                      notif.type === 'delivered' ? "bg-emerald-500/10 text-emerald-400" : 
                      notif.type === 'late' ? "bg-red-500/10 text-red-500" : "bg-amber-500/10 text-amber-400"
                    )}>
                      {notif.type === 'delivered' ? <CheckCircle2 size={18} /> : 
                       notif.type === 'late' ? <AlertCircle size={18} /> : <Clock3 size={18} />}
                    </div>
                    <div>
                      <p className="font-medium text-sm leading-snug">
                        <strong className="text-white">{notif.artist}</strong> 
                        {notif.type === 'delivered' ? ' delivered ' : ' hasn\'t sent '}
                        <strong className={notif.type === 'delivered' ? "text-emerald-400" : "text-red-400"}>
                          {notif.document}
                        </strong><br/>
                        for {notif.venue}
                      </p>
                      <span className="text-[10px] font-pro-data uppercase tracking-widest text-muted-foreground/40 font-bold mt-2 block">{notif.time}</span>
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="p-12 text-center">
                  <Bell className="h-8 w-8 text-muted-foreground/20 mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground font-medium">No recent notifications</p>
                </div>
              )}

          </DropdownMenuContent>
        </DropdownMenu>
        
        <div className="flex items-center space-x-4 pl-6 border-l border-white/5">
          <Button 
            variant="ghost" 
            className="text-muted-foreground hover:text-white hover:bg-white/5 gap-2 px-4 rounded-xl font-pro-data uppercase tracking-widest text-xs font-bold h-11"
            onClick={handleSignOut}
          >
              <LogOut size={16} /> Sign Out
          </Button>
        </div>
      </div>
    </header>
  )
}
