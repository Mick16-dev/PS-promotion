'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/app/context/language-context'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Building2, Truck, Users, MapPin } from 'lucide-react'
import { useState } from 'react'
import { JoinModal } from '@/components/join-modal'

export default function UeberUnsPage() {
  const { language } = useLanguage()
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <main className="min-h-screen bg-background">
      <Header onEmergencyClick={() => setIsModalOpen(true)} />

      <div className="pt-32 pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-2">
              {language === 'de' ? 'Seit 1972' : 'Since 1972'}
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6 text-foreground">
              {language === 'de' ? 'Über uns' : 'About us'}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {language === 'de'
                ? 'Rotek Rohrreinigungsdienst GmbH – Fachbetrieb für Rohrreinigung, Kanalreinigung und Kanalsanierung in Bremen, Verden und Umzu.'
                : 'Rotek Rohrreinigungsdienst GmbH – specialist for pipe cleaning, sewer cleaning and sewer renovation in Bremen, Verden and surroundings.'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid sm:grid-cols-3 gap-6 mb-16"
          >
            <div className="rounded-2xl border border-border/60 bg-card/50 p-6 flex flex-col items-center text-center">
              <Building2 className="w-8 h-8 text-primary mb-3" />
              <div className="text-2xl font-extrabold text-foreground">1972</div>
              <p className="text-sm text-muted-foreground mt-1">
                {language === 'de' ? 'Seit Jahrgang' : 'Founded'}
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card/50 p-6 flex flex-col items-center text-center">
              <Users className="w-8 h-8 text-primary mb-3" />
              <div className="text-2xl font-extrabold text-foreground">32</div>
              <p className="text-sm text-muted-foreground mt-1">
                {language === 'de' ? 'Mitarbeitende' : 'Staff'}
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card/50 p-6 flex flex-col items-center text-center">
              <Truck className="w-8 h-8 text-primary mb-3" />
              <div className="text-2xl font-extrabold text-foreground">11</div>
              <p className="text-sm text-muted-foreground mt-1">
                {language === 'de' ? 'Spezial-Fahrzeuge' : 'Vehicles'}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6 text-muted-foreground leading-relaxed"
          >
            <p>
              {language === 'de'
                ? 'Rotek ist seit mehr als fünf Jahrzehnten Ihr Partner für Rohrreinigung, Kanalreinigung, Kanal-TV, Hebeanlagen, Fettabscheider, Dichtheitsprüfung und Kanalsanierung. Mit Hauptsitz in Bremen-Walle und einer Niederlassung in Verden decken wir die Region professionell ab.'
                : 'Rotek has been your partner for pipe cleaning, sewer cleaning, sewer TV inspection, lifting stations, grease separators, leak testing and sewer renovation for over five decades. With headquarters in Bremen-Walle and an office in Verden, we serve the region professionally.'}
            </p>
            <p>
              {language === 'de'
                ? 'Eigene Fahrzeugflotte. Keine Subunternehmer. 24-Stunden Notdienst über 0421 391714.'
                : 'Own vehicle fleet. No subcontractors. 24-hour emergency service at 0421 391714.'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 rounded-2xl border border-border/60 bg-card/50 p-6 sm:p-8"
          >
            <h2 className="text-xl font-extrabold text-foreground mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              {language === 'de' ? 'Standorte' : 'Locations'}
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <p className="font-semibold text-foreground">Bremen-Walle</p>
                <p className="text-muted-foreground">Bayernstr. 172 · 28219 Bremen</p>
                <p className="text-sm mt-1">0421 39 17 14 · info@rotek.de</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">Verden</p>
                <p className="text-muted-foreground">Conrad-Wode-Straße 1 · 27283 Verden</p>
                <p className="text-sm mt-1">04231 98 2435 · verden@rotek.de</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer onCtaClick={() => setIsModalOpen(true)} />
      <JoinModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  )
}
