'use client'

import { useLanguage } from '@/app/context/language-context'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Magnetic } from '@/components/ui/magnetic'
import { Check, Wrench, Timer, HardHat } from 'lucide-react'
import { cn } from '@/lib/utils'

const plans = [
  {
    id: 'basic',
    nameKey: 'pricing.basic',
    price: 99,
    icon: Wrench,
    featuresEn: [
      'Standard response (2-4h)',
      'Basic visuals check',
      'Email documentation',
      '1-year parts warranty',
      'Leak detection sensor'
    ],
    featuresDe: [
      'Standard-Reaktion (2-4h)',
      'Basis-Visual-Check',
      'E-Mail-Dokumentation',
      '1 Jahr Teile-Garantie',
      'Leckage-Sensor inklusive'
    ],
    descEn: 'Essential coverage for common household maintenance.',
    descDe: 'Grundlegende Absicherung für gängige Haushaltsprobleme.',
    popular: false
  },
  {
    id: 'standard',
    nameKey: 'pricing.standard',
    price: 199,
    icon: Timer,
    featuresEn: [
      'Priority response (< 1h)',
      'Advanced master check',
      '24/7 Hotline access',
      '3-year parts warranty',
      'Annual system tune-up',
      'Priority scheduling'
    ],
    featuresDe: [
      'Prioritäts-Reaktion (< 1h)',
      'Erweiterter Meister-Check',
      '24/7 Hotline-Zugang',
      '3 Jahre Teile-Garantie',
      'Jährliche Systemwartung',
      'Bevorzugte Terminierung'
    ],
    descEn: 'The preferred choice for families and busy households.',
    descDe: 'Die bevorzugte Wahl für Familien und vielbeschäftigte Haushalte.',
    popular: true
  },
  {
    id: 'premium',
    nameKey: 'pricing.premium',
    price: 399,
    icon: HardHat,
    featuresEn: [
      'Emergency priority (< 30m)',
      'Deep diagnostic + Video',
      'Dedicated Specialist',
      'Lifetime parts warranty',
      'Monthly maintenance',
      'Zero call-out fees'
    ],
    featuresDe: [
      'Notfall-Priorität (< 30m)',
      'Tiefendiagnose + Video',
      'Eigener Ansprechpartner',
      'Lebenslange Teile-Garantie',
      'Monatliche Prävention',
      'Keine Anfahrtskosten'
    ],
    descEn: 'Total peace of mind with 24/7 elite protection.',
    descDe: 'Rundum sorgenfrei mit 24/7 Elite-Schutz.',
    popular: false
  }
]

interface PricingSectionProps {
  onCtaClick: () => void
}

export function PricingSection({ onCtaClick }: PricingSectionProps) {
  const { language, t } = useLanguage()

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  } as any

  const item = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  } as any

  return (
    <section id="pricing" className="py-32 px-4 relative overflow-hidden bg-background">
      <div className="absolute inset-0 mesh-gradient opacity-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <h2 className="text-5xl sm:text-7xl font-black text-foreground mb-8 tracking-tighter italic uppercase">
            {t('pricing.title')}
          </h2>
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed italic">
            {t('pricing.subtitle')}
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 items-stretch"
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              variants={item as any}
              className={cn(
                "relative group flex flex-col p-8 lg:p-10 rounded-[3.5rem] transition-all duration-500",
                plan.popular
                  ? "bg-primary border-4 border-secondary text-primary-foreground shadow-2xl scale-105 z-20"
                  : "bg-white/50 backdrop-blur-xl border border-white/60 text-foreground"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-6 py-2 bg-secondary text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-xl">
                  {t('pricing.popular')}
                </div>
              )}

              <div className="mb-10 flex flex-col items-center flex-grow-0">
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center mb-6",
                  plan.popular ? "bg-white/10" : "bg-primary/5"
                )}>
                  <plan.icon className={cn("w-8 h-8", plan.popular ? "text-secondary" : "text-primary")} />
                </div>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-4">
                  {t(plan.nameKey)}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-xs font-black uppercase tracking-widest opacity-50">EUR</span>
                  <span className="text-6xl font-black italic tracking-tighter leading-none">{plan.price}</span>
                  <span className={cn(
                    "text-xs font-black uppercase tracking-widest",
                    plan.popular ? "text-white/60" : "text-muted-foreground"
                  )}>/ {t('pricing.month')}</span>
                </div>
                <p className={cn(
                  "text-sm font-medium italic mt-6 text-center leading-relaxed",
                  plan.popular ? "text-white/80" : "text-muted-foreground"
                )}>
                  {language === 'de' ? plan.descDe : plan.descEn}
                </p>
              </div>

              <div className={cn(
                "h-px w-full my-8 border-0",
                plan.popular ? "bg-white/20" : "bg-border/50"
              )} />

              <ul className="space-y-4 mb-12 flex-grow">
                {(language === 'de' ? plan.featuresDe : plan.featuresEn).map((feature, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                      plan.popular ? "bg-secondary" : "bg-success/10"
                    )}>
                      <Check className={cn("w-3 h-3 text-white", !plan.popular && "text-success")} strokeWidth={4} />
                    </div>
                    <span className="text-sm font-bold tracking-tight opacity-90 leading-tight">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <Magnetic strength={0.2} className="w-full">
                  <Button
                    onClick={onCtaClick}
                    className={cn(
                      "w-full h-18 py-8 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 group relative overflow-hidden",
                      plan.popular
                        ? "bg-secondary text-white hover:bg-secondary/90 shadow-secondary/20 font-black"
                        : "bg-primary text-primary-foreground font-black"
                    )}
                  >
                    <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    <span className="relative z-10">{t('pricing.cta')}</span>
                  </Button>
                </Magnetic>
              </div>
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-32 p-12 glass-card rounded-[4rem] border-secondary/20 relative overflow-hidden"
        >
          <div className="text-center mb-16">
            <h3 className="text-3xl font-black italic uppercase tracking-tighter text-foreground mb-4">
              {language === 'de' ? 'Warum Rohr-Blitz?' : 'Why Rohr-Blitz?'}
            </h3>
            <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">
              {language === 'de' ? 'Der Vergleich zum traditionellen Notdienst' : 'Comparison vs. Traditional Emergency Services'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6 opacity-60">
               <h4 className="text-lg font-black uppercase tracking-widest text-slate-500 mb-8 border-b border-slate-200 pb-4">Traditional Services</h4>
               {[
                 'Hidden diagnostic fees',
                 'Multiple trips for parts',
                 'Surprise labor markups',
                 'Unverified technicians',
                 'Weak or no warranty'
               ].map((f, i) => (
                 <div key={i} className="flex items-center gap-4 text-sm font-bold text-slate-400">
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                    {f}
                 </div>
               ))}
            </div>

            <div className="space-y-6 relative">
               <div className="absolute -inset-6 bg-secondary/5 rounded-3xl -z-10 border border-secondary/20" />
               <h4 className="text-lg font-black uppercase tracking-widest text-secondary mb-8 border-b border-secondary/20 pb-4">Rohr-Blitz Elite</h4>
               {[
                 'Fixed-Price Price Protection',
                 'Single-Visit Resolution',
                 'Verified Master Technicians',
                 '24/7 Digital Site Survey',
                 '2-Year Workmanship Guarantee'
               ].map((f, i) => (
                 <div key={i} className="flex items-center gap-4 text-sm font-bold text-foreground">
                    <Check className="w-4 h-4 text-secondary" />
                    {f}
                 </div>
               ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
