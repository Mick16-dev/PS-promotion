'use client'

import { Phone, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/app/context/language-context'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { services } from '@/lib/services-data'

interface HeaderProps {
  onEmergencyClick: () => void
}

export function Header({ onEmergencyClick }: HeaderProps) {
  const { language, setLanguage } = useLanguage()
  const [isServicesOpen, setIsServicesOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18">
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-card border border-border/60 rounded-lg flex items-center justify-center p-1.5">
              <img
                src="/logo-custom.svg"
                alt="Rotek"
                className="w-full h-full object-contain opacity-90"
              />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">Rotek</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            <Link
              href="/"
              className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              {language === 'de' ? 'Start' : 'Home'}
            </Link>
            <div
              className="relative"
              onMouseEnter={() => setIsServicesOpen(true)}
              onMouseLeave={() => setIsServicesOpen(false)}
            >
              <Link
                href="/services"
                className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                {language === 'de' ? 'Leistungen' : 'Services'}
                <ChevronDown className={cn('w-4 h-4', isServicesOpen && 'rotate-180')} />
              </Link>
              <AnimatePresence>
                {isServicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="absolute top-full left-0 w-56 bg-card border border-border/60 rounded-xl py-1.5 z-50 shadow-lg"
                  >
                    {services.map((s) => (
                      <Link
                        key={s.id}
                        href={`/services/${s.slug}`}
                        className="block px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
                      >
                        {language === 'de' ? s.titleDe : s.titleEn}
                      </Link>
                    ))}
                    <div className="border-t border-border/50 mt-1 pt-1">
                      <Link
                        href="/services"
                        className="block px-4 py-2 text-xs font-semibold text-primary"
                      >
                        {language === 'de' ? 'Alle Leistungen →' : 'View all →'}
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link
              href="/ueber-uns"
              className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              {language === 'de' ? 'Über uns' : 'About'}
            </Link>
            <Link
              href="/kontakt"
              className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              {language === 'de' ? 'Kontakt' : 'Contact'}
            </Link>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex items-center border border-border/60 rounded-lg p-0.5 bg-muted/30">
              {(['de', 'en'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={cn(
                    'px-3 py-1.5 text-xs font-semibold rounded-md uppercase',
                    language === lang
                      ? 'bg-card text-foreground border border-border/60'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {lang}
                </button>
              ))}
            </div>
            <a
              href="tel:+49421391714"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-4 h-10 rounded-lg text-sm"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">0421 391714</span>
              <span className="sm:hidden">24h</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
