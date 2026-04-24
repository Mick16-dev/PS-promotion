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
  ChevronRight,
  ArrowRight
} from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

interface UniversalSyncModalProps {
  isOpen: boolean
  onClose: () => void
  selectedShowIds?: string[]
}

export function UniversalSyncModal({ isOpen, onClose, selectedShowIds }: UniversalSyncModalProps) {
  const [isGoogleConnected, setIsGoogleConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [globalMapping, setGlobalMapping] = useState<any[]>([
    { id: '1', field: 'artist_name', header: 'Artist' },
    { id: '2', field: 'show_date', header: 'Date' },
    { id: '3', field: 'venue_name', header: 'Venue' },
    { id: '4', field: 'city', header: 'City' },
    { id: '5', field: 'deal_guarantee', header: 'Fee' }
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

          // Load Global Mapping from User Profile or similar (fallback to defaults)
          const { data: profile } = await supabase
            .from('profiles')
            .select('global_export_mapping')
            .eq('id', user.id)
            .single()
          
          if (profile?.global_export_mapping) {
            setGlobalMapping(profile.global_export_mapping)
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

  const handleSync = async () => {
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

      // 2. Trigger n8n
      const response = await fetch('/api/n8n/universal-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user?.id,
          mode: 'universal_bulk_export',
          mapping: globalMapping,
          shows: shows,
          timestamp: new Date().toISOString()
        })
      })

      if (!response.ok) throw new Error('Sync failed')

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
      <DialogContent className="sm:max-w-[500px] bg-[#0b0c0d] border-white/10 p-0 overflow-hidden rounded-[2.5rem] shadow-2xl">
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

        <div className="p-8 space-y-8">
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
            <div className="space-y-6">
              <div className="bg-white/5 rounded-3xl p-6 border border-white/5 space-y-4">
                 <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Master Sync Ready</span>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Selected Roster</span>
                       <p className="text-sm font-black italic text-white truncate">
                         {selectedShowIds?.length ? `${selectedShowIds.length} Shows` : 'All Active Shows'}
                       </p>
                    </div>
                    <div className="space-y-1">
                       <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Format</span>
                       <p className="text-sm font-black italic text-white">Universal Layout</p>
                    </div>
                 </div>
              </div>
              
              <div className="space-y-3">
                 <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest ml-2">Columns included</p>
                 <div className="flex flex-wrap gap-2">
                    {globalMapping.slice(0, 4).map(m => (
                      <div key={m.id} className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-[9px] font-black uppercase text-zinc-500 italic">{m.header}</div>
                    ))}
                    <div className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-[9px] font-black uppercase text-zinc-500 italic">+{globalMapping.length - 4} more</div>
                 </div>
              </div>
            </div>
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
            {isSyncing ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
            {isSyncing ? 'Exporting...' : 'Export to Master Sheet'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
