'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { 
  Music, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ArrowRight,
  Send,
  AlertTriangle,
  FileText,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

export default function DashboardHome() {
  const router = useRouter()
  const [stats, setStats] = useState([
    { name: 'Total Shows', value: '--', icon: Music, color: 'text-primary' },
    { name: 'Documents Awaiting', value: '--', icon: Clock, color: 'text-amber-500' },
    { name: 'Documents Delivered', value: '--', icon: CheckCircle2, color: 'text-emerald-500' },
    { name: 'Documents Late', value: '--', icon: AlertCircle, color: 'text-red-500' },
  ])
  const [isLoading, setIsLoading] = useState(true)
  const [isSendingReminder, setIsSendingReminder] = useState<string | null>(null)
  const [lockouts, setLockouts] = useState<Record<string, boolean>>({})

  const [overdueDocs, setOverdueDocs] = useState<any[]>([])
  const [recentActivity, setRecentActivity] = useState<any[]>([])

  useEffect(() => {
    // Load lockouts
    const savedLockouts = localStorage.getItem('reminder_lockouts')
    if (savedLockouts) {
      try {
        const parsed = JSON.parse(savedLockouts)
        const now = Date.now()
        setLockouts(Object.fromEntries(Object.entries(parsed).filter(([_, expiry]) => now < (expiry as number))))
      } catch (e) {}
    }

    async function fetchDashboardData() {
      try {
        setIsLoading(true)
        
        // Fetch shows and materials separately to avoid Join errors
        const { data: shows, count: showsCount } = await supabase.from('shows').select('id, venue, artist_name, artist_email', { count: 'exact' })
        const { data: materials } = await supabase.from('materials').select('id, show_id, status, deadline, submitted_at, item_name')
        
        let awaitingCount = 0
        let deliveredCount = 0
        let lateCount = 0
        let overdueList: any[] = []
        let activityList: any[] = []
        
        const now = new Date()
        
        if (materials) {
           materials.forEach(mat => {
             const show = shows?.find(s => s.id === mat.show_id)
             const artistName = show?.artist_name || 'Unnamed Artist'
             const artistEmail = show?.artist_email || ''
             const venueName = show?.venue || 'Venue TBD'
             const docName = mat.item_name || 'Document'
             
             if (mat.status?.toLowerCase() === 'delivered' || mat.status?.toLowerCase() === 'submitted') {
               deliveredCount++
               if (mat.submitted_at) {
                 activityList.push({
                   id: mat.id,
                   artist: artistName,
                   document: docName,
                   venue: venueName,
                   time: new Date(mat.submitted_at)
                 })
               }
             } else {
               if (mat.deadline && new Date(mat.deadline) < now) {
                 lateCount++
                 const daysLate = Math.floor((now.getTime() - new Date(mat.deadline).getTime()) / (1000 * 3600 * 24))
                 overdueList.push({
                   id: mat.id,
                   artist: artistName,
                   artistEmail: artistEmail,
                   venue: venueName,
                   document: docName,
                   deadline: mat.deadline,
                   portalToken: mat.show_id || '',
                   daysLate: daysLate > 0 ? daysLate : 1
                 })
               } else {
                 awaitingCount++
               }
             }
           })
        }
        
        activityList.sort((a, b) => b.time.getTime() - a.time.getTime())
        
        setStats([
          { name: 'Total Shows', value: (showsCount || 0).toString(), icon: Music, color: 'text-primary' },
          { name: 'Documents Awaiting', value: awaitingCount.toString(), icon: Clock, color: 'text-amber-500' },
          { name: 'Documents Delivered', value: deliveredCount.toString(), icon: CheckCircle2, color: 'text-emerald-500' },
          { name: 'Documents Late', value: lateCount.toString(), icon: AlertCircle, color: 'text-red-500' },
        ])
        
        setOverdueDocs(overdueList)
        setRecentActivity(activityList.slice(0, 5).map(item => {
           const hours = Math.floor((now.getTime() - item.time.getTime()) / (1000 * 3600))
           let timeStr = hours < 1 ? 'Just now' : (hours >= 24 ? `${Math.floor(hours / 24)} days ago` : `${hours} hours ago`)
           return { ...item, time: timeStr }
        }))
        
      } catch (error) {
        console.error("Dashboard error:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchDashboardData()

    // Real-time updates for shows and materials
    const showSub = supabase.channel('show-stats').on('postgres_changes', { event: '*', schema: 'public', table: 'shows' }, () => fetchDashboardData()).subscribe()
    const matSub = supabase.channel('mat-stats').on('postgres_changes', { event: '*', schema: 'public', table: 'materials' }, () => fetchDashboardData()).subscribe()

    return () => {
      supabase.removeChannel(showSub)
      supabase.removeChannel(matSub)
    }
  }, [])

  const handleSendReminder = async (item: any) => {
    if (lockouts[item.id]) return
    setIsSendingReminder(item.id)
    
    try {
      const response = await fetch('/api/n8n/send-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          material_id: item.id,
          artist_email: item.artistEmail,
          artist_name: item.artist,
          item_name: item.document,
          deadline: item.deadline,
          show_name: item.venue,
          portal_token: item.portalToken
        })
      })

      if (!response.ok) throw new Error('Reminder failed')

      toast.success('Reminder Sent', { description: `Manual reminder for ${item.document} sent.` })
      const expiry = Date.now() + 24 * 60 * 60 * 1000
      const newLockouts = { ...lockouts, [item.id]: true }
      setLockouts(newLockouts)
      
      const saved = localStorage.getItem('reminder_lockouts')
      const parsed = saved ? JSON.parse(saved) : {}
      parsed[item.id] = expiry
      localStorage.setItem('reminder_lockouts', JSON.stringify(parsed))
    } catch (error) {
      toast.error('Failed to send reminder.')
    } finally {
      setIsSendingReminder(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4 text-muted-foreground">
          <Music className="h-8 w-8 animate-bounce text-primary/50" />
          <p className="font-pro-data uppercase tracking-widest text-xs font-bold">Refreshing Roster Data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white">ShowReady Dashboard</h1>
          <p className="text-muted-foreground mt-2 font-medium">Welcome back. Monitoring your active shows and document deadlines.</p>
        </div>
        <Button onClick={() => router.push('/shows')} className="h-12 px-8 bg-primary text-white hover:bg-primary/90 shadow-xl shadow-primary/20 font-pro-data tracking-widest uppercase text-xs rounded-xl">
          Manage Shows
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="glass-card p-8 rounded-[2rem] flex flex-col justify-between group hover:border-primary/40 transition-all duration-500 bg-muted/5 relative overflow-hidden">
            <div className={`absolute -right-4 -top-4 p-8 opacity-5 group-hover:opacity-10 transition-opacity rotate-12 ${stat.color}`}>
                <stat.icon size={80} />
            </div>
            <div className={`p-3 w-fit rounded-2xl bg-muted/30 border border-white/5 ${stat.color} group-hover:bg-primary group-hover:text-white transition-all`}>
                <stat.icon className="h-6 w-6" />
            </div>
            <div className="mt-8 relative z-10">
              <p className="text-[11px] font-pro-data uppercase tracking-widest text-muted-foreground font-bold">{stat.name}</p>
              <p className="text-4xl font-black mt-2 tracking-tight italic font-pro-data text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-10">
        {overdueDocs.length > 0 && (
          <div className="glass-card rounded-[2.5rem] overflow-hidden border-red-500/20 shadow-2xl shadow-red-500/5">
            <div className="bg-red-500/10 border-b border-red-500/20 px-8 py-5 flex items-center gap-3">
              <AlertTriangle className="text-red-500 h-5 w-5" />
              <h3 className="text-red-500 font-black uppercase font-pro-data tracking-widest text-xs">
                {overdueDocs.length} overdue documents requiring action
              </h3>
            </div>
            <div className="divide-y divide-white/5 bg-muted/5">
              {overdueDocs.map((item) => (
                <div key={item.id} className="p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-6">
                    <div className="h-14 w-14 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20 shadow-lg">
                      <FileText size={22} />
                    </div>
                    <div>
                      <p className="font-black text-white text-xl uppercase italic tracking-tighter">{item.artist}</p>
                      <p className="text-sm text-muted-foreground font-medium flex items-center gap-2 mt-1">
                        {item.venue} <span className="text-white/10">•</span> <span className="text-white/80">{item.document}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 justify-between sm:justify-end w-full sm:w-auto">
                    <span className="text-red-400 font-bold text-xs uppercase bg-red-500/10 px-4 py-2 rounded-xl border border-red-500/20 font-pro-data tracking-widest">
                      {item.daysLate}d Overdue
                    </span>
                    <Button 
                      variant="outline" 
                      onClick={() => handleSendReminder(item)}
                      disabled={isSendingReminder === item.id || lockouts[item.id]}
                      className="border-white/10 hover:bg-white/10 font-pro-data uppercase tracking-widest text-[10px] h-12 px-6 rounded-xl gap-3 min-w-[170px]"
                    >
                      {isSendingReminder === item.id ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                      {isSendingReminder === item.id ? 'Sending...' : (lockouts[item.id] ? 'Sent' : 'Resend Reminder')}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="glass-card rounded-[2.5rem] overflow-hidden border-white/5 bg-muted/5">
          <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between bg-muted/20">
            <div>
                <h3 className="text-2xl font-black uppercase tracking-tighter italic">Recent Activity</h3>
                <p className="text-xs text-muted-foreground mt-1 font-medium">Monitoring the latest roster submissions</p>
            </div>
            <Link href="/shows" className="text-[10px] font-pro-data uppercase tracking-widest text-primary hover:underline flex items-center gap-2 font-bold bg-primary/10 px-4 py-2 rounded-xl border border-primary/20">
              View All <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-8 hover:bg-white/[0.02] transition-colors group">
                  <div className="flex items-center gap-6">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-lg">
                      <CheckCircle2 size={20} />
                    </div>
                    <p className="text-base text-muted-foreground font-medium">
                      <strong className="text-white uppercase italic tracking-tighter">{activity.artist}</strong> submitted <span className="text-white/80">[{activity.document}]</span> for <span className="text-white/80">{activity.venue}</span>
                    </p>
                  </div>
                  <span className="text-[10px] font-pro-data uppercase tracking-widest text-muted-foreground/30 font-bold whitespace-nowrap ml-4">
                    {activity.time}
                  </span>
                </div>
              ))
            ) : (
                <div className="p-20 flex flex-col items-center justify-center text-center">
                    <div className="h-20 w-20 rounded-3xl bg-muted/20 border border-white/5 flex items-center justify-center mb-6">
                        <FileText size={32} className="text-muted-foreground/20" />
                    </div>
                    <p className="text-xl font-black uppercase tracking-tighter italic text-white/40">No recent submissions</p>
                    <p className="text-sm text-muted-foreground mt-2 max-w-sm font-medium">Your feed will update automatically as soon as artists provide their materials.</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
