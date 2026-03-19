'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { HeroSection } from '@/components/hero-section'
import { ServicesSection } from '@/components/services-section'
import { TestimonialsSection } from '@/components/testimonials-section'
import { TrustBadges } from '@/components/trust-badges'
import { MasterExpertSection } from '@/components/master-expert-section'
import { PricingSection } from '@/components/pricing-section'
import { FaqSection } from '@/components/faq-section'
import { Footer } from '@/components/footer'
import { JoinModal } from '@/components/join-modal'
import { StackingSection } from '@/components/ui/stacking-section'
import { StickyConversion } from '@/components/sticky-conversion'
import { ProblemSolution } from '@/components/problem-solution'
import { Differentiator } from '@/components/differentiator'

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <main className="min-h-screen bg-background">
      <Header onEmergencyClick={openModal} />
      
      <HeroSection onCtaClick={openModal} />
      
      <StackingSection index={1}>
        <TrustBadges />
      </StackingSection>

      <StackingSection index={2}>
        <ProblemSolution onCtaClick={openModal} />
      </StackingSection>

      <StackingSection index={3}>
        <Differentiator />
      </StackingSection>

      <StackingSection index={4}>
        <MasterExpertSection />
      </StackingSection>
      
      <StackingSection index={5}>
        <ServicesSection onCtaClick={openModal} />
      </StackingSection>
      
      <StackingSection index={6}>
        <TestimonialsSection />
      </StackingSection>
      
      <StackingSection index={7}>
        <PricingSection onCtaClick={openModal} />
      </StackingSection>
      
      <StackingSection index={8}>
        <FaqSection />
      </StackingSection>
      
      <Footer onCtaClick={openModal} />
      <JoinModal isOpen={isModalOpen} onClose={closeModal} />
      <StickyConversion onCtaClick={openModal} />
    </main>
  )
}
