'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/app/context/language-context'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Phone, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useState } from 'react'
import { JoinModal } from '@/components/join-modal'

export default function PricingPage() {
  const { language } = useLanguage()
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <main className="min-h-screen bg-background">
      <Header onEmergencyClick={() => setIsModalOpen(true)} />

      <div className="pt-32 pb-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 text-foreground">
              {language === 'de' ? 'Kostenvoranschlag' : 'Quote'}
            </h1>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              {language === 'de'
                ? 'Rotek arbeitet mit kundenspezifischen Angeboten. Keine Pauschalpreise – jeder Auftrag wird vor Ort oder telefonisch individuell kalkuliert. Kontaktieren Sie uns für eine unverbindliche Anfrage.'
                : 'Rotek works with custom quotes. No fixed prices – each job is calculated individually on-site or by phone. Contact us for a non-binding inquiry.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+49421391714"
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-12 px-6 rounded-xl"
              >
                <Phone className="w-5 h-5" />
                0421 391714
              </a>
              <Button
                onClick={() => setIsModalOpen(true)}
                variant="outline"
                className="h-12 px-6 rounded-xl font-semibold"
              >
                {language === 'de' ? 'Anfrage senden' : 'Send inquiry'}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer onCtaClick={() => setIsModalOpen(true)} />
      <JoinModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  )
}
