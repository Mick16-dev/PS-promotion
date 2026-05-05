'use client'

import React, { useState, useEffect, useRef } from 'react'
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
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, Plus, X, AlertCircle, ArrowRight, Loader2, Pencil, Check } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { toast } from "sonner"
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface UniversalSyncModalProps {
  isOpen: boolean
  onClose: () => void
  selectedShowIds?: string[]
}

interface ExportColumn {
  id: string
  field: string   // database field key — never changes, always used as JSON key
  header: string  // display name in Google Sheet — user can rename freely
}

// All database fields users can pick from when adding a column
const AVAILABLE_FIELDS = [
  { field: 'artist_name',    label: 'Artist Name' },
  { field: 'show_date',      label: 'Show Date' },
  { field: 'venue_name',     label: 'Venue' },
  { field: 'city',           label: 'City' },
  { field: 'deal_guarantee', label: 'Fee / Guarantee' },
  { field: 'deal_type',      label: 'Deal Type' },
  { field: 'ticket_price',   label: 'Ticket Price' },
  { field: 'capacity',       label: 'Capacity' },
  { field: 'notes',          label: 'Notes' },
  { field: 'show_status',    label: 'Status' },
  { field: 'portal_url',     label: 'Portal Link' },
  { field: 'show_time',      label: 'Show Time' },
  { field: 'doors_time',     label: 'Doors Time' },
  { field: 'load_in_time',   label: 'Load In Time' },
  { field: 'deal_percentage',label: 'Deal %' },
]

const DEFAULT_COLUMNS: ExportColumn[] = [
  { id: 'c1', field: 'artist_name',    header: 'Artist' },
  { id: 'c2', field: 'show_date',      header: 'Date' },
  { id: 'c3', field: 'venue_name',     header: 'Venue' },
  { id: 'c4', field: 'city',           header: 'City' },
  { id: 'c5', field: 'deal_guarantee', header: 'Fee' },
  { id: 'c6', field: 'deal_type',      header: 'Deal Type' },
  { id: 'c7', field: 'ticket_price',   header: 'Ticket Price' },
  { id: 'c8', field: 'capacity',       header: 'Capacity' },
  { id: 'c9', field: 'notes',          header: 'Notes' },
]

