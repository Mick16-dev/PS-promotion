'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/app/context/language-context'
import { AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

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
    solutionEn: 'Professional Hydro-Jetting Clearance',
    solutionDe: 'Professionelle Rohrreinigung mit Hochdruck'
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
    <section className="py-14 sm:py-16 px-4 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-slate-900 mb-2">
            {language === 'de' ? 'Häufige Sanitär-Notfälle' : 'Common Plumbing Disruptions'}
          </h2>
          <p className="text-slate-500 font-medium text-sm">
            {language === 'de' ? 'Wir lösen sie mit technischer Präzision' : 'We resolve them with technical precision'}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {problems.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group p-6 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-all hover:shadow-md"
            >
              <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center mb-4">
                <p.icon className="w-4 h-4 text-red-500" />
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Problem</p>
                  <p className="text-base font-bold text-slate-900">{language === 'de' ? p.problemDe : p.problemEn}</p>
                </div>
                
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-green-600 mb-1">Solution</p>
                  <div className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-600 leading-snug">{language === 'de' ? p.solutionDe : p.solutionEn}</p>
                  </div>
                </div>

                <Button 
                  onClick={onCtaClick} 
                  variant="outline" 
                  className="w-full h-9 text-xs font-bold uppercase tracking-wider border-slate-200 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all rounded-lg"
                >
                  {language === 'de' ? 'Jetzt beheben' : 'Get Help Now'}
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
