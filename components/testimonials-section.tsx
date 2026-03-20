'use client'

import { useLanguage } from '@/app/context/language-context'
import { motion } from 'framer-motion'
import { Star, CheckCircle, Quote, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

const testimonials = [
  {
    id: 1,
    nameEn: 'Michael Beyer',
    nameDe: 'Michael Beyer',
    locationEn: 'Bremen-Walle',
    locationDe: 'Bremen-Walle',
    rating: 5,
    textEn: 'The 3D pipe mapping was incredibly precise. They found the blockage in our industrial sewer network within minutes. Technical mastery at its best.',
    textDe: 'Die 3D-Rohrortung war unglaublich präzise. Sie haben die Verstopfung in unserem industriellen Sielnetz innerhalb von Minuten gefunden. Technische Perfektion.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: 2,
    nameEn: 'Sabine Weber',
    nameDe: 'Sabine Weber',
    locationEn: 'Bremen-Horn',
    locationDe: 'Bremen-Horn',
    rating: 5,
    textEn: 'Rotek handled our grease trap overflow with zero downtime for our restaurant. The digital protocol they provided was perfect for our documentation.',
    textDe: 'Rotek hat unseren Fettabscheider-Überlauf ohne Ausfallzeit für unser Restaurant behoben. Das digitale Protokoll war perfekt für unsere Unterlagen.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: 3,
    nameEn: 'Thomas Krause',
    nameDe: 'Thomas Krause',
    locationEn: 'Verden (Aller)',
    locationDe: 'Verden (Aller)',
    rating: 5,
    textEn: 'Finally a company that understands complex drainage systems. Their TV-inspection cleared up issues two other firms could not identify.',
    textDe: 'Endlich ein Unternehmen, das komplexe Entwässerungssysteme versteht. Ihre TV-Untersuchung hat Probleme geklärt, die andere Firmen nicht identifizieren konnten.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: 4,
    nameEn: 'Jürgen Meyer',
    nameDe: 'Jürgen Meyer',
    locationEn: 'Bremen-Nord',
    locationDe: 'Bremen-Nord',
    rating: 5,
    textEn: 'Fast deployment during the storm. Vehicle 7 was on-site in under 20 minutes. Professional equipment and highly skilled staff.',
    textDe: 'Schneller Einsatz während des Unwetters. Fahrzeug 7 war in unter 20 Minuten vor Ort. Professionelles Equipment und sehr fähiges Personal.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
  }
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i < rating ? 'fill-red-600 text-red-600' : 'text-white/10'}`}
        />
      ))}
    </div>
  )
}

export function TestimonialsSection() {
  const { language, t } = useLanguage()

  return (
    <section className="py-20 px-4 relative overflow-hidden bg-[#0A0B0D]">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-white/5" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-left mb-20 border-l-8 border-red-600 pl-8"
        >
          <h2 className="text-4xl sm:text-6xl font-black text-white mb-6 tracking-tighter uppercase italic leading-none">
            {language === 'de' ? 'Einsatzberichte.' : 'Field Reports.'}
          </h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-12">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-4">
                <StarRating rating={5} />
                <span className="font-black text-white text-2xl tracking-tighter italic">4.9/5</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-red-600">{t('testimonials.globalScore')}</span>
            </div>
            <div className="w-px h-12 bg-white/10 hidden sm:block" />
            <div className="flex flex-col gap-1">
              <span className="font-black text-white text-2xl tracking-tighter italic">11.000+</span>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">{t('testimonials.casesResolved')}</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative bg-white/[0.01] border border-white/10 p-10 rounded-none hover:bg-white/[0.03] transition-all duration-500 hover:border-red-600/50"
            >
              <div className="absolute top-8 right-10 opacity-5 group-hover:opacity-10 transition-opacity">
                <Quote className="w-16 h-16 text-red-600 fill-current" />
              </div>

              <div className="flex items-center gap-6 mb-8">
                <div className="w-14 h-14 rounded-none overflow-hidden border border-white/10 shadow-xl grayscale group-hover:grayscale-0 transition-all duration-500">
                  <img
                    src={testimonial.avatar}
                    alt={language === 'de' ? testimonial.nameDe : testimonial.nameEn}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight italic">
                    {language === 'de' ? testimonial.nameDe : testimonial.nameEn}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-red-600">
                      {language === 'de' ? testimonial.locationDe : testimonial.locationEn}
                    </span>
                    <div className="w-1 h-1 bg-white/20" />
                    <StarRating rating={testimonial.rating} />
                  </div>
                </div>
              </div>

              <p className="text-slate-400 font-medium leading-relaxed italic text-base">
                &ldquo;{language === 'de' ? testimonial.textDe : testimonial.textEn}&rdquo;
              </p>

              <div className="mt-8 flex items-center gap-3 pt-6 border-t border-white/5">
                <ShieldCheck className="w-4 h-4 text-red-600" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
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
