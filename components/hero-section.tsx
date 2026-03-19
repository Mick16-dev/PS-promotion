'use client'

import { Phone, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/app/context/language-context'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function HeroSection({ onCtaClick }: { onCtaClick: () => void }) {
  const { language } = useLanguage()

  return (
    <section className="relative pt-24 pb-16 px-4 min-h-[50vh] flex flex-col justify-center bg-background border-b border-border/50">
      <div className="max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-8"
        >
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-muted-foreground">
            {language === 'de' ? 'Seit 1972 Fachbetrieb für Kanalreinigung' : 'Since 1972 · Sewer & pipe specialist'}
          </p>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight max-w-2xl leading-[1.1]">
            {language === 'de' ? (
              <>
                Abfluss verstopft?
                <br />
                <span className="text-primary">24-Stunden Notdienst</span>
              </>
            ) : (
              <>
                Blocked drain?
                <br />
                <span className="text-primary">24-hour emergency service</span>
              </>
            )}
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
            {language === 'de'
              ? 'Alles rund ums Rohr: Reinigung, Untersuchung, Wartung und Sanierung. Bremen, Verden und Umzu. Eigene Fahrzeugflotte. Keine Subunternehmer.'
              : 'End-to-end pipe and sewer services. Bremen, Verden and surroundings. Own fleet. No subcontractors.'}
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-4">
            <a
              href="tel:+49421391714"
              className="inline-flex items-center gap-3 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-12 px-6 rounded-xl transition-colors"
            >
              <Phone className="w-5 h-5" />
              0421 391714
            </a>
            <Button
              variant="outline"
              onClick={onCtaClick}
              className="h-12 px-6 rounded-xl font-semibold border-border/60 hover:border-primary/50"
            >
              <span className="flex items-center gap-2">
                {language === 'de' ? 'Anfrage senden' : 'Send inquiry'}
                <ArrowRight className="w-4 h-4" />
              </span>
            </Button>
          </div>

          <div className="flex flex-wrap gap-6 pt-4 text-sm text-muted-foreground">
            <span className="font-semibold">32 Mitarbeitende</span>
            <span>·</span>
            <span className="font-semibold">11 Spezial-Fahrzeuge</span>
            <span>·</span>
            <span className="font-semibold">Bremen-Walle · Verden</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
