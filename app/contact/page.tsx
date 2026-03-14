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
              {language === 'de' ? 'Kontaktieren Sie Uns' : 'Get in Touch'}
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
              {language === 'de' 
                ? 'Direkter Draht zu unseren Meistern. Wir sind 24/7 für Ihre Anliegen da.' 
                : 'Direct line to our masters. We are available 24/7 for all your inquiries.'}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-5 space-y-8">
              <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-10">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-slate-900" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{language === 'de' ? 'Telefon' : 'Phone'}</p>
                    <p className="text-xl font-bold text-slate-900">+49 (0) 123 456 7890</p>
                    <p className="text-xs font-bold text-red-600 uppercase tracking-widest mt-1">24/7 Emergency Line</p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-slate-900" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{language === 'de' ? 'E-Mail' : 'Email'}</p>
                    <p className="text-xl font-bold text-slate-900">info@rohr-blitz.de</p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-slate-900" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{language === 'de' ? 'Hauptsitz' : 'Headquarters'}</p>
                    <p className="text-xl font-bold text-slate-900">Meisterstraße 42, 10115 Berlin</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 pt-6 border-t border-slate-100">
                   <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h5 className="text-sm font-black uppercase tracking-tight text-slate-900 mb-1">{language === 'de' ? 'Reaktionszeit' : 'Response Time'}</h5>
                    <p className="text-xs text-slate-500 font-medium">
                      {language === 'de' 
                        ? 'Notfälle: Unter 30 Minuten\nAnfragen: Innerhalb von 2 Stunden' 
                        : 'Emergencies: Under 30 minutes\nInquiries: Within 2 hours'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-slate-900 p-10 sm:p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
                
                <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-10">{language === 'de' ? 'Nachricht Senden' : 'Send a Message'}</h2>
                
                <form className="space-y-6 relative z-10">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{language === 'de' ? 'Name' : 'Full Name'}</Label>
                      <Input className="bg-white/10 border-white/10 text-white h-14 rounded-2xl focus:ring-red-600 focus:border-red-600 transition-all font-bold" />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{language === 'de' ? 'Telefon' : 'Phone Number'}</Label>
                      <Input className="bg-white/10 border-white/10 text-white h-14 rounded-2xl focus:ring-red-600 focus:border-red-600 transition-all font-bold" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</Label>
                    <Input className="bg-white/10 border-white/10 text-white h-14 rounded-2xl focus:ring-red-600 focus:border-red-600 transition-all font-bold" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{language === 'de' ? 'Anliegen' : 'Your Subject'}</Label>
                    <Input className="bg-white/10 border-white/10 text-white h-14 rounded-2xl focus:ring-red-600 focus:border-red-600 transition-all font-bold" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{language === 'de' ? 'Nachricht' : 'Your Message'}</Label>
                    <Textarea className="bg-white/10 border-white/10 text-white min-h-[160px] rounded-3xl focus:ring-red-600 focus:border-red-600 transition-all font-bold py-6 px-6" />
                  </div>

                  <Button className="w-full h-18 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest text-sm rounded-2xl shadow-[0_0_30px_rgba(220,38,38,0.3)] transition-all group">
                    <span className="flex items-center gap-3">
                      {language === 'de' ? 'Abfrage Senden' : 'Submit Inquiry'}
                      <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
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
