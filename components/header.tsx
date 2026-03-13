'use client'

import { Phone } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/app/context/language-context'
import { Button } from '@/components/ui/button'
import { Magnetic } from '@/components/ui/magnetic'
import { cn } from '@/lib/utils'

interface HeaderProps {
  onEmergencyClick: () => void
}

export function Header({ onEmergencyClick }: HeaderProps) {
  const { language, setLanguage, t } = useLanguage()

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group cursor-pointer shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-900 rounded-xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-105 p-2">
              <img src="/logo-custom.svg" alt="Rohr-Blitz Logo" className="w-full h-full object-contain brightness-0 invert" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold uppercase tracking-tight leading-none text-slate-900">{t('header.logo')}</span>
              <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-500">Premium Plumbing</span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 mx-4">
            {[
              { key: 'nav.overview', href: '/' },
              { key: 'nav.services', href: '/#services' },
              { key: 'nav.pricing', href: '/#pricing' },
              { key: 'nav.contact', href: '/#footer' }
            ].map((item) => (
              <a
                key={item.key}
                href={item.href}
                className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap"
              >
                {t(item.key)}
              </a>
            ))}
          </nav>

          {/* Language Toggle + Emergency CTA */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Language Toggle */}
            <div className="hidden sm:flex items-center border border-slate-200 rounded-lg p-1 bg-slate-50/50">
              {(['en', 'de'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={cn(
                    "px-3 py-1.5 text-[10px] font-bold rounded-md transition-all uppercase",
                    language === lang 
                      ? "bg-white text-slate-900 shadow-sm border border-slate-200" 
                      : "text-slate-500 hover:text-slate-900"
                  )}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Emergency CTA */}
            <Button 
              onClick={onEmergencyClick}
              className="bg-red-600 text-white hover:bg-red-700 font-bold px-4 h-10 sm:h-12 rounded-lg shadow-sm border-0 flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden lg:inline uppercase tracking-wider text-xs">{t('header.emergency')}</span>
              <span className="lg:hidden text-xs">24/7</span>
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
