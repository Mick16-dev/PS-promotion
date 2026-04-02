'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  MapPin, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Mail, 
  CheckCircle2, 
  Circle, 
  Clock4,
  ExternalLink,
  ChevronRight,
  Plus,
  AlertCircle,
  FileText,
  MoreHorizontal
} from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

interface ShowDetailPageProps {
  params: Promise<{ id: string }>
}

export default function ShowDetailPage({ params }: ShowDetailPageProps) {
  const router = useRouter()
  const { id } = React.use(params)
  
  const [show, setShow] = useState<any>(null)
  const [materials, setMaterials] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [reliability, setReliability] = useState({ score: 100 })

  async function fetchShowData() {
    try {
      setIsLoading(true)
      
      // Fetch show info separately
      const { data: showData, error: showErr } = await supabase
        .from('shows')
        .select(`
          id,
          venue,
          city,
          show_date,
          show_time,
          status,
          artist_name,
          artist_email
        `)
        .eq('id', id)
        .single()
        
      if (showErr) throw showErr

      // Fetch materials info separately to avoid PGRST200 Join errors
      const { data: matsData } = await supabase
        .from('materials')
        .select('*')
        .eq('show_id', id)

      if (showData) {
        setShow({
          ...showData,
          portalUrl: typeof window !== 'undefined' ? `${window.location.origin}/portal/${id}` : `/portal/${id}`
        })
        
        const mats = matsData || []
        const totalToExpect = mats.length > 0 ? mats.length : 6
        
        const formattedDocs = mats.map((mat: any) => {
          const deadline = mat.deadline ? new Date(mat.deadline) : null
          const now = new Date()
          const isOverdue = deadline && deadline < now && (mat.status?.toLowerCase() !== 'delivered' && mat.status?.toLowerCase() !== 'submitted')
          
          let docStatus = mat.status || 'awaiting'
          if (isOverdue) docStatus = 'overdue'

          return {
            id: mat.id,
            name: mat.item_name || 'Document',
            status: docStatus,
            deadline: mat.deadline || 'TBD',
            submitted_at: mat.submitted_at,
            file_url: mat.file_url
          }
        })
        setMaterials(formattedDocs)
      }
    } catch (err: any) {
      console.error('Failed to load show detail:', err)
      toast.error('Detailed Load Failure', {
        description: err.message || 'Check database connection'
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchShowData()

    // Real-time listeners for current show and materials
    const showSub = supabase.channel(`show-${id}`).on('postgres_changes', { event: '*', schema: 'public', table: 'shows', filter: `id=eq.${id}` }, () => fetchShowData()).subscribe()
    const matSub = supabase.channel(`mats-${id}`).on('postgres_changes', { event: '*', schema: 'public', table: 'materials', filter: `show_id=eq.${id}` }, () => fetchShowData()).subscribe()

    return () => {
      supabase.removeChannel(showSub)
      supabase.removeChannel(matSub)
    }
  }, [id])

  if (isLoading) return (
    <div className="flex h-[50vh] items-center justify-center">
      <div className="animate-pulse flex flex-col items-center gap-4 text-muted-foreground">
        <Clock className="h-8 w-8 animate-bounce text-primary/50" />
        <p className="font-pro-data uppercase tracking-widest text-xs font-bold">Synchronizing Show Intelligence...</p>
      </div>
    </div>
  )

  if (!show) return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <h3 className="text-2xl font-black uppercase tracking-tighter italic text-white mb-4">Show not found.</h3>
      <Button variant="link" onClick={() => router.push('/shows')} className="text-primary gap-2">
        <ArrowLeft size={16} /> Back to All Shows
      </Button>
    </div>
  )

  const deliveredCount = materials.filter(m => m.status.toLowerCase() === 'delivered' || m.status.toLowerCase() === 'submitted').length
  const totalCount = materials.length > 0 ? materials.length : 6

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700 pb-20 max-w-7xl mx-auto">
      {/* Header & Navigation */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <button onClick={() => router.push('/shows')} className="group flex items-center gap-3 text-muted-foreground hover:text-white transition-all mb-4 text-xs font-bold uppercase tracking-widest font-pro-data">
            <div className="h-8 w-8 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
              <ArrowLeft size={14} />
            </div>
            Back to Shows
          </button>
          <h1 className="text-6xl font-black tracking-tighter uppercase italic text-white leading-none">{show.artist_name}</h1>
          <p className="text-xl font-medium text-muted-foreground mt-4 flex items-center gap-3 uppercase tracking-tight">
            <MapPin size={22} className="text-primary/60" />
            {show.venue}, {show.city}
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <Button 
            className="bg-white/10 text-white hover:bg-white/20 h-14 px-8 rounded-2xl gap-3 font-pro-data uppercase tracking-widest text-[11px] border border-white/5"
            onClick={() => window.open(show.portalUrl, '_blank')}
          >
            <ExternalLink size={18} /> Portal Preview
          </Button>
          <Button className="bg-primary text-white hover:bg-primary/90 h-14 px-10 rounded-2xl gap-3 font-pro-data uppercase tracking-widest text-[11px] shadow-2xl shadow-primary/20">
            Resend All Links
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Details Panel */}
        <div className="lg:col-span-8 flex flex-col gap-10">
          {/* Logistics Summary */}
          <div className="glass-card rounded-[3rem] p-12 border-white/5 bg-muted/5 grid grid-cols-1 md:grid-cols-3 gap-12 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="space-y-3 relative z-10">
              <span className="font-pro-data uppercase tracking-widest text-[10px] text-muted-foreground font-black flex items-center gap-2">
                <CalendarIcon size={14} className="text-primary/60" /> Date
              </span>
              <p className="text-4xl font-black italic uppercase tracking-tighter text-white font-pro-data leading-none mt-2">{show.show_date}</p>
            </div>
            <div className="space-y-3 relative z-10 border-l border-white/5 pl-12">
              <span className="font-pro-data uppercase tracking-widest text-[10px] text-muted-foreground font-black flex items-center gap-2">
                <Clock size={14} className="text-primary/60" /> Schedule
              </span>
              <p className="text-4xl font-black italic uppercase tracking-tighter text-white font-pro-data leading-none mt-2">{show.show_time}</p>
            </div>
            <div className="space-y-3 relative z-10 border-l border-white/5 pl-12">
               <span className="font-pro-data uppercase tracking-widest text-[10px] text-muted-foreground font-black flex items-center gap-2">
                <CheckCircle2 size={14} className="text-primary/60" /> Progress
              </span>
              <div className="flex items-center gap-4 mt-2">
                 <p className="text-4xl font-black italic uppercase tracking-tighter text-white font-pro-data leading-none">{deliveredCount}/{totalCount}</p>
              </div>
            </div>
          </div>

          {/* Checklist Panel */}
          <div className="glass-card rounded-[3rem] p-10 border-white/5 bg-muted/5 relative overflow-hidden group min-h-[600px] flex flex-col">
            <div className="flex items-center justify-between mb-10 px-4 pt-4">
              <div>
                <h3 className="text-3xl font-black uppercase tracking-tighter italic text-white flex items-center gap-4">
                  Material Checklist
                </h3>
                <p className="text-muted-foreground font-medium mt-2">Monitoring document deliverability for this show.</p>
              </div>
              <Button variant="ghost" className="h-14 w-14 rounded-2xl bg-white/5 hover:bg-white/10 text-white border border-white/5">
                <Plus size={24} />
              </Button>
            </div>

            <div className="space-y-4 px-2">
              {materials.length > 0 ? (
                materials.map((doc) => {
                  const isDone = doc.status.toLowerCase() === 'delivered' || doc.status.toLowerCase() === 'submitted'
                  const isOverdue = doc.status.toLowerCase() === 'overdue'
                  
                  return (
                    <div 
                      key={doc.id} 
                      className={`flex items-center justify-between font-bold text-sm bg-muted/20 border border-white/5 p-8 rounded-3xl group/item hover:bg-white/[0.05] transition-all hover:border-white/10 cursor-pointer`}
                    >
                      <div className="flex items-center gap-8">
                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-500 border ${isDone ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : (isOverdue ? 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]' : 'bg-white/5 text-muted-foreground/30 border-white/5')}`}>
                          {isDone ? <CheckCircle2 size={24} /> : (isOverdue ? <AlertCircle size={24} /> : <Circle size={20} />)}
                        </div>
                        <div>
                          <p className={`text-xl font-black uppercase italic tracking-tighter transition-colors ${isDone ? 'text-emerald-400' : 'text-white'}`}>{doc.name}</p>
                          <p className="text-xs text-muted-foreground mt-1 font-bold font-pro-data uppercase tracking-widest opacity-60">Status: {doc.status}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-10">
                        <div className="text-right flex flex-col items-end">
                          <span className="text-[10px] font-pro-data text-muted-foreground/30 uppercase tracking-[0.2em] font-black pb-1">Deadline</span>
                          <span className={`text-xs font-pro-data font-black tracking-widest uppercase ${isOverdue ? 'text-red-400' : 'text-white/60'}`}>{doc.deadline}</span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-12 w-12 text-muted-foreground/40 hover:text-white rounded-2xl group-hover/item:bg-white/10 transition-all">
                          <MoreHorizontal size={20} />
                        </Button>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="py-20 flex flex-col items-center justify-center text-center opacity-40">
                  <FileText size={48} className="mb-4" />
                  <p className="uppercase tracking-widest text-xs font-black font-pro-data">No specific documents required yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Info Panels */}
        <div className="lg:col-span-4 flex flex-col gap-10">
           {/* Artist Contact Panel */}
           <div className="glass-card rounded-[3rem] p-10 border-white/5 bg-muted/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none">
                  <User size={120} className="text-primary" />
              </div>
              <h3 className="text-lg font-black uppercase italic tracking-tighter mb-8 flex items-center gap-3">
                  <User size={18} className="text-primary" /> Artist Intelligence
              </h3>
              
              <div className="space-y-10">
                  <div>
                      <p className="text-[10px] font-pro-data text-muted-foreground/40 uppercase tracking-[0.2em] font-black mb-3">Primary Contact</p>
                      <h4 className="text-2xl font-black uppercase italic italic tracking-tighter text-white">{show.artist_name}</h4>
                      <p className="text-muted-foreground mt-2 font-bold font-pro-data text-sm flex items-center gap-3">
                          <Mail size={16} className="text-primary/40" />
                          {show.artist_email || 'No email provided'}
                      </p>
                  </div>

                  <div className="pt-10 border-t border-white/5">
                      <p className="text-[10px] font-pro-data text-muted-foreground/40 uppercase tracking-[0.2em] font-black mb-6">Historical Reliability</p>
                      <div className="flex items-center justify-between mb-4">
                          <span className="text-white font-black text-4xl italic tracking-tighter font-pro-data">{reliability.score}%</span>
                          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 uppercase font-bold tracking-widest text-[9px] px-3 py-1.5 rounded-lg">High Performance</Badge>
                      </div>
                      <div className="w-full h-3 bg-white/5 rounded-2xl overflow-hidden shadow-inner border border-white/5">
                        <div className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-[2000ms]" style={{ width: `${reliability.score}%` }} />
                      </div>
                  </div>
              </div>
           </div>

           {/* Portal Management Panel */}
           <div className="glass-card rounded-[3rem] p-10 border-white/5 bg-ebony-950/80 shadow-2xl relative overflow-hidden group border-primary/20">
              <div className="absolute top-0 left-0 w-1 bg-primary h-full opacity-60" />
              <h3 className="text-lg font-black uppercase italic tracking-tighter mb-8 flex items-center gap-3 text-white">
                  <ExternalLink size={18} className="text-primary" /> Portal Intelligence
              </h3>
              
              <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                  Artists manage their submissions through a private, password-less portal. You are monitoring this active link.
              </p>

              <div className="mt-8 p-6 bg-muted/40 rounded-3xl border border-white/5 flex flex-col gap-4">
                  <p className="text-[10px] font-pro-data text-muted-foreground/40 uppercase tracking-[0.2em] font-black">Public Workflow Link</p>
                  <p className="text-xs font-bold text-primary truncate font-pro-data tracking-tight">{show.portalUrl}</p>
              </div>

               <Button 
                variant="outline" 
                className="w-full mt-10 h-14 rounded-2xl gap-3 border-white/10 hover:bg-white/5 transition-all text-white font-black uppercase italic tracking-tighter"
                onClick={() => {
                  navigator.clipboard.writeText(show.portalUrl)
                  toast.success('Portal link copied to clipboard')
                }}
              >
                Copy Portal Link
              </Button>
           </div>
        </div>
      </div>
    </div>
  )
}
