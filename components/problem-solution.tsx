'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/app/context/language-context'
import { Activity, Camera, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const problems = [
  {
    icon: Activity,
    problemEn: 'Sewer Line Obstruction',
    problemDe: 'Siel-Verstopfung (SML/KG)',
    solutionEn: 'High-Pressure Hydro-Jetting (HD-Spülung)',
    solutionDe: 'Hochdruck-Spülung & TV-Nachweis'
  },
  {
    icon: Camera,
    problemEn: 'Undocumented Pipe Network',
    problemDe: 'Unklarer Rohrverlauf (Plan fehlt)',
    solutionEn: 'Digital 3D Pipe Mapping & Analysis',
    solutionDe: '3D-Rohrortung & Digital-Protokoll'
  },
  {
    icon: ShieldAlert,
    problemEn: 'Grease Trap Overflow',
    problemDe: 'Fettabscheider-Überlauf',
    solutionEn: 'Industrial Extraction & Maintenance',
    solutionDe: 'Fachgerechte Absaugung & Wartung'
  }
]

export function ProblemSolution({ onCtaClick }: { onCtaClick: () => void }) {
  const { language } = useLanguage()

  return (
    <section className="py-16 sm:py-20 px-4 bg-[#0A0B0D] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-white/5" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter text-white mb-4 italic leading-tight">
            {language === 'de' ? 'Technische Störungsbehebung' : 'Technical Disruption Recovery'}
          </h2>
          <p className="text-slate-500 font-medium text-lg italic max-w-2xl mx-auto leading-relaxed">
            {language === 'de' 
              ? 'Wir lösen komplexe Abwassersystem-Probleme mit zertifizierter industrieller Präzision.' 
              : 'We resolve complex wastewater system issues with certified industrial precision.'}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group p-8 bg-white/[0.02] rounded-none border border-white/10 hover:border-red-600/50 transition-all duration-500 hover:bg-white/[0.04] relative"
            >
              <div className="absolute top-0 left-0 w-1 h-0 bg-red-600 group-hover:h-full transition-all duration-500" />
              
              <div className="w-12 h-12 rounded-none bg-red-600/10 flex items-center justify-center mb-8 border border-red-600/20 group-hover:bg-red-600 group-hover:text-white transition-colors">
                <p.icon className="w-6 h-6 text-red-600 group-hover:text-white transition-colors" />
              </div>
              
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-600 mb-2">Technical Defect</p>
                  <p className="text-xl font-black text-white uppercase italic tracking-tight leading-tight">{language === 'de' ? p.problemDe : p.problemEn}</p>
                </div>
                
                <div className="pt-6 border-t border-white/5">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-3">Rotek Protocol</p>
                  <div className="flex gap-3 items-start">
                    <CheckCircle2 className="w-4 h-4 text-white shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-400 font-medium leading-relaxed italic">{language === 'de' ? p.solutionDe : p.solutionEn}</p>
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    onClick={onCtaClick} 
                    className="w-full h-12 text-[10px] font-black uppercase tracking-widest bg-white/5 text-slate-400 border border-white/10 hover:border-red-600 group-hover:bg-red-600 group-hover:text-white rounded-none transition-all duration-300"
                  >
                    {language === 'de' ? 'Analyse anfordern' : 'Request Analysis'}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
