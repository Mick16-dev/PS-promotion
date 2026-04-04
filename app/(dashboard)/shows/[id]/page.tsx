'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
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
  AlertTriangle,
  Music,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'

const REMINDER_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_SEND_REMINDER_WEBHOOK || ''

interface ShowDetailPageProps {
  params: Promise<{ id: string }>
}

export default function ShowDetailPage({ params }: ShowDetailPageProps) {
  // Safe extraction of ID from params (handling both Promise and plain object patterns)
  const resolvedParams = (params && typeof (params as any).then === 'function') ? React.use(params) : params;
  const id = resolvedParams ? (resolvedParams as any).id : null;
  const [isSendingReminder, setIsSendingReminder] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showInfo, setShowInfo] = useState<any>(null)
  const [documents, setDocuments] = useState<any[]>([])
  const [reliability, setReliability] = useState<any>(null)
  const [lockouts, setLockouts] = useState<Record<string, boolean>>({})

  useEffect(() => {
    // Load lockouts from local storage
    const savedLockouts = localStorage.getItem('reminder_lockouts')
    if (savedLockouts) {
      try {
        const parsed = JSON.parse(savedLockouts)
        const now = Date.now()
        const active = Object.keys(parsed).reduce((acc: any, key) => {
          if (parsed[key] > now) acc[key] = true
          return acc
        }, {})
        setLockouts(active)
      } catch (e) {}
    }

    async function fetchShowDetail() {
      if (!id) return
      
      try {
        setIsLoading(true)

        // 1. Fetch Show details
        console.log('Fetching show with ID:', id);
        const { data: showData, error: showErr } = await supabase
          .from('shows')
          .select('*')
          .eq('id', id)
          .single()

        if (showErr) {
          console.error('SUPABASE_SHOW_FETCH_ERROR. ID:', id, 'ERROR:', showErr)
          setIsLoading(false)
          return
        }

        if (!showData) {
          console.error('SHOW_DATA_EMPTY. ID:', id)
          setIsLoading(false)
          return
        }

        // 2. Fetch associated materials
        const { data: materialsData, error: matsErr } = await supabase
          .from('materials')
          .select('*')
          .eq('show_id', id)
          .order('deadline', { ascending: true })

        // Merge into the local show object
        const show = { ...showData, materials: materialsData || [] }
        const artistInfo = { name: show.artist_name, email: show.artist_email, id: show.artist_id }
        const now = new Date()

        // Calculate show status
        let computedStatus = show.status || 'Upcoming'
        if (show.show_date) {
          const showDate = new Date(show.show_date)
          const isToday = showDate.toDateString() === now.toDateString()
          const isPast = showDate < now && !isToday
          const allMats = show.materials || []
          const allDelivered = allMats.length > 0 && allMats.every(
            (m: any) => m.status?.toLowerCase() === 'delivered' || m.status?.toLowerCase() === 'submitted'
          )

          if (isPast) computedStatus = 'Complete'
          else if (isToday) computedStatus = 'Show Day'
          else if (allDelivered) computedStatus = 'Ready'
          else computedStatus = 'Awaiting Documents'
        }

        // Format date
        let dateStr = 'TBD'
        if (show.show_date) {
          try {
            dateStr = new Date(show.show_date).toLocaleDateString(undefined, {
              year: 'numeric', month: 'short', day: 'numeric'
            })
          } catch (e) {}
        }

        setShowInfo({
          artist: artistInfo?.name || 'Unnamed Artist',
          artistEmail: artistInfo?.email || '',
          artistId: artistInfo?.id || show.artist_id,
          venue: show.venue || 'Venue TBD',
          city: show.city || '',
          date: dateStr,
          rawDate: show.show_date,
          time: show.show_time || 'TBD',
          status: computedStatus,
          portalUrl: (() => {
            const firstMatWithToken = show.materials?.find((m: any) => m.portal_token);
            const portalToken = firstMatWithToken ? String(firstMatWithToken.portal_token).trim() : '';
            const basePortalUrl = process.env.NEXT_PUBLIC_ARTIST_PORTAL_URL || 'https://sr-artist-portal-live.vercel.app';
            let finalPortalUrl = show.portal_url || '';
            if (!finalPortalUrl || finalPortalUrl.includes('supabase.co')) {
              finalPortalUrl = portalToken ? `${basePortalUrl}/?token=${portalToken}` : 'Token generation pending...';
            }
            return finalPortalUrl;
          })()
        })

        // Process show documents
        const mats = show.materials || []
        const now2 = new Date()
        const formattedDocs = mats.map((mat: any) => {
          const isDelivered = mat.status?.toLowerCase() === 'delivered' || mat.status?.toLowerCase() === 'submitted'
          let docStatus: 'delivered' | 'awaiting' | 'late' = 'awaiting'

          if (isDelivered) {
            docStatus = 'delivered'
          } else if (mat.deadline && new Date(mat.deadline) < now2) {
            docStatus = 'late'
          }

          let deadlineStr = ''
          let daysInfo = ''
          if (mat.deadline) {
            const dl = new Date(mat.deadline)
            deadlineStr = dl.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
            const diffMs = dl.getTime() - now2.getTime()
            const diffDays = Math.ceil(diffMs / (1000 * 3600 * 24))
            if (!isDelivered) {
              if (diffDays < 0) daysInfo = `${Math.abs(diffDays)} days overdue`
              else if (diffDays === 0) daysInfo = 'Due today'
              else daysInfo = `${diffDays} days remaining`
            }
          }

          let submittedStr = ''
          if (mat.submitted_at) {
            submittedStr = new Date(mat.submitted_at).toLocaleDateString(undefined, {
              year: 'numeric', month: 'long', day: 'numeric'
            })
          }

          return {
            id: mat.id,
            name: mat.item_name || 'Document',
            status: docStatus,
            deadline: deadlineStr,
            rawDeadline: mat.deadline,
            submittedAt: submittedStr,
            daysInfo,
            fileUrl: mat.file_url || '',
            portal_token: mat.portal_token || ''
          }
        })

        setDocuments(formattedDocs)

        // Set reliability if artist info exists
        setReliability({
          score: show.artist_reliability ?? 100
        })

      } catch (err) {
        console.error('FETCH_DETAIL_CRASH. ID:', id, 'ERROR:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchShowDetail()
  }, [id])

  const handleReminder = async (doc: any) => {
    if (lockouts[doc.id]) return

    setIsSendingReminder(doc.id)
    
    try {
      if (!REMINDER_WEBHOOK_URL) {
        throw new Error('Reminder webhook is not configured.')
      }

      const payload = {
        material_id: doc.id,
        artist_email: showInfo?.artistEmail,
        artist_name: showInfo?.artist,
        item_name: doc.name,
        deadline: doc.rawDeadline,
        show_name: showInfo?.venue,
        portal_url: 'https://sr-artist-portal-live.vercel.app',
        portal_token: String(doc.portal_token).trim(),
        show_id: id
      }

      const response = await fetch(REMINDER_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) throw new Error('Reminder failed')

      toast.success('Reminder Sent', {
        description: `Requested ${doc.name} update.`
      })

      // Set 24h lockout
      const expiry = Date.now() + 24 * 60 * 60 * 1000
      const newLockouts = { ...lockouts, [doc.id]: true }
      setLockouts(newLockouts)

      const savedLockouts = localStorage.getItem('reminder_lockouts')
      const parsed = savedLockouts ? JSON.parse(savedLockouts) : {}
      parsed[doc.id] = expiry
      localStorage.setItem('reminder_lockouts', JSON.stringify(parsed))

    } catch (error) {
      toast.error('Failed to send reminder. Try again later.')
    } finally {
      setIsSendingReminder(null)
    }
  }

  const handleCopyLink = () => {
    if (!showInfo?.portalUrl) return
    navigator.clipboard.writeText(showInfo.portalUrl)
    toast.success('Portal Link Copied', { description: 'Link copied to clipboard.' })
  }

  const getReliabilityStatus = (score: number) => {
    if (score >= 80) return { label: 'Reliable', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', barColor: 'bg-emerald-500' }
    if (score >= 50) return { label: 'Inconsistent', color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20', barColor: 'bg-amber-500' }
    return { label: 'Unreliable', color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20', barColor: 'bg-red-500' }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Ready': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      case 'Awaiting Documents': return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
      case 'Show Day': return 'bg-primary/20 text-primary border-primary/30'
      case 'Complete': return 'bg-muted text-muted-foreground border-border'
      default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4 text-muted-foreground">
          <Music className="h-8 w-8 animate-bounce text-primary/50" />
          <p className="font-pro-data uppercase tracking-widest text-xs font-bold">Loading Show...</p>
        </div>
      </div>
    )
  }

  if (!showInfo) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-center">
        <div>
          <p className="text-xl font-bold text-white">Show not found.</p>
          <Link href="/shows" className="text-primary mt-4 inline-block hover:underline">← Back to All Shows</Link>
        </div>
      </div>
    )
  }

  const relStatus = reliability ? getReliabilityStatus(reliability.score) : getReliabilityStatus(100)
  const deliveredCount = documents.filter(d => d.status === 'delivered').length

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
              {showInfo.city && <><span className="text-white/20">•</span><span className="text-foreground">{showInfo.city}</span></>}
              <span className="text-white/20">•</span>
              <span className="flex items-center gap-2 font-pro-data uppercase tracking-widest text-sm font-bold"><Calendar size={18} className="text-primary" /> {showInfo.date}</span>
              <span className="text-white/20">•</span>
              <span className="flex items-center gap-2 font-pro-data uppercase tracking-widest text-sm font-bold"><Clock size={18} className="text-primary" /> {showInfo.time}</span>
            </div>
          </div>
          <Badge variant="outline" className={`${getStatusBadgeClass(showInfo.status)} text-sm py-2 px-6 rounded-full font-bold uppercase tracking-widest self-start lg:self-auto`}>
            {showInfo.status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* DOCUMENTS SECTION */}
        <div className="lg:col-span-8 space-y-6">
          <h2 className="text-2xl font-black uppercase tracking-tighter italic text-white flex items-center gap-4">
            Show Documents
            <span className="h-6 px-3 rounded-full bg-white/5 border border-white/10 text-[10px] flex items-center justify-center text-muted-foreground font-pro-data tracking-[0.2em]">
              {deliveredCount} OF {documents.length} DELIVERED
            </span>
          </h2>
          
          {documents.length === 0 ? (
            <div className="glass-card rounded-3xl p-12 flex flex-col items-center justify-center text-center border-white/5 bg-muted/5">
              <p className="text-muted-foreground font-medium">No documents have been set up for this show yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((doc) => {
                const isDelivered = doc.status === 'delivered'
                const isLate = doc.status === 'late'
                const isAwaiting = doc.status === 'awaiting'

                return (
                  <div
                    key={doc.id}
                    className={`glass-card rounded-3xl p-6 transition-all bg-muted/5 ${
                      isDelivered ? 'border-emerald-500/20 hover:border-emerald-500/40 shadow-[0_4px_30px_rgba(16,185,129,0.05)]' :
                      isLate ? 'border-red-500/30 hover:border-red-500/50 bg-red-500/[0.02] shadow-[0_4px_30px_rgba(239,68,68,0.08)]' :
                      'border-amber-500/20 hover:border-amber-500/40 shadow-[0_4px_30px_rgba(245,158,11,0.05)]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                      <div>
                        <div className="flex items-center gap-3">
                          {isDelivered && <CheckCircle2 className="text-emerald-400 h-6 w-6" />}
                          {isAwaiting && <Clock3 className="text-amber-500 h-6 w-6" />}
                          {isLate && <AlertTriangle className="text-red-500 h-6 w-6" />}
                          <h3 className="text-xl font-bold tracking-tight text-white">{doc.name}</h3>
                          <Badge variant="outline" className={`font-bold uppercase tracking-widest text-[10px] ${
                            isDelivered ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            isLate ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                            'bg-amber-500/10 text-amber-500 border-amber-500/20'
                          }`}>
                            {isDelivered ? 'Delivered' : isLate ? 'Late' : 'Awaiting'}
                          </Badge>
                        </div>
                        <div className="mt-2 ml-9 space-y-1">
                          {isDelivered && doc.submittedAt && (
                            <p className="text-sm text-muted-foreground font-medium">Submitted {doc.submittedAt}</p>
                          )}
                          {!isDelivered && doc.deadline && (
                            <p className="text-sm text-muted-foreground font-medium">
                              {isLate ? `Was due ${doc.deadline}` : `Due by ${doc.deadline}`}
                            </p>
                          )}
                          {!isDelivered && doc.daysInfo && (
                            <p className={`text-xs font-bold font-pro-data uppercase tracking-widest ${
                              isLate ? 'text-red-500' : 'text-amber-500/80'
                            }`}>{doc.daysInfo}</p>
                          )}
                        </div>
                      </div>
                      <div className="ml-9 sm:ml-0 flex items-center gap-3">
                        {isDelivered ? (
                          <>
                            {doc.fileUrl && (
                              <Button variant="outline" className="border-white/10 hover:bg-white/10 gap-2 font-pro-data uppercase tracking-widest text-[10px] h-10 px-4 rounded-xl" onClick={() => window.open(doc.fileUrl, '_blank')}>
                                <Eye size={14} /> Preview File
                              </Button>
                            )}
                            {doc.fileUrl && (
                              <Button variant="outline" className="border-white/10 hover:bg-white/10 gap-2 font-pro-data uppercase tracking-widest text-[10px] h-10 px-4 rounded-xl" onClick={() => toast.success(`Downloading ${doc.name}...`)}>
                                <Download size={14} /> Download
                              </Button>
                            )}
                          </>
                        ) : isLate ? (
                          <Button
                            variant="default"
                            onClick={() => handleReminder(doc)}
                            disabled={isSendingReminder === doc.id || lockouts[doc.id]}
                            className="bg-red-500 text-white hover:bg-red-600 gap-2 font-pro-data uppercase tracking-widest text-[10px] h-11 px-6 rounded-xl transition-all shadow-lg shadow-red-500/20 active:scale-95 min-w-[170px]"
                          >
                            {isSendingReminder === doc.id ? <Loader2 size={14} className="animate-spin" /> : (lockouts[doc.id] ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />)}
                            {isSendingReminder === doc.id ? 'Sending...' : (lockouts[doc.id] ? 'Reminder Sent' : 'Send Urgent Reminder')}
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            onClick={() => handleReminder(doc)}
                            disabled={isSendingReminder === doc.id || lockouts[doc.id]}
                            className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 hover:text-amber-400 border-amber-500/20 gap-2 font-pro-data uppercase tracking-widest text-[10px] h-10 px-5 rounded-xl transition-colors min-w-[150px]"
                          >
                            {isSendingReminder === doc.id ? <Loader2 size={14} className="animate-spin" /> : (lockouts[doc.id] ? <CheckCircle2 size={14} /> : <Send size={14} />)}
                            {isSendingReminder === doc.id ? 'Sending...' : (lockouts[doc.id] ? 'Reminder Sent' : 'Send Reminder')}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
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
          {reliability && (
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
                  <span className="text-7xl font-black tracking-tighter italic font-pro-data leading-none text-white">{reliability.score}</span>
                  <span className="text-sm font-pro-data text-muted-foreground uppercase tracking-widest font-bold mb-2">Out of 100</span>
                </div>

                <div className="mt-6 flex-1 h-3 bg-black/40 rounded-full overflow-hidden border border-white/5 shadow-inner">
                  <div 
                    className={`h-full rounded-full opacity-80 ${relStatus.barColor}`}
                    style={{ width: `${reliability.score}%`, transition: 'width 1s ease-in-out' }}
                  />
                </div>

                <div className="mt-8">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Reliability is pulled directly from the backend as verified by automated submission monitoring.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
