'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/app/context/language-context'
import { Button } from '@/components/ui/button'
import { Magnetic } from '@/components/ui/magnetic'
import { 
  ArrowRight, 
  MoveHorizontal,
  Camera,
  Search,
  FileText,
  Wrench,
  Timer
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'


const services = [
  {
    id: 'leaking-pipe-repair',
    image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800&h=600&fit=crop',
    titleEn: 'Leaking Pipe Repair',
    titleDe: 'Undichte Rohrreparatur',
    descEn: 'Professional repair of leaking pipes, protecting your property from water damage. We use advanced diagnostic tools to pinpoint the exact location of the leak rapidly.',
    descDe: 'Professionelle Reparatur von undichten Rohren zum Schutz Ihrer Immobilie vor Wasserschäden. Wir nutzen fortschrittliche Diagnosewerkzeuge zur genauen Ortung.'
  },
  {
    id: 'clogged-drain-unclogging',
    image: '/drain-cleaning-overview.png',
    titleEn: 'Drain Unclogging',
    titleDe: 'Abfluss-Entstopfung',
    descEn: 'Comprehensive drain cleaning services using safe, effective motorized snakes and hydro-jetting to remove blockages deep within your plumbing system.',
    descDe: 'Umfassende Abflussreinigung mit sicheren, effektiven motorisierten Spiralen und Hochdruckreinigung zur Entfernung tiefliegender Verstopfungen.'
  },
  {
    id: 'broken-fixture-replacement',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    titleEn: 'Fixture Replacement',
    titleDe: 'Armatur-Austausch',
    descEn: 'Expert installation and replacement of faucets, toilets, showerheads, and other household fixtures. Ensuring perfect seals and optimal water flow.',
    descDe: 'Fachgerechte Installation und Austausch von Wasserhähnen, Toiletten, Duschköpfen und anderen Haushaltsarmaturen. Minimierung von Wasserverlusten.'
  },
  {
    id: 'water-heater-repair',
    image: '/water-heater-overview.png',
    titleEn: 'Water Heater Services',
    titleDe: 'Warmwasserbereiter Reparatur',
    descEn: 'Diagnostic and repair services for all conventional and tankless water heaters. We restore hot water supply efficiently and conduct safety checks.',
    descDe: 'Diagnose und Reparaturservices für herkömmliche und Durchlauferhitzer. Wir stellen die Warmwasserversorgung effizient wieder her.'
  },
  {
    id: 'camera-pipe-inspection',
    image: '/camera-inspection-overview.png',
    titleEn: 'Camera Pipe Inspection',
    titleDe: 'Kamera-Rohrinspektion',
    descEn: 'Non-invasive visual inspection of underground sewer lines and pipes to determine condition, locate roots, or find collapsed sections without digging.',
    descDe: 'Zerstörungsfreie visuelle Inspektion von unterirdischen Kanalisationsleitungen und Rohren zur Zustandsermittlung ohne Grabungen.'
  }
]

const diagnosisSteps = [
  { icon: Camera, step: 1 },
  { icon: Search, step: 2 },
  { icon: FileText, step: 3 },
  { icon: Wrench, step: 4 },
]

interface ServicesSectionProps {
  onCtaClick: () => void
}

export function ServicesSection({ onCtaClick }: ServicesSectionProps) {
  const { language, t } = useLanguage()

  return (
    <section id="services" className="py-24 px-4 relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 mb-6 uppercase tracking-tight">
            {language === 'de' ? 'Unsere Leistungen' : 'Our Services'}
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
            {language === 'de' ? 'Professionelle Sanitär-Lösungen für Notfälle und geplante Modernisierungen.' : 'Professional plumbing solutions for emergencies and planned modernizations.'}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8 space-y-16">
            {services.map((service, idx) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group"
              >
                <div className="grid md:grid-cols-2 gap-8 items-center bg-slate-50 p-6 rounded-2xl border border-slate-100 transition-all hover:shadow-md">
                  <div className="w-full relative aspect-[4/3] rounded-xl overflow-hidden shadow-sm">
                    <img src={service.image} alt={service.titleEn} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-slate-900 uppercase tracking-tight">
                      {language === 'de' ? service.titleDe : service.titleEn}
                    </h3>
                    <p className="text-slate-600 font-medium">
                      {language === 'de' ? service.descDe : service.descEn}
                    </p>
                    <Button variant="link" asChild className="p-0 h-auto text-slate-900 font-bold uppercase tracking-widest text-[10px] hover:no-underline hover:translate-x-1 transition-transform">
                      <Link href={`/services/${service.id}`}>
                        {language === 'de' ? 'Mehr erfahren' : 'Learn More'}
                        <ArrowRight className="ml-2 w-3 h-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-4 sticky top-28"
          >
            <div className="bg-slate-900 rounded-2xl p-8 shadow-xl relative overflow-hidden">
              <h4 className="text-xl font-bold text-white uppercase tracking-wider mb-10 flex items-center gap-3">
                <Timer className="w-6 h-6 text-slate-400" />
                {t('features.howItWorks')}
              </h4>

              <div className="space-y-10 relative">
                <div className="absolute left-5 top-8 bottom-8 w-px bg-slate-800" />

                {diagnosisSteps.map((step, idx) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-6 relative z-10"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                      <step.icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t('features.step')} {step.step}</p>
                      <h5 className="text-lg font-bold text-white mb-1">{t(`features.masterDeepDive.step${step.step}.title`)}</h5>
                      <p className="text-xs text-slate-400 font-medium leading-relaxed">{t(`features.masterDeepDive.step${step.step}.desc`)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Button
                onClick={onCtaClick}
                className="w-full mt-12 bg-white text-slate-900 hover:bg-slate-100 font-bold uppercase tracking-widest py-6 rounded-lg text-sm transition-all"
              >
                <span className="flex items-center justify-center gap-2">
                  {t('features.cta')}
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
