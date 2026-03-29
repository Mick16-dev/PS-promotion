'use client'

import React, { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Music, 
  MapPin, 
  Clock,
  ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// Mock Events for Calendar
const events = [
  {
    id: '1',
    artist: 'Luna Shadows',
    venue: 'The Electric Ballroom',
    date: new Date(2024, 4, 15), // May 15
    time: '20:00',
    type: 'Headline'
  },
  {
    id: '2',
    artist: 'Echo Pulse',
    venue: 'O2 Academy Brixton',
    date: new Date(2024, 4, 18), // May 18
    time: '21:30',
    type: 'Festival'
  },
  {
    id: '3',
    artist: 'Neon Dreams',
    venue: 'Printworks London',
    date: new Date(2024, 5, 2), // June 2
    time: '23:00',
    type: 'Club Night'
  }
]

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  // Filter events for selected date? Or just show upcoming in a list
  const upcomingEvents = events.sort((a, b) => a.date.getTime() - b.date.getTime())

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Production Calendar</h1>
          <p className="text-muted-foreground mt-1">Schedules and deadlines for all active show productions.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white gap-2 h-11 px-6 shadow-lg shadow-primary/20 transition-all active:scale-95 leading-none">
          <Plus size={18} />
          <span>Schedule Entry</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Calendar Column */}
        <div className="lg:col-span-8">
          <div className="glass-card rounded-2xl p-8 border-white/5 shadow-2xl bg-muted/10 backdrop-blur-xl">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="w-full flex justify-center scale-110 origin-top"
              classNames={{
                root: "w-full",
                months: "w-full",
                month: "w-full space-y-8",
                caption: "flex justify-between items-center mb-8 px-2",
                caption_label: "text-xl font-bold tracking-tight text-foreground",
                nav: "flex items-center gap-1",
                head_row: "flex w-full mt-4",
                head_cell: "flex-1 text-muted-foreground font-pro-data text-xs uppercase tracking-widest text-center",
                row: "flex w-full mt-4",
                cell: "flex-1 text-center text-sm p-0 relative focus-within:z-20",
                day: "h-14 w-full p-0 font-medium aria-selected:opacity-100 rounded-xl hover:bg-primary/10 transition-colors flex items-center justify-center",
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground shadow-lg shadow-primary/30",
                day_today: "bg-muted/50 text-foreground border border-white/10",
                day_outside: "text-muted-foreground/30 opacity-50",
                day_disabled: "text-muted-foreground/30 opacity-50",
                day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
              }}
            />
          </div>
        </div>

        {/* Upcoming List Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold tracking-tight">Upcoming Dates</h3>
            <Badge variant="outline" className="font-pro-data bg-primary/10 text-primary border-primary/20">
              3 EVENTS
            </Badge>
          </div>

          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="group glass-card p-5 rounded-xl border-white/5 hover:border-primary/30 transition-all duration-300 hover:bg-white/[0.02]">
                <div className="flex items-start justify-between mb-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <Music size={18} />
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink size={14} />
                  </Button>
                </div>
                
                <h4 className="font-bold text-lg leading-tight">{event.artist}</h4>
                <div className="text-xs font-pro-data text-primary/80 uppercase tracking-widest mt-1">
                  {event.type}
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin size={14} className="text-primary/60" />
                    <span>{event.venue}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-pro-data">
                    <Clock size={14} className="text-primary/60" />
                    <span>{event.time} • {event.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Empty State / Add Action */}
            <button className="w-full p-4 rounded-xl border border-dashed border-white/10 hover:border-primary/40 hover:bg-primary/5 transition-all flex items-center justify-center gap-2 group">
              <Plus size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-sm font-medium text-muted-foreground group-hover:text-white transition-colors">Add to Schedule</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
