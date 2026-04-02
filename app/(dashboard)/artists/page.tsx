'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search,
  Filter,
  Music,
  ArrowRight,
  UserRound
} from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'
import { CreateArtistModal } from '@/components/dashboard/create-artist-modal'

export default function ArtistsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [artists, setArtists] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  React.useEffect(() => {
    async function fetchArtists() {
      try {
        setIsLoading(true)
        const { data, error } = await supabase
          .from('artists')
          .select('id, name, genre, reliability_score, shows_completed')

        if (error) {
          console.error('Supabase Error:', error)
          toast.error('Database Error', {
            description: `Failed to load artists: ${error.message}`
          })
          return
        }

        if (data) {
          const formattedArtists = data.map((artist: any) => ({
            id: artist.id,
            name: artist.name || 'Unknown Artist',
            genre: artist.genre || 'Various',
            shows: artist.shows_completed || 0,
            reliability: artist.reliability_score ?? 100
          }))
          setArtists(formattedArtists)
        }
      } catch (err) {
        console.error('System Error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchArtists()

    const subscription = supabase
      .channel('artist-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'artists' }, () => {
        fetchArtists()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [])

  const filteredArtists = artists.filter(artist =>
    (artist.name && artist.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (artist.genre && artist.genre.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const getReliabilityUI = (score: number) => {
    if (score >= 80) return { label: 'Reliable', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' }
    if (score >= 50) return { label: 'Inconsistent', color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20' }
    return { label: 'Unreliable', color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20' }
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic text-white">Artist Directory</h1>
          <p className="text-muted-foreground mt-2 font-medium">Manage artist profiles, technical riders, and performance reliability scores.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/60" />
          <Input
            placeholder="Search roster by artist..."
            className="pl-12 h-14 bg-muted/20 border-white/5 focus-visible:ring-primary/50 text-base rounded-2xl font-bold tracking-tight"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-14 px-8 gap-3 border-white/10 bg-muted/20 hover:bg-muted/40 rounded-2xl font-pro-data uppercase tracking-widest text-xs">
          <Filter size={18} />
          <span>Filters</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          <div className="col-span-full py-20 text-center animate-pulse text-muted-foreground font-black uppercase tracking-widest text-xs">Loading Roster...</div>
        ) : filteredArtists.length > 0 ? (
          filteredArtists.map((artist) => {
            const relUI = getReliabilityUI(artist.reliability)
            return (
              <div key={artist.id} className="group glass-card rounded-3xl p-8 border-white/5 hover:border-primary/30 transition-all duration-500 relative overflow-hidden flex flex-col justify-between h-full hover:shadow-2xl hover:bg-white/[0.02]">
                <div className="absolute -top-12 -right-12 p-8 opacity-0 group-hover:opacity-10 transition-opacity duration-700 rotate-12 pointer-events-none">
                  <UserRound size={160} className="text-primary" />
                </div>

                <div className="relative z-10 flex flex-col h-full">
                  <div>
                    <h3 className="text-3xl font-black tracking-tighter text-white group-hover:text-primary transition-colors uppercase italic leading-none">{artist.name}</h3>
                    <p className="text-sm font-bold text-muted-foreground/80 mt-3 flex items-center gap-2 tracking-tight">
                      <Music size={14} className="text-primary/60" />
                      {artist.genre}
                    </p>
                  </div>

                  <div className="flex flex-col gap-4 py-6 my-8 border-y border-white/5 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground font-medium uppercase tracking-[0.1em] text-[10px] font-pro-data">Shows Completed:</span>
                      <Badge variant="secondary" className="bg-white/5 text-white font-bold px-3 py-1 rounded-lg border border-white/5">{artist.shows}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground font-medium uppercase tracking-[0.1em] text-[10px] font-pro-data">Reliability:</span>
                      <div className="flex items-center gap-3">
                        <strong className="text-white font-pro-data text-2xl">{artist.reliability}/100</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between relative z-10">
                    <Badge variant="outline" className={`${relUI.bg} ${relUI.color} uppercase tracking-widest text-[10px] font-bold px-3 py-1.5`}>{relUI.label}</Badge>
                    <Button
                      variant="ghost" 
                      className="text-white gap-3 h-10 px-4 rounded-xl border border-white/5 hover:bg-primary transition-all font-pro-data uppercase tracking-widest text-[10px]"
                      onClick={() => router.push(`/shows`)}
                    >
                      View Shows <ArrowRight size={12} />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="col-span-full">
            <div className="glass-card rounded-[2rem] p-16 flex flex-col items-center justify-center text-center border-white/5 bg-muted/5 min-h-[400px]">
              <div className="h-24 w-24 rounded-full bg-muted/20 border border-white/10 flex items-center justify-center mb-6 shadow-inner">
                <UserRound size={40} className="text-muted-foreground/30" />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter italic text-white mb-2">No artists available.</h3>
              <p className="text-muted-foreground font-medium max-w-md">Artists appear here automatically when they are added to the roster.</p>
            </div>
          </div>
        )}
      </div>
      <CreateArtistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
