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
  Search
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface FeaturesSectionProps {
  onCtaClick: () => void
}

const pillars = [
  {
    id: 'expert-diagnosis',
    icon: Search,
    color: 'text-secondary',
    bg: 'bg-secondary/10',
    border: 'border-secondary/20'
  },
  {
    id: 'time-cost',
    icon: PiggyBank,
    color: 'text-success',
    bg: 'bg-success/10',
    border: 'border-success/20'
  },
  {
    id: 'reliability',
    icon: Shield,
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/20'
  },
]

const diagnosisSteps = [
  { icon: Camera, step: 1 },
  { icon: Search, step: 2 },
  { icon: FileText, step: 3 },
  { icon: Wrench, step: 4 },
]

export function FeaturesSection({ onCtaClick }: FeaturesSectionProps) {
  const { t } = useLanguage()
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
    <section className="py-16 sm:py-20 px-4 relative overflow-hidden bg-background">
      <div className="absolute inset-0 mesh-gradient opacity-30" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          {/* Badge removed to avoid AI/Badge vibe */}
          <h2 className="text-2xl sm:text-4xl font-bold text-foreground mb-4 tracking-tight uppercase">
            {t('features.title')}
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto font-medium leading-relaxed">
            {t('features.subtitle')}
          </p>
        </motion.div>

        {/* Pillar Selection Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-5 mb-12"
        >
          {pillars.map((pillar) => (
            <motion.div
              key={pillar.id}
              variants={item}
              whileHover={{ y: -10 }}
              onClick={() => setActivePillar(pillar.id)}
              className={cn(
                "group cursor-pointer p-5 rounded-xl border transition-all duration-300",
                activePillar === pillar.id
                  ? cn("bg-white shadow-md", pillar.border)
                  : "bg-card/30 border-border/50 hover:bg-white/50"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all",
                activePillar === pillar.id ? pillar.bg : "bg-muted/50"
              )}>
                <pillar.icon className={cn("w-5 h-5", activePillar === pillar.id ? pillar.color : "text-muted-foreground")} />
              </div>

              <h3 className="text-base font-bold text-foreground mb-2 uppercase tracking-tight">
                {t(`features.${pillar.id}.title`)}
              </h3>

              <p className="text-xs text-muted-foreground font-medium mb-4 leading-relaxed">
                {t(`features.${pillar.id}.tagline`)}
              </p>

              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-secondary group-hover:gap-4 transition-all">
                {t('features.learnMore')} <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Feature Deep Dive - Glass Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePillar}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-white rounded-2xl p-6 lg:p-10 border border-slate-200 shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />

            <div className="grid lg:grid-cols-2 gap-10 items-center">
              {/* Left Side: Detail & Timeline */}
              <div className="space-y-12">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center">
                      <Wrench className="w-6 h-6 text-secondary" />
                    </div>
                    <h3 className="text-3xl font-black italic uppercase tracking-tighter text-foreground">
                      {t(`features.${activePillar}.title`)}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed">
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
                      className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100"
                    >
                      <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{t(`features.${activePillar}.benefit${i}`)}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right Side: Timeline/Steps */}
              <div className="bg-primary rounded-xl p-6 lg:p-8 shadow-lg relative">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-secondary rounded-full blur-3xl opacity-30 group-hover:opacity-60 transition-opacity" />

                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                  <Timer className="w-4 h-4 text-secondary" />
                  {t('features.howItWorks')}
                </h4>

                <div className="space-y-5 relative">
                  <div className="absolute left-4 top-6 bottom-6 w-px bg-white/20" />

                  {diagnosisSteps.map((step, idx) => (
                    <motion.div
                      key={step.step}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.15 }}
                      className="flex gap-4 relative z-10"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                        <step.icon className="w-3.5 h-3.5 text-secondary" />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-secondary uppercase tracking-widest mb-0.5">{t('features.step')} {step.step}</p>
                        <h5 className="text-sm font-bold text-white mb-0.5">{t(`features.masterDeepDive.step${step.step}.title`)}</h5>
                        <p className="text-[11px] text-white/60 leading-relaxed">{t(`features.masterDeepDive.step${step.step}.desc`)}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                  <Button
                    onClick={onCtaClick}
                    className="w-full mt-6 bg-secondary text-white hover:bg-secondary/90 font-bold uppercase tracking-wider py-5 rounded-lg text-xs transition-all active:scale-95"
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
