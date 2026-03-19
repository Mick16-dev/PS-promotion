'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { HeroSection } from '@/components/hero-section'
import { TrustBadges } from '@/components/trust-badges'
import { ProblemSolution } from '@/components/problem-solution'
import { Differentiator } from '@/components/differentiator'
import { MasterExpertSection } from '@/components/master-expert-section'
import { ServicesSection } from '@/components/services-section'
import { TestimonialsSection } from '@/components/testimonials-section'
import { PricingSection } from '@/components/pricing-section'
import { FaqSection } from '@/components/faq-section'
import { Footer } from '@/components/footer'
import { JoinModal } from '@/components/join-modal'
import { StickyConversion } from '@/components/sticky-conversion'
import { RotekMasterVisualService } from '@/components/rotek-master-visual-service'
import { Einsatzgebiete } from '@/components/einsatzgebiete'

// Simple StackingSection wrapper for smooth scroll animations
function StackingSection({ children, index }: { children: React.ReactNode; index: number }) {
  return (
    <div className="relative sticky top-0 bg-background" style={{ zIndex: index }}>
      {children}
    </div>
  )
}

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <main className="min-h-screen bg-background selection:bg-red-600 selection:text-white">
      <Header onEmergencyClick={openModal} />
      
      <HeroSection onCtaClick={openModal} />
      
      <StackingSection index={1}>
        <TrustBadges />
      </StackingSection>

      <StackingSection index={2}>
        <RotekMasterVisualService onCtaClick={openModal} />
      </StackingSection>

      <StackingSection index={3}>
        <ProblemSolution onCtaClick={openModal} />
      </StackingSection>

      <StackingSection index={4}>
        <Differentiator />
      </StackingSection>

      <StackingSection index={5}>
        <MasterExpertSection />
      </StackingSection>
      
      <StackingSection index={6}>
        <ServicesSection onCtaClick={openModal} />
      </StackingSection>

      <StackingSection index={7}>
        <Einsatzgebiete />
      </StackingSection>
      
      <StackingSection index={8}>
        <TestimonialsSection />
      </StackingSection>
      
      <StackingSection index={9}>
        <PricingSection onCtaClick={openModal} />
      </StackingSection>
      
      <StackingSection index={10}>
        <FaqSection />
      </StackingSection>
      
      <StackingSection index={11}>
        <Footer onCtaClick={openModal} />
      </StackingSection>
      <JoinModal isOpen={isModalOpen} onClose={closeModal} />
      <StickyConversion onCtaClick={openModal} />
    </main>
  )
}
