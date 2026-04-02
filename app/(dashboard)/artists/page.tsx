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
  Music,
  ShieldCheck,
  AlertCircle
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
      toast.error('Database Error', {
        description: err.message || 'Failed to load artists'
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchArtists()

    const sub = supabase.channel('artists-sync')
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
        <div className="animate-pulse flex flex-col items-center gap-4 text-muted-foreground">
          <User className="h-8 w-8 animate-bounce text-primary/50" />
          <p className="font-pro-data uppercase tracking-widest text-xs font-bold">Accessing Artist Database...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700 pb-20 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic text-white leading-none">Artist Directory</h1>
          <p className="text-muted-foreground mt-4 font-medium uppercase text-xs tracking-widest font-pro-data opacity-60">Manage profiles and performance reliability scores.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors h-4 w-4" />
          <Input 
            placeholder="Search roster by artist..." 
            className="h-14 pl-14 bg-muted/10 border-white/5 rounded-2xl focus:ring-primary/20 focus:border-primary/40 transition-all font-medium text-white placeholder:text-muted-foreground/30"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-14 px-8 rounded-2xl bg-muted/5 border-white/5 hover:bg-white/5 gap-3 font-pro-data uppercase tracking-widest text-[10px] w-full md:w-auto">
          <Filter size={16} /> Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArtists.length > 0 ? (
          filteredArtists.map((artist) => (
            <div key={artist.id} className="glass-card p-10 rounded-[2.5rem] border-white/5 bg-muted/5 hover:bg-white/[0.03] hover:border-white/10 transition-all duration-500 group relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity rotate-12">
                  <User size={100} className="text-primary" />
               </div>
               
               <div className="flex items-start justify-between mb-8">
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xl shadow-primary/5 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    <User size={32} />
                  </div>
                  <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground/30 hover:text-white rounded-xl">
                    <MoreHorizontal size={18} />
                  </Button>
               </div>

               <div className="space-y-1">
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white">{artist.name}</h3>
                  <p className="text-xs text-muted-foreground font-bold flex items-center gap-2 font-pro-data opacity-60">
                    <Mail size={12} className="text-primary/40" />
                    {artist.email || 'No email provided'}
                  </p>
               </div>

               <div className="mt-10 pt-8 border-t border-white/5 grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-[10px] font-pro-data text-muted-foreground/30 uppercase tracking-[0.2em] font-black mb-2">Reliability</p>
                    <div className="flex items-center gap-3">
                         <span className="text-2xl font-black italic tracking-tighter text-white">{artist.reliability_score || 100}%</span>
                         { (artist.reliability_score || 100) >= 90 && <ShieldCheck size={16} className="text-emerald-500" /> }
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-pro-data text-muted-foreground/30 uppercase tracking-[0.2em] font-black mb-2">Shows</p>
                    <p className="text-2xl font-black italic tracking-tighter text-white">{artist.shows_completed || 0}</p>
                  </div>
               </div>

               <Button className="w-full mt-10 h-14 bg-white/5 hover:bg-white/10 text-white rounded-2xl border border-white/5 font-pro-data uppercase tracking-widest text-[10px] gap-3 group-hover:bg-primary group-hover:border-primary transition-all duration-500">
                  Detailed Intelligence <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
               </Button>
            </div>
          ))
        ) : (
          <div className="col-span-full py-32 flex flex-col items-center justify-center text-center opacity-40">
             <div className="h-24 w-24 rounded-3xl bg-muted/20 border border-white/5 flex items-center justify-center mb-6">
                <Search size={40} />
             </div>
             <h3 className="text-2xl font-black uppercase tracking-tighter italic">No Artists Available.</h3>
             <p className="max-w-sm text-sm font-medium mt-2">Artists appear here automatically when they are added to the roster via show creation.</p>
          </div>
        )}
      </div>
    </div>
  )
}
