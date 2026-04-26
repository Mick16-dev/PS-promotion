'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Send, Loader2, CalendarIcon, MapPin, Music, User, Clock, Utensils, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'

export default function EditShowPage() {
  const router = useRouter()
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [artists, setArtists] = useState<any[]>([])

  // Form state (synced with CreateShowModal)
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
  const [technicalNotes, setTechnicalNotes] = useState('')
  const [cateringNotes, setCateringNotes] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        // 1. Load Artists
        const { data: artistsData } = await supabase.from('artists').select('id, name')
        setArtists(artistsData || [])

        // 2. Load Show Data
        const { data: show, error } = await supabase
          .from('shows')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error

        if (show) {
          setSelectedArtistId(show.artist_id || '')
          setVenue(show.venue || '')
          setCity(show.city || '')
          setShowDate(show.show_date || '')
          setShowTime(show.show_time || '')
          setShowEndTime(show.show_end_time || '')
          setLoadInTime(show.load_in_time || '')
          setSoundcheckTime(show.soundcheck_time || '')
          setChangeoverTime(show.changeover_time || '')
          setDoorsTime(show.doors_time || '')
          setMusiciansCount(show.musicians_count || 0)
          setHostName(show.host_name || '')
          setTechnicalNotes(show.technical_notes || '')
          setCateringNotes(show.catering_notes || '')
        }
      } catch (err) {
        console.error('Failed to load show:', err)
        toast.error('Could not load show details.')
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { error } = await supabase
        .from('shows')
        .update({
          artist_id: selectedArtistId,
          venue,
          city,
          show_date: showDate,
          show_time: showTime,
          show_end_time: showEndTime,
          load_in_time: loadInTime,
          soundcheck_time: soundcheckTime,
          changeover_time: changeoverTime,
          doors_time: doorsTime,
          musicians_count: musiciansCount,
          host_name: hostName,
          technical_notes: technicalNotes,
          catering_notes: cateringNotes,
        })
        .eq('id', id)

      if (error) throw error

      toast.success('Show updated successfully!')
      router.push(`/shows/${id}`)
    } catch (err) {
      console.error('Update failed:', err)
      toast.error('Failed to update show.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0c0d]">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0b0c0d] text-white p-8 md:p-12">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-4"
            >
              <ArrowLeft size={14} /> Back to Show
            </button>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">
              Edit <span className="text-zinc-600">Engagement</span>
            </h1>
          </div>
          <Button 
            form="edit-show-form"
            type="submit"
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/90 text-white h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-xs gap-3 shadow-xl shadow-primary/20 transition-all active:scale-95"
          >
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            {isSubmitting ? 'Saving...' : 'Update Show'}
          </Button>
        </div>

        <form id="edit-show-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Logistics Section */}
          <div className="space-y-8 bg-white/[0.02] border border-white/5 p-10 rounded-[3rem] shadow-2xl">
            <div className="flex items-center gap-3 border-b border-white/5 pb-6">
              <div className="w-1.5 h-6 bg-primary rounded-full" />
              <h2 className="text-lg font-black uppercase italic tracking-widest">Logistics</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Artist</Label>
                <Select value={selectedArtistId} onValueChange={setSelectedArtistId}>
                  <SelectTrigger className="bg-zinc-950 border-white/10 h-12 rounded-xl text-sm font-bold">
                    <SelectValue placeholder="Select Artist" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/10">
                    {artists.map(a => (
                      <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Venue</Label>
                  <Input value={venue} onChange={e => setVenue(e.target.value)} className="bg-zinc-950 border-white/10 h-12 rounded-xl font-bold" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">City</Label>
                  <Input value={city} onChange={e => setCity(e.target.value)} className="bg-zinc-950 border-white/10 h-12 rounded-xl font-bold" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Show Date</Label>
                <Input type="date" value={showDate} onChange={e => setShowDate(e.target.value)} className="bg-zinc-950 border-white/10 h-12 rounded-xl font-bold [color-scheme:dark]" />
              </div>
            </div>
          </div>

          {/* Schedule Section */}
          <div className="space-y-8 bg-white/[0.02] border border-white/5 p-10 rounded-[3rem] shadow-2xl">
            <div className="flex items-center gap-3 border-b border-white/5 pb-6">
              <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
              <h2 className="text-lg font-black uppercase italic tracking-widest">Schedule</h2>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Load In</Label>
                <Input type="time" value={loadInTime} onChange={e => setLoadInTime(e.target.value)} className="bg-zinc-950 border-white/10 h-12 rounded-xl font-bold [color-scheme:dark]" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Soundcheck</Label>
                <Input type="time" value={soundcheckTime} onChange={e => setSoundcheckTime(e.target.value)} className="bg-zinc-950 border-white/10 h-12 rounded-xl font-bold [color-scheme:dark]" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Show Time</Label>
                <Input type="time" value={showTime} onChange={e => setShowTime(e.target.value)} className="bg-zinc-950 border-white/10 h-12 rounded-xl font-bold [color-scheme:dark]" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Show End</Label>
                <Input type="time" value={showEndTime} onChange={e => setShowEndTime(e.target.value)} className="bg-zinc-950 border-white/10 h-12 rounded-xl font-bold [color-scheme:dark]" />
              </div>
            </div>
          </div>

          {/* Tech & Catering Section */}
          <div className="md:col-span-2 space-y-8 bg-white/[0.02] border border-white/5 p-10 rounded-[3rem] shadow-2xl">
            <div className="flex items-center gap-3 border-b border-white/5 pb-6">
              <div className="w-1.5 h-6 bg-rose-500 rounded-full" />
              <h2 className="text-lg font-black uppercase italic tracking-widest">Requirements</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Technical Notes</Label>
                <Textarea value={technicalNotes} onChange={e => setTechnicalNotes(e.target.value)} className="bg-zinc-950 border-white/10 min-h-[120px] rounded-2xl font-medium" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Catering Notes</Label>
                <Textarea value={cateringNotes} onChange={e => setCateringNotes(e.target.value)} className="bg-zinc-950 border-white/10 min-h-[120px] rounded-2xl font-medium" />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
