'use client'

import React, { useState } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  Music, 
  Mic, 
  Settings, 
  ExternalLink,
  Users,
  Calendar,
  Layers,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CreateArtistModal } from '@/components/dashboard/create-artist-modal'

// Mock Data for Artists
const mockArtists = [
  {
    id: '1',
    name: 'Luna Shadows',
    genre: 'Electronic / Synthpop',
    shows: 3,
    riderStatus: 'Complete',
    reliability: 98,
    socials: { twitter: '@lunashadows', instagram: '@lunashadows' }
  },
  {
    id: '2',
    name: 'Echo Pulse',
    genre: 'Techno / House',
    shows: 5,
    riderStatus: 'Complete',
    reliability: 85,
    socials: { instagram: '@echopulse_live' }
  },
  {
    id: '3',
    name: 'Neon Dreams',
    genre: 'Future Funk',
    shows: 1,
    riderStatus: 'Pending',
    reliability: 72,
    socials: { twitter: '@ne ondreams' }
  },
  {
    id: '4',
    name: 'The Midnight',
    genre: 'Retrowave',
    shows: 8,
    riderStatus: 'Complete',
    reliability: 94,
    socials: { instagram: '@themidnightofficial' }
  },
  {
    id: '5',
    name: 'Vibrant Pulse',
    genre: 'Indie Dance',
    shows: 2,
    riderStatus: 'Overdue',
    reliability: 45,
    socials: { twitter: '@vibrantpulse' }
  },
  {
    id: '6',
    name: 'Silver Hawk',
    genre: 'Alternative Rock',
    shows: 0,
    riderStatus: 'None',
    reliability: 0,
    socials: { instagram: '@silverhawk_band' }
  }
]

