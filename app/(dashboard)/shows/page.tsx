'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  ChevronDown,
} from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { supabase } from '@/lib/supabase'
import { CreateShowModal } from '@/components/dashboard/create-show-modal'

export default function ShowsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [shows, setShows] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  async function fetchShows() {
    try {
      setIsLoading(true)
      
      // Fetch shows and materials separately to avoid PGRST200 Join errors
      const { data: showsData, error: showsError } = await supabase
        .from('shows')
        .select('id, venue, city, show_date, show_time, status, artist_name, artist_email')
        .order('show_date', { ascending: false })
        
      const { data: materialsData } = await supabase.from('materials').select('show_id, status')

      if (showsError) {
        console.error('Supabase Error:', showsError)
        toast.error('Database Error', {
          description: `Failed to fetch shows: ${showsError.message}`
        })
        return
      }

      if (showsData) {
         const formattedShows = showsData.map((show: any) => {
           const showMaterials = materialsData?.filter(m => m.show_id === show.id) || []
           const delivered = showMaterials.filter(m => m.status?.toLowerCase() === 'delivered' || m.status?.toLowerCase() === 'submitted').length
           const total = showMaterials.length
           
           return {
             id: show.id,
             artist: show.artist_name || 'Unnamed Artist',
             venue: show.venue || 'Venue TBD',
             city: show.city || '',
             date: show.show_date || '',
             time: show.show_time || '',
             deliveredCount: delivered,
             totalCount: total,
             status: show.status || 'pending'
           }
         })

         setShows(formattedShows)
      }
    } catch (err) {
      console.error('System Error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchShows()

    // Real-time listener for shows and materials
    const showSub = supabase.channel('shows-realtime').on('postgres_changes', { event: '*', schema: 'public', table: 'shows' }, () => fetchShows()).subscribe()
    const matSub = supabase.channel('materials-realtime').on('postgres_changes', { event: '*', schema: 'public', table: 'materials' }, () => fetchShows()).subscribe()

    return () => {
      supabase.removeChannel(showSub)
      supabase.removeChannel(matSub)
    }
  }, [])

  const filteredShows = shows.filter(show =>
    (show.artist && show.artist.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (show.venue && show.venue.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (show.city && show.city.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const getStatusUI = (status: string) => {
    const s = status.toLowerCase()
    if (s === 'confirmed' || s === 'completed') return { label: 'Confirmed', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' }
    if (s === 'pending' || s === 'awaiting') return { label: 'Awaiting Documents', color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20' }
    if (s === 'cancelled') return { label: 'Cancelled', color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20' }
    return { label: status, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' }
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic text-white">Manage Shows</h1>
          <p className="text-muted-foreground mt-2 font-medium">Manage your shows and ensure your artists deliver the required documents.</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="h-12 px-8 bg-primary text-white hover:bg-primary/90 shadow-xl shadow-primary/20 gap-3 font-pro-data uppercase tracking-widest text-xs rounded-xl"
        >
          <Plus size={18} />
          Add Show
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/60" />
          <Input
            placeholder="Search by artist or venue..."
            className="pl-12 h-14 bg-muted/20 border-white/5 focus-visible:ring-primary/50 text-base rounded-2xl font-bold tracking-tight"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-14 px-8 gap-3 border-white/10 bg-muted/20 hover:bg-muted/40 rounded-2xl font-pro-data uppercase tracking-widest text-xs">
              <Filter size={18} />
              <span>All Shows</span>
              <ChevronDown size={14} className="ml-2 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-ebony-900 border-white/10 text-white rounded-xl">
            <DropdownMenuItem className="hover:bg-white/5">Confirmed Only</DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-white/5">Awaiting Docs</DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-white/5">Recently Added</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="glass-card rounded-[2.5rem] overflow-hidden border-white/5 bg-muted/5 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-muted/20">
                <th className="px-8 py-6 font-pro-data uppercase tracking-widest text-[10px] font-black text-muted-foreground/60">Artist</th>
                <th className="px-8 py-6 font-pro-data uppercase tracking-widest text-[10px] font-black text-muted-foreground/60">Venue</th>
                <th className="px-8 py-6 font-pro-data uppercase tracking-widest text-[10px] font-black text-muted-foreground/60">City</th>
                <th className="px-8 py-6 font-pro-data uppercase tracking-widest text-[10px] font-black text-muted-foreground/60">Show Date</th>
                <th className="px-8 py-6 font-pro-data uppercase tracking-widest text-[10px] font-black text-muted-foreground/60">Show Time</th>
                <th className="px-8 py-6 font-pro-data uppercase tracking-widest text-[10px] font-black text-muted-foreground/60">Documents</th>
                <th className="px-8 py-6 font-pro-data uppercase tracking-widest text-[10px] font-black text-muted-foreground/60">Status</th>
                <th className="px-8 py-6 font-pro-data uppercase tracking-widest text-[10px] font-black text-muted-foreground/60">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                   <td colSpan={8} className="px-8 py-20 text-center animate-pulse font-pro-data uppercase tracking-widest text-[10px] font-bold text-muted-foreground/40">Fetching active roster...</td>
                </tr>
              ) : filteredShows.length > 0 ? (
                filteredShows.map((show) => {
                  const statusUI = getStatusUI(show.status)
                  return (
                    <tr 
                      key={show.id} 
                      className="group hover:bg-white/[0.02] transition-colors cursor-pointer"
                      onClick={() => router.push(`/shows/${show.id}`)}
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <strong className="text-white text-lg font-black uppercase italic tracking-tighter group-hover:text-primary transition-colors">{show.artist}</strong>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm font-bold text-white/80">{show.venue}</td>
                      <td className="px-8 py-6 text-sm font-medium text-muted-foreground">{show.city}</td>
                      <td className="px-8 py-6 text-sm font-bold text-white font-pro-data">{show.date}</td>
                      <td className="px-8 py-6 text-sm font-bold text-white font-pro-data">{show.time}</td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary transition-all duration-1000" 
                              style={{ width: `${show.totalCount > 0 ? (show.deliveredCount / show.totalCount) * 100 : 0}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-pro-data font-black text-muted-foreground uppercase tracking-widest">
                            {show.deliveredCount}/{show.totalCount}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <Badge variant="outline" className={`${statusUI.bg} ${statusUI.color} uppercase tracking-widest text-[9px] font-bold px-3 py-1.5 border`}>
                          {statusUI.label}
                        </Badge>
                      </td>
                      <td className="px-8 py-6" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground/30 hover:text-white rounded-xl">
                              <MoreHorizontal size={18} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-ebony-900 border-white/10 text-white rounded-xl">
                             <DropdownMenuItem className="hover:bg-white/5" onClick={() => router.push(`/shows/${show.id}`)}>View Details</DropdownMenuItem>
                             <DropdownMenuItem className="hover:bg-white/5">Edit Show</DropdownMenuItem>
                             <DropdownMenuItem className="hover:bg-red-500/20 text-red-500">Cancel Show</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={8} className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Music size={40} className="text-muted-foreground/20" />
                      <p className="text-muted-foreground font-medium">No shows found matching your criteria.</p>
                      <Button variant="link" onClick={() => setSearchQuery('')} className="text-primary uppercase tracking-widest text-[10px] font-bold">Clear Filters</Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <CreateShowModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); fetchShows(); }} />
    </div>
  )
}
