'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/app/context/language-context'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { 
  Users, 
  MapPin, 
  History, 
  HardHat, 
  Wrench, 
  DraftingCompass, 
  ClipboardCheck,
  CheckCircle2,
  Phone,
  ArrowRight
} from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

const teamMembers = [
  {
    id: 'stefan',
    name: 'Stefan Krause',
    roleKey: 'team.member.role.master',
    image: '/team_member_stefan_1773475374290.png',
    expertiseEn: 'Master Plumber with 25+ years of operational experience overseeing major residential infrastructure.',
    expertiseDe: 'Sanitärmeister mit über 25 Jahren Erfahrung in der Leitung großer Wohninfrastrukturprojekte.'
  },
  {
    id: 'elena',
    name: 'Elena Schmidt',
    roleKey: 'team.member.role.diagnostic',
    image: '/team_member_elena_diagnostic_1773475405841.png',
    expertiseEn: 'Diagnostic engineer specializing in high-fidelity thermal imaging and structural integrity analysis.',
    expertiseDe: 'Diagnoseingenieurin, spezialisiert auf hochauflösende Wärmebildtechnik und Bausubstanzanalyse.'
  },
  {
    id: 'marcus',
    name: 'Marcus Jung',
    roleKey: 'team.member.role.emergency',
    image: '/team_member_marcus_drain_1773475423602.png',
    expertiseEn: 'Rapid response Lead for complex drainage disruptions and emergency flood mitigation.',
    expertiseDe: 'Einsatzleiter für komplexe Abflussstörungen und Notfall-Hochwassereindämmung.'
  },
  {
    id: 'lukas',
    name: 'Lukas Berg',
    roleKey: 'team.member.role.install',
    image: '/team_member_lukas_installation_1773475440335.png',
    expertiseEn: 'Sustainable installation lead focusing on modern heat pump systems and water recycling.',
    expertiseDe: 'Leiter für nachhaltige Installationen mit Fokus auf moderne Wärmepumpensysteme und Wasserrecycling.'
  }
]

const pillars = [
  { id: 1, icon: HardHat, color: 'text-red-600', bg: 'bg-red-50' },
  { id: 2, icon: Wrench, color: 'text-slate-900', bg: 'bg-slate-100' },
  { id: 3, icon: DraftingCompass, color: 'text-red-600', bg: 'bg-red-50' },
  { id: 4, icon: ClipboardCheck, color: 'text-slate-900', bg: 'bg-slate-100' },
]

