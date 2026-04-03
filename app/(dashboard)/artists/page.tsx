'use client'

import React, { useState, useEffect } from 'react'
import { Search, Plus, User, Mail, Star, ChevronRight, MoreVertical, X, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export default function ArtistsPage() {
  const [artists, setArtists] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  async function fetchArtists() {
    try {
      setIsLoading(true)
      const { data, error } = await supabase.from('artists').select('*').order('name', { ascending: true })
      if (error) throw error
      setArtists(data || [])
    } catch (err: any) { console.error(err) } finally { setIsLoading(false) }
  }

  useEffect(() => { fetchArtists() }, [])

  const handleAddArtist = async () => {
    if (!newName.trim() || !newEmail.trim()) { toast.error('Please enter both name and email.'); return }
    setIsSaving(true)
    try {
      const { data, error } = await supabase.from('artists').insert({ name: newName.trim(), email: newEmail.trim() }).select().single()
      if (error) throw error
      setArtists(prev => [...prev, data])
      setNewName(''); setNewEmail(''); setShowModal(false)
      toast.success('Artist added to roster.')
    } catch (err: any) { toast.error('Failed: ' + (err.message || '')) } finally { setIsSaving(false) }
  }

  const filtered = artists.filter(a => a.name?.toLowerCase().includes(searchQuery.toLowerCase()) || a.email?.toLowerCase().includes(searchQuery.toLowerCase()))

  if (isLoading) return <div className="flex h-[50vh] items-center justify-center"><div className="animate-spin h-6 w-6 border-2 border-primary/20 border-t-primary rounded-full" /></div>

  return (
    <div className="max-w-[1200px] mx-auto pt-10 pb-20 px-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between border-b border-white/[0.04] pb-10 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Link href="/" className="text-zinc-500 hover:text-zinc-300 text-xs font-medium transition-colors">Dashboard</Link>
            <ChevronRight size={10} className="text-zinc-700" />
            <span className="text-zinc-300 text-xs font-bold">Artist Directory</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white inline-flex items-center gap-3">Roster <span className="text-zinc-600 font-medium">Management</span></h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group mr-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
            <input placeholder="Search artist name..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="bg-zinc-900 border border-white/[0.05] rounded-lg h-10 pl-10 pr-4 text-sm text-white focus:outline-none w-[240px]" />
          </div>
          <Button onClick={() => setShowModal(true)} className="h-10 bg-white hover:bg-zinc-200 text-[#0B0C0E] font-bold text-sm px-5 rounded-lg gap-2">
            <Plus size={16} strokeWidth={3} /> Add Artist
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((artist) => (
          <div key={artist.id} className="bg-[#151618] border border-white/[0.04] rounded-xl p-6 hover:border-white/[0.08] transition-all group cursor-pointer shadow-xl">
            <div className="flex items-start justify-between mb-8">
              <div className="h-14 w-14 rounded-2xl bg-zinc-900 border border-white/[0.05] flex items-center justify-center text-2xl font-black">{artist.name?.[0] || '?'}</div>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg"><MoreVertical size={16} /></Button>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">{artist.name}</h3>
            <div className="flex items-center gap-2 text-zinc-500 mb-6"><Mail size={12} /><span className="text-xs">{artist.email || 'no-email@roster.com'}</span></div>
            <div className="pt-6 border-t border-white/[0.02] flex items-center justify-between">
              <div><p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Reliability</p><div className="flex items-center gap-1.5"><Star size={12} className="text-amber-500 fill-amber-500" /><span className="text-sm font-bold text-zinc-300">{artist.reliability_score || '9.8'}</span></div></div>
              <div className="text-right"><p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Total Shows</p><span className="text-sm font-bold text-zinc-300">{artist.shows_completed || '0'}</span></div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center flex flex-col items-center justify-center opacity-40">
          <User size={40} className="mb-4 text-zinc-600" />
          <p className="text-lg font-bold text-white">{searchQuery ? 'No matching artists' : 'No Artists in Roster'}</p>
          <p className="text-sm text-zinc-500 mt-1">Click Add Artist to get started.</p>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111213] border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-2xl relative">
            <button onClick={() => setShowModal(false)} className="absolute right-5 top-5 h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white"><X size={16} /></button>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-1">Add Artist</h2>
            <p className="text-sm text-zinc-500 mb-6">Add a new artist to your roster.</p>
            <div className="space-y-4">
              <div><label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 block">Artist Name</label><Input placeholder="e.g. Daisy Chapman" value={newName} onChange={e => setNewName(e.target.value)} className="bg-white/5 border-white/10 rounded-xl font-bold h-12" /></div>
              <div><label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 block">Email Address</label><Input placeholder="e.g. daisy@example.com" type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddArtist()} className="bg-white/5 border-white/10 rounded-xl font-bold h-12" /></div>
              <Button onClick={handleAddArtist} disabled={isSaving} className="w-full h-12 rounded-xl font-bold text-sm mt-2">{isSaving ? 'Adding...' : 'Add to Roster'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}