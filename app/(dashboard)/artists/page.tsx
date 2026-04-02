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
        // Fetch reliability directly as it's calculated in the backend/n8n
        const { data, error } = await supabase.from('artists').select('id, name, genre, reliability')

        if (data && !error) {
          const formattedArtists = data.map(artist => ({
            id: artist.id,
            name: artist.name || 'Unknown Artist',
            genre: artist.genre || 'Various',
            shows: '--',
            reliability: artist.reliability ?? 100,
            docsOnTime: '--',
            docsLate: '--',
            firstShow: '--'
          }))

          setArtists(formattedArtists)
        }
      } catch (err) {
        console.error('Failed to load artists:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchArtists()
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
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic text-white">Artist Directory</h1>
          <p className="text-muted-foreground mt-2 font-medium">Manage artist profiles, technical riders, and performance reliability scores.</p>
        </div>
      </div>

      {/* Filters Bar */}
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

      {/* Artists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredArtists.length > 0 ? (
          filteredArtists.map((artist) => {
            const relUI = getReliabilityUI(artist.reliability)
            return (
              <div
                key={artist.id}
                className="group glass-card rounded-3xl p-8 border-white/5 hover:border-primary/30 transition-all duration-500 relative overflow-hidden flex flex-col justify-between h-full hover:shadow-2xl hover:bg-white/[0.02]"
              >
                {/* Background Aesthetics */}
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

                  <div className="mt-10 py-6 border-y border-white/5 space-y-6 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground font-medium">Reliability:</span>
                      <div className="flex items-center gap-3">
                        <strong className="text-white font-pro-data text-2xl">{artist.reliability}/100</strong>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Reliability is calculated by the backend based on historical document submission performance.
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between relative z-10 pt-2">
                    <Badge variant="outline" className={`${relUI.bg} ${relUI.color} uppercase tracking-widest text-[10px] font-bold px-3 py-1.5`}>{relUI.label}</Badge>
                  </div>

                  <Button
                    className="w-full mt-8 bg-white/5 hover:bg-white/10 text-white gap-3 h-12 rounded-xl border border-white/5 group-hover:bg-primary group-hover:text-white transition-all font-pro-data uppercase tracking-widest text-xs"
                    onClick={() => router.push(`/shows`)}
                  >
                    View Shows <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            )
          })
        ) : (
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <div className="glass-card rounded-[2rem] p-16 flex flex-col items-center justify-center text-center border-white/5 bg-muted/5 min-h-[400px]">
              <div className="h-24 w-24 rounded-full bg-muted/20 border border-white/10 flex items-center justify-center mb-6 shadow-inner">
                <UserRound size={40} className="text-muted-foreground/30" />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter italic text-white mb-2">No artists available.</h3>
              <p className="text-muted-foreground font-medium max-w-md">Artists appear here automatically when they are added to the roster.</p>
              <Button
                onClick={() => router.push('/shows')}
                className="mt-8 bg-primary hover:bg-primary/90 text-white gap-3 h-12 px-8 shadow-xl shadow-primary/20 transition-all active:scale-95 font-pro-data uppercase tracking-widest text-xs rounded-xl"
              >
                View Shows
              </Button>
            </div>
          </div>
        )}
      </div>
      <CreateArtistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
