'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/app/context/language-context'
import { DiagnosticFunnel } from '@/components/diagnostic-funnel'

interface HeroSectionProps {
  onCtaClick: () => void
}

export function HeroSection({ onCtaClick }: HeroSectionProps) {
  const { t } = useLanguage()

  return (
    <section
      id="home"
      className="relative pt-32 pb-24 px-4 min-h-screen bg-background overflow-hidden"
    >

      <div className="max-w-6xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        {/* Hero Text */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 text-left lg:max-w-xl"
        >
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="inline-flex items-center px-5 py-2 mb-6 text-xs font-black bg-primary text-primary-foreground rounded-full uppercase tracking-[0.2em] shadow-lg shadow-primary/20"
          >
            {t('hero.badge')}
          </motion.span>

          <h1 className="text-5xl sm:text-6xl font-black text-foreground mb-6 leading-[1.05] tracking-tighter italic uppercase">
            {t('hero.title')}
          </h1>

          <p className="text-xl text-muted-foreground mb-8 leading-relaxed font-medium max-w-lg">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-wrap gap-8">
            <span className="text-sm font-semibold uppercase tracking-[0.25em] text-foreground">
              Verified experts
            </span>
            <span className="text-sm font-semibold uppercase tracking-[0.25em] text-foreground">
              15m response
            </span>
          </div>
        </motion.div>

        {/* Visual diagnostic funnel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex-1 w-full max-w-lg"
        >
          <DiagnosticFunnel onCtaClick={onCtaClick} />
        </motion.div>
      </div>
    </section>
  )
}
