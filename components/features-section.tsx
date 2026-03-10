'use client'

import { useState } from 'react'
import Link from 'next/link'
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
  ShieldCheck,
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
    <section className="py-32 px-4 relative overflow-hidden bg-background">

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-xs font-black rounded-xl uppercase tracking-[0.2em] mb-6">
            <ShieldCheck className="w-4 h-4" />
            {t('features.badge')}
          </span>
          <h2 className="text-4xl sm:text-6xl font-black text-foreground mb-6 tracking-tighter italic uppercase">
            {t('features.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
            {t('features.subtitle')}
          </p>
        </motion.div>

        {/* Pillar Selection Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 mb-24"
        >
          {pillars.map((pillar) => (
            <motion.div
              key={pillar.id}
              variants={item}
              whileHover={{ y: -10 }}
              onClick={() => setActivePillar(pillar.id)}
              className={cn(
                "group cursor-pointer p-8 rounded-[2.5rem] border-2 transition-all duration-500",
                activePillar === pillar.id
                  ? cn("bg-white shadow-2xl scale-[1.02]", pillar.border)
                  : "bg-card/30 border-border/50 hover:bg-white/50"
              )}
            >
              <div
                className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-xl",
                  activePillar === pillar.id ? pillar.bg : "bg-muted/50"
                )}
              >
                <pillar.icon className={cn("w-8 h-8", activePillar === pillar.id ? pillar.color : "text-muted-foreground")} />
              </div>

              <h3 className="text-2xl font-black text-foreground mb-4 italic uppercase tracking-tighter">
                {t(`features.${pillar.id}.title`)}
              </h3>

              <p className="text-muted-foreground font-medium mb-8 leading-relaxed">
                {t(`features.${pillar.id}.tagline`)}
              </p>

              <Link
                href="/team"
                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-secondary hover:text-secondary/80 transition-colors"
              >
                {t('features.learnMore')} <ArrowRight className="w-4 h-4" />
              </Link>
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
            className="glass-card rounded-[3rem] p-8 lg:p-20 border-white/40 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />

            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
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
                  <p className="text-xl text-muted-foreground font-medium leading-relaxed italic">
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
                      className="flex items-center gap-4 bg-white/40 backdrop-blur-md p-5 rounded-2xl border border-white/20 shadow-sm"
                    >
                      <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-success" />
                      </div>
                      <span className="font-bold text-foreground tracking-tight">{t(`features.${activePillar}.benefit${i}`)}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right Side: Timeline/Steps */}
              <div className="bg-primary rounded-[2.5rem] p-10 lg:p-14 shadow-2xl shadow-primary/20 relative group">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-secondary rounded-full blur-3xl opacity-30 group-hover:opacity-60 transition-opacity" />

                <h4 className="text-xl font-black text-white italic uppercase tracking-widest mb-12 flex items-center gap-3">
                  <Timer className="w-6 h-6 text-secondary animate-pulse" />
                  {t('features.howItWorks')}
                </h4>

                <div className="space-y-10 relative">
                  <div className="absolute left-6 top-10 bottom-10 w-px bg-white/20" />

                  {diagnosisSteps.map((step, idx) => (
                    <motion.div
                      key={step.step}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.15 }}
                      className="flex gap-8 relative z-10"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 ring-4 ring-primary border border-white/20 group-hover:scale-110 transition-transform">
                        <step.icon className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-secondary uppercase tracking-[0.2em] mb-1">Step {step.step}</p>
                        <h5 className="text-lg font-bold text-white mb-1 tracking-tight">{t(`features.masterDeepDive.step${step.step}.title`)}</h5>
                        <p className="text-sm text-white/60 font-medium leading-relaxed">{t(`features.masterDeepDive.step${step.step}.desc`)}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <Magnetic strength={0.2} className="w-full">
                  <Button
                    onClick={onCtaClick}
                    className="w-full mt-12 bg-secondary text-white hover:bg-secondary/90 font-black uppercase tracking-[0.2em] py-8 rounded-2xl text-lg shadow-xl shadow-secondary/20 transition-all active:scale-95"
                  >
                    {t('features.cta')}
                  </Button>
                </Magnetic>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
