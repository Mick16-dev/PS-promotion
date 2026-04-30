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
import { Reorder, AnimatePresence } from 'framer-motion'

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

export function UniversalSyncModal({ isOpen, onClose, selectedShowIds }: UniversalSyncModalProps) {
  const [isSyncing, setIsSyncing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleConnected, setIsGoogleConnected] = useState(true)
  
  const [spreadsheetName, setSpreadsheetName] = useState('Master Production Roster')
  const [sheetName, setSheetName] = useState('Active Shows')
  const [exportType, setExportType] = useState<'selected' | 'all'>('all')
  const [globalMapping, setGlobalMapping] = useState<ExportMapping[]>([
    { id: '1', field: 'artist_name', header: 'Artist Name' },
    { id: '2', field: 'show_date', header: 'Show Date' },
    { id: '3', field: 'venue_name', header: 'Venue' },
    { id: '4', field: 'deal_guarantee', header: 'Guarantee' },
  ])

  useEffect(() => {
    const loadPrefs = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        if (profile?.global_export_mapping) setGlobalMapping(profile.global_export_mapping)
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
  }, [isOpen])

  const addColumn = () => {
    const newId = Math.random().toString(36).substring(2, 9)
    const usedFields = globalMapping.map(m => m.field)
    const nextField = SOURCE_FIELDS.find(f => !usedFields.includes(f.value)) || { value: 'custom', label: 'New Column' }
    setGlobalMapping([...globalMapping, { id: newId, field: nextField.value, header: nextField.label }])
  }

  const removeColumn = (id: string) => {
    setGlobalMapping(globalMapping.filter(m => m.id !== id))
  }

  const updateMapping = (id: string, updates: Partial<ExportMapping>) => {
    setGlobalMapping(globalMapping.map(m => m.id === id ? { ...m, ...updates } : m))
  }

  const handleSync = async () => {
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

      // Save global mapping to profile so it remembers the user's choices
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

      const response = await fetch('/api/n8n/universal-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user?.id,
          access_token: integration?.access_token || null,
          mode: 'universal_bulk_export',
          spreadsheet_name: spreadsheetName,
          sheet_name: sheetName,
          mapping: globalMapping, // Pass mapping with 'field' and 'header'
          shows: shows, // Pass raw shows for legacy n8n mapping
          timestamp: new Date().toISOString()
        })
      })

      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.details || result.error || 'Sync failed')

      toast.success('Universal Sync Successful!', {
        description: `Exported ${shows.length} shows to your master sheet.`
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
      <DialogContent className="sm:max-w-[550px] bg-[#0b0c0d] border-white/10 p-0 overflow-hidden rounded-[2.5rem] shadow-2xl">
        <div className="p-8 pb-6 border-b border-white/5">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-3 text-white">
              <Table className="text-primary" size={24} />
              Universal Export
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-2 font-medium">
              Export your roster into your master production spreadsheet.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-8 space-y-6">
          {!isGoogleConnected ? (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 space-y-4">
               <div className="flex items-center gap-3 text-amber-500">
                  <AlertCircle size={20} />
                  <h4 className="font-bold uppercase tracking-tight text-sm">Google Offline</h4>
               </div>
               <p className="text-xs text-muted-foreground leading-relaxed">
                 Please connect your Google account in Settings to enable this feature.
               </p>
               <Button 
                 variant="outline" 
                 onClick={() => { onClose(); window.location.href = '/settings' }}
                 className="w-full border-amber-500/20 bg-amber-500/5 text-amber-500 font-bold text-[10px] uppercase tracking-widest h-10 rounded-xl"
               >
                 Go to Integrations <ChevronRight size={14} />
               </Button>
            </div>
          ) : (
            <>
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

              <div className="space-y-3">
                 <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-2">Export Range</Label>
                 <Select value={exportType} onValueChange={(v: any) => setExportType(v)}>
                    <SelectTrigger className="bg-white/[0.03] border-white/10 h-12 rounded-xl px-4 text-white font-bold"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-[#0b0c0d] border-white/10 text-white">
                      <SelectItem value="all">All Shows (Full Roster)</SelectItem>
                      <SelectItem value="selected">Selected Shows Only</SelectItem>
                    </SelectContent>
                 </Select>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between border-b border-white/5 pb-4 px-2">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Customize Columns</h3>
                  <Button variant="outline" size="sm" onClick={addColumn} className="h-8 px-3 border-primary/20 bg-primary/5 text-primary text-[9px] font-black uppercase rounded-lg gap-2"><Plus size={12} /> Add Column</Button>
                </div>

                <Reorder.Group axis="y" values={globalMapping} onReorder={setGlobalMapping} className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {globalMapping.map((m) => (
                      <Reorder.Item key={m.id} value={m} className="flex items-center gap-4 p-3 bg-white/[0.02] border border-white/5 rounded-2xl group">
                        <GripVertical size={16} className="text-zinc-600 cursor-grab" />
                        <div className="flex-1 grid grid-cols-2 gap-4">
                          <Select value={m.field} onValueChange={(val) => {
                            const sf = SOURCE_FIELDS.find(f => f.value === val)
                            updateMapping(m.id, { field: val, header: sf ? sf.label : m.header })
                          }}>
                            <SelectTrigger className="bg-black/60 border-white/10 h-10 rounded-xl text-white font-bold text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent className="bg-[#0b0c0d] border-white/10 text-white">
                              {SOURCE_FIELDS.map(f => <SelectItem key={f.value} value={f.value} className="text-xs">{f.label}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <Input value={m.header} onChange={(e) => updateMapping(m.id, { header: e.target.value })} placeholder="Custom Title" className="bg-black/60 border-white/10 h-10 rounded-xl text-white font-bold text-xs" />
                        </div>
                        <button onClick={() => removeColumn(m.id)} className="text-zinc-600 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                      </Reorder.Item>
                    ))}
                  </AnimatePresence>
                </Reorder.Group>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="p-8 bg-black/20 border-t border-white/5">
          <Button variant="ghost" onClick={onClose} className="h-12 px-6 rounded-xl font-bold uppercase tracking-widest text-[10px] text-zinc-500" disabled={isSyncing}>
            Cancel
          </Button>
          <Button 
            onClick={handleSync}
            disabled={!isGoogleConnected || isSyncing || isLoading}
            className="bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/30 h-14 px-10 rounded-2xl font-black uppercase tracking-widest text-xs gap-3"
          >
            {isSyncing ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
            {isSyncing ? 'Exporting...' : 'Export to Master Sheet'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
