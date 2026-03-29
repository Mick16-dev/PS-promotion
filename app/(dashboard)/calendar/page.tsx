'use client'

import React, { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Music, 
  MapPin, 
  Clock,
  ExternalLink,
  Zap
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
    type: 'Headline Performance'
  },
  {
    id: '2',
    artist: 'Echo Pulse',
    venue: 'O2 Academy Brixton',
    date: new Date(2024, 4, 18), // May 18
    time: '21:30',
    type: 'Festival Slot'
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
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  // Filter events for selected date? In this mock, we just show all upcoming
  const upcomingEvents = events.sort((a, b) => a.date.getTime() - b.date.getTime())

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    if (date) {
      const dayEvents = events.filter(e => e.date.toDateString() === date.toDateString())
      if (dayEvents.length > 0) {
        toast.info(`Found ${dayEvents.length} event(s) for ${date.toLocaleDateString()}.`)
      }
    }
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic">Production Calendar</h1>
          <p className="text-muted-foreground mt-2 font-medium">Coordinate logistics, travel, and production deadlines across all territories.</p>
        </div>
        <Button 
            className="bg-primary hover:bg-primary/90 text-white gap-3 h-12 px-8 shadow-xl shadow-primary/20 transition-all active:scale-95 font-pro-data uppercase tracking-widest text-xs"
            onClick={() => toast.success('Initializing new production schedule entry...')}
        >
          <Plus size={18} />
          <span>Schedule Entry</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Calendar Column */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-bold tracking-tight uppercase font-pro-data text-white/80">Territory Schedule</h3>
            <Badge variant="outline" className="text-[10px] font-pro-data text-muted-foreground/40 border-white/5 bg-white/5 uppercase tracking-[0.2em]">Global Sync</Badge>
          </div>
          <div className="glass-card rounded-3xl p-10 border-white/5 shadow-2xl bg-muted/10 flex flex-col items-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              className="w-full max-w-xl scale-110 origin-top"
              classNames={{
                root: "w-full",
                months: "w-full",
                month: "w-full space-y-10",
                caption: "flex justify-between items-center mb-10 px-4",
                caption_label: "text-2xl font-black uppercase tracking-tighter italic text-foreground",
                nav: "flex items-center gap-2",
                head_row: "flex w-full mt-6",
                head_cell: "flex-1 text-muted-foreground font-pro-data text-[10px] uppercase tracking-widest text-center font-bold",
                row: "flex w-full mt-6",
                cell: "flex-1 text-center text-sm p-0 relative focus-within:z-20",
                day: "h-16 w-full p-0 font-bold aria-selected:opacity-100 rounded-2xl hover:bg-primary/20 transition-all flex items-center justify-center border border-transparent hover:border-primary/20",
                day_selected: "bg-primary text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white shadow-xl shadow-primary/40 scale-110 z-10",
                day_today: "bg-muted/40 text-primary border border-primary/20",
                day_outside: "text-muted-foreground/10 opacity-30",
                day_disabled: "text-muted-foreground/10 opacity-30",
                day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
              }}
            />
          </div>
        </div>

        {/* Upcoming List Column */}
        <div className="lg:col-span-4 space-y-6 flex flex-col">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-bold tracking-tight uppercase font-pro-data text-white/80 italic">Upcoming Dates</h3>
            <Badge variant="outline" className="font-pro-data bg-primary/10 text-primary border-primary/20 tracking-widest uppercase text-[10px]">
              {events.length} Active Shows
            </Badge>
          </div>

          <div className="space-y-4 flex-1">
            {upcomingEvents.map((event) => (
              <div 
                key={event.id} 
                className="group glass-card p-6 rounded-3xl border-white/5 hover:border-primary/30 transition-all duration-500 hover:bg-white/[0.03] relative overflow-hidden cursor-pointer"
                onClick={() => router.push(`/shows/${event.id}`)}
              >
                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity translate-x-4 group-hover:translate-x-0">
                    <Zap size={60} />
                </div>
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                    <Music size={22} />
                  </div>
                  <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-white hover:bg-white/10 rounded-xl transition-all">
                    <ExternalLink size={18} />
                  </Button>
                </div>
                
                <h4 className="font-black text-xl leading-tight uppercase group-hover:text-primary transition-colors tracking-tight">{event.artist}</h4>
                <div className="text-[10px] font-pro-data text-muted-foreground uppercase tracking-[0.2em] mt-2 font-bold group-hover:text-white/60 transition-colors">
                  {event.type}
                </div>

                <div className="mt-6 space-y-3 relative z-10">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground font-medium">
                    <MapPin size={16} className="text-primary/60" />
                    <span>{event.venue}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-pro-data font-bold">
                    <Clock size={16} className="text-primary/60" />
                    <span className="text-foreground">{event.time}</span>
                    <span className="h-1 w-1 rounded-full bg-white/10" />
                    <span className="text-muted-foreground uppercase tracking-widest text-[11px] font-bold">
                        {event.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Empty State / Add Action */}
            <Button 
                variant="ghost" 
                className="w-full p-10 rounded-3xl border border-dashed border-white/10 hover:border-primary/40 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-4 group h-auto"
                onClick={() => toast.success('Initializing new production schedule entry...')}
            >
              <div className="h-12 w-12 rounded-full border border-dashed border-white/20 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/10 transition-all">
                <Plus size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <span className="text-xs font-pro-data uppercase tracking-[0.25em] text-muted-foreground group-hover:text-white transition-colors">Add to Production Schedule</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
