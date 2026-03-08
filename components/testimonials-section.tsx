'use client'

import { useLanguage } from '@/app/context/language-context'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, CheckCircle, Play, Quote, X, Sparkles, UserCheck } from 'lucide-react'
import { useState } from 'react'
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
    textEn: 'The AI diagnosis tool gave me an accurate estimate before they even arrived. No surprises with the final bill. Great service!',
    textDe: 'Das KI-Diagnose-Tool gab mir eine genaue Schätzung, bevor sie überhaupt ankamen. Keine Überraschungen bei der Endabrechnung. Toller Service!',
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
    textEn: 'Signed up for the maintenance plan. They come quarterly and have prevented two potential emergencies already.',
    textDe: 'Habe den Wartungsplan abgeschlossen. Sie kommen vierteljährlich und haben bereits zwei potenzielle Notfälle verhindert.',
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
  const [videoModal, setVideoModal] = useState<number | null>(null)

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
    <section className="py-32 px-4 relative overflow-hidden bg-background">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 text-success text-xs font-black rounded-xl uppercase tracking-[0.2em] mb-6">
            <UserCheck className="w-4 h-4" />
            Verified Elite Reviews
          </span>
          <h2 className="text-4xl sm:text-6xl font-black text-foreground mb-8 tracking-tighter italic uppercase underline decoration-success decoration-8 underline-offset-8">
            {t('testimonials.title')}
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-muted-foreground bg-muted/30 p-8 rounded-[2rem] border border-border/50 max-w-3xl mx-auto backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
               <div className="flex items-center gap-1">
                 <StarRating rating={5} />
                 <span className="font-black text-foreground text-2xl tracking-tighter italic ml-2">4.9/5</span>
               </div>
               <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Global Satisfaction Score</span>
            </div>
            <div className="w-px h-12 bg-border hidden sm:block" />
            <div className="flex flex-col items-center gap-2">
               <span className="font-black text-foreground text-2xl tracking-tighter italic uppercase text-secondary">500+</span>
               <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Verified Cases Resolved</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12"
        >
          {testimonials.map((testimonial) => (
            <motion.div 
              key={testimonial.id}
              variants={item}
              whileHover={{ y: -10 }}
              className="group relative bg-white/50 backdrop-blur-xl border border-white/60 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-8 lg:p-12 rounded-[3.5rem] overflow-hidden transition-all duration-500 hover:bg-white hover:border-primary/20"
            >
              <div className="absolute top-8 right-12 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Quote className="w-24 h-24 text-primary fill-current" />
              </div>

              <div className="flex items-center gap-6 mb-10 relative z-10">
                <div className="relative">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl group-hover:rotate-3 transition-transform duration-500">
                    <img 
                      src={testimonial.avatar} 
                      alt={language === 'de' ? testimonial.nameDe : testimonial.nameEn}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {testimonial.hasVideo && (
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setVideoModal(testimonial.id)}
                      className="absolute -bottom-2 -right-2 w-10 h-10 bg-secondary rounded-2xl flex items-center justify-center shadow-lg hover:shadow-secondary/30 transition-shadow animate-pulse-premium"
                    >
                      <Play className="w-4 h-4 text-white fill-current" />
                    </motion.button>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl sm:text-2xl font-black text-foreground italic uppercase tracking-tighter">
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

              <p className="text-xl sm:text-2xl font-medium text-foreground/80 leading-relaxed italic relative z-10">
                &ldquo;{language === 'de' ? testimonial.textDe : testimonial.textEn}&rdquo;
              </p>

              <div className="mt-10 flex items-center gap-3 py-4 border-t border-dashed border-border/50 relative z-10">
                <div className="w-6 h-6 bg-success/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-3.5 h-3.5 text-success" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-success/70">
                  {t('testimonials.verified') || "Verified Professional Intervention"}
                </span>
                <Sparkles className="w-4 h-4 text-secondary ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Cinematic Video Modal */}
        <AnimatePresence>
          {videoModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6 sm:p-12 cursor-pointer"
              onClick={() => setVideoModal(null)}
            >
              <button 
                className="absolute top-8 right-8 w-16 h-16 bg-white/10 text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                onClick={() => setVideoModal(null)}
              >
                <X className="w-8 h-8" />
              </button>

              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="w-full max-w-5xl aspect-video bg-white/5 rounded-[3rem] border border-white/10 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden group"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-secondary/10 via-transparent to-primary/10 opacity-50" />
                <div className="w-24 h-24 bg-secondary text-white rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(251,191,36,0.5)] mb-8 group-hover:scale-110 transition-transform duration-500">
                  <Play className="w-10 h-10 fill-current ml-1" />
                </div>
                <h4 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-4">
                  {t('testimonials.videoTitle') || "Case #892: Professional Restoration"}
                </h4>
                <p className="text-white/40 font-black uppercase tracking-[0.3em] text-sm italic">
                  Cinematic Testimonial Loading...
                </p>
                
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4">
                   <div className="h-[2px] w-48 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="h-full bg-secondary"
                      />
                   </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
