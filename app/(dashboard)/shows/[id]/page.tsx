'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { 
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Clock3,
  ExternalLink,
  Copy,
  Mail,
  Download,
  Eye,
  Send,
  AlertTriangle,
  Music,
  Loader2,
  FileSearch,
  LayoutGrid,
  ShieldCheck,
  Utensils,
  Image as ImageIcon,
  Map as MapIcon,
  CheckCircle,
  ShieldAlert,
  DollarSign,
  TrendingUp,
  Activity,
  PieChart,
  RefreshCw,
  User,
  ArrowUpRight,
  Paperclip,
  MoreVertical,
  Plus,
  Table,
  Zap,
  Save,
  Ticket,
  ChevronRight,
  Search,
  Lock,
  ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'

export default function ShowDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params)
  const id = resolvedParams.id
  
  const [isSendingReminder, setIsSendingReminder] = useState<string | null>(null)
  const [isResendingEmail, setIsResendingEmail] = useState(false)
  const [activeTab, setActiveTab] = useState('itinerary')
  const [isLoading, setIsLoading] = useState(true)
  const [showInfo, setShowInfo] = useState<any>(null)
  const [documents, setDocuments] = useState<any[]>([])
  const [isGoogleConnected, setIsGoogleConnected] = useState(false)
  const [isGeneratingSheet, setIsGeneratingSheet] = useState(false)
  const [mapping, setMapping] = useState<any[]>([
    { id: '1', field: 'artist_name', header: 'Artist' },
    { id: '2', field: 'show_date', header: 'Date' },
    { id: '3', field: 'venue_name', header: 'Venue' },
    { id: '4', field: 'city', header: 'City' },
    { id: '5', field: 'show_time', header: 'Show Time' },
    { id: '6', field: 'deal_guarantee', header: 'Fee' }
  ])

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        const { data: show, error: showErr } = await supabase
          .from('shows')
          .select('*')
          .eq('id', id)
          .single()
        
        if (showErr) throw showErr
        setShowInfo(show)
        if (show.export_mapping && Array.isArray(show.export_mapping)) {
          setMapping(show.export_mapping)
        }

        const { data: materials, error: matErr } = await supabase
          .from('materials')
          .select('*')
          .eq('show_id', id)
        
        if (matErr) throw matErr
        setDocuments(materials || [])

        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: integration } = await supabase
            .from('user_integrations')
            .select('*')
            .eq('user_id', user.id)
            .eq('provider', 'google')
            .maybeSingle()
          
          if (integration) setIsGoogleConnected(true)
        }
      } catch (err) {
        console.error('FETCH_ERROR:', err)
        toast.error('Failed to load show details')
      } finally {
        setIsLoading(false)
      }
    }

    if (id) loadData()
  }, [id])

  const handleGenerateSheet = async () => {
    if (!isGoogleConnected) {
      toast.error('Google account not connected.', { description: 'Please go to Settings > Integrations first.' })
      return
    }
    setIsGeneratingSheet(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const response = await fetch('/api/n8n/universal-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user?.id, mode: 'create_new_sheet', mapping, shows: [showInfo] })
      })
      const result = await response.json()
      if (result.success && result.spreadsheet_url) {
        await supabase.from('shows').update({ google_sheet_url: result.spreadsheet_url, export_mapping: mapping }).eq('id', id)
        setShowInfo({ ...showInfo, google_sheet_url: result.spreadsheet_url })
        toast.success('Spreadsheet generated!')
      } else throw new Error(result.error || 'Failed')
    } catch (e: any) { toast.error('Sync failed: ' + e.message) } finally { setIsGeneratingSheet(false) }
  }

  const handleDownloadCSV = () => {
    try {
      const headers = mapping.map(m => m.header)
      const row = mapping.map(m => {
        if (m.field === 'custom') return `"${(m.value || '').toString().replace(/"/g, '""')}"`
        let val = showInfo[m.field]
        if (m.field === 'show_date' && val) val = new Date(val).toLocaleDateString()
        return `"${(val || '').toString().replace(/"/g, '""')}"`
      })
      const csvContent = [headers.map(h => `"${(h as string).replace(/"/g, '""')}"`).join(','), row.join(',')].join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `Export_${showInfo.artist_name}.csv`
      link.click()
      toast.success('CSV Downloaded!')
    } catch (e: any) { toast.error('Download failed') }
  }

  const addCustomColumn = () => {
    const newCol = {
      id: Math.random().toString(36).substr(2, 9),
      field: 'custom',
      header: 'New Column',
      value: ''
    }
    setMapping([...mapping, newCol])
    toast.success('Custom column added!')
  }

  const removeColumn = (id: string) => {
    setMapping(mapping.filter(m => m.id !== id))
  }

  const updateMapping = (id: string, updates: any) => {
    setMapping(mapping.map(m => m.id === id ? { ...m, ...updates } : m))
  }

  const handleViewDocument = async (doc: any) => {
    if (!doc.file_path) {
      toast.error('No file path found for this document')
      return
    }
    try {
      const { data, error } = await supabase.storage
        .from('materials')
        .createSignedUrl(doc.file_path, 3600)
      
      if (error) throw error
      window.open(data.signedUrl, '_blank')
    } catch (err: any) {
      toast.error('Could not open file: ' + err.message)
    }
  }

  const handleCopyLink = () => {
    const portalUrl = showInfo?.portal_url || `https://sr-artist-portal-live.vercel.app/portal/${showInfo?.portal_token || id}`
    navigator.clipboard.writeText(portalUrl)
    toast.success('Copied to clipboard!')
  }

  const handleResendEmail = async () => {
    setIsResendingEmail(true)
    try {
      await fetch('/api/n8n/resend-email', { method: 'POST', body: JSON.stringify({ showId: id }) })
      toast.success('Email re-sent')
    } catch (err) { toast.error('Failed') } finally { setIsResendingEmail(false) }
  }

  const handleReminder = async (doc: any) => {
    setIsSendingReminder(doc.id)
    try {
      await fetch('/api/n8n/send-reminder', { method: 'POST', body: JSON.stringify({ materialId: doc.id }) })
      toast.success('Reminder sent')
    } catch (err) { toast.error('Failed') } finally { setIsSendingReminder(null) }
  }

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 size={40} className="animate-spin text-primary" />
      <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">Initializing production workspace...</p>
    </div>
  )

  if (!showInfo) return <div className="text-center py-20">Show not found</div>

  const relStatus = (showInfo.artist_reliability || 100) >= 80 ? { label: 'Trusted', color: 'text-emerald-400', bg: 'bg-emerald-500/10' } :
                   (showInfo.artist_reliability || 100) >= 50 ? { label: 'Average', color: 'text-amber-500', bg: 'bg-amber-500/10' } :
                   { label: 'Unreliable', color: 'text-red-500', bg: 'bg-red-500/10' }

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="space-y-6">
        <Link href="/shows" className="inline-flex items-center gap-2 text-sm text-muted-foreground/60 hover:text-white transition-colors font-bold group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> All Shows
        </Link>
        
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge className="bg-primary/10 text-primary border-primary/20 font-black tracking-widest text-[10px] py-1 px-4 rounded-full uppercase">
                {showInfo.status || 'Active Production'}
              </Badge>
              <span className="text-muted-foreground/40 font-bold text-xs uppercase tracking-widest">Show ID: {id?.slice(0, 8)}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic text-white leading-none">
              {showInfo.artist_name}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground font-bold">
              <span className="flex items-center gap-2"><Calendar size={18} className="text-primary" /> {new Date(showInfo.show_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span className="flex items-center gap-2"><MapPin size={18} className="text-primary" /> {showInfo.venue_name}, {showInfo.city}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="h-14 border-white/10 bg-white/5 hover:bg-white/10 gap-3 px-8 rounded-2xl text-xs font-black uppercase tracking-widest transition-all" onClick={() => window.location.href = `/shows/${id}/edit`}>
              Edit Show
            </Button>
            <Button className="h-14 bg-white hover:bg-zinc-200 text-black shadow-xl shadow-white/5 gap-3 px-8 rounded-2xl text-xs font-black uppercase tracking-widest transition-all">
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex items-center gap-1 bg-zinc-900/50 p-1 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar">
        {[
          { id: 'itinerary', name: 'Itinerary' },
          { id: 'financials', name: 'Financials' },
          { id: 'tech', name: 'Tech & Logistics' },
          { id: 'documents', name: 'Documents' },
          { id: 'sync', name: 'Sync & Spreadsheet', icon: Table }
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === tab.id ? 'bg-white text-black shadow-lg shadow-white/10' : 'text-muted-foreground hover:text-white'}`}
          >
            {tab.icon && <tab.icon size={14} className={activeTab === tab.id ? 'text-[#0F9D58]' : 'text-primary'} />}
            {tab.name}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ITINERARY TAB */}
        {activeTab === 'itinerary' && (
          <motion.div key="itinerary" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-10">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-[2.5rem] space-y-4 shadow-2xl">
                     <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                       <Clock size={16} /> Production Schedule
                     </h3>
                     <div className="space-y-4 pt-4">
                        {[
                          { label: 'Load In', time: showInfo.load_in_time },
                          { label: 'Soundcheck', time: showInfo.soundcheck_time },
                          { label: 'Doors Open', time: showInfo.doors_time },
                          { label: 'Show Starts', time: showInfo.show_time },
                          { label: 'Curfew', time: showInfo.show_end_time }
                        ].map((item, i) => (
                          <div key={i} className="flex items-center justify-between group border-b border-white/5 pb-3 last:border-0">
                            <span className="text-sm font-bold text-muted-foreground/60">{item.label}</span>
                            <span className="text-xl font-black text-white group-hover:text-primary transition-colors italic leading-none">{item.time || 'TBD'}</span>
                          </div>
                        ))}
                     </div>
                  </div>
                  
                  <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-[2.5rem] space-y-4 shadow-2xl">
                     <h3 className="text-xs font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                       <Activity size={16} /> Portal Real-time
                     </h3>
                     <div className="space-y-6 pt-6">
                        <div className="flex flex-col gap-2">
                           <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Artist Status</span>
                           <div className="flex items-center gap-3">
                             <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                             <span className="text-lg font-black text-white uppercase tracking-tighter italic">Artist Connected</span>
                           </div>
                        </div>
                        <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                           <p className="text-xs text-emerald-400/80 font-bold leading-relaxed italic">
                             "Automated monitoring is active. All document timestamps are being recorded against production deadlines."
                           </p>
                        </div>
                     </div>
                  </div>
               </div>

               {/* PERSONNEL SECTION */}
               <div className="bg-zinc-900/30 border border-white/5 p-10 rounded-[3rem] space-y-8">
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-3">
                    <User size={18} className="text-primary" /> On-Site Personnel
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="bg-white/5 p-6 rounded-2xl space-y-1">
                        <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">Musicians</span>
                        <p className="text-3xl font-black italic text-white">{showInfo.musicians || '0'}</p>
                     </div>
                     <div className="bg-white/5 p-6 rounded-2xl space-y-1">
                        <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">Presenter</span>
                        <p className="text-xl font-black italic text-white truncate">{showInfo.host || 'Not Set'}</p>
                     </div>
                     <div className="bg-white/5 p-6 rounded-2xl space-y-1">
                        <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">Changeover</span>
                        <p className="text-3xl font-black italic text-white">{showInfo.changeover_time || '--'}</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* SIDEBAR - PORTAL */}
            <div className="lg:col-span-4 space-y-8">
              <div className="glass-card rounded-[2.5rem] p-10 border-white/5 bg-muted/10 space-y-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5">
                   <ExternalLink size={120} />
                </div>
                <div className="relative z-10">
                  <h3 className="text-xl font-black uppercase tracking-tighter italic text-white flex items-center gap-4">
                    <ExternalLink size={24} className="text-primary" /> Artist Portal
                  </h3>
                  <p className="text-sm text-muted-foreground mt-3 font-medium leading-relaxed">Encrypted transmission link for technical material and itineraries.</p>
                </div>
                <div className="space-y-4 relative z-10">
                  <div className="p-5 rounded-2xl bg-black/60 border border-white/10 overflow-hidden group hover:border-primary/50 transition-colors">
                    <p className="text-xs font-mono text-muted-foreground/60 truncate group-hover:text-white select-all">
                       {showInfo?.portal_url || `https://sr-artist-portal-live.vercel.app/portal/${showInfo?.portal_token || id}`}
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <Button variant="outline" className="flex-1 border-white/10 h-14 rounded-2xl text-xs font-black uppercase tracking-widest bg-white/5" onClick={handleCopyLink}>
                       <Copy size={18} className="mr-2" /> Copy
                    </Button>
                    <Button className="flex-1 bg-primary text-white shadow-lg shadow-primary/20 h-14 rounded-2xl text-xs font-black uppercase tracking-widest" onClick={handleResendEmail} disabled={isResendingEmail}>
                       {isResendingEmail ? <Loader2 size={18} className="animate-spin" /> : <Mail size={18} className="mr-2" />} {isResendingEmail ? 'Sending...' : 'Resend'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* RELIABILITY */}
              <div className="glass-card rounded-[2.5rem] p-10 border-white/5 bg-muted/10 space-y-6 shadow-2xl relative overflow-hidden">
                 <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Artist Reliability</h3>
                 <div className="flex items-baseline gap-3">
                    <span className="text-6xl font-black italic text-white font-pro-data">{showInfo.artist_reliability || 100}</span>
                    <span className="text-xs font-black text-muted-foreground/40 uppercase">/ 100</span>
                 </div>
                 <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${showInfo.artist_reliability || 100}%` }} />
                 </div>
                 <Badge variant="outline" className={`${relStatus.bg} ${relStatus.color} uppercase tracking-[0.2em] text-[9px] font-black py-1.5 px-4 rounded-lg`}>
                    {relStatus.label}
                 </Badge>
              </div>
            </div>
          </motion.div>
        )}

        {/* FINANCIALS TAB */}
        {activeTab === 'financials' && (
          <motion.div key="financials" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-10">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-zinc-900/50 border border-white/5 p-10 rounded-[3rem] space-y-6">
                   <h3 className="text-xs font-black uppercase tracking-widest text-primary">Primary Deal</h3>
                   <div className="space-y-1">
                      <span className="text-5xl font-black italic text-white font-pro-data">${showInfo.deal_guarantee?.toLocaleString() || '0'}</span>
                      <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">Guaranteed Artist Fee</p>
                   </div>
                   <div className="pt-4 border-t border-white/5">
                      <p className="text-sm text-muted-foreground font-medium italic">Deal Structure: {showInfo.deal_type || 'Guarantee vs 85% Backend'}</p>
                   </div>
                </div>

                <div className="bg-zinc-900/50 border border-white/5 p-10 rounded-[3rem] space-y-6">
                   <h3 className="text-xs font-black uppercase tracking-widest text-amber-500">Expenses</h3>
                   <div className="space-y-1">
                      <span className="text-5xl font-black italic text-white font-pro-data">${showInfo.total_expenses?.toLocaleString() || '0'}</span>
                      <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">Estimated Production Costs</p>
                   </div>
                   <div className="h-1.5 w-full bg-black/40 rounded-full mt-4">
                      <div className="h-full bg-amber-500/40 w-1/3" />
                   </div>
                </div>

                <div className="bg-zinc-900/50 border border-white/5 p-10 rounded-[3rem] space-y-6">
                   <h3 className="text-xs font-black uppercase tracking-widest text-emerald-500">Tickets Sold</h3>
                   <div className="space-y-1">
                      <span className="text-5xl font-black italic text-white font-pro-data">{showInfo.total_tickets_sold || '0'}</span>
                      <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">Capacity Tracking (Real-time)</p>
                   </div>
                   <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-black tracking-widest uppercase text-[9px]">Break-even Point reached</Badge>
                </div>
             </div>

             {/* TICKET TIERS GRID */}
             <div className="bg-zinc-900/30 border border-white/5 p-10 rounded-[3rem] space-y-8">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white flex items-center gap-3">
                   <Ticket size={20} className="text-primary" /> Revenue Breakdown (Tiers)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                   {(showInfo.tickets_tiers || [
                     { name: 'General Admission', price: 45, sold: 120 },
                     { name: 'VIP Package', price: 120, sold: 45 },
                     { name: 'Early Bird', price: 35, sold: 200 }
                   ]).map((tier: any, i: number) => (
                     <div key={i} className="bg-white/5 p-6 rounded-2xl space-y-3">
                        <div className="flex justify-between items-start">
                           <span className="text-[10px] font-bold text-muted-foreground uppercase">{tier.name}</span>
                           <span className="text-xs font-black text-emerald-400">${tier.price}</span>
                        </div>
                        <p className="text-2xl font-black text-white italic">{tier.sold} <span className="text-[10px] text-muted-foreground/40 not-italic uppercase font-bold">Sold</span></p>
                     </div>
                   ))}
                </div>
             </div>
          </motion.div>
        )}

        {/* TECH & LOGISTICS TAB */}
        {activeTab === 'tech' && (
          <motion.div key="tech" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
             <div className="lg:col-span-8 space-y-8">
                <div className="bg-zinc-900/50 border border-white/5 p-10 rounded-[3rem] space-y-6">
                   <h3 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-3">
                      <ShieldCheck size={20} /> Technical Requirements
                   </h3>
                   <div className="bg-black/40 p-8 rounded-3xl border border-white/5 min-h-[200px]">
                      {showInfo.tech_notes ? (
                        <p className="text-lg text-white font-medium leading-relaxed italic">"{showInfo.tech_notes}"</p>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">No specific technical notes have been recorded for this production.</p>
                      )}
                   </div>
                </div>

                <div className="bg-zinc-900/50 border border-white/5 p-10 rounded-[3rem] space-y-6">
                   <h3 className="text-sm font-black uppercase tracking-widest text-emerald-400 flex items-center gap-3">
                      <Utensils size={20} /> Hospitality & Catering
                   </h3>
                   <div className="bg-black/40 p-8 rounded-3xl border border-white/5">
                      {showInfo.catering ? (
                        <p className="text-lg text-white font-medium leading-relaxed italic">"{showInfo.catering}"</p>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">Catering details not yet confirmed.</p>
                      )}
                   </div>
                </div>
             </div>

             <div className="lg:col-span-4 space-y-8">
                <div className="bg-zinc-900/50 border border-white/5 p-10 rounded-[3rem] space-y-8">
                   <h3 className="text-sm font-black uppercase tracking-widest text-white">Production Assets</h3>
                   <div className="space-y-4">
                      {showInfo.epk_link && (
                        <Button variant="outline" className="w-full h-16 rounded-2xl bg-white/5 border-white/10 hover:bg-white/10 justify-between group px-6" onClick={() => window.open(showInfo.epk_link, '_blank')}>
                           <span className="flex items-center gap-3 font-bold text-sm"><ExternalLink size={18} className="text-primary" /> Artist Website</span>
                           <ArrowUpRight size={16} className="text-muted-foreground group-hover:text-white" />
                        </Button>
                      )}
                      {showInfo.stageplot_link && (
                        <Button variant="outline" className="w-full h-16 rounded-2xl bg-white/5 border-white/10 hover:bg-white/10 justify-between group px-6" onClick={() => window.open(showInfo.stageplot_link, '_blank')}>
                           <span className="flex items-center gap-3 font-bold text-sm"><ImageIcon size={18} className="text-primary" /> Stageplot / Tech</span>
                           <ArrowUpRight size={16} className="text-muted-foreground group-hover:text-white" />
                        </Button>
                      )}
                      {!showInfo.epk_link && !showInfo.stageplot_link && (
                        <div className="p-10 border border-dashed border-white/10 rounded-3xl text-center">
                           <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">No assets attached</p>
                        </div>
                      )}
                   </div>
                </div>
             </div>
          </motion.div>
        )}

        {/* DOCUMENTS TAB */}
        {activeTab === 'documents' && (
          <motion.div key="documents" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-10">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {documents.map((doc) => (
                  <div key={doc.id} className="bg-zinc-900/50 border border-white/5 p-10 rounded-[3rem] space-y-8 relative overflow-hidden group hover:border-primary/50 transition-all shadow-2xl">
                    <div className="flex items-start justify-between relative z-10">
                      <div className={`p-5 rounded-2xl bg-white/5 border border-white/10 ${doc.hasFile ? 'text-emerald-400 border-emerald-500/30' : 'text-primary border-primary/20'}`}>
                        <FileSearch size={28} />
                      </div>
                      <Badge variant="outline" className={`font-black uppercase tracking-[0.2em] text-[9px] py-2 px-4 rounded-xl ${doc.hasFile ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/5 text-muted-foreground/60'}`}>
                        {doc.hasFile ? '✅ Received' : '⏳ Pending'}
                      </Badge>
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-2xl font-black italic text-white mb-2">{doc.name}</h3>
                      <p className="text-xs text-muted-foreground/60 font-medium leading-relaxed">Required transmission for the production folder.</p>
                    </div>
                    <div className="flex gap-4 relative z-10">
                      {doc.hasFile ? (
                        <Button className="flex-1 bg-destructive hover:bg-destructive/90 text-white h-14 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-destructive/20" onClick={() => handleViewDocument(doc)}>
                          <Eye size={18} className="mr-2" /> View File
                        </Button>
                      ) : (
                        <Button variant="outline" className="flex-1 border-white/20 hover:bg-white/10 h-14 rounded-2xl text-xs font-black uppercase tracking-widest" onClick={() => handleReminder(doc)} disabled={isSendingReminder === doc.id}>
                          {isSendingReminder === doc.id ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="mr-2" />} {isSendingReminder === doc.id ? 'Sending...' : 'Remind'}
                        </Button>
                      )}
                    </div>
                    <div className="absolute -right-8 -bottom-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                       <FileSearch size={180} />
                    </div>
                  </div>
                ))}
             </div>
          </motion.div>
        )}

        {/* SYNC TAB */}
        {activeTab === 'sync' && (
          <motion.div key="sync" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
             <div className="lg:col-span-8 bg-zinc-900/50 border border-white/5 p-10 rounded-[3rem] space-y-8 shadow-2xl">
                <div className="flex items-center justify-between">
                   <div className="space-y-1">
                      <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">Spreadsheet Mapping</h3>
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Customize your export dialect</p>
                   </div>
                   <div className="flex items-center gap-3">
                      <Button onClick={addCustomColumn} variant="outline" className="h-10 border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 text-[10px] font-black uppercase tracking-widest rounded-xl px-4">
                         <Plus size={14} className="mr-2" /> Add Column
                      </Button>
                      {isGoogleConnected ? <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 gap-2"><CheckCircle size={12} /> Connected</Badge> : <Badge variant="outline" className="text-amber-500 border-amber-500/20"><ShieldAlert size={12} /> Offline</Badge>}
                   </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {mapping.map((m) => (
                    <div key={m.id} className="bg-black/40 border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-6 group hover:border-white/20 transition-all">
                       <div className="flex-1 space-y-2 w-full">
                          <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 ml-2">Internal Field</Label>
                          <div className="bg-white/5 h-12 rounded-xl px-4 flex items-center text-xs font-bold text-white/60 border border-white/5">
                             {m.field === 'custom' ? 'Custom Column' : m.field.replace(/_/g, ' ')}
                          </div>
                       </div>
                       
                       <ArrowRight size={16} className="text-muted-foreground/20 hidden md:block" />

                       <div className="flex-[2] space-y-2 w-full">
                          <Label className="text-[9px] font-black uppercase tracking-widest text-primary ml-2">Spreadsheet Header</Label>
                          <Input 
                            value={m.header} 
                            onChange={(e) => updateMapping(m.id, { header: e.target.value })} 
                            className="bg-white/5 border-white/10 h-12 rounded-xl px-5 text-sm font-black italic text-white" 
                          />
                       </div>

                       {m.field === 'custom' && (
                         <div className="flex-1 space-y-2 w-full">
                            <Label className="text-[9px] font-black uppercase tracking-widest text-emerald-500 ml-2">Default Value</Label>
                            <Input 
                              value={m.value || ''} 
                              placeholder="e.g. TBD"
                              onChange={(e) => updateMapping(m.id, { value: e.target.value })} 
                              className="bg-white/5 border-white/10 h-12 rounded-xl px-5 text-sm font-bold text-emerald-400" 
                            />
                         </div>
                       )}

                       <Button 
                         variant="ghost" 
                         size="icon" 
                         onClick={() => removeColumn(m.id)}
                         className="h-12 w-12 rounded-xl text-muted-foreground/20 hover:text-red-500 hover:bg-red-500/10 self-end md:self-center"
                       >
                          <Trash2 size={18} />
                       </Button>
                    </div>
                  ))}
                </div>
             </div>

             <div className="lg:col-span-4 bg-white/5 border border-white/10 rounded-[3rem] p-10 text-center space-y-8 shadow-2xl">
                <div className="h-24 w-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center mx-auto text-[#0F9D58] shadow-inner"><Table size={48} /></div>
                <h4 className="text-2xl font-black italic uppercase text-white">Magic Export</h4>
                <p className="text-xs text-muted-foreground font-medium px-4 leading-relaxed">Automatically generate a production-ready Google Sheet for this show.</p>
                {showInfo?.google_sheet_url ? (
                  <div className="space-y-4">
                    <Button onClick={() => window.open(showInfo.google_sheet_url, '_blank')} className="w-full bg-[#0F9D58] hover:bg-[#0F9D58]/90 text-white h-16 rounded-2xl font-black italic uppercase shadow-2xl shadow-[#0F9D58]/20">Open Spreadsheet</Button>
                    <Button variant="outline" disabled={isGeneratingSheet} onClick={handleGenerateSheet} className="w-full border-white/10 h-14 rounded-2xl text-xs font-black uppercase">{isGeneratingSheet ? <RefreshCw className="animate-spin" size={18} /> : <RefreshCw size={18} className="mr-2" />} Sync Latest Data</Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <Button disabled={isGeneratingSheet || !isGoogleConnected} onClick={handleGenerateSheet} className="w-full bg-white hover:bg-zinc-200 text-black h-16 rounded-2xl font-black italic uppercase shadow-2xl shadow-white/10 disabled:opacity-50">
                      {isGeneratingSheet ? <Loader2 className="animate-spin mr-2" /> : "Generate Google Sheet"}
                    </Button>
                    <div className="relative"><div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5"></span></div><div className="relative flex justify-center text-[8px] font-black tracking-[0.4em] text-muted-foreground uppercase"><span className="bg-[#0b0c0d] px-4">Instant Fallback</span></div></div>
                    <Button variant="outline" onClick={handleDownloadCSV} className="w-full border-white/10 h-14 rounded-2xl text-xs font-black uppercase"><Download size={18} className="mr-2" /> Download CSV</Button>
                  </div>
                )}
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
