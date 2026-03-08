'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { HeroSection } from '@/components/hero-section'
import { BeforeAfterGallery } from '@/components/before-after-gallery'
import { TestimonialsSection } from '@/components/testimonials-section'
import { TrustBadges } from '@/components/trust-badges'
import { FeaturesSection } from '@/components/features-section'
import { PricingSection } from '@/components/pricing-section'
import { FaqSection } from '@/components/faq-section'
import { Footer } from '@/components/footer'
import { JoinModal } from '@/components/join-modal'

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <main className="min-h-screen bg-background">
      <Header onEmergencyClick={openModal} />
      <HeroSection onCtaClick={openModal} />
      <TrustBadges />
      <FeaturesSection onCtaClick={openModal} />
      <BeforeAfterGallery onCtaClick={openModal} />
      <TestimonialsSection />
      <PricingSection onCtaClick={openModal} />
      <FaqSection />
      <Footer onCtaClick={openModal} />
      <JoinModal isOpen={isModalOpen} onClose={closeModal} />
    </main>
  )
}
