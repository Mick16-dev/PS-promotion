'use client'

import { motion } from 'framer-motion'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useState } from 'react'
import { JoinModal } from '@/components/join-modal'
import Link from 'next/link'

export default function DatenschutzPage() {
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
              Datenschutzerklärung
            </h1>
            <div className="prose prose-invert max-w-none text-muted-foreground space-y-6">
              <p>
                Verantwortlicher: Rotek Rohrreinigungsdienst GmbH, Bayernstr. 172, 28219 Bremen-Walle.
                E-Mail: info@rotek.de. Telefon: 0421 39 17 14.
              </p>
              <h2 className="text-xl font-semibold text-foreground pt-4">Datenerhebung</h2>
              <p>
                Wir erheben personenbezogene Daten nur, soweit Sie uns diese im Rahmen einer Anfrage
                oder Kontaktaufnahme mitteilen. Die Daten werden ausschließlich zur Bearbeitung
                Ihrer Anfrage verwendet.
              </p>
              <h2 className="text-xl font-semibold text-foreground pt-4">Ihre Rechte</h2>
              <p>
                Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der
                Verarbeitung Ihrer personenbezogenen Daten. Beschwerden können Sie bei der
                zuständigen Aufsichtsbehörde einreichen.
              </p>
              <p>
                <Link href="/impressum" className="text-primary hover:underline">
                  Impressum
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
