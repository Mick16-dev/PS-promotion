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
import { Mic, User, Mail, Music } from 'lucide-react'

interface CreateArtistModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateArtistModal({ isOpen, onClose }: CreateArtistModalProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would call an API (Supabase)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-ebony-900/95 backdrop-blur-2xl border-white/10 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight">Add New Artist</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Register a new artist to your roster. This profile will be used for show scheduling and production management.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid gap-4">
            {/* Artist Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-pro-data uppercase tracking-widest text-muted-foreground">Artist/Band Name</Label>
              <div className="relative">
                <Mic className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <Input 
                  id="name" 
                  placeholder="e.g. Luna Shadows" 
                  className="pl-10 bg-muted/30 border-white/5 h-11 focus-visible:ring-primary/50"
                  required
                />
              </div>
            </div>

            {/* Genre */}
            <div className="space-y-2">
              <Label htmlFor="genre" className="text-xs font-pro-data uppercase tracking-widest text-muted-foreground">Genre</Label>
              <div className="relative">
                <Music className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <Input 
                  id="genre" 
                  placeholder="e.g. Electronic Pop" 
                  className="pl-10 bg-muted/30 border-white/5 h-11 focus-visible:ring-primary/50"
                />
              </div>
            </div>

            {/* Email Contact */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-pro-data uppercase tracking-widest text-muted-foreground">Management Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <Input 
                  id="email" 
                  type="email"
                  placeholder="manager@artist.com" 
                  className="pl-10 bg-muted/30 border-white/5 h-11 focus-visible:ring-primary/50"
                  required
                />
              </div>
            </div>

            {/* Direct Artist Email */}
            <div className="space-y-2">
              <Label htmlFor="artistEmail" className="text-xs font-pro-data uppercase tracking-widest text-muted-foreground">Direct Artist Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <Input 
                  id="artistEmail" 
                  type="email"
                  placeholder="artist@example.com" 
                  className="pl-10 bg-muted/30 border-white/5 h-11 focus-visible:ring-primary/50"
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
              Add Artist
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
