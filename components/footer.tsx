'use client'

import { useLanguage } from '@/app/context/language-context'
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface FooterProps {
  onCtaClick: () => void
}

export function Footer({ onCtaClick }: FooterProps) {
  const { language } = useLanguage()

  return (
    <footer className="bg-card/50 border-t border-border/50">
      <div className="py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto border border-border/50 rounded-2xl p-8 bg-background/50"
        >
          <h2 className="text-xl font-extrabold tracking-tight text-foreground mb-2">
            {language === 'de' ? 'Betriebsdaten' : 'Company'}
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            {language === 'de'
              ? 'Seit 1972. 32 Mitarbeitende. 11 Spezial-Fahrzeuge. Bremen-Walle & Verden.'
              : 'Since 1972. 32 staff. 11 specialist vehicles. Bremen-Walle & Verden.'}
          </p>
          <Button
            onClick={onCtaClick}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-11 px-5 rounded-xl"
          >
            <span className="flex items-center gap-2">
              {language === 'de' ? 'Anfrage senden' : 'Send inquiry'}
              <ArrowRight className="w-4 h-4" />
            </span>
          </Button>
        </motion.div>
      </div>

      <div className="py-10 px-4 border-t border-border/50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-4">
              Büro Bremen
            </h3>
            <p className="text-sm font-semibold text-foreground">Bayernstr. 172</p>
            <p className="text-sm text-muted-foreground">28219 Bremen-Walle</p>
            <a
              href="tel:+49421391714"
              className="mt-2 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <Phone className="w-4 h-4" /> 0421 39 17 14
            </a>
            <a
              href="mailto:info@rotek.de"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <Mail className="w-4 h-4" /> info@rotek.de
            </a>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-4">
              Büro Verden
            </h3>
            <p className="text-sm font-semibold text-foreground">Conrad-Wode-Straße 1</p>
            <p className="text-sm text-muted-foreground">27283 Verden</p>
            <a
              href="tel:+494231982435"
              className="mt-2 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <Phone className="w-4 h-4" /> 04231 98 2435
            </a>
            <a
              href="mailto:verden@rotek.de"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <Mail className="w-4 h-4" /> verden@rotek.de
            </a>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-4">
              {language === 'de' ? 'Rechtliches' : 'Legal'}
            </h3>
            <div className="space-y-2">
              <Link href="/impressum" className="block text-sm text-muted-foreground hover:text-foreground">
                Impressum
              </Link>
              <Link href="/datenschutz" className="block text-sm text-muted-foreground hover:text-foreground">
                Datenschutz
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="py-6 px-4 border-t border-border/50">
        <div className="max-w-6xl mx-auto text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          © {new Date().getFullYear()} Rotek Rohrreinigungsdienst GmbH
        </div>
      </div>
    </footer>
  )
}
