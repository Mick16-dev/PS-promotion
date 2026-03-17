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
                className="group relative"
              >
                <div className="grid md:grid-cols-2 gap-8 items-center bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 transition-all hover:shadow-2xl hover:bg-white overflow-hidden relative">

                  
                  <div className="w-full relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl">
                    <img src={service.image} alt={t(service.titleKey)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                       <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">
                         {t(service.titleKey)}
                       </h3>
                       <div className="flex items-center gap-2">
                          <span className="text-xl font-black text-secondary">€{service.price}</span>
                       </div>
                    </div>

                    <p className="text-slate-600 font-medium leading-relaxed italic border-l-2 border-secondary/20 pl-4">
                      {t(service.descKey)}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 pt-2">
                      <Button asChild className="bg-slate-900 text-white hover:bg-slate-800 font-black uppercase tracking-widest h-12 px-6 rounded-xl shadow-lg transition-all active:scale-95">
                        <Link href={`/services/${service.id}`}>
                          {language === 'de' ? 'Details ansehen' : 'View Details'}
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                      </Button>
                      <Button variant="outline" onClick={onCtaClick} className="border-2 border-slate-200 hover:border-slate-900 hover:bg-transparent font-black uppercase tracking-widest h-12 px-6 rounded-xl transition-all">
                        {language === 'de' ? 'Angebot anfordern' : 'Get Quote'}
                      </Button>
                    </div>
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
