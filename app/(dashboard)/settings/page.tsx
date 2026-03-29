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
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'

const settingsTabs = [
  { id: 'profile', name: 'Profile', icon: User },
  { id: 'notifications', name: 'Notifications', icon: Bell },
  { id: 'security', name: 'Security', icon: Shield },
  { id: 'billing', name: 'Billing', icon: CreditCard },
  { id: 'integrations', name: 'Integrations', icon: Cloud },
  { id: 'team', name: 'Team Management', icon: Users },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Platform Settings</h1>
          <p className="text-muted-foreground mt-1">Configure your workspace, security preferences, and integration workflows.</p>
        </div>
        {hasUnsavedChanges && (
          <Button className="bg-primary hover:bg-primary/90 text-white gap-2 h-11 px-8 shadow-lg shadow-primary/20 transition-all active:scale-95 leading-none animate-in fade-in zoom-in duration-300">
            <Save size={18} />
            <span>Save Changes</span>
          </Button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:w-64 space-y-1">
          {settingsTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                activeTab === tab.id 
                ? 'bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5' 
                : 'text-muted-foreground hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className={`p-1.5 rounded-lg transition-colors ${
                activeTab === tab.id ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground group-hover:bg-white/10 group-hover:text-white'
              }`}>
                <tab.icon size={18} />
              </div>
              <span className="font-semibold text-sm tracking-tight">{tab.name}</span>
              {activeTab === tab.id && <ChevronRight size={16} className="ml-auto opacity-60" />}
            </button>
          ))}
        </div>

        {/* Settings Content Area */}
        <div className="flex-1 space-y-6">
          <div className="glass-card rounded-2xl p-8 border-white/5 shadow-2xl bg-muted/5 backdrop-blur-3xl">
            {activeTab === 'profile' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold tracking-tight">Public Profile</h3>
                  <p className="text-sm text-muted-foreground mt-1">Information about you that is shared with artists and venues.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label htmlFor="fullname" className="text-xs font-pro-data uppercase tracking-widest text-muted-foreground/60">Full Name</Label>
                    <Input 
                      id="fullname" 
                      defaultValue="Michael Promoter" 
                      className="bg-muted/30 border-white/5 h-12 focus-visible:ring-primary/50 text-lg font-semibold tracking-tight"
                      onChange={() => setHasUnsavedChanges(true)}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="title" className="text-xs font-pro-data uppercase tracking-widest text-muted-foreground/60">Professional Title</Label>
                    <Input 
                      id="title" 
                      defaultValue="Senior Talent Buyer" 
                      className="bg-muted/30 border-white/5 h-12 focus-visible:ring-primary/50 text-lg font-semibold tracking-tight"
                      onChange={() => setHasUnsavedChanges(true)}
                    />
                  </div>
                  <div className="space-y-3 md:col-span-2">
                    <Label htmlFor="bio" className="text-xs font-pro-data uppercase tracking-widest text-muted-foreground/60">Public Bio</Label>
                    <textarea 
                      id="bio"
                      className="w-full h-32 rounded-xl bg-muted/30 border-white/5 border p-4 focus:ring-2 focus:ring-primary/50 focus:outline-none focus:border-primary/50 text-white placeholder:text-muted-foreground/40 transition-all"
                      placeholder="Write a brief introduction about your role and expertise..."
                      onChange={() => setHasUnsavedChanges(true)}
                    />
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold">Public Show Status</h4>
                      <p className="text-xs text-muted-foreground mt-1 tracking-tight">Allows artists to see your active production pipeline.</p>
                    </div>
                    <Switch className="bg-muted" defaultChecked />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'integrations' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold tracking-tight">External Integrations</h3>
                  <p className="text-sm text-muted-foreground mt-1">Connect your workspace to external databases and n8n automations.</p>
                </div>

                <div className="space-y-4">
                  {[
                    { name: 'n8n Automation Engine', status: 'Connected', icon: Cloud, key: 'PRODUCTION-API-N8N' },
                    { name: 'Supabase Database', status: 'Setup Needed', icon: Shield, key: 'PROJECT-DB-ID' },
                    { name: 'Google Calendar Sync', status: 'Active', icon: Bell, key: 'OAUTH-GCAL-2024' },
                  ].map((integration) => (
                    <div key={integration.name} className="flex items-center justify-between p-5 rounded-2xl bg-muted/20 border border-white/5 group hover:border-primary/20 transition-all">
                      <div className="flex items-center gap-4">
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-white ${
                          integration.status === 'Connected' ? 'bg-emerald-500/20 text-emerald-400' : 
                          integration.status === 'Setup Needed' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-primary/20 text-primary'
                        }`}>
                          <integration.icon size={22} />
                        </div>
                        <div>
                          <p className="font-bold text-foreground leading-none">{integration.name}</p>
                          <p className="text-[10px] font-pro-data text-muted-foreground/60 uppercase tracking-widest mt-1.5">{integration.key}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className={`font-medium ${
                          integration.status === 'Connected' ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20' : 
                          integration.status === 'Setup Needed' ? 'bg-yellow-500/5 text-yellow-400 border-yellow-500/20' : 'bg-muted text-muted-foreground border-border'
                        }`}>
                          {integration.status}
                        </Badge>
                        <Button variant="ghost" className="text-xs h-8 hover:bg-white/5 text-muted-foreground">Configure</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab !== 'profile' && activeTab !== 'integrations' && (
              <div className="p-32 flex flex-col items-center justify-center text-center space-y-4">
                 <div className="h-16 w-16 rounded-full bg-muted/30 flex items-center justify-center animate-pulse">
                    <Settings size={32} className="text-muted-foreground/20" />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold tracking-tight text-muted-foreground/40 italic">Module in Development</h3>
                    <p className="text-sm text-muted-foreground/20 mt-1 uppercase font-pro-data tracking-widest">Enhanced settings modules arriving in v1.2</p>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
