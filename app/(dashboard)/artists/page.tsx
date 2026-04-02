'use client'

import React, { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  Plus, 
  User, 
  Mail, 
  Star, 
  ChevronRight,
  MoreVertical,
  Music,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

export default function ArtistsPage() {
  const [artists, setArtists] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  async function fetchArtists() {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('artists')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error
      setArtists(data || [])
    } catch (err: any) {
      console.error('Fetch Error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchArtists()
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
              <span className="text-zinc-300 text-xs font-bold">Artist Directory</span>
           </div>
           <h1 className="text-4xl font-bold tracking-tight text-white inline-flex items-center gap-3">
             Roster <span className="text-zinc-600 font-medium">Management</span>
           </h1>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative group mr-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-zinc-300 transition-colors" size={16} />
              <input 
                placeholder="Search artist name..." 
                className="bg-zinc-900 border border-white/[0.05] rounded-lg h-10 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-white/20 transition-all w-[240px]"
              />
           </div>
           <Button className="h-10 bg-white hover:bg-zinc-200 text-[#0B0C0E] font-bold text-sm px-5 rounded-lg shadow-xl shadow-white/5 gap-2">
             <Plus size={16} strokeWidth={3} /> Add Artist
           </Button>
        </div>
      </div>

      {/* Senior Grid Pattern - Deep Obsidian Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {artists.map((artist) => (
          <div key={artist.id} className="bg-[#151618] border border-white/[0.04] rounded-xl p-6 hover:border-white/[0.08] transition-all group cursor-pointer shadow-xl">
             <div className="flex items-start justify-between mb-8">
                <div className="h-14 w-14 rounded-2xl bg-zinc-900 border border-white/[0.05] flex items-center justify-center text-zinc-600 group-hover:text-primary transition-colors text-2xl font-black">
                   {artist.name[0]}
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-700 hover:text-white rounded-lg">
                   <MoreVertical size={16} />
                </Button>
             </div>
             
             <div>
                <h3 className="text-xl font-bold text-white tracking-tight mb-1 group-hover:text-primary transition-colors">{artist.name}</h3>
                <div className="flex items-center gap-2 text-zinc-500 mb-6">
                   <Mail size={12} />
                   <span className="text-xs font-medium">{artist.email || 'no-email@roster.com'}</span>
                </div>

                <div className="pt-6 border-t border-white/[0.02] flex items-center justify-between">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Reliability</p>
                      <div className="flex items-center gap-1.5">
                         <Star size={12} className="text-amber-500 fill-amber-500" />
                         <span className="text-sm font-bold text-zinc-300">{artist.reliability_score || '9.8'}</span>
                      </div>
                   </div>
                   <div className="text-right space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Total Shows</p>
                      <span className="text-sm font-bold text-zinc-300">{artist.shows_completed || '12'}</span>
                   </div>
                </div>
             </div>
          </div>
        ))}
      </div>

      {artists.length === 0 && (
         <div className="py-20 text-center flex flex-col items-center justify-center opacity-40">
            <User size={40} className="mb-4 text-zinc-600" />
            <p className="text-lg font-bold text-white">No Artists in Roster</p>
            <p className="text-sm text-zinc-500 mt-1">Start adding artists to your manage their production timeline.</p>
         </div>
      )}
    </div>
  )
}
