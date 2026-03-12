'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/app/context/language-context'
import { Award, ShieldCheck, GraduationCap, Microscope } from 'lucide-react'
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
    <section className="py-32 px-4 relative overflow-hidden bg-background">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          {/* Left: Authority Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 text-secondary text-xs font-black rounded-xl uppercase tracking-[0.2em]">
                <ShieldCheck className="w-4 h-4" />
                {language === 'de' ? 'Verifizierte E-E-A-T Exzellenz' : 'Verified E-E-A-T Excellence'}
              </span>
              <h2 className="text-4xl sm:text-6xl font-black text-foreground tracking-tighter italic uppercase leading-[1.1]">
                {language === 'de' ? 'Meisterhafte Präzision.' : 'Master Level Precision.'} <br />
                <span className="text-secondary underline decoration-8 underline-offset-8 decoration-secondary/30">
                  {language === 'de' ? 'Echte Experten.' : 'Real Human Experts.'}
                </span>
              </h2>
            </div>

            <p className="text-xl text-muted-foreground font-medium leading-relaxed italic">
              {language === 'de'
                ? 'Hinter unseren digitalen Werkzeugen stehen echte deutsche Handwerksmeister. Jede Diagnose wird von zertifizierten Experten validiert, um höchste Sicherheit und Qualität zu garantieren.'
                : 'Behind our digital diagnostic tools stand real German Master Craftsmen. Every diagnosis is validated by certified experts to guarantee the highest safety and quality standards.'}
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { icon: Award, labelDe: 'Zertifizierter Meisterbetrieb', labelEn: 'Certified Master Business' },
                { icon: GraduationCap, labelDe: 'Regulierte Qualifikationen', labelEn: 'Regulated Qualifications' },
                { icon: Microscope, labelDe: 'Präzisions-Diagnostik', labelEn: 'Precision Diagnostics' },
                { icon: ShieldCheck, labelDe: 'Haftungs-Garantie', labelEn: 'Liability Guaranteed' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-card/30 p-4 rounded-2xl border border-white/40">
                  <item.icon className="w-5 h-5 text-secondary" />
                  <span className="text-xs font-black uppercase tracking-wider">{language === 'de' ? item.labelDe : item.labelEn}</span>
                </div>
              ))}
            </div>

            <div className="pt-8">
              <Image
                src="/certification-seal.png"
                alt="Certification Seal"
                width={120}
                height={120}
                className="opacity-80 grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </motion.div>

          {/* Right: Expert Profiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 relative">
            <div className="absolute inset-0 bg-secondary/5 blur-[120px] rounded-full" />

            {experts.map((expert, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-[3rem] border-4 border-white/60 shadow-2xl transition-all duration-700 group-hover:scale-[1.02]">
                  <Image
                    src={expert.image}
                    alt={expert.name}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                  <div className="absolute bottom-8 left-8 right-8">
                    <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-1">{expert.name}</h4>
                    <p className="text-secondary font-black text-[10px] uppercase tracking-[0.2em] mb-4">
                      {language === 'de' ? expert.roleDe : expert.roleEn}
                    </p>
                    <div className="h-px w-12 bg-white/30 mb-4 transition-all group-hover:w-full" />
                    <p className="text-white/80 text-xs font-bold italic">{language === 'de' ? expert.expDe : expert.expEn}</p>
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
