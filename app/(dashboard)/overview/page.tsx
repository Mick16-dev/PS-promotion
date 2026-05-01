'use client'

import React, { useState, useEffect } from 'react'
import useSWR from 'swr'
import { 
  Plus, 
  ArrowUpRight,
  Music,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Clock4,
  ChevronRight,
  Activity,
  FileWarning,
  Database
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { CreateShowModal } from '@/components/dashboard/create-show-modal'
import { 
  BentoPanel, 
  TelemetryLine, 
  StatusPing 
} from '@/components/ui/bento-grid'
import { ErrorBoundary } from '@/components/dashboard/error-boundary'

export default function DashboardHome() {
  const { data, error: fetchError, mutate } = useSWR('dashboard-data', async () => {
    const res = await fetch('/api/dashboard/stats')
    if (!res.ok) throw new Error('Failed to load stats')
    return res.json()
  }, { revalidateOnFocus: true, refreshInterval: 60000 })

  const stats = data?.stats || { totalShows: 0, awaitingDocs: 0, overdueDocs: 0 }
  const overdueItems = data?.overdueItems || []
  const isLoading = !data && !fetchError

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="animate-spin h-6 w-6 border-2 border-primary/20 border-t-primary rounded-full" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Syncing Data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.03] pb-8">
        <div>
           <div className="flex items-center gap-2 mb-3">
              <StatusPing variant="healthy" />
              <span className="text-primary text-[10px] font-black uppercase tracking-[0.2em]">Live Data Sync Active</span>
           </div>
           <h1 className="text-5xl text-title-elegant text-white inline-flex items-center gap-3">
             Production <span className="text-muted-foreground/40">/ Overview</span>
           </h1>
        </div>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="h-12 bg-primary hover:bg-primary/90 text-white font-black uppercase text-xs px-8 rounded-xl shadow-lg shadow-primary/20 gap-2 transition-all active:scale-95"
        >
          <Plus size={16} strokeWidth={3} /> Add Engagement
        </Button>
      </div>

      {/* STATS BENTO GRID */}
      <ErrorBoundary title="Core Metrics">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Active Advancements', value: stats.totalShows, icon: Calendar, color: 'text-white' },
            { label: 'Materials Pipeline', value: stats.awaitingDocs, icon: Clock4, color: 'text-amber-500' },
            { label: 'Priority Overdue', value: stats.overdueDocs, icon: AlertCircle, color: 'text-rose-500' }
          ].map((stat, i) => (
            <div key={i} className="bg-surface-elevated border-tactical rounded-2xl p-8 hover-cockpit-glow group">
               <div className="flex items-center justify-between mb-8">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{stat.label}</span>
                  <stat.icon size={14} className="text-muted-foreground/30 group-hover:text-primary transition-colors" />
               </div>
               <div className="flex items-baseline gap-2">
                  <span className={`text-4xl text-raw-data font-black italic ${stat.color}`}>{stat.value}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">Records</span>
               </div>
            </div>
          ))}
        </div>
      </ErrorBoundary>

      {/* MAIN CONTENT BENTO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
         {/* Priority Feed (2 cols) */}
         <ErrorBoundary title="Priority Advancement Feed">
           <BentoPanel className="lg:col-span-2" title="Priority Advancements" icon={Activity}>
              <div className="divide-y divide-white/[0.02] mt-4">
                 {overdueItems.length > 0 ? (
                   overdueItems.map((item) => (
                     <Link key={item.id} href={`/shows/${item.showId}`}>
                       <div className="group flex items-center justify-between py-4 hover:bg-white/[0.02] transition-all px-4 rounded-xl">
                         <div className="flex items-center gap-6 min-w-0">
                            <div className="h-8 w-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shrink-0">
                               <FileWarning size={14} />
                            </div>
                            <div className="min-w-0">
                               <div className="flex items-center gap-3">
                                  <span className="text-sm font-bold text-white tracking-tight group-hover:text-primary transition-colors">{item.artist}</span>
                                  <span className="text-muted-foreground/20 text-xs font-black">•</span>
                                  <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest truncate">{item.venue}</span>
                               </div>
                               <p className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wide mt-0.5">{item.document}</p>
                            </div>
                         </div>
                         
                         <div className="bg-rose-500/10 px-3 py-1 rounded-md border border-rose-500/20">
                            <span className="text-[8px] font-black text-rose-500 uppercase tracking-widest">Late: {item.deadline}</span>
                         </div>
                       </div>
                     </Link>
                   ))
                 ) : (
                   <div className="py-20 text-center flex flex-col items-center justify-center">
                      <CheckCircle2 size={32} className="mb-4 text-emerald-500 opacity-20" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Zero Unresolved Items</p>
                   </div>
                 )}
              </div>
           </BentoPanel>
         </ErrorBoundary>

         {/* Quick Actions / Integration Status (1 col) */}
         <BentoPanel title="Live Diagnostics" icon={Database}>
            <div className="space-y-4 mt-4">
               <TelemetryLine label="Database Status" value="Healthy" mono={false} />
               <TelemetryLine label="Sync Latency" value="12ms" />
               <TelemetryLine label="Total Storage" value="2.4 GB" />
               
               <div className="pt-6">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-4">Quick Navigation</p>
                  <div className="grid grid-cols-2 gap-3">
                     <Link href="/shows" className="bg-surface-base border border-white/[0.05] p-3 rounded-xl hover:border-primary/50 transition-all text-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white">Full Roster</span>
                     </Link>
                     <Link href="/calendar" className="bg-surface-base border border-white/[0.05] p-3 rounded-xl hover:border-primary/50 transition-all text-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white">Calendar</span>
                     </Link>
                  </div>
               </div>
            </div>
         </BentoPanel>

      </div>

      <CreateShowModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSuccess={fetchDashboardData}
      />
    </div>
  )
}

