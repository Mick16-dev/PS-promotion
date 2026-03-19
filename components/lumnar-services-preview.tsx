'use client'

import { useLanguage } from '@/app/context/language-context'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { LumnarGrid } from '@/components/lumnar/LumnarGrid'

interface LumnarServicesPreviewProps {
  onCtaClick: () => void
}

export function LumnarServicesPreview({ onCtaClick }: LumnarServicesPreviewProps) {
  const { language } = useLanguage()

  return (
    <section className="py-16 px-4 border-b border-border/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-2">
            {language === 'de' ? 'Lumnar-Serie' : 'Lumnar Series'}
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {language === 'de' ? 'Unsere Leistungen' : 'Our Services'}
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            {language === 'de'
              ? 'Alles rund ums Rohr: Reinigung, Untersuchung, Wartung und Sanierung.'
              : 'Everything for pipes: cleaning, inspection, maintenance and renovation.'}
          </p>
        </motion.div>

        <LumnarGrid />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 flex justify-center"
        >
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            {language === 'de' ? 'Alle Leistungen anzeigen' : 'View all services'}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
