'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { 
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Clock3,
  ExternalLink,
  Copy,
  Mail,
  Download,
  Eye,
  Send,
  AlertTriangle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function ShowDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isSendingReminder, setIsSendingReminder] = useState<string | null>(null)

  // Mock Date
  const showInfo = {
    artist: "Daisy Chapman",
    venue: "Lagerhaus",
    city: "Bremen",
    date: "Mar 29, 2026",
    time: "20:00",
    status: "Awaiting Documents",
    portalUrl: "https://showready.app/portal/dc-brem-26",
    reliability: {
      score: 87,
      completedShows: 14,
      docsDeliveredOnTime: 32,
      docsLate: 3
    }
  }

  const handleReminder = (docName: string) => {
    setIsSendingReminder(docName)
    setTimeout(() => {
      toast.success(`Reminder sent to ${showInfo.artist}`, {
        description: `Requested ${docName} update.`
      })
      setIsSendingReminder(null)
    }, 1500)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(showInfo.portalUrl)
    toast.success('Portal Link Copied', {
        description: 'Link copied to clipboard.'
    })
  }

  const getReliabilityStatus = (score: number) => {
    if (score >= 80) return { label: 'Reliable', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' }
    if (score >= 50) return { label: 'Inconsistent', color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20' }
    return { label: 'Unreliable', color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20' }
  }

  const relStatus = getReliabilityStatus(showInfo.reliability.score)

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20 max-w-7xl mx-auto">
      {/* HEADER SECTION */}
      <div className="space-y-6">
        <Link href="/shows" className="inline-flex items-center gap-2 text-sm text-muted-foreground/60 hover:text-white transition-colors font-bold group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          All Shows
        </Link>
        
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-4">
            <h1 className="text-5xl font-black uppercase tracking-tighter italic text-white leading-none">
              {showInfo.artist}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground font-medium text-lg">
              <span className="flex items-center gap-2 text-white"><MapPin size={18} className="text-primary" /> {showInfo.venue}</span>
              <span className="text-white/20">•</span>
              <span className="text-foreground">{showInfo.city}</span>
              <span className="text-white/20">•</span>
              <span className="flex items-center gap-2 font-pro-data uppercase tracking-widest text-sm font-bold"><Calendar size={18} className="text-primary" /> {showInfo.date}</span>
              <span className="text-white/20">•</span>
              <span className="flex items-center gap-2 font-pro-data uppercase tracking-widest text-sm font-bold"><Clock size={18} className="text-primary" /> {showInfo.time}</span>
            </div>
          </div>
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-sm py-2 px-6 rounded-full font-bold uppercase tracking-widest self-start lg:self-auto">
            {showInfo.status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* DOCUMENTS SECTION */}
        <div className="lg:col-span-8 space-y-6">
          <h2 className="text-2xl font-black uppercase tracking-tighter italic text-white flex items-center gap-4">
            Show Documents
            <span className="h-6 px-3 rounded-full bg-white/5 border border-white/10 text-[10px] flex items-center justify-center text-muted-foreground font-pro-data tracking-[0.2em]">1 OF 3 DELIVERED</span>
          </h2>
          
          <div className="space-y-4">
            {/* Delivered Item */}
            <div className="glass-card rounded-3xl p-6 border-emerald-500/20 hover:border-emerald-500/40 bg-muted/5 transition-all shadow-[0_4px_30px_rgba(16,185,129,0.05)]">
               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                 <div>
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="text-emerald-400 h-6 w-6" />
                        <h3 className="text-xl font-bold tracking-tight text-white">EPK</h3>
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-bold uppercase tracking-widest text-[10px]">Delivered</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium mt-2 ml-9">Submitted March 12, 2026</p>
                 </div>
                 <div className="flex items-center gap-3 ml-9 sm:ml-0">
                    <Button variant="outline" className="border-white/10 hover:bg-white/10 gap-2 font-pro-data uppercase tracking-widest text-[10px] h-10 px-4 rounded-xl" onClick={() => toast.info('Opening EPK preview...')}>
                        <Eye size={14} /> Preview File
                    </Button>
                    <Button variant="outline" className="border-white/10 hover:bg-white/10 gap-2 font-pro-data uppercase tracking-widest text-[10px] h-10 px-4 rounded-xl" onClick={() => toast.success('Downloading EPK...')}>
                        <Download size={14} /> Download
                    </Button>
                 </div>
               </div>
            </div>

            {/* Awaiting Item */}
            <div className="glass-card rounded-3xl p-6 border-amber-500/20 hover:border-amber-500/40 bg-muted/5 transition-all shadow-[0_4px_30px_rgba(245,158,11,0.05)]">
               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                 <div>
                    <div className="flex items-center gap-3">
                        <Clock3 className="text-amber-500 h-6 w-6" />
                        <h3 className="text-xl font-bold tracking-tight text-white">Technical Rider</h3>
                        <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 font-bold uppercase tracking-widest text-[10px]">Awaiting</Badge>
                    </div>
                    <div className="mt-2 ml-9 space-y-1">
                        <p className="text-sm text-muted-foreground font-medium">Due by April 1, 2026</p>
                        <p className="text-xs font-bold font-pro-data uppercase tracking-widest text-amber-500/80">3 days remaining</p>
                    </div>
                 </div>
                 <div className="ml-9 sm:ml-0">
                    <Button 
                        variant="outline" 
                        onClick={() => handleReminder('Technical Rider')}
                        disabled={isSendingReminder === 'Technical Rider'}
                        className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 hover:text-amber-400 border-amber-500/20 gap-2 font-pro-data uppercase tracking-widest text-[10px] h-10 px-5 rounded-xl transition-colors w-full sm:w-auto text-center justify-center flex"
                    >
                        {isSendingReminder === 'Technical Rider' ? <Clock size={14} className="animate-spin" /> : <Send size={14} />}
                        Send Reminder
                    </Button>
                 </div>
               </div>
            </div>

            {/* Late Item */}
            <div className="glass-card rounded-3xl p-6 border-red-500/30 hover:border-red-500/50 bg-red-500/[0.02] transition-all shadow-[0_4px_30px_rgba(239,68,68,0.08)]">
               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                 <div>
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="text-red-500 h-6 w-6" />
                        <h3 className="text-xl font-bold tracking-tight text-white">Contract</h3>
                        <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20 font-bold uppercase tracking-widest text-[10px]">Late</Badge>
                    </div>
                    <div className="mt-2 ml-9 space-y-1">
                        <p className="text-sm text-muted-foreground font-medium">Was due March 25, 2026</p>
                        <p className="text-xs font-bold font-pro-data uppercase tracking-widest text-red-500 shadow-sm inline-block">3 days overdue</p>
                    </div>
                 </div>
                 <div className="ml-9 sm:ml-0">
                    <Button 
                        variant="default"
                        onClick={() => handleReminder('Contract')}
                        disabled={isSendingReminder === 'Contract'}
                        className="bg-red-500 text-white hover:bg-red-600 gap-2 font-pro-data uppercase tracking-widest text-[10px] h-11 px-6 rounded-xl transition-all shadow-lg shadow-red-500/20 transform active:scale-95 w-full sm:w-auto text-center justify-center flex"
                    >
                        {isSendingReminder === 'Contract' ? <AlertCircle size={14} className="animate-spin" /> : <AlertTriangle size={14} />}
                        Send Urgent Reminder
                    </Button>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="lg:col-span-4 space-y-8">
            
            {/* ARTIST PORTAL SECTION */}
            <div className="glass-card rounded-3xl p-8 border-white/5 bg-muted/10 space-y-6">
                <div>
                   <h3 className="text-lg font-black uppercase tracking-tighter italic text-white flex items-center gap-3">
                     <ExternalLink size={20} className="text-primary" /> Artist Portal Link
                   </h3>
                   <p className="text-sm text-muted-foreground mt-2 font-medium">This is the secure link the artist uses to upload documents.</p>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-black/40 border border-white/10 overflow-hidden group">
                     <p className="text-xs font-mono text-muted-foreground/80 truncate group-hover:text-white transition-colors select-all">
                        {showInfo.portalUrl}
                     </p>
                  </div>
                  <div className="flex gap-3">
                     <Button variant="outline" className="flex-1 border-white/10 hover:bg-white/10 gap-2 h-12 rounded-xl text-xs font-bold bg-white/5" onClick={handleCopyLink}>
                        <Copy size={16} /> Copy Link
                     </Button>
                     <Button className="flex-1 bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 gap-2 h-12 rounded-xl text-xs font-bold" onClick={() => toast.success('Portal email re-sent to artist.')}>
                        <Mail size={16} /> Resend Email
                     </Button>
                  </div>
                </div>
            </div>

            {/* ARTIST RELIABILITY SECTION */}
            <div className="glass-card rounded-3xl p-8 border-white/5 bg-muted/10 space-y-6 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 opacity-5 rotate-12">
                   <CheckCircle2 size={120} className={relStatus.color} />
                </div>
                
                <div className="relative z-10">
                   <h3 className="text-lg font-black uppercase tracking-tighter italic text-white flex items-center justify-between">
                     Artist Reliability
                     <Badge variant="outline" className={`${relStatus.bg} ${relStatus.color} uppercase tracking-widest text-[10px] font-bold`}>{relStatus.label}</Badge>
                   </h3>
                   
                   <div className="mt-8 flex items-end gap-3">
                      <span className="text-7xl font-black tracking-tighter italic font-pro-data leading-none text-white">{showInfo.reliability.score}</span>
                      <span className="text-sm font-pro-data text-muted-foreground uppercase tracking-widest font-bold mb-2">Out of 100</span>
                   </div>

                   <div className="mt-6 flex-1 h-3 bg-black/40 rounded-full overflow-hidden border border-white/5 shadow-inner">
                      <div 
                        className={`h-full rounded-full shadow-[0_0_15px_currentColor] opacity-80 ${relStatus.color.replace('text-', 'bg-')}`}
                        style={{ width: `${showInfo.reliability.score}%` }}
                      />
                   </div>

                   <div className="mt-8 space-y-5">
                      <div className="flex items-center justify-between text-sm font-medium border-b border-white/5 pb-5">
                         <span className="text-muted-foreground">Shows completed</span>
                         <span className="text-white font-bold">{showInfo.reliability.completedShows}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm font-medium border-b border-white/5 pb-5">
                         <span className="text-muted-foreground">Documents delivered <strong className="text-emerald-400 font-normal">on time</strong></span>
                         <span className="text-white font-bold">{showInfo.reliability.docsDeliveredOnTime}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm font-medium">
                         <span className="text-muted-foreground">Documents <strong className="text-red-500 font-normal">late</strong></span>
                         <span className="text-white font-bold">{showInfo.reliability.docsLate}</span>
                      </div>
                   </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  )
}
