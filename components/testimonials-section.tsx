'use client'

import { useLanguage } from '@/app/context/language-context'
import { motion } from 'framer-motion'
import { Star, CheckCircle, Quote, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

const testimonials = [
  {
    id: 1,
    nameEn: 'Michael Schmidt',
    nameDe: 'Michael Schmidt',
    locationEn: 'Berlin',
    locationDe: 'Berlin',
    rating: 5,
    textEn: 'Emergency call at 11 PM and they arrived within 25 minutes. Professional, clean work, and fair pricing. Highly recommend!',
    textDe: 'Notfall um 23 Uhr und sie waren innerhalb von 25 Minuten da. Professionell, saubere Arbeit und faire Preise. Sehr empfehlenswert!',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: 2,
    nameEn: 'Anna Mueller',
    nameDe: 'Anna Müller',
    locationEn: 'Munich',
    locationDe: 'München',
    rating: 5,
    textEn: 'The expert diagnosis tool gave me an accurate estimate before they even arrived. No surprises with the final bill. Great service!',
    textDe: 'Das Experten-Diagnose-Tool gab mir eine genaue Schätzung, bevor sie überhaupt ankamen. Keine Überraschungen bei der Endabrechnung. Toller Service!',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: 3,
    nameEn: 'Thomas Weber',
    nameDe: 'Thomas Weber',
    locationEn: 'Hamburg',
    locationDe: 'Hamburg',
    rating: 5,
    textEn: 'Fixed a complex pipe issue that two other plumbers could not solve. True experts in their field.',
    textDe: 'Haben ein komplexes Rohrproblem gelöst, das zwei andere Klempner nicht beheben konnten. Echte Experten auf ihrem Gebiet.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: 4,
    nameEn: 'Sarah Klein',
    nameDe: 'Sarah Klein',
    locationEn: 'Frankfurt',
    locationDe: 'Frankfurt',
    rating: 5,
    textEn: 'Signed up for the maintenance plan. They come quarterly and have prevented two potential emergencies already.',
    textDe: 'Habe den Wartungsplan abgeschlossen. Sie kommen vierteljährlich und haben bereits zwei potenzielle Notfälle verhindert.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
  }
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-3 h-3 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-muted/30'}`}
        />
      ))}
    </div>
  )
}

export function TestimonialsSection() {
  const { language, t } = useLanguage()

  return (
    <section className="py-16 sm:py-20 px-4 relative overflow-hidden bg-background">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-4xl font-bold text-foreground mb-6 tracking-tight uppercase">
            {t('testimonials.title')}
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 text-muted-foreground bg-muted/30 p-5 rounded-xl border border-border/50 max-w-md mx-auto">
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1">
                <StarRating rating={5} />
                <span className="font-bold text-foreground text-lg ml-2">4.9/5</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{t('testimonials.globalScore')}</span>
            </div>
            <div className="w-px h-8 bg-border hidden sm:block" />
            <div className="flex flex-col items-center gap-1">
              <span className="font-bold text-foreground text-lg">500+</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{t('testimonials.casesResolved')}</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative bg-white border border-slate-200 p-6 rounded-2xl hover:shadow-lg transition-all duration-300"
            >
              <div className="absolute top-4 right-6 opacity-5">
                <Quote className="w-12 h-12 text-slate-900 fill-current" />
              </div>

              <div className="flex items-center gap-4 mb-5">
                <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-slate-100 shadow-sm">
                  <img
                    src={testimonial.avatar}
                    alt={language === 'de' ? testimonial.nameDe : testimonial.nameEn}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {language === 'de' ? testimonial.nameDe : testimonial.nameEn}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">
                      {language === 'de' ? testimonial.locationDe : testimonial.locationEn}
                    </span>
                    <div className="w-0.5 h-0.5 rounded-full bg-slate-300" />
                    <StarRating rating={testimonial.rating} />
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                &ldquo;{language === 'de' ? testimonial.textDe : testimonial.textEn}&rdquo;
              </p>

              <div className="mt-4 flex items-center gap-2 pt-3 border-t border-slate-100">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-green-600/70">
                  {t('testimonials.verified')}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
