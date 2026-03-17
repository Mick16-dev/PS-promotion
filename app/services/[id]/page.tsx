'use client'

import { useParams } from 'next/navigation'
import { services } from '@/lib/services-data'
import { useLanguage } from '@/app/context/language-context'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Brain, CheckCircle2, Shield, Clock, ArrowRight, Phone, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function ServicePage() {
  const { id } = useParams()
  const { t, language } = useLanguage()
  const service = services.find((s) => s.id === id)

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Service not found</h1>
      </div>
    )
  }

  const handleCTA = () => {
    // Scroll to contact or open modal if needed
    window.location.href = '/contact'
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Header onEmergencyClick={handleCTA} />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-slate-900 -z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-900 -z-10" />
        <img 
          src={service.image} 
          alt={t(service.titleKey)} 
          className="absolute inset-0 w-full h-full object-cover opacity-30 -z-20 grayscale"
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
                <Brain className="w-4 h-4 text-white" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">Master Certified Service</span>
             </div>
             <h1 className="text-4xl sm:text-7xl font-black text-white uppercase tracking-tighter mb-6 italic">
               {t(service.titleKey)}
             </h1>
             <p className="text-xl text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed italic border-l-2 border-white/20 pl-6 mb-12">
               {t(service.descKey)}
             </p>
             
             <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  onClick={handleCTA}
                  className="bg-white text-slate-900 hover:bg-slate-100 font-black uppercase tracking-widest h-14 px-8 rounded-xl shadow-2xl transition-all active:scale-95 text-lg"
                >
                  {language === 'de' ? 'Angebot anfordern' : 'Request Quote'}
                </Button>
                <div className="flex items-center gap-6 px-8 h-14 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                   <div className="flex flex-col items-start leading-none">
                      <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Price starting at</span>
                      <span className="text-2xl font-black text-white italic">€{service.price}</span>
                   </div>
                </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* Details Grid */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm"
            >
               <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
               </div>
               <h3 className="text-xl font-bold text-slate-900 uppercase mb-4 italic">Guaranteed Quality</h3>
               <p className="text-slate-600 font-medium leading-relaxed italic">
                 Every repair is performed by a certified German Master Plumber, backed by a 2-year workmanship guarantee and full insurance coverage.
               </p>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.1 }}
               className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm"
            >
               <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <Clock className="w-6 h-6 text-white" />
               </div>
               <h3 className="text-xl font-bold text-slate-900 uppercase mb-4 italic">Rapid Response</h3>
               <p className="text-slate-600 font-medium leading-relaxed italic">
                 Available 24/7 across major German hubs. 30-minute average response time for emergencies, ensuring your property is protected immediately.
               </p>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.2 }}
               className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm"
            >
               <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <CheckCircle2 className="w-6 h-6 text-white" />
               </div>
               <h3 className="text-xl font-bold text-slate-900 uppercase mb-4 italic">Fixed Price Lock</h3>
               <p className="text-slate-600 font-medium leading-relaxed italic">
                  No hidden fees or surprise invoices. Our Master Vision Engine identifies the parts and labor path to give you a locked-in price before we arrive.
               </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
             <div>
                <span className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 block">The Master Approach</span>
                <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter mb-8 italic">
                  Precision Engineering for {t(service.titleKey)}
                </h2>
                <div className="space-y-6">
                   {[
                     "Certified Master-level diagnostics",
                     "Premium parts with longevity guarantee",
                     "Full digital documentation of the repair",
                     "Transparent billing and automated processing"
                   ].map((item, i) => (
                     <div key={i} className="flex items-center gap-4 border-b border-white/10 pb-4">
                        <div className="w-2 h-2 rounded-full bg-white" />
                        <span className="text-lg font-medium italic text-slate-300">{item}</span>
                     </div>
                   ))}
                </div>
                <Button 
                  onClick={handleCTA}
                  className="mt-12 group bg-white text-slate-900 hover:bg-white/90 font-black uppercase tracking-widest h-14 px-8 rounded-xl transition-all"
                >
                  Schedule Expert Visit
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
             </div>
             <div className="relative">
                <div className="aspect-square rounded-[3rem] overflow-hidden border-8 border-white/5 shadow-2xl skew-y-3">
                   <img src={service.image} className="w-full h-full object-cover grayscale brightness-50" alt="Process" />
                   <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/60 to-transparent" />
                   <div className="absolute bottom-12 left-12 right-12 p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem]">
                      <h4 className="text-2xl font-black uppercase italic mb-2">Technician ID #772</h4>
                      <p className="text-slate-300 text-sm font-medium">Ready for deployment in Berlin, Hamburg, Munich & Frankfurt.</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      <Footer onCtaClick={handleCTA} />
    </main>
  )
}
