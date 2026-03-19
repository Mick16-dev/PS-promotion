'use client'

import { useLanguage } from '@/app/context/language-context'
import { motion } from 'framer-motion'
import { Check, X, ShieldCheck, Scale, HardHat, ClipboardCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

const comparison = [
  {
    featureEn: 'Fixed Price Guarantee',
    featureDe: 'Festpreis-Garantie',
    rotek: true,
    standard: false,
    descEn: 'Calculated protocols before deployment.',
    descDe: 'Kalkulierte Protokolle vor Einsatzbeginn.'
  },
  {
    featureEn: 'Master-Certified Staff',
    featureDe: 'Meister-Zertifizierung',
    rotek: true,
    standard: 'Often',
    descEn: '100% permanent master-led technicians.',
    descDe: '100% festangestelltes Meister-Personal.'
  },
  {
    featureEn: '3D TV-Diagnostics',
    featureDe: '3D TV-Inspektion',
    rotek: true,
    standard: false,
    descEn: 'Full digital documentation (ISYBAU).',
    descDe: 'Vollständige digitale Dokumentation (ISYBAU).'
  },
  {
    featureEn: '24/7 Response Time',
    featureDe: '24/7 Reaktionszeit',
    rotek: '< 20m',
    standard: 'Hours',
    descEn: 'Immediate fleet deployment from hubs.',
    descDe: 'Sofortiger Flotten-Einsatz aus Zentralen.'
  },
  {
    featureEn: 'Execution Warranty',
    featureDe: 'Ausführungs-Garantie',
    rotek: 'Lifetime',
    standard: 'Partial',
    descEn: 'Unlimited liability on all master-led works.',
    descDe: 'Unbegrenzte Haftung auf Meister-Arbeiten.'
  }
]

export function Differentiator() {
  const { language } = useLanguage()

  return (
    <section className="py-32 px-4 bg-[#0A0B0D] relative overflow-hidden">
      <div className="absolute inset-0 blueprint-grid opacity-5 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-12 gap-20 items-center">
          {/* Text Content */}
          <div className="lg:col-span-5 space-y-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="border-l-8 border-red-600 pl-8"
            >
              <h2 className="text-5xl sm:text-7xl font-black text-white mb-6 tracking-tighter uppercase italic leading-none">
                {language === 'de' ? 'Der Rotek Standard.' : 'The Rotek Standard.'}
              </h2>
              <p className="text-xl text-slate-400 font-medium italic">
                {language === 'de' 
                  ? 'Warum wir der industrielle Marktführer in Bremen und Verden sind. Qualität ist kein Zufall.' 
                  : 'Why we are the industrial market leader in Bremen and Verden. Quality is no coincidence.'}
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-8">
               <div className="bg-white/[0.02] border border-white/10 p-8">
                  <ShieldCheck className="w-8 h-8 text-red-600 mb-4" />
                  <h4 className="text-xs font-black text-white uppercase tracking-widest mb-2 italic">Null Risiko</h4>
                  <p className="text-[10px] text-slate-500 font-medium italic">Vollständiger Versicherungsschutz bei jedem Einsatz.</p>
               </div>
               <div className="bg-white/[0.02] border border-white/10 p-8">
                  <HardHat className="w-8 h-8 text-red-600 mb-4" />
                  <h4 className="text-xs font-black text-white uppercase tracking-widest mb-2 italic">Echte Expertise</h4>
                  <p className="text-[10px] text-slate-500 font-medium italic">Keine Subunternehmer. Nur festangestellte Profis.</p>
               </div>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="lg:col-span-7">
            <div className="bg-white/[0.01] border border-white/10 rounded-none overflow-hidden shadow-3xl">
              <div className="grid grid-cols-12 bg-white/[0.03] border-b border-white/10 py-6 px-8">
                <div className="col-span-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Feature / Protocol</div>
                <div className="col-span-3 text-[10px] font-black uppercase tracking-[0.4em] text-red-600 text-center">Rotek Standard</div>
                <div className="col-span-3 text-[10px] font-black uppercase tracking-[0.4em] text-slate-700 text-center italic">Industry Average</div>
              </div>

              <div className="divide-y divide-white/5">
                {comparison.map((row, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="grid grid-cols-12 py-8 px-8 items-center hover:bg-white/[0.02] transition-colors group"
                  >
                    <div className="col-span-6">
                      <h5 className="text-sm font-black text-white uppercase italic tracking-tight mb-1 group-hover:text-red-500 transition-colors">
                        {language === 'de' ? row.featureDe : row.featureEn}
                      </h5>
                      <p className="text-[10px] text-slate-500 italic">{language === 'de' ? row.descDe : row.descEn}</p>
                    </div>
                    
                    <div className="col-span-3 flex justify-center">
                      {typeof row.rotek === 'boolean' ? (
                        row.rotek ? <Check className="w-6 h-6 text-red-600" strokeWidth={4} /> : <X className="w-6 h-6 text-slate-800" />
                      ) : (
                        <span className="text-xs font-black text-white uppercase italic tracking-tighter">{row.rotek}</span>
                      )}
                    </div>

                    <div className="col-span-3 flex justify-center">
                       {typeof row.standard === 'boolean' ? (
                        row.standard ? <Check className="w-6 h-6 text-slate-600" /> : <X className="w-6 h-6 text-slate-800" />
                      ) : (
                        <span className="text-xs font-black text-slate-700 uppercase italic tracking-tighter">{row.standard}</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
