'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  ArrowRight, 
  Music, 
  ShieldCheck, 
  Zap, 
  Globe, 
  BarChart3, 
  Users,
  ChevronRight,
  Layers
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

export default function LandingPage() {
  const router = useRouter()

  React.useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/overview')
      }
    }
    checkAuth()
  }, [router])
  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white selection:bg-primary/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Music className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-black italic tracking-tighter uppercase">ShowReady</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-zinc-500">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#solution" className="hover:text-white transition-colors">Solution</Link>
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">Sign In</Link>
            <Link href="/register">
              <Button className="bg-white text-black hover:bg-zinc-200 rounded-full font-black uppercase tracking-widest text-[10px] px-6 h-10">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-6 overflow-hidden">
        {/* Animated Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] bg-primary/20 blur-[120px] rounded-full opacity-30 -z-10" />
        
        <div className="max-w-7xl mx-auto text-center space-y-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-primary animate-in fade-in slide-in-from-bottom-4">
            <Zap size={12} /> The Future of Tour Management
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter italic uppercase leading-[0.85] animate-in fade-in slide-in-from-bottom-8 duration-700">
            Precision <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/20">Performance</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl md:text-2xl text-zinc-500 font-medium leading-relaxed italic animate-in fade-in slide-in-from-bottom-12 duration-1000">
            The high-fidelity dashboard for music promoters to manage advancements, technical riders, and artist logistics with surgical accuracy.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6 animate-in fade-in slide-in-from-bottom-16 duration-1000">
            <Link href="/register">
              <Button className="h-16 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-white text-sm font-black uppercase tracking-widest gap-3 shadow-2xl shadow-primary/20">
                Launch Dashboard <ArrowRight size={18} />
              </Button>
            </Link>
            <Button variant="outline" className="h-16 px-10 rounded-2xl border-white/10 bg-white/5 text-white text-sm font-black uppercase tracking-widest">
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Hero Mockup Frame */}
        <div className="max-w-6xl mx-auto mt-24 relative group animate-in fade-in zoom-in duration-1000 delay-500">
          <div className="absolute inset-0 bg-primary/20 blur-[100px] opacity-0 group-hover:opacity-40 transition-opacity" />
          <div className="relative bg-[#151618] rounded-[3rem] border border-white/10 p-4 shadow-2xl">
             <div className="bg-black rounded-[2.2rem] border border-white/5 aspect-video overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                <div className="p-10 space-y-6">
                   <div className="h-8 w-48 bg-white/10 rounded-full" />
                   <div className="grid grid-cols-3 gap-6">
                      <div className="h-32 bg-white/5 rounded-3xl" />
                      <div className="h-32 bg-white/5 rounded-3xl" />
                      <div className="h-32 bg-white/5 rounded-3xl" />
                   </div>
                   <div className="h-64 bg-white/5 rounded-3xl" />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: Globe,
                title: "Artist Portal",
                desc: "Secure, real-time gateways for artists to upload technical riders and EPKs without the email back-and-forth."
              },
              {
                icon: BarChart3,
                title: "Financial Sync",
                desc: "Track guarantees, ticket tiers, and expenses with integrated break-even calculations for every show."
              },
              {
                icon: ShieldCheck,
                title: "Master Control",
                desc: "Private management layer to monitor your entire roster, payment statuses, and team permissions."
              }
            ].map((f, i) => (
              <div key={i} className="space-y-6 group">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  <f.icon size={28} />
                </div>
                <h3 className="text-2xl font-black italic uppercase tracking-tight">{f.title}</h3>
                <p className="text-zinc-500 font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
          <div className="space-y-2">
            <span className="text-5xl font-black italic">120+</span>
            <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Active Agencies</span>
          </div>
          <div className="space-y-2">
            <span className="text-5xl font-black italic">25k</span>
            <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Shows Advanced</span>
          </div>
          <div className="space-y-2">
            <span className="text-5xl font-black italic">$40M+</span>
            <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Contract Value Managed</span>
          </div>
          <div className="space-y-2 text-primary">
            <span className="text-5xl font-black italic">99.9%</span>
            <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">Uptime Reliability</span>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 border-t border-white/5 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/20 blur-[150px] opacity-20 -z-10" />
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <h2 className="text-5xl md:text-7xl font-black italic uppercase leading-none tracking-tighter">
            Stop Advancing <br />
            <span className="text-primary">Start Performing.</span>
          </h2>
          <p className="text-xl text-zinc-500 font-medium italic">
            Join the world's most organized music promoters. Setup in 60 seconds.
          </p>
          <Link href="/register">
            <Button className="h-20 px-12 rounded-3xl bg-white text-black hover:bg-zinc-200 text-lg font-black uppercase tracking-widest gap-4">
              Enter The Dashboard <ChevronRight size={24} />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-zinc-800 rounded flex items-center justify-center">
              <Music className="h-3.5 w-3.5 text-zinc-400" />
            </div>
            <span className="text-sm font-black italic uppercase tracking-widest text-zinc-500">ShowReady</span>
          </div>
          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
            &copy; 2026 ShowReady Platform &bull; Professional Production Protocol
          </p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-600">
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/security" className="hover:text-white transition-colors">Security</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
