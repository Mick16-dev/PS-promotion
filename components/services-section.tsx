'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/app/context/language-context'
import { Button } from '@/components/ui/button'
import { ArrowRight, Camera, Search, FileText, Wrench, Timer } from 'lucide-react'
import Link from 'next/link'
import { services } from '@/lib/services-data'

const diagnosisSteps = [
  { icon: Camera, step: 1 },
  { icon: Search, step: 2 },
  { icon: FileText, step: 3 },
  { icon: Wrench, step: 4 },
]

interface ServicesSectionProps {
  onCtaClick: () => void
}

import { LumnarGrid } from '@/components/lumnar-grid'

export function ServicesSection({ onCtaClick }: ServicesSectionProps) {
  const { language, t } = useLanguage()

  return (
    <section id="services" className="py-14 sm:py-24 px-4 relative overflow-hidden bg-[#0A0B0D]">
      {/* Absolute Industrial Overlays */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            {language === 'de' ? 'INDUSTRIELLE PRÄZISION SEIT 1972' : 'INDUSTRIAL PRECISION SINCE 1972'}
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-6 uppercase tracking-tighter italic">
            {language === 'de' ? 'Rotek Lumnar-Serie' : 'Rotek Lumnar Series'}
          </h2>
          <p className="text-sm sm:text-lg text-slate-400 max-w-2xl mx-auto tracking-normal font-medium leading-relaxed">
            {language === 'de' ? 'Der Goldstandard für Abwasser- & Rohrsystemtechnik in Bremen, Verden und Umzu.' : 'The gold standard for wastewater and pipe engineering in Bremen, Verden, and surroundings.'}
          </p>
        </motion.div>

        <LumnarGrid />

        <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-8 p-8 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm">
          <div className="flex-1">
            <h4 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">
              {language === 'de' ? 'Digitaler Meister-Check' : 'Digital Master Check'}
            </h4>
            <p className="text-sm text-slate-400">
              {language === 'de' ? 'Starten Sie den "Rotek Master Visual Service" für eine technische Ferndiagnose Ihres Rohrproblems.' : 'Activate the "Rotek Master Visual Service" for a technical remote diagnosis of your pipe disruption.'}
            </p>
          </div>
          <div className="shrink-0 flex gap-4">
             <Button
              onClick={onCtaClick}
              size="lg"
              className="bg-red-600 text-white hover:bg-red-700 font-black uppercase tracking-widest px-8 rounded-none border-r-4 border-b-4 border-red-900 shadow-xl transition-all active:translate-y-1 active:border-b-0"
            >
              {language === 'de' ? 'Diagnose Protokoll' : 'Diagnostic Protocol'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
