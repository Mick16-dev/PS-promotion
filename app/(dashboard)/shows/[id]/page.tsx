'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { 
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  ExternalLink,
  Table,
  Plus,
  Trash2,
  FileText,
  Activity,
  Globe,
  Database,
  ChevronRight,
  Settings,
  Send,
  Loader2,
  Users,
  RefreshCw
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { 
  BentoPanel, 
  ArtistStatusAvatar, 
  TelemetryLine, 
  StatusPing,
  DataStream
} from '@/components/ui/bento-grid'
import { UniversalSyncModal } from '@/components/dashboard/universal-sync-modal'

export default function ShowDetailPage({ params }: any) {
  const router = useRouter()
  const [id, setId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showInfo, setShowInfo] = useState<any>(null)
  const [documents, setDocuments] = useState<any[]>([])
  const [allShows, setAllShows] = useState<any[]>([])
  const [isGoogleConnected, setIsGoogleConnected] = useState(false)
  const [isResendingEmail, setIsResendingEmail] = useState(false)
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false)
  
  // Resolve ID with max compatibility
  useEffect(() => {
    if (params && typeof params.then === 'function') {
      params.then((p: any) => setId(p.id))
    } else if (params?.id) {
      setId(params.id)
    }
  }, [params])

  useEffect(() => {
    if (!id) return
    async function loadData() {
      setIsLoading(true)
      try {
        const { data: show } = await supabase.from('shows').select('*').eq('id', id).single()
        if (show) {
          // If the show doesn't have the artist_email directly, fetch it from the artists table
          if (!show.artist_email && show.artist_id) {
            const { data: artist } = await supabase
              .from('artists')
              .select('email')
              .eq('id', show.artist_id)
              .maybeSingle()
            if (artist?.email) {
              show.artist_email = artist.email
            }
          }
          setShowInfo(show)
        }

        const { data: materials } = await supabase.from('materials').select('*').eq('show_id', id)
        setDocuments(materials || [])

        const { data: shows } = await supabase
          .from('shows')
          .select('id, artist_name, show_date, date, status')
          .limit(50)

        const normalizedShows = (shows || [])
          .map((s: any) => ({
            ...s,
            show_date: s.show_date ?? s.date ?? null,
          }))
          .sort((a: any, b: any) => {
            const aTime = Date.parse(a.show_date) || Number.POSITIVE_INFINITY
            const bTime = Date.parse(b.show_date) || Number.POSITIVE_INFINITY
            return aTime - bTime
          })
          .slice(0, 8)

        setAllShows(normalizedShows)

        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: integration } = await supabase.from('user_integrations').select('id').eq('user_id', user.id).eq('provider', 'google').maybeSingle()
          setIsGoogleConnected(!!integration)
        }
      } catch (err) {
        console.error('FETCH_ERROR:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [id])

  const handleResendEmail = async (documentName?: string) => {
    setIsResendingEmail(true)
    try {
      // Get a fresh Google access token (auto-refreshes if expired)
      let access_token: string | null = null
      try {
        const refreshRes = await fetch('/api/auth/google/refresh', { method: 'POST' })
        if (refreshRes.ok) {
          const refreshData = await refreshRes.json()
          access_token = refreshData.access_token ?? null
        }
      } catch { /* non-fatal */ }

      const payload = {
        showId: id,
        access_token,
        artist_name: showInfo?.artist_name,
        artist_email: String(showInfo?.artist_email || showInfo?.email || '').trim(),
        portal_url: showInfo?.portal_url || `${process.env.NEXT_PUBLIC_ARTIST_PORTAL_URL || 'https://sr-artist-portal-live.vercel.app'}/?token=${showInfo?.portal_token || id}`,
        venue_name: showInfo?.venue_name,
        show_date: showInfo?.show_date,
        remind_document: documentName
      }

      if (!payload.artist_email) {
        toast.error('Missing Email', { description: 'Please update the artist with an email address.' })
        setIsResendingEmail(false)
        return
      }

      const response = await fetch('/api/n8n/resend-email', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload) 
      })

      if (!response.ok) throw new Error('Send failed')
      toast.success(documentName ? `Reminder for ${documentName} sent` : 'Portal link sent to artist')
    } catch (err) { 
      toast.error('Failed to send', { description: 'Check your Google connection in Settings.' }) 
    } finally { 
      setIsResendingEmail(false) 
    }
  }

  if (isLoading || !id) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 size={32} className="animate-spin text-primary" />
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Initializing Workspace...</p>
    </div>
  )
  
  if (!showInfo) return <div className="text-center py-20 text-white">Show not found</div>

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-700">
      
      {/* LEFT COLUMN: Main Dashboard (8 cols) */}
      <div className="lg:col-span-9 space-y-6">
        
        {/* ROW 1: COMMAND CENTER */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BentoPanel className="md:col-span-2 min-h-[240px] flex flex-col justify-between p-8 relative overflow-hidden" title="Active Production" icon={Activity}>
             <AnimatePresence>
                {isResendingEmail && (
                   <div className="absolute inset-0 z-0 pointer-events-none">
                      <DataStream color="var(--primary)" />
                   </div>
                )}
             </AnimatePresence>
             
             <div className="space-y-2 relative z-10">
                <div className="flex items-center gap-3 mb-2">
                   <StatusPing variant="teal" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-primary">Live Data Feed</span>
                </div>
                <h1 className="text-5xl md:text-6xl text-title-elegant text-white">{showInfo.artist_name}</h1>
                <div className="flex items-center gap-6 text-muted-foreground/60 text-xs font-bold mt-4">
                   <span className="flex items-center gap-2"><Calendar size={14} className="text-primary" /> {new Date(showInfo.show_date).toLocaleDateString()}</span>
                   <span className="flex items-center gap-2"><MapPin size={14} className="text-primary" /> {showInfo.city}</span>
                </div>
             </div>
             
             <div className="grid grid-cols-2 gap-8 mt-8 pt-6 border-t border-white/[0.03]">
                <TelemetryLine label="Venue" value={showInfo.venue_name} mono={false} />
                <TelemetryLine label="Portal Token" value={showInfo.portal_token?.substring(0, 12) || id.substring(0, 12)} />
             </div>
          </BentoPanel>

          <BentoPanel className="flex flex-col justify-between" title="Connected Apps" icon={Globe}>
             <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-surface-base border border-white/[0.03]">
                   <div className="flex items-center gap-3">
                      <Table size={16} className="text-[#0F9D58]" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Google Sheets</span>
                   </div>
                   <StatusPing variant={isGoogleConnected ? 'healthy' : 'critical'} />
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-surface-base border border-white/[0.03]">
                   <div className="flex items-center gap-3">
                      <Calendar size={16} className="text-[#4285F4]" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">G-Calendar</span>
                   </div>
                   <StatusPing variant={isGoogleConnected ? 'healthy' : 'critical'} />
                </div>
             </div>

             <button 
                onClick={() => setIsSyncModalOpen(true)}
                className="w-full mt-2 h-12 bg-surface-elevated border border-white/[0.05] hover:border-primary/50 text-white font-black uppercase text-[10px] px-6 rounded-xl transition-all flex items-center justify-center gap-2"
             >
                <Table size={14} className="text-[#0F9D58]" />
                Universal Export
             </button>
          </BentoPanel>
        </div>

        {/* ROW 2: WORKFLOW & ACTIVITY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Artist Document Tracker */}
          <BentoPanel title="Artist Workflow" icon={Users}>
             <div className="space-y-6 mt-2">
                <div className="flex items-center gap-6 p-4 rounded-2xl bg-surface-base/50 border border-white/[0.02]">
                   <ArtistStatusAvatar 
                      fallback={showInfo.artist_name} 
                      status={{
                         contract: !!showInfo.deal_guarantee, // Proxy for logic
                         rider: documents.some(d => d.item_name?.toLowerCase().includes('rider')),
                         presskit: documents.some(d => d.item_name?.toLowerCase().includes('press'))
                      }}
                   />
                   <div className="flex-1">
                      <h4 className="text-lg font-bold text-white leading-tight">{showInfo.artist_name}</h4>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mt-1">Lead Artist</p>
                      
                      <div className="grid grid-cols-3 gap-2 mt-4">
                         <div className="h-1 rounded-full bg-primary" />
                         <div className={cn("h-1 rounded-full", documents.length > 0 ? "bg-primary" : "bg-white/5")} />
                         <div className="h-1 rounded-full bg-white/5" />
                      </div>
                   </div>
                </div>

                <div className="space-y-2 pt-2">
                   <TelemetryLine label="Load In" value={showInfo.load_in_time || '16:00'} />
                   <TelemetryLine label="Soundcheck" value={showInfo.soundcheck_time || '17:30'} />
                   <TelemetryLine label="Show Time" value={showInfo.show_time || '21:00'} />
                </div>
             </div>
          </BentoPanel>

          {/* Documents & Portal */}
          <BentoPanel title="Documents & Portal" icon={FileText}>
             <div className="space-y-4 max-h-[200px] overflow-y-auto no-scrollbar pr-2">
                {(() => {
                  const ALL_DOCS = [
                    { id: 'epk', label: 'EPK' },
                    { id: 'bio', label: 'Biography' },
                    { id: 'photos', label: 'Hi-Res Photos' },
                    { id: 'rider', label: 'Tech Rider' },
                    { id: 'contract', label: 'Contract' },
                  ]
                  const requiredDocIds = showInfo?.required_documents ? Object.keys(showInfo.required_documents) : ALL_DOCS.map(d => d.id)
                  const displayDocs = ALL_DOCS.filter(d => requiredDocIds.includes(d.id))

                  return displayDocs.map((doc) => {
                    const isUploaded = documents.some(d => 
                      d.item_name?.toLowerCase().includes(doc.id) || 
                      d.item_name?.toLowerCase().includes(doc.label.toLowerCase()) ||
                      d.item_type?.toLowerCase().includes(doc.id)
                    )

                    return (
                       <div key={doc.id} className="flex gap-4 items-center justify-between pb-4 border-b border-white/[0.03] last:border-0">
                          <div className="flex items-center gap-4">
                             <div className={cn("h-8 w-8 shrink-0 rounded-lg flex items-center justify-center", isUploaded ? "bg-emerald-500/10" : "bg-white/5")}>
                                <FileText size={14} className={isUploaded ? "text-emerald-500" : "text-muted-foreground"} />
                             </div>
                             <div>
                                <p className="text-xs font-bold text-white leading-snug">{doc.label}</p>
                                <div className="flex items-center gap-2 mt-1">
                                   <span className={cn("text-[8px] font-black uppercase tracking-widest", isUploaded ? "text-emerald-500" : "text-amber-500")}>
                                      {isUploaded ? 'Delivered' : 'Pending'}
                                   </span>
                                </div>
                             </div>
                          </div>
                          
                          {!isUploaded && (
                             <button 
                                onClick={(e) => { e.preventDefault(); handleResendEmail(doc.label); }}
                                disabled={isResendingEmail}
                                className="h-8 px-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[9px] font-bold uppercase tracking-widest rounded-lg transition-all flex items-center gap-1.5"
                             >
                                <Send size={10} /> Remind
                             </button>
                          )}
                       </div>
                    )
                  })
                })()}
             </div>
             <button 
                onClick={(e) => { e.preventDefault(); handleResendEmail(); }}
                disabled={isResendingEmail}
                className="w-full mt-4 h-12 bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
             >
                {isResendingEmail ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                Resend Portal Link
             </button>
          </BentoPanel>
        </div>

        {/* ROW 3: FINANCIALS QUICK VIEW */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <div className="bg-surface-elevated border-tactical rounded-2xl p-6 flex flex-col justify-between">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Guarantee</span>
              <p className="text-2xl text-raw-data text-white mt-4">${showInfo.deal_guarantee?.toLocaleString() || '0'}</p>
           </div>
           <div className="bg-surface-elevated border-tactical rounded-2xl p-6 flex flex-col justify-between">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Expenses</span>
              <p className="text-2xl text-raw-data text-white mt-4">${showInfo.total_expenses?.toLocaleString() || '0'}</p>
           </div>
           <div className="bg-surface-elevated border-tactical rounded-2xl p-6 flex flex-col justify-between">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Sold</span>
              <p className="text-2xl text-raw-data text-white mt-4">{showInfo.total_tickets_sold || '0'}</p>
           </div>
           <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex flex-col justify-between group cursor-pointer hover:bg-primary/10 transition-all">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Full Breakdown</span>
              <div className="flex items-center justify-between mt-4">
                 <p className="text-lg font-bold text-white uppercase italic tracking-tighter">Financials</p>
                 <ChevronRight size={18} className="text-primary" />
              </div>
           </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Your Shows Navigator (3 cols) */}
      <div className="lg:col-span-3">
         <BentoPanel className="h-full min-h-[600px] flex flex-col" title="Your Shows" icon={Calendar}>
            <div className="space-y-2 mt-4">
               {allShows.map((s) => (
                  <div 
                     key={s.id} 
                     onClick={() => router.push(`/shows/${s.id}`)}
                     className={cn(
                        "p-4 rounded-xl border border-transparent transition-all cursor-pointer group flex items-center justify-between",
                        s.id === id ? "bg-primary/10 border-primary/20" : "hover:bg-white/[0.03]"
                     )}
                  >
                     <div className="overflow-hidden">
                        <p className={cn(
                           "text-xs font-bold uppercase tracking-tight truncate transition-colors",
                           s.id === id ? "text-primary" : "text-white group-hover:text-primary"
                        )}>{s.artist_name}</p>
                        <p className="text-[9px] font-bold text-muted-foreground/40 uppercase mt-1">
                           {new Date(s.show_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </p>
                     </div>
                     <div className={cn(
                        "h-1.5 w-1.5 rounded-full transition-all",
                        s.id === id ? "bg-primary shadow-[0_0_8px_rgba(20,184,166,1)]" : "bg-white/10"
                     )} />
                  </div>
               ))}
            </div>
            
            <button className="w-full mt-auto pt-6 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-white transition-colors">
               <Plus size={14} /> View Archive
            </button>
         </BentoPanel>
      </div>

      <UniversalSyncModal 
        isOpen={isSyncModalOpen} 
        onClose={() => setIsSyncModalOpen(false)} 
        selectedShowIds={id ? [id] : []}
      />
    </div>
  )
}
