'use client'

import { useState, useCallback, useEffect } from 'react'
import { Upload, Droplet, CircleOff, Wrench, Plus, CheckCircle, Clock, MapPin, ArrowRight, HardHat, Cpu, ShieldCheck, Box, MoveHorizontal, Camera, Search, FileText, Timer } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/app/context/language-context'
import { Button } from '@/components/ui/button'
import { Magnetic } from '@/components/ui/magnetic'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

function TrustPulse() {
  const { language } = useLanguage()
  const [pulse, setPulse] = useState({ city: 'Berlin', action: 'Fixed-Price Quote Locked' })
  const cities = ['Berlin', 'Munich', 'Hamburg', 'Frankfurt', 'Cologne', 'Stuttgart', 'Düsseldorf']
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse({
        city: cities[Math.floor(Math.random() * cities.length)],
        action: Math.random() > 0.5 
          ? (language === 'de' ? 'Festpreis gesichert' : 'Fixed-Price Quote Locked')
          : (language === 'de' ? 'Techniker entsandt' : 'Technician Dispatched')
      })
    }, 5000)
    return () => clearInterval(interval)
  }, [language])

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      key={pulse.city}
      className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-[10px] font-black uppercase tracking-widest text-white shadow-2xl"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </span>
      <span>{pulse.city}: {pulse.action}</span>
    </motion.div>
  )
}

interface PrecisionQuote {
  partName: string
  partNumber: string
  laborHours: number
  complexity: 'Low' | 'Medium' | 'High'
  price: number
}

interface FormData {
  image: File | null
  imagePreview: string | null
  accessibility: number
  name: string
  phone: string
  email: string
  address: string
  quote: PrecisionQuote | null
}

