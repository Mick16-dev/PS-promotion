'use client'

import { useState, useCallback } from 'react'
import {
  Droplet,
  CircleOff,
  Wrench,
  Bath,
  UtensilsCrossed,
  ShowerHead,
  Pipe,
  HelpCircle,
  Loader2,
  Video,
  Image as ImageIcon,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/app/context/language-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import {
  type Location,
  type ProblemType,
  type DiagnosticSelection,
  PRICING_BY_PROBLEM,
  getSymptomMatch,
  getRiskAssessment,
  getFixProtocol,
  MAX_VIDEO_BYTES,
  MAX_IMAGE_BYTES,
} from '@/lib/diagnostic-rules'

const LOCATIONS: { id: Location; icon: React.ReactNode; labelEn: string; labelDe: string }[] = [
  { id: 'toilet', icon: <Bath className="w-6 h-6" />, labelEn: 'Toilet', labelDe: 'Toilette' },
  { id: 'kitchen_sink', icon: <UtensilsCrossed className="w-6 h-6" />, labelEn: 'Kitchen Sink', labelDe: 'Küchenspüle' },
  { id: 'bathroom_sink', icon: <Bath className="w-6 h-6" />, labelEn: 'Bathroom Sink', labelDe: 'Waschbecken' },
  { id: 'shower', icon: <ShowerHead className="w-6 h-6" />, labelEn: 'Shower', labelDe: 'Dusche' },
  { id: 'pipe_floor', icon: <Pipe className="w-6 h-6" />, labelEn: 'Pipe / Floor', labelDe: 'Rohr / Boden' },
  { id: 'other', icon: <HelpCircle className="w-6 h-6" />, labelEn: 'Other', labelDe: 'Sonstiges' },
]

const PROBLEMS: { id: ProblemType; icon: React.ReactNode; labelEn: string; labelDe: string }[] = [
  { id: 'leaking', icon: <Droplet className="w-5 h-5" />, labelEn: 'Leaking', labelDe: 'Leckt' },
  { id: 'blocked', icon: <CircleOff className="w-5 h-5" />, labelEn: 'Blocked', labelDe: 'Verstopft' },
  { id: 'no_water', icon: <Droplet className="w-5 h-5" />, labelEn: 'No water', labelDe: 'Kein Wasser' },
  { id: 'burst', icon: <AlertTriangle className="w-5 h-5" />, labelEn: 'Burst pipe', labelDe: 'Rohrbruch' },
  { id: 'dripping', icon: <Droplet className="w-5 h-5" />, labelEn: 'Dripping tap', labelDe: 'Tropfender Hahn' },
  { id: 'slow_drain', icon: <CircleOff className="w-5 h-5" />, labelEn: 'Slow drain', labelDe: 'Langsamer Abfluss' },
  { id: 'smell', icon: <HelpCircle className="w-5 h-5" />, labelEn: 'Bad smell', labelDe: 'Unangenehmer Geruch' },
  { id: 'other', icon: <Wrench className="w-5 h-5" />, labelEn: 'Other', labelDe: 'Sonstiges' },
]

const DETAILS_BY_LOCATION: Record<Location, { value: string; labelEn: string; labelDe: string }[]> = {
  toilet: [
    { value: 'base', labelEn: 'Base of toilet (floor)', labelDe: 'Toilettenfuß (Boden)' },
    { value: 'tank', labelEn: 'Tank leaking', labelDe: 'Spülkasten leckt' },
    { value: 'bowl', labelEn: 'Water in bowl', labelDe: 'Wasser in der Schüssel' },
  ],
  kitchen_sink: [
    { value: 'under', labelEn: 'Under sink', labelDe: 'Unter der Spüle' },
    { value: 'faucet', labelEn: 'Faucet', labelDe: 'Armatur' },
  ],
  bathroom_sink: [
    { value: 'under', labelEn: 'Under basin', labelDe: 'Unter dem Waschbecken' },
    { value: 'faucet', labelEn: 'Faucet', labelDe: 'Armatur' },
  ],
  shower: [
    { value: 'drain', labelEn: 'Drain', labelDe: 'Abfluss' },
    { value: 'head', labelEn: 'Shower head / mixer', labelDe: 'Duschkopf / Mischer' },
  ],
  pipe_floor: [
    { value: 'visible', labelEn: 'Visible pipe', labelDe: 'Sichtbares Rohr' },
    { value: 'under_floor', labelEn: 'Under floor / wall', labelDe: 'Unter Boden / Wand' },
  ],
  other: [{ value: 'describe', labelEn: 'I will describe', labelDe: 'Ich beschreibe es' }],
}

interface DiagnosticFunnelProps {
  onCtaClick?: () => void
}

export function DiagnosticFunnel({ onCtaClick }: DiagnosticFunnelProps) {
  const { t, language } = useLanguage()
  const [step, setStep] = useState(1)
  const [selection, setSelection] = useState<Partial<DiagnosticSelection>>({})
  const [file, setFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [contact, setContact] = useState({ name: '', phone: '', email: '', address: '' })
  const [submitted, setSubmitted] = useState(false)

  const lang = language as 'en' | 'de'

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0]
      if (!f) return
      const isVideo = f.type.startsWith('video/')
      const isImage = f.type.startsWith('image/')
      if (!isVideo && !isImage) return
      if (isVideo && f.size > MAX_VIDEO_BYTES) {
        alert(lang === 'de' ? 'Video max. 50 MB (ca. 2 Min).' : 'Video max 50 MB (~2 min).')
        return
      }
      if (isImage && f.size > MAX_IMAGE_BYTES) {
        alert(lang === 'de' ? 'Foto max. 10 MB.' : 'Photo max 10 MB.')
        return
      }
      setFile(f)
      const reader = new FileReader()
      reader.onload = (ev) => setFilePreview(ev.target?.result as string)
      reader.readAsDataURL(f)
    },
    [lang]
  )

  const handleAnalyze = async () => {
    if (!selection.location || !selection.problemType) return
    setIsAnalyzing(true)
    await new Promise((r) => setTimeout(r, 2800))
    setIsAnalyzing(false)
    setShowResults(true)
  }

  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    onCtaClick?.()
  }

  const price = selection.problemType ? PRICING_BY_PROBLEM[selection.problemType] : null
  const protocol = selection.location && selection.problemType
    ? getFixProtocol(
        {
          location: selection.location,
          problemType: selection.problemType,
          detail: selection.detail || '',
        },
        lang
      )
    : null

  return (
    <Card id="request-diagnosis" className="overflow-hidden rounded-2xl border border-border shadow-lg">
      <CardContent className="p-6 sm:p-8">
        <AnimatePresence mode="wait">
          {isAnalyzing && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 text-center"
            >
              <Loader2 className="w-14 h-14 animate-spin text-primary mx-auto mb-6" />
              <h3 className="text-xl font-bold text-foreground mb-2">
                {lang === 'de' ? 'Diagnose wird erstellt…' : 'Diagnosis pending…'}
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                {lang === 'de'
                  ? 'Wir analysieren Ihre Angaben und das hochgeladene Material.'
                  : 'Analyzing your input and uploaded media.'}
              </p>
            </motion.div>
          )}

          {!isAnalyzing && !showResults && (
            <motion.div
              key="steps"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Step 1: Location */}
              {step === 1 && (
                <>
                  <h3 className="text-lg font-semibold text-foreground">
                    {lang === 'de' ? '1. Wo ist das Problem?' : '1. Where is the problem?'}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {LOCATIONS.map((loc) => (
                      <button
                        key={loc.id}
                        type="button"
                        onClick={() => {
                          setSelection((s) => ({ ...s, location: loc.id }))
                          setStep(2)
                        }}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-muted/50 transition-all"
                      >
                        {loc.icon}
                        <span className="text-xs font-medium">{lang === 'de' ? loc.labelDe : loc.labelEn}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* Step 2: Problem type */}
              {step === 2 && (
                <>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    ← {lang === 'de' ? 'Zurück' : 'Back'}
                  </button>
                  <h3 className="text-lg font-semibold text-foreground">
                    {lang === 'de' ? '2. Was passiert?' : '2. What is happening?'}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PROBLEMS.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() =>
                          setSelection((s) => ({
                            ...s,
                            problemType: p.id,
                            detail: DETAILS_BY_LOCATION[s.location || 'other'][0]?.value,
                          }))
                        }
                        className="flex items-center gap-2 p-3 rounded-lg border border-border hover:border-primary/50 transition-all text-left"
                      >
                        {p.icon}
                        <span className="text-xs font-medium">{lang === 'de' ? p.labelDe : p.labelEn}</span>
                      </button>
                    ))}
                  </div>
                  {selection.location && DETAILS_BY_LOCATION[selection.location].length > 1 && (
                    <>
                      <h4 className="text-sm font-medium text-foreground mt-6">
                        {lang === 'de' ? 'Genauere Stelle?' : 'More specific?'}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {DETAILS_BY_LOCATION[selection.location].map((d) => (
                          <button
                            key={d.value}
                            type="button"
                            onClick={() => setSelection((s) => ({ ...s, detail: d.value }))}
                            className={cn(
                              'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                              selection.detail === d.value
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-border hover:border-primary/50'
                            )}
                          >
                            {lang === 'de' ? d.labelDe : d.labelEn}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                  <Button
                    type="button"
                    onClick={() => {
                      setStep(3)
                    }}
                    className="w-full"
                  >
                    {lang === 'de' ? 'Weiter' : 'Continue'}
                  </Button>
                </>
              )}

              {/* Step 3: Upload + Price */}
              {step === 3 && (
                <>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    ← {lang === 'de' ? 'Zurück' : 'Back'}
                  </button>

                  {price && (
                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                        {lang === 'de' ? 'Geschätzter Preisbereich' : 'Estimated price range'}
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {lang === 'de' ? 'ab' : 'From'} €{price.min}
                        <span className="text-sm font-normal text-muted-foreground">
                          {' '}
                          – €{price.max}
                        </span>
                      </p>
                    </div>
                  )}

                  <div>
                    <Label className="text-sm font-medium">
                      {lang === 'de' ? 'Foto oder Video (max. 50 MB, ca. 2 Min)' : 'Photo or video (max 50 MB, ~2 min)'}
                    </Label>
                    <div
                      className={cn(
                        'mt-2 border-2 border-dashed rounded-xl p-8 text-center transition-colors',
                        filePreview ? 'border-primary/30 bg-primary/5' : 'border-border hover:border-primary/30'
                      )}
                    >
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="diagnostic-upload"
                      />
                      <label htmlFor="diagnostic-upload" className="cursor-pointer block">
                        {filePreview ? (
                          <div>
                            {file?.type.startsWith('video/') ? (
                              <Video className="w-12 h-12 text-primary mx-auto mb-2" />
                            ) : (
                              <img
                                src={filePreview}
                                alt="Preview"
                                className="max-h-32 mx-auto rounded-lg object-cover"
                              />
                            )}
                            <p className="text-sm font-medium mt-2">{file?.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {lang === 'de' ? 'Klicken zum Austauschen' : 'Click to replace'}
                            </p>
                          </div>
                        ) : (
                          <>
                            <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">
                              {lang === 'de' ? 'Klicken oder Datei hierher ziehen' : 'Click or drag file here'}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">JPG, PNG, MP4, MOV</p>
                          </>
                        )}
                      </label>
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={handleAnalyze}
                    disabled={!selection.problemType}
                    className="w-full"
                  >
                    {lang === 'de' ? 'Diagnose starten' : 'Start diagnosis'}
                  </Button>
                </>
              )}
            </motion.div>
          )}

          {!isAnalyzing && showResults && !submitted && selection.location && selection.problemType && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-2 text-success">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-semibold">
                  {lang === 'de' ? 'Diagnose abgeschlossen' : 'Diagnosis complete'}
                </span>
              </div>

              {/* AI-Symptom Match */}
              <div className="p-4 rounded-xl border border-border bg-card">
                <h4 className="text-sm font-semibold text-foreground mb-2">
                  {lang === 'de' ? 'Vermutliche Ursache' : 'Likely cause'}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {getSymptomMatch(
                    {
                      location: selection.location,
                      problemType: selection.problemType,
                      detail: selection.detail || '',
                    },
                    lang
                  )}
                </p>
              </div>

              {/* Risk Assessment */}
              <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  {lang === 'de' ? 'Risiko bei Verzögerung' : 'Risk of delay'}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {getRiskAssessment(
                    {
                      location: selection.location,
                      problemType: selection.problemType,
                      detail: selection.detail || '',
                    },
                    lang
                  )}
                </p>
              </div>

              {/* Fix Protocol + One-Visit */}
              {protocol && (
                <div className="p-4 rounded-xl border border-border bg-card">
                  <h4 className="text-sm font-semibold text-foreground mb-2">
                    {lang === 'de' ? 'Geplante Vorgehensweise' : 'Fix protocol'}
                  </h4>
                  <p className="text-xs text-muted-foreground mb-3">
                    {lang === 'de' ? 'Typisches Equipment:' : 'Typical equipment:'}
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1 mb-4">
                    {protocol.equipment.map((eq, i) => (
                      <li key={i}>• {eq}</li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${protocol.oneVisitProb}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full bg-primary rounded-full"
                      />
                    </div>
                    <span className="text-sm font-bold text-foreground shrink-0">
                      {protocol.oneVisitProb}% {lang === 'de' ? 'Ein-Besuch-Wahrscheinlichkeit' : 'one-visit probability'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">{protocol.note}</p>
                </div>
              )}

              {price && (
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                  <p className="text-sm font-semibold text-foreground">
                    {lang === 'de' ? 'Geschätzter Preis' : 'Estimated price'}: €{price.min} – €{price.max}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmitContact} className="space-y-4 pt-4">
                <h4 className="text-sm font-semibold">
                  {lang === 'de' ? 'Kontakt für Rückruf' : 'Contact for callback'}
                </h4>
                {[
                  { id: 'name', label: t('form.name'), type: 'text' },
                  { id: 'phone', label: t('form.phone'), type: 'tel' },
                  { id: 'email', label: t('form.email'), type: 'email' },
                  { id: 'address', label: t('form.address'), type: 'text' },
                ].map((f) => (
                  <div key={f.id} className="space-y-1">
                    <Label htmlFor={f.id}>{f.label}</Label>
                    <Input
                      id={f.id}
                      type={f.type}
                      required
                      value={(contact as Record<string, string>)[f.id]}
                      onChange={(e) => setContact((c) => ({ ...c, [f.id]: e.target.value }))}
                    />
                  </div>
                ))}
                <Button type="submit" className="w-full">
                  {t('funnel.cta')}
                </Button>
              </form>
            </motion.div>
          )}

          {submitted && (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 text-center"
            >
              <CheckCircle2 className="w-14 h-14 text-success mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">{t('funnel.success.title')}</h3>
              <p className="text-sm text-muted-foreground">{t('funnel.success.desc')}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
