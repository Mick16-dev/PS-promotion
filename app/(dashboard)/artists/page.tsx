'use client'

import React, { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  User, 
  Mail, 
  Calendar, 
  ChevronRight,
  Star,
  ShieldCheck,
  Music
} from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'

export default function ArtistsPage() {
  const [artists, setArtists] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  async function fetchArtists() {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('artists')
        .select('id, name, email, reliability_score, shows_completed')
        .order('name')
      
      if (error) throw error
      setArtists(data || [])
    } catch (err: any) {
      console.error('Error loading artists:', err)
      toast.error('Sync Error', { description: 'Could not access the artist roster.' })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchArtists()

    const sub = supabase.channel('artists-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'artists' }, () => fetchArtists())
      .subscribe()

    return () => {
      supabase.removeChannel(sub)
    }
  }, [])

  const filteredArtists = artists.filter(artist => 
    artist.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    artist.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-10 w-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-1000 pb-20 max-w-7xl mx-auto pt-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-bold tracking-tight text-white leading-none">Your Roster</h1>
          <p className="text-muted-foreground mt-4 font-medium text-sm max-w-md leading-relaxed opacity-60">
            View and manage artist profiles and their overall performance reliability.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-white transition-colors h-4 w-4" />
          <Input 
            placeholder="Search roster by artist..." 
            className="h-14 pl-14 bg-white/[0.02] border-white/5 rounded-2xl focus:ring-1 focus:ring-white/20 focus:border-white/20 transition-all font-medium text-white placeholder:text-muted-foreground/30 shadow-inner"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-14 px-8 rounded-2xl bg-white/[0.02] border-white/5 hover:bg-white/5 gap-3 font-bold text-xs uppercase tracking-widest text-muted-foreground hover:text-white">
          <Filter size={16} /> Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArtists.length > 0 ? (
          filteredArtists.map((artist) => (
            <div key={artist.id} className="group glass-card p-4 rounded-[2.5rem] border-white/5 bg-white/[0.015] hover:bg-white/[0.04] transition-all duration-700 relative overflow-hidden flex flex-col items-center text-center">
               <div className="h-24 w-24 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                  <span className="text-3xl font-bold text-white/20 group-hover:text-white transition-colors">
                    {artist.name?.charAt(0)}
                  </span>
               </div>
               
               <h3 className="text-2xl font-bold tracking-tight text-white mb-1">{artist.name}</h3>
               <p className="text-xs font-bold text-muted-foreground/40 uppercase tracking-widest mb-10">{artist.email || 'No email saved'}</p>

               <div className="w-full flex items-center justify-between px-6 mb-10 pt-10 border-t border-white/5">
                  <div className="flex flex-col items-start">
                     <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/20 mb-2">Reliability</span>
                     <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-white leading-none">{artist.reliability_score || 100}%</span>
                        <ShieldCheck size={14} className="text-emerald-500/60" />
                     </div>
                  </div>
                  <div className="flex flex-col items-end">
                     <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/20 mb-2">Total Shows</span>
                     <span className="text-xl font-bold text-white leading-none">{artist.shows_completed || 0}</span>
                  </div>
               </div>

               <Button className="w-full h-14 bg-white/[0.03] hover:bg-white/[0.08] text-white rounded-[1.5rem] border border-white/5 font-bold text-sm tracking-tight gap-3 transition-all">
                  Contact Artist <ChevronRight size={14} />
               </Button>
            </div>
          ))
        ) : (
          <div className="col-span-full py-40 flex flex-col items-center justify-center text-center opacity-30 gap-6">
             <div className="h-20 w-20 rounded-3xl bg-white/5 flex items-center justify-center">
                <User size={32} />
             </div>
             <div>
                <h3 className="text-xl font-bold uppercase tracking-widest">Empty Roster.</h3>
                <p className="text-sm font-medium mt-2">Artists will appear here as soon as you create a show.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  )
}
