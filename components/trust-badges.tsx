'use client'

import { useLanguage } from '@/app/context/language-context'
import { Clock, Award, Shield, BadgeCheck } from 'lucide-react'

const trustItems = [
  {
    icon: Clock,
    keyEn: '30 min average response',
    keyDe: '30 Min. durchschnittliche Reaktionszeit',
    stat: '30',
    unit: 'min'
  },
  {
    icon: Award,
    keyEn: 'Certified Technicians',
    keyDe: 'Zertifizierte Techniker',
    stat: '50+',
    unit: ''
  },
  {
    icon: Shield,
    keyEn: 'Satisfaction Guarantee',
    keyDe: 'Zufriedenheitsgarantie',
    stat: '100%',
    unit: ''
  },
  {
    icon: BadgeCheck,
    keyEn: 'Fully Insured',
    keyDe: 'Vollversichert',
    stat: '2M',
    unit: 'EUR'
  }
]

export function TrustBadges() {
  const { language, t } = useLanguage()

  return (
    <section className="py-16 px-4 bg-primary">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-primary-foreground text-center mb-10 text-balance">
          {t('trust.title')}
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {trustItems.map((item, index) => (
            <div 
              key={index}
              className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-6 text-center"
            >
              <div className="w-14 h-14 mx-auto mb-4 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                <item.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <div className="text-3xl font-bold text-primary-foreground mb-1">
                {item.stat}
                {item.unit && <span className="text-lg ml-1">{item.unit}</span>}
              </div>
              <p className="text-sm text-primary-foreground/80">
                {language === 'de' ? item.keyDe : item.keyEn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
