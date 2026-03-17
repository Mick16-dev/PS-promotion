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

export function ServicesSection({ onCtaClick }: ServicesSectionProps) {
  const { language, t } = useLanguage()

  return (
    <section id="services" className="py-14 sm:py-20 px-4 relative overflow-hidden bg-white">
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 uppercase tracking-tight">
            {language === 'de' ? 'Unsere Leistungen' : 'Our Services'}
          </h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-lg mx-auto">
            {language === 'de' ? 'Professionelle Sanitär-Lösungen für Notfälle und geplante Modernisierungen.' : 'Professional plumbing solutions for emergencies and planned modernizations.'}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Service Cards */}
          <div className="lg:col-span-8 grid sm:grid-cols-2 gap-4">
            {services.map((service, idx) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="group"
              >
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img 
                      src={service.image} 
                      alt={t(service.titleKey)} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md">
                      <span className="text-xs font-bold text-slate-900">€{service.price}</span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-2">
                      {t(service.titleKey)}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4 flex-1">
                      {t(service.descKey)}
                    </p>
                    
                    <div className="flex gap-2">
                      <Button asChild size="sm" className="flex-1 bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold uppercase tracking-wider h-9 rounded-lg">
                        <Link href={`/services/${service.id}`}>
                          {language === 'de' ? 'Details' : 'Details'}
                          <ArrowRight className="ml-1 w-3 h-3" />
                        </Link>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={onCtaClick} 
                        className="text-xs font-bold uppercase tracking-wider h-9 rounded-lg border-slate-200 hover:border-slate-900"
                      >
                        {language === 'de' ? 'Angebot' : 'Quote'}
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* How It Works Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-4 sticky top-24"
          >
            <div className="bg-slate-900 rounded-xl p-6 shadow-lg">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                <Timer className="w-4 h-4 text-slate-400" />
                {t('features.howItWorks')}
              </h4>

              <div className="space-y-5 relative">
                <div className="absolute left-4 top-6 bottom-6 w-px bg-slate-800" />

                {diagnosisSteps.map((step, idx) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex gap-4 relative z-10"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                      <step.icon className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">{t('features.step')} {step.step}</p>
                      <h5 className="text-sm font-bold text-white mb-0.5">{t(`features.masterDeepDive.step${step.step}.title`)}</h5>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{t(`features.masterDeepDive.step${step.step}.desc`)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Button
                onClick={onCtaClick}
                className="w-full mt-8 bg-white text-slate-900 hover:bg-slate-100 font-bold uppercase tracking-wider py-5 rounded-lg text-xs transition-all"
              >
                <span className="flex items-center justify-center gap-2">
                  {t('features.cta')}
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
