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
      title: 'Expert Restoration',
      subtitle: 'Connect with our master plumbing team for immediate assistance.',
      customerTitle: 'Request a Master Quote',
      customerDesc: 'Direct access to certified master technicians',
      formName: 'Full Name',
      formEmail: 'Email Address',
      formPhone: 'Phone Number',
      formProblem: 'Problem Type (e.g. Leaking, Clogged)',
      formMessage: 'Additional Details',
      submitCustomer: 'Send Request to Masters',
      back: 'Back',
      successTitle: 'Request Received',
      successCustomer: 'Our master plumbing team has received your details and will contact you shortly.',
      close: 'Close'
    },
    de: {
      title: 'Meister-Service',
      subtitle: 'Verbinden Sie sich mit unserem Experten-Team für sofortige Hilfe.',
      customerTitle: 'Meister-Angebot anfordern',
      customerDesc: 'Direkter Zugang zu zertifizierten Sanitärmeistern',
      formName: 'Vollständiger Name',
      formEmail: 'E-Mail-Adresse',
      formPhone: 'Telefonnummer',
      formProblem: 'Art des Problems (z.B. Leck, Verstopfung)',
      formMessage: 'Zusätzliche Details',
      submitCustomer: 'Anfrage an Meister senden',
      back: 'Zurück',
      successTitle: 'Anfrage erhalten',
      successCustomer: 'Unser Team hat Ihre Daten erhalten und wird Sie in Kürze kontaktieren.',
      close: 'Schließen'
    }
  }

  const t = text[language]

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Elite Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-primary/95 backdrop-blur-2xl"
            onClick={handleClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[4rem] shadow-[0_64px_128px_-32px_rgba(0,0,0,0.5)] overflow-hidden border border-white/20"
          >
            {/* Liquid Background Accents */}
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-secondary/10 rounded-full blur-[100px]" />
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-8 right-8 w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-white transition-all z-20 group"
            >
              <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
            </button>

            <AnimatePresence mode="wait">
              {/* Universal Form Container */}
              {step === 'customer' && (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-12 lg:p-20 relative z-10"
                >
                  <div className="text-center mb-12">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 text-primary text-[10px] font-black rounded-xl uppercase tracking-[0.3em] mb-6">
                      <ShieldCheck className="w-4 h-4" />
                      Secure Priority Intake
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-4 tracking-tighter italic uppercase leading-none">{t.customerTitle}</h2>
                    <p className="text-muted-foreground font-medium italic">{t.subtitle}</p>
                  </div>

                  <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">{t.formName}</Label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="h-14 rounded-2xl border-2 border-muted bg-muted/30 focus:border-secondary focus:ring-0 transition-all font-bold"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">{t.formEmail}</Label>
                      <Input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="h-14 rounded-2xl border-2 border-muted bg-muted/30 focus:border-secondary focus:ring-0 transition-all font-bold"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">{t.formProblem}</Label>
                      <Input
                        required
                        value={formData.problemType}
                        onChange={(e) => setFormData(prev => ({ ...prev, problemType: e.target.value }))}
                        className="h-14 rounded-2xl border-2 border-muted bg-muted/30 focus:border-secondary focus:ring-0 transition-all font-bold"
                        placeholder="e.g. Burst pipe in kitchen"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">{t.formMessage}</Label>
                      <textarea
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        className="w-full rounded-[1.5rem] border-2 border-muted bg-muted/30 p-4 focus:border-secondary focus:outline-none transition-all font-bold resize-none"
                        placeholder="Any other details..."
                      />
                    </div>

                    <div className="sm:col-span-2 pt-4">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-16 rounded-2xl bg-secondary text-white hover:bg-secondary/90 font-black uppercase tracking-[0.2em] shadow-2xl shadow-secondary/20 transition-all active:scale-95 group relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        {isSubmitting ? (
                          <div className="flex items-center gap-3">
                            <Loader2 className="w-6 h-6 animate-spin" />
                            Sending...
                          </div>
                        ) : (
                          <span className="relative z-10 flex items-center justify-center gap-3 italic text-lg">
                            {t.submitCustomer}
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                          </span>
                        )}
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Success */}
              {step === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-12 lg:p-24 text-center relative z-10"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12, stiffness: 200 }}
                    className="w-24 h-24 mx-auto mb-10 bg-success rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-success/30 rotate-12"
                  >
                    <CheckCircle className="w-12 h-12 text-white" />
                  </motion.div>
                  <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-6 italic uppercase tracking-tighter leading-none">{t.successTitle}</h2>
                  <p className="text-xl font-medium text-muted-foreground mb-12 italic leading-relaxed max-w-md mx-auto">
                    {t.successCustomer}
                  </p>
                  <Button
                    onClick={handleClose}
                    className="bg-primary text-white hover:bg-primary/90 font-black uppercase tracking-[0.2em] h-16 px-12 rounded-2xl shadow-2xl active:scale-95"
                  >
                    {t.close}
                  </Button>

                  {/* Decorative icon (Abstract) */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-full h-full opacity-20">
                    <ShieldCheck className="absolute top-10 left-10 w-8 h-8 text-secondary animate-pulse" />
                    <CheckCircle className="absolute bottom-10 right-10 w-12 h-12 text-primary animate-bounce" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