export default function TeamPage() {
  const { language, t } = useLanguage()

  return (
    <main className="min-h-screen bg-slate-50">
      <Header onEmergencyClick={() => window.location.href = '/contact'} />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter mb-8 text-slate-900">
              {t('team.title')}
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed italic">
              {t('team.subtitle')}
            </p>
          </motion.div>

          {/* Team Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, idx) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group relative"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-low hover:shadow-high transition-all duration-500">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  
                  <div className="absolute bottom-8 left-8 right-8 text-white z-10 transition-transform duration-500 group-hover:translate-y-[-4px]">
                    <h3 className="text-2xl font-black uppercase tracking-tighter leading-none mb-1">{member.name}</h3>
                    <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mb-4">
                      {t(member.roleKey)}
                    </p>
                    <p className="text-white/70 text-xs font-medium leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {language === 'de' ? member.expertiseDe : member.expertiseEn}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story & Heritage Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-red-600">
                  <span className="text-xs font-black uppercase tracking-[0.3em]">{t('team.story.tagline')}</span>
                </div>
                <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter text-slate-900">
                  {t('team.story.title')}
                </h2>
              </div>
              <p className="text-lg text-slate-600 font-medium leading-relaxed">
                {t('team.story.desc')}
              </p>
              <div className="pt-4">
                <Button 
                  onClick={() => window.location.href = '/services'}
                  className="bg-slate-900 text-white hover:bg-slate-800 font-black uppercase tracking-widest px-8 h-14 rounded-2xl"
                >
                  {language === 'de' ? 'Unsere Leistungen ansehen' : 'See Our Services'}
                </Button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square bg-slate-100 rounded-[4rem] overflow-hidden border-8 border-slate-50 shadow-2xl"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                 <Wrench className="w-32 h-32 text-slate-200" />
              </div>
              <Image 
                src="/team_member_stefan_1773475374290.png"
                alt="Stefan Krause"
                fill
                className="object-cover opacity-80"
              />
              <div className="absolute bottom-10 left-10 p-8 bg-white/90 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl max-w-xs">
                 <p className="text-slate-900 font-black italic tracking-tight text-xl mb-4">"Plumbing is engineering. Every drop counts."</p>
                 <span className="text-xs font-black uppercase tracking-widest text-red-600">— Stefan Krause, Founder</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4 Pillars of Mastery (The requested Expertise Lists) */}
      <section className="py-24 px-4 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-red-600/5 skew-x-12 translate-x-1/2 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter italic">
              {t('team.expertise.title')}
            </h2>
            <div className="h-2 w-24 bg-red-600 mx-auto" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pillars.map((pillar) => (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: pillar.id * 0.1 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-[3rem] hover:bg-white/10 transition-colors group"
              >
                <div className={`w-14 h-14 ${pillar.bg} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  <pillar.icon className={`w-7 h-7 ${pillar.color}`} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight mb-4 group-hover:text-red-500 transition-colors">
                   {t(`team.expertise.${pillar.id}`)}
                </h3>
                <p className="text-white/60 text-sm font-medium leading-relaxed">
                   {t(`team.expertise.${pillar.id}.desc`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Where We Work */}
      <section className="py-24 px-4 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-red-600">
                  <span className="text-xs font-black uppercase tracking-[0.3em]">{language === 'de' ? 'Einsatzgebiete' : 'Coverage'}</span>
                </div>
                <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter text-slate-900">
                  {t('team.coverage.title')}
                </h2>
              </div>
              <p className="text-lg text-slate-600 font-medium leading-relaxed">
                {t('team.coverage.desc')}
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                {['Berlin', 'Munich', 'Hamburg', 'Frankfurt'].map(city => (
                  <div key={city} className="flex items-center gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-red-200 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:text-red-600 transition-colors">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="font-black uppercase tracking-widest text-slate-900">{city}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="relative aspect-square grid grid-cols-2 gap-4">
               <div className="bg-slate-900 rounded-[3rem] p-12 flex flex-col justify-end text-white relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full bg-red-600/10" />
                  <p className="text-5xl font-black italic tracking-tighter mb-2">50+</p>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{language === 'de' ? 'Masters' : 'Master Technicians'}</p>
               </div>
               <div className="bg-red-600 rounded-[3rem] p-12 flex flex-col justify-end text-white">
                  <p className="text-5xl font-black italic tracking-tighter mb-2">24h</p>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-80">{language === 'de' ? 'Bereitschaft' : 'Response Team'}</p>
               </div>
               <div className="bg-slate-100 rounded-[3rem] p-12 flex flex-col justify-end text-slate-900 col-span-2 overflow-hidden relative">
                  <Image src="/team_member_elena_diagnostic_1773475405841.png" fill className="object-cover opacity-20 grayscale" alt="Location background" />
                  <div className="relative z-10">
                    <p className="text-3xl font-black uppercase tracking-tighter mb-4 italic">{language === 'de' ? 'Bereit für den Einsatz.' : 'Ready for deployment.'}</p>
                    <Button 
                      onClick={() => window.location.href = 'tel:+498001234567'}
                      variant="outline" 
                      className="border-slate-300 text-slate-900 hover:bg-slate-900 hover:text-white font-black uppercase tracking-widest px-8 rounded-xl h-12"
                    >
                      {language === 'de' ? 'Jetzt Techniker rufen' : 'Call Master Now'}
                    </Button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter text-slate-900">
            {language === 'de' ? 'Haben Sie eine Frage an unsere Experten?' : 'Have a Question for Our Experts?'}
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Button 
              onClick={() => window.location.href = '/contact'}
              className="bg-red-600 text-white hover:bg-red-700 font-black uppercase tracking-widest px-10 h-16 rounded-2xl shadow-xl shadow-red-500/20"
            >
              <span className="flex items-center gap-2">
                {language === 'de' ? 'Expertise anfordern' : 'Request Expertise'}
                <ArrowRight className="w-5 h-5" />
              </span>
            </Button>
            <Button 
              asChild
              variant="outline" 
              className="border-slate-200 text-slate-900 hover:bg-slate-100 font-black uppercase tracking-widest px-10 h-16 rounded-2xl"
            >
              <a href="tel:+498001234567" className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                +49 800 123 4567
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer onCtaClick={() => window.location.href = '/contact'} />
    </main>
  )
}
