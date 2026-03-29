'use client'

import React from 'react'
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
import { CalendarIcon, MapPin, Music, User } from 'lucide-react'

interface CreateShowModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateShowModal({ isOpen, onClose }: CreateShowModalProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would call an API
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-ebony-900/95 backdrop-blur-2xl border-white/10 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight">Create New Show</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Enter the details for the upcoming performance. This will initiate the production workflow.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid gap-4">
            {/* Artist Selection */}
            <div className="space-y-2">
              <Label htmlFor="artist" className="text-xs font-pro-data uppercase tracking-widest text-muted-foreground">Artist</Label>
              <Select>
                <SelectTrigger className="bg-muted/30 border-white/5 h-11 focus:ring-primary/50 text-foreground w-full">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-primary/60" />
                    <SelectValue placeholder="Select an artist" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-ebony-900 border-white/10">
                  <SelectItem value="luna">Luna Shadows</SelectItem>
                  <SelectItem value="echo">Echo Pulse</SelectItem>
                  <SelectItem value="neon">Neon Dreams</SelectItem>
                  <SelectItem value="midnight">The Midnight</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Venue & Event Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="venue" className="text-xs font-pro-data uppercase tracking-widest text-muted-foreground">Venue</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -track-y-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                  <Input 
                    id="venue" 
                    placeholder="e.g. O2 Academy" 
                    className="pl-10 bg-muted/30 border-white/5 h-11 focus-visible:ring-primary/50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="event" className="text-xs font-pro-data uppercase tracking-widest text-muted-foreground">Show Type</Label>
                <Select defaultValue="headline">
                  <SelectTrigger className="bg-muted/30 border-white/5 h-11 focus:ring-primary/50 text-foreground w-full">
                    <div className="flex items-center gap-2">
                      <Music size={16} className="text-primary/60" />
                      <SelectValue placeholder="Type" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-ebony-900 border-white/10">
                    <SelectItem value="headline">Headline</SelectItem>
                    <SelectItem value="festival">Festival</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="club">Club Night</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date" className="text-xs font-pro-data uppercase tracking-widest text-muted-foreground">Date</Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <Input 
                  id="date" 
                  type="date" 
                  className="pl-10 bg-muted/30 border-white/5 h-11 focus-visible:ring-primary/50 text-foreground [color-scheme:dark]"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-white/5">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onClose}
              className="hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 px-8"
            >
              Create Show
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
