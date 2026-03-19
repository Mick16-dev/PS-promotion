'use client'

import { Phone, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/app/context/language-context'
import { Button } from '@/components/ui/button'
import { Magnetic } from '@/components/ui/magnetic'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { services } from '@/lib/services-data'

interface HeaderProps {
  onEmergencyClick: () => void
}

export function Header({ onEmergencyClick }: HeaderProps) {
  const { language, setLanguage, t } = useLanguage()
  const [isServicesOpen, setIsServicesOpen] = useState(false)

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#0A0B0D]/90 backdrop-blur-md border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-4 group cursor-pointer shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-600 rounded-none flex items-center justify-center shadow-2xl transition-transform group-hover:scale-105 p-2 border-r-4 border-b-4 border-red-900">
               <span className="text-white font-black text-xl italic tracking-tighter">R</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black uppercase tracking-tighter leading-none text-white italic">{t('header.logo')}</span>
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-red-600">Industrietechnik</span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 mx-4">
            {[
              { key: 'nav.overview', name: t('nav.overview'), href: '/' },
              { key: 'nav.services', name: t('nav.services'), href: '/services', hasDropdown: true },
              { key: 'nav.pricing', name: t('nav.pricing'), href: '/pricing' },
              { key: 'nav.team', name: t('nav.team'), href: '/team' },
              { key: 'nav.contact', name: t('nav.contact'), href: '/contact' }
            ].map((item) => (
              <div 
                key={item.key} 
                className="relative group"
                onMouseEnter={() => item.hasDropdown && setIsServicesOpen(true)}
                onMouseLeave={() => item.hasDropdown && setIsServicesOpen(false)}
              >
                <Link
                  href={item.href}
                  className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors whitespace-nowrap flex items-center gap-1"
                >
                  {t(item.key)}
                  {item.hasDropdown && <ChevronDown className={cn("w-3 h-3 transition-transform duration-200 text-slate-600", isServicesOpen && "rotate-180 text-white")} />}
                </Link>

                {item.hasDropdown && (
                  <AnimatePresence>
                    {isServicesOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 w-64 bg-[#0A0B0D] border border-white/10 shadow-2xl rounded-none py-2 z-50"
                      >
                        {services.map((service) => (
                          <Link
                            key={service.id}
                            href={`/services/${service.slug}`}
                            className="block px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white/5 hover:text-white transition-all border-l-2 border-transparent hover:border-red-600"
                          >
                            {language === 'de' ? service.titleDe : service.titleEn}
                          </Link>
                        ))}
                        <div className="border-t border-white/10 mt-2 pt-2">
                          <Link 
                            href="/services" 
                            className="block px-6 py-2 text-[9px] font-black uppercase tracking-[0.3em] text-red-600 hover:text-red-500 transition-colors"
                          >
                             {language === 'de' ? 'Alle Leistungen →' : 'All Services →'}
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </nav>

          {/* Language Toggle + Emergency CTA */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Language Toggle */}
            <div className="hidden sm:flex items-center border border-white/10 rounded-none p-1 bg-white/5">
              {(['en', 'de'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={cn(
                    "px-3 py-1.5 text-[9px] font-black rounded-none transition-all uppercase tracking-widest",
                    language === lang 
                      ? "bg-red-600 text-white shadow-xl" 
                      : "text-slate-500 hover:text-white"
                  )}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Emergency CTA */}
            <Button 
              onClick={onEmergencyClick}
              className="bg-red-600 text-white hover:bg-red-700 font-black px-6 h-10 sm:h-12 rounded-none shadow-xl border-r-4 border-b-4 border-red-900 transition-all hover:scale-105 active:translate-y-1 active:border-b-0 flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden lg:inline uppercase tracking-widest text-[10px] font-black">{t('header.emergency')}</span>
              <span className="lg:hidden text-[10px] font-black uppercase">24/7</span>
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
