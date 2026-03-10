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

  const handleSeverityContinue = () => {
    setStep(4)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate Blueprint Scanning phase
    await new Promise(resolve => setTimeout(resolve, 3500))

    if (formData.issueType) {
      setEstimate(calculateEstimate(formData.issueType, formData.severity))
    }

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
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  }

  return (
    <section className="relative pt-32 pb-24 px-4 min-h-screen bg-background overflow-hidden">

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

          <h1 className="text-5xl sm:text-6xl font-black text-foreground mb-6 leading-[1.05] tracking-tighter italic uppercase">
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
              <span className="text-sm font-bold uppercase tracking-wider text-foreground">Verified Experts</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-secondary" />
              </div>
              <span className="text-sm font-bold uppercase tracking-wider text-foreground">15m Response</span>
            </div>
          </div>
        </motion.div>

        {/* Simple contact form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex-1 w-full max-w-lg"
        >
          <Card className="overflow-hidden rounded-2xl border border-border shadow-md">
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                {t('form.simpleTitle') || 'Request a call back'}
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                {t('form.simpleSubtitle') || 'Tell us briefly what is wrong and we call you back as soon as possible.'}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { id: 'name', label: t('form.name'), type: 'text' },
                  { id: 'phone', label: t('form.phone'), type: 'tel' },
                  { id: 'email', label: t('form.email'), type: 'email' },
                  { id: 'address', label: t('form.address'), type: 'text' }
                ].map((field) => (
                  <div key={field.id} className="space-y-1">
                    <Label htmlFor={field.id}>{field.label}</Label>
                    <Input
                      id={field.id}
                      type={field.type}
                      required
                      value={(formData as any)[field.id]}
                      onChange={(e) => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                    />
                  </div>
                ))}

                <div className="space-y-1">
                  <Label htmlFor="message">{t('form.message') || 'Describe the problem'}</Label>
                  <textarea
                    id="message"
                    rows={3}
                    value={formData as any && (formData as any).message}
                    onChange={(e) =>
                      setFormData(prev => ({ ...(prev as any), message: e.target.value }))
                    }
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : t('funnel.cta')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
