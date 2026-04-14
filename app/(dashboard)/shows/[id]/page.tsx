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
  Loader2,
  FileSearch,
  LayoutGrid,
  ShieldCheck,
  Utensils,
  Image as ImageIcon,
  Map as MapIcon
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
  const [isResendingEmail, setIsResendingEmail] = useState(false)
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
      } catch (e) {
        // ignore parse error
      }
    }

    async function fetchShowDetail() {
      if (!id) return
      
      try {
        // Only set loading on initial fetch
        if (!showInfo) setIsLoading(true)

        // 1. Fetch Show details
        const { data: showData, error: showErr } = await supabase
          .from('shows')
          .select('*')
          .eq('id', id)
          .single()

        if (showErr) {
          console.error('SUPABASE_SHOW_FETCH_ERROR. ID:', id, 'ERROR:', showErr)
          if (!showInfo) setIsLoading(false)
          return
        }

        if (!showData) {
          if (!showInfo) setIsLoading(false)
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
          } catch (e) {
            // ignore date format error
          }
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
          portal_token: show.portal_token,
          portalUrl: (() => {
            const firstMatWithToken = show.materials?.find((m: any) => m.portal_token);
            const portalToken = show.portal_token || firstMatWithToken?.portal_token;
            const basePortalUrl = process.env.NEXT_PUBLIC_ARTIST_PORTAL_URL || 'https://sr-artist-portal-live.vercel.app';
            
            let finalPortalUrl = show.portal_url || '';
            if ((!finalPortalUrl || finalPortalUrl.includes('supabase.co') || !finalPortalUrl.includes('?token=')) && portalToken) {
              finalPortalUrl = `${basePortalUrl}/?token=${portalToken}`;
            } else if (!finalPortalUrl && !portalToken) {
              finalPortalUrl = `${basePortalUrl}/?token=${show.id}`;
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
            hasFile: !!mat.file_url,
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

    // Realtime subscription for live updates
    const channel = supabase
      .channel(`show-${id}-updates`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'materials',
          filter: `show_id=eq.${id}`
        },
        (payload) => {
          console.log('Realtime material update detected:', payload)
          fetchShowDetail()
          toast('Live Update', {
            description: 'The artist has updated document status.',
            icon: <Loader2 size={14} className="animate-spin text-primary" />
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [id, showInfo?.id])

  const handleViewDocument = async (doc: any) => {
    if (!doc.fileUrl) {
      toast.error('No file associated with this document.')
      return
    }

    try {
      // Extract the path from the URL
      // Expected format: .../storage/v1/object/public/BUCKET_NAME/PATH_TO_FILE
      // OR if it's already just a path.
      let path = doc.fileUrl
      let bucket = 'production-materials' // Default assumption

      if (path.includes('/storage/v1/object/')) {
        const parts = path.split('/storage/v1/object/')
        if (parts.length > 1) {
          const subParts = parts[1].split('/')
          // Remove 'public/' or 'authenticated/' prefix if present
          if (subParts[0] === 'public' || subParts[0] === 'authenticated' || subParts[0] === 'sign') {
            bucket = subParts[1]
            path = subParts.slice(2).join('/')
          } else {
            bucket = subParts[0]
            path = subParts.slice(1).join('/')
          }
        }
      }

      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, 3600)

      if (error) throw error
      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank')
      } else {
        throw new Error('Could not generate signed URL')
      }
    } catch (err) {
      console.error('SIGNED_URL_ERROR:', err)
      // Fallback to direct URL if signed URL fails, maybe it's public
      window.open(doc.fileUrl, '_blank')
      toast.error('Secure link generation failed. Attempting direct access.')
    }
  }

  const handleReminder = async (doc: any) => {
    if (lockouts[doc.id]) return

    setIsSendingReminder(doc.id)
    
    try {
      const basePortalUrl = process.env.NEXT_PUBLIC_ARTIST_PORTAL_URL || 'https://sr-artist-portal-live.vercel.app'
      const showToken = String(showInfo?.portal_token || '').trim()
      const docToken = String(doc.portal_token || '').trim()
      const token = showToken || docToken || String(id || '').trim()
      
      const fullPortalUrl = `${basePortalUrl}/?token=${token}`
      const artistName = showInfo?.artist || 'Artist'
      const venueName = showInfo?.venue || 'Venue'

      // Use the internal proxy route instead of hitting n8n directly to avoid CORS/environment issues
      const response = await fetch('/api/n8n/send-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          material_id: doc.id,
          artist_email: showInfo?.artistEmail,
          artist_name: artistName,
          item_name: doc.name,
          deadline: doc.rawDeadline,
          show_name: venueName,
          portal_url: fullPortalUrl,
          portal_token: token,
          show_id: id,
          venue_name: venueName,
          city: showInfo?.city || '',
          show_date: showInfo?.rawDate || '',
          show_time: showInfo?.time || 'TBD'
        })
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

    } catch (err) {
      console.error('REMINDER_ERROR:', err)
      toast.error('Failed to send reminder. Internal error.')
    } finally {
      setIsSendingReminder(null)
    }
  }

  const handleResendEmail = async () => {
    if (!showInfo?.artistEmail) {
      toast.error('No artist email found.')
      return
    }

    setIsResendingEmail(true)
    try {
      const response = await fetch('/api/n8n/resend-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          show_id: id,
          artist_email: showInfo.artistEmail,
          artist_name: showInfo.artist,
          venue_name: showInfo.venue,
          city: showInfo.city,
          show_date: showInfo.rawDate,
          portal_url: showInfo.portalUrl,
          portal_token: showInfo.portal_token
        })
      })

      if (!response.ok) throw new Error('Failed to resend')

      toast.success('Portal Link Re-sent', {
        description: `Link sent to ${showInfo.artistEmail}`
      })
    } catch (err) {
      console.error('RESEND_EMAIL_ERROR:', err)
      toast.error('Failed to resend portal email.')
    } finally {
      setIsResendingEmail(false)
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
        
        {/* PRODUCTION DOCUMENTS GRID (NEW SECTION) */}
        <div className="lg:col-span-12 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black uppercase tracking-tighter italic text-white flex items-center gap-4">
               <LayoutGrid className="text-primary" size={24} />
               Artist Document Viewer
            </h2>
            <div className="flex items-center gap-2 p-2 px-4 rounded-full bg-white/5 border border-white/10">
               <ShieldCheck className="text-emerald-400" size={14} />
               <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none pt-0.5">Secure Storage Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {documents.length === 0 ? (
              <div className="col-span-full rounded-[2rem] border border-dashed border-white/5 bg-white/[0.01] p-24 text-center">
                 <Loader2 className="mx-auto mb-4 animate-spin text-muted-foreground/20" size={32} />
                 <p className="text-muted-foreground font-medium uppercase tracking-[0.2em] text-[10px]">Awaiting Material Configuration</p>
              </div>
            ) : (
              documents.map((doc) => {
                const isReceived = doc.status === 'delivered'
                
                const getNameIcon = (name: string) => {
                  const n = name.toLowerCase()
                  if (n.includes('stage') || n.includes('plot')) return MapIcon
                  if (n.includes('cater') || n.includes('hospitality')) return Utensils
                  if (n.includes('press') || n.includes('photo') || n.includes('epk')) return ImageIcon
                  return FileSearch
                }
                const Icon = getNameIcon(doc.name)

                return (
                  <div 
                    key={doc.id}
                    className={`relative overflow-hidden group rounded-[2.5rem] border p-8 transition-all h-full flex flex-col justify-between ${
                      isReceived 
                        ? 'bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/30' 
                        : 'bg-white/[0.01] border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="space-y-6 relative z-10">
                      <div className="flex items-start justify-between">
                        <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 ${isReceived ? 'text-emerald-400 border-emerald-500/20' : 'text-muted-foreground'}`}>
                          <Icon size={24} />
                        </div>
                        <Badge variant="outline" className={`font-black uppercase tracking-widest text-[9px] py-1 px-3 rounded-lg ${
                          isReceived ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/5 text-muted-foreground/60 border-white/10'
                        }`}>
                          {isReceived ? '✅ Received' : '⏳ Pending'}
                        </Badge>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{doc.name}</h3>
                        <p className="text-sm text-muted-foreground/60 font-medium leading-relaxed">
                          {isReceived 
                            ? `Verification complete. Document is secured and available for production review.` 
                            : doc.daysInfo 
                              ? `Requirement is ${doc.daysInfo}. The artist is currently flagged in the portal.`
                              : `Awaiting transmission. Material initialized in the production workspace.`
                          }
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 relative z-10">
                      {doc.hasFile ? (
                        <div className="flex gap-2">
                           <Button 
                             onClick={() => handleViewDocument(doc)}
                             className="flex-1 h-14 rounded-2xl bg-destructive text-white hover:bg-destructive/90 font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-destructive/40 active:scale-95 transition-all"
                           >
                              <Eye size={20} className="mr-2" /> View Document
                           </Button>
                           <Button 
                             onClick={() => handleViewDocument(doc)}
                             variant="outline"
                             className="w-14 h-14 p-0 rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10"
                           >
                              <Download size={20} />
                           </Button>
                        </div>
                      ) : (
                        <Button 
                          onClick={() => handleReminder(doc)}
                          disabled={isSendingReminder === doc.id || lockouts[doc.id]}
                          className={`w-full h-14 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all ${
                            doc.status === 'late' 
                              ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30 hover:bg-amber-500/30' 
                              : 'bg-white/5 border border-white/10 text-white/40 hover:bg-white/10'
                          }`}
                        >
                           {isSendingReminder === doc.id ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} className="mr-2" />}
                           {isSendingReminder === doc.id ? 'Sending...' : 'Remind Artist'}
                        </Button>
                      )}
                    </div>

                    {isReceived && (
                      <div className="absolute -right-8 -bottom-8 opacity-[0.02] pointer-events-none group-hover:opacity-[0.04] transition-opacity">
                        <Icon size={160} />
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* LOGISTICS LOG TABLE */}
        <div className="lg:col-span-12 pt-12 border-t border-white/5">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-4">
              <FileSearch size={22} className="text-primary/50" />
              Submission Log
            </h2>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-white/5 bg-white/[0.01]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Material Name</th>
                  <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 text-center">Status</th>
                  <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Deadline</th>
                  <th className="p-6 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {documents.map((doc) => {
                  const isReceived = doc.status === 'delivered'
                  return (
                    <tr key={doc.id} className="hover:bg-white/[0.015] transition-colors">
                      <td className="p-6">
                        <span className="font-bold text-sm text-white">{doc.name}</span>
                      </td>
                      <td className="p-6 text-center">
                         <Badge variant="outline" className={`font-bold uppercase tracking-widest text-[9px] ${
                           isReceived ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' : 'text-amber-500 border-amber-500/20 bg-amber-500/5'
                         }`}>
                           {doc.status || 'Pending'}
                         </Badge>
                      </td>
                      <td className="p-6">
                        <span className="text-xs text-muted-foreground font-medium">{doc.deadline}</span>
                      </td>
                      <td className="p-6 text-right">
                         <div className="flex justify-end gap-2">
                           {doc.hasFile ? (
                             <Button size="sm" className="h-9 px-4 bg-destructive text-white hover:bg-destructive/90 text-[10px] font-black uppercase tracking-widest rounded-lg" onClick={() => handleViewDocument(doc)}>View File</Button>
                           ) : (
                             <Button size="sm" variant="outline" className="h-9 px-4 border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest rounded-lg" onClick={() => handleReminder(doc)}>Remind</Button>
                           )}
                         </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
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
                <Button 
                  className="flex-1 bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 gap-2 h-12 rounded-xl text-xs font-bold" 
                  onClick={handleResendEmail}
                  disabled={isResendingEmail}
                >
                  {isResendingEmail ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />} 
                  {isResendingEmail ? 'Sending...' : 'Resend Email'}
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
