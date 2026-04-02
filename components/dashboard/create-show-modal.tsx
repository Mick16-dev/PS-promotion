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
import { CalendarIcon, MapPin, Music, User, Send, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

interface CreateShowModalProps {
  isOpen: boolean
  onClose: () => void
}

const defaultDocs = [
  { id: 'epk', label: 'EPK' },
  { id: 'bio', label: 'Artist Bio' },
  { id: 'photos', label: 'Press Photos' },
  { id: 'rider', label: 'Technical Rider' },
  { id: 'contract', label: 'Signed Contract' }
]

export function CreateShowModal({ isOpen, onClose }: CreateShowModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [artists, setArtists] = useState<any[]>([])
  const [isLoadingArtists, setIsLoadingArtists] = useState(false)
  
  // Form state
  const [selectedArtistId, setSelectedArtistId] = useState<string>('')
  const [venue, setVenue] = useState('')
  const [city, setCity] = useState('')
  const [showDate, setShowDate] = useState('')
  
  // Track selected documents and their deadlines
  const [selectedDocs, setSelectedDocs] = useState<Record<string, boolean>>({
    epk: true, bio: true, photos: true, rider: true, contract: true
  })
  const [docDates, setDocDates] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isOpen) {
      async function fetchArtists() {
        setIsLoadingArtists(true)
<<<<<<< HEAD
        const { data, error } = await supabase.from('artists').select('id, name')
        if (data && !error) {
          setArtists(data)
          if (data.length > 0) setSelectedArtistId(data[0].id)
=======
        try {
          const { data, error } = await supabase.from('artists').select('id, name')

          if (error) {
            console.error('Failed to fetch artists:', error)
            const urlHint =
              typeof window !== 'undefined'
                ? (process.env.NEXT_PUBLIC_SUPABASE_URL || '').split('.supabase.co')[0].slice(-12)
                : ''
            toast.error('Could not load artists.', {
              description: `Supabase query failed (table: artists${urlHint ? `, project: …${urlHint}` : ''}). ${error.message || ''}`.trim(),
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
>>>>>>> 9aac17ef09acd592c9377945794d838b5e056308
        }
      }
      fetchArtists()
    }
  }, [isOpen])

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
      // Prepare data for n8n
      const payload = {
        artist_id: selectedArtistId,
        venue_name: venue,
        city: city,
        date: showDate,
        required_documents: defaultDocs
          .filter(doc => selectedDocs[doc.id])
          .map(doc => ({
            name: doc.label,
            deadline: docDates[doc.id] || showDate // Default to show date if not set
          })),
        timestamp: new Date().toISOString()
      }

      // POST to server-side proxy (avoids CORS/mixed-content and hides webhook URL)
      const response = await fetch('/api/n8n/create-show', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        let details = ''
        try {
          const json = await response.json()
          details = json?.error || json?.details || json?.body || ''
        } catch {}
        throw new Error(details ? `Request failed (${response.status}): ${details}` : `Request failed (${response.status})`)
      }
      
      toast.success('Show created.', {
        description: `Portal link sent to the artist. They'll receive an email shortly.`
      })
      
      onClose()
      
      // Reset form
      setVenue('')
      setCity('')
      setShowDate('')
      setSelectedDocs({ epk: true, bio: true, photos: true, rider: true, contract: true })
      setDocDates({})
    } catch (error) {
      console.error('Submission error:', error)
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
      <DialogContent className="sm:max-w-[600px] bg-ebony-900/95 backdrop-blur-3xl border-white/10 shadow-2xl p-0 overflow-y-auto max-h-[90vh] rounded-[2rem]">
        {/* Luminous Header Gradient */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
        
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
            <div className="space-y-3 pb-2">
              <Label htmlFor="artist" className="text-[10px] font-pro-data uppercase tracking-[0.2em] text-muted-foreground font-bold">Artist</Label>
              <Select 
                value={selectedArtistId} 
                onValueChange={setSelectedArtistId}
                disabled={isLoadingArtists}
              >
                <SelectTrigger className="bg-white/5 border-white/10 h-14 focus:ring-primary/50 text-foreground w-full rounded-2xl px-5 text-lg font-bold">
                  <div className="flex items-center gap-3">
                    <User size={18} className="text-primary" />
                    <SelectValue placeholder={isLoadingArtists ? "Loading artists..." : "Select an artist"} />
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="venue" className="text-[10px] font-pro-data uppercase tracking-[0.2em] text-muted-foreground font-bold">Venue & City</Label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                  <div className="flex gap-2">
                    <Input 
                      id="venue" 
                      name="venue"
                      value={venue}
                      onChange={(e) => setVenue(e.target.value)}
                      required
                      placeholder="Venue Name" 
                      className="pl-12 bg-white/5 border-white/10 h-14 focus-visible:ring-primary/50 rounded-2xl font-bold text-lg transition-colors group-hover:border-white/20 placeholder:font-normal placeholder:text-muted-foreground/30"
                    />
                    <Input 
                      id="city" 
                      name="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City" 
                      className="bg-white/5 border-white/10 h-14 focus-visible:ring-primary/50 rounded-2xl font-bold text-lg transition-colors group-hover:border-white/20 placeholder:font-normal placeholder:text-muted-foreground/30 w-32"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="date" className="text-[10px] font-pro-data uppercase tracking-[0.2em] text-muted-foreground font-bold">Show Date</Label>
                <div className="relative group">
                  <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                  <Input 
                    id="date" 
                    name="date"
                    type="date" 
                    value={showDate}
                    onChange={(e) => setShowDate(e.target.value)}
                    required
                    className="pl-12 bg-white/5 border-white/10 h-14 focus-visible:ring-primary/50 text-foreground [color-scheme:dark] rounded-2xl font-bold text-lg tracking-widest transition-colors group-hover:border-white/20"
                  />
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
                        <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl hover:bg-white/[0.02] transition-colors">
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
