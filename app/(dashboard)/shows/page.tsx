'use client'

import React, { useState, useEffect } from 'react'
import { 
  Search, 
  Plus, 
  MapPin, 
  Calendar, 
  User, 
  ChevronRight, 
  Filter,
  CheckCircle2,
  Clock4,
  AlertCircle,
  MoreVertical,
  ArrowRight
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'

export default function ShowsPage() {
  const router = useRouter()
  const [shows, setShows] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  async function fetchShows() {
    try {
      setIsLoading(true)
      const { data: showsData, error: showsError } = await supabase
        .from('shows')
        .select('*')
        .order('show_date', { ascending: true })

      if (showsError) throw showsError

      const { data: materialsData } = await supabase
        .from('materials')
        .select('show_id, status')

      if (showsData) {
        const formattedShows = showsData.map((show: any) => {
          const showMaterials = materialsData?.filter((m: any) => m.show_id === show.id) || []
          const delivered = showMaterials.filter((m: any) => m.status?.toLowerCase() === 'delivered' || m.status?.toLowerCase() === 'submitted').length
          // Consistent 5-doc human standard
          const total = showMaterials.length > 0 ? showMaterials.length : 5
          
          return {
            id: show.id,
            artist: show.artist_name,
            venue: show.venue,
            city: show.city,
            date: show.show_date,
            status: show.status || 'Planned',
            progress: delivered,
            totalItems: total
          }
        })
        setShows(formattedShows)
      }
    } catch (err: any) {
      console.error('Error loading shows:', err)
      toast.error('Sync Error', { description: 'Could not reach the show database.' })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchShows()

    const sub = supabase.channel('shows-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'shows' }, () => fetchShows())
      .subscribe()

    return () => {
      supabase.removeChannel(sub)
    }
  }, [])

  const filteredShows = shows.filter(show => 
    show.artist?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    show.venue?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-10 w-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-7xl mx-auto pb-20 pt-4">
      {/* Human-Centric Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-bold tracking-tight text-white leading-none">Your Shows</h1>
          <p className="text-muted-foreground mt-4 font-medium text-sm max-w-lg leading-relaxed">
            Track document progress and manage artist deliverables for upcoming performances.
          </p>
        </div>
        <Button className="h-14 px-8 rounded-2xl bg-white text-black hover:bg-white/90 gap-3 font-bold text-sm tracking-tight transition-transform active:scale-95 shadow-2xl shadow-white/10">
          <Plus size={20} /> Create New Show
        </Button>
      </div>

      {/* Modern Search & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-white transition-colors h-4 w-4" />
          <Input 
            placeholder="Search by artist or venue..." 
            className="h-14 pl-14 bg-white/[0.02] border-white/5 rounded-2xl focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-all font-medium text-white placeholder:text-muted-foreground/30 shadow-inner"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-14 px-8 rounded-2xl bg-white/[0.02] border-white/5 hover:bg-white/5 gap-3 font-bold text-xs uppercase tracking-widest w-full md:w-auto text-muted-foreground hover:text-white">
          <Filter size={16} /> Filters
        </Button>
      </div>

      {/* Shows List - Clean & Professional */}
      <div className="grid grid-cols-1 gap-4">
        {filteredShows.length > 0 ? (
          filteredShows.map((show) => (
            <div 
              key={show.id} 
              onClick={() => router.push(`/shows/${show.id}`)}
              className="group glass-card p-4 rounded-[2rem] border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-500 cursor-pointer flex flex-col md:flex-row items-center gap-6"
            >
              <div className="h-16 w-16 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:scale-105 transition-transform">
                <User size={24} className="text-white/20 group-hover:text-white transition-colors" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-4 mb-1">
                   <h3 className="text-xl font-bold text-white tracking-tight truncate">{show.artist}</h3>
                   <div className="h-1 w-1 rounded-full bg-white/20" />
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
                      <span className="text-lg font-bold text-white leading-none">{show.progress}/{show.totalItems}</span>
                   </div>
                   <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white transition-all duration-1000 shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                        style={{ width: `${(show.progress / show.totalItems) * 100}%` }}
                      />
                   </div>
                </div>
                
                <div className="h-12 w-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                   <ArrowRight size={18} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-40 flex flex-col items-center justify-center text-center opacity-30 gap-6">
             <div className="h-20 w-20 rounded-3xl bg-white/5 flex items-center justify-center">
                <Calendar size={32} />
             </div>
             <div>
                <h3 className="text-xl font-bold">No shows found.</h3>
                <p className="text-sm font-medium mt-2">Try adjusting your search or create a new show.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  )
}
