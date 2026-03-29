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

// Mock Data for Artists
const mockArtists = [
  {
    id: '1',
    name: 'Luna Shadows',
    genre: 'Electronic / Synthpop',
    shows: 3,
    riderStatus: 'Complete',
    socials: { twitter: '@lunashadows', instagram: '@lunashadows' }
  },
  {
    id: '2',
    name: 'Echo Pulse',
    genre: 'Techno / House',
    shows: 5,
    riderStatus: 'Complete',
    socials: { instagram: '@echopulse_live' }
  },
  {
    id: '3',
    name: 'Neon Dreams',
    genre: 'Future Funk',
    shows: 1,
    riderStatus: 'Pending',
    socials: { twitter: '@ne ondreams' }
  },
  {
    id: '4',
    name: 'The Midnight',
    genre: 'Retrowave',
    shows: 8,
    riderStatus: 'Complete',
    socials: { instagram: '@themidnightofficial' }
  },
  {
    id: '5',
    name: 'Vibrant Pulse',
    genre: 'Indie Dance',
    shows: 2,
    riderStatus: 'Overdue',
    socials: { twitter: '@vibrantpulse' }
  },
  {
    id: '6',
    name: 'Silver Hawk',
    genre: 'Alternative Rock',
    shows: 0,
    riderStatus: 'None',
    socials: { instagram: '@silverhawk_band' }
  }
]

export default function ArtistsPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const getRiderStatusColor = (status: string) => {
    switch (status) {
      case 'Complete':
        return 'text-emerald-400 group-hover:text-emerald-300 transition-colors'
      case 'Pending':
        return 'text-yellow-400 group-hover:text-yellow-300 transition-colors'
      case 'Overdue':
        return 'text-red-400 group-hover:text-red-300 transition-colors'
      default:
        return 'text-muted-foreground group-hover:text-foreground transition-colors'
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
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Artist Directory</h1>
          <p className="text-muted-foreground mt-1">Manage artist profiles, technical riders, and upcoming performance schedules.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white gap-2 h-11 px-6 shadow-lg shadow-primary/20 transition-all active:scale-95 leading-none">
          <Plus size={18} />
          <span>Add New Artist</span>
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search artists, genres, or socials..." 
            className="pl-10 h-11 bg-muted/30 border-white/5 focus-visible:ring-primary/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-11 gap-2 border-white/10 bg-muted/20 hover:bg-muted/40">
          <Filter size={16} />
          <span>Filters</span>
        </Button>
      </div>

      {/* Artists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockArtists.map((artist) => (
          <div 
            key={artist.id} 
            className="group glass-card rounded-2xl p-6 border-white/5 hover:border-primary/20 transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-full hover:shadow-2xl hover:bg-white/[0.03]"
          >
            {/* Background Glow */}
            <div className="absolute -top-12 -right-12 h-32 w-32 bg-primary/20 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <div className="h-16 w-16 rounded-xl bg-muted/50 flex items-center justify-center border border-white/5 overflow-hidden group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-500">
                  <Mic size={28} className="text-muted-foreground/60 group-hover:text-primary transition-colors duration-500" />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-white/10">
                    <Settings size={18} className="text-muted-foreground" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-white/10">
                    <ExternalLink size={18} className="text-muted-foreground" />
                  </Button>
                </div>
              </div>

              <div className="mt-5">
                <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-primary transition-colors">{artist.name}</h3>
                <p className="text-sm font-medium text-muted-foreground mt-1 flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                  <Music size={14} className="text-primary/60" />
                  {artist.genre}
                </p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-pro-data uppercase tracking-widest text-muted-foreground/60">Shows</span>
                  <div className="flex items-center gap-1.5 font-pro-data font-bold text-lg text-white">
                    <Calendar size={14} className="text-primary/60" />
                    {artist.shows}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-pro-data uppercase tracking-widest text-muted-foreground/60">Rider Status</span>
                  <div className={`flex items-center gap-1.5 font-medium text-sm mt-1.5 ${getRiderStatusColor(artist.riderStatus)}`}>
                    {getRiderStatusIcon(artist.riderStatus)}
                    {artist.riderStatus}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-xs font-pro-data uppercase tracking-wider relative z-10">
              <span className="text-muted-foreground/60 group-hover:text-white transition-colors">Registered</span>
              <span className="text-foreground/80 group-hover:text-primary transition-colors">March 2024</span>
            </div>
          </div>
        ))}

        {/* Create New Artist Placeholder Card */}
        <button className="group relative rounded-2xl border-2 border-dashed border-white/5 hover:border-primary/40 p-6 flex flex-col items-center justify-center text-center gap-4 transition-all hover:bg-primary/5 hover:shadow-2xl">
          <div className="h-14 w-14 rounded-full bg-muted/30 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300 scale-100 group-hover:scale-110">
            <Plus size={32} className="text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <div>
            <span className="block text-lg font-bold text-muted-foreground group-hover:text-white transition-colors mt-2">Add New Artist</span>
            <span className="block text-sm text-muted-foreground/60 mt-1 max-w-[140px] px-2 leading-relaxed">Expand your roster for upcoming show assignments.</span>
          </div>
        </button>
      </div>
    </div>
  )
}
