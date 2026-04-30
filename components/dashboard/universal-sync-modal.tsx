'use client'

import React, { useState, useEffect } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  Layout, 
  Plus, 
  Trash2, 
  GripVertical, 
  AlertCircle, 
  ChevronRight 
} from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from "sonner"
import { Reorder, AnimatePresence } from 'framer-motion'

interface UniversalSyncModalProps {
  isOpen: boolean
  onClose: () => void
  selectedShowIds?: string[]
}

interface ExportMapping {
  id: string
  source: string
  override: string
}

const SOURCE_FIELDS = [
  { value: 'artist_name', label: 'Artist Name' },
  { value: 'venue_name', label: 'Venue / Location' },
  { value: 'show_date', label: 'Show Date' },
  { value: 'city', label: 'City' },
  { value: 'deal_guarantee', label: 'Guarantee ($)' },
  { value: 'show_status', label: 'Show Status' },
  { value: 'portal_url', label: 'Artist Portal Link' },
  { value: 'notes', label: 'Production Notes' },
  { value: 'custom', label: 'Static / Custom Value' }
]

export default function UniversalSyncModal({ isOpen, onClose, selectedShowIds }: UniversalSyncModalProps) {
  const supabase = createClientComponentClient()
  const [isSyncing, setIsSyncing] = useState(false)
  const [isGoogleConnected, setIsGoogleConnected] = useState(true)
  
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
    const loadPrefs = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        if (profile?.global_export_mapping) setMappings(profile.global_export_mapping)
        if (profile?.last_spreadsheet_name) setSpreadsheetName(profile.last_spreadsheet_name)
        if (profile?.last_sheet_name) setSheetName(profile.last_sheet_name)
        
        const { data: integration } = await supabase
          .from('user_integrations')
          .select('id')
          .eq('user_id', user.id)
          .eq('provider', 'google')
          .maybeSingle()
        
        setIsGoogleConnected(!!integration)
      }
    }
    if (isOpen) loadPrefs()
  }, [isOpen, supabase])

  const addColumn = () => {
    const newId = Math.random().toString(36).substring(2, 9)
    const usedFields = mappings.map(m => m.source)
    const nextField = SOURCE_FIELDS.find(f => !usedFields.includes(f.value)) || { value: 'custom', label: 'New Column' }
    setMappings([...mappings, { id: newId, source: nextField.value, override: '' }])
  }

  const removeColumn = (id: string) => {
    setMappings(mappings.filter(m => m.id !== id))
  }

  const updateMapping = (id: string, updates: Partial<ExportMapping>) => {
    setMappings(mappings.map(m => m.id === id ? { ...m, ...updates } : m))
  }

  const resolveMappedValue = (show: any, source: string): string => {
    if (!show) return ''
    
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
      case 'city':
        return String(show.city || show.venue_city || '')
      case 'show_status':
        return String(show.status || show.show_status || '')
      case 'portal_url':
        return String(show.portal_url || '')
      default:
        return String(show[source] || '')
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
      } else {
        const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', user?.id).single()
        if (profile?.organization_id) {
          query = query.eq('organization_id', profile.organization_id)
        }
        query = query.order('show_date', { ascending: true })
      }
      
      const { data: shows, error: fetchErr } = await query
      if (fetchErr) throw fetchErr
      if (!shows || shows.length === 0) throw new Error('No shows found.')

      const sanitizedMappings = mappings.filter((m) => m.source && m.source !== 'custom')
      const headersArray = sanitizedMappings.map((m) => {
        return (m.override && m.override.trim()) ? m.override.trim() : (SOURCE_FIELDS.find(f => f.value === m.source)?.label || m.source)
      })
      
      let spreadsheet_values: any[][] = []
      let dataRows: any[][] = []
      let mappedData: any[] = []

      dataRows = (shows || []).map((show: any) => {
        return sanitizedMappings.map(m => resolveMappedValue(show, m.source))
      })

      if (exportMode === 'transposed') {
        spreadsheet_values = sanitizedMappings.map((m, i) => {
          const row = [headersArray[i]]
          shows.forEach((show: any) => row.push(resolveMappedValue(show, m.source)))
          return row
        })
        mappedData = spreadsheet_values
      } else {
        spreadsheet_values = [headersArray, ...dataRows]
        mappedData = (shows || []).map((show: any, idx: number) => {
          const row: Record<string, any> = {}
          sanitizedMappings.forEach((m, i) => {
            row[headersArray[i]] = dataRows[idx][i]
          })
          return row
        })
      }

      const { data: integration } = await supabase
        .from('user_integrations')
        .select('access_token')
        .eq('user_id', user?.id)
        .eq('provider', 'google')
        .maybeSingle()

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
          mapping: sanitizedMappings,
          header_row: headersArray,
          data_rows: dataRows,
          spreadsheet_values: spreadsheet_values,
          mapped_data: mappedData,
          show_count: shows.length,
          timestamp: new Date().toISOString()
        })
      })

      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.details || result.error || 'Sync failed')

      toast.success('Flexible Export Successful!', {
        description: `Exported ${shows.length} shows (First: ${shows[0]?.artist_name || 'Unknown'}).`
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

        <div className="px-10 overflow-y-auto flex-1 space-y-8 pb-10 scrollbar-hide">
          {!isGoogleConnected ? (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-8 flex flex-col items-center text-center space-y-4">
               <div className="h-14 w-14 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
                  <AlertCircle size={32} />
               </div>
               <h4 className="text-xl font-black uppercase text-white">Google Not Connected</h4>
               <p className="text-zinc-400 text-sm max-w-xs">Please connect your Google account in Settings to enable direct spreadsheet sync.</p>
               <Button onClick={() => window.location.href = '/settings'} className="bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest px-8 rounded-xl h-12">
                  Connect Now
               </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-primary ml-2">Spreadsheet</Label>
                  <Input value={spreadsheetName} onChange={(e) => setSpreadsheetName(e.target.value)} className="bg-white/[0.03] border-white/10 h-14 rounded-2xl px-6 text-sm font-bold text-white" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-primary ml-2">Sheet</Label>
                  <Input value={sheetName} onChange={(e) => setSheetName(e.target.value)} className="bg-white/[0.03] border-white/10 h-14 rounded-2xl px-6 text-sm font-bold text-white" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-primary ml-2">Range</Label>
                  <Select value={exportType} onValueChange={(v: any) => setExportType(v)}>
                    <SelectTrigger className="bg-white/[0.03] border-white/10 h-14 rounded-2xl px-6 text-white font-bold"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-[#050607] border-white/10 text-white"><SelectItem value="all">All Shows</SelectItem><SelectItem value="selected">Selected</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-primary ml-2">Layout</Label>
                  <Select value={exportMode} onValueChange={(v: any) => setExportMode(v)}>
                    <SelectTrigger className="bg-white/[0.03] border-white/10 h-14 rounded-2xl px-6 text-white font-bold"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-[#050607] border-white/10 text-white"><SelectItem value="standard">List</SelectItem><SelectItem value="transposed">Transposed</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <h3 className="text-lg font-black uppercase italic text-white tracking-tighter">Field Mapping</h3>
                  <Button variant="outline" size="sm" onClick={addColumn} className="h-9 px-4 border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase rounded-xl gap-2"><Plus size={14} /> Add Column</Button>
                </div>

                <Reorder.Group axis="y" values={mappings} onReorder={setMappings} className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {mappings.map((m) => (
                      <Reorder.Item key={m.id} value={m} className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl group">
                        <GripVertical size={20} className="text-zinc-700 cursor-grab" />
                        <div className="flex-1 grid grid-cols-2 gap-4">
                          <Select value={m.source} onValueChange={(val) => updateMapping(m.id, { source: val })}>
                            <SelectTrigger className="bg-black/60 border-white/20 h-12 rounded-xl text-white font-bold"><SelectValue /></SelectTrigger>
                            <SelectContent className="bg-[#0F1118] border-white/10 text-white">
                              {SOURCE_FIELDS.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <Input value={m.override} onChange={(e) => updateMapping(m.id, { override: e.target.value })} placeholder="Custom Title" className="bg-black/60 border-white/20 h-12 rounded-xl text-white font-bold" />
                        </div>
                        <button onClick={() => removeColumn(m.id)} className="text-zinc-700 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                      </Reorder.Item>
                    ))}
                  </AnimatePresence>
                </Reorder.Group>
              </div>
            </>
          )}
        </div>

        <div className="p-10 pt-6 border-t border-white/5 bg-black/40 shrink-0 flex items-center justify-between">
           <Button variant="ghost" onClick={onClose} className="text-zinc-500 font-bold uppercase tracking-widest text-xs hover:text-white">Cancel</Button>
           <Button onClick={handleSync} disabled={isSyncing || !isGoogleConnected} className="bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-widest px-12 rounded-2xl h-14 shadow-[0_0_30px_rgba(20,184,166,0.3)]">
              {isSyncing ? 'Synchronizing...' : 'Start Production Sync'} <ChevronRight className="ml-2" size={18} />
           </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
