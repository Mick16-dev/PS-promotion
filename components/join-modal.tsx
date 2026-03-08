'use client'

import { useState } from 'react'
import { X, Users, Briefcase, CheckCircle, Loader2, Sparkles, ArrowRight, UserCheck, ShieldCheck } from 'lucide-react'
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
  const [step, setStep] = useState<ModalStep>('choice')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
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
      setStep('choice')
      setFormData({ name: '', email: '', phone: '', message: '' })
    }, 300)
  }

  const text = {
    en: {
      title: 'Elite Network',
      subtitle: 'Select your path to professional plumbing restoration.',
      customerTitle: 'Get a Premium Quote',
      customerDesc: 'Direct access to certified masters & AI diagnostics',
      techTitle: 'Join the Elite Team',
      techDesc: 'Apply as a certified meister technician',
      formName: 'Full Name',
      formEmail: 'VIP Email Address',
      formPhone: 'Direct Phone',
      formMessage: 'Detailed Issue Description',
      formExperience: 'Experience & Master Certifications',
      submitCustomer: 'Initialize Diagnostic Request',
      submitTech: 'Submit Professional Profile',
      back: 'Back to Selection',
      successTitle: 'Submission Authenticated',
      successCustomer: 'Your dossier is being reviewed by our master plumbing squad.',
      successTech: 'Your professional credentials have been routed to executive recruitment.',
      close: 'Exit Portal'
    },
    de: {
      title: 'Elite-Netzwerk',
      subtitle: 'Wählen Sie Ihren Weg zur professionellen Sanitär-Restaurierung.',
      customerTitle: 'Premium-Angebot erhalten',
      customerDesc: 'Direkter Zugang zu Meistern & KI-Diagnose',
      techTitle: 'Dem Elite-Team beitreten',
      techDesc: 'Bewerben Sie sich als zertifizierter Meister-Techniker',
      formName: 'Vollständiger Name',
      formEmail: 'VIP-E-Mail-Adresse',
      formPhone: 'Direkte Telefonnummer',
      formMessage: 'Detaillierte Problembeschreibung',
      formExperience: 'Erfahrung & Meister-Zertifikate',
      submitCustomer: 'Diagnose-Anfrage initialisieren',
      submitTech: 'Profi-Profil einreichen',
      back: 'Zurück zur Auswahl',
      successTitle: 'Einreichung authentifiziert',
      successCustomer: 'Ihr Dossier wird von unserem Meister-Sanitär-Team geprüft.',
      successTech: 'Ihre Referenzen wurden an die Personalabteilung weitergeleitet.',
      close: 'Portal verlassen'
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
              {/* Choice Step */}
              {step === 'choice' && (
                <motion.div 
                  key="choice"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="p-12 lg:p-20 relative z-10"
                >
                  <div className="text-center mb-16">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 text-primary text-[10px] font-black rounded-xl uppercase tracking-[0.3em] mb-6">
                      <Sparkles className="w-4 h-4" />
                      Global Intake Portal
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-4 tracking-tighter italic uppercase leading-none">{t.title}</h2>
                    <p className="text-muted-foreground font-medium italic">{t.subtitle}</p>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-8 mt-12">
                    <button
                      onClick={() => setStep('customer')}
                      className="group relative p-10 bg-white border border-border rounded-[3rem] text-center hover:border-secondary hover:shadow-2xl hover:shadow-secondary/20 transition-all duration-500 overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-full translate-x-12 -translate-y-12 group-hover:scale-150 transition-transform" />
                      <div className="w-16 h-16 bg-secondary rounded-[2.5rem] flex items-center justify-center text-white shadow-xl mx-auto mb-8 group-hover:rotate-6 transition-transform">
                        <UserCheck className="w-8 h-8" />
                      </div>
                      <h3 className="text-2xl font-black text-foreground mb-4 italic uppercase tracking-tighter leading-tight">{t.customerTitle}</h3>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">{t.customerDesc}</p>
                    </button>

                    <button
                      onClick={() => setStep('technician')}
                      className="group relative p-10 bg-white border border-border rounded-[3rem] text-center hover:border-primary hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full translate-x-12 -translate-y-12 group-hover:scale-150 transition-transform" />
                      <div className="w-16 h-16 bg-primary rounded-[2.5rem] flex items-center justify-center text-white shadow-xl mx-auto mb-8 group-hover:-rotate-6 transition-transform">
                        <ShieldCheck className="w-8 h-8" />
                      </div>
                      <h3 className="text-2xl font-black text-foreground mb-4 italic uppercase tracking-tighter leading-tight">{t.techTitle}</h3>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">{t.techDesc}</p>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Universal Form Container */}
              {(step === 'customer' || step === 'technician') && (
                <motion.div 
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-12 lg:p-20 relative z-10"
                >
                  <button
                    onClick={() => setStep('choice')}
                    className="group mb-12 flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center group-hover:border-primary">
                       <ArrowRight className="w-4 h-4 rotate-180" />
                    </div>
                    {t.back}
                  </button>
                  
                  <div className="mb-12">
                     <h2 className="text-4xl font-black text-foreground italic uppercase tracking-tighter mb-4 leading-none">
                       {step === 'customer' ? t.customerTitle : t.techTitle}
                     </h2>
                     <div className="h-2 w-24 bg-secondary rounded-full" />
                  </div>
                  
                  <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">{t.formName}</Label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="h-16 rounded-2xl border-2 border-muted bg-muted/30 focus:border-secondary focus:ring-0 transition-all font-bold text-lg"
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
                        className="h-16 rounded-2xl border-2 border-muted bg-muted/30 focus:border-secondary focus:ring-0 transition-all font-bold text-lg"
                        placeholder="john@elite.com"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">{t.formPhone}</Label>
                      <Input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="h-16 rounded-2xl border-2 border-muted bg-muted/30 focus:border-secondary focus:ring-0 transition-all font-bold text-lg"
                        placeholder="+49 123 456789"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                        {step === 'customer' ? t.formMessage : t.formExperience}
                      </Label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        className="w-full rounded-[2rem] border-2 border-muted bg-muted/30 p-6 focus:border-secondary focus:outline-none transition-all font-bold text-lg resize-none"
                        placeholder="..."
                      />
                    </div>
                    
                    <div className="sm:col-span-2 pt-4">
                      <Button 
                        type="submit"
                        disabled={isSubmitting}
                        className={cn(
                          "w-full h-20 rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 group relative overflow-hidden",
                          step === 'customer' 
                            ? "bg-secondary text-white hover:bg-secondary/90 shadow-secondary/20" 
                            : "bg-primary text-white hover:bg-primary/90 shadow-primary/20"
                        )}
                      >
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        {isSubmitting ? (
                          <div className="flex items-center gap-3">
                            <Loader2 className="w-6 h-6 animate-spin" />
                            Authenticating...
                          </div>
                        ) : (
                          <span className="relative z-10 flex items-center justify-center gap-3 italic">
                             {step === 'customer' ? t.submitCustomer : t.submitTech}
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
                  
                  {/* Decorative particles (Abstract) */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-full h-full opacity-20">
                     <Sparkles className="absolute top-10 left-10 w-8 h-8 text-secondary animate-pulse" />
                     <Sparkles className="absolute bottom-10 right-10 w-12 h-12 text-primary animate-bounce" />
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
