'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Camera, CheckCircle2, Loader2, Scan, Upload } from 'lucide-react'
import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type IntakeKind = 'foto' | 'video'

type ScanState =
  | { kind: 'idle' }
  | { kind: 'capture'; intake: IntakeKind | null }
  | { kind: 'scanning'; step: 0 | 1 | 2 | 3 }
  | { kind: 'complete' }

const SCAN_LINES_DE: Record<Extract<ScanState, { kind: 'scanning' }>['step'], string> = {
  0: 'Meister-Validierung…',
  1: 'Material-ID: SML DN100…',
  2: 'Abgleich mit Zentrale Walle…',
  3: 'Technisches Protokoll wird erstellt…',
}

export function RotekMasterVisualService({ onCtaClick }: { onCtaClick?: () => void }) {
  const [state, setState] = useState<ScanState>({ kind: 'idle' })
  const [tick, setTick] = useState(0)

  const activeLine = useMemo(() => {
    if (state.kind !== 'scanning') return null
    return SCAN_LINES_DE[state.step]
  }, [state])

  const start = () => setState({ kind: 'capture', intake: null })
  const pick = (intake: IntakeKind) => setState({ kind: 'capture', intake })

  const runScan = async () => {
    setState({ kind: 'scanning', step: 0 })
    for (const s of [0, 1, 2, 3] as const) {
      setState({ kind: 'scanning', step: s })
      setTick((t) => t + 1)
      await new Promise((r) => setTimeout(r, 800 + (s === 2 ? 600 : 0)))
    }
    setState({ kind: 'complete' })
  }

  const reset = () => setState({ kind: 'idle' })

  return (
    <section className="px-4 py-24 bg-[#0A0B0D] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-white/5" />
      
      <div className="mx-auto max-w-6xl relative z-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-red-600/10 border border-red-600/20 text-red-600 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
              Rotek Master Visual Service
            </div>
            <h2 className="text-4xl sm:text-6xl font-black tracking-tighter text-white uppercase italic leading-[0.9] mb-8">
              Digitaler <br /> Meister-Check
            </h2>
            <p className="text-base sm:text-lg leading-relaxed text-slate-400 max-w-prose italic border-l-4 border-red-600 pl-6 mb-10">
              Präzisions-Eingang für den Industrieeinsatz: Visuelle Erfassung, technische Validierung durch die Zentrale Walle und sofortige Protokoll-Erstellung.
            </p>
            
            {onCtaClick && (
              <div className="space-y-4">
                <Button 
                  onClick={onCtaClick}
                  className="h-16 px-8 rounded-none bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest border-b-4 border-red-900 shadow-2xl transition-all active:translate-y-1 active:border-b-0"
                >
                  Analyse anfordern
                </Button>
              </div>
            )}
          </div>

          <div className="rounded-none border border-white/10 bg-white/[0.02] backdrop-blur-3xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent pointer-events-none" />
            
            <div className="border-b border-white/10 px-6 py-5 flex items-center justify-between bg-white/[0.03]">
              <div className="flex items-center gap-3 text-xs font-black text-white uppercase tracking-widest">
                <Scan className="h-4 w-4 text-red-600" />
                System-Erfassung
              </div>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Zentrale Walle // HUB 01</div>
            </div>

            <div className="p-6 sm:p-8">
              <div
                className={cn(
                  'relative aspect-video w-full overflow-hidden rounded-none border border-white/10',
                  'bg-black/40 blueprint-grid'
                )}
              >
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,var(--color-primary)_0%,transparent_70%)]" />

                {/* HUD Overlay */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 rounded-none border border-white/20 bg-black/60 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md">
                      <Camera className="h-3.5 w-3.5 text-red-600" />
                      Visual Intake
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-none border border-white/20 bg-black/60 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />
                      Protocol Active
                    </div>
                  </div>

                  <div className="relative">
                    <AnimatePresence mode="wait">
                      {state.kind === 'idle' && (
                        <motion.div
                          key="idle"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="rounded-none border border-white/10 bg-black/80 backdrop-blur-xl p-5"
                        >
                          <div className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">Status: Bereit</div>
                          <div className="text-sm font-bold text-white uppercase italic">
                            Einsatzaufnahme starten.
                          </div>
                        </motion.div>
                      )}

                      {state.kind === 'capture' && (
                        <motion.div
                          key="capture"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="rounded-none border border-white/10 bg-black/80 backdrop-blur-xl p-5"
                        >
                          <div className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">Mode: Selection</div>
                          <div className="text-sm font-bold text-white uppercase italic">
                            {state.intake ? `Sensor: ${state.intake.toUpperCase()}` : 'Wählen Sie Foto oder Video.'}
                          </div>
                        </motion.div>
                      )}

                      {state.kind === 'scanning' && (
                        <motion.div
                          key={`scan-${tick}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="rounded-none border border-red-600/30 bg-red-600/10 backdrop-blur-xl p-5"
                        >
                          <div className="flex items-center gap-3 text-sm font-black text-white uppercase tracking-tight italic">
                            <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                            {activeLine}
                          </div>
                          <div className="mt-4 h-1 w-full bg-white/10 rounded-none overflow-hidden">
                            <motion.div
                              className="h-full bg-red-600"
                              initial={{ width: '0%' }}
                              animate={{ width: `${(state.step + 1) * 25}%` }}
                              transition={{ duration: 0.5, ease: 'easeOut' }}
                            />
                          </div>
                        </motion.div>
                      )}

                      {state.kind === 'complete' && (
                        <motion.div
                          key="complete"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="rounded-none border border-green-600/30 bg-green-600/10 backdrop-blur-xl p-5"
                        >
                          <div className="flex items-center gap-3 text-sm font-black text-white uppercase tracking-tight italic">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            Validierung abgeschlossen.
                          </div>
                          <div className="mt-2 text-xs text-slate-300 font-medium">
                            Meister-Protokoll an Zentrale Walle übermittelt.
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Technical Reticle */}
                <div aria-hidden="true" className="absolute inset-0 pointer-events-none opacity-20">
                  <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-none border border-white/40" />
                  <div className="absolute left-1/2 top-1/2 h-0.5 w-16 -translate-x-1/2 -translate-y-1/2 bg-white/40" />
                  <div className="absolute left-1/2 top-1/2 h-16 w-0.5 -translate-x-1/2 -translate-y-1/2 bg-white/40" />
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {state.kind === 'idle' && (
                  <Button onClick={start} className="h-12 flex-1 rounded-none font-black uppercase tracking-widest bg-white/5 border border-white/10 hover:bg-white/10 text-white">
                    Start
                  </Button>
                )}

                {state.kind === 'capture' && (
                  <>
                    <Button
                      variant="ghost"
                      onClick={() => pick('foto')}
                      className={cn(
                        "h-12 flex-1 rounded-none font-black uppercase tracking-widest border transition-all",
                        state.intake === 'foto' ? "bg-red-600 border-red-600 text-white" : "bg-white/5 border-white/10 text-white"
                      )}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Foto
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => pick('video')}
                      className={cn(
                        "h-12 flex-1 rounded-none font-black uppercase tracking-widest border transition-all",
                        state.intake === 'video' ? "bg-red-600 border-red-600 text-white" : "bg-white/5 border-white/10 text-white"
                      )}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Video
                    </Button>
                    <Button
                      onClick={runScan}
                      disabled={!state.intake}
                      className="h-12 w-full lg:w-auto px-8 rounded-none bg-white text-black font-black uppercase tracking-widest hover:bg-white/90 disabled:opacity-50"
                    >
                      Scan starten
                    </Button>
                  </>
                )}

                {state.kind === 'complete' && (
                  <Button variant="outline" onClick={reset} className="h-12 w-full rounded-none font-black uppercase tracking-widest border-white/20 text-white hover:bg-white/5">
                    Neue Erfassung
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
