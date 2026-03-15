'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/app/context/language-context'
import { AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const problems = [
  {
    icon: AlertTriangle,
    problemEn: 'Unexpected Water Damage',
    problemDe: 'Unerwarteter Wasserschaden',
    solutionEn: '24/7 Rapid Response & Leak Mitigation',
    solutionDe: '24/7 Soforthilfe & Schadensbegrenzung'
  },
  {
    icon: AlertTriangle,
    problemEn: 'Slow or Blocked Drains',
    problemDe: 'Langsame oder verstopfte Abflüsse',
    solutionEn: 'Master-Spec Hydro-Jetting Clearance',
    solutionDe: 'Meister-Rohrreinigung mit Hochdruck'
  },
  {
    icon: AlertTriangle,
    problemEn: 'Cold Water / No Pressure',
    problemDe: 'Kaltes Wasser / Kein Druck',
    solutionEn: 'Instant Tankless & Boiler Diagnosis',
    solutionDe: 'Sofortige Thermen- & Kesseldiagnose'
  }
]

export function ProblemSolution({ onCtaClick }: { onCtaClick: () => void }) {
  const { language } = useLanguage()

  return (
    <section className="py-24 px-4 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-black italic uppercase tracking-tighter text-slate-900 mb-4">
            {language === 'de' ? 'Häufige Sanitär-Notfälle' : 'Common Plumbing Disruptions'}
          </h2>
          <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">
            {language === 'de' ? 'Wir lösen sie mit technischer Präzision' : 'We resolve them with technical precision'}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group p-8 bg-white rounded-[2.5rem] border border-slate-200 hover:border-secondary/30 transition-all hover:shadow-2xl"
            >
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <p.icon className="w-6 h-6 text-red-500" />
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Problem</h4>
                  <p className="text-xl font-black text-slate-900 italic uppercase tracking-tighter">{language === 'de' ? p.problemDe : p.problemEn}</p>
                </div>
                
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-secondary mb-2">The Elite Fix</h4>
                  <div className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                    <p className="text-sm font-bold text-slate-600 leading-snug">{language === 'de' ? p.solutionDe : p.solutionEn}</p>
                  </div>
                </div>

                <Button onClick={onCtaClick} variant="link" className="p-0 h-auto text-slate-900 font-black uppercase tracking-widest text-[10px] items-center gap-2 group-hover:gap-3 transition-all">
                  {language === 'de' ? 'JETZT FIXEN' : 'FIX THIS NOW'}
                  <ArrowRight className="w-3 h-3 text-secondary" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
