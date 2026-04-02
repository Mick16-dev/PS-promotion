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
  MoreHorizontal,
  Share2,
  Copy
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

  async function fetchShowData() {
    try {
      setIsLoading(true)
      
      const { data: showData, error: showErr } = await supabase
        .from('shows')
        .select('*')
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
          setMaterials(mats.map(mat => {
            const isDone = mat.status?.toLowerCase() === 'delivered' || mat.status?.toLowerCase() === 'submitted'
            const now = new Date()
            const isLate = mat.deadline && new Date(mat.deadline) < now && !isDone
            
            return {
              id: mat.id,
              name: mat.item_name || 'Document',
              status: isLate ? 'overdue' : (isDone ? 'delivered' : 'awaiting'),
              deadline: mat.deadline || 'TBD',
              submitted_at: mat.submitted_at,
              file_url: mat.file_url
            }
          }))
        }
      }
    } catch (err: any) {
      console.error('Detail Load Failure:', err)
      toast.error('Sync Error', { description: 'Could not load show details.' })
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
      <div className="h-10 w-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  )

  if (!show) return (
    <div className="flex flex-col items-center justify-center py-32 text-center text-white/50">Show not found.</div>
  )

  const deliveredCount = materials.filter(m => m.status === 'delivered').length
  const totalCount = materials.length

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-1000 pb-20 max-w-7xl mx-auto pt-4">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-10">
        <div className="flex-1">
          <button onClick={() => router.push('/shows')} className="group flex items-center gap-2 text-muted-foreground/60 hover:text-white transition-all mb-8 text-[11px] font-bold uppercase tracking-widest">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Shows
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center gap-8">
             <div className="h-24 w-24 rounded-[2rem] bg-white text-black flex items-center justify-center text-4xl font-black shadow-2xl shadow-white/10">
                {show.artist_name?.charAt(0)}
             </div>
             <div>
                <h1 className="text-6xl font-bold tracking-tight text-white mb-2">{show.artist_name}</h1>
                <div className="flex items-center gap-4 text-white/60">
                   <div className="flex items-center gap-2 text-zinc-300">
                      <MapPin size={12} />
                      <span className="text-xs font-bold uppercase tracking-widest">{show.venue}</span>
                   </div>
                </div>
                <p className="text-sm font-medium text-zinc-400">{show.date} • {show.city}</p>
              </div>

              <div className="flex items-center gap-10 w-full md:w-auto px-4">
                <div className="flex flex-col items-end gap-2 pr-6 border-r border-white/5">
                   <div className="flex items-center gap-3">
                      <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Materials</span>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 pt-12 md:pt-0">
          <Button 
            className="bg-white/[0.03] text-white hover:bg-white/[0.08] h-14 px-8 rounded-2xl gap-3 font-bold text-sm tracking-tight border border-white/5"
            onClick={() => window.open(show.portalUrl, '_blank')}
          >
            <Share2 size={18} /> Preview Portal
          </Button>
          <Button className="bg-white text-black hover:bg-zinc-200 h-14 px-10 rounded-2xl gap-3 font-bold text-sm tracking-tight shadow-2xl shadow-white/10">
            Send Reminders
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          {/* Quick Stats Grid */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {[
               { label: 'Schedule', val: show.show_time, icon: Clock },
               { label: 'Requirements', val: `${deliveredCount} of ${totalCount}`, icon: CheckCircle2 },
               { label: 'Status', val: show.status || 'Active', icon: Clock4 }
             ].map((s, i) => (
               <div key={i} className="glass-card p-8 rounded-[2.5rem] border-white/5 bg-white/[0.01]">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-3">{s.label}</p>
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400">
                        <s.icon size={18} />
                     </div>
                     <span className="text-xl font-bold text-white tracking-tight">{s.val}</span>
                  </div>
               </div>
             ))}
          </div>

          {/* Checklist - Human Centric */}
          <div className="glass-card rounded-[3rem] p-10 border-white/5 bg-white/[0.01] relative">
             <div className="flex items-center justify-between mb-10">
                <div>
                   <h2 className="text-2xl font-bold text-white tracking-tight">Show Requirements</h2>
                   <p className="text-sm text-zinc-400 mt-1 font-medium">Track essential documents for this performance.</p>
                </div>
                <Button variant="ghost" size="icon" className="h-12 w-12 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/5">
                   <Plus size={20} />
                </Button>
             </div>

             <div className="space-y-3">
                {materials.map((doc) => {
                  const isDone = doc.status === 'delivered'
                  const isOverdue = doc.status === 'overdue'
                  
                  return (
                    <div 
                      key={doc.id} 
                      className="group flex items-center justify-between p-6 bg-white/[0.015] border border-white/5 rounded-[2rem] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500"
                    >
                      <div className="flex items-center gap-6">
                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-700 ${isDone ? 'bg-emerald-500/10 text-emerald-500 shadow-2xl shadow-emerald-500/10' : (isOverdue ? 'bg-rose-500/10 text-rose-500 shadow-2xl shadow-rose-500/10' : 'bg-white/5 text-white/20')}`}>
                           {isDone ? <CheckCircle2 size={24} /> : (isOverdue ? <AlertCircle size={24} /> : <div className="h-2 w-2 rounded-full bg-white/20" />)}
                        </div>
                        <div>
                           <p className={`text-lg font-bold tracking-tight ${isDone ? 'text-emerald-400 font-bold' : (isOverdue ? 'text-rose-400 font-black' : 'text-white')}`}>{doc.name}</p>
                           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mt-1">{isDone ? 'Delivered' : (isOverdue ? 'Action Required' : 'Awaiting Document')}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-8">
                         <div className="text-right flex flex-col items-end">
                            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-1">Due Date</span>
                            <span className={`text-xs font-bold px-3 py-1 rounded-lg ${isOverdue ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-white/5 text-zinc-300'}`}>{doc.deadline}</span>
                         </div>
                         <Button variant="ghost" size="icon" className="h-10 w-10 text-white/20 hover:text-white rounded-xl">
                            <MoreHorizontal size={18} />
                         </Button>
                      </div>
                    </div>
                  )
                })}
             </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-8">
           {/* Direct Access Portal */}
           <div className="glass-card rounded-[3rem] p-10 bg-white text-black shadow-2xl shadow-white/5 group">
              <div className="h-12 w-12 rounded-2xl bg-black flex items-center justify-center text-white mb-8 group-hover:rotate-12 transition-transform">
                 <ExternalLink size={20} />
              </div>
              <h3 className="text-2xl font-bold tracking-tight mb-3">Artist Portal</h3>
              <p className="text-sm font-medium text-black/50 leading-relaxed mb-10">Direct link for the artist to manage their own documents.</p>
              
              <div className="p-4 bg-black/5 rounded-2xl border border-black/5 mb-8">
                 <p className="text-xs font-bold truncate opacity-40 select-all">{show.portalUrl}</p>
              </div>

              <Button 
                variant="outline" 
                className="w-full h-14 rounded-2xl border-black/10 hover:bg-black hover:text-white text-black font-bold text-sm tracking-tight transition-all"
                onClick={() => {
                  navigator.clipboard.writeText(show.portalUrl)
                  toast.success('Portal Link Copied', { description: 'Ready to share with artist' })
                }}
              >
                <Copy size={16} className="mr-2" /> Copy Direct Link
              </Button>
           </div>

           {/* Contact Card */}
           <div className="glass-card rounded-[3rem] p-10 border-white/5 bg-white/[0.01]">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/30 mb-8">Contract Details</h4>
              <div className="space-y-1">
                 <p className="text-xl font-bold text-white tracking-tight">{show.artist_name || 'No Artist Name'}</p>
                 <div className="flex items-center gap-2 text-primary/80 opacity-60">
                    <Mail size={12} />
                    <span className="text-xs font-bold">{show.artist_email || 'No email saved'}</span>
                 </div>
              </div>
              <div className="mt-10 pt-10 border-t border-white/5">
                 <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/20 mb-4 italic">Estimated Performance Reliability</p>
                 <span className="text-4xl font-bold text-white tracking-tighter">100%</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
