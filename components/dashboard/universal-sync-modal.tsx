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
  GripVertical
} from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

interface UniversalSyncModalProps {
  isOpen: boolean
  onClose: () => void
  selectedShowIds?: string[]
}

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
  
  // New Customizable State
  const [spreadsheetName, setSpreadsheetName] = useState('Master Production Roster')
  const [sheetName, setSheetName] = useState('Active Shows')
  const [mappings, setMappings] = useState<any[]>([
    { id: '1', source: 'artist_name', header: 'Artist' },
    { id: '2', source: 'show_date', header: 'Date' },
    { id: '3', source: 'venue_name', header: 'Venue' },
    { id: '4', source: 'deal_guarantee', header: 'Fee' },
    { id: '5', source: 'portal_url', header: 'Portal Link' },
  ])

  useEffect(() => {
    if (isOpen) {
      async function loadData() {
        setIsLoading(true)
        try {
          const { data: { user } } = await supabase.auth.getUser()
          if (!user) return

          // Check Google Connection
          const { data: integration } = await supabase
            .from('user_integrations')
            .select('id')
            .eq('user_id', user.id)
            .eq('provider', 'google')
            .maybeSingle()
          
          setIsGoogleConnected(!!integration)

          // Load Saved Mapping & Metadata
          const { data: profile } = await supabase
            .from('profiles')
            .select('global_export_mapping, last_spreadsheet_name')
            .eq('id', user.id)
            .single()
          
          if (profile?.global_export_mapping) {
            setMappings(profile.global_export_mapping)
          }
          if (profile?.last_spreadsheet_name) {
            setSpreadsheetName(profile.last_spreadsheet_name)
          }
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
    setMappings([...mappings, { id: newId, source: 'artist_name', header: 'New Column' }])
  }

  const removeColumn = (id: string) => {
    setMappings(mappings.filter(m => m.id !== id))
  }

  const updateMapping = (id: string, updates: any) => {
    setMappings(mappings.map(m => m.id === id ? { ...m, ...updates } : m))
  }

  const handleSync = async () => {
    if (!spreadsheetName) {
      toast.error('Please name your spreadsheet.')
      return
    }

    setIsSyncing(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      // 1. Fetch shows
      let query = supabase.from('shows').select('*')
      if (selectedShowIds && selectedShowIds.length > 0) {
        query = query.in('id', selectedShowIds)
      }
      const { data: shows, error: fetchErr } = await query
      if (fetchErr) throw fetchErr

      // Save global mapping and name preference
      await supabase.from('profiles').update({ 
        global_export_mapping: mappings,
        last_spreadsheet_name: spreadsheetName
      }).eq('id', user?.id)

      // 2. Refresh Google Token (Crucial for n8n to access the right account/file)
      let access_token: string | null = null
      try {
        const refreshRes = await fetch('/api/auth/google/refresh', { method: 'POST' })
        if (refreshRes.ok) {
          const refreshData = await refreshRes.json()
          access_token = refreshData.access_token ?? null
        }
      } catch (err) {
        console.error('TOKEN_REFRESH_FAILED:', err)
      }

      // 3. Prepare headers from mapping
      const headersArray = mappings.map(m => m.header)

      // 4. Trigger n8n with detailed mapping and custom metadata
      const response = await fetch('/api/n8n/universal-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user?.id,
          access_token: access_token,
          // Send both naming conventions to ensure n8n catches it
          spreadsheet_name: spreadsheetName,
          spreadsheetName: spreadsheetName, 
          sheet_name: sheetName,
          sheetName: sheetName,
          mode: 'universal_custom_export',
          headers: headersArray,
          headerList: headersArray,
          mapping: mappings,
          mappingList: mappings,
          shows: shows,
          timestamp: new Date().toISOString()
        })
      })

      const result = await response.json().catch(() => ({}))
      
      if (!response.ok) {
        throw new Error(result.details || result.error || result.message || 'Sync failed')
      }

      toast.success('Universal Sync Successful!', {
        description: `Exported to "${spreadsheetName}".`
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
      <DialogContent className="sm:max-w-[700px] bg-[#07080F] border-white/10 p-0 overflow-hidden rounded-[2.5rem] shadow-2xl max-h-[90vh] flex flex-col backdrop-blur-xl">
        <div className="p-8 pb-6 border-b border-white/5 shrink-0 bg-white/[0.02]">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black uppercase italic tracking-tighter flex items-center gap-3 text-white">
              <TableIcon className="text-primary" size={28} />
              Flexible Export
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-2 font-medium">
              Configure your spreadsheet layout and field mapping for the production roster.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar bg-[#07080F]">
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
              {/* FILE METADATA */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-primary ml-2">Spreadsheet Name</Label>
                  <Input 
                    value={spreadsheetName}
                    onChange={(e) => setSpreadsheetName(e.target.value)}
                    placeholder="e.g. Master Roster 2026"
                    className="bg-white/5 border-white/10 h-14 rounded-2xl px-6 font-bold text-lg focus:ring-primary/50 text-white"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-primary ml-2">Sheet / Tab Name</Label>
                  <Input 
                    value={sheetName}
                    onChange={(e) => setSheetName(e.target.value)}
                    placeholder="e.g. Main"
                    className="bg-white/5 border-white/10 h-14 rounded-2xl px-6 font-bold text-lg focus:ring-primary/50 text-white"
                  />
                </div>
              </div>

              {/* MAPPING TABLE */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <h4 className="text-sm font-black uppercase tracking-widest text-white italic">Column Mapping</h4>
                  <Button 
                    onClick={addColumn}
                    variant="outline" 
                    className="h-8 px-4 rounded-full border-primary/30 text-primary text-[9px] font-black uppercase hover:bg-primary/10"
                  >
                    <Plus size={12} className="mr-1" /> Add Column
                  </Button>
                </div>

                <div className="space-y-3">
                  {mappings.map((m) => (
                    <div key={m.id} className="group flex items-center gap-3 bg-white/[0.04] hover:bg-white/[0.06] p-4 rounded-2xl border border-white/10 transition-all shadow-lg">
                      <div className="text-zinc-500 group-hover:text-zinc-300 transition-colors">
                        <GripVertical size={18} />
                      </div>
                      
                      <div className="flex-1 grid grid-cols-2 gap-4">
                        <Select 
                          value={m.source} 
                          onValueChange={(val) => updateMapping(m.id, { source: val })}
                        >
                          <SelectTrigger className="bg-black/60 border-white/20 h-11 rounded-xl font-bold text-xs text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#0F1118] border-white/10 text-white">
                            {SOURCE_FIELDS.map(f => (
                              <SelectItem key={f.value} value={f.value} className="font-bold text-xs hover:bg-primary/20">{f.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Input 
                          value={m.header}
                          onChange={(e) => updateMapping(m.id, { header: e.target.value })}
                          placeholder="Header Name"
                          className="bg-black/60 border-white/20 h-11 rounded-xl font-bold text-xs text-white placeholder:text-zinc-600"
                        />
                      </div>

                      <button 
                        onClick={() => removeColumn(m.id)}
                        className="h-10 w-10 flex items-center justify-center text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="p-8 bg-black/60 border-t border-white/5 shrink-0">
          <Button variant="ghost" onClick={onClose} className="h-12 px-8 rounded-xl font-black uppercase tracking-widest text-[10px] text-zinc-500" disabled={isSyncing}>
            Cancel
          </Button>
          <Button 
            onClick={handleSync}
            disabled={!isGoogleConnected || isSyncing || isLoading}
            className="bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/30 h-16 px-12 rounded-[2rem] font-black uppercase tracking-widest text-sm gap-3 active:scale-95 transition-all"
          >
            {isSyncing ? <Loader2 size={20} className="animate-spin" /> : <TableIcon size={20} />}
            {isSyncing ? 'Exporting...' : 'Initiate Universal Sync'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
