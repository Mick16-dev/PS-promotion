'use client'

import { motion } from 'framer-motion'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useState } from 'react'
import { JoinModal } from '@/components/join-modal'
import Link from 'next/link'

export default function ImpressumPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <main className="min-h-screen bg-background">
      <Header onEmergencyClick={() => setIsModalOpen(true)} />

      <div className="pt-32 pb-24 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-8">
              Impressum
            </h1>
            <div className="prose prose-invert max-w-none text-muted-foreground space-y-6">
              <p className="font-semibold text-foreground">Rotek Rohrreinigungsdienst GmbH</p>
              <p>Bayernstr. 172<br />28219 Bremen-Walle</p>
              <p>Telefon: 0421 39 17 14<br />Fax: 0421 39 655 74<br />E-Mail: info@rotek.de</p>
              <p>Registergericht: [Angaben ergänzen]<br />USt-IdNr.: [Angaben ergänzen]</p>
              <p>Geschäftsführung: [Angaben ergänzen]</p>
              <p>
                <Link href="/datenschutz" className="text-primary hover:underline">
                  Datenschutzerklärung
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer onCtaClick={() => setIsModalOpen(true)} />
      <JoinModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  )
}
