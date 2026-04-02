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
      
      const { data: showData, error: showErr } = await supabase
        .from('shows')
        .select('id, venue, city, show_date, show_time, status, artist_name, artist_email')
        .eq('id', id)
        .single()
        
      if (showErr) throw showErr

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
        
        // Use EXACT 5-document blueprint from user requirement
        if (mats.length === 0) {
          const blueprint = [
            'EPK',
            'Artist Bio',
            'Press Photos',
            'Technical Rider',
            'Signed Contract'
          ].map((name, index) => ({
            id: `blueprint-${index}`,
            name,
            status: 'awaiting',
            deadline: showData.show_date || 'TBD',
            submitted_at: null,
            file_url: null,
            isBlueprint: true
          }))
          setMaterials(blueprint)
        } else {
          const formattedDocs = mats.map((mat: any) => {
            const deadline = mat.deadline ? new Date(mat.deadline) : null
            const now = new Date()
            // Strict check for late status
            const isDelivered = mat.status?.toLowerCase() === 'delivered' || mat.status?.toLowerCase() === 'submitted'
            const isLate = deadline && deadline < now && !isDelivered
            
            return {
              id: mat.id,
              name: mat.item_name || 'Document',
              status: isLate ? 'overdue' : (isDelivered ? 'delivered' : 'awaiting'),
              deadline: mat.deadline || 'TBD',
              submitted_at: mat.submitted_at,
              file_url: mat.file_url
            }
          })
          setMaterials(formattedDocs)
        }
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
    <div className="flex flex-col items-center justify-center py-32 text-center text-white">Show not found.</div>
  )

  const deliveredCount = materials.filter(m => m.status === 'delivered').length
  const totalCount = materials.length

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700 pb-20 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <button onClick={() => router.push('/shows')} className="group flex items-center gap-3 text-muted-foreground hover:text-white transition-all mb-4 text-xs font-bold uppercase tracking-widest font-pro-data">
            <div className="h-8 w-8 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
              <ArrowLeft size={14} />
            </div>
            Back to Shows
          </button>
          <h1 className="text-6xl font-black tracking-tighter uppercase italic text-white leading-none tracking-[-0.04em]">{show.artist_name}</h1>
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
        <div className="lg:col-span-8 flex flex-col gap-10">
          <div className="glass-card rounded-[3rem] p-12 border-white/5 bg-muted/5 grid grid-cols-1 md:grid-cols-3 gap-12 relative overflow-hidden group">
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

          <div className="glass-card rounded-[3rem] p-10 border-white/5 bg-muted/5 relative overflow-hidden group min-h-[600px] flex flex-col">
            <div className="flex items-center justify-between mb-10 px-4 pt-4">
              <div>
                <h3 className="text-3xl font-black uppercase tracking-tighter italic text-white flex items-center gap-4 leading-none tracking-[-0.03em]">
                  Material Checklist
                </h3>
                <p className="text-muted-foreground font-medium mt-3 uppercase text-[10px] tracking-widest font-pro-data">Monitoring 5 core requirements</p>
              </div>
              <Button variant="ghost" className="h-14 w-14 rounded-2xl bg-white/5 hover:bg-white/10 text-white border border-white/5 ml-4">
                <Plus size={24} />
              </Button>
            </div>

            <div className="space-y-3 px-2">
              {materials.map((doc) => {
                const isDone = doc.status === 'delivered'
                const isOverdue = doc.status === 'overdue'
                
                return (
                  <div 
                    key={doc.id} 
                    className="flex items-center justify-between font-bold text-sm bg-muted/20 border border-white/5 p-8 rounded-3xl group/item hover:bg-white/[0.05] transition-all hover:border-white/10 cursor-pointer"
                  >
                    <div className="flex items-center gap-8">
                      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-500 border ${isDone ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : (isOverdue ? 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.15)]' : 'bg-white/5 text-muted-foreground/30 border-white/5')}`}>
                        {isDone ? <CheckCircle2 size={24} /> : (isOverdue ? <AlertCircle size={24} /> : (doc.isBlueprint ? <Clock4 size={20} /> : <Circle size={20} />))}
                      </div>
                      <div>
                        <p className={`text-xl font-black uppercase italic tracking-tighter transition-colors ${isDone ? 'text-emerald-400' : (isOverdue ? 'text-red-400' : 'text-white')}`}>{doc.name}</p>
                        <p className="text-[9px] font-pro-data font-black uppercase tracking-[0.2em] mt-1 text-muted-foreground/40">{isDone ? 'Complete' : (isOverdue ? 'Action Required' : 'Awaiting Submission')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-10">
                      <div className="text-right flex flex-col items-end hidden sm:flex">
                        <span className="text-[10px] font-pro-data text-muted-foreground/30 uppercase tracking-[0.2em] font-black pb-1">Due</span>
                        <span className={`text-xs font-pro-data font-black tracking-widest uppercase ${isOverdue ? 'text-red-400' : 'text-white/60'}`}>{doc.deadline}</span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-12 w-12 text-muted-foreground/40 hover:text-white rounded-2xl group-hover/item:bg-white/10 transition-all ml-4">
                        <MoreHorizontal size={20} />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-10">
           {/* Artist Contact Panel */}
           <div className="glass-card rounded-[3rem] p-10 border-white/5 bg-muted/5 relative overflow-hidden group border-white/5 shadow-2xl shadow-indigo-500/5">
              <h3 className="text-[10px] font-pro-data uppercase tracking-[0.2em] font-black mb-6 text-primary flex items-center gap-2">
                  <User size={14} /> Artist Detail
              </h3>
              
              <div className="space-y-10">
                  <div>
                      <h4 className="text-3xl font-black uppercase italic tracking-tighter text-white">{show.artist_name}</h4>
                      <p className="text-muted-foreground mt-2 font-bold font-pro-data text-sm truncate opacity-60">
                          {show.artist_email || 'No email provided'}
                      </p>
                  </div>
                   <div className="pt-10 border-t border-white/5">
                      <p className="text-[10px] font-pro-data text-muted-foreground/40 uppercase tracking-[0.2em] font-black mb-6 italic underline">Reliability Score</p>
                      <span className="text-white font-black text-5xl italic tracking-tighter font-pro-data">100%</span>
                  </div>
              </div>
           </div>

           {/* Portal Card */}
           <div className="glass-card rounded-[3rem] p-10 bg-indigo-500/5 border-indigo-500/20 shadow-2xl relative overflow-hidden group">
              <h3 className="text-xs font-black uppercase tracking-widest mb-8 flex items-center gap-3 text-indigo-400">
                  <ExternalLink size={18} /> Direct Artist Portal
              </h3>
               <div className="p-6 bg-white/[0.03] rounded-3xl border border-white/5">
                  <p className="text-xs font-pro-data font-bold text-white/50 truncate tracking-tight">{show.portalUrl}</p>
              </div>
               <Button 
                variant="outline" 
                className="w-full mt-10 h-14 rounded-2xl border-white/10 hover:bg-white/5 text-white font-black uppercase italic tracking-tighter"
                onClick={() => {
                  navigator.clipboard.writeText(show.portalUrl)
                  toast.success('Link Copied')
                }}
              >
                Copy Link
              </Button>
           </div>
        </div>
      </div>
    </div>
  )
}
