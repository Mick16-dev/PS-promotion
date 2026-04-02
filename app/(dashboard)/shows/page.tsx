'use client'

import React, { useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  MapPin, 
  Music,
  ExternalLink,
  ChevronDown
} from 'lucide-react'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CreateShowModal } from '@/components/dashboard/create-show-modal'
import { supabase } from '@/lib/supabase'

// Removed static mock array format in favor of Supabase fetching

export default function ShowsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Shows')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [shows, setShows] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchShows = useCallback(async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('shows')
        .select(`
          id,
          venue_name,
          city,
          date,
          time,
          status,
          artist:artist_id ( name ),
          materials ( status )
        `)
        
      if (data && !error) {
         const formattedShows = data.map(show => {
           const artistInfo = Array.isArray(show.artist) ? show.artist[0] : show.artist
          const artistName = artistInfo?.name || 'Unnamed Artist'
           
           let delivered = 0
           let total = show.materials?.length || 0
           
           if (show.materials) {
              show.materials.forEach((mat: any) => {
                 if (mat.status?.toLowerCase() === 'delivered' || mat.status?.toLowerCase() === 'submitted') {
                    delivered++
                 }
              })
           }
           
           let dateStr = show.date
           if (show.date) {
             try {
               dateStr = new Date(show.date).toLocaleDateString(undefined, {
                 year: 'numeric',
                 month: 'short',
                 day: 'numeric'
               })
             } catch(e) {}
           }
           
           return {
             id: show.id,
             artist: artistName,
            venue: show.venue_name || 'Venue TBD',
             city: show.city || '',
             date: dateStr || 'TBD',
             time: show.time || 'TBD',
             status: show.status || 'Upcoming',
             docsDelivered: delivered,
             docsTotal: total
           }
         })
         
         setShows(formattedShows)
      }
    } catch (err) {
      console.error("Failed to fetch shows:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchShows()
  }, [fetchShows])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
      case 'Awaiting Documents':
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">Awaiting Documents</Badge>
      case 'Upcoming':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">Upcoming</Badge>
      case 'Ready':
        return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Ready</Badge>
      case 'Show Day':
        return <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30 shadow-[0_0_10px_rgba(var(--color-primary),0.2)]">Show Day</Badge>
      case 'Complete':
        return <Badge variant="outline" className="bg-muted text-muted-foreground border-border">Complete</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getDocumentsBadge = (delivered: number, total: number) => {
    const ratio = delivered / total;
    if (ratio === 1) {
      return <span className="text-emerald-400 font-bold">{delivered}/{total} delivered</span>
    } else if (ratio > 0.5) {
      return <span className="text-emerald-400 font-bold">{delivered}/{total} delivered</span>
    } else {
      return <span className="text-red-400 font-bold">{delivered}/{total} delivered</span>
    }
  }

  const filteredShows = shows.filter(show => {
    const venueName = show.venue || ''
    const matchesSearch = show.artist.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          venueName.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Map 'Awaiting Documents' filter to also match raw 'pending' status from Supabase
    const normalizedStatus = (show.status === 'pending') ? 'Awaiting Documents' : show.status
    const matchesFilter = statusFilter === 'All Shows' || normalizedStatus === statusFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic text-white">Manage Shows</h1>
          <p className="text-muted-foreground mt-2 font-medium">Manage your shows and ensure your artists deliver the required documents.</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white gap-3 h-12 px-8 shadow-xl shadow-primary/20 transition-all active:scale-95 font-pro-data uppercase tracking-widest text-xs rounded-xl"
        >
          <Plus size={18} />
          <span>Add Show</span>
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/60" />
          <Input 
            placeholder="Search by artist or venue..." 
            className="pl-12 h-14 bg-muted/20 border-white/5 focus-visible:ring-primary/50 text-base font-bold tracking-tight rounded-2xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-14 px-6 gap-3 border-white/10 bg-muted/20 hover:bg-muted/40 font-pro-data uppercase tracking-widest text-xs rounded-2xl min-w-[200px] justify-between">
              <div className="flex items-center gap-3">
                <Filter size={18} />
                <span>{statusFilter}</span>
              </div>
              <ChevronDown size={14} className="opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-ebony-900 border-white/10 rounded-2xl">
            <DropdownMenuLabel className="font-pro-data uppercase tracking-widest text-[10px] text-muted-foreground/60 px-4 py-3">Filter Status</DropdownMenuLabel>
            {['All Shows', 'Awaiting Documents', 'Ready', 'Complete', 'Show Day'].map((status) => (
              <DropdownMenuItem 
                key={status} 
                className={`font-semibold text-sm py-3 px-4 rounded-xl cursor-pointer ${statusFilter === status ? 'bg-primary/10 text-primary' : ''}`}
                onClick={() => setStatusFilter(status)}
              >
                {status}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Shows Table Container */}
      <div className="glass-card rounded-3xl overflow-hidden border-white/5 shadow-2xl bg-muted/5">
        <Table>
          <TableHeader className="bg-muted/20">
            <TableRow className="hover:bg-transparent border-white/5 font-pro-data uppercase tracking-widest text-[10px] text-muted-foreground font-bold">
              <TableHead className="w-[280px] py-6 px-8">Artist</TableHead>
              <TableHead className="py-6">Venue</TableHead>
              <TableHead className="py-6">City</TableHead>
              <TableHead className="py-6">Show Date</TableHead>
              <TableHead className="py-6">Show Time</TableHead>
              <TableHead className="py-6">Documents</TableHead>
              <TableHead className="py-6">Status</TableHead>
              <TableHead className="text-right py-6 px-8">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-white/5">
            {filteredShows.length > 0 ? (
              filteredShows.map((show) => (
                <TableRow key={show.id} className="group border-0 hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => router.push(`/shows/${show.id}`)}>
                  <TableCell className="py-5 px-8">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                        <Music size={20} />
                      </div>
                      <div className="font-bold text-white text-lg tracking-tight group-hover:text-primary transition-colors">
                          {show.artist}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-muted-foreground/40" />
                        {show.venue}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-muted-foreground">
                    {show.city}
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-foreground">
                      {show.date}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-pro-data font-bold tracking-widest text-muted-foreground">
                      {show.time}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-[12px] font-pro-data uppercase tracking-widest">
                      {getDocumentsBadge(show.docsDelivered, show.docsTotal)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(show.status)}
                  </TableCell>
                  <TableCell className="text-right px-8">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-white/10 group">
                          <MoreHorizontal className="h-5 w-5 text-muted-foreground group-hover:text-white transition-colors" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 bg-ebony-900/95 backdrop-blur-xl border-white/10 rounded-2xl p-2 shadow-2xl">
                        <DropdownMenuLabel className="font-pro-data uppercase text-[10px] tracking-widest text-muted-foreground/50 py-2 px-3">Show Options</DropdownMenuLabel>
                        <DropdownMenuItem 
                          className="gap-3 cursor-pointer h-12 px-3 rounded-xl font-bold bg-primary/10 text-primary mb-1 hover:bg-primary/20"
                          onClick={(e) => { e.stopPropagation(); router.push(`/shows/${show.id}`) }}
                        >
                          <ExternalLink size={16} /> 
                          <span>View Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/5 mx-2 my-1" />
                        <DropdownMenuItem 
                          className="gap-3 cursor-pointer h-10 px-3 rounded-xl font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          onClick={(e) => { e.stopPropagation(); toast.error('Account Settings required to delete shows.') }}
                        >
                          <span>Delete Show</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
                <TableRow>
                    <TableCell colSpan={8} className="h-48 text-center">
                        <p className="text-muted-foreground font-medium">No shows found matching your criteria.</p>
                        <Button variant="link" onClick={() => { setSearchQuery(''); setStatusFilter('All Shows'); }} className="text-primary mt-2">Clear Filters</Button>
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <CreateShowModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchShows}
      />
    </div>
  )
}
