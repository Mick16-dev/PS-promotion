'use client'

import React, { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  ArrowUpRight,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  User,
  ChevronRight,
  Clock4,
  Paperclip,
  ArrowRight,
  RefreshCw,
  Layers,
  Filter
} from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { CreateShowModal } from '@/components/dashboard/create-show-modal'

export default function ShowsPage() {
  const [shows, setShows] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  async function fetchShows() {
    try {
      if (!isRefreshing) setIsLoading(true)
      
      const { data: showsData, error: showsErr } = await supabase
        .from('shows')
        .select('*')
        .order('show_date', { ascending: true })

      if (showsErr) throw showsErr

      const { data: materialsData, error: matsErr } = await supabase
        .from('materials')
        .select('show_id, status')

      if (matsErr) throw matsErr

      const processedShows = showsData.map((show: any) => {
        const showMats = materialsData?.filter((m: any) => m.show_id === show.id) || []
        const delivered = showMats.filter((m: any) => m.status === 'delivered' || m.status === 'submitted').length
        const total = showMats.length > 0 ? showMats.length : 5
        const artistName = show.artist_name || 'Unnamed Artist'
        
        return {
          id: show.id,
          artist: artistName,
          venue: show.venue || show.venue_name || 'Venue TBD',
          city: show.city || '',
          date: show.show_date || '',
          progress: delivered,
          totalItems: total,
          status: 'active'
        }
      })

      setShows(processedShows)
    } catch (err: any) {
      toast.error('Sync Failure', { description: 'Could not fetch the production roster.' })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  function handleSync() {
    setIsRefreshing(true)
    fetchShows()
    toast.success('Syncing...', { description: 'Updating production metadata from backend.' })
  }

  useEffect(() => {
    fetchShows()
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="animate-spin h-6 w-6 border-2 border-primary/20 border-t-primary rounded-full" />
      </div>
    )
  }

  return (
    <div className="max-w-[1200px] mx-auto pt-10 pb-20 px-8 animate-in fade-in duration-700">
      {/* Precision Header */}
      <div className="flex items-center justify-between border-b border-white/[0.04] pb-10 mb-12">
        <div>
           <div className="flex items-center gap-2 mb-3">
              <Layers size={14} className="text-zinc-600" />
              <span className="text-zinc-300 text-xs font-bold">Manage Shows</span>
           </div>
           <h1 className="text-4xl font-bold tracking-tight text-white inline-flex items-center gap-3">
             Advancement <span className="text-zinc-600 font-medium">Pipeline</span>
           </h1>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative group mr-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-700" size={14} />
              <input 
                placeholder="Search engagements..." 
                className="bg-zinc-900 border border-white/[0.05] rounded-xl h-10 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-white/20 transition-all w-[240px]"
              />
           </div>
           <Button 
            variant="outline" 
            onClick={handleSync}
            disabled={isRefreshing}
            className="h-10 bg-zinc-900 border-white/10 hover:bg-zinc-800 text-zinc-300 font-bold text-xs px-4 rounded-lg gap-2"
           >
             <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} /> Sync Engagements
           </Button>
           <Button 
             onClick={() => setIsCreateModalOpen(true)}
             className="h-10 bg-white hover:bg-zinc-200 text-[#0B0C0E] font-bold text-sm px-5 rounded-lg shadow-xl shadow-white/5 gap-2 transition-all active:scale-95"
           >
             <Plus size={16} strokeWidth={3} /> Add Engagement
           </Button>
        </div>
      </div>

      {/* Production Feed - High Density Row Pattern */}
      <div className="bg-[#151618] border border-white/[0.04] rounded-xl overflow-hidden shadow-2xl">
         <div className="px-8 py-5 border-b border-white/[0.04] flex items-center justify-between bg-white/[0.01]">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Active Roster Advancements</h3>
            <div className="flex items-center gap-4">
               <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{shows.length} Total Engagements</span>
               <Filter size={14} className="text-zinc-700" />
            </div>
         </div>

         <div className="divide-y divide-white/[0.01]">
            {shows.map((show) => (
              <Link key={show.id} href={`/shows/${show.id}`}>
                 <div className="group flex flex-col md:flex-row md:items-center justify-between px-8 py-6 hover:bg-white/[0.02] transition-all border-l-2 border-l-transparent hover:border-l-primary cursor-pointer">
                    <div className="flex items-center gap-8">
                       {/* High-Contrast Avatar Icon */}
                       <div className="h-12 w-12 rounded-xl bg-zinc-900 border border-white/[0.05] flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors relative overflow-hidden shadow-inner">
                          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />
                          <span className="text-xl font-black italic relative z-10">{show.artist[0]}</span>
                       </div>
                       
                       <div>
                          <div className="flex items-center gap-3">
                             <span className="text-lg font-bold text-white tracking-tight group-hover:text-primary transition-colors">{show.artist}</span>
                             <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[9px] font-black uppercase px-2 py-0">ACTIVE</Badge>
                          </div>
                          <div className="flex items-center gap-3 mt-1 underline decoration-zinc-900 underline-offset-8">
                             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">{show.venue}</span>
                             <span className="h-1 w-1 rounded-full bg-zinc-800" />
                             <span className="text-[11px] font-medium text-zinc-600 italic">{show.date} • {show.city}</span>
                          </div>
                       </div>
                    </div>

                    <div className="flex items-center gap-12 mt-4 md:mt-0">
                       <div className="flex flex-col items-end gap-2 pr-10 border-r border-white/5">
                          <div className="flex items-center gap-3">
                             <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Deliverables</span>
                             <span className="text-sm font-bold text-white">{show.progress}/{show.totalItems}</span>
                          </div>
                          <div className="w-32 h-1 bg-zinc-900 rounded-full overflow-hidden">
                             <div 
                               className="h-full bg-primary transition-all duration-1000 shadow-[0_0_8px_rgba(var(--primary),0.5)]" 
                               style={{ width: `${(show.progress / show.totalItems) * 100}%` }} 
                             />
                          </div>
                       </div>
                       
                       <Button variant="ghost" size="icon" className="text-zinc-700 hover:text-white group-hover:bg-zinc-800 transition-all rounded-lg">
                          <ArrowRight size={20} />
                       </Button>
                    </div>
                 </div>
              </Link>
            ))}
         </div>
      </div>

      <CreateShowModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSuccess={fetchShows}
      />
    </div>
  )
}
