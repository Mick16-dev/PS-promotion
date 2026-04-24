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
  Table
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
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
  const [mapping, setMapping] = useState<any>({
    artist_name: 'Artist',
    show_date: 'Date',
    venue_name: 'Venue',
    city: 'City',
    show_time: 'Show Time',
    deal_guarantee: 'Fee'
  })

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        // Fetch Show Info
        const { data: show, error: showErr } = await supabase
          .from('shows')
          .select('*')
          .eq('id', id)
          .single()
        
        if (showErr) throw showErr
        setShowInfo(show)
        if (show.export_mapping) setMapping(show.export_mapping)

        // Fetch Materials
        const { data: materials, error: matErr } = await supabase
          .from('materials')
          .select('*')
          .eq('show_id', id)
        
        if (matErr) throw matErr
        setDocuments(materials || [])

        // Check Google Connection
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
        body: JSON.stringify({
          user_id: user?.id,
          mode: 'create_new_sheet',
          mapping,
          shows: [showInfo]
        })
      })

      const result = await response.json()
      if (result.success && result.spreadsheet_url) {
        const { error } = await supabase
          .from('shows')
          .update({ 
            google_sheet_url: result.spreadsheet_url,
            export_mapping: mapping 
          })
          .eq('id', id)
        
        if (error) throw error
        
        setShowInfo({ ...showInfo, google_sheet_url: result.spreadsheet_url })
        toast.success('Spreadsheet generated successfully!')
      } else {
        throw new Error(result.error || 'Failed to generate spreadsheet')
      }
    } catch (e: any) {
      toast.error('Sync failed: ' + e.message)
    } finally {
      setIsGeneratingSheet(false)
    }
  }

  const handleDownloadCSV = () => {
    try {
      const headers = Object.values(mapping)
      const row = Object.keys(mapping).map(key => {
        let val = showInfo[key]
        if (key === 'show_date' && val) val = new Date(val).toLocaleDateString()
        return `"${(val || '').toString().replace(/"/g, '""')}"`
      })

      const csvContent = [
        headers.map(h => `"${(h as string).replace(/"/g, '""')}"`).join(','),
        row.join(',')
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `Export_${showInfo.artist_name.replace(/\s+/g, '_')}.csv`)
      link.click()
      toast.success('CSV Downloaded!')
    } catch (e: any) {
      toast.error('Download failed: ' + e.message)
    }
  }

  const handleCopyLink = () => {
    if (showInfo?.portalUrl) {
      navigator.clipboard.writeText(showInfo.portalUrl)
      toast.success('Copied to clipboard!')
    }
  }

  const handleResendEmail = async () => {
    setIsResendingEmail(true)
    try {
      const response = await fetch('/api/n8n/resend-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ showId: id })
      })
      if (!response.ok) throw new Error('Network response was not ok')
      toast.success('Email re-sent successfully')
    } catch (err) {
      toast.error('Failed to send email')
    } finally {
      setIsResendingEmail(false)
    }
  }

  const handleReminder = async (doc: any) => {
    setIsSendingReminder(doc.id)
    try {
      const response = await fetch('/api/n8n/send-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ materialId: doc.id })
      })
      if (!response.ok) throw new Error('Failed to send reminder')
      toast.success('Reminder sent to artist')
    } catch (err) {
      toast.error('Failed to send reminder')
    } finally {
      setIsSendingReminder(null)
    }
  }

  const handleViewDocument = (doc: any) => {
    if (doc.fileUrl) window.open(doc.fileUrl, '_blank')
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 size={40} className="animate-spin text-primary" />
        <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">Initializing production workspace...</p>
      </div>
    )
  }

  if (!showInfo) return <div className="text-center py-20">Show not found</div>

  const relStatus = showInfo.artist_reliability >= 80 ? { label: 'Trusted', color: 'text-emerald-400', bg: 'bg-emerald-500/10' } :
                   showInfo.artist_reliability >= 50 ? { label: 'Average', color: 'text-amber-500', bg: 'bg-amber-500/10' } :
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
            <Button variant="outline" className="h-14 border-white/10 bg-white/5 hover:bg-white/10 gap-3 px-8 rounded-2xl text-xs font-black uppercase tracking-widest transition-all">
              Edit Show
            </Button>
            <Button className="h-14 bg-white hover:bg-zinc-200 text-black shadow-xl shadow-white/5 gap-3 px-8 rounded-2xl text-xs font-black uppercase tracking-widest transition-all">
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="space-y-10">
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

        {/* ITINERARY TAB */}
        {activeTab === 'itinerary' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-10">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-[2.5rem] space-y-4">
                     <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                       <Clock size={16} /> Schedule
                     </h3>
                     <div className="space-y-4 pt-2">
                        {[
                          { label: 'Load In', time: showInfo.load_in_time },
                          { label: 'Soundcheck', time: showInfo.soundcheck_time },
                          { label: 'Doors', time: showInfo.doors_time },
                          { label: 'Show Starts', time: showInfo.show_time }
                        ].map((item, i) => (
                          <div key={i} className="flex items-center justify-between group">
                            <span className="text-sm font-bold text-muted-foreground/60">{item.label}</span>
                            <span className="text-lg font-black text-white group-hover:text-primary transition-colors italic">{item.time || 'TBD'}</span>
                          </div>
                        ))}
                     </div>
                  </div>
                  
                  <div className="bg-zinc-900/50 border border-white/5 p-8 rounded-[2.5rem] space-y-4">
                     <h3 className="text-xs font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                       <Activity size={16} /> Real-time Status
                     </h3>
                     <div className="space-y-6 pt-4">
                        <div className="flex flex-col gap-2">
                           <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Portal Status</span>
                           <div className="flex items-center gap-2">
                             <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                             <span className="text-sm font-bold text-white uppercase tracking-tighter">Artist Online</span>
                           </div>
                        </div>
                        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                           <p className="text-[11px] text-emerald-400/80 font-bold leading-relaxed">
                             All materials are currently being monitored for automated deadline compliance.
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="lg:col-span-4 space-y-8">
              <div className="glass-card rounded-3xl p-8 border-white/5 bg-muted/10 space-y-6">
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tighter italic text-white flex items-center gap-3">
                    <ExternalLink size={20} className="text-primary" /> Artist Portal
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2 font-medium">Link for artist document uploads.</p>
                </div>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-black/40 border border-white/10 overflow-hidden group">
                    <p className="text-xs font-mono text-muted-foreground/80 truncate group-hover:text-white select-all">{showInfo.portal_url}</p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1 border-white/10 h-12 rounded-xl text-xs font-bold" onClick={handleCopyLink}><Copy size={16} className="mr-2"/> Copy</Button>
                    <Button className="flex-1 bg-primary text-white h-12 rounded-xl text-xs font-bold uppercase tracking-widest" onClick={handleResendEmail} disabled={isResendingEmail}>
                       {isResendingEmail ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} className="mr-2"/>} Resend
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SYNC TAB */}
        {activeTab === 'sync' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-zinc-900/50 border border-white/5 rounded-[2rem] p-8 space-y-6">
                   <div className="flex items-center justify-between">
                     <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">Spreadsheet Mapping</h3>
                     {isGoogleConnected ? (
                       <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 gap-1">
                         <CheckCircle size={10} /> Connected
                       </Badge>
                     ) : (
                       <Badge variant="outline" className="text-amber-500 border-amber-500/20 gap-1">
                         <ShieldAlert size={10} /> Not Connected
                       </Badge>
                     )}
                   </div>
                   <p className="text-sm text-muted-foreground font-medium">Define the column headers for your generated spreadsheet.</p>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {Object.entries(mapping).map(([key, value]) => (
                       <div key={key} className="space-y-2">
                         <Label className="text-[10px] font-pro-data uppercase tracking-widest text-muted-foreground ml-2">{key.replace(/_/g, ' ')}</Label>
                         <Input value={value as string} onChange={(e) => setMapping({ ...mapping, [key]: e.target.value })} className="bg-black/40 border-white/10 h-12 rounded-xl text-sm font-bold" />
                       </div>
                     ))}
                   </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 text-center space-y-6">
                   <div className="h-20 w-20 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto text-[#0F9D58]"><Table size={40} /></div>
                   <div className="space-y-2">
                     <h4 className="text-lg font-black italic uppercase text-white">Google Sheets Export</h4>
                     <p className="text-xs text-muted-foreground font-medium px-4 leading-relaxed">
                       {showInfo?.google_sheet_url ? "Your spreadsheet is ready and synced." : "Generate a dedicated production spreadsheet instantly."}
                     </p>
                   </div>

                   {showInfo?.google_sheet_url ? (
                     <div className="space-y-3">
                       <Button onClick={() => window.open(showInfo.google_sheet_url, '_blank')} className="w-full bg-[#0F9D58] text-white h-14 rounded-2xl font-black italic uppercase tracking-tighter shadow-xl">Open Spreadsheet</Button>
                       <Button variant="outline" disabled={isGeneratingSheet} onClick={handleGenerateSheet} className="w-full border-white/10 h-12 rounded-xl text-xs font-bold gap-2">
                         {isGeneratingSheet ? <RefreshCw className="animate-spin" size={14} /> : <RefreshCw size={14} />} Update Data
                       </Button>
                     </div>
                   ) : (
                     <div className="space-y-4">
                       <Button disabled={isGeneratingSheet || !isGoogleConnected} onClick={handleGenerateSheet} className="w-full bg-white text-black h-14 rounded-2xl font-black italic uppercase tracking-tighter shadow-xl disabled:opacity-50">
                         {isGeneratingSheet ? <div className="flex items-center gap-2"><RefreshCw size={18} className="animate-spin" /> Generating...</div> : "Generate Google Sheet"}
                       </Button>
                       <div className="relative"><div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5"></span></div><div className="relative flex justify-center text-[8px] font-black tracking-[0.3em] text-muted-foreground"><span className="bg-[#0c0c0c] px-2">OR</span></div></div>
                       <Button variant="outline" onClick={handleDownloadCSV} className="w-full border-white/10 h-12 rounded-xl text-xs font-bold gap-2"><Download size={14} /> Download as CSV</Button>
                     </div>
                   )}
                   {!isGoogleConnected && <p className="text-[10px] text-amber-500/80 font-bold uppercase tracking-widest animate-pulse">Connect Google in Settings</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DOCUMENTS TAB */}
        {activeTab === 'documents' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {documents.map((doc) => (
              <div key={doc.id} className="bg-zinc-900/50 border border-white/5 p-8 rounded-[2.5rem] space-y-6">
                <div className="flex items-start justify-between">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-primary"><FileSearch size={24} /></div>
                  <Badge variant="outline" className={`font-black uppercase tracking-widest text-[9px] py-1 px-3 rounded-lg ${doc.hasFile ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/5 text-muted-foreground/60 border-white/10'}`}>
                    {doc.hasFile ? '✅ Received' : '⏳ Pending'}
                  </Badge>
                </div>
                <div><h3 className="text-xl font-bold text-white mb-2">{doc.name}</h3><p className="text-sm text-muted-foreground/60 leading-relaxed">Awaiting transmission. Material initialized in the production workspace.</p></div>
                <div className="flex gap-3">
                  {doc.hasFile ? <Button className="flex-1 bg-primary text-white h-12 rounded-xl text-xs font-bold" onClick={() => handleViewDocument(doc)}>View</Button> :
                  <Button variant="outline" className="flex-1 border-white/10 h-12 rounded-xl text-xs font-bold" onClick={() => handleReminder(doc)} disabled={isSendingReminder === doc.id}>Remind</Button>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
