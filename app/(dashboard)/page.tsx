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

const REMINDER_WEBHOOK_URL = 'http://n8n-a4c84s8ogs0048s08gkgcw0c.34.41.73.152.sslip.io/webhook-test/send-reminder'

// Removed mock arrays to rely on state

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
    // Load lockouts from local storage
    const savedLockouts = localStorage.getItem('reminder_lockouts')
    if (savedLockouts) {
      try {
        const parsed = JSON.parse(savedLockouts)
        const now = Date.now()
        const activeLockouts: Record<string, boolean> = {}
        let cleanupNeeded = false
        
        Object.keys(parsed).forEach(id => {
          if (now < parsed[id]) {
            activeLockouts[id] = true
          } else {
            cleanupNeeded = true
          }
        })
        
        if (cleanupNeeded) {
          localStorage.setItem('reminder_lockouts', JSON.stringify(
            Object.fromEntries(Object.entries(parsed).filter(([_, expiry]) => now < (expiry as number)))
          ))
        }
        setLockouts(activeLockouts)
      } catch (e) {}
    }

    async function fetchDashboardData() {
      try {
        setIsLoading(true)
        
        // Fetch shows count
        const { count: showsCount } = await supabase.from('shows').select('*', { count: 'exact', head: true })
        
        // Fetch materials with full relations for reminders
        const { data: materials, error } = await supabase.from('materials').select(`
          id,
          status,
          deadline,
          submitted_at,
          document_name,
          shows (
            id,
            venue_name,
            portal_url,
            artist ( name, email )
          )
        `)
        
        let awaitingCount = 0
        let deliveredCount = 0
        let lateCount = 0
        let overdueList: any[] = []
        let activityList: any[] = []
        
        const now = new Date()
        
        if (materials && !error) {
           materials.forEach(mat => {
             const showData = Array.isArray(mat.shows) ? mat.shows[0] : mat.shows
             const artistData = showData?.artist ? (Array.isArray(showData.artist) ? showData.artist[0] : showData.artist) : null
             
             const artistName = artistData?.name || 'Unknown Artist'
             const artistEmail = artistData?.email || ''
             const venueName = showData?.venue_name || 'Unknown Venue'
             const docName = mat.document_name || 'Document'
             const portalToken = showData?.id || ''
             
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
                   portalToken: portalToken,
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
        
        const formattedActivity = activityList.slice(0, 5).map(item => {
           const hours = Math.floor((now.getTime() - item.time.getTime()) / (1000 * 3600))
           let timeStr = `${hours} hours ago`
           if (hours < 1) timeStr = 'Just now'
           else if (hours >= 24) timeStr = `${Math.floor(hours / 24)} days ago`
           
           return { ...item, time: timeStr }
        })
        setRecentActivity(formattedActivity)
        
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchDashboardData()
  }, [])

  const handleSendReminder = async (item: any) => {
    if (lockouts[item.id]) return

    setIsSendingReminder(item.id)
    
    try {
      const payload = {
        material_id: item.id,
        artist_email: item.artistEmail,
        artist_name: item.artist,
        item_name: item.document,
        deadline: item.deadline,
        show_name: item.venue,
        portal_token: item.portalToken
      }

      const response = await fetch(REMINDER_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) throw new Error('Reminder failed')

      toast.success('Reminder Sent', {
        description: `Manual reminder for ${item.document} confirmation received.`
      })

      // Set 24h lockout
      const expiry = Date.now() + 24 * 60 * 60 * 1000
      const newLockouts = { ...lockouts, [item.id]: true }
      setLockouts(newLockouts)

      const savedLockouts = localStorage.getItem('reminder_lockouts')
      const parsed = savedLockouts ? JSON.parse(savedLockouts) : {}
      parsed[item.id] = expiry
      localStorage.setItem('reminder_lockouts', JSON.stringify(parsed))

    } catch (error) {
      toast.error('Failed to send reminder. Try again later.')
    } finally {
      setIsSendingReminder(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4 text-muted-foreground">
          <Music className="h-8 w-8 animate-bounce text-primary/50" />
          <p className="font-pro-data uppercase tracking-widest text-xs font-bold">Loading Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white">ShowReady Dashboard</h1>
          <p className="text-muted-foreground mt-2 font-medium">Welcome back. Here's where your shows stand today.</p>
        </div>
        <div className="flex gap-3">
          <Button 
             onClick={() => router.push('/artists')}
             className="h-12 px-8 bg-primary text-white hover:bg-primary/90 shadow-xl shadow-primary/20 font-pro-data tracking-widest uppercase text-xs rounded-xl"
          >
            Manage your shows
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="glass-card p-8 rounded-3xl flex flex-col justify-between group hover:border-primary/40 transition-all duration-500 bg-muted/5 relative overflow-hidden">
            <div className={`absolute -right-4 -top-4 p-8 opacity-5 group-hover:opacity-10 transition-opacity rotate-12 ${stat.color}`}>
                <stat.icon size={80} />
            </div>
            <div className="relative z-10 flex items-center justify-between">
              <div className={`p-3 rounded-2xl bg-muted/30 border border-white/5 ${stat.color} group-hover:bg-primary group-hover:text-white transition-all`}>
                  <stat.icon className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-8 relative z-10">
              <p className="text-[11px] font-pro-data uppercase tracking-widest text-muted-foreground font-bold">{stat.name}</p>
              <p className="text-4xl font-black mt-2 tracking-tight italic font-pro-data text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-10">
        {/* OVERDUE ALERT */}
        {overdueDocs.length > 0 && (
          <div className="glass-card rounded-3xl overflow-hidden border-red-500/20 shadow-2xl shadow-red-500/5">
            <div className="bg-red-500/10 border-b border-red-500/20 px-6 py-4 flex items-center gap-3">
              <AlertTriangle className="text-red-500 h-5 w-5" />
              <h3 className="text-red-500 font-bold uppercase font-pro-data tracking-widest text-sm">
                ⚠ {overdueDocs.length} documents are late
              </h3>
            </div>
            <div className="divide-y divide-white/5 bg-muted/5">
              {overdueDocs.map((item) => (
                <div key={item.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-6">
                    <div className="h-12 w-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-white text-lg tracking-tight">{item.artist}</p>
                      <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                        {item.venue} <span className="text-white/20">•</span> {item.document}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 justify-between sm:justify-end w-full sm:w-auto">
                    <span className="text-red-400 font-bold text-sm bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20">
                      {item.daysLate} days late
                    </span>
                    <Button 
                      variant="outline" 
                      onClick={() => handleSendReminder(item)}
                      disabled={isSendingReminder === item.id || lockouts[item.id]}
                      className="border-white/10 hover:bg-white/10 font-pro-data uppercase tracking-widest text-[10px] h-10 px-4 rounded-xl gap-2 min-w-[140px]"
                    >
                      {isSendingReminder === item.id ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                      {isSendingReminder === item.id ? 'Sending...' : (lockouts[item.id] ? 'Reminder Sent' : 'Send Reminder')}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RECENT ACTIVITY */}
        <div className="glass-card rounded-3xl overflow-hidden border-white/5 bg-muted/5">
          <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-muted/20">
            <div>
                <h3 className="text-xl font-black uppercase tracking-tighter italic">Recent Activity</h3>
                <p className="text-xs text-muted-foreground mt-1 font-medium">Last 5 document submissions</p>
            </div>
            <Link href="/shows" className="text-[10px] font-pro-data uppercase tracking-widest text-primary hover:underline flex items-center gap-2 font-bold">
              All Shows <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-6 hover:bg-white/[0.02] transition-colors group">
                  <div className="flex items-center gap-5">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 size={18} />
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">
                      <strong className="text-white">{activity.artist}</strong> submitted <strong className="text-white">[{activity.document}]</strong> for <strong className="text-white">[{activity.venue}]</strong>
                    </p>
                  </div>
                  <span className="text-[10px] font-pro-data uppercase tracking-widest text-muted-foreground/50 font-bold whitespace-nowrap ml-4">
                    {activity.time}
                  </span>
                </div>
              ))
            ) : (
                <div className="p-12 flex flex-col items-center justify-center text-center">
                    <FileText size={48} className="text-muted-foreground/30 mb-4" />
                    <p className="text-lg font-bold text-white tracking-tight">No documents submitted yet.</p>
                    <p className="text-sm text-muted-foreground mt-2 max-w-sm">Create your first show to get started.</p>
                    <Button onClick={() => router.push('/shows')} className="mt-6 bg-primary text-white hover:bg-primary/90 rounded-xl font-pro-data uppercase tracking-widest text-xs px-8 h-12">
                        Create Show
                    </Button>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
