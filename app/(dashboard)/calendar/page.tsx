'use client'

import React, { useState } from 'react'
import { Calendar, CalendarDayButton } from '@/components/ui/calendar'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { 
  Music, 
  MapPin, 
  Clock,
  ExternalLink,
  ChevronRight,
  FileText,
  Send,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

// Mock Events for Calendar
const upcomingShows = [
  {
    id: '1',
    artist: 'Luna Shadows',
    venue: 'O2 Academy',
    date: new Date(2026, 9, 15), // Oct 15
    time: '20:00',
    type: 'Headline',
    docsDelivered: 5,
    docsTotal: 5
  },
  {
    id: '2',
    artist: 'Echo Pulse',
    venue: 'Printworks',
    date: new Date(2026, 9, 18), // Oct 18
    time: '21:30',
    type: 'Festival Slot',
    docsDelivered: 1,
    docsTotal: 5
  },
  {
    id: '3',
    artist: 'Daisy Chapman',
    venue: 'Lagerhaus Bremen',
    date: new Date(), // Today
    time: '20:00',
    type: 'Headline',
    docsDelivered: 3,
    docsTotal: 5
  }
]

// Mock Deadlines
const upcomingDeadlines = [
  {
    id: 'd1',
    artist: 'Daisy Chapman',
    venue: 'Lagerhaus Bremen',
    document: 'Technical Rider',
    date: new Date() // Today
  },
  {
    id: 'd2',
    artist: 'Echo Pulse',
    venue: 'Printworks',
    document: 'Contract',
    date: new Date(2026, 9, 16) // Oct 16
  }
]

export default function CalendarPage() {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  // Combine events for unified display sorting
  const sortedShows = upcomingShows.sort((a, b) => a.date.getTime() - b.date.getTime())

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    if (date) {
      const dayShows = upcomingShows.filter(e => e.date.toDateString() === date.toDateString())
      const dayDeadlines = upcomingDeadlines.filter(e => e.date.toDateString() === date.toDateString())
      
      if (dayShows.length > 0) {
        toast.info(`Found ${dayShows.length} show(s) on ${date.toLocaleDateString()}.`)
      } else if (dayDeadlines.length > 0) {
        toast.error(`Found ${dayDeadlines.length} document deadline(s) on ${date.toLocaleDateString()}.`)
      }
    }
  }

  // Custom Day Rendering for Indicator Dots and Popups
  const CustomDayButton = (props: any) => {
      const { day } = props
      const date = day.date
      const isShow = upcomingShows.find(s => s.date.toDateString() === date.toDateString())
      const isDeadline = upcomingDeadlines.find(d => d.date.toDateString() === date.toDateString())
      
      const content = (
          <div className="relative w-full h-full flex items-center justify-center font-bold">
              <span className={`z-10 relative ${isShow || isDeadline ? 'text-white' : ''}`}>{date.getDate()}</span>
              {/* Show Indicator */}
              {isShow && (
                  <div className="absolute inset-x-0 bottom-2 flex justify-center z-10">
                      <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                  </div>
              )}
              {/* Deadline Indicator */}
              {isDeadline && !isShow && (
                  <div className="absolute inset-x-0 bottom-2 flex justify-center z-10">
                      <div className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                  </div>
              )}
          </div>
      )

      if (isShow) {
          return (
              <Popover>
                  <PopoverTrigger asChild>
                      <CalendarDayButton {...props} className={`${props.className || ''} focus:ring-2 focus:ring-primary/50`}>
                          {content}
                      </CalendarDayButton>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 bg-ebony-900 border-white/10 shadow-2xl p-6 rounded-3xl" align="start">
                      <h4 className="font-black text-2xl uppercase italic tracking-tighter text-white">{isShow.artist}</h4>
                      <p className="font-medium text-muted-foreground mt-2">{isShow.venue}, {isShow.time}</p>
                      
                      <div className="mt-6 flex items-center justify-between font-bold text-sm bg-muted/20 border border-white/5 p-4 rounded-2xl">
                          <span className="text-muted-foreground/60 uppercase tracking-widest font-pro-data text-[10px]">Documents</span>
                          <span className={isShow.docsDelivered === isShow.docsTotal ? "text-emerald-400" : "text-amber-500"}>
                              {isShow.docsDelivered}/{isShow.docsTotal} delivered
                          </span>
                      </div>
                      
                      <Button 
                          className="w-full mt-6 bg-primary text-white hover:bg-primary/90 h-12 rounded-xl text-xs uppercase font-pro-data tracking-widest font-bold gap-3"
                          onClick={() => router.push(`/shows/${isShow.id}`)}
                      >
                          View Show <ChevronRight size={14} />
                      </Button>
                  </PopoverContent>
              </Popover>
          )
      } else if (isDeadline) {
          return (
              <Popover>
                  <PopoverTrigger asChild>
                      <CalendarDayButton {...props} className={`${props.className || ''} focus:ring-2 focus:ring-red-500/50`}>
                          {content}
                      </CalendarDayButton>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 bg-red-500/10 border-red-500/20 shadow-2xl p-6 rounded-3xl" align="start">
                      <div className="flex items-center gap-3 text-red-500 font-bold">
                          <AlertCircle size={18} />
                          <h4 className="uppercase italic tracking-tighter text-lg">{isDeadline.document} due today</h4>
                      </div>
                      <p className="font-medium text-white/80 mt-3">{isDeadline.artist} — {isDeadline.venue}</p>
                      
                      <Button 
                          className="w-full mt-6 bg-red-500 text-white hover:bg-red-600 h-12 rounded-xl text-xs uppercase font-pro-data tracking-widest font-bold gap-3"
                          onClick={() => toast.success(`Reminder sent to ${isDeadline.artist}.`)}
                      >
                          <Send size={14} /> Send Reminder
                      </Button>
                  </PopoverContent>
              </Popover>
          )
      }

      return <CalendarDayButton {...props}>{content}</CalendarDayButton>
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic text-white">Tour Schedule</h1>
          <p className="text-muted-foreground mt-2 font-medium">Manage your shows, deadlines, and active bookings.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 border-t border-white/5 pt-10">
        {/* Calendar Column */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          <div className="flex items-center gap-6 px-2 text-xs font-pro-data uppercase tracking-widest font-bold border-b border-white/5 pb-4">
              <span className="flex items-center gap-2 text-indigo-400"><div className="h-2 w-2 rounded-full bg-indigo-500" /> Show Dates</span>
              <span className="flex items-center gap-2 text-red-500"><div className="h-2 w-2 rounded-full bg-red-500" /> Document Deadlines</span>
          </div>

          <div className="glass-card rounded-[3rem] p-12 border-white/5 shadow-2xl bg-muted/5 flex flex-col items-center min-h-[600px] justify-center relative overflow-hidden">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              components={{
                  DayButton: CustomDayButton
              }}
              className="w-full max-w-xl scale-125 origin-center z-10"
              classNames={{
                root: "w-full -mt-10",
                months: "w-full",
                month: "w-full space-y-10",
                caption: "flex justify-center items-center mb-16",
                caption_label: "text-3xl font-black uppercase tracking-tighter italic text-white",
                nav: "absolute right-0 top-0 flex items-center gap-4",
                head_row: "flex w-full mt-6",
                head_cell: "flex-1 text-muted-foreground/40 font-pro-data text-[12px] uppercase tracking-[0.2em] text-center font-black pb-6",
                row: "flex w-full mt-4",
                cell: "flex-1 text-center text-sm p-0 m-1 relative focus-within:z-20 h-16 w-16",
                day: "h-full w-full p-0 font-bold aria-selected:opacity-100 rounded-3xl hover:bg-white/5 transition-all outline-none",
                day_selected: "bg-primary/20 text-primary border border-primary/30 shadow-[0_0_20px_rgba(var(--color-primary),0.2)]",
                day_today: "border-2 border-white/10",
                day_outside: "text-muted-foreground/10 opacity-30",
                day_disabled: "text-muted-foreground/10 opacity-30",
                day_hidden: "invisible",
              }}
            />
          </div>
        </div>

        {/* Upcoming List Column */}
        <div className="lg:col-span-4 space-y-6 flex flex-col">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-black tracking-tighter uppercase text-white italic">Upcoming Shows</h3>
            <Badge variant="outline" className="font-pro-data bg-primary/10 text-primary border-primary/20 tracking-widest uppercase text-[10px]">
              {sortedShows.length} Shows
            </Badge>
          </div>

          <div className="space-y-6 flex-1 pr-2">
            {sortedShows.map((show) => (
              <div 
                key={show.id} 
                className="group glass-card p-6 rounded-3xl border-white/5 hover:border-indigo-500/30 transition-all duration-500 hover:bg-indigo-500/[0.02] relative overflow-hidden cursor-pointer shadow-lg"
                onClick={() => router.push(`/shows/${show.id}`)}
              >
                <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity translate-x-4 group-hover:translate-x-0">
                    <Music size={80} className="text-indigo-400" />
                </div>
                <div className="flex items-start justify-between mb-2 relative z-10">
                  <div className="font-pro-data uppercase tracking-[0.2em] text-[10px] text-indigo-400 font-bold flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" /> Show
                  </div>
                  <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground/40 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                    <ExternalLink size={18} />
                  </Button>
                </div>
                
                <h4 className="font-black text-2xl leading-none uppercase group-hover:text-white transition-colors tracking-tight text-white/80">{show.artist}</h4>
                
                <div className="mt-8 space-y-4 relative z-10 border-t border-white/5 pt-6">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
                    <MapPin size={16} className="text-muted-foreground/40" />
                    <span>{show.venue}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm font-pro-data font-bold">
                    <Clock size={16} className="text-muted-foreground/40" />
                    <span className="text-white">{show.time}</span>
                    <span className="text-white/20">—</span>
                    <span className="text-muted-foreground uppercase tracking-widest text-[10px] font-black">
                        {show.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Empty State / Add Action */}
            <div className="w-full p-10 rounded-[2rem] border-2 border-dashed border-white/5 flex flex-col items-center justify-center gap-6 group text-center min-h-[200px]">
              <div className="h-16 w-16 rounded-3xl bg-muted/20 border border-white/10 flex items-center justify-center">
                <Music size={24} className="text-muted-foreground/30" />
              </div>
              <span className="text-sm font-medium text-muted-foreground/60 max-w-[200px] leading-relaxed">
                  All shows are added automatically when created.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
