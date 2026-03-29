'use client'

import React, { useState } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
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
import { Checkbox } from '@/components/ui/checkbox'
import { CalendarIcon, MapPin, Music, User, Send } from 'lucide-react'
import { toast } from 'sonner'

interface CreateShowModalProps {
  isOpen: boolean
  onClose: () => void
}

const defaultDocs = [
  { id: 'epk', label: 'EPK' },
  { id: 'bio', label: 'Artist Bio' },
  { id: 'photos', label: 'Press Photos' },
  { id: 'rider', label: 'Technical Rider' },
  { id: 'contract', label: 'Signed Contract' }
]

export function CreateShowModal({ isOpen, onClose }: CreateShowModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Track selected documents and their deadlines
  const [selectedDocs, setSelectedDocs] = useState<Record<string, boolean>>({
    epk: true, bio: true, photos: true, rider: true, contract: true
  })
  const [docDates, setDocDates] = useState<Record<string, string>>({})

  const handleDocToggle = (id: string, checked: boolean) => {
    setSelectedDocs(prev => ({ ...prev, [id]: checked }))
  }

  const handleDateChange = (id: string, date: string) => {
    setDocDates(prev => ({ ...prev, [id]: date }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Validation
    const hasAtLeastOneDoc = Object.values(selectedDocs).some(val => val === true)
    if (!hasAtLeastOneDoc) {
      toast.error('Validation Error', { description: 'You must require at least one document.' })
      return
    }

    setIsSubmitting(true)
    
    try {
      // Simulate API call to create show / trigger n8n
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success('Show created.', {
        description: `Portal link sent to artist's email. They'll receive an email with everything they need to submit.`
      })
      
      onClose()
      
      // Reset form state for next open (optional but good practice)
      setSelectedDocs({ epk: true, bio: true, photos: true, rider: true, contract: true })
    } catch (error) {
      toast.error('Failed to create show. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-ebony-900/95 backdrop-blur-3xl border-white/10 shadow-2xl p-0 overflow-y-auto max-h-[90vh] rounded-[2rem]">
        {/* Luminous Header Gradient */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
        
        <div className="p-8 pb-6 relative z-10 border-b border-white/5">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black uppercase italic tracking-tighter">Create New Show</DialogTitle>
            <DialogDescription className="text-muted-foreground/80 font-medium mt-2">
              Enter the show details and select the documents you need the artist to provide.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-8 relative z-10 bg-black/20">
          <div className="space-y-6">
            {/* Context Fields */}
            <div className="space-y-3">
              <Label htmlFor="artist" className="text-[10px] font-pro-data uppercase tracking-[0.2em] text-muted-foreground font-bold">Artist</Label>
              <Select defaultValue="luna">
                <SelectTrigger className="bg-white/5 border-white/10 h-14 focus:ring-primary/50 text-foreground w-full rounded-2xl px-5 text-lg font-bold">
                  <div className="flex items-center gap-3">
                    <User size={18} className="text-primary" />
                    <SelectValue placeholder="Select an artist" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-ebony-900 border-white/10 rounded-2xl">
                  <SelectItem value="luna" className="py-3 font-bold">Luna Shadows</SelectItem>
                  <SelectItem value="echo" className="py-3 font-bold">Echo Pulse</SelectItem>
                  <SelectItem value="neon" className="py-3 font-bold">Neon Dreams</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="venue" className="text-[10px] font-pro-data uppercase tracking-[0.2em] text-muted-foreground font-bold">Venue & Location</Label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                  <Input 
                    id="venue" 
                    name="venue"
                    required
                    placeholder="e.g. O2 Academy" 
                    className="pl-12 bg-white/5 border-white/10 h-14 focus-visible:ring-primary/50 rounded-2xl font-bold text-lg transition-colors group-hover:border-white/20 placeholder:font-normal placeholder:text-muted-foreground/30"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="date" className="text-[10px] font-pro-data uppercase tracking-[0.2em] text-muted-foreground font-bold">Show Date</Label>
                <div className="relative group">
                  <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                  <Input 
                    id="date" 
                    name="date"
                    type="date" 
                    required
                    className="pl-12 bg-white/5 border-white/10 h-14 focus-visible:ring-primary/50 text-foreground [color-scheme:dark] rounded-2xl font-bold text-lg tracking-widest transition-colors group-hover:border-white/20"
                  />
                </div>
              </div>
            </div>

            {/* Documents Checklist */}
            <div className="pt-6 border-t border-white/5">
                <div className="mb-4 flex items-center justify-between">
                    <Label className="text-sm font-black uppercase tracking-widest text-white italic">Documents Required</Label>
                    <span className="text-[10px] font-pro-data uppercase tracking-widest text-muted-foreground/60">* At least one required</span>
                </div>
                
                <div className="space-y-3 bg-muted/10 p-5 rounded-3xl border border-white/5">
                    {defaultDocs.map((doc) => (
                        <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl hover:bg-white/[0.02] transition-colors">
                            <div className="flex items-center space-x-3">
                                <Checkbox 
                                  id={`doc-${doc.id}`} 
                                  checked={selectedDocs[doc.id] || false}
                                  onCheckedChange={(checked) => handleDocToggle(doc.id, checked as boolean)}
                                  className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground h-5 w-5 rounded-md"
                                />
                                <label 
                                  htmlFor={`doc-${doc.id}`}
                                  className="text-sm font-bold text-white leading-none cursor-pointer"
                                >
                                  {doc.label}
                                </label>
                            </div>
                            {selectedDocs[doc.id] && (
                                <div className="ml-8 sm:ml-0 flex items-center gap-2">
                                    <span className="text-[10px] font-pro-data uppercase tracking-widest text-muted-foreground">Due:</span>
                                    <Input 
                                      type="date" 
                                      className="h-9 w-[140px] bg-white/5 border-white/10 rounded-lg text-xs [color-scheme:dark] px-3 focus-visible:ring-primary/50"
                                      value={docDates[doc.id] || ''}
                                      onChange={(e) => handleDateChange(doc.id, e.target.value)}
                                      required
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

          </div>

          <DialogFooter className="pt-8 flex flex-row items-center justify-end gap-3 sm:gap-3 sm:justify-end">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onClose}
              className="hover:bg-white/5 h-12 px-6 rounded-xl font-pro-data uppercase tracking-widest text-[10px] sm:w-auto w-full"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/30 h-12 px-8 rounded-xl font-pro-data uppercase tracking-widest text-[11px] gap-2 transition-all active:scale-95 sm:w-auto w-full"
            >
              {isSubmitting ? <Send size={16} className="animate-spin" /> : <Send size={16} />}
              {isSubmitting ? 'Creating Show...' : 'Create Show & Send Artist Portal'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
