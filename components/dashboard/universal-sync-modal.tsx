'use client'

import React, { useState, useEffect } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
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
import { 
  Table as TableIcon, 
  Zap, 
  Loader2, 
  AlertCircle,
  ChevronRight,
  ArrowRight,
  Plus,
  Trash2,
  GripVertical,
  Layout
} from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { motion, Reorder, AnimatePresence } from 'framer-motion'

interface UniversalSyncModalProps {
  isOpen: boolean
  onClose: () => void
  selectedShowIds?: string[]
}

type ExportMapping = {
  id: string
  source: string
  header: string
}

type ShowRow = Record<string, unknown>

const SOURCE_FIELDS = [
  { value: 'artist_name', label: 'Artist Name' },
  { value: 'venue_name', label: 'Venue / Location' },
  { value: 'show_date', label: 'Show Date' },
  { value: 'city', label: 'City' },
  { value: 'show_time', label: 'Performance Time' },
  { value: 'load_in_time', label: 'Load In' },
  { value: 'soundcheck_time', label: 'Soundcheck' },
  { value: 'deal_guarantee', label: 'Guarantee ($)' },
  { value: 'deal_type', label: 'Deal Type' },
  { value: 'portal_url', label: 'Artist Portal Link' },
  { value: 'status', label: 'Engagement Status' },
  { value: 'custom', label: 'Static / Custom Value' },
]