// Inline editable column chip
function ColumnChip({ col, onRename, onRemove }: {
  col: ExportColumn
  onRename: (id: string, newHeader: string) => void
  onRemove: (id: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(col.header)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  const commit = () => {
    const trimmed = draft.trim()
    if (trimmed) onRename(col.id, trimmed)
    else setDraft(col.header)
    setEditing(false)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group flex items-center gap-2 bg-white/[0.04] border border-white/10 hover:border-primary/30 rounded-2xl px-4 py-3 transition-all"
    >
      {editing ? (
        <div className="flex items-center gap-2 flex-1">
          <input
            ref={inputRef}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setDraft(col.header); setEditing(false) } }}
            onBlur={commit}
            className="bg-transparent border-none outline-none text-sm font-black uppercase italic text-primary w-full tracking-tight"
          />
          <button onClick={commit} className="text-primary shrink-0">
            <Check size={13} />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-sm font-black uppercase italic text-white tracking-tight truncate">{col.header}</span>
          <span className="text-[8px] font-bold text-zinc-600 shrink-0 hidden group-hover:inline">({col.field})</span>
          <button
            onClick={() => { setDraft(col.header); setEditing(true) }}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500 hover:text-primary shrink-0"
          >
            <Pencil size={11} />
          </button>
        </div>
      )}
      <button
        onClick={() => onRemove(col.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-600 hover:text-red-500 shrink-0"
      >
        <X size={13} />
      </button>
    </motion.div>
  )
}

export function UniversalSyncModal({ isOpen, onClose, selectedShowIds: initialSelectedIds }: UniversalSyncModalProps) {
  const [isSyncing, setIsSyncing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleConnected, setIsGoogleConnected] = useState(true)

  const [spreadsheetName, setSpreadsheetName] = useState('Master Production Roster')
  const [sheetName, setSheetName] = useState('Active Shows')
  const [exportType, setExportType] = useState<'selected' | 'all'>('selected')
  const [selectedShowIds, setSelectedShowIds] = useState<string[]>(initialSelectedIds || [])
  const [availableShows, setAvailableShows] = useState<any[]>([])
  const [columns, setColumns] = useState<ExportColumn[]>(DEFAULT_COLUMNS)

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
          .select('last_spreadsheet_name, last_sheet_name, global_export_mapping')
          .eq('id', user.id)
          .single()
        if (profile?.last_spreadsheet_name) setSpreadsheetName(profile.last_spreadsheet_name)
        if (profile?.last_sheet_name) setSheetName(profile.last_sheet_name)
        if (profile?.global_export_mapping?.length) setColumns(profile.global_export_mapping)

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

  const addColumn = (field: string) => {
    const alreadyAdded = columns.some(c => c.field === field)
    if (alreadyAdded) {
      toast.info('Column already added')
      return
    }
    const defaultLabel = AVAILABLE_FIELDS.find(f => f.field === field)?.label || field
    const newId = Math.random().toString(36).substring(2, 9)
    setColumns(prev => [...prev, { id: newId, field, header: defaultLabel }])
  }

  const renameColumn = (id: string, newHeader: string) => {
    setColumns(prev => prev.map(c => c.id === id ? { ...c, header: newHeader } : c))
  }

  const removeColumn = (id: string) => {
    setColumns(prev => prev.filter(c => c.id !== id))
  }

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

      // Save preferences
      await supabase.from('profiles').update({
        last_spreadsheet_name: spreadsheetName,
        last_sheet_name: sheetName,
        global_export_mapping: columns
      }).eq('id', user?.id)

      const { data: integration } = await supabase
        .from('user_integrations')
        .select('access_token')
        .eq('user_id', user?.id)
        .eq('provider', 'google')
        .maybeSingle()

      // Pad shows using m.header as key — this ensures that the JSON keys
      // match the exact column titles the user defined in the UI.
      const paddedShows = shows.map(show => {
        const row: any = {}
        columns.forEach(col => {
          let val = show[col.field] || ''
          if (col.field === 'show_date' && val) val = new Date(val).toLocaleDateString()
          row[col.header] = val
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
          mapping: columns,
          shows: paddedShows,  // n8n now receives keys matching the headers
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

  // Fields not yet added
  const remainingFields = AVAILABLE_FIELDS.filter(f => !columns.some(c => c.field === f.field))

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[640px] bg-[#0b0c0d] border-white/10 p-0 overflow-hidden rounded-[2.5rem] shadow-2xl max-h-[90vh] flex flex-col">
        <div className="p-8 pb-6 border-b border-white/5 shrink-0">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-3 text-white">
              <Table className="text-primary" size={24} />
              Freedom Export Console
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-2 font-medium">
              Rename any column, add new ones, then export. All data is auto-fetched from your shows.
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

              {/* Column Editor */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Columns</h3>
                    <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">Hover to rename or remove</span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-7 px-3 text-[9px] font-black uppercase text-primary bg-primary/10 hover:bg-primary/20 rounded-lg">
                        <Plus size={12} className="mr-1" /> Add Column
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-[#0f0f10] border-white/10 rounded-2xl p-2 w-52" align="end">
                      {remainingFields.length === 0 ? (
                        <div className="px-3 py-2 text-[10px] text-zinc-600 font-bold uppercase">All fields added</div>
                      ) : (
                        remainingFields.map(f => (
                          <DropdownMenuItem
                            key={f.field}
                            onClick={() => addColumn(f.field)}
                            className="text-xs font-bold text-white hover:text-primary cursor-pointer rounded-xl px-3 py-2"
                          >
                            {f.label}
                          </DropdownMenuItem>
                        ))
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <AnimatePresence mode="popLayout">
                    {columns.map(col => (
                      <ColumnChip
                        key={col.id}
                        col={col}
                        onRename={renameColumn}
                        onRemove={removeColumn}
                      />
                    ))}
                  </AnimatePresence>
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
                  <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden max-h-[200px] overflow-y-auto divide-y divide-white/[0.03]">
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
            {isSyncing ? 'Exporting...' : 'Export with Freedom'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
