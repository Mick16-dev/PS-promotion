'use client'

import { useLanguage } from '@/app/context/language-context'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, CheckCircle, UserCheck } from 'lucide-react'

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
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    hasVideo: true
  },
  {
    id: 2,
    nameEn: 'Anna Mueller',
    nameDe: 'Anna Müller',
    locationEn: 'Munich',
    locationDe: 'München',
    rating: 5,
    textEn: 'They explained the costs very clearly on the phone and stuck to it on site. No unpleasant surprises on the invoice.',
    textDe: 'Die Kosten wurden am Telefon sehr klar erklärt und vor Ort eingehalten. Keine unangenehmen Überraschungen auf der Rechnung.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    hasVideo: false
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
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    hasVideo: true
  },
  {
    id: 4,
    nameEn: 'Sarah Klein',
    nameDe: 'Sarah Klein',
    locationEn: 'Frankfurt',
    locationDe: 'Frankfurt',
    rating: 5,
    textEn: 'They came the same day because our only toilet was blocked. Fast, friendly and they left everything clean.',
    textDe: 'Sie kamen noch am selben Tag, weil unsere einzige Toilette verstopft war. Schnell, freundlich und alles sauber hinterlassen.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    hasVideo: false
  }
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          className={`w-3.5 h-3.5 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-muted/30'}`} 
        />
      ))}
    </div>
  )
}

export function TestimonialsSection() {
  const { language, t } = useLanguage()

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  } as any

  return (
    <section id="reviews" className="py-32 px-4 relative overflow-hidden bg-background">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 text-success text-xs font-semibold rounded-xl uppercase tracking-[0.15em] mb-6">
            <UserCheck className="w-4 h-4" />
            {language === 'de' ? 'Erfahrungen von Kunden' : 'What customers tell us'}
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 tracking-tight">
            {t('testimonials.title')}
          </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-muted-foreground bg-muted/30 p-5 rounded-xl border border-border/60 max-w-3xl mx-auto">
            <div className="flex flex-col items-center gap-2">
               <div className="flex items-center gap-1">
                 <StarRating rating={5} />
                 <span className="font-black text-foreground text-2xl tracking-tighter italic ml-2">4.9/5</span>
               </div>
               <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground/60">
                 {language === 'de' ? 'Durchschnittliche Bewertung' : 'Average rating'}
               </span>
            </div>
            <div className="w-px h-12 bg-border hidden sm:block" />
            <div className="flex flex-col items-center gap-2">
               <span className="font-semibold text-foreground text-2xl tracking-tight text-secondary">500+</span>
               <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground/60">
                 {language === 'de' ? 'Einsätze pro Jahr' : 'Jobs per year'}
               </span>
            </div>
          </div>
        </motion.div>

          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
          >
          {testimonials.map((testimonial) => (
              <motion.div 
                key={testimonial.id}
                variants={item}
                className="relative bg-card border border-border rounded-2xl p-6 lg:p-7 shadow-sm"
              >

              <div className="flex items-center gap-6 mb-10 relative z-10">
                <div className="relative">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-border shadow-sm">
                    <img 
                      src={testimonial.avatar} 
                      alt={language === 'de' ? testimonial.nameDe : testimonial.nameEn}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight">
                      {language === 'de' ? testimonial.nameDe : testimonial.nameEn}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3">
                     <p className="text-xs font-black uppercase tracking-[0.2em] text-secondary">
                        {language === 'de' ? testimonial.locationDe : testimonial.locationEn}
                     </p>
                     <div className="w-1 h-1 rounded-full bg-border" />
                     <StarRating rating={testimonial.rating} />
                  </div>
                </div>
              </div>

              <p className="text-sm sm:text-base text-foreground/80 leading-relaxed relative z-10">
                &ldquo;{language === 'de' ? testimonial.textDe : testimonial.textEn}&rdquo;
              </p>

              <div className="mt-6 flex items-center gap-3 py-3 border-t border-dashed border-border/60 relative z-10">
                <div className="w-6 h-6 bg-success/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-3.5 h-3.5 text-success" />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-success/80">
                  {t('testimonials.verified') || "Verified customer"}
                </span>
                <ShieldCheck className="w-4 h-4 text-secondary ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
