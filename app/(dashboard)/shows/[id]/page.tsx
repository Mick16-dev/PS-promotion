'use client'

import React, { useState, useEffect } from 'react'
import { 
  ArrowLeft, 
  MapPin, 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  MoreHorizontal, 
  ExternalLink,
  ChevronRight,
  Clock4,
  Paperclip,
  ArrowRight,
  User,
  FileWarning,
  Loader2,
  Mail
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

export default function ShowDetailPage() {
  const { id } = useParams()
  const [show, setShow] = useState<any>(null)
  const [materials, setMaterials] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)

  async function fetchShowDetails() {
    try {
      setIsLoading(true)
      const { data: showData, error: showErr } = await supabase
        .from('shows')
        .select('*')
        .eq('id', id)
        .single()

      if (showErr) throw showErr

      const { data: matsData, error: matsErr } = await supabase
        .from('materials')
        .select('*')
        .eq('show_id', id)
        .order('deadline', { ascending: true })

      if (matsErr) throw matsErr

      setShow(showData)
      setMaterials(matsData)
    } catch (err: any) {
      toast.error('Load Error', { description: 'Could not fetch production requirements.' })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSendReminder(itemName?: string) {
     if (!show) return
     
     try {
        setIsSending(true)
        const response = await fetch('/api/n8n/send-reminder', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({
              show_id: show.id,
              artist_id: show.artist_id,
              artist_name: show.artist_name,
              artist_email: show.artist_email,
              venue: show.venue,
              city: show.city,
              date: show.show_date,
              item_name: itemName || 'Production Deliverables',
              portal_token: show.id // Standardizing as show ID for now
           })
        })

        if (!response.ok) throw new Error('Reminder Failed')
        
        toast.success('Reminder Dispatched', { 
           description: itemName 
             ? `Specific notification for "${itemName}" sent to ${show.artist_name}.`
             : `General advancement notification sent to ${show.artist_name}.` 
        })
     } catch (err: any) {
        toast.error('Dispatch Failure', { 
           description: 'Could not reach the automated notification system.' 
        })
     } finally {
        setIsSending(false)
     }
  }

  useEffect(() => {
    if (id) fetchShowDetails()
  }, [id])

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="animate-spin h-6 w-6 border-2 border-primary/20 border-t-primary rounded-full" />
      </div>
    )
  }

  if (!show) return <div className="p-20 text-center text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Show metadata not found</div>

  const deliveredCount = materials.filter(m => m.status === 'delivered' || m.status === 'submitted').length
  const totalCount = materials.length > 0 ? materials.length : 5

  return (
    <div className="max-w-[1200px] mx-auto pt-10 pb-20 px-8 animate-in fade-in duration-700">
      {/* Precision Header & Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/[0.04] pb-10 mb-10 gap-6">
        <div>
           <div className="flex items-center gap-2 mb-3">
              <Link href="/shows" className="text-zinc-500 hover:text-zinc-300 text-xs font-medium transition-colors">Advancement Pipeline</Link>
              <ChevronRight size={10} className="text-zinc-700" />
              <span className="text-zinc-300 text-xs font-bold truncate max-w-[200px]">{show.artist_name}</span>
           </div>
           <h1 className="text-5xl font-black tracking-tighter text-white mb-4">{show.artist_name}</h1>
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-zinc-400">
                 <MapPin size={14} className="text-zinc-600" />
                 <span className="text-sm font-bold tracking-tight">{show.venue}, {show.city}</span>
              </div>
              <div className="h-1 w-1 rounded-full bg-zinc-800" />
              <div className="flex items-center gap-2 text-zinc-400">
                 <CalendarIcon size={14} className="text-zinc-600" />
                 <span className="text-sm font-bold tracking-tight italic">{show.show_date}</span>
              </div>
           </div>
        </div>
        <div className="flex items-center gap-3">
           <Button variant="outline" className="h-10 bg-zinc-900 border-white/10 hover:bg-zinc-800 text-zinc-100 font-semibold text-sm px-4 rounded-lg gap-2">
             <ExternalLink size={14} /> Artist Portal
           </Button>
           <Button 
             disabled={isSending}
             onClick={() => handleSendReminder()}
             className="h-10 bg-white hover:bg-zinc-200 text-[#0B0C0E] font-bold text-sm px-6 rounded-lg shadow-xl shadow-white/5 gap-2 transition-all active:scale-95 disabled:opacity-50"
           >
             {isSending ? (
               <Loader2 size={16} className="animate-spin" />
             ) : (
               <Mail size={16} strokeWidth={2.5} />
             )}
             {isSending ? 'Dispatching...' : 'Send All Reminders'}
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* Quick Stats Banner - Precision Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {[
               { label: 'Stage Schedule', val: show.show_time, icon: Clock },
               { label: 'Advancement Integrity', val: `${deliveredCount} of ${totalCount}`, icon: CheckCircle2 },
               { label: 'Tour Status', val: show.status || 'Active', icon: Clock4 }
             ].map((s, i) => (
               <div key={i} className="bg-[#151618] border border-white/[0.04] p-6 rounded-xl">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-3">{s.label}</p>
                  <div className="flex items-center gap-3">
                     <span className="text-lg font-bold text-white tracking-tight">{s.val}</span>
                  </div>
               </div>
             ))}
          </div>

          {/* Checklist Area - Dense Linear Row Pattern */}
          <div className="bg-[#151618] border border-white/[0.04] rounded-xl overflow-hidden shadow-2xl">
             <div className="px-8 py-5 border-b border-white/[0.04] flex items-center justify-between bg-white/[0.01]">
                <div>
                   <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Technical Rider & Deliverables</h2>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 rounded-lg bg-zinc-900 text-zinc-500 hover:text-white border border-white/[0.05]">
                   <Plus size={14} />
                </Button>
             </div>

             <div className="divide-y divide-white/[0.01]">
                {materials.map((doc) => {
                  const name = doc.name || doc.item_name
                  const isDone = doc.status === 'delivered' || doc.status === 'submitted'
                  const deadlineDate = doc.deadline ? new Date(doc.deadline) : null
                  const isOverdue = !isDone && deadlineDate && deadlineDate < new Date()

                  return (
                    <div key={doc.id} className="group flex items-center justify-between px-8 py-5 hover:bg-white/[0.01] transition-all">
                      <div className="flex items-center gap-6">
                        <div className={`h-6 w-6 rounded-md border flex items-center justify-center transition-all ${isDone ? 'bg-emerald-500 border-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 'bg-transparent border-zinc-800 text-transparent group-hover:border-zinc-400'}`}>
                           {isDone && <CheckCircle2 size={14} strokeWidth={4} />}
                        </div>
                        <div>
                           <p className={`text-sm font-bold tracking-tight ${isDone ? 'text-zinc-500 line-through' : 'text-zinc-100'}`}>{name}</p>
                           <div className="flex items-center gap-2 mt-1">
                              <Badge className={`text-[9px] font-black uppercase px-2 py-0 border-none ${isDone ? 'bg-emerald-500/10 text-emerald-500' : (isOverdue ? 'bg-rose-500/10 text-rose-500' : 'bg-zinc-800 text-zinc-500')}`}>
                                 {isDone ? 'Delivered' : (isOverdue ? 'Overdue' : 'Awaiting')}
                              </Badge>
                           </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-10">
                         {!isDone && (
                           <Button 
                             onClick={() => handleSendReminder(name)}
                             disabled={isSending}
                             variant="ghost" 
                             className="h-8 bg-zinc-900 text-zinc-500 hover:text-white border border-white/[0.05] text-[10px] font-bold uppercase tracking-widest px-3 gap-2 opacity-0 group-hover:opacity-100 transition-all"
                           >
                            <Mail size={12} /> Ping
                           </Button>
                         )}
                         <div className="flex items-center gap-3">
                            <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Deadline</span>
                            <div className={`px-3 py-1 rounded-md text-[11px] font-black border ${isOverdue ? 'bg-rose-500/5 text-rose-500 border-rose-500/10' : 'bg-zinc-900 text-zinc-400 border-white/[0.03]'}`}>
                               {doc.deadline}
                            </div>
                         </div>
                         <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-700 hover:text-white transition-colors">
                            <MoreHorizontal size={16} />
                         </Button>
                      </div>
                    </div>
                  )
                })}
             </div>
          </div>
        </div>

        {/* Action Sidebar - High Polish */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-[#151618] border border-white/[0.04] p-8 rounded-xl space-y-8">
              <div>
                 <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-6">Contractual Point of Contact</h3>
                 <div className="space-y-4">
                    <div className="flex items-center gap-4">
                       <div className="h-8 w-8 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-600 border border-white/[0.04] shadow-inner">
                          <User size={14} />
                       </div>
                       <div>
                          <p className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Primary Contact</p>
                          <p className="text-xs font-semibold text-zinc-100 mt-0.5">{show.artist_email || 'No records provided'}</p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="pt-8 border-t border-white/[0.04]">
                 <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-6">Engagement Milestones</h3>
                 <div className="bg-zinc-900/40 border border-white/[0.03] rounded-xl p-6 text-center shadow-inner">
                    <Paperclip size={18} className="mx-auto text-zinc-800 mb-3" />
                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest leading-relaxed">Drop tour assets here to trigger automatic promoter notification.</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
