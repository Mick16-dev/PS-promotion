'use client'

import { useLanguage } from '@/app/context/language-context'
import { Button } from '@/components/ui/button'
import { Magnetic } from '@/components/ui/magnetic'
import { Phone, Mail, MapPin, ArrowRight, ShieldCheck, Twitter, Linkedin, Instagram, HardHat } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface FooterProps {
  onCtaClick: () => void
}

export function Footer({ onCtaClick }: FooterProps) {
  const { t } = useLanguage()

  return (
    <footer id="footer" className="bg-[#0A0B0D] text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-white/10" />

      {/* Final Conversion Anchor */}
      <div className="py-12 px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto border border-white/5 p-10 lg:p-16 rounded-none text-center bg-white/[0.02] backdrop-blur-md relative"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]" />
          <h2 className="text-3xl sm:text-5xl font-black mb-6 tracking-tighter uppercase italic">
            {t('footer.readyFor')}<span className="text-red-600">{t('footer.goldStandard')}</span>{t('footer.fix')}
          </h2>
          <p className="text-slate-400 text-sm font-medium mb-10 max-w-lg mx-auto leading-relaxed">
            {t('footer.experience')}
          </p>

          <Button
            onClick={onCtaClick}
            size="lg"
            className="bg-red-600 text-white hover:bg-red-700 font-black uppercase tracking-widest h-14 px-10 rounded-none border-b-4 border-r-4 border-red-900 shadow-xl transition-all active:translate-y-1 active:border-b-0"
          >
            <span className="flex items-center gap-3">
              {t('footer.cta')}
              <ArrowRight className="w-6 h-6" />
            </span>
          </Button>
        </motion.div>
      </div>

      {/* Footer Content */}
      <div className="py-12 px-4 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-600 rounded-none flex items-center justify-center p-2 border-r-4 border-b-4 border-red-900">
                 <span className="text-white font-black text-xl italic uppercase">R</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-black uppercase tracking-tighter leading-none italic">{t('header.logo')}</span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-600">Industrietechnik</span>
              </div>
            </div>
            <p className="text-slate-400 font-medium leading-relaxed max-w-sm">
              {t('footer.redefining')}
            </p>

            <div className="grid sm:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t('footer.address.walle')}</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-slate-300">
                    <MapPin className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-bold tracking-tight uppercase">Bayernstr. 172, 28219 Bremen</span>
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <Phone className="w-4 h-4 text-red-600" />
                    <span className="text-base font-black tracking-tight uppercase italic underline decoration-red-600">0421 391714</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t('footer.address.verden')}</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-slate-300">
                    <MapPin className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-bold tracking-tight uppercase">Conrad-Wode-Str. 1, 27283 Verden</span>
                  </div>
                  <div className="flex items-center gap-3 text-white">
                    <Phone className="w-4 h-4 text-red-600" />
                    <span className="text-base font-black tracking-tight uppercase italic underline decoration-red-600">04231 982435</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">{t('footer.legal')}</h3>
            <ul className="space-y-3">
              {['privacy', 'terms', 'imprint'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-base font-bold uppercase tracking-tight hover:text-slate-400 transition-colors block">
                    {t(`footer.${link}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Authority */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">{t('footer.accreditations')}</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-white/5 rounded-none border border-white/5 flex flex-col items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-red-600" />
                <span className="text-[8px] font-black uppercase tracking-widest text-center">{t('footer.certifiedMeister')}</span>
              </div>
              <div className="p-4 bg-white/5 rounded-none border border-white/5 flex flex-col items-center gap-2">
                <HardHat className="w-5 h-5 text-red-600" />
                <span className="text-[8px] font-black uppercase tracking-widest text-center">{t('footer.emergency')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="py-10 px-4 border-t border-white/5 bg-black/20 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-500">
          <p>{t('footer.copyright')}</p>
          <div className="flex gap-6">
            {['Twitter', 'LinkedIn', 'Instagram'].map(platform => (
              <a key={platform} href="#" className="hover:text-white transition-colors">{platform}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
