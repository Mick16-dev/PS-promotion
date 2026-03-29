'use client'

import React, { useState } from 'react'
import { 
  User, 
  Bell, 
  Settings, 
  Shield, 
  Cloud, 
  Users, 
  CreditCard,
  Check,
  Save,
  ChevronRight,
  Zap,
  Layout
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'

const settingsTabs = [
  { id: 'profile', name: 'Profile Account', icon: User },
  { id: 'notifications', name: 'System Alerts', icon: Bell },
  { id: 'security', name: 'Identity & Access', icon: Shield },
  { id: 'billing', name: 'Financial Hub', icon: CreditCard },
  { id: 'integrations', name: 'Production Sync', icon: Cloud },
  { id: 'team', name: 'Workspace Team', icon: Users },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveChanges = async () => {
    setIsSaving(true)
    const promise = new Promise((resolve) => setTimeout(resolve, 2000))
    
    toast.promise(promise, {
        loading: 'Encrypting and syncing profile data...',
        success: () => {
          setIsSaving(false)
          setHasUnsavedChanges(false)
          return 'Configurations successfully deployed to secure vault.'
        },
        error: 'System error during sync. Please verify connection.',
    })
  }

  const handleTabChange = (id: string) => {
    setActiveTab(id)
    if (id !== 'profile' && id !== 'integrations') {
        toast.info(`${id.toUpperCase()} protocol is currently under security audit for v1.2 release.`)
    }
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic text-white">Platform Settings</h1>
          <p className="text-muted-foreground mt-2 font-medium">Coordinate workspace governance, encryption protocols, and production workflows.</p>
        </div>
        {hasUnsavedChanges && (
          <Button 
            onClick={handleSaveChanges}
            disabled={isSaving}
            className="bg-primary hover:bg-primary/90 text-white gap-3 h-12 px-10 shadow-xl shadow-primary/30 transition-all active:scale-95 leading-none animate-in fade-in zoom-in duration-500 font-pro-data uppercase tracking-widest text-xs"
          >
            {isSaving ? <Zap size={18} className="animate-spin" /> : <Save size={18} />}
            <span>{isSaving ? 'Syncing...' : 'Deploy Changes'}</span>
          </Button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Navigation Sidebar */}
        <div className="lg:w-72 space-y-2">
          {settingsTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500 group relative overflow-hidden ${
                activeTab === tab.id 
                ? 'bg-primary/10 text-primary border border-primary/20 shadow-xl shadow-primary/5' 
                : 'text-muted-foreground hover:bg-white/5 hover:text-white border border-transparent'
              }`}
            >
              <div className={`p-2 rounded-xl transition-all duration-500 ${
                activeTab === tab.id ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-muted/30 text-muted-foreground group-hover:bg-white/10 group-hover:text-white group-hover:scale-110'
              }`}>
                <tab.icon size={20} />
              </div>
              <span className="font-bold text-sm tracking-tight">{tab.name}</span>
              {activeTab === tab.id && <ChevronRight size={18} className="ml-auto opacity-60 animate-in slide-in-from-left-2" />}
            </button>
          ))}
        </div>

        {/* Settings Content Area */}
        <div className="flex-1 space-y-6">
          <div className="glass-card rounded-[2.5rem] p-10 border-white/5 shadow-2xl bg-muted/5 backdrop-blur-3xl min-h-[500px]">
            {activeTab === 'profile' && (
              <div className="space-y-10">
                <div className="flex items-center justify-between border-b border-white/5 pb-8">
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter italic">Public Profile</h3>
                    <p className="text-sm text-muted-foreground mt-2 font-medium font-pro-data uppercase tracking-widest opacity-60">Identity Management Protocol</p>
                  </div>
                  <div className="h-16 w-16 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-xl shadow-primary/5">
                    <User size={32} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <Label htmlFor="fullname" className="text-[10px] font-pro-data uppercase tracking-[0.2em] text-muted-foreground font-black">Operator Alias</Label>
                    <Input 
                      id="fullname" 
                      defaultValue="Michael Promoter" 
                      className="bg-muted/40 border-white/5 h-14 focus-visible:ring-primary/50 text-xl font-bold tracking-tight rounded-2xl p-6"
                      onChange={() => setHasUnsavedChanges(true)}
                    />
                  </div>
                  <div className="space-y-4">
                    <Label htmlFor="title" className="text-[10px] font-pro-data uppercase tracking-[0.2em] text-muted-foreground font-black">Tactical Position</Label>
                    <Input 
                      id="title" 
                      defaultValue="Senior Talent Buyer" 
                      className="bg-muted/40 border-white/5 h-14 focus-visible:ring-primary/50 text-xl font-bold tracking-tight rounded-2xl p-6"
                      onChange={() => setHasUnsavedChanges(true)}
                    />
                  </div>
                  <div className="space-y-4 md:col-span-2">
                    <Label htmlFor="bio" className="text-[10px] font-pro-data uppercase tracking-[0.2em] text-muted-foreground font-black">Mission Statement / Bio</Label>
                    <textarea 
                      id="bio"
                      className="w-full h-40 rounded-3xl bg-muted/40 border-white/5 border p-6 focus:ring-2 focus:ring-primary/50 focus:outline-none focus:border-primary/50 text-white font-medium placeholder:text-muted-foreground/20 transition-all text-lg leading-relaxed shadow-inner"
                      placeholder="Write a brief introduction about your role and expertise..."
                      onChange={() => setHasUnsavedChanges(true)}
                    />
                  </div>
                </div>

                <div className="pt-10 border-t border-white/5">
                  <div className="flex items-center justify-between p-6 rounded-3xl bg-white/[0.02] border border-white/5 group hover:border-primary/20 transition-all">
                    <div>
                      <h4 className="font-black text-lg uppercase italic group-hover:text-primary transition-colors">Public Pipeline Opt-In</h4>
                      <p className="text-sm text-muted-foreground mt-1 tracking-tight font-medium">Broadcast your active production status to verified artist representatives.</p>
                    </div>
                    <Switch className="bg-muted" defaultChecked onCheckedChange={() => setHasUnsavedChanges(true)} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'integrations' && (
              <div className="space-y-10">
                <div className="flex items-center justify-between border-b border-white/5 pb-8">
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter italic">Production Sync</h3>
                    <p className="text-sm text-muted-foreground mt-2 font-medium font-pro-data uppercase tracking-widest opacity-60">Global Integration Hub</p>
                  </div>
                  <div className="h-16 w-16 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-xl shadow-primary/5">
                    <Cloud size={32} />
                  </div>
                </div>

                <div className="space-y-6">
                  {[
                    { name: 'n8n Automation Engine', status: 'Connected', icon: Zap, key: 'PRODUCTION-API-N8N' },
                    { name: 'Supabase Database', status: 'Setup Needed', icon: Shield, key: 'PROJECT-DB-ID' },
                    { name: 'Google Calendar Sync', status: 'Active', icon: Bell, key: 'OAUTH-GCAL-2024' },
                  ].map((integration) => (
                    <div key={integration.name} className="flex items-center justify-between p-8 rounded-[2rem] bg-muted/20 border border-white/5 group hover:border-primary/30 transition-all duration-500 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-5 transition-opacity translate-x-4 group-hover:translate-x-0">
                         <integration.icon size={100} />
                      </div>
                      <div className="flex items-center gap-6 relative z-10">
                        <div className={`h-16 w-16 rounded-2xl flex items-center justify-center text-white shadow-xl ${
                          integration.status === 'Connected' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-emerald-500/5' : 
                          integration.status === 'Setup Needed' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 shadow-yellow-500/5' : 'bg-primary/10 text-primary border border-primary/20 shadow-primary/5'
                        } group-hover:scale-110 transition-transform duration-500`}>
                          <integration.icon size={32} />
                        </div>
                        <div>
                          <p className="font-black text-xl uppercase italic group-hover:text-primary transition-colors leading-none">{integration.name}</p>
                          <p className="text-[11px] font-pro-data text-muted-foreground/60 uppercase tracking-[0.25em] mt-3 font-bold">{integration.key}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 relative z-10">
                        <Badge variant="outline" className={`font-black font-pro-data uppercase tracking-widest py-1.5 px-4 text-[10px] ${
                          integration.status === 'Connected' ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20' : 
                          integration.status === 'Setup Needed' ? 'bg-yellow-500/5 text-yellow-400 border-yellow-500/20' : 'bg-muted text-muted-foreground border-border'
                        }`}>
                          {integration.status}
                        </Badge>
                        <Button 
                            variant="outline" 
                            className="bg-white/5 border-white/5 hover:bg-white/10 rounded-xl px-5 h-11 font-pro-data uppercase tracking-widest text-[10px]"
                            onClick={() => toast.info(`Initializing secure handshake for ${integration.name}...`)}
                        >
                            Configure
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab !== 'profile' && activeTab !== 'integrations' && (
              <div className="h-[400px] flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
                 <div className="h-24 w-24 rounded-[2rem] bg-muted/20 border border-white/10 flex items-center justify-center group relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Layout size={40} className="text-muted-foreground/30 relative z-10" />
                 </div>
                 <div>
                    <h3 className="text-3xl font-black uppercase tracking-tighter italic text-muted-foreground/40">Secure Module {activeTab.toUpperCase()}</h3>
                    <p className="text-xs text-muted-foreground/20 mt-4 uppercase font-pro-data tracking-[0.4em] max-w-sm mx-auto leading-relaxed">System architecture update v1.2 required to unlock advanced territory configurations.</p>
                 </div>
                 <Button variant="ghost" className="text-primary/40 hover:text-primary transition-colors font-pro-data uppercase tracking-widest text-[10px]" onClick={() => window.open('https://showready.app/roadmap', '_blank')}>
                    View Dev Roadmap
                 </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
