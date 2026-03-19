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
  0: 'Kalibrierung…',
  1: 'Material-ID: SML DN100…',
  2: 'Abgleich mit Bremer Katasteramt…',
  3: 'Technisches Protokoll wird erstellt…',
}

export function RotekMasterVisualService() {
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
      // deliberate pacing: feels like a field-tool HUD
      await new Promise((r) => setTimeout(r, 700 + (s === 2 ? 450 : 0)))
    }
    setState({ kind: 'complete' })
  }

  const reset = () => setState({ kind: 'idle' })

  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
          <div>
            <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-muted-foreground">
              Rotek Master Visual Service
            </div>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Digitaler Meister-Check
            </h2>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-muted-foreground max-w-prose">
              Visual Intake für den Einsatz: Aufnahme erstellen, technisches Protokoll generieren, Übergabe an die Zentrale.
            </p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/55 backdrop-blur-[6px] overflow-hidden">
            <div className="border-b border-border/50 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Scan className="h-4 w-4" />
                Erfassung
              </div>
              <div className="text-xs font-semibold text-muted-foreground">Zentrale Walle</div>
            </div>

            <div className="p-5 sm:p-6">
              <div
                className={cn(
                  'relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border/50',
                  'bg-muted/20 blueprint-grid'
                )}
              >
                <div className="absolute inset-0 mesh-gradient opacity-70" />

                {/* HUD */}
                <div className="absolute inset-0 p-4">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/30 px-3 py-1 text-xs font-semibold text-foreground/90 backdrop-blur">
                      <Camera className="h-4 w-4" />
                      Aufnahme
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/30 px-3 py-1 text-xs font-semibold text-foreground/90 backdrop-blur">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      LIVE
                    </div>
                  </div>

                  <div className="absolute left-4 right-4 bottom-4">
                    <AnimatePresence mode="wait">
                      {state.kind === 'idle' && (
                        <motion.div
                          key="idle"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          className="rounded-xl border border-border/60 bg-background/35 backdrop-blur px-4 py-3"
                        >
                          <div className="text-xs font-semibold text-muted-foreground">
                            Einsatzaufnahme starten
                          </div>
                          <div className="mt-1 text-sm font-semibold text-foreground">
                            Foto oder Video vom Problem erfassen.
                          </div>
                        </motion.div>
                      )}

                      {state.kind === 'capture' && (
                        <motion.div
                          key="capture"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          className="rounded-xl border border-border/60 bg-background/35 backdrop-blur px-4 py-3"
                        >
                          <div className="text-xs font-semibold text-muted-foreground">Eingang</div>
                          <div className="mt-1 text-sm font-semibold text-foreground">
                            {state.intake ? `Ausgewählt: ${state.intake.toUpperCase()}` : 'Wählen Sie Foto oder Video.'}
                          </div>
                        </motion.div>
                      )}

                      {state.kind === 'scanning' && (
                        <motion.div
                          key={`scan-${tick}`}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          className="rounded-xl border border-primary/25 bg-primary/10 backdrop-blur px-4 py-3"
                        >
                          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                            {activeLine}
                          </div>
                          <div className="mt-2 h-1.5 w-full rounded-full bg-background/30 overflow-hidden">
                            <motion.div
                              className="h-full bg-primary"
                              initial={{ width: '0%' }}
                              animate={{ width: `${(state.step + 1) * 25}%` }}
                              transition={{ duration: 0.45, ease: 'easeOut' }}
                            />
                          </div>
                        </motion.div>
                      )}

                      {state.kind === 'complete' && (
                        <motion.div
                          key="complete"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          className="rounded-xl border border-border/60 bg-background/35 backdrop-blur px-4 py-3"
                        >
                          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                            <CheckCircle2 className="h-4 w-4 text-success" />
                            Technisches Protokoll erstellt.
                          </div>
                          <div className="mt-1 text-sm text-muted-foreground leading-relaxed">
                            Übermittelt an Zentrale Walle. Einsatzleiter Andreas bereitet Fahrzeug 4 vor.
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Reticle */}
                <div aria-hidden="true" className="absolute inset-0">
                  <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground/15" />
                  <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground/15" />
                  <div className="absolute left-1/2 top-1/2 h-0.5 w-10 -translate-x-1/2 -translate-y-1/2 bg-foreground/15" />
                  <div className="absolute left-1/2 top-1/2 h-10 w-0.5 -translate-x-1/2 -translate-y-1/2 bg-foreground/15" />
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {state.kind === 'idle' && (
                  <Button onClick={start} className="h-11 rounded-xl font-semibold">
                    Start
                  </Button>
                )}

                {state.kind === 'capture' && (
                  <>
                    <Button
                      variant={state.intake === 'foto' ? 'default' : 'secondary'}
                      onClick={() => pick('foto')}
                      className="h-11 rounded-xl font-semibold"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Foto
                    </Button>
                    <Button
                      variant={state.intake === 'video' ? 'default' : 'secondary'}
                      onClick={() => pick('video')}
                      className="h-11 rounded-xl font-semibold"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Video
                    </Button>
                    <Button
                      onClick={runScan}
                      disabled={!state.intake}
                      className="h-11 rounded-xl font-semibold"
                    >
                      Scan starten
                    </Button>
                  </>
                )}

                {state.kind === 'complete' && (
                  <Button variant="secondary" onClick={reset} className="h-11 rounded-xl font-semibold">
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

