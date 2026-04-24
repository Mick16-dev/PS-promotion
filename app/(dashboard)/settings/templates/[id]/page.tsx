'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Save, 
  Table, 
  ChevronRight, 
  Info,
  Layers,
  Database,
  ArrowRightLeft,
  CheckCircle2,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

const internalFields = [
  { id: 'artist_name', label: 'Artist Name', category: 'General' },
  { id: 'show_date', label: 'Show Date', category: 'General' },
  { id: 'venue_name', label: 'Venue Name', category: 'General' },
  { id: 'city', label: 'City', category: 'General' },
  
  { id: 'load_in_time', label: 'Load In', category: 'Logistics' },
  { id: 'soundcheck_time', label: 'Soundcheck', category: 'Logistics' },
  { id: 'doors_time', label: 'Doors', category: 'Logistics' },
  { id: 'show_time', label: 'Show Time', category: 'Logistics' },
  { id: 'show_end_time', label: 'Curfew / End Time', category: 'Logistics' },
  { id: 'changeover_time', label: 'Changeover', category: 'Logistics' },
  
  { id: 'musicians_count', label: 'Musicians Count', category: 'Production' },
  { id: 'host_name', label: 'Presenter / Host', category: 'Production' },
  { id: 'artist_epk_url', label: 'Artist Website', category: 'Production' },
  { id: 'stageplot_url', label: 'Stageplot Link', category: 'Production' },
  
  { id: 'deal_type', label: 'Deal Type', category: 'Financial' },
  { id: 'deal_guarantee', label: 'Guarantee ($)', category: 'Financial' },
  { id: 'deal_percentage', label: 'Artist Split (%)', category: 'Financial' },
  
  { id: 'catering_notes', label: 'Hospitality Notes', category: 'Notes' },
  { id: 'technical_notes', label: 'Technical Notes', category: 'Notes' },
  { id: 'artist_comment', label: 'Internal Comments', category: 'Notes' },
]

export default function TemplateEditorPage() {
  const { id } = useParams()
  const router = useRouter()
  const [template, setTemplate] = useState<any>(null)
  const [mapping, setMapping] = useState<Record<string, string>>({})
  const [googleSheetId, setGoogleSheetId] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    async function loadTemplate() {
      try {
        const { data, error } = await supabase
          .from('export_templates')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error
        
        setTemplate(data)
        setMapping(data.mapping || {})
        setGoogleSheetId(data.google_sheet_id || '')
      } catch (err: any) {
        toast.error('Error loading template')
        router.push('/settings')
      } finally {
        setIsLoading(false)
      }
    }
    loadTemplate()
  }, [id, router])

  const handleMappingChange = (fieldId: string, value: string) => {
    setMapping(prev => ({ ...prev, [fieldId]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('export_templates')
        .update({
          mapping,
          google_sheet_id: googleSheetId,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error
      toast.success('Mapping saved successfully.')
    } catch (err: any) {
      toast.error('Failed to save mapping: ' + err.message)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    )
  }

  const categories = ['General', 'Logistics', 'Production', 'Financial', 'Notes']

  return (
    <div className="max-w-[1000px] mx-auto pt-10 pb-20 px-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-white/5 pb-10">
        <div className="space-y-4">
           <button 
             onClick={() => router.push('/settings')}
             className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
           >
             <ArrowLeft size={14} /> Back to Settings
           </button>
           <h1 className="text-4xl font-black uppercase tracking-tighter italic text-white flex items-center gap-4">
             <Table size={36} className="text-primary/40" />
             {template?.name}
           </h1>
           <p className="text-muted-foreground font-medium max-w-xl">
             Define how internal show data maps to your external spreadsheet columns.
           </p>
        </div>
        <Button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary hover:bg-primary/90 text-white gap-3 h-14 px-10 shadow-2xl shadow-primary/20 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 leading-none"
        >
          {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {isSaving ? 'Saving...' : 'Save Mapping'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
           {/* Google Sheet ID Input */}
           <div className="glass-card rounded-[2.5rem] p-8 border-white/5 bg-muted/10 relative overflow-hidden group">
              <div className="relative z-10 space-y-4">
                 <div className="flex items-center gap-3">
                    <Database size={18} className="text-primary" />
                    <h3 className="text-lg font-bold text-white uppercase tracking-tight">Google Sheet Destination</h3>
                 </div>
                 <div className="space-y-2">
                    <Label className="text-[10px] font-pro-data uppercase tracking-[0.2em] text-muted-foreground font-black ml-2">Google Sheet ID (from URL)</Label>
                    <Input 
                      placeholder="e.g. 1aBCdEfgH_ijKlMnOpQrStUvWxYz..." 
                      value={googleSheetId}
                      onChange={(e) => setGoogleSheetId(e.target.value)}
                      className="bg-black/40 border-white/10 h-16 rounded-2xl text-sm font-mono placeholder:font-sans"
                    />
                    <p className="text-[10px] text-muted-foreground/60 italic ml-2 mt-2 flex items-center gap-2">
                       <Info size={12} /> Find this in your browser URL: https://docs.google.com/spreadsheets/d/<strong>[ID_HERE]</strong>/edit
                    </p>
                 </div>
              </div>
           </div>

           {/* Field Mapper */}
           <div className="space-y-8">
              {categories.map((category) => (
                 <div key={category} className="space-y-4">
                    <div className="flex items-center gap-4 px-4">
                       <div className="h-[1px] flex-1 bg-white/5" />
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">{category} Data</span>
                       <div className="h-[1px] flex-1 bg-white/5" />
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                       {internalFields.filter(f => f.category === category).map((field) => (
                          <div key={field.id} className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 flex items-center gap-6 group hover:bg-white/[0.04] transition-all">
                             <div className="w-1/3 space-y-1">
                                <span className="text-sm font-bold text-white block">{field.label}</span>
                                <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">{field.id}</span>
                             </div>
                             
                             <div className="flex-1 flex items-center gap-4">
                                <ArrowRightLeft size={14} className="text-zinc-700 group-hover:text-primary transition-colors" />
                                <div className="flex-1">
                                   <Input 
                                     placeholder={`Header name in your spreadsheet...`}
                                     value={mapping[field.id] || ''}
                                     onChange={(e) => handleMappingChange(field.id, e.target.value)}
                                     className="bg-black/40 border-white/10 h-12 rounded-xl text-xs font-bold transition-all focus:border-primary/50"
                                   />
                                </div>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              ))}
           </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="glass-card rounded-[2rem] p-8 border-white/5 bg-muted/10 sticky top-10 space-y-6">
              <h3 className="text-sm font-black uppercase tracking-widest text-white italic flex items-center gap-3">
                 <CheckCircle2 size={16} className="text-primary" /> Mapping Rules
              </h3>
              <ul className="space-y-4">
                 {[
                   "Leave fields empty if you don't want them exported.",
                   "Column headers must match your spreadsheet exactly.",
                   "Multiple templates can point to the same Google Sheet.",
                   "Syncing happens automatically when a show is created or updated."
                 ].map((rule, i) => (
                   <li key={i} className="flex gap-3 text-xs text-muted-foreground font-medium leading-relaxed">
                      <span className="h-1 w-1 rounded-full bg-primary mt-1.5 shrink-0" />
                      {rule}
                   </li>
                 ))}
              </ul>

              <div className="pt-6 border-t border-white/5">
                 <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                    <p className="text-[10px] text-primary font-bold uppercase tracking-widest leading-relaxed">
                       PRO TIP: Use "Date" or "Show Date" as your header if you want to use Excel sorting features.
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
