/**
 * Rule-based diagnostic logic for visual lead capture.
 * Simulates AI analysis by problem type – can be replaced with real API later.
 */

export type Location = 'toilet' | 'kitchen_sink' | 'bathroom_sink' | 'shower' | 'pipe_floor' | 'other'
export type ProblemType = 'leaking' | 'blocked' | 'no_water' | 'burst' | 'dripping' | 'slow_drain' | 'smell' | 'other'
export type Detail = string

export interface DiagnosticSelection {
  location: Location
  problemType: ProblemType
  detail: Detail
}

/** Starting price by problem type (€) */
export const PRICING_BY_PROBLEM: Record<ProblemType, { min: number; max: number }> = {
  leaking: { min: 89, max: 180 },
  blocked: { min: 89, max: 150 },
  no_water: { min: 99, max: 200 },
  burst: { min: 149, max: 350 },
  dripping: { min: 79, max: 140 },
  slow_drain: { min: 69, max: 130 },
  smell: { min: 99, max: 200 },
  other: { min: 89, max: 250 },
}

/** AI-Symptom Match: likely fault explanation (non-binding) */
export function getSymptomMatch(sel: DiagnosticSelection, lang: 'en' | 'de'): string {
  const { location, problemType } = sel
  const key = `${location}-${problemType}`

  const en: Record<string, string> = {
    'toilet-leaking': 'Likely cause: worn wax ring seal at the toilet base, or a crack in the porcelain. Water pooling at the base typically indicates a broken seal between the toilet and the floor flange.',
    'toilet-blocked': 'Likely cause: obstruction in the toilet trap or main drain. Common culprits include excess toilet paper, foreign objects, or partial blockage in the building drain.',
    'toilet-slow_drain': 'Likely cause: partial blockage in the toilet trap or drain line. Buildup of scale or debris can restrict flow before a complete blockage occurs.',
    'kitchen_sink-leaking': 'Likely cause: worn gasket under the faucet, loose supply line connection, or corroded trap. Leaks under the sink often come from connections or the P-trap.',
    'kitchen_sink-blocked': 'Likely cause: grease and food buildup in the drain pipe. Kitchen sinks commonly block due to fats solidifying in the pipe.',
    'bathroom_sink-leaking': 'Likely cause: worn cartridge or O-ring in the faucet, or loose connection at the pop-up assembly. Drips at the spout usually indicate internal faucet wear.',
    'bathroom_sink-blocked': 'Likely cause: hair and soap residue in the drain or trap. Bathroom sinks frequently block from hair combined with soap scum.',
    'shower-blocked': 'Likely cause: hair and soap buildup in the shower drain. Shower drains typically block in the first 30–50 cm of pipe.',
    'shower-leaking': 'Likely cause: worn shower cartridge, faulty diverter, or cracked grout allowing water behind the tiles. Leaks may appear at the head, mixer, or base.',
    'pipe_floor-burst': 'Likely cause: pipe failure from age, freeze damage, or corrosion. Burst pipes under floors or in walls require immediate shut-off and professional repair.',
  }

  const de: Record<string, string> = {
    'toilet-leaking': 'Wahrscheinliche Ursache: defekte Dichtung (Wachstring) am Toilettenfuß oder Riss im Porzellan. Wasser am Boden deutet auf eine undichte Verbindung zwischen WC und Abflussflansch hin.',
    'toilet-blocked': 'Wahrscheinliche Ursache: Verstopfung im WC-Siphon oder Hauptabfluss. Häufig: zu viel Toilettenpapier, Fremdkörper oder partielle Verstopfung im Hausanschluss.',
    'toilet-slow_drain': 'Wahrscheinliche Ursache: partielle Verstopfung im Siphon oder Abflussrohr. Ablagerungen können den Abfluss einschränken.',
    'kitchen_sink-leaking': 'Wahrscheinliche Ursache: undichte Verbindung, lockere Anschlüsse oder defekter Siphon. Lecks unter der Spüle entstehen oft an Anschlüssen oder am Geruchsverschluss.',
    'kitchen_sink-blocked': 'Wahrscheinliche Ursache: Fett- und Essensreste im Abflussrohr. Küchenabflüsse verstopfen häufig durch erstarrtes Fett.',
    'bathroom_sink-leaking': 'Wahrscheinliche Ursache: abgenutzte Kartusche oder Dichtung im Hahn. Tropfen am Auslauf deuten auf Verschleiß in der Armatur hin.',
    'bathroom_sink-blocked': 'Wahrscheinliche Ursache: Haare und Seifenreste im Abfluss oder Siphon.',
    'shower-blocked': 'Wahrscheinliche Ursache: Haare und Seifenrückstände im Duschsiphon. Duschabflüsse verstopfen meist in den ersten 30–50 cm.',
    'shower-leaking': 'Wahrscheinliche Ursache: defekter Duschkopf oder undichte Fugen. Lecks können am Kopf, Mischer oder am Duschboden auftreten.',
    'pipe_floor-burst': 'Wahrscheinliche Ursache: Rohrbruch durch Alter, Frost oder Korrosion. Geplatzte Rohre erfordern sofortiges Absperren und Fachreparatur.',
  }

  const text = lang === 'de' ? de[key] : en[key]
  return text || (lang === 'de'
    ? 'Basierend auf Ihrer Angabe führen wir eine visuelle Analyse durch. Unsere Einschätzung wird nach Prüfung des Fotos/ Videos verfeinert.'
    : 'Based on your selection we run a visual analysis. Our assessment will be refined after reviewing your photo/video.')
}

