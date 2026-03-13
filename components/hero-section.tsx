'use client'

import { useState, useCallback } from 'react'
import { Upload, Droplet, CircleOff, Wrench, Plus, CheckCircle, Clock, Loader2, ShieldCheck, MapPin } from 'lucide-react'
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
  const { t } = useLanguage()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
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
    // Simulate Blueprint Scanning phase
    await new Promise(resolve => setTimeout(resolve, 3500))
    if (formData.issueType) {
      setEstimate(calculateEstimate(formData.issueType, formData.severity))
    }
    setIsSubmitting(false)
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsModalOpen(false)
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
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  }

  return (
    <section className="relative pt-32 pb-24 px-4 min-h-screen mesh-gradient overflow-hidden">
      <div className="absolute inset-0 grain-overlay opacity-50" />

      <div className="max-w-6xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        {/* Hero Text */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 text-left lg:max-w-xl"
        >
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-xs font-black bg-primary text-primary-foreground rounded-xl uppercase tracking-[0.2em] shadow-lg shadow-primary/20"
          >
            <ShieldCheck className="w-4 h-4 text-secondary" />
            {t('hero.badge')}
          </motion.span>

          <h1 className="text-5xl sm:text-6xl font-black text-foreground mb-6 leading-[1.05] tracking-tighter italic uppercase underline decoration-secondary decoration-8 underline-offset-8">
            {t('hero.title')}
          </h1>

          <p className="text-xl text-muted-foreground mb-8 leading-relaxed font-medium max-w-lg">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-success" />
              </div>
              <span className="text-sm font-bold uppercase tracking-wider text-foreground">{t('hero.verifiedExperts')}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-secondary" />
              </div>
              <span className="text-sm font-bold uppercase tracking-wider text-foreground">{t('hero.response')}</span>
            </div>
          </div>
        </motion.div>

        {/* Funnel Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex-1 w-full max-w-lg"
        >
          <Card className="glass-card overflow-hidden rounded-[2.5rem] border-white/40 shadow-2xl">
            <CardContent className="p-8 sm:p-10">
              {/* Progress Pillar */}
              {!isSuccess && !isSubmitting && (
                <div className="flex items-center justify-between gap-3 mb-10">
                  {[1, 2, 3].map((s) => (
                    <div key={s} className="flex-1 relative h-2">
                      <div className="absolute inset-0 bg-muted/30 rounded-full" />
                      <motion.div
                        initial={false}
                        animate={{ width: s <= step ? '100%' : '0%' }}
                        className={cn(
                          "absolute inset-0 rounded-full transition-all duration-500",
                          s < step ? "bg-success" : "bg-secondary"
                        )}
                      />
                    </div>
                  ))}
                </div>
              )}

              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    key="success"
                    variants={variants}
                    initial="initial"
                    animate="animate"
                    className="text-center"
                  >
                    <div className="w-24 h-24 mx-auto mb-8 bg-success rounded-[2rem] flex items-center justify-center shadow-xl shadow-success/20 animate-float">
                      <CheckCircle className="w-12 h-12 text-success-foreground" />
                    </div>
                    <h2 className="text-3xl font-black text-foreground mb-4 italic uppercase">{t('funnel.success.title')}</h2>
                    <p className="text-muted-foreground mb-8 font-medium">{t('funnel.success.desc')}</p>

                    {estimate && (
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-card/40 backdrop-blur-md rounded-3xl p-8 mb-8 border border-white/20"
                      >
                        <p className="text-[10px] uppercase tracking-[0.3em] font-black text-primary mb-3">{t('hero.masterEstimate')}</p>
                        <p className="text-5xl font-black text-foreground italic">
                          {estimate.min}-{estimate.max}€
                        </p>
                      </motion.div>
                    )}

                    <div className="flex items-center justify-center gap-3 py-4 px-6 bg-primary rounded-2xl text-primary-foreground shadow-lg shadow-primary/20">
                      <MapPin className="w-5 h-5 text-secondary animate-pulse" />
                      <span className="font-bold uppercase tracking-wider text-sm">
                        {t('funnel.success.eta')}: 15-30 min
                      </span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={step}
                    variants={variants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.4, ease: "anticipate" }}
                  >
                    {step === 1 && (
                      <div className="space-y-6">
                        <div className="text-center">
                          <h2 className="text-2xl font-black tracking-tighter uppercase italic mb-2">{t('funnel.step1.title')}</h2>
                          <p className="text-muted-foreground font-medium">{t('funnel.step1.desc')}</p>
                        </div>

                        <div
                          onDrop={handleImageDrop}
                          onDragOver={(e) => e.preventDefault()}
                          className="relative group border-4 border-dashed border-border hover:border-secondary rounded-[2rem] p-12 text-center cursor-pointer transition-all duration-500 hover:bg-white/50"
                        >
                          <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" id="image-upload" />
                          <label htmlFor="image-upload" className="cursor-pointer block">
                            <div className="w-20 h-20 mx-auto mb-6 bg-primary/5 rounded-[1.5rem] flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                              <Upload className="w-10 h-10 text-primary group-hover:text-secondary transition-colors" />
                            </div>
                            <span className="block text-sm font-black uppercase tracking-widest text-foreground">{t('funnel.step1.formats')}</span>
                          </label>
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-8">
                        <div className="flex items-center gap-6">
                          {formData.imagePreview && (
                            <div className="relative">
                              <img src={formData.imagePreview} alt="Issue" className="w-24 h-24 object-cover rounded-[1.5rem] ring-4 ring-white shadow-xl" />
                              <div className="absolute -top-3 -right-3 bg-secondary p-1.5 rounded-full shadow-lg">
                                <CheckCircle className="w-4 h-4 text-white" />
                              </div>
                            </div>
                          )}
                          <h2 className="text-2xl font-black tracking-tighter uppercase italic">{t('funnel.step2.title')}</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          {issueCategories.map(({ type, icon, color }) => (
                            <motion.button
                              key={type}
                              whileHover={{ y: -5 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleIssueSelect(type)}
                              className={cn(
                                "relative p-6 rounded-[2rem] border-2 text-left transition-all duration-300",
                                formData.issueType === type
                                  ? "border-secondary bg-white shadow-xl shadow-secondary/10"
                                  : "border-border/50 bg-card/30 hover:bg-white hover:border-secondary/30"
                              )}
                            >
                              <div className={cn(color, "mb-4")}>{icon}</div>
                              <p className="font-black text-xs uppercase tracking-widest text-foreground leading-tight">{t(`issue.${type}`)}</p>
                              {formData.issueType === type && (
                                <div className="absolute top-4 right-4 text-secondary">
                                  <CheckCircle className="w-5 h-5" />
                                </div>
                              )}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="space-y-8">
                        <h2 className="text-2xl font-black tracking-tighter uppercase italic text-center">{t('funnel.step3.title')}</h2>

                        <div className="max-w-md mx-auto space-y-12">
                          <div className="px-4">
                            <Slider
                              value={[formData.severity]}
                              onValueChange={handleSeverityChange}
                              min={1}
                              max={5}
                              step={1}
                              className="w-full"
                            />
                          </div>

                          <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter text-muted-foreground px-1">
                            {severityLabels.map((label, i) => (
                              <span key={i} className={cn("transition-colors", formData.severity === i + 1 ? "text-primary" : "")}>{label}</span>
                            ))}
                          </div>

                          <motion.div
                            animate={{ scale: [1, 1.02, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className={cn(
                              "text-center p-8 rounded-[2rem] shadow-xl",
                              formData.severity >= 4 ? "bg-destructive/10 text-destructive-foreground shadow-destructive/5" :
                                formData.severity >= 3 ? "bg-amber-500/10 text-amber-600 shadow-amber-500/5" :
                                  "bg-success/10 text-success shadow-success/5"
                            )}
                          >
                            <p className="font-black text-3xl uppercase italic">{severityLabels[formData.severity - 1]}</p>
                          </motion.div>

                          <Magnetic strength={0.2} className="w-full">
                            <Button
                              onClick={handleSeverityContinue}
                              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-black uppercase tracking-widest py-8 rounded-2xl text-lg shadow-2xl shadow-primary/20"
                            >
                              {t('hero.calculate')}
                            </Button>
                          </Magnetic>
                        </div>
                      </div>
                    )}
                    {isSubmitting && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="py-12 flex flex-col items-center justify-center text-center"
                      >
                        <div className="relative z-20 space-y-8">
                          <div className="relative w-32 h-32 mx-auto">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                              className="absolute inset-0 border-2 border-dashed border-secondary/30 rounded-full"
                            />
                            <div className="absolute inset-4 border-2 border-secondary rounded-full flex items-center justify-center">
                              <Wrench className="w-10 h-10 text-secondary animate-pulse" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-2xl font-black text-foreground italic uppercase tracking-tighter">{t('hero.masterDiagnostic')}</h3>
                            <p className="text-secondary text-sm font-bold uppercase tracking-[0.2em] animate-pulse">{t('hero.analyzing')}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          <div className="mt-8 flex items-center justify-center gap-8 text-muted-foreground/60">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">{t('hero.encrypted')}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">{t('hero.gdpr')}</span>
            </div>
          </div>
        </motion.div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md bg-white rounded-[2.5rem] border-0 p-8">
          <h2 className="text-2xl font-black tracking-tighter uppercase italic text-center mb-6">{t('funnel.step4.title')}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { id: 'name', label: t('form.name'), type: 'text' },
              { id: 'phone', label: t('form.phone'), type: 'tel' },
              { id: 'email', label: t('form.email'), type: 'email' },
              { id: 'address', label: t('form.address'), type: 'text' }
            ].map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id} className="text-[10px] font-black uppercase tracking-widest ml-1">{field.label}</Label>
                <Input
                  id={field.id}
                  type={field.type}
                  required
                  value={(formData as any)[field.id]}
                  onChange={(e) => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                  className="bg-card/50 border-border/50 rounded-xl h-12 focus:ring-secondary"
                />
              </div>
            ))}
            <Button
              type="submit"
              className="w-full bg-secondary text-white hover:bg-secondary/90 font-black uppercase tracking-[0.2em] h-16 rounded-2xl mt-6 shadow-xl shadow-secondary/20 relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative z-10">{t('funnel.cta')}</span>
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  )
}
