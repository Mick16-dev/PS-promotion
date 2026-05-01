'use client'

import React, { useState, useEffect } from 'react'
import useSWR from 'swr'
import { 
  Plus, 
  Search, 
  Trash2,
  Loader2,
  Filter,
  RefreshCw,
  Layers,
  ChevronRight,
  Calendar
} from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { CreateShowModal } from '@/components/dashboard/create-show-modal'
import { UniversalSyncModal } from '@/components/dashboard/universal-sync-modal'
import { Table as TableIcon } from 'lucide-react'
import { 
  BentoPanel, 
  ArtistStatusAvatar, 
  StatusPing 
} from '@/components/ui/bento-grid'
import { ErrorBoundary } from '@/components/dashboard/error-boundary'
import { cn } from '@/lib/utils'

interface Show {
  id: string;
  artist: string;
  venue: string;
  city: string;
  date: string;
  progress: number;
  totalItems: number;
  status: string;
}

export default function ShowsPage() {
  const { data: showsDataRaw, error: fetchError, mutate } = useSWR('shows-roster', async () => {
    const { data, error } = await supabase
      .from('shows')
      .select(`
        id, 
        artist_name, 
        venue_name, 
        venue, 
        city, 
        show_date, 
        materials (status)
      `)
      .order('show_date', { ascending: true })
    
    if (error) throw error
    return data
  }, { revalidateOnFocus: true, refreshInterval: 60000 })

  const shows = React.useMemo(() => {
    if (!showsDataRaw) return []
    return showsDataRaw.map((show: any) => {
      const showMats = show.materials || []
      const delivered = showMats.filter((m: any) => m.status === 'delivered' || m.status === 'submitted').length
      const total = showMats.length > 0 ? showMats.length : 3
      
      return {
        id: show.id,
        artist: show.artist_name || 'Unnamed Artist',
        venue: show.venue_name || show.venue || 'Venue TBD',
        city: show.city || '',
        date: show.show_date || '',
        progress: delivered,
        totalItems: total,
        status: 'active'
      }
    })
  }, [showsDataRaw])

  const isLoading = !showsDataRaw && !fetchError
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false)
  const [selectedShowIds, setSelectedShowIds] = useState<string[]>([])
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  function handleSync() {
    setIsRefreshing(true)
    mutate().finally(() => setIsRefreshing(false))
    toast.success('Syncing Data...')
  }

  async function handleDeleteShow(e: React.MouseEvent, id: string) {
    e.preventDefault()
    e.stopPropagation()
    
    if (!confirm('Permanently remove this engagement?')) return

    setIsDeleting(id)
    try {
      await supabase.from('materials').delete().eq('show_id', id)
      const { error } = await supabase.from('shows').delete().eq('id', id)
      if (error) throw error
      mutate()
      toast.success('Engagement Removed')
    } catch (err: any) {
      toast.error('Deletion Failed')
    } finally {
      setIsDeleting(null)
    }
  }

  function handleSelectShow(e: React.MouseEvent, id: string) {
    e.preventDefault()
    e.stopPropagation()
    setSelectedShowIds(prev => 
      prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
    )
  }

  function handleSelectAll() {
    if (selectedShowIds.length === shows.length) {
      setSelectedShowIds([])
    } else {
      setSelectedShowIds(shows.map(s => s.id))
    }
  }

  useEffect(() => {
    mutate()
  }, [])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-primary" size={24} />
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Initializing Roster...</p>
      </div>
    )
  }

  const runDiagnostic = async () => {
    try {
      const { data, error } = await supabase.from('shows').select('id, artist_name')
      if (error) {
        alert(`DB Error: ${error.message}`)
      } else {
        alert(`Success: Found ${data?.length || 0} shows in the database.`)
      }
    } catch (err: any) {
      alert(`System Error: ${err.message}`)
    }
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.03] pb-8">
        <div>
           <div className="flex items-center gap-2 mb-3">
              <Layers size={14} className="text-primary" />
              <span className="text-primary text-[10px] font-black uppercase tracking-[0.2em]">Roster Management</span>
           </div>
           <h1 className="text-5xl text-title-elegant text-white inline-flex items-center gap-3">
             Advancement <span className="text-muted-foreground/40">/ Pipeline</span>
           </h1>
        </div>
        <div className="flex items-center gap-4">
           <Button 
             onClick={() => setIsSyncModalOpen(true)}
             className="h-12 bg-surface-elevated border border-white/[0.05] hover:border-primary/50 text-white font-black uppercase text-[10px] px-6 rounded-xl transition-all flex items-center gap-2"
           >
             <TableIcon size={14} className="text-[#0F9D58]" /> Universal Export
           </Button>
           <Button 
             onClick={() => setIsCreateModalOpen(true)}
             className="h-12 bg-primary hover:bg-primary/90 text-white font-black uppercase text-xs px-8 rounded-xl shadow-lg shadow-primary/20 gap-2 transition-all active:scale-95"
           >
             <Plus size={16} strokeWidth={3} /> Add Engagement
           </Button>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
         <div className="relative w-full md:w-[320px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/30" size={14} />
            <input 
               placeholder="Search engagements..." 
               className="bg-surface-elevated border-tactical rounded-xl h-11 pl-11 pr-4 text-[11px] font-bold text-white focus:outline-none focus:border-primary/30 transition-all w-full placeholder:text-muted-foreground/20"
            />
         </div>
         <div className="flex items-center gap-2">
            <button onClick={handleSync} className="h-11 w-11 flex items-center justify-center bg-surface-elevated border-tactical rounded-xl hover:bg-white/[0.02] transition-all">
               <RefreshCw size={14} className={cn("text-muted-foreground", isRefreshing && "animate-spin")} />
            </button>
            <button className="h-11 w-11 flex items-center justify-center bg-surface-elevated border-tactical rounded-xl hover:bg-white/[0.02] transition-all">
               <Filter size={14} className="text-muted-foreground" />
            </button>
         </div>
      </div>

      {/* ROSTER TABLE / GRID */}
      <ErrorBoundary title="Engagement Roster">
        <BentoPanel className="p-0" title="Active Roster Advancements" icon={Calendar}>
         <div className="divide-y divide-white/[0.02]">
            {/* Header Row */}
            <div className="px-8 py-4 bg-white/[0.01] flex items-center gap-8 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
               <div className="flex items-center gap-4 w-10">
                  <Checkbox 
                     checked={shows.length > 0 && selectedShowIds.length === shows.length}
                     onCheckedChange={handleSelectAll}
                     className="border-white/10"
                  />
               </div>
               <div className="flex-1">Artist / Engagement</div>
               <div className="hidden md:block w-48 text-center">Status</div>
               <div className="hidden md:block w-40 text-right">Progress</div>
               <div className="w-12"></div>
            </div>

            {/* Data Rows */}
            {shows.length > 0 ? shows.map((show) => (
               <Link key={show.id} href={`/shows/${show.id}`}>
                  <div className={cn(
                     "group flex items-center gap-8 px-8 py-6 hover:bg-primary/[0.02] transition-all cursor-pointer relative overflow-hidden",
                     selectedShowIds.includes(show.id) && "bg-primary/[0.05]"
                  )}>
                     {/* Selection */}
                     <div className="flex items-center gap-4 w-10 relative z-10" onClick={(e) => handleSelectShow(e, show.id)}>
                        <Checkbox 
                           checked={selectedShowIds.includes(show.id)}
                           className="border-white/10"
                        />
                     </div>

                     {/* Artist Info */}
                     <div className="flex-1 flex items-center gap-6 min-w-0 relative z-10">
                        <ArtistStatusAvatar 
                           size="sm"
                           fallback={show.artist}
                           status={{
                               contract: show.progress > 0,
                               rider: show.progress > 1,
                               presskit: show.progress > 2
                           }}
                        />
                        <div className="min-w-0">
                           <h4 className="text-lg font-bold text-white tracking-tight group-hover:text-primary transition-colors truncate">{show.artist}</h4>
                           <div className="flex items-center gap-3 mt-1 underline decoration-white/[0.03] underline-offset-8">
                              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 truncate">{show.venue}</span>
                              <span className="h-1 w-1 rounded-full bg-white/10" />
                              <span className="text-[10px] font-bold text-muted-foreground/20 italic truncate">{show.date} • {show.city}</span>
                           </div>
                        </div>
                     </div>

                     {/* Status Badge */}
                     <div className="hidden md:flex w-48 justify-center relative z-10">
                        <div className="flex items-center gap-3 bg-surface-base border border-white/[0.05] px-4 py-2 rounded-full">
                           <StatusPing variant="teal" />
                           <span className="text-[9px] font-black uppercase tracking-widest text-white">Production</span>
                        </div>
                     </div>

                     {/* Progress */}
                     <div className="hidden md:flex flex-col items-end gap-2 w-40 pr-4 relative z-10">
                        <div className="flex items-center gap-3">
                           <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">Docs</span>
                           <span className="text-xs font-black text-white italic">{show.progress}/{show.totalItems}</span>
                        </div>
                        <div className="w-24 h-0.5 bg-white/5 rounded-full overflow-hidden">
                           <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(show.progress / show.totalItems) * 100}%` }}
                              className="h-full bg-primary shadow-[0_0_8px_rgba(20,184,166,0.5)]" 
                           />
                        </div>
                     </div>

                     {/* Actions */}
                     <div className="w-12 flex justify-end relative z-10">
                        <button 
                           onClick={(e) => handleDeleteShow(e, show.id)}
                           className="h-10 w-10 flex items-center justify-center text-muted-foreground/20 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                        >
                           {isDeleting === show.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                        </button>
                     </div>
                  </div>
               </Link>
            )) : (
              <div className="p-20 text-center space-y-4">
                 <Calendar className="h-12 w-12 text-muted-foreground/20 mx-auto" />
                 <p className="text-sm font-bold text-muted-foreground/40 uppercase tracking-widest">No active engagements found</p>
                 <Button onClick={() => setIsCreateModalOpen(true)} variant="outline" className="border-white/10 text-xs font-bold uppercase tracking-widest h-10 px-6">Add your first show</Button>
              </div>
            )}

         </div>
        </BentoPanel>
      </ErrorBoundary>

      <CreateShowModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSuccess={() => mutate()}
      />
      <UniversalSyncModal 
        isOpen={isSyncModalOpen} 
        onClose={() => setIsSyncModalOpen(false)} 
        selectedShowIds={selectedShowIds}
      />
    </div>
  )
}
