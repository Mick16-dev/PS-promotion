'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'

type Language = 'en' | 'de'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.overview': 'Overview',
    'nav.services': 'Services',
    'nav.testimonials': 'Cases',
    'nav.pricing': 'Pricing',
    'nav.faq': 'FAQ',
    'nav.emergency': 'Emergency Protocol',
    'nav.about': 'About Us',
    'nav.team': 'The Team',
    'nav.contact': 'Contact'
  },
  de: {
    // Navigation
    'nav.overview': 'Uebersicht',
    'nav.services': 'Leistungen',
    'nav.testimonials': 'Einsaetze',
    'nav.pricing': 'Preise',
    'nav.faq': 'FAQ',
    'nav.emergency': 'Notfall-Protokoll',
    'nav.about': 'Ueber uns',
    'nav.team': 'Das Team',
    'nav.contact': 'Kontakt'
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('rotek-industrial-lang') as Language | null : null
    if (stored && (stored === 'en' || stored === 'de')) {
      setLanguageState(stored)
    } else {
      const browserLang = typeof navigator !== 'undefined' ? navigator.language.toLowerCase() : 'en'
      if (browserLang.startsWith('de')) {
        setLanguageState('de')
      }
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('rotek-industrial-lang', lang)
  }

  const t = (key: string): string => {
    return translations[language]?.[key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
