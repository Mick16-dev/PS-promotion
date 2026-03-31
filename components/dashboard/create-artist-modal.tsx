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
import { Mic, Mail, Music, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

interface CreateArtistModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateArtistModal({ isOpen, onClose }: CreateArtistModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    genre: '',
    email: '',
    artistEmail: '',
    reliability: '75'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const { error } = await (supabase as any).from('artist').insert([
        {
          name: formData.name,
          genre: formData.genre,
          email: formData.email,
          direct_email: formData.artistEmail,
          reliability: parseInt(formData.reliability)
        }
      ])

      if (error) throw error

      toast.success('Artist Added', {
        description: `${formData.name} has been added to your roster.`
      })
      
      // Reset form and close
      setFormData({ name: '', genre: '', email: '', artistEmail: '', reliability: '75' })
      onClose()
    } catch (err) {
      console.error(err)
      toast.error('Failed to add artist. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-ebony-900/95 backdrop-blur-2xl border-white/10 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight text-white uppercase italic">Add New Artist</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Register a new artist to your roster. This profile will be used for show scheduling and production management.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid gap-4">
            {/* Artist Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-pro-data uppercase tracking-widest text-muted-foreground font-bold">Artist/Band Name</Label>
              <div className="relative">
                <Mic className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <Input 
                  id="name" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Artist name" 
                  className="pl-10 bg-muted/30 border-white/5 h-11 focus-visible:ring-primary/50 text-white font-bold"
                  required
                />
              </div>
            </div>

            {/* Genre */}
            <div className="space-y-2">
              <Label htmlFor="genre" className="text-xs font-pro-data uppercase tracking-widest text-muted-foreground font-bold">Genre</Label>
              <div className="relative">
                <Music className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <Input 
                  id="genre" 
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  placeholder="Genre" 
                  className="pl-10 bg-muted/30 border-white/5 h-11 focus-visible:ring-primary/50 text-white font-bold"
                />
              </div>
            </div>

            {/* Email Contact */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-pro-data uppercase tracking-widest text-muted-foreground font-bold">Management Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <Input 
                  id="email" 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="manager@domain.com" 
                  className="pl-10 bg-muted/30 border-white/5 h-11 focus-visible:ring-primary/50 text-white font-bold"
                  required
                />
              </div>
            </div>

            {/* Direct Artist Email */}
            <div className="space-y-2">
              <Label htmlFor="artistEmail" className="text-xs font-pro-data uppercase tracking-widest text-muted-foreground font-bold">Direct Artist Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <Input 
                  id="artistEmail" 
                  type="email"
                  value={formData.artistEmail}
                  onChange={(e) => setFormData({ ...formData, artistEmail: e.target.value })}
                  placeholder="artist@domain.com"
                  className="pl-10 bg-muted/30 border-white/5 h-11 focus-visible:ring-primary/50 text-white font-bold"
                />
              </div>
            </div>

            {/* Reliability Score */}
            <div className="space-y-2">
              <Label htmlFor="reliability" className="text-xs font-pro-data uppercase tracking-widest text-muted-foreground font-bold">Initial Reliability Score (0-100)</Label>
              <div className="relative">
                <Input 
                  id="reliability" 
                  type="number"
                  min="0"
                  max="100"
                  value={formData.reliability}
                  onChange={(e) => setFormData({ ...formData, reliability: e.target.value })}
                  className="bg-muted/30 border-white/5 h-11 focus-visible:ring-primary/50 font-pro-data text-white font-bold"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-white/5">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onClose}
              className="hover:bg-white/5 text-muted-foreground"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 px-8 font-bold"
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
              {isSubmitting ? 'Adding...' : 'Add Artist'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
