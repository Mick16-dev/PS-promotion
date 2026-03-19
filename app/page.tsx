'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { HeroSection } from '@/components/hero-section'
import { TrustBadges } from '@/components/trust-badges'
import { RotekMasterVisualService } from '@/components/rotek-master-visual-service'
import { LumnarServicesPreview } from '@/components/lumnar-services-preview'
import { Einsatzgebiete } from '@/components/einsatzgebiete'
import { Footer } from '@/components/footer'
import { JoinModal } from '@/components/join-modal'
import { StickyConversion } from '@/components/sticky-conversion'

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <main className="min-h-screen bg-background">
      <Header onEmergencyClick={openModal} />
      <HeroSection onCtaClick={openModal} />
      <TrustBadges />
      <RotekMasterVisualService />
      <LumnarServicesPreview onCtaClick={openModal} />
      <Einsatzgebiete />
      <Footer onCtaClick={openModal} />
      <JoinModal isOpen={isModalOpen} onClose={closeModal} />
      <StickyConversion onCtaClick={openModal} />
    </main>
  )
}
