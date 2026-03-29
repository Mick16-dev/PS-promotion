import React from 'react'
import { 
  Music, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from 'lucide-react'

const stats = [
  { name: 'Total Shows', value: '24', icon: Music, color: 'text-primary' },
  { name: 'Pending Materials', value: '12', icon: Clock, color: 'text-yellow-500' },
  { name: 'Submitted Materials', value: '45', icon: CheckCircle2, color: 'text-green-500' },
  { name: 'Overdue Materials', value: '3', icon: AlertCircle, color: 'text-red-500' },
]

export default function DashboardHome() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Summary</h1>
        <p className="text-muted-foreground mt-2">Welcome back. Manage your upcoming shows and materials with precision.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="glass-card p-6 rounded-xl flex flex-col justify-between group hover:border-primary/20 transition-all duration-300">
            <div className="flex items-center justify-between">
              <stat.icon className={`h-6 w-6 ${stat.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
              <span className="text-xs font-mono tracking-widest text-muted-foreground uppercase">Live</span>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground truncate">{stat.name}</p>
              <p className="text-3xl font-pro-data mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder for Recent Shows Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <h3 className="text-lg font-semibold tracking-tight">Recent Shows</h3>
          <button className="text-xs font-semibold text-primary/80 hover:text-primary transition-colors">View All Shows</button>
        </div>
        <div className="p-8 flex flex-col items-center justify-center text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center">
            <Music size={24} className="text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium">No recent shows found</p>
            <p className="text-xs text-muted-foreground mt-1">Start by creating a new show for your artist network.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
