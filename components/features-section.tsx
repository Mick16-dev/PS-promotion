'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/app/context/language-context'
import { Button } from '@/components/ui/button'
import { Magnetic } from '@/components/ui/magnetic'
import {
  PiggyBank,
  Shield,
  Wrench,
  CheckCircle2,
  Camera,
  FileText,
  Timer,
  ArrowRight,
  Search,
  Activity
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface FeaturesSectionProps {
  onCtaClick: () => void
}

const pillars = [
  {
    id: 'expert-diagnosis',
    icon: Search,
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20'
  },
  {
    id: 'time-cost',
    icon: Timer,
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20'
  },
  {
    id: 'reliability',
    icon: Shield,
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20'
  },
]

const diagnosisSteps = [
  { icon: Camera, step: 1 },
  { icon: Activity, step: 2 },
  { icon: FileText, step: 3 },
  { icon: Wrench, step: 4 },
]

export function FeaturesSection({ onCtaClick }: FeaturesSectionProps) {
  const { t, language } = useLanguage()
  const [activePillar, setActivePillar] = useState<string>('expert-diagnosis')

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  } as any

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  } as any

  return (
    <section className="py-32 px-4 relative overflow-hidden bg-[#0A0B0D]">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-white/5" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-left mb-24 border-l-8 border-red-600 pl-8"
        >
          <h2 className="text-4xl sm:text-6xl font-black text-white mb-6 tracking-tighter uppercase italic leading-none">
            {t('features.title')}
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl font-medium italic">
            {t('features.subtitle')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {pillars.map((pillar) => (
            <motion.div
              key={pillar.id}
              onClick={() => setActivePillar(pillar.id)}
              className={cn(
                "group cursor-pointer p-10 rounded-none border transition-all duration-500",
                activePillar === pillar.id
                  ? "bg-white/[0.03] border-red-600 shadow-2xl"
                  : "bg-white/[0.01] border-white/10 hover:border-white/20"
              )}
            >
              <div className={cn(
                "w-16 h-16 rounded-none flex items-center justify-center mb-8 border transition-all duration-500",
                activePillar === pillar.id ? "bg-red-600 border-red-600 text-white" : "bg-white/5 border-white/10 text-slate-500"
              )}>
                <pillar.icon className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-black text-white mb-4 uppercase tracking-tight italic">
                {t(`features.${pillar.id}.title`)}
              </h3>

              <p className="text-sm text-slate-400 font-medium mb-8 leading-relaxed italic">
                {t(`features.${pillar.id}.tagline`)}
              </p>

              <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-red-600 group-hover:translate-x-2 transition-transform">
                {t('features.learnMore')} <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activePillar}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-white/[0.01] border border-white/10 p-10 lg:p-20 rounded-none relative overflow-hidden"
          >
            <div className="absolute inset-0 blueprint-grid opacity-10 pointer-events-none" />

            <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10">
              <div className="space-y-12">
                <div className="space-y-8">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-red-600/10 border border-red-600/30 rounded-none flex items-center justify-center">
                      <Wrench className="w-10 h-10 text-red-600" />
                    </div>
                    <h3 className="text-4xl sm:text-5xl font-black italic uppercase tracking-tighter text-white leading-none">
                      {t(`features.${activePillar}.title`)}
                    </h3>
                  </div>
                  <p className="text-lg text-slate-400 font-medium leading-relaxed italic border-l-4 border-white/10 pl-6">
                    {t(`features.${activePillar}.solution`)}
                  </p>
                </div>

                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-4 bg-white/[0.02] p-5 border border-white/5"
                    >
                      <CheckCircle2 className="w-5 h-5 text-red-600 shrink-0" />
                      <span className="text-sm font-black uppercase tracking-widest text-white italic">{t(`features.${activePillar}.benefit${i}`)}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="bg-[#0A0B0D] border border-white/10 p-10 lg:p-14 rounded-none shadow-3xl relative">
                <div className="absolute top-0 right-0 w-48 h-48 bg-red-600/5 blur-3xl rounded-none pointer-events-none" />

                <h4 className="text-xs font-black text-red-600 uppercase tracking-[0.4em] mb-10 flex items-center gap-4">
                  <Timer className="w-4 h-4" />
                  {t('features.howItWorks')}
                </h4>

                <div className="space-y-8 relative">
                  <div className="absolute left-4 top-10 bottom-10 w-px bg-white/10 border-r border-dashed border-white/5" />

                  {diagnosisSteps.map((step, idx) => (
                    <motion.div
                      key={step.step}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.15 }}
                      className="flex gap-8 relative z-10"
                    >
                      <div className="w-10 h-10 rounded-none bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:border-red-600 transition-colors">
                        <step.icon className="w-4 h-4 text-red-600" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">{t('features.step')} 0{step.step}</p>
                        <h5 className="text-lg font-black text-white mb-2 uppercase italic tracking-tight">{t(`features.masterDeepDive.step${step.step}.title`)}</h5>
                        <p className="text-sm text-slate-500 leading-relaxed font-medium italic">{t(`features.masterDeepDive.step${step.step}.desc`)}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <Button
                  onClick={onCtaClick}
                  className="w-full mt-12 bg-red-600 text-white hover:bg-red-700 font-black uppercase tracking-[0.2em] h-20 rounded-none border-b-4 border-r-4 border-red-900 shadow-2xl transition-all active:translate-y-1 active:border-b-0 text-sm"
                >
                  {t('features.cta')}
                </Button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
