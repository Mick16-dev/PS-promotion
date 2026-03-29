'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Calendar, 
  MapPin, 
  Music,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle
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

// Mock Data for Shows
const mockShows = [
  {
    id: '1',
    artist: 'Luna Shadows',
    venue: 'The Electric Ballroom',
    date: '2024-05-15',
    status: 'Upcoming',
    materials: 'Pending',
    type: 'Headline'
  },
  {
    id: '2',
    artist: 'Echo Pulse',
    venue: 'O2 Academy Brixton',
    date: '2024-05-18',
    status: 'Active',
    materials: 'Complete',
    type: 'Festival'
  },
  {
    id: '3',
    artist: 'Neon Dreams',
    venue: 'Printworks London',
    date: '2024-06-02',
    status: 'Upcoming',
    materials: 'Overdue',
    type: 'Club Night'
  },
  {
    id: '4',
    artist: 'The Midnight',
    venue: 'Roundhouse',
    date: '2024-04-20',
    status: 'Finished',
    materials: 'Complete',
    type: 'Headline'
  }
]

export default function ShowsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Upcoming':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">Upcoming</Badge>
      case 'Active':
        return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Active</Badge>
      case 'Finished':
        return <Badge variant="outline" className="bg-muted text-muted-foreground border-border">Finished</Badge>
      case 'Cancelled':
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getMaterialsBadge = (status: string) => {
    switch (status) {
      case 'Complete':
        return (
          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 size={14} />
            <span className="text-xs font-medium">Complete</span>
          </div>
        )
      case 'Pending':
        return (
          <div className="flex items-center gap-1.5 text-yellow-400">
            <Clock size={14} />
            <span className="text-xs font-medium">Pending</span>
          </div>
        )
      case 'Overdue':
        return (
          <div className="flex items-center gap-1.5 text-red-400">
            <AlertCircle size={14} />
            <span className="text-xs font-medium">Overdue</span>
          </div>
        )
      default:
        return <span className="text-xs text-muted-foreground">{status}</span>
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shows Management</h1>
          <p className="text-muted-foreground mt-1">Track and organize production details for all upcoming artist performances.</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white gap-2 h-11 px-6 shadow-lg shadow-primary/20 transition-all active:scale-95"
        >
          <Plus size={18} />
          <span>Create New Show</span>
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search shows, artists, or venues..." 
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

      {/* Shows Table Container */}
      <div className="glass-card rounded-xl overflow-hidden border-white/5 shadow-2xl">
        <Table>
          <TableHeader className="bg-muted/40 font-pro-data">
            <TableRow className="hover:bg-transparent border-white/5">
              <TableHead className="w-[300px] py-4">Artist & Event</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Materials</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockShows.map((show) => (
              <TableRow key={show.id} className="group border-white/5 hover:bg-white/[0.02] transition-colors">
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <Music size={18} />
                    </div>
                    <div>
                      <Link href={`/shows/${show.id}`} className="font-semibold text-foreground hover:text-primary transition-colors cursor-pointer">
                        {show.artist}
                      </Link>
                      <div className="text-xs text-muted-foreground font-mono uppercase tracking-wider">{show.type}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin size={14} className="text-muted-foreground/60" />
                    <span>{show.venue}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm text-pro-data">
                    <Calendar size={14} className="text-muted-foreground/60" />
                    <span>{show.date}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(show.status)}
                </TableCell>
                <TableCell>
                  {getMaterialsBadge(show.materials)}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-white/10">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-ebony-900/95 backdrop-blur-xl border-white/10">
                      <DropdownMenuLabel className="font-pro-data uppercase text-xs tracking-widest text-muted-foreground/60 py-3">Production Actions</DropdownMenuLabel>
                      <DropdownMenuItem 
                        className="gap-2 cursor-pointer h-10 px-4 group"
                        onClick={() => router.push(`/shows/${show.id}`)}
                      >
                        <ExternalLink size={14} className="group-hover:text-primary transition-colors" /> 
                        <span className="group-hover:translate-x-0.5 transition-transform">View Details</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="gap-2 cursor-pointer h-10 px-4 group"
                        onClick={() => toast.info('Production edit environment loading...')}
                      >
                        <span className="group-hover:translate-x-0.5 transition-transform">Edit Production</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-white/5 mx-2 my-1" />
                      <DropdownMenuItem 
                        className="gap-2 cursor-pointer h-10 px-4 group text-red-500/80 focus:text-red-400 focus:bg-red-500/10"
                        onClick={() => toast.error('Authorized access required to delete production records.')}
                      >
                        <span className="group-hover:translate-x-0.5 transition-transform">Archive Show</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {/* Pagination/Footer */}
        <div className="px-6 py-4 border-t border-white/5 bg-muted/20 flex items-center justify-between text-xs text-muted-foreground font-pro-data uppercase tracking-widest">
          <span>Showing 4 of 24 shows</span>
          <div className="flex gap-4">
            <button className="hover:text-primary transition-colors disabled:opacity-30" disabled>Previous</button>
            <button className="hover:text-primary transition-colors">Next</button>
          </div>
        </div>
      </div>

      <CreateShowModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
