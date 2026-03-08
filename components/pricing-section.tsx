'use client'

import { useLanguage } from '@/app/context/language-context'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Check, ShieldCheck, Clock, Crown, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'

const plans = [
  {
    id: 'basic',
    nameKey: 'pricing.basic',
    price: 99,
    icon: ShieldCheck,
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
    icon: Clock,
    featuresEn: [
      'Priority response (under 1 hour)',
      'Master digital diagnostics',
      '24/7 phone support',
      'Extended parts warranty',
      'Quarterly maintenance check'
    ],
    featuresDe: [
      'Prioritäts-Reaktion (unter 1 Stunde)',
      'Digitale Meister-Diagnose',
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
    icon: Crown,
    featuresEn: [
      'Emergency priority (under 30 min)',
      'Advanced master diagnostics + video',
      'Dedicated account manager',
      'Lifetime parts warranty',
      'Monthly preventive maintenance',
      'Free emergency calls'
    ],
    featuresDe: [
      'Notfall-Priorität (unter 30 Min)',
      'Erweiterte Meister-Diagnose + Video',
      'Persönlicher Ansprechpartner',
      'Lebenslange Teile-Garantie',
      'Monatliche Prävention',
      'Kostenlose Notrufe'
    ],
    popular: false
  }
]

interface PricingSectionProps {
  onCtaClick: () => void
}

export function PricingSection({ onCtaClick }: PricingSectionProps) {
  const { language, t } = useLanguage()

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const item = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  }

  return (
    <section className="py-32 px-4 relative overflow-hidden bg-background">
      <div className="absolute inset-0 mesh-gradient opacity-10" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-xs font-black rounded-xl uppercase tracking-[0.2em] mb-6">
            <ShieldCheck className="w-4 h-4" />
            Pricing & Protection Plans
          </span>
          <h2 className="text-4xl sm:text-6xl font-black text-foreground mb-6 tracking-tighter italic uppercase underline decoration-secondary decoration-8 underline-offset-8">
            {t('pricing.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed italic">
            {t('pricing.subtitle')}
          </p>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 items-center"
        >
          {plans.map((plan) => (
            <motion.div 
              key={plan.id} 
              variants={item as any}
              whileHover={{ y: -10 }}
              className={cn(
                "relative group p-8 lg:p-10 rounded-[3.5rem] transition-all duration-500",
                plan.popular 
                  ? "bg-primary border-4 border-secondary text-primary-foreground shadow-2xl shadow-primary/40 scale-105 z-20" 
                  : "bg-white/50 backdrop-blur-xl border border-white/60 text-foreground"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-6 py-2 bg-secondary text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 fill-current" />
                  {t('pricing.popular')}
                </div>
              )}
              
              <div className="mb-10 text-center">
                 <div className={cn(
                   "w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6",
                   plan.popular ? "bg-white/10" : "bg-primary/10"
                 )}>
                   <plan.icon className={cn("w-7 h-7", plan.popular ? "text-secondary" : "text-primary")} />
                 </div>
                 <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-4">
                    {t(plan.nameKey)}
                 </h3>
                 <div className="flex items-baseline justify-center gap-1">
                   <span className="text-xs font-black uppercase tracking-widest opacity-50">EUR</span>
                   <span className="text-5xl font-black italic tracking-tighter">{plan.price}</span>
                   <span className={cn(
                     "text-xs font-black uppercase tracking-widest",
                     plan.popular ? "text-white/60" : "text-muted-foreground"
                   )}>/{language === 'de' ? 'Monat' : 'month'}</span>
                 </div>
              </div>

              <div className={cn(
                "h-px w-full mb-10 border-0",
                plan.popular ? "bg-white/20" : "bg-border/50"
              )} />

              <ul className="space-y-5 mb-12">
                {(language === 'de' ? plan.featuresDe : plan.featuresEn).map((feature, i) => (
                  <li key={i} className="flex items-center gap-4">
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center shrink-0",
                      plan.popular ? "bg-secondary" : "bg-success/20"
                    )}>
                      <Check className={cn("w-3 h-3 text-white", !plan.popular && "text-success")} strokeWidth={4} />
                    </div>
                    <span className="text-sm font-bold tracking-tight opacity-90">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                onClick={onCtaClick}
                className={cn(
                  "w-full h-16 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 group relative overflow-hidden",
                  plan.popular 
                    ? "bg-secondary text-white hover:bg-secondary/90 shadow-secondary/20" 
                    : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/10"
                )}
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <span className="relative z-10">{t('pricing.cta')}</span>
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
