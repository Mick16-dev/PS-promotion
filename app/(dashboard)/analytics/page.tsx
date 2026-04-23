'use client'

import React, { useEffect, useState } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight,
  PieChart as PieChartIcon,
  Calendar,
  Filter
} from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const COLORS = ['#4f46e5', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899']

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    profitMargin: 0
  })
  const [chartData, setChartData] = useState<any[]>([])
  const [venueData, setVenueData] = useState<any[]>([])

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true)
        const { data: shows, error } = await supabase
          .from('shows')
          .select('*')
          .order('show_date', { ascending: true })

        if (error) throw error

        if (shows) {
          let rev = 0
          let exp = 0
          const monthlyMap: Record<string, any> = {}
          const venueMap: Record<string, number> = {}

          shows.forEach(show => {
            // Basic Revenue Calc: Guarantees + estimated ticket revenue (simulated here)
            const showRev = Number(show.deal_guarantee || 0)
            const showExp = Array.isArray(show.expenses) 
              ? show.expenses.reduce((acc: number, cur: any) => acc + Number(cur.amount || 0), 0)
              : 0
            
            rev += showRev
            exp += showExp

            // Monthly breakdown
            const month = new Date(show.show_date).toLocaleString('default', { month: 'short' })
            if (!monthlyMap[month]) {
              monthlyMap[month] = { name: month, revenue: 0, expenses: 0, profit: 0 }
            }
            monthlyMap[month].revenue += showRev
            monthlyMap[month].expenses += showExp
            monthlyMap[month].profit += (showRev - showExp)

            // Venue distribution
            const venue = show.venue_name || show.venue || 'Unknown'
            venueMap[venue] = (venueMap[venue] || 0) + showRev
          })

          setStats({
            totalRevenue: rev,
            totalExpenses: exp,
            netProfit: rev - exp,
            profitMargin: rev > 0 ? ((rev - exp) / rev) * 100 : 0
          })

          setChartData(Object.values(monthlyMap))
          setVenueData(Object.entries(venueMap).map(([name, value]) => ({ name, value })).slice(0, 5))
        }
      } catch (err) {
        console.error('Analytics Error:', err)
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full" />
      </div>
    )
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic text-white flex items-center gap-4">
            <BarChart3 className="text-primary" size={36} />
            Intelligence <span className="text-muted-foreground font-medium">/ Reporting</span>
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">Full financial audit and performance tracking across your roster.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-white/5 bg-white/5 h-11 px-6 font-bold uppercase tracking-widest text-[10px] gap-2">
            <Calendar size={14} /> Last 6 Months
          </Button>
          <Button variant="outline" className="rounded-xl border-white/5 bg-white/5 h-11 px-6 font-bold uppercase tracking-widest text-[10px] gap-2">
            <Filter size={14} /> Filter
          </Button>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: stats.totalRevenue, icon: DollarSign, trend: '+12.5%', isUp: true, color: 'text-white' },
          { label: 'Total Expenses', value: stats.totalExpenses, icon: CreditCard, trend: '-4.2%', isUp: false, color: 'text-rose-500' },
          { label: 'Net Profit', value: stats.netProfit, icon: TrendingUp, trend: '+8.1%', isUp: true, color: 'text-primary' },
          { label: 'Profit Margin', value: stats.profitMargin.toFixed(1) + '%', icon: PieChartIcon, trend: '+2.4%', isUp: true, color: 'text-emerald-500' },
        ].map((stat, i) => (
          <div key={i} className="glass-card rounded-[2rem] p-8 border-white/5 bg-muted/5 backdrop-blur-xl relative group overflow-hidden">
             <div className="flex justify-between items-start mb-6">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-primary group-hover:text-white transition-all">
                   <stat.icon size={20} />
                </div>
                <Badge className={stat.isUp ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}>
                   {stat.isUp ? <ArrowUpRight size={10} className="mr-1" /> : <ArrowDownRight size={10} className="mr-1" />}
                   {stat.trend}
                </Badge>
             </div>
             <p className="text-[10px] font-pro-data uppercase tracking-[0.2em] text-muted-foreground font-black mb-1">{stat.label}</p>
             <h3 className={`text-3xl font-black italic tracking-tighter ${stat.color}`}>
                {typeof stat.value === 'number' ? `$${stat.value.toLocaleString()}` : stat.value}
             </h3>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue vs Expenses Area Chart */}
        <div className="lg:col-span-2 glass-card rounded-[2.5rem] p-10 border-white/5 bg-muted/5 backdrop-blur-3xl">
           <div className="flex items-center justify-between mb-10">
              <h3 className="text-xl font-black uppercase tracking-tight italic">Performance Velocity</h3>
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Revenue</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Expenses</span>
                 </div>
              </div>
           </div>
           <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#666', fontSize: 10, fontWeight: 900 }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#666', fontSize: 10, fontWeight: 900 }}
                    tickFormatter={(v) => `$${v/1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                    itemStyle={{ fontWeight: 800, fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                  <Area type="monotone" dataKey="expenses" stroke="#f43f5e" strokeWidth={4} fillOpacity={0} />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Venue Distribution Pie Chart */}
        <div className="glass-card rounded-[2.5rem] p-10 border-white/5 bg-muted/5 backdrop-blur-3xl">
           <h3 className="text-xl font-black uppercase tracking-tight italic mb-10">Revenue by Venue</h3>
           <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={venueData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {venueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
           </div>
           <div className="mt-6 space-y-3">
              {venueData.map((v, i) => (
                <div key={i} className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-[10px] font-bold text-white/60 truncate max-w-[120px]">{v.name}</span>
                   </div>
                   <span className="text-[10px] font-black text-white">${v.value.toLocaleString()}</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Performance List */}
      <div className="glass-card rounded-[2.5rem] border-white/5 overflow-hidden bg-muted/5 backdrop-blur-xl">
         <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-xl font-black uppercase tracking-tight italic">Top Performing Markets</h3>
            <Button variant="link" className="text-primary font-bold text-xs uppercase tracking-widest">Download Full Report</Button>
         </div>
         <div className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {venueData.map((v, i) => (
              <div key={i} className="flex items-center gap-6 p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all">
                 <div className="text-2xl font-black text-white/10 italic">0{i+1}</div>
                 <div className="flex-1 overflow-hidden">
                    <h4 className="font-bold text-lg text-white truncate">{v.name}</h4>
                    <p className="text-xs text-muted-foreground font-pro-data uppercase tracking-widest mt-1">High Volume Market</p>
                 </div>
                 <div className="text-right">
                    <p className="text-lg font-black text-primary italic">${(v.value/1000).toFixed(1)}k</p>
                    <p className="text-[10px] font-bold text-emerald-500 uppercase">Profit Center</p>
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  )
}
