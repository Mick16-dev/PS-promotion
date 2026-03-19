'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/app/context/language-context'
import { HardHat, Wrench, DraftingCompass, ClipboardCheck } from 'lucide-react'
import Image from 'next/image'

const experts = [
  {
    name: 'Hans Weber',
    roleEn: 'Master of Pipe Engineering',
    roleDe: 'Meister der Rohrtechnik',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80',
    expEn: 'Chief Operations Bremen',
    expDe: 'Einsatzleitung Bremen',
  },
  {
    name: 'Andreas Schmidt',
    roleEn: 'Lead Diagnostic Officer',
    roleDe: 'Leitender Diagnosetechniker',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80',
    expEn: '3D Mapping Specialist',
    expDe: 'Spezialist für 3D-Ortung',
  }
]

export function MasterExpertSection() {
  const { language, t } = useLanguage()

  return (
    <section className="py-32 px-4 relative overflow-hidden bg-[#0A0B0D]">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-white/5" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left: Authority Text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tighter uppercase leading-none italic">
                {language === 'de' ? 'Ingenieurs-Expertise.' : 'Industrial Engineering.'}
              </h2>
              <p className="text-xl text-red-600 font-black uppercase tracking-[0.3em]">Certified Validation</p>
            </div>

            <p className="text-lg text-slate-400 font-medium leading-relaxed italic border-l-4 border-red-600 pl-8">
              {language === 'de'
                ? 'Hinter jedem Einsatz stehen unsere Einsatzleiter. Jede Diagnose des "Digitaler Meister-Check" wird von unseren Technikern validiert, bevor das Team ausrückt – für 100%ige Präzision.'
                : 'Behind every mission stand our operations leads. Every diagnosis from the "Master Visual Service" is validated by our technicians before the team dispatches – for 100% precision.'}
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { icon: HardHat, labelDe: 'Zertifizierter Meisterbetrieb', labelEn: 'Certified Master Business' },
                { icon: Wrench, labelDe: 'Geprüfte Techniker', labelEn: 'Vetted Technicians' },
                { icon: DraftingCompass, labelDe: 'Präzisions-Kamera-Systeme', labelEn: 'Precision Camera Systems' },
                { icon: ClipboardCheck, labelDe: 'Sielsanierungs-Expertise', labelEn: 'Sewer Renovation Experts' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 bg-white/[0.02] p-6 rounded-none border border-white/10 hover:border-red-600 transition-colors">
                  <item.icon className="w-6 h-6 text-red-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white leading-tight">{language === 'de' ? item.labelDe : item.labelEn}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Expert Profiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 relative">
             <div className="absolute -top-12 -right-12 w-48 h-48 bg-red-600/10 rounded-full blur-3xl" />
            {experts.map((expert, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-none border border-white/10 shadow-3xl transition-all duration-700 hover:border-red-600 border-b-8">
                  <Image
                    src={expert.image}
                    alt={expert.name}
                    fill
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-700 brightness-75 group-hover:brightness-100 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0D] via-transparent to-transparent opacity-90" />

                  <div className="absolute bottom-8 left-8 right-8 text-white">
                    <p className="text-red-500 font-black text-[9px] uppercase tracking-[0.4em] mb-3">
                      {language === 'de' ? expert.roleDe : expert.roleEn}
                    </p>
                    <h4 className="text-2xl font-black uppercase tracking-tighter mb-1 italic">{expert.name}</h4>
                    <p className="text-slate-400 text-xs font-medium italic">{language === 'de' ? expert.expDe : expert.expEn}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
