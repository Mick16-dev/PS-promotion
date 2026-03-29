'use client'

import React, { useState, useEffect } from 'react'
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
  Play,
  Users,
  Phone,
  Mail,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import Link from 'next/link'

// Mock fetching function for a single show
const fetchShowData = (id: string) => {
  return {
    id,
    artist: 'Luna Shadows',
    date: '2024-05-15',
    type: 'Headline Performance',
    status: 'Upcoming',
    overallProgress: 65,
    venue: {
      name: 'The Electric Ballroom',
      address: '184 Camden High St, London NW1 8QP',
      capacity: '1,500',
      contact: 'Sarah Jenkins (Production Mgr)',
      phone: '+44 20 7485 9016',
      email: 'production@electricballroom.co.uk'
    },
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
  const [show, setShow] = useState<any>(null)
  const [isRequesting, setIsRequesting] = useState<string | null>(null)

  useEffect(() => {
    // Simulate API fetch
    const data = fetchShowData(id as string)
    setShow(data)
  }, [id])

  const handleRequestMaterial = async (materialId: string, materialName: string) => {
    setIsRequesting(materialId)
    // Simulate n8n webhook call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Update local state to show "Request Sent"
    setShow((prev: any) => ({
      ...prev,
      materials: prev.materials.map((m: any) => 
        m.id === materialId ? { ...m, status: 'Requested' } : m
      )
    }))
    
    toast.success(`Request for ${materialName} sent to n8n workflow.`)
    setIsRequesting(null)
  }

  const handleRequestAll = async () => {
    setIsRequesting('all')
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setShow((prev: any) => ({
      ...prev,
      materials: prev.materials.map((m: any) => 
        m.status === 'Pending' || m.status === 'Overdue' ? { ...m, status: 'Requested' } : m
      )
    }))

    toast.success('Batch request for all missing materials initiated.')
    setIsRequesting(null)
  }

  if (!show) return <div className="h-screen flex items-center justify-center animate-pulse text-primary font-pro-data uppercase tracking-widest">Loading Production Assets...</div>

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Complete':
      case 'Approved':
        return <CheckCircle2 className="text-emerald-400" size={18} />
      case 'Pending':
        return <Clock className="text-yellow-400" size={18} />
      case 'Overdue':
        return <AlertCircle className="text-red-400" size={18} />
      case 'Requested':
        return <Zap className="text-primary animate-pulse" size={18} />
      default:
        return <Layers className="text-muted-foreground" size={18} />
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Back Button & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.push('/shows')}
            className="rounded-full hover:bg-white/10"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-black tracking-tight uppercase italic">{show.artist}</h1>
              <Badge className="bg-primary/20 text-primary border-primary/30 font-pro-data tracking-widest text-[10px]">
                {show.type}
              </Badge>
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground font-medium">
              <span className="flex items-center gap-1.5"><MapPin size={14} className="text-primary" /> {show.venue.name}</span>
              <span className="flex items-center gap-1.5"><Calendar size={14} className="text-primary" /> {show.date}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="border-white/10 bg-muted/20 hover:bg-muted/40 gap-2 h-11 px-6 font-pro-data uppercase tracking-widest text-xs"
            onClick={() => toast.info('Exporting production brief as PDF...')}
          >
            <Download size={16} /> Export Specs
          </Button>
          <Button 
            className="bg-primary text-white hover:bg-primary/90 gap-2 h-11 px-6 shadow-xl shadow-primary/30 transition-all active:scale-95 font-pro-data uppercase tracking-widest text-xs"
            onClick={handleRequestAll}
            disabled={isRequesting === 'all'}
          >
            {isRequesting === 'all' ? <Zap size={16} className="animate-spin" /> : <Send size={16} />}
            {isRequesting === 'all' ? 'Triggering...' : 'Request Missing'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Progress & Materials */}
        <div className="lg:col-span-8 space-y-8">
          {/* Progress Card */}
          <div className="glass-card p-8 rounded-3xl border-white/5 bg-muted/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Music size={120} />
            </div>
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-bold tracking-tight">Show Readiness</h3>
                    <p className="text-sm text-muted-foreground mt-1">Status of required production assets and contractual riders.</p>
                </div>
                <div className="text-right">
                    <span className="text-3xl font-black italic tracking-tighter text-primary">{show.overallProgress}%</span>
                    <p className="text-[10px] font-pro-data uppercase tracking-widest text-muted-foreground/60">VALIDATED</p>
                </div>
                </div>
                <Progress value={show.overallProgress} className="h-2.5 bg-muted/50" />
                <div className="grid grid-cols-3 gap-8 mt-10">
                    <div className="space-y-1">
                        <p className="text-2xl font-black font-pro-data">03</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Approved</p>
                    </div>
                    <div className="space-y-1 border-x border-white/5 px-8">
                        <p className="text-2xl font-black font-pro-data text-yellow-500">02</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Pending</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-2xl font-black font-pro-data text-red-500">01</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Overdue</p>
                    </div>
                </div>
            </div>
          </div>

          {/* Materials Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-lg font-bold tracking-tight uppercase font-pro-data text-white/80">Production Materials</h3>
                <Badge variant="outline" className="text-[10px] font-pro-data text-muted-foreground/40 tracking-[0.2em] border-white/5 bg-white/5">VERSION: 2.0.4-SYNC</Badge>
            </div>
            <div className="glass-card rounded-3xl overflow-hidden border-white/5 divide-y divide-white/5">
                {show.materials.map((item: any) => (
                    <div key={item.id} className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 hover:bg-white/[0.02] transition-all duration-300">
                        <div className="flex items-center gap-5 mb-4 sm:mb-0">
                            <div className="h-12 w-12 rounded-2xl bg-muted/30 flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-all duration-300 border border-white/5 shadow-inner">
                                {item.type === 'doc' ? <FileText size={22} /> : item.type === 'video' ? <Video size={22} /> : <Play size={22} />}
                            </div>
                            <div>
                                <div className="font-bold text-lg flex items-center gap-3">
                                    {item.name}
                                    {item.status === 'Approved' && <Badge className="bg-emerald-500/10 text-emerald-400 border-none text-[9px] h-4">VERIFIED</Badge>}
                                </div>
                                <div className="text-[11px] text-muted-foreground/50 flex items-center gap-3 mt-1.5 font-pro-data tracking-wider uppercase font-bold">
                                    <span className={item.status === 'Overdue' ? 'text-red-500' : ''}>{item.status}</span>
                                    <span className="h-1 w-1 rounded-full bg-white/10" />
                                    <span>Added: {item.date}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 self-end sm:self-auto">
                            <div className="mr-2">
                                {getStatusIcon(item.status)}
                            </div>
                            {item.status === 'Complete' || item.status === 'Approved' ? (
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-10 w-10 text-muted-foreground hover:text-white hover:bg-white/10 rounded-xl"
                                    onClick={() => toast.success(`Opening ${item.name} for secure view...`)}
                                >
                                    <Play size={18} />
                                </Button>
                            ) : (
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="h-10 border-primary/20 text-primary hover:bg-primary hover:text-white transition-all rounded-xl gap-2 font-pro-data text-[10px] tracking-widest"
                                    onClick={() => handleRequestMaterial(item.id, item.name)}
                                    disabled={isRequesting === item.id || item.status === 'Requested'}
                                >
                                    {isRequesting === item.id ? <Zap size={14} className="animate-spin" /> : <Send size={14} />}
                                    {item.status === 'Requested' ? 'SENT' : 'REQUEST'}
                                </Button>
                            )}
                            <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:bg-white/5 rounded-xl">
                                <MoreVertical size={18} />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right Column: Venue & Show Actions */}
        <div className="lg:col-span-4 space-y-8">
          {/* Venue Detail Card */}
          <div className="glass-card p-8 rounded-3xl border-white/5 bg-primary/5 space-y-6">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                    <MapPin size={22} />
                </div>
                <div>
                    <h3 className="text-lg font-extrabold tracking-tight uppercase italic">Venue Detail</h3>
                    <p className="text-[10px] font-pro-data uppercase tracking-widest text-primary/60">Logistics Hub</p>
                </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/5">
                <div>
                    <p className="text-[10px] font-pro-data uppercase tracking-widest text-muted-foreground/60 mb-1">Official Name</p>
                    <p className="font-bold text-white uppercase tracking-tight leading-tight">{show.venue.name}</p>
                </div>
                <div>
                    <p className="text-[10px] font-pro-data uppercase tracking-widest text-muted-foreground/60 mb-1">Full Address</p>
                    <p className="text-sm font-medium text-muted-foreground">{show.venue.address}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-[10px] font-pro-data uppercase tracking-widest text-muted-foreground/60 mb-1">Capacity</p>
                        <p className="font-bold text-white font-pro-data">{show.venue.capacity}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-pro-data uppercase tracking-widest text-muted-foreground/60 mb-1">Loading Dock</p>
                        <p className="font-bold text-emerald-400 font-pro-data uppercase">Active</p>
                    </div>
                </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-white/5">
                <p className="text-[10px] font-pro-data uppercase tracking-widest text-muted-foreground/60 mb-2 font-bold">Primary Contact</p>
                <div className="flex items-center gap-3 text-sm group cursor-pointer" onClick={() => toast.info(`Calling ${show.venue.contact}...`)}>
                    <Users size={16} className="text-primary/60" />
                    <span className="text-muted-foreground group-hover:text-white transition-colors">{show.venue.contact}</span>
                </div>
                <div className="flex items-center gap-3 text-sm group cursor-pointer" onClick={() => toast.info(`Emailing venue at ${show.venue.email}...`)}>
                    <Mail size={16} className="text-primary/60" />
                    <span className="text-muted-foreground group-hover:text-primary transition-colors">{show.venue.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm group cursor-pointer" onClick={() => toast.info(`Dialing ${show.venue.phone}...`)}>
                    <Phone size={16} className="text-primary/60" />
                    <span className="text-muted-foreground group-hover:text-white transition-colors font-pro-data">{show.venue.phone}</span>
                </div>
            </div>

            <Button variant="outline" className="w-full h-11 border-white/10 hover:bg-primary hover:text-white transition-all rounded-xl font-pro-data uppercase tracking-widest text-[10px] gap-2">
                <ExternalLink size={14} /> View Venue Specs
            </Button>
          </div>

          {/* Quick Production Actions */}
          <div className="glass-card p-8 rounded-3xl border-white/5 bg-muted/10 space-y-6">
            <h3 className="text-lg font-bold tracking-tight uppercase font-pro-data">Production Lead Hub</h3>
            <div className="grid grid-cols-1 gap-3">
                <Button variant="ghost" className="justify-start gap-4 h-14 rounded-2xl bg-white/[0.02] hover:bg-white/5 group border border-white/5 px-5" onClick={() => toast.info('Opening technical workspace...')}>
                    <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        <Layers size={18} />
                    </div>
                    <div className="text-left">
                        <p className="text-xs font-bold leading-none">Open Tech Board</p>
                        <p className="text-[9px] text-muted-foreground uppercase tracking-tighter mt-1 font-pro-data">Sub-Workflows & Tasks</p>
                    </div>
                </Button>
                <Button variant="ghost" className="justify-start gap-4 h-14 rounded-2xl bg-white/[0.02] hover:bg-white/5 group border border-white/5 px-5" onClick={() => toast.info('Firing production alert!')}>
                    <div className="p-2 rounded-lg bg-red-500/10 text-red-400 group-hover:bg-red-500 group-hover:text-white transition-all">
                        <AlertCircle size={18} />
                    </div>
                    <div className="text-left">
                        <p className="text-xs font-bold leading-none">Emergency Broadcast</p>
                        <p className="text-[9px] text-muted-foreground uppercase tracking-tighter mt-1 font-pro-data">Notify All Production Teams</p>
                    </div>
                </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
