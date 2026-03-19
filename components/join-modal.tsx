'use client'

import { useState } from 'react'
import { X, Users, Briefcase, CheckCircle, Loader2, ArrowRight, UserCheck, ShieldCheck } from 'lucide-react'
import { useLanguage } from '@/app/context/language-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface JoinModalProps {
  isOpen: boolean
  onClose: () => void
}

type ModalStep = 'choice' | 'customer' | 'technician' | 'success'

export function JoinModal({ isOpen, onClose }: JoinModalProps) {
  const { language } = useLanguage()
  const [step, setStep] = useState<ModalStep>('customer')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    problemType: '',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    setStep('success')
  }

  const handleClose = () => {
    onClose()
    setTimeout(() => {
      setStep('customer')
      setFormData({ name: '', email: '', phone: '', problemType: '', message: '' })
    }, 300)
  }

  const text = {
    en: {
      title: 'Technical Protocol',
      subtitle: 'Synchronizing with Central Walle Dispatch for immediate mission clearance.',
      customerTitle: 'Initiate Protocol',
      customerDesc: 'Direct access to Rotek master engineering fleet',
      formName: 'Full Name',
      formEmail: 'Email Address',
      formPhone: 'Phone Number',
      formProblem: 'Issue Class (e.g. SML DN100 Blockage)',
      formMessage: 'Additional Technical Details',
      submitCustomer: 'Transmit Protocol to Dispatch',
      back: 'Abort',
      successTitle: 'Protocol Transmitted',
      successCustomer: 'Central Dispatch has received your mission parameters. Fleet Command is preparing technical units.',
      close: 'Exit Console'
    },
    de: {
      title: 'Technisches Protokoll',
      subtitle: 'Synchronisierung mit Zentrale Walle für sofortige Einsatzfreigabe.',
      customerTitle: 'Protokoll Initiieren',
      customerDesc: 'Direkter Zugriff auf Rotek Meister-Flotte',
      formName: 'Vollständiger Name',
      formEmail: 'E-Mail-Adresse',
      formPhone: 'Telefonnummer',
      formProblem: 'Störungsklasse (z.B. SML DN100 Verstopfung)',
      formMessage: 'Zusätzliche technische Details',
      submitCustomer: 'Protokoll an Zentrale senden',
      back: 'Abbrechen',
      successTitle: 'Protokoll Übermittelt',
      successCustomer: 'Die Zentrale hat Ihre Einsatzparameter erhalten. Die Einsatzleitung bereitet die Einheiten vor.',
      close: 'Konsole verlassen'
    }
  }

  const t = text[language]

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
          {/* Industrial Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#0A0B0D]/98 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal Container - Blueprint Style */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="relative w-full max-w-2xl bg-[#0A0B0D] rounded-none shadow-3xl overflow-hidden border border-white/10"
          >
            {/* Technical Overlays */}
            <div className="absolute inset-0 blueprint-grid opacity-10 pointer-events-none" />
            <div className="absolute top-0 left-0 w-32 h-32 bg-red-600/5 -translate-x-1/2 -translate-y-1/2 rotate-45" />

            {/* Close button - Scanner Style */}
            <button
              onClick={handleClose}
              className="absolute top-8 right-8 w-14 h-14 rounded-none bg-white/5 flex items-center justify-center text-slate-500 hover:bg-red-600 hover:text-white transition-all z-20 group border border-white/10"
            >
              <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
            </button>

            <AnimatePresence mode="wait">
              {step === 'customer' && (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-10 lg:p-20 relative z-10"
                >
                  <div className="text-left mb-16 border-l-4 border-red-600 pl-8">
                    <span className="inline-flex items-center gap-3 px-0 py-2 text-red-600 text-[10px] font-black uppercase tracking-[0.4em] mb-4">
                      <ShieldCheck className="w-4 h-4" />
                      PRIORITY ALPHA PROTOCOL
                    </span>
                    <h2 className="text-4xl sm:text-6xl font-black text-white mb-6 tracking-tighter italic uppercase leading-none">{t.customerTitle}</h2>
                    <p className="text-slate-400 font-medium italic text-lg">{t.subtitle}</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">{t.formName}</Label>
                        <Input
                          required
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="h-16 rounded-none border-white/10 bg-white/[0.03] text-white focus:border-red-600 focus:ring-0 transition-all font-black uppercase italic tracking-tight"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">{t.formEmail}</Label>
                        <Input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          className="h-16 rounded-none border-white/10 bg-white/[0.03] text-white focus:border-red-600 focus:ring-0 transition-all font-black uppercase italic tracking-tight"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">{t.formProblem}</Label>
                      <Input
                        required
                        value={formData.problemType}
                        onChange={(e) => setFormData(prev => ({ ...prev, problemType: e.target.value }))}
                        className="h-16 rounded-none border-white/10 bg-white/[0.03] text-white focus:border-red-600 focus:ring-0 transition-all font-black uppercase italic tracking-tight"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">{t.formMessage}</Label>
                      <textarea
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        className="w-full rounded-none border border-white/10 bg-white/[0.03] p-6 text-white focus:border-red-600 focus:outline-none transition-all font-medium italic resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-24 rounded-none bg-red-600 text-white hover:bg-red-700 font-black uppercase tracking-[0.3em] shadow-3xl transition-all active:translate-y-1 active:border-b-0 border-b-8 border-r-8 border-red-900 group relative overflow-hidden"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-4">
                          <Loader2 className="w-8 h-8 animate-spin" />
                          TRANSMITTING...
                        </div>
                      ) : (
                        <span className="relative z-10 flex items-center justify-center gap-6 italic text-xl">
                          {t.submitCustomer}
                          <ArrowRight className="w-8 h-8 group-hover:translate-x-2' transition-transform" />
                        </span>
                      )}
                    </Button>
                  </form>
                </motion.div>
              )}

              {step === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-12 lg:p-24 text-center relative z-10"
                >
                  <div className="w-32 h-32 mx-auto mb-12 bg-red-600/10 border-2 border-red-600 rounded-none flex items-center justify-center shadow-3xl shadow-red-900/40">
                    <CheckCircle className="w-16 h-16 text-red-600" />
                  </div>
                  <h2 className="text-5xl sm:text-7xl font-black text-white mb-8 italic uppercase tracking-tighter leading-none">{t.successTitle}</h2>
                  <p className="text-2xl font-medium text-slate-400 mb-16 italic leading-relaxed max-w-md mx-auto">
                    {t.successCustomer}
                  </p>
                  <Button
                    onClick={handleClose}
                    className="bg-white text-black hover:bg-white/90 font-black uppercase tracking-[0.1em] h-20 px-16 rounded-none shadow-3xl active:scale-95 text-lg italic"
                  >
                    {t.close}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
