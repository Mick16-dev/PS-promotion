'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/app/context/language-context'
import { HardHat, Wrench, DraftingCompass, ClipboardCheck } from 'lucide-react'
import Image from 'next/image'

const experts = [
  {
    name: 'Hans Weber',
    roleEn: 'Master Plumber (Meister)',
    roleDe: 'Sanitär-Meister',
    image: '/master-1.png',
    expEn: '22 Years of technical mastery',
    expDe: '22 Jahre technische Perfektion',
  },
  {
    name: 'Elena Schmidt',
    roleEn: 'Lead Technical Diagnostic',
    roleDe: 'Leitende Diagnosetechnikerin',
    image: '/master-2.png',
    expEn: '15 Years expert engineering',
    expDe: '15 Jahre Ingenieurs-Expertise',
  }
]

export function MasterExpertSection() {
  const { language, t } = useLanguage()

  return (
    <section className="py-24 px-4 relative overflow-hidden bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Authority Text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 tracking-tight uppercase leading-tight">
                {language === 'de' ? 'Meisterhafte Präzision.' : 'Professional Level Precision.'}
              </h2>
            </div>

            <p className="text-lg text-slate-600 font-medium leading-relaxed">
              {language === 'de'
                ? 'Hinter unseren technischen Werkzeugen stehen deutsche Handwerksmeister. Jede Einschätzung wird von zertifizierten Experten validiert, um höchste Sicherheit und Qualität zu garantieren.'
                : 'Behind our technical tools stand German Master Craftsmen. Every assessment is validated by certified experts to guarantee the highest safety and quality standards.'}
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: HardHat, labelDe: 'Zertifizierter Meisterbetrieb', labelEn: 'Certified Master Business' },
                { icon: Wrench, labelDe: 'Regulierte Qualifikationen', labelEn: 'Regulated Qualifications' },
                { icon: DraftingCompass, labelDe: 'Präzisions-Diagnostik', labelEn: 'Precision Assessment' },
                { icon: ClipboardCheck, labelDe: 'Haftungs-Garantie', labelEn: 'Liability Guaranteed' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <item.icon className="w-5 h-5 text-red-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-900">{language === 'de' ? item.labelDe : item.labelEn}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Expert Profiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
            {experts.map((expert, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-slate-200 shadow-sm transition-all duration-500 group-hover:shadow-md">
                  <Image
                    src={expert.image}
                    alt={expert.name}
                    fill
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-80" />

                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <h4 className="text-xl font-bold uppercase tracking-tight mb-0.5">{expert.name}</h4>
                    <p className="text-slate-300 font-bold text-[10px] uppercase tracking-wider mb-3">
                      {language === 'de' ? expert.roleDe : expert.roleEn}
                    </p>
                    <p className="text-white/80 text-xs font-medium">{language === 'de' ? expert.expDe : expert.expEn}</p>
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
