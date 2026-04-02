'use client'

import React, { useState } from 'react'
import { 
  User, 
  Bell, 
  Settings, 
  Save,
  ChevronRight,
  ShieldAlert,
  Lock,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'

const settingsTabs = [
  { id: 'profile', name: 'Profile', icon: User },
  { id: 'notifications', name: 'Notifications', icon: Bell },
  { id: 'account', name: 'Account Settings', icon: Settings }
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveChanges = async () => {
    setIsSaving(true)
    const promise = new Promise((resolve) => setTimeout(resolve, 1500))
    
    toast.promise(promise, {
        loading: 'Saving changes...',
        success: () => {
          setIsSaving(false)
          setHasUnsavedChanges(false)
          return 'Your settings have been updated.'
        },
        error: 'Error updating settings. Please try again.',
    })
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
                      defaultValue="" 
                      placeholder="Enter your full name"
                      className="bg-white/5 border-white/10 h-16 focus-visible:ring-primary/50 text-xl font-bold tracking-tight rounded-3xl p-6 transition-all hover:border-white/20"
                      onChange={() => setHasUnsavedChanges(true)}
                    />
                  </div>
                  
                  <div className="space-y-3 opacity-60 cursor-not-allowed">
                    <Label htmlFor="email" className="text-[10px] font-pro-data uppercase tracking-[0.2em] text-muted-foreground font-black ml-2">Email</Label>
                    <Input 
                      id="email" 
                      readOnly
                      defaultValue="Signed-in email"
                      className="bg-black/40 border-white/5 h-16 text-xl tracking-tight rounded-3xl p-6 focus-visible:ring-0 select-none shadow-inner text-muted-foreground"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="role" className="text-[10px] font-pro-data uppercase tracking-[0.2em] text-muted-foreground font-black ml-2">Your Role</Label>
                    <Input 
                      id="role" 
                      defaultValue="" 
                      placeholder="Promoter, manager, or coordinator"
                      className="bg-white/5 border-white/10 h-16 focus-visible:ring-primary/50 text-xl font-bold tracking-tight rounded-3xl p-6 transition-all hover:border-white/20"
                      onChange={() => setHasUnsavedChanges(true)}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="bio" className="text-[10px] font-pro-data uppercase tracking-[0.2em] text-muted-foreground font-black ml-2">Bio</Label>
                    <textarea 
                      id="bio"
                      className="w-full h-40 rounded-[2rem] bg-white/5 border-white/10 border p-6 focus:ring-2 focus:ring-primary/50 focus:outline-none focus:border-primary/50 text-white font-medium placeholder:text-muted-foreground/30 transition-all text-lg leading-relaxed hover:border-white/20 shadow-inner"
                      placeholder="Add a short profile bio"
                      onChange={() => setHasUnsavedChanges(true)}
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

            {/* NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <div className="space-y-12 animate-in slide-in-from-right-4 fade-in duration-500">
                <div className="flex items-center gap-5 border-b border-white/5 pb-8">
                  <div className="h-16 w-16 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-xl shadow-primary/5">
                    <Bell size={32} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black uppercase tracking-tighter italic text-white">Email Alerts</h3>
                    <p className="text-sm text-muted-foreground mt-2 font-medium font-pro-data uppercase tracking-widest opacity-80">Notification Preferences</p>
                  </div>
                </div>

                <div className="space-y-6 max-w-3xl border border-white/5 bg-black/20 rounded-[2rem] p-4">
                  {[
                    { title: "Email me when an artist submits a document", default: true },
                    { title: "Email me when a document deadline is approaching (3 days before)", default: true },
                    { title: "Email me when a document is overdue", default: true },
                    { title: "Daily summary of show activity", default: false },
                  ].map((setting, idx) => (
                    <div key={idx} className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/[0.02] hover:border-white/10 transition-all hover:bg-white/[0.04]">
                      <h4 className="font-bold text-lg leading-tight text-white/90">{setting.title}</h4>
                      <Switch className="bg-muted scale-125 ml-6" defaultChecked={setting.default} onCheckedChange={() => setHasUnsavedChanges(true)} />
                    </div>
                  ))}
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
