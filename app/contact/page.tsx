'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/app/context/language-context'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Phone, Mail, MapPin, Clock, MessageSquare, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function ContactPage() {
  const { language, t } = useLanguage()

  return (
    <main className="min-h-screen bg-[#0A0B0D]">
      <Header onEmergencyClick={() => {}} />
      
      <div className="pt-48 pb-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 blueprint-grid opacity-20 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-left mb-24 border-l-8 border-red-600 pl-8"
          >
            <h1 className="text-5xl sm:text-8xl font-black uppercase tracking-tighter mb-8 text-white italic leading-none">
              {language === 'de' ? 'Einsatzleitung.' : 'Fleet Command.'}
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl font-medium italic">
              {language === 'de' 
                ? 'Direkter Zugriff auf unsere Experten in Bremen & Verden. 24/7 technische Unterstützung.' 
                : 'Direct access to our masters in Bremen & Verden. 24/7 technical support.'}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-16">
            {/* Contact Info */}
            <div className="lg:col-span-5 space-y-12">
              <div className="bg-white/[0.02] border border-white/10 p-12 rounded-none space-y-12 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 -mr-16 -mt-16 rotate-45 group-hover:bg-red-600/20 transition-all" />
                
                <div className="flex items-start gap-8">
                  <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-none flex items-center justify-center shrink-0 group-hover:border-red-600 transition-colors">
                    <Phone className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-2">{language === 'de' ? '24/7 Zentrale' : '24/7 Dispatch'}</p>
                    <p className="text-2xl font-black text-white tracking-tight italic">+49 (0) 421 244 144</p>
                    <div className="flex items-center gap-2 mt-2">
                       <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                       <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest">Active Response Line</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-8">
                  <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-none flex items-center justify-center shrink-0 group-hover:border-red-600 transition-colors">
                    <Mail className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-2">{language === 'de' ? 'Technik-Anfragen' : 'Technical Inquiries'}</p>
                    <p className="text-2xl font-black text-white tracking-tight italic">info@rotek.de</p>
                  </div>
                </div>

                <div className="flex items-start gap-8">
                  <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-none flex items-center justify-center shrink-0 group-hover:border-red-600 transition-colors">
                    <MapPin className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-2">{language === 'de' ? 'Zentrale Bremen' : 'Bremen HQ'}</p>
                    <p className="text-2xl font-black text-white tracking-tight italic">Bayernstr. 172, 28219 Bremen</p>
                  </div>
                </div>

                <div className="flex items-start gap-8 pt-10 border-t border-white/5">
                   <div className="w-16 h-16 bg-red-600 rounded-none flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h5 className="text-sm font-black uppercase tracking-widest text-white mb-2 italic">{language === 'de' ? 'Einsatz-Fenster' : 'Deployment Window'}</h5>
                    <p className="text-sm text-slate-400 font-medium italic">
                      {language === 'de' 
                        ? 'Notfälle: Durchschnittlich 20 Minuten\nProtokolle: Innerhalb von 60 Minuten' 
                        : 'Emergencies: 20 Minute Average\nProtocols: Within 60 minutes'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-white/[0.01] border border-white/10 p-12 rounded-none relative overflow-hidden">
                <div className="absolute inset-0 blueprint-grid opacity-5 pointer-events-none" />
                
                <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-12 italic">
                  {language === 'de' ? 'Einsatz-Protokoll anfordern' : 'Request Technical Protocol'}
                </h2>
                
                <form className="space-y-8 relative z-10">
                  <div className="grid sm:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">{language === 'de' ? 'Vollständiger Name' : 'Full Name'}</Label>
                      <Input className="bg-white/[0.03] border-white/10 text-white h-16 rounded-none focus:ring-red-600 focus:border-red-600 transition-all font-black uppercase italic tracking-tight" />
                    </div>
                    <div className="space-y-3">
                       <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">{language === 'de' ? 'Telefonnummer' : 'Phone Number'}</Label>
                      <Input className="bg-white/[0.03] border-white/10 text-white h-16 rounded-none focus:ring-red-600 focus:border-red-600 transition-all font-black uppercase italic tracking-tight" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">{language === 'de' ? 'E-Mail-Adresse' : 'Email Address'}</Label>
                    <Input className="bg-white/[0.03] border-white/10 text-white h-16 rounded-none focus:ring-red-600 focus:border-red-600 transition-all font-black uppercase italic tracking-tight" />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[10px) font-black uppercase tracking-[0.3em] text-slate-500 ml-1">{language === 'de' ? 'Schadenstyp / Objekt' : 'Object / Issue Type'}</Label>
                    <Input className="bg-white/[0.03] border-white/10 text-white h-16 rounded-none focus:ring-red-600 focus:border-red-600 transition-all font-black uppercase italic tracking-tight" />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">{language === 'de' ? 'Technische Beschreibung' : 'Technical Description'}</Label>
                    <Textarea className="bg-white/[0.03] border-white/10 text-white min-h-[200px] rounded-none focus:ring-red-600 focus:border-red-600 transition-all font-medium italic py-6 px-6" />
                  </div>

                  <Button className="w-full h-20 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-[0.2em] text-sm rounded-none shadow-[0_20px_40px_rgba(220,38,38,0.2)] transition-all group">
                    <span className="flex items-center gap-4">
                      {language === 'de' ? 'Protokoll Übermitteln' : 'Transmit Protocol'}
                      <Send className="w-5 h-5 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                    </span>
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer onCtaClick={() => window.location.href = '/#hero'} />
    </main>
  )
}
