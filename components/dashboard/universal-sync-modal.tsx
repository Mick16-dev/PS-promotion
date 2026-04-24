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
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  Table, 
  Zap, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

interface UniversalSyncModalProps {
  isOpen: boolean
  onClose: () => void
  selectedShowIds?: string[] // Optional: if we want to sync specific shows
}

export function UniversalSyncModal({ isOpen, onClose, selectedShowIds }: UniversalSyncModalProps) {
  const [templates, setTemplates] = useState<any[]>([])
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('')
  const [isGoogleConnected, setIsGoogleConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [targetShowName, setTargetShowName] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      async function loadData() {
        setIsLoading(true)
        try {
          const { data: { user } } = await supabase.auth.getUser()
          if (!user) return

          // 0. If single show, get its name
          if (selectedShowIds && selectedShowIds.length === 1) {
            const { data: show } = await supabase
              .from('shows')
              .select('artist_name, venue_name')
              .eq('id', selectedShowIds[0])
              .single()
            
            if (show) {
              setTargetShowName(`${show.artist_name} @ ${show.venue_name}`)
            }
          } else {
            setTargetShowName(null)
          }

          // 1. Load Templates
          const { data: templatesData } = await supabase
            .from('export_templates')
            .select('*')
            .eq('user_id', user.id)
          
          if (templatesData) {
            setTemplates(templatesData)
            if (templatesData.length > 0) setSelectedTemplateId(templatesData[0].id)
          }

          // 2. Check Google Connection
          const { data: integration } = await supabase
            .from('user_integrations')
            .select('id')
            .eq('user_id', user.id)
            .eq('provider', 'google')
            .maybeSingle()
          
          setIsGoogleConnected(!!integration)
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
    if (!selectedTemplateId) return
    
    setIsSyncing(true)
    try {
      const template = templates.find(t => t.id === selectedTemplateId)
      
      // 1. Fetch all shows (or selected ones)
      let query = supabase.from('shows').select('*, venue:venue_id(*)')
      if (selectedShowIds && selectedShowIds.length > 0) {
        query = query.in('id', selectedShowIds)
      }
      
      const { data: shows, error: fetchErr } = await query
      if (fetchErr) throw fetchErr

      // 2. Prepare payload for n8n
      const { data: { user } } = await supabase.auth.getUser()
      
      const payload = {
        user_id: user?.id,
        template_name: template.name,
        google_sheet_id: template.google_sheet_id,
        mapping: template.mapping,
        shows: shows.map(show => ({
          ...show,
          venue_name: show.venue?.name || show.venue_name || 'TBD',
          city: show.venue?.city || show.city || ''
        })),
        timestamp: new Date().toISOString()
      }

      // 3. Trigger n8n Universal Sync Webhook
      const response = await fetch('/api/n8n/universal-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) throw new Error('n8n request failed')

      toast.success('Sync Successful!', {
        description: `Exported ${shows.length} shows to "${template.name}".`
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
      <DialogContent className="sm:max-w-[500px] bg-ebony-900/95 backdrop-blur-3xl border-white/10 p-0 overflow-hidden rounded-[2.5rem] shadow-2xl">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
        
        <div className="p-8 pb-6 relative z-10 border-b border-white/5">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-3">
              <Table className="text-primary" size={24} />
              Universal Sync
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-2 font-medium">
              Synchronize your Advancement Pipeline with external spreadsheets.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-8 space-y-8 relative z-10">
          {!isGoogleConnected ? (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 space-y-4">
               <div className="flex items-center gap-3 text-amber-500">
                  <AlertCircle size={20} />
                  <h4 className="font-bold uppercase tracking-tight text-sm">Google Account Not Connected</h4>
               </div>
               <p className="text-xs text-muted-foreground leading-relaxed">
                 You need to connect your Google account in Settings to enable spreadsheet synchronization.
               </p>
               <Button 
                 variant="outline" 
                 onClick={() => { onClose(); window.location.href = '/settings?tab=integrations' }}
                 className="w-full border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 text-amber-500 font-bold text-[10px] uppercase tracking-widest h-10 rounded-xl"
               >
                 Connect Now <ChevronRight size={14} />
               </Button>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                <div className="flex items-center justify-between px-2">
                  <Label className="text-[10px] font-pro-data uppercase tracking-[0.2em] text-muted-foreground font-black">Choose Export Profile</Label>
                  <button 
                    onClick={() => { onClose(); window.location.href = '/settings?tab=integrations' }}
                    className="text-[9px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
                  >
                    Edit Templates
                  </button>
                </div>
                <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
                  <SelectTrigger className="bg-white/5 border-white/10 h-16 rounded-2xl px-5 text-lg font-bold transition-all focus:ring-primary/50">
                    <SelectValue placeholder="Select a template..." />
                  </SelectTrigger>
                  <SelectContent className="bg-ebony-900 border-white/10 rounded-2xl">
                    {templates.map(t => (
                      <SelectItem key={t.id} value={t.id} className="py-4 font-bold">
                        {t.name}
                      </SelectItem>
                    ))}
                    {templates.length === 0 && !isLoading && (
                      <SelectItem value="none" disabled className="py-4 text-muted-foreground italic">No templates found</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <p className="text-[10px] text-muted-foreground/60 italic ml-2 mt-2">
                  This profile defines the column names and the target Google Sheet.
                </p>
              </div>

              <div className="bg-black/40 rounded-3xl p-6 border border-white/5 space-y-4">
                 <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Sync Details</span>
                    <Badge className="bg-primary/10 text-primary border-none text-[9px] font-black uppercase px-2 py-0">READY</Badge>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Syncing Target</span>
                       <p className="text-sm font-black italic text-white truncate">
                         {targetShowName || (selectedShowIds?.length ? `${selectedShowIds.length} Selected Shows` : 'All Active Shows')}
                       </p>
                    </div>
                    <div className="space-y-1">
                       <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Provider</span>
                       <p className="text-sm font-black italic text-white flex items-center gap-2">Google Sheets <Table size={12} className="text-[#0F9D58]" /></p>
                    </div>
                 </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="p-8 bg-black/20 border-t border-white/5">
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="hover:bg-white/5 h-12 px-6 rounded-xl font-pro-data uppercase tracking-widest text-[10px]"
            disabled={isSyncing}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSync}
            disabled={!isGoogleConnected || !selectedTemplateId || isSyncing || isLoading}
            className="bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/30 h-14 px-10 rounded-2xl font-black uppercase tracking-widest text-xs gap-3 transition-all active:scale-95"
          >
            {isSyncing ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
            {isSyncing ? 'Synchronizing Data...' : 'Execute Universal Sync'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`rounded-full ${className}`}>
      {children}
    </div>
  )
}
