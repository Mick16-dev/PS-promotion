'use client'

import { useState, useCallback } from 'react'
import { Upload, Droplet, CircleOff, Wrench, Plus, CheckCircle, Clock, Loader2 } from 'lucide-react'
import { useLanguage } from '@/app/context/language-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'

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

export function HeroSection() {
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
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    if (formData.issueType) {
      setEstimate(calculateEstimate(formData.issueType, formData.severity))
    }
    
    setIsSubmitting(false)
    setIsSuccess(true)
  }

  const issueCategories: { type: IssueCategory; icon: React.ReactNode; color: string }[] = [
    { type: 'leaking', icon: <Droplet className="w-6 h-6" />, color: 'text-blue-500' },
    { type: 'clogged', icon: <CircleOff className="w-6 h-6" />, color: 'text-amber-500' },
    { type: 'broken', icon: <Wrench className="w-6 h-6" />, color: 'text-red-500' },
    { type: 'installation', icon: <Plus className="w-6 h-6" />, color: 'text-emerald-500' }
  ]

  const severityLabels = [
    t('severity.1'),
    t('severity.2'),
    t('severity.3'),
    t('severity.4'),
    t('severity.5')
  ]

  if (isSuccess) {
    return (
      <section className="pt-24 pb-16 px-4 min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30">
        <Card className="w-full max-w-lg border-success/30 shadow-xl">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-success/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-success" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">{t('funnel.success.title')}</h2>
            <p className="text-muted-foreground mb-6">{t('funnel.success.desc')}</p>
            
            {estimate && (
              <div className="bg-muted/50 rounded-2xl p-6 mb-6">
                <p className="text-sm text-muted-foreground mb-2">Preliminary Estimate</p>
                <p className="text-3xl font-bold text-foreground">
                  {estimate.min} - {estimate.max} EUR
                </p>
              </div>
            )}
            
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Clock className="w-5 h-5" />
              <span>{t('funnel.success.eta')}: <strong className="text-foreground">15-30 min</strong></span>
            </div>
          </CardContent>
        </Card>
      </section>
    )
  }

  return (
    <section className="pt-24 pb-16 px-4 min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-4xl mx-auto">
        {/* Hero Text */}
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium bg-primary/10 text-primary rounded-full">
            {t('hero.badge')}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance leading-tight">
            {t('hero.title')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            {t('hero.subtitle')}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                s === step ? 'w-8 bg-secondary' : s < step ? 'w-8 bg-success' : 'w-8 bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Image Upload */}
        {step === 1 && (
          <Card className="shadow-xl">
            <CardContent className="pt-8 pb-8">
              <h2 className="text-xl font-semibold text-foreground text-center mb-6">{t('funnel.step1.title')}</h2>
              <div
                onDrop={handleImageDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-border rounded-2xl p-12 text-center cursor-pointer hover:border-secondary hover:bg-secondary/5 transition-all"
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-lg font-medium text-foreground mb-1">{t('funnel.step1.desc')}</p>
                  <p className="text-sm text-muted-foreground">{t('funnel.step1.formats')}</p>
                </label>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Issue Category */}
        {step === 2 && (
          <Card className="shadow-xl">
            <CardContent className="pt-8 pb-8">
              <div className="flex items-center gap-4 mb-6">
                {formData.imagePreview && (
                  <img 
                    src={formData.imagePreview} 
                    alt="Uploaded issue" 
                    className="w-20 h-20 object-cover rounded-xl"
                  />
                )}
                <div>
                  <h2 className="text-xl font-semibold text-foreground">{t('funnel.step2.title')}</h2>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {issueCategories.map(({ type, icon, color }) => (
                  <button
                    key={type}
                    onClick={() => handleIssueSelect(type)}
                    className={`p-6 rounded-2xl border-2 transition-all hover:border-secondary hover:shadow-md ${
                      formData.issueType === type ? 'border-secondary bg-secondary/5' : 'border-border bg-card'
                    }`}
                  >
                    <div className={`${color} mb-3`}>{icon}</div>
                    <p className="font-medium text-foreground">{t(`issue.${type}`)}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Severity Slider */}
        {step === 3 && (
          <Card className="shadow-xl">
            <CardContent className="pt-8 pb-8">
              <h2 className="text-xl font-semibold text-foreground text-center mb-2">{t('funnel.step3.title')}</h2>
              <p className="text-muted-foreground text-center mb-8">{t('funnel.step3.desc')}</p>
              
              <div className="max-w-md mx-auto">
                <div className="mb-8">
                  <Slider
                    value={[formData.severity]}
                    onValueChange={handleSeverityChange}
                    min={1}
                    max={5}
                    step={1}
                    className="w-full"
                  />
                </div>
                
                <div className="flex justify-between text-sm mb-8">
                  {severityLabels.map((label, i) => (
                    <span 
                      key={i} 
                      className={`${formData.severity === i + 1 ? 'text-foreground font-medium' : 'text-muted-foreground'}`}
                    >
                      {label}
                    </span>
                  ))}
                </div>

                <div className={`text-center p-4 rounded-2xl mb-6 ${
                  formData.severity >= 4 ? 'bg-destructive/10 text-destructive' : 
                  formData.severity >= 3 ? 'bg-amber-500/10 text-amber-600' : 
                  'bg-success/10 text-success'
                }`}>
                  <p className="font-semibold text-lg">{severityLabels[formData.severity - 1]}</p>
                </div>

                <Button 
                  onClick={handleSeverityContinue}
                  className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold"
                  size="lg"
                >
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Contact Form - CTA #1 */}
        {step === 4 && (
          <Card className="shadow-xl">
            <CardContent className="pt-8 pb-8">
              <h2 className="text-xl font-semibold text-foreground text-center mb-6">{t('funnel.step4.title')}</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
                <div>
                  <Label htmlFor="name" className="text-foreground">{t('form.name')}</Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1.5"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone" className="text-foreground">{t('form.phone')}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="mt-1.5"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-foreground">{t('form.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="mt-1.5"
                  />
                </div>
                
                <div>
                  <Label htmlFor="address" className="text-foreground">{t('form.address')}</Label>
                  <Input
                    id="address"
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    className="mt-1.5"
                  />
                </div>

                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold mt-6"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    t('funnel.cta')
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  )
}
