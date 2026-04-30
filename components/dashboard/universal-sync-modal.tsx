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

const AVAILABLE_COLUMNS = [
  { id: '1', field: 'artist_name', header: 'Artist Name' },
  { id: '2', field: 'show_date', header: 'Show Date' },
  { id: '3', field: 'venue_name', header: 'Venue' },
  { id: '4', field: 'city', header: 'City' },
  { id: '5', field: 'deal_guarantee', header: 'Guarantee' },
  { id: '6', field: 'show_status', header: 'Status' },
  { id: '7', field: 'portal_url', header: 'Portal Link' },
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

  const toggleColumn = (col: any) => {
    setGlobalMapping(prev => {
      const exists = prev.find(p => p.field === col.field)
      if (exists) {
        return prev.filter(p => p.field !== col.field)
      } else {
        return [...prev, col]
      }
    })
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

              <div className="space-y-3 pt-2">
                 <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest ml-2">Customize Columns</p>
                 <div className="flex flex-wrap gap-2">
                    {AVAILABLE_COLUMNS.map(col => {
                      const isSelected = globalMapping.some(m => m.field === col.field)
                      return (
                        <button
                          key={col.id}
                          onClick={() => toggleColumn(col)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase italic transition-all ${isSelected ? 'bg-primary/20 border-primary text-primary border shadow-[0_0_10px_theme(colors.primary/30%)]' : 'bg-white/5 border border-white/10 text-zinc-500 hover:text-zinc-300'}`}
                        >
                          {col.header}
                        </button>
                      )
                    })}
                 </div>
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