export function UniversalSyncModal({ isOpen, onClose, selectedShowIds }: UniversalSyncModalProps) {
  const [isGoogleConnected, setIsGoogleConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  
  const [spreadsheetName, setSpreadsheetName] = useState('Master Production Roster')
  const [sheetName, setSheetName] = useState('Active Shows')
  const [exportMode, setExportMode] = useState<'standard' | 'transposed'>('standard')
  const [exportType, setExportType] = useState<'selected' | 'all'>('all')
  const [mappings, setMappings] = useState<ExportMapping[]>([
    { id: '1', source: 'artist_name', override: '' },
    { id: '2', source: 'show_date', override: '' },
    { id: '3', source: 'venue_name', override: '' },
    { id: '4', source: 'deal_guarantee', override: '' },
  ])

  useEffect(() => {
    if (isOpen) {
      async function loadData() {
        setIsLoading(true)
        try {
          const { data: { user } } = await supabase.auth.getUser()
          if (!user) return

          const { data: integration } = await supabase
            .from('user_integrations')
            .select('id')
            .eq('user_id', user.id)
            .eq('provider', 'google')
            .maybeSingle()
          
          setIsGoogleConnected(!!integration)

          const { data: profile } = await supabase
            .from('profiles')
            .select('global_export_mapping, last_spreadsheet_name, last_sheet_name')
            .eq('id', user.id)
            .single()
          
          if (profile?.global_export_mapping) setMappings(profile.global_export_mapping)
          if (profile?.last_spreadsheet_name) setSpreadsheetName(profile.last_spreadsheet_name)
          if (profile?.last_sheet_name) setSheetName(profile.last_sheet_name)
        } catch (err) {
          console.error('Sync Modal Error:', err)
        } finally {
          setIsLoading(false)
        }
      }
      loadData()
    }
  }, [isOpen])

  const addColumn = () => {
    const newId = Math.random().toString(36).substring(2, 9)
    const usedFields = mappings.map(m => m.source)
    const nextField = SOURCE_FIELDS.find(f => !usedFields.includes(f.value)) || { value: 'custom', label: 'New Column' }
    
    setMappings([...mappings, { 
      id: newId, 
      source: nextField.value, 
      override: '' 
    }])
  }

  const removeColumn = (id: string) => {
    setMappings(mappings.filter(m => m.id !== id))
  }

  const updateMapping = (id: string, updates: Partial<ExportMapping>) => {
    setMappings(mappings.map(m => {
      if (m.id !== id) return m
      
      const newMapping = { ...m, ...updates }
      
      // If the user changed the source and the header is still default/empty/matches old source, auto-update header
      if (updates.source) {
        const oldSourceLabel = SOURCE_FIELDS.find(f => f.value === m.source)?.label
        const newSourceLabel = SOURCE_FIELDS.find(f => f.value === updates.source)?.label
        
        if (!m.header || m.header === 'New Column' || m.header === oldSourceLabel) {
          newMapping.header = newSourceLabel === 'Static / Custom Value' ? '' : (newSourceLabel || '')
        }
      }
      
      return newMapping
    }))
  }

  const resolveMappedValue = (show: ShowRow, source: string): string => {
    if (!show) return ''

    const portalFallbackFromToken = (): string => {
      const raw = show.portal_token
      const token = typeof raw === 'string' || typeof raw === 'number' ? String(raw).trim() : ''
      if (!token) return ''
      const base = (process.env.NEXT_PUBLIC_ARTIST_PORTAL_URL || 'https://sr-artist-portal-live.vercel.app').replace(/\/$/, '')
      return `${base}/?token=${encodeURIComponent(token)}`
    }

    switch (source) {
      case 'artist_name':
        return String(show.artist_name || show.artist || show.name || '')
      case 'venue_name':
        return String(show.venue_name || show.venue || show.location || '')
      case 'show_date':
        const d = show.show_date || show.date || show.start_time
        return d ? new Date(String(d)).toLocaleDateString() : ''
      case 'deal_guarantee':
        const fee = show.deal_guarantee || show.guarantee || show.fee
        return fee ? `$${Number(fee).toLocaleString()}` : ''
      case 'deal_type':
        return String(show.deal_type ?? '')
      case 'portal_url': {
        const direct = String(show.portal_url ?? '').trim()
        return direct || portalFallbackFromToken()
      }
      case 'status':
        return String(show.status ?? '')
      case 'custom':
        return ''
      default:
        return String(show[source] ?? '')
    }
  }

  const handleSync = async () => {
    if (!spreadsheetName) {
      toast.error('Please name your spreadsheet.')
      return
    }

    setIsSyncing(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      let query = supabase.from('shows').select('*')
      if (exportType === 'selected' && selectedShowIds && selectedShowIds.length > 0) {
        query = query.in('id', selectedShowIds)
      } else if (exportType === 'all') {
        // Fetch all active/upcoming shows for this user/org
        query = query.order('show_date', { ascending: true })
      }
      const { data: shows, error: fetchErr } = await query
      if (fetchErr) throw fetchErr

      // Save preferences
      await supabase.from('profiles').update({ 
        global_export_mapping: mappings,
        last_spreadsheet_name: spreadsheetName,
        last_sheet_name: sheetName
      }).eq('id', user?.id)

      const { data: integration } = await supabase
        .from('user_integrations')
        .select('access_token')
        .eq('user_id', user?.id)
        .eq('provider', 'google')
        .maybeSingle()

      const sanitizedMappings = mappings.filter((m) => m.source && m.source !== 'custom')

      if (sanitizedMappings.length === 0) {
        throw new Error('Please select at least one field to export.')
      }

      const headersArray = sanitizedMappings.map((m) => {
        // Use manual override as header if provided, otherwise use dropdown label
        return (m.override && m.override.trim()) ? m.override.trim() : (SOURCE_FIELDS.find(f => f.value === m.source)?.label || m.source)
      })
      
      let spreadsheet_values: any[][] = []
      let dataRows: any[][] = []
      let mappedData: any[] = []

      if (exportMode === 'transposed') {
        spreadsheet_values = sanitizedMappings.map((m, i) => {
          const header = headersArray[i]
          const row = [header]
          shows.forEach((show: any) => {
            row.push(resolveMappedValue(show, m.source))
          })
          return row
        })
        dataRows = spreadsheet_values
        mappedData = spreadsheet_values
      } else {
        dataRows = (shows || []).map((show: ShowRow) => {
          return sanitizedMappings.map(m => resolveMappedValue(show, m.source))
        })
        spreadsheet_values = [headersArray, ...dataRows]
        
        mappedData = (shows || []).map((show: ShowRow, idx: number) => {
          const row: Record<string, any> = {}
          sanitizedMappings.forEach((m, i) => {
            const header = headersArray[i]
            row[header] = dataRows[idx][i]
          })
          return row
        })
      }

      const response = await fetch('/api/n8n/universal-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user?.id,
          access_token: integration?.access_token || null,
          mode: 'universal_bulk_export',
          export_layout: exportMode,
          spreadsheet_name: spreadsheetName,
          sheet_name: sheetName,
          mapping: sanitizedMappings.map(m => ({ 
            ...m, 
            header: SOURCE_FIELDS.find(f => f.value === m.source)?.label || m.source 
          })),
          header_row: headersArray,
          data_rows: dataRows,
          data_rows: dataRows,
          rows: dataRows,
          spreadsheet_values: spreadsheet_values,
          mapped_data: mappedData,
          show_count: shows?.length || 0,
          raw_shows: shows,
          timestamp: new Date().toISOString()
        })
      })

      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.details || result.error || 'Sync failed')

      toast.success('Flexible Export Successful!', {
        description: `Exported ${shows.length} rows to "${spreadsheetName}".`
      })
      onClose()
    } catch (err: any) {
      toast.error('Export Failed', { description: err.message })
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] bg-[#050607] border-white/10 p-0 overflow-hidden rounded-[2.5rem] shadow-2xl max-h-[90vh] flex flex-col">
        <div className="p-10 pb-6 shrink-0">
          <DialogHeader>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_20px_rgba(20,184,166,0.15)]">
                 <Layout className="text-primary" size={28} />
              </div>
              <DialogTitle className="text-4xl font-black uppercase italic tracking-tighter text-white">
                Flexible Export
              </DialogTitle>
            </div>
            <DialogDescription className="text-zinc-500 font-medium text-base">
              Configure your spreadsheet layout and field mapping for the production roster.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto px-10 py-6 space-y-10 custom-scrollbar">
          {!isGoogleConnected ? (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-[2rem] p-8 space-y-4">
               <div className="flex items-center gap-3 text-amber-500">
                  <AlertCircle size={24} />
                  <h4 className="font-black uppercase tracking-tight text-lg">Google Offline</h4>
               </div>
               <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                 Your Google account is not connected. Connect it in Settings to enable direct spreadsheet sync.
               </p>
               <Button 
                 onClick={() => { onClose(); window.location.href = '/settings' }}
                 className="bg-amber-500 text-black font-black text-xs uppercase tracking-widest h-12 px-8 rounded-xl hover:bg-amber-400"
               >
                 Connect Now <ChevronRight size={16} />
               </Button>
            </div>
          ) : (
            <>
              {/* CONFIGURATION HEADER */}
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary block ml-2">Spreadsheet Name</Label>
                  <Input 
                    value={spreadsheetName}
                    onChange={(e) => setSpreadsheetName(e.target.value)}
                    className="w-full h-14 bg-white/[0.03] border border-white/10 rounded-2xl px-6 text-sm font-bold text-white focus:outline-none focus:border-primary/40 transition-all placeholder:text-zinc-700"
                    placeholder="e.g. Master Production Roster"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary block ml-2">Sheet Name</Label>
                  <Input 
                    value={sheetName}
                    onChange={(e) => setSheetName(e.target.value)}
                    className="w-full h-14 bg-white/[0.03] border border-white/10 rounded-2xl px-6 text-sm font-bold text-white focus:outline-none focus:border-primary/40 transition-all placeholder:text-zinc-700"
                    placeholder="e.g. Active Shows"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary block ml-2">Export Range</Label>
                  <Select value={exportType} onValueChange={(val: any) => setExportType(val)}>
                    <SelectTrigger className="w-full h-14 bg-white/[0.03] border border-white/10 rounded-2xl px-6 text-sm font-bold text-white focus:outline-none focus:border-primary/40 transition-all">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#050607] border-white/10 text-white">
                      <SelectItem value="all" className="font-bold">All Shows</SelectItem>
                      <SelectItem value="selected" className="font-bold">Selected Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary block ml-2">Layout</Label>
                  <Select value={exportMode} onValueChange={(val: any) => setExportMode(val)}>
                    <SelectTrigger className="w-full h-14 bg-white/[0.03] border border-white/10 rounded-2xl px-6 text-sm font-bold text-white focus:outline-none focus:border-primary/40 transition-all">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#050607] border-white/10 text-white">
                      <SelectItem value="standard" className="font-bold">List (Rows)</SelectItem>
                      <SelectItem value="transposed" className="font-bold">Transposed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* MAPPING SECTION */}
              <div className="space-y-6 pb-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <h3 className="text-lg font-black uppercase italic tracking-tighter text-white">Column Mapping</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={addColumn}
                    className="h-9 px-4 border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary/10 transition-all gap-2"
                  >
                    <Plus size={14} /> Add Column
                  </Button>
                </div>

                <Reorder.Group axis="y" values={mappings} onReorder={setMappings} className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {mappings.map((m) => (
                      <Reorder.Item 
                        key={m.id} 
                        value={m}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-white/10 transition-all shadow-lg"
                      >
                        <div className="cursor-grab active:cursor-grabbing text-zinc-700 group-hover:text-zinc-500 transition-colors">
                          <GripVertical size={20} />
                        </div>

                        <div className="flex-1 grid grid-cols-2 gap-4">
                          <Select 
                            value={m.source} 
                            onValueChange={(val) => updateMapping(m.id, { source: val })}
                          >
                            <SelectTrigger className="bg-black/60 border-white/20 h-12 rounded-xl font-bold text-xs text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#0F1118] border-white/10 text-white">
                              {SOURCE_FIELDS.map(f => (
                                <SelectItem key={f.value} value={f.value} className="font-bold text-xs hover:bg-primary/20">{f.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Input 
                            value={m.override || ''}
                            onChange={(e) => updateMapping(m.id, { override: e.target.value })}
                            placeholder="Custom Column Title"
                            className="bg-black/60 border-white/20 h-12 rounded-xl font-bold text-sm text-white placeholder:text-zinc-600 focus:border-primary/50 transition-all shadow-inner"
                          />
                        </div>

                        <button 
                          onClick={() => removeColumn(m.id)}
                          className="h-10 w-10 flex items-center justify-center text-zinc-700 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </Reorder.Item>
                    ))}
                  </AnimatePresence>
                </Reorder.Group>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="p-10 bg-black/40 border-t border-white/5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
             <div className={`h-2 w-2 rounded-full ${isGoogleConnected ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`} />
             <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
               {isGoogleConnected ? 'Google Cloud Connected' : 'Google Disconnected'}
             </span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onClose} className="h-12 px-6 rounded-xl font-bold uppercase tracking-widest text-[10px] text-zinc-500" disabled={isSyncing}>
              Cancel
            </Button>
            <Button 
              onClick={handleSync}
              disabled={!isGoogleConnected || isSyncing || isLoading}
              className="bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/20 h-16 px-12 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs gap-3 active:scale-95 transition-all"
            >
              {isSyncing ? <Loader2 size={18} className="animate-spin" /> : <TableIcon size={18} />}
              {isSyncing ? 'Synchronizing...' : 'Trigger Universal Sync'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
