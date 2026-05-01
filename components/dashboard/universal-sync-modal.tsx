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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  Table, 
  Plus, 
  Trash2, 
  GripVertical, 
  AlertCircle, 
  ChevronRight,
  ArrowRight,
  Loader2
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { toast } from "sonner"
import { Reorder, AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface UniversalSyncModalProps {
  isOpen: boolean
  onClose: () => void
  selectedShowIds?: string[]
}

interface ExportMapping {
  id: string
  field: string // Changed back to 'field' for legacy compatibility
  header: string // Changed back to 'header' for legacy compatibility
}

const AVAILABLE_COLUMNS = [
  { id: 'c1', field: 'artist_name', header: 'Artist' },
  { id: 'c2', field: 'show_date', header: 'Date' },
  { id: 'c3', field: 'venue_name', header: 'Venue' },
  { id: 'c4', field: 'city', header: 'City' },
  { id: 'c5', field: 'deal_guarantee', header: 'Fee' },
  { id: 'c6', field: 'notes', header: 'Notes' },
  { id: 'c7', field: 'ticket_price', header: 'Ticket Price' },
  { id: 'c8', field: 'capacity', header: 'Capacity' },
  { id: 'c9', field: 'deal_type', header: 'Deal Type' },
  { id: 'c10', field: 'show_status', header: 'Status' },
  { id: 'c11', field: 'portal_url', header: 'Portal Link' },
]

export function UniversalSyncModal({ isOpen, onClose, selectedShowIds: initialSelectedIds }: UniversalSyncModalProps) {
  const [isSyncing, setIsSyncing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleConnected, setIsGoogleConnected] = useState(true)
  
  const [spreadsheetName, setSpreadsheetName] = useState('Master Production Roster')
  const [sheetName, setSheetName] = useState('Active Shows')
  const [initialSpreadsheetName, setInitialSpreadsheetName] = useState('Master Production Roster')
  const [initialSheetName, setInitialSheetName] = useState('Active Shows')
  const [exportType, setExportType] = useState<'selected' | 'all'>('selected')
  const [selectedShowIds, setSelectedShowIds] = useState<string[]>(initialSelectedIds || [])
  const [availableShows, setAvailableShows] = useState<any[]>([])

  const [globalMapping, setGlobalMapping] = useState<ExportMapping[]>([
    { id: 'c1', field: 'artist_name', header: 'Artist' },
    { id: 'c2', field: 'show_date', header: 'Date' },
    { id: 'c3', field: 'venue_name', header: 'Venue' },
    { id: 'c4', field: 'city', header: 'City' },
    { id: 'c5', field: 'deal_guarantee', header: 'Fee' },
    { id: 'c6', field: 'notes', header: 'Notes' },
    { id: 'c7', field: 'ticket_price', header: 'Ticket Price' },
    { id: 'c8', field: 'capacity', header: 'Capacity' },
    { id: 'c9', field: 'deal_type', header: 'Deal Type' },
  ])

  useEffect(() => {
    if (initialSelectedIds) setSelectedShowIds(initialSelectedIds)
  }, [initialSelectedIds])

  useEffect(() => {
    const loadPrefs = async () => {
      try {
        setIsLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Load Profile Prefs
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        if (profile) {
          if (profile.global_export_mapping) setGlobalMapping(profile.global_export_mapping)
          if (profile.last_spreadsheet_name) {
            setSpreadsheetName(profile.last_spreadsheet_name)
            setInitialSpreadsheetName(profile.last_spreadsheet_name)
          }
          if (profile.last_sheet_name) {
            setSheetName(profile.last_sheet_name)
            setInitialSheetName(profile.last_sheet_name)
          }
        }
        
        // Load All Shows for Selection
        const { data: shows } = await supabase.from('shows').select('id, artist_name, show_date, venue_name').order('show_date', { ascending: true })
        if (shows) setAvailableShows(shows)

        // Check Integration
        const { data: integration } = await supabase
          .from('user_integrations')
          .select('id')
          .eq('user_id', user.id)
          .eq('provider', 'google')
          .maybeSingle()
        
        setIsGoogleConnected(!!integration)
      } catch (err) {
        console.error("Error loading prefs:", err)
      } finally {
        setIsLoading(false)
      }
    }
    if (isOpen) loadPrefs()
  }, [isOpen])

  const addColumn = () => {
    const newId = Math.random().toString(36).substring(2, 9)
    setGlobalMapping(prev => [...prev, { id: newId, field: 'artist_name', header: 'New Column' }])
  }

  const removeColumn = (id: string) => {
    setGlobalMapping(prev => prev.filter(m => m.id !== id))
  }

  const updateMapping = (id: string, updates: Partial<ExportMapping>) => {
    setGlobalMapping(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m))
  }

  const toggleShowSelection = (id: string) => {
    setSelectedShowIds(prev => 
      prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
    )
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

      // Save global mapping to profile
      await supabase.from('profiles').update({ 
        global_export_mapping: globalMapping,
        last_spreadsheet_name: spreadsheetName,
        last_sheet_name: sheetName
      }).eq('id', user?.id)

      const { data: integration } = await supabase
        .from('user_integrations')
        .select('access_token')
        .eq('user_id', user?.id)
        .eq('provider', 'google')
        .maybeSingle()

      // PAD SHOWS: ensure all keys exist and use raw m.field so n8n maps correctly
      const paddedShows = shows.map(show => {
        const paddedShow: any = {}
        globalMapping.forEach(m => {
          let val = show[m.field] || ''
          if (m.field === 'show_date' && val) val = new Date(val).toLocaleDateString()
          paddedShow[m.field] = val 
        })
        return paddedShow
      })

      // DETECT CUSTOMIZATION: if they typed new headers or changed the sheet name
      const hasCustomHeaders = globalMapping.some(m => {
        const defaultCol = AVAILABLE_COLUMNS.find(c => c.field === m.field)
        return defaultCol && defaultCol.header !== m.header
      })
      const isNewTarget = spreadsheetName !== initialSpreadsheetName || sheetName !== initialSheetName

      // PREPEND TITLES: force n8n to print custom headers in Row 1
      if (hasCustomHeaders || isNewTarget) {
        const headerShow: any = {}
        globalMapping.forEach(m => {
          headerShow[m.field] = m.header // Map title to raw field key
        })
        paddedShows.unshift(headerShow)
      }

      const response = await fetch('/api/n8n/universal-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user?.id,
          access_token: integration?.access_token || null,
          spreadsheet_name: spreadsheetName,
          sheet_name: sheetName,
          mode: 'universal_bulk_export',
          mapping: globalMapping,
          shows: paddedShows,
          timestamp: new Date().toISOString()
        })
      })

      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.details || result.error || 'Sync failed')

      toast.success('Universal Sync Successful!', {
        description: `Exported ${shows.length} rows with ${globalMapping.length} custom columns.`
      })
      onClose()
    } catch (err: any) {
      toast.error('Sync Failed', { description: err.message })
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] bg-[#0b0c0d] border-white/10 p-0 overflow-hidden rounded-[2.5rem] shadow-2xl max-h-[90vh] flex flex-col">
        <div className="p-8 pb-6 border-b border-white/5 shrink-0">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-3 text-white">
              <Table className="text-primary" size={24} />
              Freedom Export Console
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-2 font-medium">
              Customize your headers and select specific engagements to export.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
          {!isGoogleConnected ? (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 space-y-4">
               <div className="flex items-center gap-3 text-amber-500">
                  <AlertCircle size={20} />
                  <h4 className="font-bold uppercase tracking-tight text-sm">Google Offline</h4>
               </div>
               <p className="text-xs text-muted-foreground leading-relaxed">Please connect your Google account in Settings.</p>
               <Button variant="outline" onClick={() => { onClose(); window.location.href = '/settings' }} className="w-full border-amber-500/20 bg-amber-500/5 text-amber-500 font-bold text-[10px] uppercase tracking-widest h-10 rounded-xl">Go to Integrations</Button>
            </div>
          ) : (
            <>
              {/* SECTION: TARGET */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                   <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Destination</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-2">Spreadsheet Name</Label>
                    <Input value={spreadsheetName} onChange={(e) => setSpreadsheetName(e.target.value)} className="bg-white/[0.03] border-white/10 h-12 rounded-xl px-4 text-sm font-bold text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-2">Sheet Name</Label>
                    <Input value={sheetName} onChange={(e) => setSheetName(e.target.value)} className="bg-white/[0.03] border-white/10 h-12 rounded-xl px-4 text-sm font-bold text-white" />
                  </div>
                </div>
              </div>

              {/* SECTION: SHOW SELECTION */}
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                   <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Engagement Selection</h3>
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
                          onClick={() => toggleShowSelection(show.id)}
                          className={cn(
                            "flex items-center justify-between px-6 py-3 cursor-pointer transition-colors",
                            selectedShowIds.includes(show.id) ? "bg-primary/5" : "hover:bg-white/[0.01]"
                          )}
                        >
                          <div className="flex flex-col">
                            <span className={cn("text-xs font-bold transition-colors", selectedShowIds.includes(show.id) ? "text-primary" : "text-white")}>{show.artist_name}</span>
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

              {/* SECTION: COLUMN MAPPING */}
              <div className="space-y-4">
                 <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                       <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Column Freedom Editor</h3>
                    </div>
                    <Button onClick={addColumn} variant="ghost" className="h-7 px-3 text-[9px] font-black uppercase text-primary bg-primary/10 hover:bg-primary/20 rounded-lg">
                       <Plus size={12} className="mr-1" /> Add Column
                    </Button>
                 </div>

                 <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {globalMapping.map((m, idx) => (
                        <motion.div 
                          layout
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          key={m.id} 
                          className="flex items-center gap-3 bg-white/[0.03] border border-white/5 p-3 rounded-2xl group hover:border-primary/30 transition-all"
                        >
                          <div className="w-6 h-6 flex items-center justify-center text-zinc-700 font-black text-[10px] italic">0{idx + 1}</div>
                          <div className="flex-1 grid grid-cols-2 gap-3">
                             <Select value={m.field} onValueChange={(v) => updateMapping(m.id, { field: v })}>
                                <SelectTrigger className="bg-transparent border-none h-9 text-xs font-bold text-white focus:ring-0">
                                   <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#0b0c0d] border-white/10 text-white">
                                   {AVAILABLE_COLUMNS.map(col => (
                                     <SelectItem key={col.field} value={col.field}>{col.header} (Raw)</SelectItem>
                                   ))}
                                </SelectContent>
                             </Select>
                             <Input 
                               value={m.header} 
                               onChange={(e) => updateMapping(m.id, { header: e.target.value })}
                               placeholder="Header Name"
                               className="bg-white/5 border-none h-9 rounded-lg px-3 text-xs font-black uppercase italic text-primary placeholder:text-zinc-700"
                             />
                          </div>
                          <button onClick={() => removeColumn(m.id)} className="w-9 h-9 flex items-center justify-center text-zinc-700 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                             <Trash2 size={14} />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
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
            {isSyncing ? 'Processing Sheets...' : 'Export with Freedom'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
