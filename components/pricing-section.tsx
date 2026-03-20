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
    price: 149, // Adjusted for industrial quality
    icon: Wrench,
    featuresEn: [
      'Standard Deployment (2-4h)',
      'Basic TV-Inspection',
      'Electronic Report (PDF)',
      '1-Year Execution Warranty',
      'Small Pipe Cleaning'
    ],
    featuresDe: [
      'Standard-Einsatz (2-4h)',
      'Basis-TV-Untersuchung',
      'Elektronisches Protokoll (PDF)',
      '1 Jahr Ausführungsgarantie',
      'Kleine Rohrreinigung'
    ],
    descEn: 'Essential technical support for localized pipe issues.',
    descDe: 'Grundlegende Unterstützung für lokale Rohrprobleme.',
    popular: false
  },
  {
    id: 'standard',
    nameKey: 'pricing.standard',
    price: 289,
    icon: Timer,
    featuresEn: [
      'Priority Deployment (< 1h)',
      'Full 3D Pipe Mapping',
      'Digital Site Protocol',
      '3-Year Execution Warranty',
      'Hydro-Jetting Included',
      '24/7 Hotline Access'
    ],
    featuresDe: [
      'Prioritäts-Einsatz (< 1h)',
      'Vollständige 3D-Rohrortung',
      'Digitales Einsatzprotokoll',
      '3 Jahre Ausführungsgarantie',
      'Hochdruck-Spülung (HD) inkl.',
      '24/7 Hotline-Zugang'
    ],
    descEn: 'Standard industrial package for residential & commercial.',
    descDe: 'Der industrielle Standard für Privat & Gewerbe.',
    popular: true
  },
  {
    id: 'premium',
    nameKey: 'pricing.premium',
    price: 549,
    icon: HardHat,
    featuresEn: [
      'Emergency Dispatch (< 20m)',
      'Robotic Milling Operations',
      'Dedicated Team Lead',
      'Lifetime Execution Warranty',
      'Complex Root Removal',
      'Sewer Gas Analysis'
    ],
    featuresDe: [
      'Notfall-Soforteinsatz (< 20m)',
      'Robotik-Fräsarbeiten',
      'Eigener Einsatzleiter (Andreas)',
      'Lebenslange Ausführungsgarantie',
      'Komplexe Wurzelschneidung',
      'Kanalgas-Analyse'
    ],
    descEn: 'Maximum precision for complex sewer infrastructure.',
    descDe: 'Maximale Präzision für komplexe Infrastruktur.',
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
    hidden: { opacity: 0, scale: 0.98 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  } as any

  return (
    <section id="pricing" className="py-20 px-4 relative overflow-hidden bg-[#0A0B0D]">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-white/5" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white mb-8 tracking-tighter italic uppercase leading-none">
            {language === 'de' ? 'Kalkulierbare Präzision.' : 'Fixed Scale Precision.'}
          </h2>
          <p className="text-xl sm:text-2xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed italic border-l-4 border-red-600 pl-8 text-left sm:text-center mx-auto">
            {language === 'de' 
               ? 'Transparente Preisgestaltung für zertifizierte Abwasser-Dienstleistungen nach Rotek-Standard.' 
               : 'Transparent pricing for certified wastewater services according to Rotek standards.'}
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
                "relative group flex flex-col p-10 lg:p-12 rounded-none transition-all duration-700",
                plan.popular
                  ? "bg-red-600 text-white shadow-3xl scale-105 z-20 border-b-8 border-red-900"
                  : "bg-white/[0.02] border border-white/10 text-white hover:border-red-600/50"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-8 py-2 bg-white text-red-600 text-[10px] font-black uppercase tracking-[0.4em] rounded-none shadow-xl border-b-4 border-red-900/10 italic">
                  Industrie Standard
                </div>
              )}

              <div className="mb-12 flex flex-col items-center flex-grow-0">
                <div className={cn(
                  "w-20 h-20 rounded-none flex items-center justify-center mb-8 border transition-colors",
                  plan.popular ? "bg-white/10 border-white/20" : "bg-red-600/10 border-red-600/20 group-hover:bg-red-600 group-hover:text-white"
                )}>
                  <plan.icon className={cn("w-10 h-10 transition-colors", plan.popular ? "text-white" : "text-red-600 group-hover:text-white")} />
                </div>
                <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-4">
                  {t(plan.nameKey)}
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black italic tracking-tighter opacity-50 uppercase">EUR</span>
                  <span className="text-8xl font-black italic tracking-tighter leading-none">{plan.price}</span>
                </div>
                <p className={cn(
                  "text-sm font-medium italic mt-8 text-center leading-relaxed",
                  plan.popular ? "text-white/80" : "text-slate-500"
                )}>
                  {language === 'de' ? plan.descDe : plan.descEn}
                </p>
              </div>

              <div className={cn(
                "h-[2px] w-full my-8 border-0",
                plan.popular ? "bg-white/10" : "bg-white/5"
              )} />

              <ul className="space-y-5 mb-14 flex-grow">
                {(language === 'de' ? plan.featuresDe : plan.featuresEn).map((feature, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <Check className={cn("w-5 h-5 mt-0.5", plan.popular ? "text-white" : "text-red-600")} strokeWidth={4} />
                    <span className="text-sm font-black uppercase tracking-tight opacity-95 leading-tight">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <Button
                  onClick={onCtaClick}
                  className={cn(
                    "w-full h-20 rounded-none font-black uppercase tracking-[0.3em] shadow-xl transition-all active:scale-95 group relative overflow-hidden text-xs",
                    plan.popular
                      ? "bg-white text-red-600 hover:bg-white/90 shadow-red-900/40"
                      : "bg-red-600 text-white hover:bg-red-700 border-b-4 border-red-900"
                  )}
                >
                  <span className="relative z-10">{t('pricing.cta')}</span>
                  <div className="absolute inset-0 bg-red-600/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-32 p-12 bg-white/[0.01] border-l-4 border-red-600 text-left relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <HardHat className="w-32 h-32 text-white" />
          </div>
          <h3 className="text-xl font-black italic uppercase tracking-[0.2em] text-white underline decoration-red-600 decoration-4 underline-offset-8 mb-6">
            {language === 'de' ? 'Ihre Sicherheit, unser Auftrag.' : 'Your Safety, Our Mission.'}
          </h3>
          <p className="text-sm text-slate-500 font-medium italic max-w-2xl leading-relaxed">
            {language === 'de' 
               ? 'Alle Preise verstehen sich als verbindliche Festpreise nach technischer Diagnose. Keine versteckten Gebühren, keine Kilometerpauschalen innerhalb von Bremen & Verden. Industrieller Service zum fairen Preis.' 
               : 'All prices are binding fixed prices after technical diagnosis. No hidden fees, no mileage charges within Bremen & Verden. Industrial service at a fair price.'}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
