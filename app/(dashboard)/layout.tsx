import React from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Navbar } from '@/components/layout/navbar'
import { AccessGuard } from '@/components/context/access-guard'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AccessGuard>
      <div className="flex h-screen overflow-hidden bg-canvas">
        {/* Sidebar Navigation */}
        <Sidebar />
        
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden bg-surface-base">
          {/* Top Navbar */}
          <Navbar />
          
          {/* Main Dashboard Content */}
          <main className="flex-1 p-6 lg:p-10 relative z-10">
            <div className="mx-auto max-w-[1600px] h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AccessGuard>
  )
}
