'use client'

import { useState } from 'react'
import { useLanguage } from '@/app/context/language-context'
import { Button } from '@/components/ui/button'
import { 
  Brain, 
  PiggyBank, 
  Shield, 
  Wrench, 
  ChevronDown,
  CheckCircle2,
  Zap,
  Camera,
  FileText,
  CircleDollarSign,
  Timer,
  HeartHandshake
} from 'lucide-react'

interface FeaturesSectionProps {
  onCtaClick: () => void
}

const pillars = [
  {
    id: 'ai-diagnosis',
    icon: Brain,
    color: 'bg-secondary/10 text-secondary',
    iconBg: 'bg-secondary',
  },
  {
    id: 'time-cost',
    icon: PiggyBank,
    color: 'bg-emerald-500/10 text-emerald-600',
    iconBg: 'bg-emerald-500',
  },
  {
    id: 'reliability',
    icon: Shield,
    color: 'bg-primary/10 text-primary',
    iconBg: 'bg-primary',
  },
]

const aiSteps = [
  { icon: Camera, step: 1 },
  { icon: Brain, step: 2 },
  { icon: FileText, step: 3 },
  { icon: Wrench, step: 4 },
]

export function FeaturesSection({ onCtaClick }: FeaturesSectionProps) {
  const { t } = useLanguage()
  const [expandedPillar, setExpandedPillar] = useState<string | null>('ai-diagnosis')

  const togglePillar = (id: string) => {
    setExpandedPillar(expandedPillar === id ? null : id)
  }

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-secondary/10 text-secondary text-sm font-medium rounded-full mb-4">
            {t('features.badge')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
            {t('features.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            {t('features.subtitle')}
          </p>
        </div>

        {/* Three Pillars */}
        <div className="grid lg:grid-cols-3 gap-6 mb-16">
          {pillars.map((pillar) => {
            const isExpanded = expandedPillar === pillar.id
            return (
              <div
                key={pillar.id}
                className={`bg-card rounded-2xl border border-border overflow-hidden transition-all duration-300 ${
                  isExpanded ? 'ring-2 ring-secondary/50' : ''
                }`}
              >
                {/* Pillar Header */}
                <button
                  onClick={() => togglePillar(pillar.id)}
                  className="w-full p-6 flex items-start gap-4 text-left hover:bg-muted/50 transition-colors"
                >
                  <div className={`w-12 h-12 rounded-xl ${pillar.iconBg} flex items-center justify-center shrink-0`}>
                    <pillar.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-lg mb-1">
                      {t(`features.${pillar.id}.title`)}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {t(`features.${pillar.id}.tagline`)}
                    </p>
                  </div>
                  <ChevronDown 
                    className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-300 ${
                      isExpanded ? 'rotate-180' : ''
                    }`} 
                  />
                </button>

                {/* Expanded Content */}
                <div className={`overflow-hidden transition-all duration-300 ${
                  isExpanded ? 'max-h-[600px]' : 'max-h-0'
                }`}>
                  <div className="px-6 pb-6 space-y-4">
                    <div className="h-px bg-border" />
                    
                    {/* Pain Point */}
                    <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4">
                      <p className="text-sm text-destructive font-medium mb-1">
                        {t('features.painPoint')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t(`features.${pillar.id}.pain`)}
                      </p>
                    </div>

                    {/* Solution */}
                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
                      <p className="text-sm text-emerald-600 font-medium mb-1">
                        {t('features.solution')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t(`features.${pillar.id}.solution`)}
                      </p>
                    </div>

                    {/* Benefits List */}
                    <ul className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="text-sm text-foreground">
                            {t(`features.${pillar.id}.benefit${i}`)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* AI Diagnosis Deep Dive */}
        <div className="bg-card rounded-2xl border border-border p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Left: How It Works */}
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 text-secondary text-sm font-medium rounded-full mb-4">
                <Zap className="w-4 h-4" />
                {t('features.howItWorks')}
              </span>
              <h3 className="text-2xl font-bold text-foreground mb-6">
                {t('features.aiDeepDive.title')}
              </h3>

              {/* Steps */}
              <div className="space-y-6">
                {aiSteps.map((step, index) => (
                  <div key={step.step} className="flex gap-4">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                        <step.icon className="w-5 h-5 text-secondary-foreground" />
                      </div>
                      {index < aiSteps.length - 1 && (
                        <div className="absolute left-1/2 top-10 w-0.5 h-6 bg-border -translate-x-1/2" />
                      )}
                    </div>
                    <div className="flex-1 pb-2">
                      <h4 className="font-semibold text-foreground mb-1">
                        {t(`features.aiDeepDive.step${step.step}.title`)}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {t(`features.aiDeepDive.step${step.step}.desc`)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Stats & CTA */}
            <div className="bg-muted/50 rounded-2xl p-8">
              <h4 className="font-semibold text-foreground mb-6">
                {t('features.results.title')}
              </h4>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-card rounded-xl p-4 text-center">
                  <Timer className="w-6 h-6 text-secondary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">5 min</div>
                  <p className="text-xs text-muted-foreground">{t('features.results.diagnosis')}</p>
                </div>
                <div className="bg-card rounded-xl p-4 text-center">
                  <CircleDollarSign className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">40%</div>
                  <p className="text-xs text-muted-foreground">{t('features.results.savings')}</p>
                </div>
                <div className="bg-card rounded-xl p-4 text-center">
                  <CheckCircle2 className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">95%</div>
                  <p className="text-xs text-muted-foreground">{t('features.results.accuracy')}</p>
                </div>
                <div className="bg-card rounded-xl p-4 text-center">
                  <HeartHandshake className="w-6 h-6 text-destructive mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">4.9/5</div>
                  <p className="text-xs text-muted-foreground">{t('features.results.satisfaction')}</p>
                </div>
              </div>

              <Button 
                onClick={onCtaClick}
                className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold"
                size="lg"
              >
                {t('features.cta')}
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-3">
                {t('features.ctaSubtext')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
