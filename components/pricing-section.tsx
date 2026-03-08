'use client'

import { useLanguage } from '@/app/context/language-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'

const plans = [
  {
    id: 'basic',
    nameKey: 'pricing.basic',
    price: 99,
    period: 'month',
    featuresEn: [
      'Standard response time (2-4 hours)',
      'Basic diagnostics',
      'Email support',
      'Standard parts warranty'
    ],
    featuresDe: [
      'Standard-Reaktionszeit (2-4 Stunden)',
      'Basis-Diagnose',
      'E-Mail-Support',
      'Standard-Teile-Garantie'
    ],
    popular: false
  },
  {
    id: 'standard',
    nameKey: 'pricing.standard',
    price: 199,
    period: 'month',
    featuresEn: [
      'Priority response (under 1 hour)',
      'AI-powered diagnostics',
      '24/7 phone support',
      'Extended parts warranty',
      'Quarterly maintenance check'
    ],
    featuresDe: [
      'Prioritäts-Reaktion (unter 1 Stunde)',
      'KI-gestützte Diagnose',
      '24/7 Telefon-Support',
      'Erweiterte Teile-Garantie',
      'Vierteljährliche Wartung'
    ],
    popular: true
  },
  {
    id: 'premium',
    nameKey: 'pricing.premium',
    price: 399,
    period: 'month',
    featuresEn: [
      'Emergency priority (under 30 min)',
      'Advanced AI diagnostics + video',
      'Dedicated account manager',
      'Lifetime parts warranty',
      'Monthly preventive maintenance',
      'Free emergency calls'
    ],
    featuresDe: [
      'Notfall-Priorität (unter 30 Min)',
      'Erweiterte KI-Diagnose + Video',
      'Persönlicher Ansprechpartner',
      'Lebenslange Teile-Garantie',
      'Monatliche Prävention',
      'Kostenlose Notrufe'
    ],
    popular: false
  }
]

export function PricingSection() {
  const { language, t } = useLanguage()

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 text-balance">
            {t('pricing.title')}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('pricing.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative border-2 ${
                plan.popular 
                  ? 'border-secondary shadow-xl scale-105' 
                  : 'border-border shadow-lg'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-secondary text-secondary-foreground text-sm font-semibold rounded-full">
                  {t('pricing.popular')}
                </div>
              )}
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl text-foreground">{t(plan.nameKey)}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground"> EUR/{language === 'de' ? 'Monat' : 'month'}</span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-3 mb-6">
                  {(language === 'de' ? plan.featuresDe : plan.featuresEn).map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {/* CTA #4 */}
                <Button 
                  className={`w-full font-semibold ${
                    plan.popular 
                      ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90' 
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                  size="lg"
                >
                  {t('pricing.cta')}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
