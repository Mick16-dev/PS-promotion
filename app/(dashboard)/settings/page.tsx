'use client'

import React, { useState, useEffect } from 'react'
import { 
  User, 
  Bell, 
  Settings, 
  Save,
  ChevronRight,
  ShieldAlert,
  Lock,
  Zap,
  Link2,
  Table,
  CheckCircle,
  ExternalLink,
  Plus,
  Trash2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

const settingsTabs = [
  { id: 'profile', name: 'Profile', icon: User },
  { id: 'notifications', name: 'Notifications', icon: Bell },
  { id: 'integrations', name: 'Integrations', icon: Link2 },
  { id: 'account', name: 'Account Settings', icon: Settings }
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Auto-switch to Integrations tab if returning from Google
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const success = params.get('success')
      const tab = params.get('tab')
      
      if (success === 'google_connected' || tab === 'integrations') {
        console.log("URL param detected, switching to integrations tab")
        setActiveTab('integrations')
        if (success) {
          toast.success('Google Sheets Connected!')
          // Re-check integrations specifically when coming back with a success param
          checkIntegrations()
        }
      }
    }
  }, [])
  
  // Profile State
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState('')
  const [bio, setBio] = useState('')
  const [email, setEmail] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  
  // Integration & Template State
  const [isGoogleConnected, setIsGoogleConnected] = useState(false)
  const [exportTemplates, setExportTemplates] = useState<any[]>([])
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false)
  const [newTemplateName, setNewTemplateName] = useState('')
  const [isLoadingIntegrations, setIsLoadingIntegrations] = useState(false)

  // Fetch Profile Data
  React.useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        setEmail(user.email || '')
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (data && !error) {
          setFullName(data.full_name || '')
          setRole(data.role || '')
          setBio(data.bio || '')
        }
      }
    }
    
    loadProfile()
    checkIntegrations()
    fetchTemplates()
  }, [])

  async function checkIntegrations() {
    setIsLoadingIntegrations(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      console.log("Checking integrations for user:", user?.id)
      if (user) {
        const { data, error } = await supabase
          .from('user_integrations')
          .select('*')
          .eq('user_id', user.id)
          .eq('provider', 'google')
          .maybeSingle()
        
        if (error) {
          console.error("Supabase error checking integrations:", error)
        }
        
        console.log("Integration data found:", data)
        if (data) {
          setIsGoogleConnected(true)
        }
      }
    } catch (e) {
      console.error('Failed to check integrations:', e)
    } finally {
      setIsLoadingIntegrations(false)
    }
  }

  async function fetchTemplates() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('export_templates')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
        
        if (data) setExportTemplates(data)
      }
    } catch (e) {
      console.error('Failed to fetch templates:', e)
    }
  }

  const handleCreateTemplate = async () => {
    if (!newTemplateName || !userId) return
    
    setIsLoadingIntegrations(true)
    try {
      const { data, error } = await supabase
        .from('export_templates')
        .insert({
          user_id: userId,
          name: newTemplateName,
          mapping: {
            artist_name: 'Artist',
            show_date: 'Date',
            venue_name: 'Venue',
            city: 'City',
            show_time: 'Show Time',
            deal_guarantee: 'Guarantee'
          }
        })
        .select()
        .single()

      if (error) throw error
      
      setExportTemplates([data, ...exportTemplates])
      setNewTemplateName('')
      setIsCreatingTemplate(false)
      toast.success('Template created.', { description: 'Now you can customize the column mappings.' })
    } catch (e: any) {
      toast.error('Failed to create template: ' + e.message)
    } finally {
      setIsLoadingIntegrations(false)
    }
  }

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return
    
    try {
      const { error } = await supabase
        .from('export_templates')
        .delete()
        .eq('id', id)

      if (error) throw error
      setExportTemplates(exportTemplates.filter(t => t.id !== id))
      toast.success('Template removed.')
    } catch (e: any) {
      toast.error('Failed to delete template: ' + e.message)
    }
  }

  const handleConnectGoogle = async () => {
    // Generate the Google OAuth URL
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    const redirectUri = `${window.location.origin}/api/auth/google/callback`
    const scope = 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/userinfo.email'
    
    if (!clientId) {
      toast.error('Google Client ID not configured', {
        description: 'Please add NEXT_PUBLIC_GOOGLE_CLIENT_ID to your environment variables.'
      })
      return
    }

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` + 
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(scope)}&` +
      `access_type=offline&` +
      `prompt=consent`

    window.location.href = authUrl
  }

  const handleDisconnectGoogle = async () => {
    if (!userId) return
    
    setIsLoadingIntegrations(true)
    try {
      const { error } = await supabase
        .from('user_integrations')
        .delete()
        .eq('user_id', userId)
        .eq('provider', 'google')

      if (error) throw error
      setIsGoogleConnected(false)
      toast.success('Google Sheets disconnected.')
    } catch (e: any) {
      toast.error('Failed to disconnect: ' + e.message)
    } finally {
      setIsLoadingIntegrations(false)
    }
  }

  const handleSaveChanges = async () => {
    if (!userId) {
      toast.error('User not authenticated')
      return
    }

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

      if (error) {
        throw error
      }

      toast.success('Your settings have been updated.')
      setHasUnsavedChanges(false)
    } catch (error: any) {
      console.error('Error saving profile:', error)
      toast.error(`Error: ${error.message || 'Could not update settings'}`)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic text-white">Settings</h1>
          <p className="text-muted-foreground mt-2 font-medium">Manage your personal profile, email alerts, and account security.</p>
        </div>
        {hasUnsavedChanges && (
          <Button 
            onClick={handleSaveChanges}
            disabled={isSaving}
            className="bg-primary hover:bg-primary/90 text-white gap-3 h-12 px-10 shadow-xl shadow-primary/30 transition-all active:scale-95 leading-none animate-in fade-in zoom-in duration-500 font-pro-data uppercase tracking-widest text-xs rounded-xl"
          >
            {isSaving ? <Zap size={18} className="animate-spin" /> : <Save size={18} />}
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </Button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Navigation Sidebar */}
        <div className="lg:w-72 space-y-2">
          {settingsTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-3xl transition-all duration-500 group relative overflow-hidden ${
                activeTab === tab.id 
                ? 'bg-primary/10 text-primary border border-primary/20 shadow-xl shadow-primary/5' 
                : 'text-muted-foreground hover:bg-white/5 hover:text-white border border-transparent'
              }`}
            >
              <div className={`p-2 rounded-2xl transition-all duration-500 ${
                activeTab === tab.id ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-muted/30 text-muted-foreground group-hover:bg-white/10 group-hover:text-white group-hover:scale-110'
              }`}>
                <tab.icon size={20} />
              </div>
              <span className="font-bold text-lg tracking-tight leading-none pt-1">{tab.name}</span>
              {activeTab === tab.id && <ChevronRight size={18} className="ml-auto opacity-60 animate-in slide-in-from-left-2" />}
            </button>
          ))}
        </div>

        {/* Settings Content Area */}
        <div className="flex-1 space-y-6">
          <div className="glass-card rounded-[3rem] p-10 lg:p-14 border-white/5 shadow-2xl bg-muted/5 backdrop-blur-3xl min-h-[500px]">
            
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="space-y-12 animate-in slide-in-from-right-4 fade-in duration-500">
                <div className="flex items-center gap-5 border-b border-white/5 pb-8">
                  <div className="h-16 w-16 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-xl shadow-primary/5">
                    <User size={32} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black uppercase tracking-tighter italic text-white">Your Profile</h3>
                    <p className="text-sm text-muted-foreground mt-2 font-medium font-pro-data uppercase tracking-widest opacity-80">Public Information</p>
                  </div>
                </div>

                <div className="space-y-8 max-w-2xl">
                  <div className="space-y-3">
                    <Label htmlFor="fullname" className="text-[10px] font-pro-data uppercase tracking-[0.2em] text-muted-foreground font-black ml-2">Full Name</Label>
                    <Input 
                      id="fullname" 
                      value={fullName}
                      placeholder="Enter your full name"
                      className="bg-white/5 border-white/10 h-16 focus-visible:ring-primary/50 text-xl font-bold tracking-tight rounded-3xl p-6 transition-all hover:border-white/20"
                      onChange={(e) => {
                        setFullName(e.target.value)
                        setHasUnsavedChanges(true)
                      }}
                    />
                  </div>
                  
                  <div className="space-y-3 opacity-60 cursor-not-allowed">
                    <Label htmlFor="email" className="text-[10px] font-pro-data uppercase tracking-[0.2em] text-muted-foreground font-black ml-2">Email</Label>
                    <Input 
                      id="email" 
                      readOnly
                      value={email}
                      className="bg-black/40 border-white/5 h-16 text-xl tracking-tight rounded-3xl p-6 focus-visible:ring-0 select-none shadow-inner text-muted-foreground"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="role" className="text-[10px] font-pro-data uppercase tracking-[0.2em] text-muted-foreground font-black ml-2">Your Role</Label>
                    <Input 
                      id="role" 
                      value={role}
                      placeholder="Promoter, manager, or coordinator"
                      className="bg-white/5 border-white/10 h-16 focus-visible:ring-primary/50 text-xl font-bold tracking-tight rounded-3xl p-6 transition-all hover:border-white/20"
                      onChange={(e) => {
                        setRole(e.target.value)
                        setHasUnsavedChanges(true)
                      }}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="bio" className="text-[10px] font-pro-data uppercase tracking-[0.2em] text-muted-foreground font-black ml-2">Bio</Label>
                    <textarea 
                      id="bio"
                      value={bio}
                      className="w-full h-40 rounded-[2rem] bg-white/5 border-white/10 border p-6 focus:ring-2 focus:ring-primary/50 focus:outline-none focus:border-primary/50 text-white font-medium placeholder:text-muted-foreground/30 transition-all text-lg leading-relaxed hover:border-white/20 shadow-inner"
                      placeholder="Add a short profile bio"
                      onChange={(e) => {
                        setBio(e.target.value)
                        setHasUnsavedChanges(true)
                      }}
                    />
                  </div>
                </div>

                {!hasUnsavedChanges && (
                  <Button 
                    className="bg-white/5 text-muted-foreground/40 hover:bg-white/10 h-16 px-10 rounded-2xl font-pro-data uppercase tracking-widest text-xs font-bold"
                  >
                    Save Changes
                  </Button>
                )}
              </div>
            )}

            {/* INTEGRATIONS TAB */}
            {activeTab === 'integrations' && (
              <div className="space-y-12 animate-in slide-in-from-right-4 fade-in duration-500">
                <div className="flex items-center gap-5 border-b border-white/5 pb-8">
                  <div className="h-16 w-16 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-xl shadow-primary/5">
                    <Link2 size={32} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black uppercase tracking-tighter italic text-white">External Sync</h3>
                    <p className="text-sm text-muted-foreground mt-2 font-medium font-pro-data uppercase tracking-widest opacity-80">Connect your external tools</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Google Sheets Card */}
                  <div className="bg-black/20 border border-white/5 rounded-[2.5rem] p-8 space-y-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Table size={120} />
                    </div>

                    <div className="flex items-center gap-4 relative z-10">
                      <div className="h-12 w-12 rounded-xl bg-[#0F9D58]/10 flex items-center justify-center">
                        <Table className="text-[#0F9D58]" size={24} />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-white leading-none">Google Sheets</h4>
                        <p className="text-xs text-muted-foreground font-medium mt-1">Live data synchronization</p>
                      </div>
                    </div>

                    <div className="space-y-4 relative z-10">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Export your show data directly to Google Sheets. Maintain your existing spreadsheet workflows with automatic real-time updates.
                      </p>

                      <div className="pt-4">
                        {isGoogleConnected ? (
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/5 px-4 py-3 rounded-xl border border-emerald-500/20 w-fit">
                              <CheckCircle size={14} />
                              <span className="text-[10px] font-black uppercase tracking-widest leading-none">Connected</span>
                            </div>
                            <Button 
                              variant="ghost" 
                              onClick={handleDisconnectGoogle}
                              disabled={isLoadingIntegrations}
                              className="text-red-500 hover:text-red-400 hover:bg-red-500/5 h-12 px-6 rounded-xl font-bold text-xs"
                            >
                              Disconnect Google Account
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            onClick={handleConnectGoogle}
                            disabled={isLoadingIntegrations}
                            className="bg-white hover:bg-zinc-200 text-[#0B0C0E] h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-xs gap-3 shadow-xl shadow-white/5 transition-all active:scale-95"
                          >
                            <Table size={18} />
                            {isLoadingIntegrations ? 'Processing...' : 'Connect Google Sheets'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* n8n Workflow Card (Informational) */}
                  <div className="bg-black/20 border border-white/5 rounded-[2.5rem] p-8 space-y-8 opacity-60">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                        <Zap className="text-orange-500" size={24} />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-white leading-none">Custom Webhooks</h4>
                        <p className="text-xs text-muted-foreground font-medium mt-1">Advanced n8n Automations</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Configure custom n8n endpoints to pipe your show data into Slack, Discord, or your internal CRM systems.
                      </p>
                      <div className="pt-4">
                        <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest px-3 py-1 border-white/10 text-muted-foreground">Coming Soon</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Export Templates Section */}
                <div className="pt-12 border-t border-white/5 space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-black uppercase tracking-tighter italic text-white">Universal Export Templates</h3>
                      <p className="text-sm text-muted-foreground mt-2 font-medium">Map internal show data to your specific spreadsheet column headers.</p>
                    </div>
                    <Button 
                      onClick={() => setIsCreatingTemplate(true)}
                      className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 h-12 px-6 rounded-xl font-bold text-xs gap-2"
                    >
                      <Plus size={16} /> Create Template
                    </Button>
                  </div>

                  {isCreatingTemplate && (
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col md:flex-row gap-4 items-end animate-in slide-in-from-top-2 duration-300">
                      <div className="flex-1 space-y-2">
                        <Label className="text-[10px] font-pro-data uppercase tracking-widest text-muted-foreground ml-2">Template Name</Label>
                        <Input 
                          placeholder="e.g. Finance Sheet Export, Production Schedule..." 
                          value={newTemplateName}
                          onChange={(e) => setNewTemplateName(e.target.value)}
                          className="bg-black/40 border-white/10 h-12 rounded-xl text-sm"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" onClick={() => setIsCreatingTemplate(false)} className="h-12 rounded-xl px-6 text-xs font-bold">Cancel</Button>
                        <Button onClick={handleCreateTemplate} className="bg-primary text-white h-12 rounded-xl px-8 text-xs font-bold shadow-lg shadow-primary/20">Save Profile</Button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-4">
                    {exportTemplates.map((template) => (
                      <div key={template.id} className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between hover:bg-white/[0.04] transition-all group">
                        <div className="flex items-center gap-5">
                          <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-muted-foreground group-hover:text-white transition-colors">
                            <Table size={20} />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-white">{template.name}</h4>
                            <p className="text-xs text-muted-foreground font-medium mt-1">{Object.keys(template.mapping || {}).length} Columns Mapped</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 mt-4 md:mt-0">
                          <Button 
                            variant="outline" 
                            className="h-10 border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold px-5 rounded-xl gap-2"
                            onClick={() => window.location.href = `/settings/templates/${template.id}`}
                          >
                            Edit Mapping <ChevronRight size={14} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteTemplate(template.id)}
                            className="h-10 w-10 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    ))}

                    {exportTemplates.length === 0 && !isCreatingTemplate && (
                      <div className="bg-white/[0.01] border border-dashed border-white/10 rounded-[3rem] p-16 text-center">
                         <Table size={48} className="mx-auto text-muted-foreground/20 mb-4" />
                         <p className="text-sm text-muted-foreground font-medium">You haven't created any export templates yet.</p>
                         <p className="text-xs text-muted-foreground/40 mt-1 uppercase tracking-widest font-bold">Start by creating a mapping profile for your spreadsheets.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ACCOUNT/SECURITY TAB */}
            {activeTab === 'account' && (
              <div className="space-y-12 animate-in slide-in-from-right-4 fade-in duration-500">
                <div className="flex items-center gap-5 border-b border-white/5 pb-8">
                  <div className="h-16 w-16 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-xl shadow-primary/5">
                    <Settings size={32} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black uppercase tracking-tighter italic text-white">Account Settings</h3>
                    <p className="text-sm text-muted-foreground mt-2 font-medium font-pro-data uppercase tracking-widest opacity-80">Security & Danger Zone</p>
                  </div>
                </div>

                <div className="space-y-10 max-w-xl">
                  {/* Change Password */}
                  <div className="space-y-6">
                    <h4 className="text-sm font-pro-data uppercase tracking-widest font-black text-white flex items-center gap-3">
                        <Lock size={16} className="text-primary" /> Change Password
                    </h4>
                    <div className="space-y-4">
                        <div className="space-y-3">
                            <Label htmlFor="current_password" className="text-[10px] font-pro-data uppercase tracking-[0.2em] text-muted-foreground font-black ml-2">Current Password</Label>
                            <Input 
                            id="current_password" 
                            type="password"
                            placeholder="Enter current password..."
                            className="bg-white/5 border-white/10 h-14 focus-visible:ring-primary/50 text-base tracking-tight rounded-2xl p-6 transition-all"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="new_password" className="text-[10px] font-pro-data uppercase tracking-[0.2em] text-muted-foreground font-black ml-2">New Password</Label>
                            <Input 
                            id="new_password" 
                            type="password"
                            placeholder="Create new password..."
                            className="bg-white/5 border-white/10 h-14 focus-visible:ring-primary/50 text-base tracking-tight rounded-2xl p-6 transition-all"
                            />
                        </div>
                    </div>
                    <Button 
                        variant="outline" 
                        className="bg-white/5 border-white/10 hover:bg-white/10 h-12 px-8 rounded-xl font-pro-data uppercase tracking-widest text-[10px] gap-2 font-bold"
                        onClick={() => toast.success('Password update request sent.')}
                    >
                        Update Password
                    </Button>
                  </div>

                  {/* Danger Zone */}
                  <div className="pt-10 border-t border-red-500/20 mt-10 space-y-6">
                     <h4 className="text-sm font-pro-data uppercase tracking-widest font-black text-red-500 flex items-center gap-3">
                        <ShieldAlert size={16} /> Danger Zone
                     </h4>
                     <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-md">
                        Permanently delete your account and all associated data. This action cannot be undone.
                     </p>
                     
                     <Button 
                        className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white h-14 px-8 rounded-2xl border border-red-500/20 font-black tracking-tight text-lg shadow-inner hover:shadow-2xl hover:shadow-red-500/40 transition-all font-sans"
                        onClick={() => toast.error('This action requires manual confirmation. Please contact support.')}
                     >
                        Delete Account
                     </Button>
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
