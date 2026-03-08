'use client'

import { useLanguage } from '@/app/context/language-context'
import { Card, CardContent } from '@/components/ui/card'
import { Star, CheckCircle, Play } from 'lucide-react'
import { useState } from 'react'

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
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          className={`w-4 h-4 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-muted'}`} 
        />
      ))}
    </div>
  )
}

export function TestimonialsSection() {
  const { language, t } = useLanguage()
  const [videoModal, setVideoModal] = useState<number | null>(null)

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 text-balance">
            {t('testimonials.title')}
          </h2>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <StarRating rating={5} />
            <span className="font-medium">4.9/5</span>
            <span>from 500+ reviews</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <img 
                      src={testimonial.avatar} 
                      alt={language === 'de' ? testimonial.nameDe : testimonial.nameEn}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    {testimonial.hasVideo && (
                      <button 
                        onClick={() => setVideoModal(testimonial.id)}
                        className="absolute -bottom-1 -right-1 w-6 h-6 bg-destructive rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                      >
                        <Play className="w-3 h-3 text-destructive-foreground fill-current" />
                      </button>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">
                        {language === 'de' ? testimonial.nameDe : testimonial.nameEn}
                      </h3>
                      <CheckCircle className="w-4 h-4 text-success" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {language === 'de' ? testimonial.locationDe : testimonial.locationEn}
                    </p>
                    <StarRating rating={testimonial.rating} />
                  </div>
                </div>
                <p className="mt-4 text-foreground leading-relaxed">
                  &ldquo;{language === 'de' ? testimonial.textDe : testimonial.textEn}&rdquo;
                </p>
                <div className="mt-3 flex items-center gap-1 text-xs text-success">
                  <CheckCircle className="w-3 h-3" />
                  <span>{t('testimonials.verified')}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Video Modal */}
        {videoModal && (
          <div 
            className="fixed inset-0 z-50 bg-foreground/80 flex items-center justify-center p-4"
            onClick={() => setVideoModal(null)}
          >
            <div className="bg-card rounded-2xl p-6 max-w-lg w-full text-center">
              <p className="text-muted-foreground mb-4">Video testimonial coming soon</p>
              <button 
                onClick={() => setVideoModal(null)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
