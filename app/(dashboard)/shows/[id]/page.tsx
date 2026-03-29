'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Music, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Download,
  Send,
  ExternalLink,
  MoreVertical,
  Layers,
  FileText,
  Video,
  Play
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'

// Mock fetching function
const getShowDetails = (id: string) => {
  return {
    id,
    artist: 'Luna Shadows',
    venue: 'The Electric Ballroom',
    date: '2024-05-15',
    type: 'Headline',
    status: 'Upcoming',
    overallProgress: 65,
    materials: [
      { id: '1', name: 'Technical Rider', status: 'Complete', date: '2024-03-20', type: 'doc' },
      { id: '2', name: 'Hospitality Rider', status: 'Pending', date: '-', type: 'doc' },
      { id: '3', name: 'Press Kit / Bio', status: 'Complete', date: '2024-03-18', type: 'media' },
      { id: '4', name: 'Stage Plot', status: 'Approved', date: '2024-03-25', type: 'doc' },
      { id: '5', name: 'Input List', status: 'Overdue', date: '-', type: 'doc' },
      { id: '6', name: 'Promotional Video', status: 'Pending', date: '-', type: 'video' },
    ]
  }
}

export default function ShowDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const show = getShowDetails(id as string)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Complete':
      case 'Approved':
        return <CheckCircle2 className="text-emerald-400" size={18} />
      case 'Pending':
        return <Clock className="text-yellow-400" size={18} />
      case 'Overdue':
        return <AlertCircle className="text-red-400" size={18} />
      default:
        return <Layers className="text-muted-foreground" size={18} />
    }
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'doc': return <FileText size={18} />
      case 'video': return <Video size={18} />
      case 'media': return <Play size={18} />
      default: return <FileText size={18} />
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Back Button & Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.back()}
            className="rounded-full hover:bg-white/10"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">{show.artist}</h1>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {show.type}
              </Badge>
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><MapPin size={14} /> {show.venue}</span>
              <span className="flex items-center gap-1.5"><Calendar size={14} /> {show.date}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-white/10 bg-muted/20 hover:bg-muted/40 gap-2">
            <Download size={16} /> Export Specs
          </Button>
          <Button className="bg-primary text-white hover:bg-primary/90 gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95">
            <Send size={16} /> Request All Missing
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl border-white/5 md:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold tracking-tight">Production Progress</h3>
            <span className="text-sm font-pro-data font-bold text-primary">{show.overallProgress}% Complete</span>
          </div>
          <Progress value={show.overallProgress} className="h-2 bg-muted/50" />
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="text-center">
              <div className="text-2xl font-pro-data font-bold">3</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Approved</div>
            </div>
            <div className="text-center border-x border-white/5">
              <div className="text-2xl font-pro-data font-bold">2</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-pro-data font-bold text-red-400">1</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Overdue</div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border-white/5 flex flex-col justify-center items-center text-center space-y-4">
            <div className="h-14 w-14 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <CheckCircle2 size={32} />
            </div>
            <div>
                <h4 className="font-bold">Show Ready</h4>
                <p className="text-xs text-muted-foreground mt-1">Critical tech specs have been validated by production leads.</p>
            </div>
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/5 text-xs font-pro-data uppercase tracking-widest">
                VIEW PROTOCOL →
            </Button>
        </div>
      </div>

      {/* Materials Table */}
      <div className="glass-card rounded-2xl overflow-hidden border-white/5 shadow-2xl">
        <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-muted/20">
          <h3 className="text-lg font-semibold tracking-tight">Production Materials</h3>
          <div className="flex items-center gap-2">
             <Badge variant="outline" className="text-[10px] font-pro-data border-white/10 uppercase">v1.4 Sync</Badge>
          </div>
        </div>
        <div className="divide-y divide-white/5">
          {show.materials.map((item) => (
            <div key={item.id} className="group flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-all">
                  {getFileIcon(item.type)}
                </div>
                <div>
                  <div className="font-semibold text-foreground flex items-center gap-2">
                    {item.name}
                    {item.status === 'Approved' && <Badge className="h-4 px-1.5 text-[9px] bg-emerald-500/20 text-emerald-400 border-none">APPROVED</Badge>}
                  </div>
                  <div className="text-[11px] text-muted-foreground/60 flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 uppercase tracking-tight font-pro-data">{item.status}</span>
                    <span className="h-1 w-1 rounded-full bg-white/10" />
                    <span>Last Update: {item.date}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3">
                   {getStatusIcon(item.status)}
                </div>
                {item.status === 'Complete' || item.status === 'Approved' ? (
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-white hover:bg-white/10">
                    <Download size={18} />
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-9 border-primary/30 text-primary hover:bg-primary hover:text-white transition-all gap-1.5"
                  >
                    <Send size={14} /> Request
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:bg-white/5">
                  <MoreVertical size={18} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
