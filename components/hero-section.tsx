'use client'

import { useState, useCallback } from 'react'
import { Upload, Droplet, CircleOff, Wrench, Plus, CheckCircle, Clock, ShieldCheck, MapPin, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/app/context/language-context'
import { Button } from '@/components/ui/button'
import { Magnetic } from '@/components/ui/magnetic'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

type IssueCategory = 'leaking' | 'clogged' | 'broken' | 'installation'

interface FormData {
  image: File | null
  imagePreview: string | null
  issueType: IssueCategory | null
  severity: number
  name: string
  phone: string
  email: string
  address: string
}

interface EstimateRange {
  min: number
  max: number
}

function calculateEstimate(category: IssueCategory, severity: number): EstimateRange {
  const baseRates: Record<IssueCategory, { min: number; max: number }> = {
    leaking: { min: 80, max: 150 },
    clogged: { min: 60, max: 120 },
    broken: { min: 150, max: 300 },
    installation: { min: 200, max: 500 }
  }

  const multiplier = 1 + (severity - 1) * 0.25
  const base = baseRates[category]

  return {
    min: Math.round(base.min * multiplier),
    max: Math.round(base.max * multiplier)
  }
}

interface HeroSectionProps {
  onCtaClick: () => void
}

export function HeroSection({ onCtaClick }: HeroSectionProps) {
  const { language, t } = useLanguage()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isFunnelOpen, setIsFunnelOpen] = useState(false)
  const [estimate, setEstimate] = useState<EstimateRange | null>(null)
  const [formData, setFormData] = useState<FormData>({
    image: null,
    imagePreview: null,
    issueType: null,
    severity: 3,
    name: '',
    phone: '',
    email: '',
    address: ''
  })

  // We add a virtual step 5 for the form
  const isFinalForm = step === 5 && !isSuccess && !isSubmitting

  const handleImageDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          image: file,
          imagePreview: event.target?.result as string
        }))
        setStep(2)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          image: file,
          imagePreview: event.target?.result as string
        }))
        setStep(2)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleIssueSelect = (type: IssueCategory) => {
    setFormData(prev => ({ ...prev, issueType: type }))
    setStep(3)
  }

  const handleSeverityChange = (value: number[]) => {
    setFormData(prev => ({ ...prev, severity: value[0] }))
  }

  const handleSeverityContinue = async () => {
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 3500))
    if (formData.issueType) {
      setEstimate(calculateEstimate(formData.issueType, formData.severity))
    }
    setIsSubmitting(false)
    setStep(4) // Move to diagnosis report
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    setIsSuccess(true)
  }

  const issueCategories: { type: IssueCategory; icon: React.ReactNode; color: string }[] = [
    { type: 'leaking', icon: <Droplet className="w-8 h-8" />, color: 'text-blue-500' },
    { type: 'clogged', icon: <CircleOff className="w-8 h-8" />, color: 'text-secondary' },
    { type: 'broken', icon: <Wrench className="w-8 h-8" />, color: 'text-destructive' },
    { type: 'installation', icon: <Plus className="w-8 h-8" />, color: 'text-success' }
  ]

  const severityLabels = [
    t('severity.1'),
    t('severity.2'),
    t('severity.3'),
    t('severity.4'),
    t('severity.5')
  ]

  const variants = {
    initial: { opacity: 0, scale: 0.95, y: 10 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: -10 }
  } as any

  return (
    <section className="relative pt-24 pb-16 px-4 min-h-[60vh] flex items-center justify-center bg-slate-50 border-b border-slate-200">
      <div className="absolute inset-0 opacity-5 pointer-events-none blueprint-grid" />

      <div className="max-w-6xl mx-auto relative z-10 text-center space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight tracking-tight max-w-4xl mx-auto uppercase">
            {t('hero.title')}
          </h1>

          <p className="text-lg sm:text-2xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              onClick={() => setIsFunnelOpen(true)}
              size="lg"
              className="bg-slate-900 text-white hover:bg-slate-800 font-bold uppercase tracking-wider h-14 px-8 rounded-lg text-base shadow-lg transition-all"
            >
              <span className="flex items-center gap-2">
                {t('funnel.cta')}
                <ArrowRight className="w-5 h-5" />
              </span>
            </Button>
            
            <Button 
              variant="outline"
              asChild
              className="h-14 px-8 rounded-lg font-bold uppercase tracking-wider border-slate-200"
            >
              <a href="#services">{t('nav.services')}</a>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Unified Funnel & Form Dialog */}
      <Dialog open={isFunnelOpen} onOpenChange={setIsFunnelOpen}>
        <DialogContent className="max-w-xl p-0 bg-white border-0 shadow-2xl overflow-visible">
          <Card className="border-0 shadow-none">
            <CardContent className="p-8 sm:p-10 relative max-h-[90vh] overflow-y-auto">
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    key="success"
                    variants={variants}
                    initial="initial"
                    animate="animate"
                    className="text-center py-8"
                  >
                    <div className="w-20 h-20 mx-auto mb-6 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2 uppercase">{t('funnel.success.title')}</h2>
                    <p className="text-slate-500 mb-8 font-medium">{t('funnel.success.desc')}</p>

                    {estimate && (
                      <div className="bg-slate-50 rounded-xl p-6 mb-8 border border-slate-200">
                        <p className="text-4xl font-bold text-slate-900">
                          {estimate.min}-{estimate.max}€
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-center gap-2 py-3 px-5 bg-slate-100 rounded-lg text-slate-700 border border-slate-200">
                      <MapPin className="w-4 h-4" />
                      <span className="font-bold uppercase tracking-wider text-xs">
                        {t('funnel.success.eta')}: 15-30 min
                      </span>
                    </div>
                  </motion.div>
                ) : isSubmitting ? (
                  <motion.div
                    key="submitting"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-12 flex flex-col items-center justify-center text-center"
                  >
                    <div className="w-16 h-16 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mb-6" />
                    <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight mb-1">{t('hero.masterDiagnostic')}</h3>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{t('hero.analyzing')}</p>
                  </motion.div>
                ) : isFinalForm ? (
                  <motion.div
                    key="form"
                    variants={variants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="space-y-8"
                  >
                    <div className="flex items-center justify-between gap-3 mb-8">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <div key={s} className="flex-1 relative h-2">
                          <div className="absolute inset-0 bg-slate-100 rounded-full" />
                          <motion.div
                            initial={false}
                            animate={{ width: s <= 5 ? '100%' : '0%' }}
                            className="absolute inset-0 rounded-full bg-slate-900 transition-all duration-500"
                          />
                        </div>
                      ))}
                    </div>
                    <h2 className="text-3xl font-bold uppercase tracking-tight text-center mb-8 text-slate-900">{t('funnel.step4.title')}</h2>
                    <form onSubmit={handleFormSubmit} className="space-y-6">
                      {[
                        { id: 'name', label: t('form.name'), type: 'text' },
                        { id: 'phone', label: t('form.phone'), type: 'tel' },
                        { id: 'email', label: t('form.email'), type: 'email' },
                        { id: 'address', label: t('form.address'), type: 'text' }
                      ].map((field) => (
                        <div key={field.id} className="space-y-2">
                          <Label htmlFor={field.id} className="text-[10px] font-black uppercase tracking-widest ml-1 opacity-50">{field.label}</Label>
                          <Input
                            id={field.id}
                            type={field.type}
                            required
                            value={(formData as any)[field.id]}
                            onChange={(e) => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                            className="bg-muted/50 border-0 rounded-2xl h-14 hover:ring-2 ring-secondary/20 transition-all font-bold"
                          />
                        </div>
                      ))}
                      <Button type="submit" className="w-full bg-slate-900 text-white font-bold uppercase tracking-widest h-16 rounded-xl mt-8 shadow-lg text-lg hover:bg-slate-800 transition-all">
                        <span className="relative z-10 flex items-center gap-2">
                          {t('funnel.cta')}
                          <ArrowRight className="w-5 h-5" />
                        </span>
                      </Button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key={step}
                    variants={variants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    {/* Progress */}
                    <div className="flex items-center justify-between gap-3 mb-12">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <div key={s} className="flex-1 relative h-2">
                          <div className="absolute inset-0 bg-slate-100 rounded-full" />
                          <motion.div
                            initial={false}
                            animate={{ width: s <= step ? '100%' : '0%' }}
                            className={cn(
                              "absolute inset-0 rounded-full transition-all duration-500",
                              s < step ? "bg-green-500" : "bg-slate-900"
                            )}
                          />
                        </div>
                      ))}
                    </div>

                    {step === 1 && (
                      <div className="space-y-10">
                        <div className="text-center">
                          <h2 className="text-4xl font-black tracking-tighter uppercase italic mb-3">{t('funnel.step1.title')}</h2>
                          <p className="text-muted-foreground font-medium text-lg italic">{t('funnel.step1.desc')}</p>
                        </div>
                        <div
                          onDrop={handleImageDrop}
                          onDragOver={(e) => e.preventDefault()}
                          className="relative border-4 border-dashed border-border hover:border-secondary rounded-[3rem] p-20 text-center cursor-pointer transition-all duration-500 hover:bg-white group"
                        >
                          <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" id="image-upload" />
                          <label htmlFor="image-upload" className="cursor-pointer block">
                            <Upload className="w-16 h-16 text-primary mx-auto mb-8 group-hover:scale-110 transition-transform" />
                            <span className="block text-sm font-black uppercase tracking-[0.3em] text-foreground">{t('funnel.step1.formats')}</span>
                          </label>
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-10">
                        <div className="flex items-center gap-8 mb-10">
                          {formData.imagePreview && (
                            <img src={formData.imagePreview} alt="Issue" className="w-24 h-24 object-cover rounded-[2rem] ring-8 ring-white shadow-2xl" />
                          )}
                          <h2 className="text-3xl font-black uppercase italic leading-none">{t('funnel.step2.title')}</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          {issueCategories.map(({ type, icon, color }) => (
                            <button
                              key={type}
                              onClick={() => handleIssueSelect(type)}
                              className={cn(
                                "p-8 rounded-[2.5rem] border-2 text-left transition-all group",
                                formData.issueType === type ? "border-secondary bg-white shadow-2xl scale-105" : "border-border/50 bg-card/10 hover:bg-white"
                              )}
                            >
                              <div className={cn(color, "mb-6 transform group-hover:scale-110 transition-transform")}>{icon}</div>
                              <p className="font-black text-xs sm:text-sm uppercase tracking-widest leading-tight">{t(`issue.${type}`)}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="space-y-12">
                        <h2 className="text-3xl font-black uppercase italic text-center">{t('funnel.step3.title')}</h2>
                        <div className="px-6 space-y-12">
                          <Slider value={[formData.severity]} onValueChange={handleSeverityChange} min={1} max={5} step={1} className="py-4" />
                          <div className="flex justify-between text-[10px] font-black uppercase text-muted-foreground px-2">
                            {severityLabels.map((l, i) => <span key={i} className={formData.severity === i+1 ? "text-primary":""}>{l}</span>)}
                          </div>
                          <motion.div 
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ repeat: Infinity, duration: 3 }}
                            className={cn("text-center p-12 rounded-[3rem] shadow-xl transition-all", 
                              formData.severity >= 4 ? "bg-destructive/10 text-destructive-foreground" : 
                              formData.severity >= 3 ? "bg-amber-500/10 text-amber-600" : "bg-success/10 text-success"
                            )}
                          >
                            <p className="font-bold text-4xl uppercase tracking-tight text-slate-900">{severityLabels[formData.severity - 1]}</p>
                          </motion.div>
                          <Button onClick={handleSeverityContinue} className="w-full h-16 bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase tracking-widest rounded-xl shadow-lg text-lg">
                            {t('hero.calculate')}
                          </Button>
                        </div>
                      </div>
                    )}

                    {step === 4 && estimate && (
                      <div className="space-y-8 text-left">
                        <div className="text-center mb-8">
                          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-slate-900">{t('diagnosis.title')}</h2>
                        </div>
                        
                        <div className="space-y-4 sm:space-y-6">
                          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">{t('diagnosis.problem')}</h3>
                              <p className="text-sm sm:text-base font-bold text-slate-900">{t(`diagnosis.${formData.issueType}.problem`)}</p>
                            </div>
                            
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">{t('diagnosis.tools')}</h3>
                              <p className="text-sm border-slate-200 font-medium text-slate-700">{t(`diagnosis.${formData.issueType}.tools`)}</p>
                            </div>
                          </div>

                          <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-red-500 mb-2">{t('diagnosis.action')}</h3>
                            <p className="text-sm sm:text-base font-bold text-red-900">{t(`diagnosis.${formData.issueType}.action`)}</p>
                          </div>
                          
                          <div className="bg-slate-900 p-8 rounded-xl text-center relative overflow-hidden">
                            <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 relative z-10">{t('diagnosis.price')}</h3>
                            <p className="text-4xl sm:text-5xl font-bold text-white mb-6 relative z-10">{estimate.min}€ - {estimate.max}€</p>
                            <Button onClick={() => setStep(5)} className="w-full h-14 bg-white text-slate-900 hover:bg-slate-100 font-bold uppercase tracking-widest rounded-lg transition-transform hover:scale-[1.02] active:scale-95 relative z-10">
                              {t('diagnosis.book')}
                            </Button>
                          </div>
                        </div>
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
