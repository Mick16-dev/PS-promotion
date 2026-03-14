'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/app/context/language-context'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Check, Info, Phone, Wrench, Shield, CircleDollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'

const pricingPlans = [
  {
    nameEn: 'Standard Repair',
    nameDe: 'Standard Reparatur',
    price: '99€',
    descEn: 'Basic diagnostics and common repairs.',
    descDe: 'Basis-Diagnose und gängige Reparaturen.',
    featuresEn: ['Expert Inspection', 'Basic Leak Fixes', '3-Month Guarantee', 'No Call-out Fee (Weekdays)'],
    featuresDe: ['Experten-Inspektion', 'Basis Leck-Fixes', '3 Monate Garantie', 'Keine Anfahrtskosten (Werktags)']
  },
  {
    nameEn: 'Master Service',
    nameDe: 'Meister Service',
    price: '189€',
    descEn: 'Full system check and complex repairs.',
    descDe: 'Kompletter Systemcheck und komplexe Reparaturen.',
    popular: true,
    featuresEn: ['Advanced Diagnostics', 'High-Flow Cleaning', '12-Month Guarantee', 'Emergency Priority', 'Free Maintenance Advice'],
    featuresDe: ['Erweiterte Diagnose', 'Hochdruckreinigung', '12 Monate Garantie', 'Notfall-Priorität', 'Kostenlose Beratung']
  },
  {
    nameEn: 'Commercial/Sewer',
    nameDe: 'Gewerbe/Kanal',
    price: '449€',
    descEn: 'Heavy duty solutions for businesses.',
    descDe: 'Hochleistungslösungen für Gewerbe.',
    featuresEn: ['Full Sewer Camera Scan', 'Hydro-Jetting Included', '2-Year Guarantee', 'Regulatory Compliance Check', '24/7 VIP Access'],
    featuresDe: ['Kanal-Kamerascann', 'Inklusive Hochdruckspülung', '2 Jahre Garantie', 'Konformitätsprüfung', '24/7 VIP Zugang']
  }
]

export default function PricingPage() {
  const { language, t } = useLanguage()

  return (
    <main className="min-h-screen bg-slate-50">
      <Header onEmergencyClick={() => {}} />
      
      <div className="pt-32 pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter mb-6 text-slate-900">
              {language === 'de' ? 'Transparente Preise' : 'Transparent Pricing'}
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
              {language === 'de' 
                ? 'Keine versteckten Kosten. Wir garantieren faire Meister-Preise für erstklassige Arbeit.' 
                : 'No hidden fees. We guarantee fair master-level pricing for world-class workmanship.'}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {pricingPlans.map((plan, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`relative bg-white rounded-[3rem] p-10 border ${plan.popular ? 'border-red-600 shadow-2xl ring-4 ring-red-50' : 'border-slate-200 shadow-sm'}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                    {language === 'de' ? 'Meistgewählt' : 'Most Popular'}
                  </div>
                )}
                
                <div className="mb-8">
                  <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900 mb-2">
                    {language === 'de' ? plan.nameDe : plan.nameEn}
                  </h3>
                  <p className="text-slate-500 font-medium text-sm">
                    {language === 'de' ? plan.descDe : plan.descEn}
                  </p>
                </div>

                <div className="flex items-baseline gap-1 mb-10">
                  <span className="text-[10px] font-black uppercase text-slate-400">Ab</span>
                  <span className="text-6xl font-black tracking-tighter text-slate-900">{plan.price}</span>
                </div>

                <div className="space-y-4 mb-10">
                  {(language === 'de' ? plan.featuresDe : plan.featuresEn).map((feature, fidx) => (
                    <div key={fidx} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${plan.popular ? 'bg-red-100' : 'bg-slate-100'}`}>
                        <Check className={`w-3 h-3 ${plan.popular ? 'text-red-600' : 'text-slate-900'}`} />
                      </div>
                      <span className="text-sm font-bold text-slate-700 uppercase tracking-tight">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button className={`w-full h-16 rounded-2xl font-black uppercase tracking-widest text-sm shadow-lg transition-all active:scale-95 ${plan.popular ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}>
                  {language === 'de' ? 'Jetzt Buchen' : 'Book Now'}
                </Button>
              </motion.div>
            ))}
          </div>

          <div className="mt-20 p-10 bg-slate-900 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h4 className="text-2xl font-black uppercase tracking-tight mb-1">{language === 'de' ? 'Voll Versichert' : 'Fully Insured'}</h4>
                <p className="text-slate-400 font-medium">{language === 'de' ? 'Alle Arbeiten sind durch unsere Haftpflichtversicherung abgesichert.' : 'All works are covered by our comprehensive liability insurance.'}</p>
              </div>
            </div>
            <Button variant="outline" className="h-16 px-10 rounded-2xl border-white/20 text-white font-black uppercase tracking-widest hover:bg-white/10 shrink-0">
               {language === 'de' ? 'Beratung anfordern' : 'Request Consultation'}
            </Button>
          </div>
        </div>
      </div>

      <Footer onCtaClick={() => window.location.href = '/#hero'} />
    </main>
  )
}
