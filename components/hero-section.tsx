'use client'

import { useState, useCallback, useEffect } from 'react'
import { Upload, Droplet, CircleOff, Wrench, Plus, CheckCircle, Clock, MapPin, ArrowRight, HardHat, Cpu, ShieldCheck, Box, MoveHorizontal, Camera, Search, FileText, Timer, Activity } from 'lucide-react'
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
  const [pulse, setPulse] = useState({ city: 'Bremen-Walle', action: '3D Protocol Generated' })
  const cities = ['Bremen-Walle', 'Bremen-Findorff', 'Bremen-Horn', 'Bremen-Neustadt', 'Verden', 'Bremen-Nord', 'Bremen-Hastedt']
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse({
        city: cities[Math.floor(Math.random() * cities.length)],
        action: Math.random() > 0.5 
          ? (language === 'de' ? '3D-Protokoll erstellt' : '3D Protocol Generated')
          : (language === 'de' ? 'Fahrzeug 4 entsandt' : 'Truck 4 Dispatched')
      })
    }, 4000)
    return () => clearInterval(interval)
  }, [language])

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      key={pulse.city}
      className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/10 backdrop-blur-md rounded-none border-l-4 border-red-600 text-[10px] font-black uppercase tracking-widest text-white shadow-2xl"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
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
    initial: { opacity: 0, scale: 0.98, y: 5 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.98, y: -5 }
  } as any

  return (
    <section className="relative pt-20 pb-10 px-4 min-h-[40vh] flex items-center justify-center bg-slate-900 border-b border-slate-200 overflow-hidden">
      {/* Background Image with Overlay for Visual Context */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1541888941293-1e8fbf3d12c8?w=1600&q=80" 
          alt="Technical Site Survey Context" 
          className="w-full h-full object-cover opacity-30 mix-blend-luminosity grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0B0D]/90 via-[#0A0B0D]/70 to-[#0A0B0D]" />
        <div className="absolute inset-0 backdrop-blur-[1px]" />
      </div>

      <div className="absolute inset-0 opacity-5 pointer-events-none blueprint-grid z-0" />

      <div className="max-w-5xl mx-auto relative z-10 text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="flex flex-col items-center gap-6">
            <TrustPulse />
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight max-w-2xl mx-auto uppercase italic">
              {t('hero.title')}
            </h1>
          </div>

          <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto font-medium leading-relaxed">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <div className="relative group">
              <div className="absolute -top-3 -left-3 px-3 py-1 bg-white text-red-600 text-[8px] font-black uppercase tracking-[0.3em] z-20 border border-red-600 shadow-xl italic">
                Master Visual Service
              </div>
              <Button
                onClick={() => setIsFunnelOpen(true)}
                size="lg"
                className="bg-red-600 text-white hover:bg-red-700 font-black uppercase tracking-widest h-14 px-10 rounded-none border-b-4 border-r-4 border-red-900 shadow-xl transition-all hover:scale-105 active:scale-95 text-sm"
              >
                <span className="flex items-center gap-3">
                  {t('hero.calculate')}
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-8 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
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
        <DialogContent className="max-w-xl p-0 bg-[#0A0B0D] border border-white/10 shadow-3xl overflow-visible">
          <Card className="border-0 shadow-none bg-transparent">
            <CardContent className="p-8 sm:p-12 relative max-h-[90vh] overflow-y-auto">
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div key="success" variants={variants} initial="initial" animate="animate" className="text-center py-8">
                    <div className="w-24 h-24 mx-auto mb-8 bg-red-600/10 border border-red-600/30 rounded-none flex items-center justify-center shadow-lg">
                      <ShieldCheck className="w-12 h-12 text-red-600" />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">{t('funnel.success.title')}</h2>
                    <p className="text-slate-400 mb-8 font-medium italic">{t('funnel.success.desc')}</p>
                    <div className="bg-white/5 rounded-none p-6 mb-8 border border-white/10">
                      <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">Rotek Protocol ID</p>
                      <p className="text-2xl font-mono font-bold text-white uppercase">RTK-{formData.quote?.partNumber}-WL</p>
                    </div>
                    <div className="flex items-center justify-center gap-3 py-4 px-6 bg-red-600 rounded-none text-white border-b-4 border-red-900 shadow-xl">
                      <HardHat className="w-5 h-5" />
                      <span className="font-black uppercase tracking-widest text-xs">Einsatzleiter Andreas: Dispatching NOW</span>
                    </div>
                  </motion.div>
                ) : isSubmitting ? (
                  <motion.div key="submitting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-20 flex flex-col items-center justify-center text-center">
                    <div className="relative w-32 h-32 mb-10">
                      <div className="absolute inset-0 bg-red-600/20 rounded-full animate-ping opacity-20" />
                      <div className="absolute inset-0 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Activity className="w-12 h-12 text-red-600" />
                      </div>
                      {/* Scanning Overlays */}
                      <motion.div 
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="absolute -top-12 left-1/2 -translate-x-1/2 text-[10px] font-mono text-red-500 whitespace-nowrap"
                      >
                        [ MEISTER-VALIDIERUNG... ]
                      </motion.div>
                      <motion.div 
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 0.7, repeat: Infinity, delay: 0.2 }}
                        className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-[10px] font-mono text-white/50 whitespace-nowrap"
                      >
                        PROTOKOLL-STATUS: AKTIV
                      </motion.div>
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">{t('hero.diagnosisInProgress')}</h3>
                    <p className="text-red-500 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">{t('hero.diagnosing')}</p>
                    <div className="mt-12 space-y-3 w-full max-w-[240px]">
                       <div className="h-1 bg-white/10 rounded-none overflow-hidden">
                          <motion.div animate={{ x: ['-100%', '100%'] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="h-full w-1/3 bg-red-600" />
                       </div>
                       <p className="text-[9px] font-mono text-slate-500 italic">SYNC: BREMER KATASTERAMT...</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key={step} variants={variants} initial="initial" animate="animate" exit="exit">
                    {/* Step 1: Upload */}
                    {step === 1 && (
                      <div className="space-y-12">
                        <div className="text-center">
                          <h2 className="text-5xl font-black tracking-tighter uppercase mb-4 italic text-white">{t('funnel.step1.title')}</h2>
                          <p className="text-slate-400 font-medium text-lg italic">{t('funnel.step1.desc')}</p>
                        </div>
                        <div className="relative border-2 border-white/10 hover:border-red-600/50 rounded-none p-16 text-center cursor-pointer transition-all duration-500 bg-white/[0.02] hover:bg-red-600/[0.03] group">
                          <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" id="image-upload" />
                          <label htmlFor="image-upload" className="cursor-pointer block">
                            <Camera className="w-20 h-20 text-slate-700 mx-auto mb-10 group-hover:scale-110 transition-transform group-hover:text-red-600" />
                            <span className="block text-xs font-black uppercase tracking-[0.4em] text-slate-500 group-hover:text-white transition-colors">{t('funnel.step1.formats')}</span>
                          </label>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Complexity Check */}
                    {step === 2 && (
                      <div className="space-y-12">
                        <div className="flex items-center gap-10 mb-10">
                          {formData.imagePreview && (
                            <div className="relative">
                               <img src={formData.imagePreview} alt="Issue" className="w-28 h-28 object-cover rounded-none ring-4 ring-white/10 shadow-3xl grayscale hover:grayscale-0 transition-all" />
                               <div className="absolute -bottom-2 -right-2 bg-red-600 text-white p-1.5 rounded-none shadow-lg">
                                  <Activity className="w-4 h-4" />
                               </div>
                            </div>
                          )}
                          <h2 className="text-4xl font-black uppercase italic leading-tight text-white">{t('funnel.step2.title')} <br/><span className="text-xs text-red-500 not-italic tracking-[0.3em]">INITIAL SCAN COMPLETE</span></h2>
                        </div>
                        <div className="px-6 space-y-12">
                          <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t('funnel.step3.title')}</Label>
                            <Slider value={[formData.accessibility]} onValueChange={(v) => setFormData(p => ({...p, accessibility: v[0]}))} min={1} max={5} step={1} className="py-4" />
                            <div className="flex justify-between text-[10px] font-black uppercase text-slate-600 px-2 tracking-widest">
                              <span>Clear Path</span>
                              <span>Complex Obstruction</span>
                            </div>
                          </div>
                          <Button onClick={handleStartAnalysis} className="w-full h-18 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest rounded-none border-r-4 border-b-4 border-red-900 shadow-xl text-lg transition-all active:translate-y-1 active:border-b-0">
                            {t('funnel.cta')}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Step 4: Technical Quote Report */}
                    {step === 4 && formData.quote && (
                      <div className="space-y-10 text-left">
                        <div className="text-center mb-10">
                          <div className="w-20 h-20 bg-red-600/10 border border-red-600/20 rounded-none flex items-center justify-center mx-auto mb-6 shadow-xl">
                             <Activity className="w-10 h-10 text-red-600" />
                          </div>
                          <h2 className="text-4xl font-black uppercase tracking-tighter text-white italic">{t('diagnosis.title')}</h2>
                        </div>
                        
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-6">
                            <div className="bg-white/5 p-6 rounded-none border border-white/10">
                              <h3 className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-3">{t('diagnosis.problem')}</h3>
                              <p className="text-md font-bold text-white uppercase tracking-tight">{formData.quote.partName}</p>
                              <p className="text-[10px] text-slate-500 font-mono mt-2">REF: {formData.quote.partNumber}</p>
                            </div>
                            <div className="bg-white/5 p-6 rounded-none border border-white/10">
                              <h3 className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-3">{t('diagnosis.complexity')}</h3>
                              <p className="text-md font-bold text-white uppercase tracking-tight">{formData.quote.complexity} DEPTH</p>
                              <p className="text-[10px] text-slate-500 mt-2 font-mono">EST: {formData.quote.laborHours}h OPS</p>
                            </div>
                          </div>

                          <div className="bg-white/5 p-6 rounded-none border border-white/10">
                             <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">{t('diagnosis.tools')} REQUIRED</h3>
                             <div className="flex gap-4">
                                <div className="p-3 bg-white/5 border border-white/10 text-white"><Wrench className="w-5 h-5" /></div>
                                <div className="p-3 bg-white/5 border border-white/10 text-white"><Box className="w-5 h-5" /></div>
                                <div className="p-3 bg-red-600/20 border border-red-600/30 text-red-500"><ShieldCheck className="w-5 h-5" /></div>
                             </div>
                          </div>
                          
                          <div className="bg-[#0A0B0D] p-10 rounded-none border-2 border-red-600 border-dashed text-center relative overflow-hidden mt-8">
                            <div className="absolute top-0 left-0 w-full h-full bg-red-600/5 animate-pulse" />
                            <h3 className="text-[11px] font-black uppercase tracking-widest text-red-500 mb-2 relative z-10">{t('diagnosis.price')} (FIXED)</h3>
                            <p className="text-6xl font-black text-white mb-8 relative z-10 font-mono">€{formData.quote.price}</p>
                            <Button onClick={() => setStep(5)} className="w-full h-16 bg-red-600 text-white hover:bg-red-700 font-black uppercase tracking-widest rounded-none border-b-4 border-r-4 border-red-900 transition-all active:translate-y-1 active:border-b-0 relative z-10">
                              {t('diagnosis.book')}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 5: Master Booking Form */}
                    {step === 5 && (
                      <div className="space-y-10">
                        <div className="text-center mb-12">
                           <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter text-white mb-4 italic leading-tight">Protocol Clearance</h2>
                           <p className="text-slate-500 font-medium italic">Finalize technical report for Central Walle Dispatch.</p>
                        </div>
                        <form onSubmit={handleFormSubmit} className="space-y-6">
                          {[
                            { id: 'name', label: t('form.name'), type: 'text' },
                            { id: 'phone', label: t('form.phone'), type: 'tel' },
                            { id: 'email', label: t('form.email'), type: 'email' },
                            { id: 'address', label: t('form.address'), type: 'text' }
                          ].map((field) => (
                            <div key={field.id} className="space-y-2">
                              <Label htmlFor={field.id} className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">{field.label}</Label>
                              <Input
                                id={field.id}
                                required
                                value={(formData as any)[field.id]}
                                onChange={(e) => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                                className="bg-white/5 border-white/10 rounded-none h-14 focus:ring-2 ring-red-600/20 transition-all font-bold text-white"
                              />
                            </div>
                          ))}
                          <Button type="submit" className="w-full bg-red-600 text-white font-black uppercase tracking-widest h-18 rounded-none mt-8 shadow-xl text-lg hover:bg-red-700 border-b-4 border-r-4 border-red-900 transition-all active:translate-y-1 active:border-b-0">
                             Confirm Protocol & Dispatch
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