/** Risk Assessment: cost of delay warning */
export function getRiskAssessment(sel: DiagnosticSelection, lang: 'en' | 'de'): string {
  const { problemType } = sel

  const en: Record<string, string> = {
    leaking: 'Delaying repair can lead to mold growth, floor damage, and higher repair costs. Water penetration into subfloors or walls often multiplies the final bill.',
    blocked: 'A blocked drain can overflow, cause backups into other fixtures, and damage seals. Sewage backup poses health risks and significantly increases cleanup costs.',
    burst: 'A burst pipe can cause hundreds of liters of water damage in minutes. Immediate shut-off and professional repair are essential to limit structural and insurance impacts.',
    no_water: 'Lack of water may indicate a main break, frozen pipe, or valve failure. Delaying diagnosis can extend downtime and complicate repairs.',
    dripping: 'A dripping tap wastes water and can cause stains, mineral buildup, and eventual fixture damage. Early repair is simpler and cheaper.',
    slow_drain: 'Slow drains often precede complete blockages. Addressing it early avoids overflow and more invasive drain cleaning.',
    smell: 'Sewer odors can indicate broken seals, dry traps, or vent issues. These can worsen and affect air quality if not addressed.',
    other: 'Plumbing issues rarely improve on their own. Early diagnosis reduces repair scope and cost.',
  }

  const de: Record<string, string> = {
    leaking: 'Verzögerung kann zu Schimmel, Bodenschäden und höheren Reparaturkosten führen. Eindringendes Wasser vergrößert oft den Schaden erheblich.',
    blocked: 'Verstopfte Abflüsse können überlaufen und in andere Installationen zurückschlagen. Rückstau birgt Gesundheitsrisiken und erhöht die Sanierungskosten.',
    burst: 'Ein geplatztes Rohr kann in Minuten Hunderte Liter Wasser verursachen. Sofortiges Absperren und fachgerechte Reparatur sind wichtig für Schadensbegrenzung.',
    no_water: 'Kein Wasser kann auf Rohrbruch, Frost oder Ventildefekt hindeuten. Verzögerung verlängert die Ausfallzeit.',
    dripping: 'Tropfende Hähne verschwenden Wasser und können Flecken und Kalk verursachen. Frühe Reparatur ist günstiger.',
    slow_drain: 'Langsame Abflüsse gehen oft einer kompletten Verstopfung voraus. Rechtzeitige Behandlung vermeidet Überlauf.',
    smell: 'Kanalgeruch kann auf defekte Dichtungen oder trockene Siphons hindeuten. Ohne Behandlung kann sich die Situation verschlechtern.',
    other: 'Sanitärprobleme verschwinden selten von selbst. Frühe Diagnose reduziert Aufwand und Kosten.',
  }

  return lang === 'de' ? de[problemType] || de.other : en[problemType] || en.other
}

