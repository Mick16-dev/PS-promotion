'use client'

import React, { useEffect, useState } from 'react'
import { 
  Users, 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  CreditCard, 
  Clock,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Filter
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface UserProfile {
  id: string
  full_name: string
  role: string
  access_status: 'active' | 'blocked'
  subscription_status: 'paid' | 'unpaid' | 'trial'
  updated_at: string
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    async function checkAdminAndLoadUsers() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/login'
        return
      }

      // 1. Verify Super Admin Status (with temporary bypass for specific email)
      const isAdminEmail = user.email === 'michaeltesfaye1621@gmail.com'
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_super_admin')
        .eq('id', user.id)
        .single()

      if (!isAdminEmail && profileError) {
        console.error('Admin Check Error:', profileError)
        toast.error('Database Error', { description: 'Could not verify admin status. Please ensure the is_super_admin column exists.' })
        setTimeout(() => { window.location.href = '/' }, 3000)
        return
      }

      if (!isAdminEmail && !profile?.is_super_admin) {
        toast.error('Access Denied', { description: 'Your account does not have Super Admin privileges.' })
        setTimeout(() => { window.location.href = '/' }, 3000)
        return
      }

      setIsAdmin(true)

      // 2. Load all users (profiles)
      const { data: allUsers, error } = await supabase
        .from('profiles')
        .select('*')
        .order('updated_at', { ascending: false })

      if (error) {
        toast.error('Failed to load users')
      } else {
        setUsers(allUsers || [])
      }
      setLoading(false)
    }

    checkAdminAndLoadUsers()
  }, [])

  const updateUserStatus = async (userId: string, updates: Partial<UserProfile>) => {
    try {
      const res = await fetch('/api/admin/update-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, updates })
      })

      const result = await res.json()
      if (result.error) throw new Error(result.error)

      setUsers(users.map(u => u.id === userId ? { ...u, ...updates } : u))
      toast.success('User updated successfully')
    } catch (error: any) {
      toast.error(`Update failed: ${error.message}`)
    }
  }

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.role?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAdmin) return null

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic text-white flex items-center gap-4">
            <ShieldCheck className="text-primary" size={36} />
            Master Control
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">Manage promoter access, billing states, and platform security.</p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl">
              <span className="text-[10px] font-pro-data uppercase tracking-[0.2em] text-muted-foreground block mb-1">Total Promoters</span>
              <span className="text-2xl font-black text-white">{users.length}</span>
           </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input 
            placeholder="Search by name or role..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl text-lg font-medium focus:ring-primary/50"
          />
        </div>
        <Button variant="outline" className="h-14 px-6 rounded-2xl gap-2 border-white/10 bg-white/5 text-muted-foreground">
          <Filter size={18} />
          Filters
        </Button>
      </div>

      {/* Users Table */}
      <div className="glass-card rounded-[2.5rem] border-white/5 overflow-hidden bg-muted/5 backdrop-blur-xl shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="p-6 text-[10px] font-pro-data uppercase tracking-[0.2em] text-muted-foreground font-black">Promoter</th>
                <th className="p-6 text-[10px] font-pro-data uppercase tracking-[0.2em] text-muted-foreground font-black">Access Status</th>
                <th className="p-6 text-[10px] font-pro-data uppercase tracking-[0.2em] text-muted-foreground font-black">Billing</th>
                <th className="p-6 text-[10px] font-pro-data uppercase tracking-[0.2em] text-muted-foreground font-black">Last Active</th>
                <th className="p-6 text-[10px] font-pro-data uppercase tracking-[0.2em] text-muted-foreground font-black text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="group hover:bg-white/[0.02] transition-all">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary border border-white/10 group-hover:scale-110 transition-transform">
                        <Users size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-white text-lg tracking-tight">{user.full_name || 'Anonymous'}</p>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest opacity-60">{user.role || 'No Role Set'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      user.access_status === 'active' 
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                        : 'bg-red-500/10 text-red-500 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                    }`}>
                      {user.access_status === 'active' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                      {user.access_status}
                    </span>
                  </td>
                  <td className="p-6">
                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      user.subscription_status === 'paid' 
                        ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20' 
                        : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                    }`}>
                      {user.subscription_status === 'paid' ? <CreditCard size={12} /> : <Clock size={12} />}
                      {user.subscription_status}
                    </span>
                  </td>
                  <td className="p-6 text-sm font-pro-data text-muted-foreground">
                    {new Date(user.updated_at).toLocaleDateString()}
                  </td>
                  <td className="p-6 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-white/10 text-muted-foreground">
                          <MoreVertical size={20} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 bg-[#1a1a1a] border-white/10 rounded-2xl p-2 shadow-2xl backdrop-blur-xl">
                        <DropdownMenuItem 
                          className="rounded-xl p-3 font-bold gap-3 focus:bg-white/5 cursor-pointer"
                          onClick={() => updateUserStatus(user.id, { access_status: user.access_status === 'active' ? 'blocked' : 'active' })}
                        >
                          <ShieldAlert size={18} className={user.access_status === 'active' ? 'text-red-500' : 'text-emerald-500'} />
                          {user.access_status === 'active' ? 'Block Access' : 'Unblock Access'}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="rounded-xl p-3 font-bold gap-3 focus:bg-white/5 cursor-pointer"
                          onClick={() => updateUserStatus(user.id, { subscription_status: user.subscription_status === 'paid' ? 'unpaid' : 'paid' })}
                        >
                          <CreditCard size={18} className="text-indigo-500" />
                          Mark as {user.subscription_status === 'paid' ? 'Unpaid' : 'Paid'}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                           className="rounded-xl p-3 font-bold gap-3 focus:bg-white/5 cursor-pointer"
                           onClick={() => updateUserStatus(user.id, { subscription_status: 'trial' })}
                        >
                          <Clock size={18} className="text-amber-500" />
                          Set to Trial Mode
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
