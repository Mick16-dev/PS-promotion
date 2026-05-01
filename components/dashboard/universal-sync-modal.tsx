'use client'

import React, { useState, useEffect } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, AlertCircle, ArrowRight, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { toast } from "sonner"
import { cn } from '@/lib/utils'

interface UniversalSyncModalProps {
  isOpen: boolean
  onClose: () => void
  selectedShowIds?: string[]
}

// Fixed column mapping — always exported in this order, no UI customization needed
const EXPORT_COLUMNS = [
  { field: 'artist_name',    header: 'Artist' },
  { field: 'show_date',      header: 'Date' },
  { field: 'venue_name',     header: 'Venue' },
  { field: 'city',           header: 'City' },
  { field: 'deal_guarantee', header: 'Fee' },
  { field: 'deal_type',      header: 'Deal Type' },
  { field: 'ticket_price',   header: 'Ticket Price' },
  { field: 'capacity',       header: 'Capacity' },
  { field: 'notes',          header: 'Notes' },
  { field: 'show_status',    header: 'Status' },
  { field: 'portal_url',     header: 'Portal Link' },
]

export function UniversalSyncModal({ isOpen, onClose, selectedShowIds: initialSelectedIds }: UniversalSyncModalProps) {
  const [isSyncing, setIsSyncing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleConnected, setIsGoogleConnected] = useState(true)

  const [spreadsheetName, setSpreadsheetName] = useState('Master Production Roster')
  const [sheetName, setSheetName] = useState('Active Shows')
  const [exportType, setExportType] = useState<'selected' | 'all'>('selected')
  const [selectedShowIds, setSelectedShowIds] = useState<string[]>(initialSelectedIds || [])
  const [availableShows, setAvailableShows] = useState<any[]>([])

  useEffect(() => {
    if (initialSelectedIds) setSelectedShowIds(initialSelectedIds)
  }, [initialSelectedIds])

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: profile } = await supabase
          .from('profiles')
          .select('last_spreadsheet_name, last_sheet_name')
          .eq('id', user.id)
          .single()
        if (profile?.last_spreadsheet_name) setSpreadsheetName(profile.last_spreadsheet_name)
        if (profile?.last_sheet_name) setSheetName(profile.last_sheet_name)

        const { data: shows } = await supabase
          .from('shows')
          .select('id, artist_name, show_date, venue_name')
          .order('show_date', { ascending: true })
        if (shows) setAvailableShows(shows)

        const { data: integration } = await supabase
          .from('user_integrations')
          .select('id')
          .eq('user_id', user.id)
          .eq('provider', 'google')
          .maybeSingle()
        setIsGoogleConnected(!!integration)
      } catch (err) {
        console.error('Error loading sync modal:', err)
      } finally {
        setIsLoading(false)
      }
    }
    if (isOpen) load()
  }, [isOpen])

  const toggleShow = (id: string) => {
    setSelectedShowIds(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])
  }

  const handleSync = async () => {
    setIsSyncing(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()

      let query = supabase.from('shows').select('*')
      if (exportType === 'selected') {
        if (selectedShowIds.length === 0) throw new Error('Please select at least one show.')
        query = query.in('id', selectedShowIds)
      } else {
        const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', user?.id).maybeSingle()
        if (profile?.organization_id) query = query.eq('organization_id', profile.organization_id)
        query = query.order('show_date', { ascending: true })
      }

      const { data: shows, error: fetchErr } = await query
      if (fetchErr) throw fetchErr
      if (!shows || shows.length === 0) throw new Error('No shows found.')

      // Save last used destination
      await supabase.from('profiles').update({
        last_spreadsheet_name: spreadsheetName,
        last_sheet_name: sheetName
      }).eq('id', user?.id)

      const { data: integration } = await supabase
        .from('user_integrations')
        .select('access_token')
        .eq('user_id', user?.id)
        .eq('provider', 'google')
        .maybeSingle()

      // Build clean padded rows — ensures no column shifts in n8n due to missing keys
      const paddedShows = shows.map(show => {
        const row: any = {}
        EXPORT_COLUMNS.forEach(col => {
          let val = show[col.field] || ''
          if (col.field === 'show_date' && val) val = new Date(val).toLocaleDateString()
          row[col.field] = val
        })
        return row
      })

      const response = await fetch('/api/n8n/universal-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user?.id,
          access_token: integration?.access_token || null,
          spreadsheet_name: spreadsheetName,
          sheet_name: sheetName,
          mode: 'universal_bulk_export',
          mapping: EXPORT_COLUMNS,
          shows: paddedShows,
          timestamp: new Date().toISOString()
        })
      })

      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.details || result.error || 'Sync failed')

      toast.success('Sync Successful!', { description: `Exported ${shows.length} shows to "${spreadsheetName}".` })
      onClose()
    } catch (err: any) {
      toast.error('Sync Failed', { description: err.message })
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[560px] bg-[#0b0c0d] border-white/10 p-0 overflow-hidden rounded-[2.5rem] shadow-2xl max-h-[90vh] flex flex-col">
        <div className="p-8 pb-6 border-b border-white/5 shrink-0">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-3 text-white">
              <Table className="text-primary" size={24} />
              Export to Google Sheets
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-2 font-medium">
              Select your shows and fire to Google Drive.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {!isGoogleConnected ? (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3 text-amber-500">
                <AlertCircle size={20} />
                <h4 className="font-bold uppercase tracking-tight text-sm">Google Offline</h4>
              </div>
              <p className="text-xs text-muted-foreground">Connect your Google account in Settings first.</p>
              <Button variant="outline" onClick={() => { onClose(); window.location.href = '/settings' }} className="w-full border-amber-500/20 bg-amber-500/5 text-amber-500 font-bold text-[10px] uppercase tracking-widest h-10 rounded-xl">Go to Integrations</Button>
            </div>
          ) : (
            <>
              {/* Destination */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Destination</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-2">Spreadsheet Name</Label>
                    <Input value={spreadsheetName} onChange={(e) => setSpreadsheetName(e.target.value)} className="bg-white/[0.03] border-white/10 h-12 rounded-xl px-4 text-sm font-bold text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-2">Sheet Tab Name</Label>
                    <Input value={sheetName} onChange={(e) => setSheetName(e.target.value)} className="bg-white/[0.03] border-white/10 h-12 rounded-xl px-4 text-sm font-bold text-white" />
                  </div>
                </div>
              </div>

              {/* Show Selection */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Engagements</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setExportType('all')} className={cn("text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full transition-all", exportType === 'all' ? "bg-primary text-white" : "text-zinc-500")}>All</button>
                    <button onClick={() => setExportType('selected')} className={cn("text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full transition-all", exportType === 'selected' ? "bg-primary text-white" : "text-zinc-500")}>Selective</button>
                  </div>
                </div>

                {exportType === 'selected' && (
                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden max-h-[220px] overflow-y-auto divide-y divide-white/[0.03]">
                    {availableShows.length === 0 ? (
                      <div className="p-4 text-center text-[10px] text-zinc-600 font-bold uppercase italic">No engagements found</div>
                    ) : (
                      availableShows.map(show => (
                        <div
                          key={show.id}
                          onClick={() => toggleShow(show.id)}
                          className={cn("flex items-center justify-between px-6 py-3 cursor-pointer transition-colors", selectedShowIds.includes(show.id) ? "bg-primary/5" : "hover:bg-white/[0.01]")}
                        >
                          <div className="flex flex-col">
                            <span className={cn("text-xs font-bold", selectedShowIds.includes(show.id) ? "text-primary" : "text-white")}>{show.artist_name}</span>
                            <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter">{show.venue_name} &bull; {new Date(show.show_date).toLocaleDateString()}</span>
                          </div>
                          <div className={cn("w-4 h-4 rounded-full border flex items-center justify-center transition-all", selectedShowIds.includes(show.id) ? "bg-primary border-primary" : "border-white/10")}>
                            {selectedShowIds.includes(show.id) && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Column preview */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Columns Being Exported</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {EXPORT_COLUMNS.map(col => (
                    <span key={col.field} className="text-[9px] font-black uppercase tracking-widest bg-white/5 border border-white/10 text-zinc-400 px-2 py-1 rounded-lg">{col.header}</span>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="p-8 bg-black/20 border-t border-white/5 shrink-0">
          <Button variant="ghost" onClick={onClose} className="h-12 px-6 rounded-xl font-bold uppercase tracking-widest text-[10px] text-zinc-500" disabled={isSyncing}>
            Cancel
          </Button>
          <Button
            onClick={handleSync}
            disabled={!isGoogleConnected || isSyncing || isLoading}
            className="bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/30 h-14 px-10 rounded-2xl font-black uppercase tracking-widest text-xs gap-3"
          >
            {isSyncing ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
            {isSyncing ? 'Exporting...' : 'Export to Sheets'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
