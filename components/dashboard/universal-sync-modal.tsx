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
import { 
  Table, 
  Zap, 
  Loader2, 
  AlertCircle,
  ChevronDown,
  Plus,
  Trash2,
  GripVertical,
  ArrowRight,
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

const FIELD_OPTIONS = [
  { value: 'artist_name', label: 'Artist Name' },
  { value: 'show_date', label: 'Show Date' },
  { value: 'venue_name', label: 'Venue / Location' },
  { value: 'city', label: 'City' },
  { value: 'deal_guarantee', label: 'Guarantee ($)' },
  { value: 'deal_type', label: 'Deal Type' },
  { value: 'capacity', label: 'Capacity' },
  { value: 'ticket_price', label: 'Ticket Price' },
  { value: 'status', label: 'Status' },
  { value: 'notes', label: 'Notes' },
]

export function UniversalSyncModal({ isOpen, onClose, selectedShowIds }: UniversalSyncModalProps) {
  const [isGoogleConnected, setIsGoogleConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  
  const [spreadsheetName, setSpreadsheetName] = useState('Master Production Roster')
  const [sheetName, setSheetName] = useState('Active Shows')
  const [mappings, setMappings] = useState<any[]>([
    { id: '1', field: 'artist_name', header: 'Artist' },
    { id: '2', field: 'show_date', header: 'Date' },
    { id: '3', field: 'venue_name', header: 'Venue' },
    { id: '4', field: 'deal_guarantee', header: 'Fee' },
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
    const newId = Math.random().toString(36).substr(2, 9)
    setMappings([...mappings, { id: newId, field: 'artist_name', header: 'New Column' }])
  }

  const removeColumn = (id: string) => {
    setMappings(mappings.filter(m => m.id !== id))
  }

  const updateMapping = (id: string, updates: any) => {
    setMappings(mappings.map(m => m.id === id ? { ...m, ...updates } : m))
  }

  const handleSync = async () => {
    setIsSyncing(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      let query = supabase.from('shows').select('*')
      if (selectedShowIds && selectedShowIds.length > 0) {
        query = query.in('id', selectedShowIds)
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

      // 3. Prepare explicit rows for n8n to avoid overwriting or mapping issues
      const headerRow = mappings.map(m => m.header)
      const dataRows = shows.map((show: any) => {
        return mappings.map(m => {
          const value = show[m.field]
          // Format dates for better spreadsheet readability
          if (m.field === 'show_date' && value) {
            return new Date(value).toLocaleDateString()
          }
          return value || ''
        })
      })

      const response = await fetch('/api/n8n/universal-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user?.id,
          access_token: integration?.access_token || null,
          mode: 'universal_bulk_export',
          spreadsheet_name: spreadsheetName,
          sheet_name: sheetName,
          mapping: mappings,
          header_row: headerRow,
          data_rows: dataRows,
          shows: shows,
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
      <DialogContent className="sm:max-w-[700px] bg-[#050607] border-white/10 p-0 overflow-hidden rounded-[2.5rem] shadow-2xl">
        <div className="p-10 pb-6">
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

        <div className="px-10 py-6 space-y-10 max-h-[60vh] overflow-y-auto no-scrollbar">
          {/* CONFIGURATION HEADER */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary block">Spreadsheet Name</label>
              <input 
                value={spreadsheetName}
                onChange={(e) => setSpreadsheetName(e.target.value)}
                className="w-full h-14 bg-white/[0.03] border border-white/10 rounded-2xl px-6 text-sm font-bold text-white focus:outline-none focus:border-primary/40 transition-all placeholder:text-zinc-700"
                placeholder="e.g. Master Production Roster"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary block">Sheet / Tab Name</label>
              <input 
                value={sheetName}
                onChange={(e) => setSheetName(e.target.value)}
                className="w-full h-14 bg-white/[0.03] border border-white/10 rounded-2xl px-6 text-sm font-bold text-white focus:outline-none focus:border-primary/40 transition-all placeholder:text-zinc-700"
                placeholder="e.g. Active Shows"
              />
            </div>
          </div>

          {/* MAPPING SECTION */}
          <div className="space-y-6">
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
                    className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-white/10 transition-all"
                  >
                    <div className="cursor-grab active:cursor-grabbing text-zinc-700 group-hover:text-zinc-500 transition-colors">
                      <GripVertical size={20} />
                    </div>

                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <div className="relative">
                        <select 
                          value={m.field}
                          onChange={(e) => updateMapping(m.id, { field: e.target.value })}
                          className="w-full h-12 bg-black/40 border border-white/10 rounded-xl px-4 pr-10 text-xs font-bold text-white appearance-none focus:outline-none focus:border-primary/40"
                        >
                          {FIELD_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                      </div>

                      <input 
                        value={m.header}
                        onChange={(e) => updateMapping(m.id, { header: e.target.value })}
                        placeholder="Column Title"
                        className="w-full h-12 bg-black/40 border border-white/10 rounded-xl px-4 text-xs font-bold text-white focus:outline-none focus:border-primary/40 placeholder:text-zinc-800"
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
        </div>

        <DialogFooter className="p-10 bg-black/40 border-t border-white/5 flex items-center justify-between">
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
              className="bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/20 h-16 px-12 rounded-2xl font-black uppercase tracking-[0.2em] text-xs gap-3 active:scale-95 transition-all"
            >
              {isSyncing ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
              {isSyncing ? 'Synchronizing...' : 'Trigger Universal Sync'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