/** Fix Protocol: equipment + One-Visit Probability (0–100) */
export function getFixProtocol(sel: DiagnosticSelection, lang: 'en' | 'de'): {
  equipment: string[]
  oneVisitProb: number
  note: string
} {
  const { location, problemType } = sel

  const equipmentByProblem: Record<ProblemType, string[]> = {
    leaking: ['Adjustable wrenches', 'Pipe sealant / Teflon tape', 'Replacement seals or cartridges', 'Leak detection equipment'],
    blocked: ['Drain snake / auger', 'High-pressure drain cleaner', 'Camera inspection (if needed)', 'Replacement trap components'],
    no_water: ['Pressure gauge', 'Valve key', 'Replacement valves or pipes', 'Thermal camera (for frozen pipes)'],
    burst: ['Pipe cutters', 'Couplings and fittings', 'Replacement pipe sections', 'Water extraction equipment'],
    dripping: ['Faucet repair kit', 'Cartridge puller', 'Replacement O-rings or cartridge', 'Silicone grease'],
    slow_drain: ['Drain snake', 'Enzyme cleaner', 'Trap wrench', 'Replacement trap if needed'],
    smell: ['Smoke test equipment', 'Sealant', 'Replacement wax ring / seals', 'Vent inspection tools'],
    other: ['Full diagnostic kit', 'Parts for common repairs', 'Sealants and fittings'],
  }

  const equipmentDe: Record<ProblemType, string[]> = {
    leaking: ['Rohrzangen', 'Dichtmittel / Teflonband', 'Ersatzdichtungen oder Kartuschen', 'Leckageortung'],
    blocked: ['Rohrreinigungs-Spirale', 'Hochdruck-Spülgerät', 'Kamera-Inspektion (bei Bedarf)', 'Ersatz-Siphonteile'],
    no_water: ['Druckprüfgerät', 'Absperrhahn-Schlüssel', 'Ersatzventile oder Rohre', 'Wärmebildkamera (bei Frost)'],
    burst: ['Rohrschneider', 'Verbindungsstücke', 'Ersatzrohre', 'Wassersauger'],
    dripping: ['Armatur-Reparaturset', 'Kartuschenzieher', 'Ersatz-O-Ringe oder Kartusche', 'Silikonfett'],
    slow_drain: ['Rohrreinigungsspirale', 'Enzymreiniger', 'Siphon-Schlüssel', 'Ersatzsiphon bei Bedarf'],
    smell: ['Rauchtest', 'Dichtmittel', 'Ersatz-Wachstring / Dichtungen', 'Lüftungsprüfung'],
    other: ['Vollständiges Diagnose-Set', 'Teile für gängige Reparaturen', 'Dichtmittel und Fittings'],
  }

  const equipment = lang === 'de' ? equipmentDe[problemType] : equipmentByProblem[problemType]
  const oneVisitProb = problemType === 'burst' ? 75 : problemType === 'blocked' ? 92 : problemType === 'dripping' ? 95 : 88
  const note = lang === 'de'
    ? `Einschätzung: In ca. ${oneVisitProb} % der Fälle können wir den Schaden in einem Besuch beheben – vorbehaltlich der Teileverfügbarkeit.`
    : `Estimate: In about ${oneVisitProb}% of cases we can resolve the issue in one visit – subject to parts availability.`

  return { equipment, oneVisitProb, note }
}

export const MAX_VIDEO_BYTES = 50 * 1024 * 1024 // 50 MB (~2 min video)
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024  // 10 MB
