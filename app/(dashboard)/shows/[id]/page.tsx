'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { 
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  ExternalLink,
  Copy,
  Mail,
  Download,
  Eye,
  Send,
  Loader2,
  FileSearch,
  CheckCircle,
  ShieldAlert,
  PieChart,
  RefreshCw,
  User,
  ArrowUpRight,
  Plus,
  Table,
  Zap,
  Ticket,
  ArrowRight,
  Trash2,
  ShieldCheck,
  Utensils,
  Image as ImageIcon,
  Activity
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
      if (!id) return
      setIsLoading(true)
      try {
        const { data: show, error: showErr } = await supabase.from('shows').select('*').eq('id', id).single()
        if (showErr) throw showErr
        setShowInfo(show)
        if (show.export_mapping && Array.isArray(show.export_mapping)) setMapping(show.export_mapping)

        const { data: materials } = await supabase.from('materials').select('*').eq('show_id', id)
        setDocuments(materials || [])

        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: integration } = await supabase.from('user_integrations').select('id').eq('user_id', user.id).eq('provider', 'google').maybeSingle()
          setIsGoogleConnected(!!integration)
        }
      } catch (err) {
        console.error('FETCH_ERROR:', err)
        toast.error('Failed to load show details')
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [id])

  const handleGenerateSheet = async () => {
    if (!isGoogleConnected) return toast.error('Connect Google account first')
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
      link.href = URL.createObjectURL(blob); link.download = `Export_${showInfo.artist_name}.csv`; link.click()
      toast.success('CSV Downloaded!')
    } catch (e: any) { toast.error('Download failed') }
  }

  const handleViewDocument = async (doc: any) => {
    if (!doc.file_path) return toast.error('No file path')
    try {
      const { data, error } = await supabase.storage.from('materials').createSignedUrl(doc.file_path, 3600)
      if (error) throw error
      window.open(data.signedUrl, '_blank')
    } catch (err: any) { toast.error('Could not open file') }
  }

  const handleReminder = async (doc: any) => {
    setIsSendingReminder(doc.id)
    try {
      await fetch('/api/n8n/send-reminder', { method: 'POST', body: JSON.stringify({ materialId: doc.id }) })
      toast.success('Reminder sent')
    } catch (err) { toast.error('Failed') } finally { setIsSendingReminder(null) }
  }

  if (isLoading) return <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4"><Loader2 size={40} className="animate-spin text-primary" /><p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Initializing...</p></div>
  if (!showInfo) return <div className="text-center py-20">Show not found</div>

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20 max-w-7xl mx-auto px-4">
      <div className="space-y-6">
        <Link href="/shows" className="inline-flex items-center gap-2 text-sm text-muted-foreground/60 hover:text-white transition-colors font-bold group">
          <ArrowLeft size={16} /> All Shows
        </Link>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-4">
            <Badge className="bg-primary/10 text-primary border-primary/20 font-black uppercase text-[10px] py-1 px-4 rounded-full">{showInfo.status || 'Active'}</Badge>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic text-white leading-none">{showInfo.artist_name}</h1>
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground font-bold">
              <span className="flex items-center gap-2"><Calendar size={18} /> {new Date(showInfo.show_date).toLocaleDateString()}</span>
              <span className="flex items-center gap-2"><MapPin size={18} /> {showInfo.venue_name}, {showInfo.city}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="h-14 border-white/10 bg-white/5 hover:bg-white/10 rounded-2xl text-xs font-black uppercase" onClick={() => window.location.href = `/shows/${id}/edit`}>Edit Show</Button>
            <Button className="h-14 bg-white text-black rounded-2xl text-xs font-black uppercase px-8">Save Changes</Button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 bg-zinc-900/50 p-1 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar">
        {[
          { id: 'itinerary', name: 'Itinerary' },
          { id: 'financials', name: 'Financials' },
          { id: 'tech', name: 'Tech' },
          { id: 'documents', name: 'Documents' },
          { id: 'sync', name: 'Sync & Spreadsheet', icon: Table }
        ].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-white text-black' : 'text-muted-foreground hover:text-white'}`}>
            {tab.icon && <tab.icon size={14} />} {tab.name}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'itinerary' && (
          <motion.div key="itinerary" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 bg-zinc-900/50 border border-white/5 p-8 rounded-[2.5rem] space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-primary">Schedule</h3>
              <div className="space-y-4 pt-4">
                {[{ l: 'Load In', t: showInfo.load_in_time }, { l: 'Soundcheck', t: showInfo.soundcheck_time }, { l: 'Doors', t: showInfo.doors_time }, { l: 'Show', t: showInfo.show_time }].map((item, i) => (
                  <div key={i} className="flex justify-between border-b border-white/5 pb-3"><span className="text-sm font-bold text-muted-foreground">{item.l}</span><span className="text-xl font-black text-white italic">{item.t || 'TBD'}</span></div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-4 bg-zinc-900/50 border border-white/5 p-8 rounded-[2.5rem] space-y-6">
               <h3 className="text-xs font-black uppercase tracking-widest text-emerald-400">Portal</h3>
               <div className="p-4 bg-black/40 rounded-xl text-[10px] font-mono text-muted-foreground truncate">{`https://sr-artist-portal-live.vercel.app/portal/${showInfo.portal_token || id}`}</div>
               <Button className="w-full bg-primary text-white h-12 rounded-xl font-bold uppercase text-[10px]" onClick={handleResendEmail} disabled={isResendingEmail}>{isResendingEmail ? 'Sending...' : 'Resend Email'}</Button>
            </div>
          </motion.div>
        )}

        {activeTab === 'financials' && (
          <motion.div key="financials" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-zinc-900/50 border border-white/5 p-10 rounded-[3rem] space-y-4">
              <h3 className="text-[10px] font-black uppercase text-primary">Guarantee</h3>
              <p className="text-5xl font-black italic text-white">${showInfo.deal_guarantee?.toLocaleString() || '0'}</p>
            </div>
            <div className="bg-zinc-900/50 border border-white/5 p-10 rounded-[3rem] space-y-4">
              <h3 className="text-[10px] font-black uppercase text-amber-500">Expenses</h3>
              <p className="text-5xl font-black italic text-white">${showInfo.total_expenses?.toLocaleString() || '0'}</p>
            </div>
            <div className="bg-zinc-900/50 border border-white/5 p-10 rounded-[3rem] space-y-4">
              <h3 className="text-[10px] font-black uppercase text-emerald-500">Sold</h3>
              <p className="text-5xl font-black italic text-white">{showInfo.total_tickets_sold || '0'}</p>
            </div>
          </motion.div>
        )}

        {activeTab === 'sync' && (
          <motion.div key="sync" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 bg-zinc-900/50 border border-white/5 p-8 rounded-[2.5rem] space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black italic uppercase text-white">Mapping</h3>
                <Button onClick={() => { const n = { id: Math.random().toString(), field: 'custom', header: 'New Col', value: '' }; setMapping([...mapping, n]) }} variant="outline" className="h-10 text-[10px] font-black uppercase"><Plus size={14} className="mr-2" /> Add Column</Button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {mapping.map((m) => (
                  <div key={m.id} className="bg-black/40 border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4">
                    <div className="flex-1 w-full"><Label className="text-[9px] uppercase text-muted-foreground/40 ml-2">Field</Label><div className="bg-white/5 h-12 rounded-xl px-4 flex items-center text-xs font-bold text-white/40">{m.field === 'custom' ? 'Custom' : m.field?.replace(/_/g, ' ')}</div></div>
                    <ArrowRight size={16} className="text-white/10 hidden md:block" />
                    <div className="flex-1 w-full"><Label className="text-[9px] uppercase text-primary ml-2">Header</Label><Input value={m.header} onChange={(e) => setMapping(mapping.map(item => item.id === m.id ? { ...item, header: e.target.value } : item))} className="bg-white/5 border-white/10 h-12 rounded-xl" /></div>
                    {m.field === 'custom' && <div className="flex-1 w-full"><Label className="text-[9px] uppercase text-emerald-500 ml-2">Value</Label><Input value={m.value || ''} onChange={(e) => setMapping(mapping.map(item => item.id === m.id ? { ...item, value: e.target.value } : item))} className="bg-white/5 border-white/10 h-12 rounded-xl" /></div>}
                    <Button variant="ghost" size="icon" onClick={() => setMapping(mapping.filter(item => item.id !== m.id))} className="h-12 w-12 text-white/10 hover:text-red-500"><Trash2 size={18} /></Button>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-4 bg-white/5 border border-white/10 rounded-[3rem] p-10 text-center space-y-6">
              <Table size={48} className="mx-auto text-[#0F9D58]" />
              <h4 className="text-2xl font-black italic uppercase text-white">Generate</h4>
              <Button disabled={isGeneratingSheet || !isGoogleConnected} onClick={handleGenerateSheet} className="w-full bg-white text-black h-16 rounded-2xl font-black uppercase">{isGeneratingSheet ? 'Syncing...' : 'Google Sheet'}</Button>
              <Button variant="outline" onClick={handleDownloadCSV} className="w-full border-white/10 h-14 rounded-2xl text-xs font-black uppercase">CSV Download</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