export function HeroSection({ onCtaClick }: { onCtaClick: () => void }) {
  const { t } = useLanguage()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isFunnelOpen, setIsFunnelOpen] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    image: null,
    imagePreview: null,
    accessibility: 3,
    name: '',
    phone: '',
    email: '',
    address: '',
    quote: null
  })

  // Simulated Vision Engine Logic
  const runVisionAnalysis = async (img: string) => {
    setIsSubmitting(true)
    // Simulate delay with "Thinking" states
    await new Promise(resolve => setTimeout(resolve, 3500))

    // CONFIGURATION: Adjust these for the specific plumbing company
    const HOURLY_RATE = 120 // €/hour
    const BASE_PART_COST = 69 // €
    
    // Prototype Mock Data - This would come from the Vision Engine in production
    const laborHours = 1.5
    const mockQuote: PrecisionQuote = {
      partName: "Master-Spec Replacement Valve (Tier 1)",
      partNumber: "V-992-BX",
      laborHours: laborHours,
      complexity: formData.accessibility > 3 ? 'High' : 'Medium',
      price: Math.round(BASE_PART_COST + (laborHours * HOURLY_RATE))
    }

    setFormData(prev => ({ ...prev, quote: mockQuote }))
    setIsSubmitting(false)
    setStep(4) // Move to technical report
  }

  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const preview = event.target?.result as string
        setFormData(prev => ({
          ...prev,
          image: file,
          imagePreview: preview
        }))
        setStep(2) // Move to Accessibility check before analysis
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleStartAnalysis = () => {
    if (formData.imagePreview) {
      runVisionAnalysis(formData.imagePreview)
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSuccess(true)
  }

  const variants = {
    initial: { opacity: 0, scale: 0.95, y: 10 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: -10 }
  } as any

  return (
    <section className="relative pt-24 pb-12 px-4 min-h-[50vh] flex items-center justify-center bg-slate-900 border-b border-slate-200 overflow-hidden">
      {/* Background Image with Overlay for Visual Context */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/hero-bg.png" 
          alt="Technical Site Survey Context" 
          className="w-full h-full object-cover opacity-40 mix-blend-luminosity scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900/90" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />
      </div>

      <div className="absolute inset-0 opacity-10 pointer-events-none blueprint-grid z-0" />

      <div className="max-w-6xl mx-auto relative z-10 text-center space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="flex flex-col items-center gap-6">
            <TrustPulse />
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight max-w-4xl mx-auto uppercase">
              {t('hero.title')}
            </h1>
          </div>

          <p className="text-lg sm:text-2xl text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed italic">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              onClick={() => setIsFunnelOpen(true)}
              size="lg"
              className="bg-white text-slate-900 hover:bg-slate-100 font-black uppercase tracking-[0.2em] h-16 px-10 rounded-2xl shadow-2xl transition-all hover:scale-105 active:scale-95 text-lg"
            >
              <span className="flex items-center gap-3">
                {t('hero.calculate')}
                <ArrowRight className="w-6 h-6" />
              </span>
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 pt-12 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
             {[
               { icon: ShieldCheck, label: 'Master Certified' },
               { icon: Clock, label: '24/7 Priority' },
               { icon: MapPin, label: 'Nationwide' }
             ].map((b, i) => (
               <div key={i} className="flex items-center gap-2 text-white font-black uppercase tracking-widest text-[10px]">
                 <b.icon className="w-4 h-4 text-white" />
                 {b.label}
               </div>
             ))}
          </div>
        </motion.div>
      </div>

      <Dialog open={isFunnelOpen} onOpenChange={setIsFunnelOpen}>
        <DialogContent className="max-w-xl p-0 bg-white border-0 shadow-2xl overflow-visible">
          <Card className="border-0 shadow-none">
            <CardContent className="p-8 sm:p-10 relative max-h-[90vh] overflow-y-auto">
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div key="success" variants={variants} initial="initial" animate="animate" className="text-center py-8">
                    <div className="w-20 h-20 mx-auto mb-6 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <ShieldCheck className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2 uppercase">{t('funnel.success.title')}</h2>
                    <p className="text-slate-500 mb-8 font-medium">{t('funnel.success.desc')}</p>
                    <div className="bg-slate-50 rounded-xl p-6 mb-8 border border-slate-200">
                      <p className="text-xs font-bold text-slate-500 uppercase mb-1">Guaranteed ID</p>
                      <p className="text-xl font-bold text-slate-900 underline decoration-green-500">{formData.quote?.partNumber}</p>
                    </div>
                    <div className="flex items-center justify-center gap-2 py-3 px-5 bg-slate-900 rounded-lg text-white border border-slate-900 shadow-xl">
                      <MapPin className="w-4 h-4 text-green-400" />
                      <span className="font-bold uppercase tracking-wider text-xs">Technician Dispatched (15-30m)</span>
                    </div>
                  </motion.div>
                ) : isSubmitting ? (
                  <motion.div key="submitting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-20 flex flex-col items-center justify-center text-center">
                    <div className="relative w-24 h-24 mb-10">
                      <div className="absolute inset-0 bg-slate-100 rounded-full animate-ping opacity-20" />
                      <div className="absolute inset-0 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Wrench className="w-10 h-10 text-slate-900" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2">{t('hero.diagnosisInProgress')}</h3>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.3em] animate-pulse">{t('hero.diagnosing')}</p>
                    <div className="mt-8 space-y-2 w-full max-w-[200px]">
                       <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div animate={{ x: ['-100%', '100%'] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} className="h-full w-1/3 bg-slate-900" />
                       </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key={step} variants={variants} initial="initial" animate="animate" exit="exit">
                    {/* Step 1: Upload */}
                    {step === 1 && (
                      <div className="space-y-10">
                        <div className="text-center">
                          <h2 className="text-4xl font-black tracking-tighter uppercase mb-3 italic">{t('funnel.step1.title')}</h2>
                          <p className="text-slate-500 font-medium text-lg italic">{t('funnel.step1.desc')}</p>
                        </div>
                        <div className="relative border-4 border-dashed border-slate-200 hover:border-slate-900 rounded-[3rem] p-20 text-center cursor-pointer transition-all duration-500 hover:bg-slate-50 group">
                          <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" id="image-upload" />
                          <label htmlFor="image-upload" className="cursor-pointer block">
                            <Upload className="w-16 h-16 text-slate-400 mx-auto mb-8 group-hover:scale-110 transition-transform group-hover:text-slate-900" />
                            <span className="block text-sm font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-slate-900">{t('funnel.step1.formats')}</span>
                          </label>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Complexity Check */}
                    {step === 2 && (
                      <div className="space-y-12">
                        <div className="flex items-center gap-8 mb-10">
                          {formData.imagePreview && (
                            <div className="relative">
                               <img src={formData.imagePreview} alt="Issue" className="w-24 h-24 object-cover rounded-[2rem] ring-8 ring-white shadow-2xl" />
                               <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1 rounded-full shadow-lg">
                                  <CheckCircle className="w-4 h-4" />
                               </div>
                            </div>
                          )}
                          <h2 className="text-3xl font-black uppercase italic leading-none">{t('funnel.step3.title')}</h2>
                        </div>
                        <div className="px-6 space-y-10">
                          <Slider value={[formData.accessibility]} onValueChange={(v) => setFormData(p => ({...p, accessibility: v[0]}))} min={1} max={5} step={1} className="py-4" />
                          <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 px-2 tracking-widest">
                            <span>Easy Access</span>
                            <span>Obstructed</span>
                          </div>
                          <Button onClick={handleStartAnalysis} className="w-full h-16 bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase tracking-widest rounded-xl shadow-lg text-lg">
                            {t('funnel.cta')}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Step 4: Technical Quote Report */}
                    {step === 4 && formData.quote && (
                      <div className="space-y-8 text-left">
                        <div className="text-center mb-8">
                          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                             <Cpu className="w-8 h-8 text-white" />
                          </div>
                          <h2 className="text-3xl font-bold uppercase tracking-tight text-slate-900">{t('diagnosis.title')}</h2>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">{t('diagnosis.problem')}</h3>
                              <p className="text-sm font-bold text-slate-900">{formData.quote.partName}</p>
                              <p className="text-[10px] text-slate-400 font-mono mt-1">REF: {formData.quote.partNumber}</p>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">{t('diagnosis.complexity')}</h3>
                              <p className="text-sm font-bold text-slate-900">{formData.quote.complexity} Level</p>
                              <p className="text-[10px] text-slate-400 mt-1">Labor: {formData.quote.laborHours}h</p>
                            </div>
                          </div>

                          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                             <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">{t('diagnosis.tools')}</h3>
                             <div className="flex gap-3">
                                <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-sm"><Wrench className="w-4 h-4 text-slate-900" /></div>
                                <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-sm"><Box className="w-4 h-4 text-slate-900" /></div>
                                <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-sm"><ShieldCheck className="w-4 h-4 text-slate-900" /></div>
                             </div>
                          </div>
                          
                          <div className="bg-slate-900 p-8 rounded-xl text-center relative overflow-hidden mt-6">
                            <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 relative z-10">{t('diagnosis.price')}</h3>
                            <p className="text-5xl font-bold text-white mb-6 relative z-10">€{formData.quote.price}</p>
                            <Button onClick={() => setStep(5)} className="w-full h-14 bg-white text-slate-900 hover:bg-slate-100 font-bold uppercase tracking-widest rounded-lg transition-transform hover:scale-[1.02] active:scale-95 relative z-10">
                              {t('diagnosis.book')}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 5: Master Booking Form */}
                    {step === 5 && (
                      <div className="space-y-8">
                        <div className="text-center space-y-2">
                           <h2 className="text-3xl font-bold uppercase tracking-tight text-slate-900">Secure Your Quote</h2>
                           <p className="text-slate-500 font-medium italic">Lock-in your fixed price by providing contact details.</p>
                        </div>
                        <form onSubmit={handleFormSubmit} className="space-y-5">
                          {[
                            { id: 'name', label: t('form.name'), type: 'text' },
                            { id: 'phone', label: t('form.phone'), type: 'tel' },
                            { id: 'email', label: t('form.email'), type: 'email' },
                            { id: 'address', label: t('form.address'), type: 'text' }
                          ].map((field) => (
                            <div key={field.id} className="space-y-1">
                              <Label htmlFor={field.id} className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-1">{field.label}</Label>
                              <Input
                                id={field.id}
                                required
                                value={(formData as any)[field.id]}
                                onChange={(e) => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                                className="bg-slate-50 border-0 rounded-xl h-12 focus:ring-2 ring-slate-900/10 transition-all font-bold"
                              />
                            </div>
                          ))}
                          <Button type="submit" className="w-full bg-slate-900 text-white font-bold uppercase tracking-widest h-16 rounded-xl mt-6 shadow-xl text-lg hover:bg-slate-800">
                             Confirm Booking & Fixed Quote
                          </Button>
                        </form>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </section>
  )
}
