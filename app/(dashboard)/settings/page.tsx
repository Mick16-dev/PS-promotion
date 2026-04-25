'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { 
  User, 
  Link2, 
  Settings, 
  ChevronRight, 
  Save, 
  Zap, 
  Table, 
  CheckCircle, 
  Trash2, 
  Plus, 
  ShieldAlert,
  Lock,
  ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'

const settingsTabs = [
  { id: 'profile', name: 'Profile', icon: User },
  { id: 'integrations', name: 'Integrations', icon: Link2 },
  { id: 'account', name: 'Account', icon: Settings }
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState('')
  const [bio, setBio] = useState('')
  const [email, setEmail] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [isGoogleConnected, setIsGoogleConnected] = useState(false)
  const [isLoadingIntegrations, setIsLoadingIntegrations] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        setEmail(user.email || '')
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (profile) {
          setFullName(profile.full_name || '')
          setRole(profile.role || '')
          setBio(profile.bio || '')
        }

        const { data: integration } = await supabase
          .from('user_integrations')
          .select('*')
          .eq('user_id', user.id)
          .eq('provider', 'google')
          .maybeSingle()
        
        if (integration) setIsGoogleConnected(true)
      }
    }
    loadData()
  }, [])

  const handleSaveChanges = async () => {
    if (!userId) return
    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          full_name: fullName,
          role: role,
          bio: bio,
          updated_at: new Date().toISOString()
        })
      if (error) throw error
      toast.success('Settings updated successfully')
      setHasUnsavedChanges(false)
    } catch (e: any) {
      toast.error('Failed to save: ' + e.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleConnectGoogle = async () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    const redirectUri = `${window.location.origin}/api/auth/google/callback`
    const scope = 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive'
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=consent`
    window.location.href = authUrl
  }

  const handleDisconnectGoogle = async () => {
    if (!userId) return
    setIsLoadingIntegrations(true)
    try {
      await supabase.from('user_integrations').delete().eq('user_id', userId).eq('provider', 'google')
      setIsGoogleConnected(false)
      toast.success('Google account disconnected')
    } catch (e: any) {
      toast.error('Failed to disconnect')
    } finally {
      setIsLoadingIntegrations(false)
    }
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic text-white">Settings</h1>
          <p className="text-muted-foreground mt-2 font-medium font-pro-data uppercase tracking-widest text-[10px]">Command Center & Identity</p>
        </div>
        {hasUnsavedChanges && (
          <Button onClick={handleSaveChanges} disabled={isSaving} className="bg-primary text-white h-12 px-8 rounded-xl font-bold uppercase tracking-widest text-xs gap-2">
            {isSaving ? <Zap size={16} className="animate-spin" /> : <Save size={16} />} Save Changes
          </Button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="lg:w-72 space-y-2">
          {settingsTabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-4 px-5 py-4 rounded-3xl transition-all ${activeTab === tab.id ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:bg-white/5 hover:text-white border border-transparent'}`}>
              <div className={`p-2 rounded-2xl ${activeTab === tab.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-muted/30'}`}><tab.icon size={20} /></div>
              <span className="font-bold text-lg tracking-tight pt-1">{tab.name}</span>
            </button>
          ))}
        </div>

        <div className="flex-1">
          <div className="glass-card rounded-[3rem] p-10 lg:p-14 border-white/5 bg-muted/5 min-h-[500px]">
            {activeTab === 'profile' && (
              <div className="space-y-12 animate-in slide-in-from-right-4 fade-in duration-500">
                <div className="flex items-center gap-5 border-b border-white/5 pb-8">
                  <div className="h-16 w-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary"><User size={32} /></div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter italic text-white">Your Profile</h3>
                </div>
                <div className="space-y-8 max-w-2xl">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-pro-data uppercase tracking-widest text-muted-foreground ml-2">Full Name</Label>
                    <Input value={fullName} onChange={(e) => {setFullName(e.target.value); setHasUnsavedChanges(true)}} className="bg-white/5 border-white/10 h-16 rounded-3xl p-6 text-xl font-bold" />
                  </div>
                  <div className="space-y-3 opacity-40">
                    <Label className="text-[10px] font-pro-data uppercase tracking-widest text-muted-foreground ml-2">Email Address</Label>
                    <Input value={email} readOnly className="bg-black/40 border-white/5 h-16 rounded-3xl p-6 text-xl font-bold" />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] font-pro-data uppercase tracking-widest text-muted-foreground ml-2">Bio</Label>
                    <textarea value={bio} onChange={(e) => {setBio(e.target.value); setHasUnsavedChanges(true)}} className="w-full h-40 rounded-[2rem] bg-white/5 border border-white/10 p-6 text-white text-lg focus:ring-2 focus:ring-primary/50" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'integrations' && (
              <div className="space-y-12 animate-in slide-in-from-right-4 fade-in duration-500">
                <div className="flex items-center gap-5 border-b border-white/5 pb-8">
                  <div className="h-16 w-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary"><Link2 size={32} /></div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter italic text-white">External Sync</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-black/20 border border-white/5 rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden group">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-[#0F9D58]/10 flex items-center justify-center"><Table className="text-[#0F9D58]" size={24} /></div>
                      <h4 className="text-xl font-bold text-white">Google Sheets</h4>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">Connect your Google account to enable automated production spreadsheets for every show.</p>
                    <div className="pt-4">
                      {isGoogleConnected ? (
                        <div className="space-y-4">
                          <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 gap-2 px-4 py-2 rounded-xl"><CheckCircle size={14} /> Connected</Badge>
                          <Button variant="ghost" onClick={handleDisconnectGoogle} disabled={isLoadingIntegrations} className="text-red-500 text-xs font-bold block">Disconnect Account</Button>
                        </div>
                      ) : (
                        <Button onClick={handleConnectGoogle} disabled={isLoadingIntegrations} className="bg-white text-black h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-xs gap-3">
                          <Table size={18} /> {isLoadingIntegrations ? 'Processing...' : 'Connect Google Sheets'}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="space-y-12 animate-in slide-in-from-right-4 fade-in duration-500">
                <div className="flex items-center gap-5 border-b border-white/5 pb-8">
                  <div className="h-16 w-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary"><Settings size={32} /></div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter italic text-white">Account</h3>
                </div>
                <div className="space-y-10 max-w-xl">
                  <div className="space-y-6">
                    <h4 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-3"><Lock size={16} className="text-primary" /> Security</h4>
                    <Button variant="outline" className="h-12 px-8 rounded-xl text-xs font-bold" onClick={() => toast.info('Password reset email sent.')}>Reset Password</Button>
                  </div>
                  <div className="pt-10 border-t border-red-500/20 space-y-6">
                    <h4 className="text-sm font-black uppercase tracking-widest text-red-500 flex items-center gap-3"><ShieldAlert size={16} /> Danger Zone</h4>
                    <Button className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white h-14 px-8 rounded-2xl border border-red-500/20 font-bold" onClick={() => toast.error('Contact support to delete account.')}>Delete Account</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
