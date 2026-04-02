'use client'

import React, { useState, useEffect } from 'react'
import { 
  Search, 
  Plus, 
  MapPin, 
  Calendar, 
  ChevronRight, 
  Filter,
  Layers,
  ArrowUpRight,
  MoreVertical,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { supabase } from '@/lib/supabase'

export default function ShowsPage() {
  const [shows, setShows] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  async function fetchShows() {
    try {
      setIsLoading(true)
      const { data: showsData, error: showsErr } = await supabase
        .from('shows')
        .select('*')
        .order('show_date', { ascending: true })

      const { data: materialsData } = await supabase
        .from('materials')
        .select('show_id, status')

      if (showsErr) throw showsErr

      const processedShows = showsData.map(show => {
        const showMats = materialsData?.filter(m => m.show_id === show.id) || []
        const delivered = showMats.filter(m => m.status === 'delivered' || m.status === 'submitted').length
        const total = showMats.length > 0 ? showMats.length : 5
        
        return {
          id: show.id,
          artist: show.artist_name || 'TBA',
          venue: show.venue || 'TBA',
          city: show.city || '',
          date: show.show_date || 'TBA',
          progress: delivered,
          totalItems: total,
          status: show.status || 'active'
        }
      })

      setShows(processedShows)
    } finally {
      setIsLoading(false)
    }
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
      <div className="flex items-center justify-between border-b border-white/[0.04] pb-10 mb-10">
        <div>
           <div className="flex items-center gap-2 mb-3">
              <Link href="/" className="text-zinc-500 hover:text-zinc-300 text-xs font-medium transition-colors">Dashboard</Link>
              <ChevronRight size={10} className="text-zinc-700" />
              <span className="text-zinc-300 text-xs font-bold">Manage Shows</span>
           </div>
           <h1 className="text-4xl font-bold tracking-tight text-white inline-flex items-center gap-3">
             Production <span className="text-zinc-600 font-medium">Pipeline</span>
           </h1>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative group mr-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-zinc-300 transition-colors" size={16} />
              <input 
                placeholder="Find show or artist..." 
                className="bg-zinc-900 border border-white/[0.05] rounded-lg h-10 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-white/20 transition-all w-[240px]"
              />
           </div>
           <Button className="h-10 bg-white hover:bg-zinc-200 text-[#0B0C0E] font-bold text-sm px-5 rounded-lg shadow-xl shadow-white/5 gap-2">
             <Plus size={16} strokeWidth={3} /> Import Show
           </Button>
        </div>
      </div>

      {/* Row-Based High Density Feed - Precision Style */}
      <div className="bg-[#151618] border border-white/[0.04] rounded-xl overflow-hidden shadow-2xl">
         <div className="px-8 py-4 border-b border-white/[0.04] flex items-center justify-between bg-white/[0.01]">
            <div className="flex items-center gap-10">
               <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Artist & Venue</span>
               <span className="hidden md:block text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-32">Status & Progress</span>
            </div>
            <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-white gap-2">
               <Filter size={14} /> Filter
            </Button>
         </div>

         <div className="divide-y divide-white/[0.02]">
            {shows.map((show) => (
              <Link key={show.id} href={`/shows/${show.id}`} className="group flex flex-col md:flex-row md:items-center justify-between px-8 py-5 hover:bg-white/[0.02] cursor-pointer transition-all border-l-2 border-l-transparent hover:border-l-primary">
                <div className="flex items-center gap-6 min-w-0">
                   <div className="h-12 w-12 rounded-xl bg-zinc-900 border border-white/[0.05] flex items-center justify-center text-zinc-600 group-hover:text-primary transition-colors shrink-0 overflow-hidden">
                      {show.artist[0]}
                   </div>
                   <div className="min-w-0">
                      <div className="flex items-center gap-3">
                         <span className="text-lg font-bold text-white tracking-tight group-hover:text-primary transition-colors">{show.artist}</span>
                         <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[9px] font-black uppercase px-2 py-0">ACTIVE</Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-1 underline decoration-zinc-800 underline-offset-4">
                         <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">{show.venue}</span>
                         <span className="h-1 w-1 rounded-full bg-zinc-700" />
                         <span className="text-[11px] font-medium text-zinc-500">{show.date} • {show.city}</span>
                      </div>
                   </div>
                </div>

                <div className="flex items-center gap-12 mt-4 md:mt-0">
                   <div className="flex flex-col items-end gap-2 pr-10 border-r border-white/5">
                      <div className="flex items-center gap-3">
                         <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Materials</span>
                         <span className="text-sm font-bold text-white">{show.progress}/{show.totalItems}</span>
                      </div>
                      <div className="w-32 h-1 bg-zinc-900 rounded-full overflow-hidden">
                         <div 
                           className="h-full bg-emerald-500 transition-all duration-1000" 
                           style={{ width: `${(show.progress / show.totalItems) * 100}%` }}
                         />
                      </div>
                   </div>
                   <div className="h-10 w-10 rounded-lg bg-zinc-900/50 flex items-center justify-center text-zinc-600 group-hover:text-white transition-colors border border-white/[0.02] group-hover:border-white/10 shadow-inner">
                      <ChevronRight size={18} />
                   </div>
                </div>
              </Link>
            ))}
         </div>

         {shows.length === 0 && (
           <div className="py-32 text-center flex flex-col items-center justify-center opacity-40">
              <Layers size={40} className="mb-4 text-zinc-600" />
              <p className="text-lg font-bold text-white">No active shows scheduled</p>
              <p className="text-sm text-zinc-500 mt-1">Import your first show booking to begin tracking deliverables.</p>
           </div>
         )}
      </div>
    </div>
  )
}