export default function ArtistsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredArtists = mockArtists.filter(artist => 
    artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    artist.genre.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getRiderStatusColor = (status: string) => {
    switch (status) {
      case 'Complete':
        return 'text-emerald-400 opacity-100 group-hover:text-emerald-300 transition-colors'
      case 'Pending':
        return 'text-yellow-400 opacity-100 group-hover:text-yellow-300 transition-colors'
      case 'Overdue':
        return 'text-red-400 opacity-100 group-hover:text-red-300 transition-colors'
      default:
        return 'text-muted-foreground/60 transition-colors'
    }
  }

  const getRiderStatusIcon = (status: string) => {
    switch (status) {
      case 'Complete':
        return <CheckCircle2 size={16} />
      case 'Pending':
        return <Clock size={16} />
      case 'Overdue':
        return <AlertCircle size={16} />
      default:
        return <Layers size={16} />
    }
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic">Artist Directory</h1>
          <p className="text-muted-foreground mt-2 font-medium">Manage artist profiles, technical riders, and performance reliability scores.</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white gap-3 h-12 px-8 shadow-xl shadow-primary/20 transition-all active:scale-95 font-pro-data uppercase tracking-widest text-xs"
        >
          <Plus size={18} />
          <span>Add New Artist</span>
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search roster by artist, genre, or territory..." 
            className="pl-12 h-14 bg-muted/20 border-white/5 focus-visible:ring-primary/50 text-base rounded-2xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-14 px-6 gap-3 border-white/10 bg-muted/20 hover:bg-muted/40 rounded-2xl font-pro-data uppercase tracking-widest text-xs" onClick={() => toast.info('Advanced filters loading...')}>
          <Filter size={18} />
          <span>Filters</span>
        </Button>
      </div>

      {/* Artists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredArtists.map((artist) => (
          <div 
            key={artist.id} 
            className="group glass-card rounded-3xl p-8 border-white/5 hover:border-primary/30 transition-all duration-500 relative overflow-hidden flex flex-col justify-between h-full hover:shadow-2xl hover:bg-muted/5 group cursor-pointer"
            onClick={() => toast.info(`Viewing ${artist.name}'s production profile...`)}
          >
            {/* Background Aesthetics */}
            <div className="absolute -top-12 -right-12 h-40 w-40 bg-primary/20 blur-[100px] rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-700" />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <div className="h-20 w-20 rounded-2xl bg-muted/40 flex items-center justify-center border border-white/5 overflow-hidden group-hover:bg-primary/20 group-hover:border-primary/40 transition-all duration-700 shadow-inner">
                  <Mic size={36} className="text-muted-foreground/40 group-hover:text-primary transition-colors duration-700" />
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="h-10 w-10 border border-white/5 rounded-xl hover:bg-white/10 opacity-60 group-hover:opacity-100 transition-all" onClick={(e) => { e.stopPropagation(); toast.info(`Editing ${artist.name} metadata...`); }}>
                    <Settings size={18} className="text-muted-foreground" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-10 w-10 border border-white/5 rounded-xl hover:bg-white/10 opacity-60 group-hover:opacity-100 transition-all" onClick={(e) => { e.stopPropagation(); toast.info(`Sharing ${artist.name} profile...`); }}>
                    <ExternalLink size={18} className="text-muted-foreground" />
                  </Button>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-2xl font-black tracking-tight text-white group-hover:text-primary transition-colors uppercase italic">{artist.name}</h3>
                <p className="text-sm font-bold text-muted-foreground/60 mt-2 flex items-center gap-2 tracking-tight group-hover:text-white/80 transition-opacity">
                  <Music size={14} className="text-primary/60" />
                  {artist.genre}
                </p>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-8 py-6 border-y border-white/5">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-pro-data uppercase tracking-[0.2em] text-muted-foreground/40 font-bold">Show History</span>
                  <div className="flex items-center gap-2 font-pro-data font-black text-2xl text-white">
                    <Calendar size={18} className="text-primary/60" />
                    {artist.shows > 0 ? artist.shows.toString().padStart(2, '0') : '00'}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-pro-data uppercase tracking-[0.2em] text-muted-foreground/40 font-bold">Reliability</span>
                  <div className="flex flex-col gap-2.5 mt-1.5">
                    <div className="flex-1 h-2 bg-muted/40 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className={`h-full rounded-full shadow-[0_0_10px_rgba(var(--color-primary),0.4)] ${
                          artist.reliability >= 80 ? 'bg-emerald-400' : 
                          artist.reliability >= 50 ? 'bg-yellow-400' : 'bg-red-400'
                        }`}
                        style={{ width: `${artist.reliability}%` }}
                      />
                    </div>
                    <span className="text-xs font-pro-data font-black text-white italic tracking-widest">{artist.reliability}% STATUS</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between text-[11px] font-pro-data uppercase tracking-[0.15em] relative z-10 font-bold">
              <span className="text-muted-foreground/30 group-hover:text-muted-foreground/50 transition-colors">Production Readiness</span>
              <div className={`flex items-center gap-2 ${getRiderStatusColor(artist.riderStatus)}`}>
                {getRiderStatusIcon(artist.riderStatus)}
                {artist.riderStatus}
              </div>
            </div>
          </div>
        ))}

        {/* Create New Artist Action Card */}
        <Button 
          variant="ghost"
          onClick={() => setIsModalOpen(true)}
          className="group relative rounded-3xl border-2 border-dashed border-white/5 hover:border-primary/40 p-10 flex flex-col items-center justify-center text-center gap-6 transition-all hover:bg-primary/5 hover:shadow-2xl h-full border-spacing-4"
        >
          <div className="h-16 w-16 rounded-full border border-dashed border-white/20 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/20 transition-all duration-500 scale-100 group-hover:scale-110">
            <Plus size={36} className="text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <div>
            <span className="block text-xl font-black text-white uppercase italic tracking-tighter transition-colors">Register Artist</span>
            <span className="block text-[10px] font-pro-data uppercase tracking-widest text-muted-foreground/40 mt-3 max-w-[180px] leading-relaxed group-hover:text-muted-foreground/80 transition-colors font-bold">Scale your territory roster.</span>
          </div>
        </Button>
      </div>
      <CreateArtistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
