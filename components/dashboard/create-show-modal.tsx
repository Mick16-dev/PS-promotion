'use client'

import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { CalendarIcon, MapPin, Music, User, Send, Loader2, X, Clock, Utensils, Info } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

interface CreateShowModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

const defaultDocs = [
  { id: 'epk', label: 'EPK' },
  { id: 'bio', label: 'Artist Bio' },
  { id: 'photos', label: 'Press Photos' },
  { id: 'rider', label: 'Technical Rider' },
  { id: 'contract', label: 'Signed Contract' }
]

export function CreateShowModal({ isOpen, onClose, onSuccess }: CreateShowModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [artists, setArtists] = useState<any[]>([])
  const [isLoadingArtists, setIsLoadingArtists] = useState(false)
  const [showAddArtist, setShowAddArtist] = useState(false)
  const [newArtistName, setNewArtistName] = useState('')
  const [newArtistEmail, setNewArtistEmail] = useState('')
  const [isAddingArtist, setIsAddingArtist] = useState(false)

  // Form state
  const [selectedArtistId, setSelectedArtistId] = useState<string>('')
  const [venue, setVenue] = useState('')
  const [city, setCity] = useState('')
  const [showDate, setShowDate] = useState('')
  const [showTime, setShowTime] = useState('')
  const [showEndTime, setShowEndTime] = useState('')
  const [loadInTime, setLoadInTime] = useState('')
  const [soundcheckTime, setSoundcheckTime] = useState('')
  const [changeoverTime, setChangeoverTime] = useState('')
  const [doorsTime, setDoorsTime] = useState('')
  const [musiciansCount, setMusiciansCount] = useState(0)
  const [hostName, setHostName] = useState('')
  const [artistEpkUrl, setArtistEpkUrl] = useState('')
  const [stageplotUrl, setStageplotUrl] = useState('')
  const [technicalNotes, setTechnicalNotes] = useState('')
  const [artistComment, setArtistComment] = useState('')
  const [cateringNotes, setCateringNotes] = useState('')
  const [syncToCalendar, setSyncToCalendar] = useState(true)

  // Track selected documents and their deadlines
  const [selectedDocs, setSelectedDocs] = useState<Record<string, boolean>>({
    epk: true, bio: true, photos: true, rider: true, contract: true
  })
  const [docDates, setDocDates] = useState<Record<string, string>>({})

  // --- Financial State ---
  const [ticketTiers, setTicketTiers] = useState([{ name: 'General Admission', price: 0, capacity: 0 }])
  const [expenses, setExpenses] = useState([{ name: 'Rent', amount: 0 }])
  const [dealType, setDealType] = useState('flat')
  const [dealGuarantee, setDealGuarantee] = useState(0)
  const [dealPercentage, setDealPercentage] = useState(0)
  
  // --- Venue State ---
  const [venuesList, setVenuesList] = useState<any[]>([])

  useEffect(() => {
    if (isOpen) {
      const fetchArtists = async () => {
        setIsLoadingArtists(true)
        try {
          const { data, error } = await supabase.from('artists').select('id, name, email')

          if (error) {
            console.error('Failed to fetch artists:', error)
            const urlHint =
              typeof window !== 'undefined'
                ? (process.env.NEXT_PUBLIC_SUPABASE_URL || '').split('.supabase.co')[0].slice(-12)
                : ''
            toast.error('Could not load artists.', {
              description: `Supabase query failed (table: artists${urlHint ? `, project: ...${urlHint}` : ''}). ${error.message || ''}`.trim(),
            })
          } else if (data) {
            setArtists(data)
            if (data.length > 0) {
              setSelectedArtistId((prev) => prev || data[0].id)
            } else {
              toast.error('No artists available.', {
                description:
                  'Your artist table returned 0 rows. This is usually caused by Row Level Security (RLS) blocking reads, or the row being in a different table (artist vs artists).',
              })
            }
          }
        } finally {
          setIsLoadingArtists(false)
        }
      }

      const fetchVenues = async () => {
        try {
          const { data } = await supabase.from('venues').select('*')
          if (data) setVenuesList(data)
        } catch (e) {}
      }

      fetchArtists()
      fetchVenues()
    }
  }, [isOpen])

  const handleAddArtist = async () => {
    if (!newArtistName || !newArtistEmail) {
      toast.error('Please enter both name and email.')
      return
    }
    setIsAddingArtist(true)
    try {
      const { data, error } = await supabase
        .from('artists')
        .insert({ name: newArtistName, email: newArtistEmail })
        .select()
        .single()
      if (error) throw error
      setArtists(prev => [...prev, data])
      setSelectedArtistId(data.id)
      setNewArtistName('')
      setNewArtistEmail('')
      setShowAddArtist(false)
      toast.success(`Artist "${data.name}" added.`)
    } catch (err: any) {
      toast.error('Failed to add artist: ' + (err.message || ''))
    } finally {
      setIsAddingArtist(false)
    }
  }

  const handleDocToggle = (id: string, checked: boolean) => {
    setSelectedDocs(prev => ({ ...prev, [id]: checked }))
  }

  const handleDateChange = (id: string, date: string) => {
    setDocDates(prev => ({ ...prev, [id]: date }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validation
    const hasAtLeastOneDoc = Object.values(selectedDocs).some(val => val === true)
    if (!hasAtLeastOneDoc) {
      toast.error('Validation Error', { description: 'You must require at least one document.' })
      return
    }

    if (!selectedArtistId) {
      toast.error('Validation Error', { description: 'Please select an artist.' })
      return
    }

    setIsSubmitting(true)

    try {
      // Find full artist details
      const selectedArtist = artists.find(a => a.id === selectedArtistId)

      // Generate a stable show ID client-side so n8n can use it when inserting
      const show_id = crypto.randomUUID()
      // Generate portal base URL (from env var with fallback)
      const basePortalUrl = process.env.NEXT_PUBLIC_ARTIST_PORTAL_URL || 'https://sr-artist-portal-live.vercel.app'
      
      // Generate a master portal token for this show (shorter, cleaner for URLs)
      const showPortalToken = Math.random().toString(36).substring(2, 17)

      // Build required_documents
      const docs = defaultDocs
        .filter(doc => selectedDocs[doc.id])
        .map(doc => {
          return {
            name: doc.label,
            deadline: docDates[doc.id] || showDate,
            portal_token: showPortalToken, // Use the short token
            portal_url: `${basePortalUrl}/?token=${showPortalToken}`
          }
        })

      const primaryPortalUrl = `${basePortalUrl}/?token=${showPortalToken}`
      const artistName = selectedArtist?.name || 'Unknown Artist'


      // Fetch a FRESH Google access token via the refresh endpoint.
      // This auto-refreshes the token if it has expired (tokens expire ~1 hour).
      let access_token: string | null = null
      try {
        const refreshRes = await fetch('/api/auth/google/refresh', { method: 'POST' })
        if (refreshRes.ok) {
          const refreshData = await refreshRes.json()
          access_token = refreshData.access_token ?? null
        }
      } catch {
        // Non-fatal — calendar creation will be skipped in n8n if token is missing
      }

      const userId = (await supabase.auth.getUser()).data.user?.id

      const payload = {
        show_id,
        user_id: userId,
        access_token: access_token,
        show_name: `${artistName} @ ${venue}`,
        show_time: showTime || null,
        show_end_time: showEndTime || null,
        load_in_time: loadInTime || null,
        soundcheck_time: soundcheckTime || null,
        changeover_time: changeoverTime || null,
        doors_time: doorsTime || null,
        musicians_count: musiciansCount || 0,
        host_name: hostName || null,
        artist_epk_url: artistEpkUrl || null,
        stageplot_url: stageplotUrl || null,
        technical_notes: technicalNotes || null,
        artist_comment: artistComment || null,
        catering_notes: cateringNotes || null,
        sync_to_calendar: syncToCalendar,
        status: 'pending',
        artist_id: selectedArtistId,
        artist_name: artistName,
        artist_email: selectedArtist?.email || '',
      }

      if (!payload.artist_email) {
        toast.error('Missing Email', { description: 'Please ensure the selected artist has an email address.' })
        setIsSubmitting(false)
        return
      }

      const payloadFinal = {
        ...payload,
        venue,
        venue_name: venue,
        city,
        date: showDate,
        required_documents: docs,
        timestamp: new Date().toISOString(),
        portal_token: showPortalToken,
        portal_url: primaryPortalUrl,
        deal_type: dealType,
        deal_guarantee: dealGuarantee,
        deal_percentage: dealPercentage,
        ticket_tiers: ticketTiers,
        expenses: expenses
      };

      // POST to server-side proxy (avoids CORS/mixed-content and hides webhook URL)
      const response = await fetch('/api/n8n/create-show', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payloadFinal)
        })

      if(!response.ok) {
          let details = ''
        try {
            const json = await response.json()
          details = json?.error || json?.details || json?.body || ''
          } catch {
            // ignore JSON parse error for error response
          }
        throw new Error(details ? `Request failed (${response.status}): ${details}` : `Request failed (${response.status})`)
    }
      
      // --- Handle Venue Memory ---
      let finalVenueId = null
      try {
        const existingVenue = venuesList.find(v => v.name.toLowerCase() === venue.toLowerCase())
        if (existingVenue) {
          finalVenueId = existingVenue.id
        } else {
          const { data: newVenue, error } = await supabase.from('venues').insert({
            name: venue,
            city: city,
            default_capacity: ticketTiers.reduce((acc, t) => acc + (Number(t.capacity) || 0), 0)
          }).select().single()
          if (!error && newVenue) {
            finalVenueId = newVenue.id
          }
        }
      } catch (err) {
        console.error('Failed to upsert venue:', err)
      }

      // --- Update Show with Financial Data ---
      // n8n confirmed to NOT save portal_token, so we use two reliable fallbacks:
      // 1. Match by show_id (works if n8n preserved our generated UUID as the row id)
      // 2. Match by most recent show for this artist created in the last 2 min (always works)
      try {
        let createdShowId: string | null = null
        const cutoff = new Date(Date.now() - 2 * 60 * 1000).toISOString() // 2 min ago

        for (let i = 0; i < 12; i++) {
          // Try 1: n8n may have used our generated show_id as the Supabase row id
          const { data: byId } = await supabase
            .from('shows')
            .select('id')
            .eq('id', show_id)
            .maybeSingle()

          if (byId?.id) {
            createdShowId = byId.id
            console.log('[ShowReady] Found show by id:', createdShowId)
            break
          }

          // Try 2: most recently created show for this artist (we just made it)
          const { data: byArtist } = await supabase
            .from('shows')
            .select('id, created_at')
            .eq('artist_id', selectedArtistId)
            .gte('created_at', cutoff)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()

          if (byArtist?.id) {
            createdShowId = byArtist.id
            console.log('[ShowReady] Found show by artist+time:', createdShowId)
            break
          }

          // Wait 1s before next poll
          await new Promise(r => setTimeout(r, 1000))
        }

        if (createdShowId) {
          const { error: updateError } = await supabase
            .from('shows')
            .update({
              ticket_tiers: ticketTiers,
              expenses: expenses,
              deal_type: dealType,
              deal_guarantee: dealGuarantee,
              deal_percentage: dealPercentage,
              venue_id: finalVenueId,
              show_end_time: showEndTime || null,
              changeover_time: changeoverTime || null,
              musicians_count: musiciansCount || 0,
              host_name: hostName || null,
              artist_epk_url: artistEpkUrl || null,
              stageplot_url: stageplotUrl || null,
              technical_notes: technicalNotes || null,
              artist_comment: artistComment || null
            })
            .eq('id', createdShowId)

          if (updateError) {
            console.error('[ShowReady] Financial update error:', updateError)
            toast.error('Financial data could not be saved.', {
              description: `DB error: ${updateError.message}`
            })
          } else {
            console.log('[ShowReady] Financial data saved successfully to show:', createdShowId)
          }
        } else {
          console.error('[ShowReady] Show row not found after polling. n8n may be slow or failing.')
          toast.error('Show created but financial data was not saved.', {
            description: 'Could not locate the new show row in Supabase. Check your n8n workflow is inserting correctly.'
          })
        }
      } catch (err: any) {
        console.error('[ShowReady] Financial update crashed:', err)
      }
      
      toast.success('Show created.', {
      description: `Portal link sent to the artist. They'll receive an email shortly.`
    })

    onClose()
    onSuccess?.()

    // Reset form
    setVenue('')
    setCity('')
    setShowDate('')
    setShowTime('')
    setLoadInTime('')
    setSoundcheckTime('')
    setChangeoverTime('')
    setDoorsTime('')
    setShowEndTime('')
    setMusiciansCount(0)
    setHostName('')
    setArtistEpkUrl('')
    setStageplotUrl('')
    setTechnicalNotes('')
    setArtistComment('')
    setCateringNotes('')
    setSyncToCalendar(true)
    setSelectedDocs({ epk: true, bio: true, photos: true, rider: true, contract: true })
    setDocDates({})
    setTicketTiers([{ name: 'General Admission', price: 0, capacity: 0 }])
    setExpenses([{ name: 'Rent', amount: 0 }])
    setDealType('flat')
    setDealGuarantee(0)
    setDealPercentage(0)
  } catch {
    console.error('Submission error')
    toast.error('Failed to create show. Please try again or check n8n connection.')
  } finally {
    setIsSubmitting(false)
  }
}

return (
  <Dialog
    open={isOpen}
    onOpenChange={(open) => {
      if (!open) onClose()
    }}
  >
    <DialogContent className="sm:max-w-[600px] bg-ebony-900/95 backdrop-blur-3xl border-white/10 shadow-2xl p-0 overflow-y-auto max-h-[90vh] rounded-[2rem] [&>button]:hidden">
      {/* Luminous Header Gradient */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />

      {/* Manual Close Button */}
      <button
        onClick={onClose}
        className="absolute right-6 top-6 z-50 h-8 w-8 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-black/60 transition-all"
      >
        <X size={16} />
      </button>

      <div className="p-8 pb-6 relative z-10 border-b border-white/5">
        <DialogHeader>
          <DialogTitle className="text-3xl font-black uppercase italic tracking-tighter">Create New Show</DialogTitle>
          <DialogDescription className="text-muted-foreground/80 font-medium mt-2">
            Enter the show details and select the documents you need the artist to provide.
          </DialogDescription>
        </DialogHeader>
      </div>

      <form onSubmit={handleSubmit} className="px-8 py-6 space-y-8 relative z-10 bg-black/20">
        <div className="space-y-6">
          {/* Context Fields */}
          <div className="space-y-4 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-primary rounded-full" />
              <Label htmlFor="artist" className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80 bg-primary/5 px-2 py-0.5 rounded">Artist Selection</Label>
            </div>
            <Select
              value={selectedArtistId}
              onValueChange={setSelectedArtistId}
              disabled={isLoadingArtists}
            >
              <SelectTrigger className="bg-zinc-950 border-white/10 h-14 focus:ring-primary/50 text-foreground w-full rounded-2xl px-5 text-lg font-bold shadow-inner">
                <div className="flex items-center gap-3">
                  <User size={18} className="text-primary/60" />
                  <SelectValue placeholder={isLoadingArtists ? "Select..." : "Select an artist"} />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-ebony-900 border-white/10 rounded-2xl">
                {artists.map(artist => (
                  <SelectItem key={artist.id} value={artist.id} className="py-3 font-bold">
                    {artist.name}
                  </SelectItem>
                ))}
                {artists.length === 0 && !isLoadingArtists && (
                  <SelectItem value="none" disabled className="py-3 font-bold">No artists found</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-primary rounded-full" />
                <Label htmlFor="venue" className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80 bg-primary/5 px-2 py-0.5 rounded">Venue & City</Label>
              </div>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                <div className="flex gap-2">
                  <Input
                    id="venue"
                    name="venue"
                    list="venue-list"
                    value={venue}
                    onChange={(e) => {
                      const val = e.target.value
                      setVenue(val)
                      const existing = venuesList.find(v => v.name.toLowerCase() === val.toLowerCase())
                      if (existing) {
                        if (existing.city) setCity(existing.city)
                        if (existing.default_expenses) setExpenses(existing.default_expenses)
                      }
                    }}
                    required
                    placeholder="Name"
                    className="pl-12 bg-zinc-950 border-white/10 h-14 focus-visible:ring-primary/50 rounded-2xl font-bold text-lg transition-all hover:border-white/20 placeholder:text-zinc-700 shadow-inner"
                  />
                  <datalist id="venue-list">
                    {venuesList.map(v => (
                      <option key={v.id} value={v.name} />
                    ))}
                  </datalist>
                  <Input
                    id="city"
                    name="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="bg-zinc-950 border-white/10 h-14 focus-visible:ring-primary/50 rounded-2xl font-bold text-lg transition-all hover:border-white/20 placeholder:text-zinc-700 w-32 shadow-inner"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-primary rounded-full" />
                <Label htmlFor="date" className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80 bg-primary/5 px-2 py-0.5 rounded">Show Date</Label>
              </div>
              <div className="relative group">
                <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={showDate}
                  onChange={(e) => setShowDate(e.target.value)}
                  required
                  className="pl-12 bg-zinc-950 border-white/10 h-14 focus-visible:ring-primary/50 text-foreground [color-scheme:dark] rounded-2xl font-bold text-lg tracking-widest transition-all group-hover:border-white/20 shadow-inner"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-primary rounded-full" />
                <Label htmlFor="time" className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80 bg-primary/5 px-2 py-0.5 rounded">Performance Time</Label>
              </div>
              <div className="relative group">
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={showTime}
                  onChange={(e) => setShowTime(e.target.value)}
                  className="bg-zinc-950 border-white/10 h-14 focus-visible:ring-primary/50 text-foreground [color-scheme:dark] rounded-2xl font-bold text-lg tracking-widest transition-all group-hover:border-white/20 pl-5 shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* Financials & Deal Structure */}
          <div className="pt-6 border-t border-white/5 space-y-6">
            <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-emerald-500 rounded-full" />
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/80 bg-emerald-500/5 px-2 py-0.5 rounded italic">Financials & Revenue Model</Label>
            </div>
            </div>

            {/* Deal Type */}
            <div className="space-y-4 bg-muted/10 p-5 rounded-3xl border border-white/5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase tracking-widest text-zinc-300">Deal Type</Label>
                  <Select value={dealType} onValueChange={setDealType}>
                    <SelectTrigger className="bg-white/5 border-white/10 h-12 focus:ring-primary/50 text-foreground w-full rounded-xl px-4 font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-ebony-900 border-white/10 rounded-xl">
                      <SelectItem value="flat">Flat Guarantee</SelectItem>
                      <SelectItem value="split">Door Split</SelectItem>
                      <SelectItem value="versus">Versus Deal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(dealType === 'flat' || dealType === 'versus') && (
                  <div className="space-y-3">
                    <Label className="text-[9px] font-black uppercase tracking-widest text-emerald-500/60 ml-1">Guarantee ($)</Label>
                    <Input
                      type="number"
                      value={dealGuarantee || ''}
                      onChange={e => setDealGuarantee(Number(e.target.value))}
                      className="bg-zinc-950 border-white/10 h-12 focus-visible:ring-emerald-500/50 text-foreground rounded-xl font-bold shadow-inner"
                    />
                  </div>
                )}

                {(dealType === 'split' || dealType === 'versus') && (
                  <div className="space-y-3">
                    <Label className="text-[9px] font-black uppercase tracking-widest text-emerald-500/60 ml-1">Artist Split (%)</Label>
                    <Input
                      type="number"
                      value={dealPercentage || ''}
                      onChange={e => setDealPercentage(Number(e.target.value))}
                      className="bg-zinc-950 border-white/10 h-12 focus-visible:ring-emerald-500/50 text-foreground rounded-xl font-bold shadow-inner"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Ticket Tiers */}
            <div className="space-y-4 bg-muted/10 p-5 rounded-3xl border border-white/5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold uppercase tracking-widest text-white">Ticket Tiers</Label>
                <Button type="button" variant="outline" size="sm" onClick={() => setTicketTiers([...ticketTiers, { name: '', price: 0, capacity: 0 }])} className="h-7 text-[10px] uppercase font-bold border-white/10 bg-white/5">
                  + Add Tier
                </Button>
              </div>
              {ticketTiers.map((tier, idx) => (
                <div key={idx} className="flex flex-wrap md:flex-nowrap items-center gap-3">
                  <Input placeholder="Tier" value={tier.name} onChange={e => { const t = [...ticketTiers]; t[idx].name = e.target.value; setTicketTiers(t) }} className="bg-zinc-950 border-white/10 h-10 text-xs flex-1 min-w-[120px] font-bold shadow-inner" />
                  <Input type="number" placeholder="Price" value={tier.price || ''} onChange={e => { const t = [...ticketTiers]; t[idx].price = Number(e.target.value); setTicketTiers(t) }} className="bg-zinc-950 border-white/10 h-10 w-24 text-xs font-bold shadow-inner" />
                  <Input type="number" placeholder="Cap" value={tier.capacity || ''} onChange={e => { const t = [...ticketTiers]; t[idx].capacity = Number(e.target.value); setTicketTiers(t) }} className="bg-zinc-950 border-white/10 h-10 w-24 text-xs font-bold shadow-inner" />
                  <Button type="button" variant="ghost" onClick={() => setTicketTiers(ticketTiers.filter((_, i) => i !== idx))} className="text-red-400 hover:text-red-300 h-10 px-2 shrink-0"><X size={14} /></Button>
                </div>
              ))}
            </div>

            {/* Expenses */}
            <div className="space-y-4 bg-muted/10 p-5 rounded-3xl border border-white/5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold uppercase tracking-widest text-white">Estimated Expenses</Label>
                <Button type="button" variant="outline" size="sm" onClick={() => setExpenses([...expenses, { name: '', amount: 0 }])} className="h-7 text-[10px] uppercase font-bold border-white/10 bg-white/5">
                  + Add Expense
                </Button>
              </div>
              {expenses.map((exp, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <Input placeholder="Expense Name" value={exp.name} onChange={e => { const ex = [...expenses]; ex[idx].name = e.target.value; setExpenses(ex) }} className="bg-white/5 border-white/10 h-10 text-xs flex-1" />
                  <Input type="number" placeholder="Amount" value={exp.amount || ''} onChange={e => { const ex = [...expenses]; ex[idx].amount = Number(e.target.value); setExpenses(ex) }} className="bg-white/5 border-white/10 h-10 w-32 text-xs" />
                  <Button type="button" variant="ghost" onClick={() => setExpenses(expenses.filter((_, i) => i !== idx))} className="text-red-400 hover:text-red-300 h-10 px-2 shrink-0"><X size={14} /></Button>
                </div>
              ))}
            </div>
          </div>

          {/* Logistics Section */}
          <div className="pt-6 border-t border-white/5 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-primary rounded-full" />
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80 bg-primary/5 px-2 py-0.5 rounded italic">Event Logistics & Timing</Label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <Label htmlFor="loadIn" className="text-[9px] font-black uppercase tracking-widest text-primary/60 ml-1">Load In</Label>
                <Input
                  id="loadIn"
                  type="time"
                  value={loadInTime}
                  onChange={(e) => setLoadInTime(e.target.value)}
                  className="bg-zinc-950 border-white/10 h-12 focus-visible:ring-primary/50 text-foreground [color-scheme:dark] rounded-xl font-bold text-sm tracking-widest transition-all shadow-inner"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="soundcheck" className="text-[9px] font-black uppercase tracking-widest text-primary/60 ml-1">Soundcheck</Label>
                <Input
                  id="soundcheck"
                  type="time"
                  value={soundcheckTime}
                  onChange={(e) => setSoundcheckTime(e.target.value)}
                  className="bg-zinc-950 border-white/10 h-12 focus-visible:ring-primary/50 text-foreground [color-scheme:dark] rounded-xl font-bold text-sm tracking-widest transition-all shadow-inner"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="doors" className="text-[9px] font-black uppercase tracking-widest text-primary/60 ml-1">Doors</Label>
                <Input
                  id="doors"
                  type="time"
                  value={doorsTime}
                  onChange={(e) => setDoorsTime(e.target.value)}
                  className="bg-zinc-950 border-white/10 h-12 focus-visible:ring-primary/50 text-foreground [color-scheme:dark] rounded-xl font-bold text-sm tracking-widest transition-all shadow-inner"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="changeover" className="text-[9px] font-black uppercase tracking-widest text-primary/60 ml-1">Changeover</Label>
                <Input
                  id="changeover"
                  type="time"
                  value={changeoverTime}
                  onChange={(e) => setChangeoverTime(e.target.value)}
                  className="bg-zinc-950 border-white/10 h-12 focus-visible:ring-primary/50 text-foreground [color-scheme:dark] rounded-xl font-bold text-sm tracking-widest transition-all shadow-inner"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="endTime" className="text-[9px] font-black uppercase tracking-widest text-primary/60 ml-1">Curfew / End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={showEndTime}
                  onChange={(e) => setShowEndTime(e.target.value)}
                  className="bg-zinc-950 border-white/10 h-12 focus-visible:ring-primary/50 text-foreground [color-scheme:dark] rounded-xl font-bold text-sm tracking-widest transition-all shadow-inner"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="musicians" className="text-xs font-bold uppercase tracking-widest text-zinc-300">Musicians On Stage</Label>
                <Input
                  id="musicians"
                  type="number"
                  value={musiciansCount || ''}
                  onChange={(e) => setMusiciansCount(Number(e.target.value))}
                  placeholder="0"
                  className="bg-white/5 border-white/10 h-12 focus-visible:ring-primary/50 text-foreground rounded-xl font-bold transition-colors"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="host" className="text-xs font-bold uppercase tracking-widest text-zinc-300">Presenter / Host</Label>
                <Input
                  id="host"
                  value={hostName}
                  onChange={(e) => setHostName(e.target.value)}
                  placeholder="e.g. Michele, Adrian"
                  className="bg-white/5 border-white/10 h-12 focus-visible:ring-primary/50 text-foreground rounded-xl font-bold transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="epk" className="text-[9px] font-black uppercase tracking-widest text-primary/60 ml-1">Artist Website / URL</Label>
                <Input
                  id="epk"
                  value={artistEpkUrl}
                  onChange={(e) => setArtistEpkUrl(e.target.value)}
                  placeholder="https://..."
                  className="bg-zinc-950 border-white/10 h-12 focus-visible:ring-primary/50 text-foreground rounded-xl font-bold transition-all shadow-inner placeholder:text-zinc-700"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="stageplot" className="text-[9px] font-black uppercase tracking-widest text-primary/60 ml-1">Stageplot / Tech Link</Label>
                <Input
                  id="stageplot"
                  value={stageplotUrl}
                  onChange={(e) => setStageplotUrl(e.target.value)}
                  placeholder="https://dropbox.com/..."
                  className="bg-zinc-950 border-white/10 h-12 focus-visible:ring-primary/50 text-foreground rounded-xl font-bold transition-all shadow-inner placeholder:text-zinc-700"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="techNotes" className="text-xs font-bold uppercase tracking-widest text-zinc-300">Technical / Stage Notes</Label>
              <Textarea
                id="techNotes"
                value={technicalNotes}
                onChange={(e) => setTechnicalNotes(e.target.value)}
                placeholder="Rider notes, power requirements, etc."
                className="bg-white/5 border-white/10 min-h-[80px] focus-visible:ring-primary/50 rounded-2xl font-medium text-sm transition-colors"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="artistComment" className="text-xs font-bold uppercase tracking-widest text-zinc-300">Internal Artist Comments</Label>
              <Textarea
                id="artistComment"
                value={artistComment}
                onChange={(e) => setArtistComment(e.target.value)}
                placeholder="Internal notes about the artist or performance history..."
                className="bg-white/5 border-white/10 min-h-[80px] focus-visible:ring-primary/50 rounded-2xl font-medium text-sm transition-colors"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="catering" className="text-xs font-bold uppercase tracking-widest text-zinc-300">Catering & Hospitality Notes</Label>
              <div className="relative group">
                <Utensils className="absolute left-4 top-4 h-5 w-5 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                <Textarea
                  id="catering"
                  value={cateringNotes}
                  onChange={(e) => setCateringNotes(e.target.value)}
                  placeholder="e.g. Vegetarian options required, specific arrival snacks..."
                  className="pl-12 bg-white/5 border-white/10 min-h-[100px] focus-visible:ring-primary/50 rounded-2xl font-medium text-sm transition-colors group-hover:border-white/20"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 rounded-2xl bg-primary/5 border border-primary/20">
              <Checkbox
                id="sync-calendar"
                checked={syncToCalendar}
                onCheckedChange={(checked) => setSyncToCalendar(checked as boolean)}
                className="border-primary/40 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground h-5 w-5 rounded-md"
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="sync-calendar"
                  className="text-xs font-bold text-white uppercase tracking-widest cursor-pointer flex items-center gap-2"
                >
                  Sync to Promoter Calendar
                </label>
                <p className="text-[10px] text-muted-foreground">
                  Automatically create a booked event with this schedule and the artist portal link.
                </p>
              </div>
            </div>
          </div>

          {/* Documents Checklist */}
          <div className="pt-6 border-t border-white/5">
            <div className="mb-4 flex items-center justify-between">
              <Label className="text-sm font-black uppercase tracking-widest text-white italic">Documents Required</Label>
              <span className="text-[10px] font-pro-data uppercase tracking-widest text-muted-foreground/60">* At least one required</span>
            </div>

            <div className="space-y-3 bg-muted/10 p-5 rounded-3xl border border-white/5">
              {defaultDocs.map((doc) => (
                <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl hover:bg-primary/10 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id={`doc-${doc.id}`}
                      checked={selectedDocs[doc.id] || false}
                      onCheckedChange={(checked) => handleDocToggle(doc.id, checked as boolean)}
                      className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground h-5 w-5 rounded-md"
                    />
                    <label
                      htmlFor={`doc-${doc.id}`}
                      className="text-sm font-bold text-white leading-none cursor-pointer"
                    >
                      {doc.label}
                    </label>
                  </div>
                  {selectedDocs[doc.id] && (
                    <div className="ml-8 sm:ml-0 flex items-center gap-2">
                      <span className="text-[10px] font-pro-data uppercase tracking-widest text-muted-foreground">Due:</span>
                      <Input
                        type="date"
                        className="h-9 w-[140px] bg-white/5 border-white/10 rounded-lg text-xs [color-scheme:dark] px-3 focus-visible:ring-primary/50"
                        value={docDates[doc.id] || ''}
                        onChange={(e) => handleDateChange(doc.id, e.target.value)}
                        required
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        <DialogFooter className="pt-8 flex flex-row items-center justify-end gap-3 sm:gap-3 sm:justify-end">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="hover:bg-white/5 h-12 px-6 rounded-xl font-pro-data uppercase tracking-widest text-[10px] sm:w-auto w-full"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/30 h-12 px-8 rounded-xl font-pro-data uppercase tracking-widest text-[11px] gap-2 transition-all active:scale-95 sm:w-auto w-full"
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            {isSubmitting ? 'Creating Show...' : 'Create Show & Send Artist Portal'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
)
}
