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
import { CalendarIcon, MapPin, Music, User, Zap } from 'lucide-react'
import { toast } from 'sonner'

interface CreateShowModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateShowModal({ isOpen, onClose }: CreateShowModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const formData = new FormData(e.currentTarget)
    const venue = formData.get('venue')
    const date = formData.get('date')

    try {
      // Simulate n8n webhook API call for Workflow 1
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success('Production workflow initiated via n8n.', {
        description: `Show scheduled at ${venue || 'selected venue'} on ${date || 'selected date'}. Initial material requests have been dispatched.`
      })
      
      onClose()
    } catch (error) {
      toast.error('Failed to trigger production workflow.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] bg-ebony-900/95 backdrop-blur-3xl border-white/10 shadow-2xl p-0 overflow-hidden rounded-[2rem]">
        {/* Luminous Header Gradient */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary/20 to-transparent pointer-events-none" />
        
        <div className="p-8 pb-6 relative z-10 border-b border-white/5">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black uppercase italic tracking-tighter">Initialize Production</DialogTitle>
            <DialogDescription className="text-muted-foreground/80 font-medium mt-2">
              Configure parameters for the upcoming performance. This will trigger <strong className="text-primary font-pro-data uppercase tracking-widest text-[10px]">n8n Workflow #1</strong> to dispatch initial material requests.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-8 relative z-10 bg-black/20">
          <div className="space-y-6">
            {/* Artist Selection */}
            <div className="space-y-3">
              <Label htmlFor="artist" className="text-[10px] font-pro-data uppercase tracking-[0.2em] text-muted-foreground font-bold">Territory Artist</Label>
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
                  <SelectItem value="midnight" className="py-3 font-bold">The Midnight</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Venue & Event Name */}
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
                <Label htmlFor="event" className="text-[10px] font-pro-data uppercase tracking-[0.2em] text-muted-foreground font-bold">Performance Type</Label>
                <Select defaultValue="headline">
                  <SelectTrigger className="bg-white/5 border-white/10 h-14 focus:ring-primary/50 text-foreground w-full rounded-2xl px-5 font-bold text-lg">
                    <div className="flex items-center gap-3">
                      <Music size={18} className="text-primary" />
                      <SelectValue placeholder="Type" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-ebony-900 border-white/10 rounded-2xl">
                    <SelectItem value="headline" className="py-3 font-bold">Headline</SelectItem>
                    <SelectItem value="festival" className="py-3 font-bold">Festival</SelectItem>
                    <SelectItem value="support" className="py-3 font-bold">Support</SelectItem>
                    <SelectItem value="club" className="py-3 font-bold">Club Night</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date */}
            <div className="space-y-3">
              <Label htmlFor="date" className="text-[10px] font-pro-data uppercase tracking-[0.2em] text-muted-foreground font-bold">Execution Date</Label>
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
              {isSubmitting ? <Zap size={16} className="animate-spin" /> : <Zap size={16} />}
              {isSubmitting ? 'Triggering n8n...' : 'Deploy Workflow'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
