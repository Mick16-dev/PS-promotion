'use client'

import { MasterExpertSection } from '@/components/master-expert-section'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function TeamPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header onEmergencyClick={() => {}} />
      <MasterExpertSection />
      <Footer onCtaClick={() => {}} />
    </main>
  )
}

