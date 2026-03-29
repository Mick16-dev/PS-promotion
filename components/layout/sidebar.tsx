'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Music, 
  Calendar, 
  Users, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight 
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Shows', href: '/shows', icon: Music },
  { name: 'Artists', href: '/artists', icon: Users },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = React.useState(false)

  return (
    <div 
      className={cn(
        "relative flex flex-col h-screen border-r border-border bg-background transition-all duration-300 ease-in-out z-40",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Branding Header */}
      <div className="flex items-center h-16 px-6 border-b border-border mb-4">
        {!isCollapsed && (
          <span className="text-xl font-bold tracking-tighter text-foreground">
            PS<span className="text-primary">.P</span>
          </span>
        )}
        {isCollapsed && (
          <span className="text-xl font-bold tracking-tighter text-primary">P</span>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group relative flex items-center px-3 py-2.5 rounded-lg transition-all duration-200",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              {/* Active Glow Accent */}
              {isActive && (
                <div className="absolute left-0 w-1 h-6 bg-primary rounded-full blur-[2px] transition-all" />
              )}
              
              <item.icon className={cn(
                "w-5 h-5 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
              )} />
              
              {!isCollapsed && (
                <span className="ml-3 font-medium tracking-tight">
                  {item.name}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer / Toggle */}
      <div className="p-4 border-t border-border mt-auto">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center justify-center w-full p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!isCollapsed && <span className="ml-2 text-sm font-medium">Collapse</span>}
        </button>
        
        <button className="flex items-center w-full mt-2 px-3 py-2 rounded-lg text-red-500/80 hover:text-red-500 hover:bg-red-500/10 transition-all">
          <LogOut size={18} />
          {!isCollapsed && <span className="ml-3 text-sm font-medium">Sign Out</span>}
        </button>
      </div>
    </div>
  )
}
