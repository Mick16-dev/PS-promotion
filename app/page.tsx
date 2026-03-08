import { Header } from '@/components/header'
import { HeroSection } from '@/components/hero-section'
import { BeforeAfterGallery } from '@/components/before-after-gallery'
import { TestimonialsSection } from '@/components/testimonials-section'
import { TrustBadges } from '@/components/trust-badges'
import { PricingSection } from '@/components/pricing-section'
import { FAQSection } from '@/components/faq-section'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <BeforeAfterGallery />
      <TestimonialsSection />
      <TrustBadges />
      <PricingSection />
      <FAQSection />
      <Footer />
    </main>
  )
}
