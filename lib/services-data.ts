/**
 * Rotek service definitions used for the service hub + detail pages.
 *
 * Source: https://rotek.de/leistungen/
 * Notes:
 * - Compiled from public Rotek data.
 * - Compatibility fields (id, image, price, slogan) added for legacy components.
 */

export type ServiceId =
  | 'rohrreinigung'
  | 'kanalreinigung'
  | 'kanalinspektion'
  | 'kanal-tv-sat'
  | 'hebeanlagen'
  | 'fettabscheider'
  | 'dichtheitspruefung'
  | 'kanalsanierung'

export interface ServiceContent {
  id: ServiceId
  slug: string
  titleEn: string
  titleDe: string
  shortDescEn: string
  shortDescDe: string
  image: string // legacy
  price: number // legacy
  slogan?: string // legacy
  fromPrice?: number
  beforeImage?: string
  afterImage: string
  introEn: string
  introDe: string
  whatWeDoEn: string[]
  whatWeDoDe: string[]
  whenToCallEn: string[]
  whenToCallDe: string[]
  processEn: { title: string; desc: string }[]
  processDe: { title: string; desc: string }[]
}

export const services: ServiceContent[] = [
  {
    id: 'rohrreinigung',
    slug: 'rohrreinigung',
    titleEn: 'Pipe cleaning (24h emergency service)',
    titleDe: 'Rohrreinigung (24h Notdienst)',
    shortDescEn: 'Professional blockage removal with modern equipment – clean, fast, and long-term.',
    shortDescDe: 'Verstopfungsbeseitigung mit moderner Technik – schnell, sauber und langfristig.',
    image: 'https://rotek.de/wp-content/uploads/2021/05/fraesen-800px.jpg',
    afterImage: 'https://rotek.de/wp-content/uploads/2021/05/fraesen-800px.jpg',
    price: 95,
    fromPrice: 95,
    slogan: '24/7 Notdienst - Keine Verstopfung ist uns zu groß',
    introEn: 'Sediments build up over years and reduce the inner diameter of pipes until a full blockage occurs. Rotek uses modern equipment to clear blockages quickly, cleanly, and with a long-term result.',
    introDe: 'Über Jahre setzen sich Sedimente an den Innenwänden ab, der Rohrdurchmesser wird kleiner – bis zur vollständigen Verstopfung. Rotek arbeitet mit modernster Technik, um das Problem schnell, sauber und langfristig zu lösen.',
    whatWeDoEn: [
      'Professional mechanical cleaning instead of aggressive chemicals',
      'Electric milling/spiral machines with different strengths and lengths in every vehicle',
      'Removal of deposits, encrustations and root intrusion in many pipe diameters (approx. DN 40–DN 300)',
    ],
    whatWeDoDe: [
      'Manuelle, professionelle Reinigung statt aggressiver Chemie',
      'Elektrisch angetriebene Fräsmaschinen/Spiralen in unterschiedlichen Stärken und Längen in jedem Einsatzfahrzeug',
      'Lösen von Ablagerungen, Verkrustungen und Wurzeleinwuchs in vielen Rohrdurchmessern (ca. DN 40–DN 300)',
    ],
    whenToCallEn: ['Reduced flow rate', 'Recurring blockages', 'Complete pipe blockage'],
    whenToCallDe: ['Verringerte Fließgeschwindigkeit', 'Wiederkehrende Verstopfungen', 'Vollständige Rohrverstopfung'],
    processEn: [
      { title: 'Assessment', desc: 'Clarify the situation and access points.' },
      { title: 'Mechanical cleaning', desc: 'Use electrically driven equipment adapted to diameter and blockage type.' },
      { title: 'Verification', desc: 'Verify that the pipe is free-flowing again.' },
    ],
    processDe: [
      { title: 'Einschätzung', desc: 'Klärung der Situation und Zugänge.' },
      { title: 'Mechanische Reinigung', desc: 'Einsatz elektrisch angetriebener Technik – angepasst an Durchmesser und Verstopfungsart.' },
      { title: 'Kontrolle', desc: 'Prüfung, ob die Leitung wieder frei läuft.' },
    ],
  },
  {
    id: 'kanalreinigung',
    slug: 'kanalreinigung',
    titleEn: 'Drain/sewer cleaning (24h service)',
    titleDe: 'Kanalreinigung (24h Service)',
    shortDescEn: 'Electromechanical cleaning and high-pressure jetting for deposits, roots and sediments.',
    shortDescDe: 'Elektromechanische Reinigung und Hochdruckspülung bei Ablagerungen, Wurzeln und Sedimenten.',
    image: 'https://rotek.de/wp-content/uploads/2021/05/hd-spuelen.jpg',
    afterImage: 'https://rotek.de/wp-content/uploads/2021/05/hd-spuelen.jpg',
    price: 149,
    fromPrice: 149,
    slogan: 'Hochdruck-Spülung & TV-Nachweis',
    introEn: 'Even large-diameter sewers can clog due to roots or sediments. Rotek offers 24-hour availability and uses electromechanical cleaning and hydrodynamic high-pressure jetting depending on the blockage.',
    introDe: 'Auch Kanäle mit großem Durchmesser können durch Wurzelwerk oder Sedimente verstopfen. Rotek ist mit 24-Stunden-Service erreichbar und setzt – je nach Fall – elektromechanische Reinigung sowie Hochdruckspülung ein.',
    whatWeDoEn: [
      'Electromechanical cleaning (“milling”) with pipe-friendly spirals and specialized heads',
      'Hydrodynamic cleaning (“HD-spülen”) to flush sludge, sand and deposits',
      'Preparation cleaning for TV inspection and before sewer rehabilitation',
    ],
    whatWeDoDe: [
      'Elektromechanische Reinigung („Fräsen“) mit rohrschonenden Spiralen und passenden Aufsätzen',
      'Hydrodynamische Reinigung („HD-Spülen“) zum Verflüssigen und Wegspülen von Schlämmen, Sand und Ablagerungen',
      'Reinigung als Vorbereitung für TV-Untersuchung und vor Sanierungen',
    ],
    whenToCallEn: ['Sewage backs up in multiple fixtures', 'House/building drainage stops working', 'Recurring sewer issues'],
    whenToCallDe: ['Rückstau in mehreren Entwässerungsstellen', 'Abfluss im Haus/Betrieb steht', 'Wiederkehrende Kanalprobleme'],
    processEn: [
      { title: 'Triage', desc: 'Fast coordination via phone/mail/contact form.' },
      { title: 'Cleaning method selection', desc: 'Choose electromechanical cleaning and/or high-pressure jetting.' },
      { title: 'Verification', desc: 'Confirm restored flow and readiness for inspection if required.' },
    ],
    processDe: [
      { title: 'Disposition', desc: 'Schnelle Terminabsprache per Telefon/Mail/Kontaktformular.' },
      { title: 'Verfahrenswahl', desc: 'Elektromechanische Reinigung und/oder Hochdruckspülung.' },
      { title: 'Kontrolle', desc: 'Prüfung des freien Abflusses und ggf. Vorbereitung für Untersuchung.' },
    ],
  },
  {
    id: 'kanalinspektion',
    slug: 'kanal-tv',
    titleEn: 'CCTV sewer inspection',
    titleDe: 'Kanal-TV-Untersuchung',
    shortDescEn: 'Camera-based inspection, condition assessment, pinpoint locating and documentation.',
    shortDescDe: 'Kameragestützte Inspektion, Zustandserfassung, punktgenaue Ortung und Dokumentation.',
    image: 'https://rotek.de/wp-content/uploads/2021/05/Kanalinspektion_Servicefahrzeug.jpg',
    afterImage: 'https://rotek.de/wp-content/uploads/2021/05/Kanalinspektion_Servicefahrzeug.jpg',
    price: 149,
    fromPrice: 149,
    slogan: 'Wir machen schmutzige Filme',
    introEn: 'CCTV inspection is essential for new acceptance and inspection of existing sewers. Modern TV systems reduce excavation and demolition work to a minimum and support targeted rehabilitation planning.',
    introDe: 'Die Kanal-TV-Untersuchung ist für Neuabnahmen und die Inspektion bestehender Kanäle unverzichtbar. Moderne TV-Anlagen minimieren Grabungen und Abrissarbeiten und unterstützen die gezielte Sanierungsplanung.',
    whatWeDoEn: [
      'Cleaning of pipes before camera inspection',
      'Pipe inspection with camera probes',
      'Sewer inspection with camera vehicles',
      'Condition capture and evaluation of the pipe/sewer system',
      'Damage diagnostics and pinpoint locating of sewer runs + creation of an inventory plan',
      'Delivery of data, images or videos (e.g. on DVD/CD)',
    ],
    whatWeDoDe: [
      'Reinigung der Rohre vor der Kamerainspektion',
      'Rohrinspektion mit Kamerasonden',
      'Kanalinspektion mit Kamerafahrzeugen',
      'Zustandserfassung und -bewertung des Rohr- und Kanalsystems',
      'Schadensdiagnose sowie punktgenaue Ortung der Kanalverläufe und Erstellung eines Bestandsplans',
      'Lieferung der Daten, Bilder bzw. Videos (z. B. auf DVD/CD)',
    ],
    whenToCallEn: ['Inspection for acceptance', 'Condition check of existing systems', 'Targeted damage localization before rehabilitation'],
    whenToCallDe: ['Neuabnahme', 'Zustandsprüfung bestehender Systeme', 'Gezielte Ortung vor Sanierungen'],
    processEn: [
      { title: 'Preparation', desc: 'Clean the line if required.' },
      { title: 'Inspection', desc: 'Record with camera probe or camera vehicle (depending on diameter).' },
      { title: 'Documentation', desc: 'Provide reports, images/videos and optional 3D model (depending on pipe diameter).' },
    ],
    processDe: [
      { title: 'Vorbereitung', desc: 'Reinigung der Leitung (falls erforderlich).' },
      { title: 'Untersuchung', desc: 'Aufzeichnung mit Kamerasonde oder Kamerafahrzeug (je nach Durchmesser).' },
      { title: 'Dokumentation', desc: 'Übergabe von Bericht, Bild-/Videomaterial und optional 3D-Modell (abhängig vom Rohrdurchmesser).' },
    ],
  },
  {
    id: 'kanal-tv-sat',
    slug: 'kanal-tv-sat',
    titleEn: 'CCTV inspection with satellite technology',
    titleDe: 'Kanal-TV-Untersuchung mit Satellitentechnik',
    shortDescEn: 'Inspection of side connections from the main sewer with satellite camera systems and 3D mapping.',
    shortDescDe: 'Untersuchung von Nebenkanälen vom Hauptkanal aus – mit Satellitentechnik und 3D-Kanalverlaufsvermessung.',
    image: 'https://rotek.de/wp-content/uploads/2021/05/Kanaluntersuchung-Sat.jpg',
    afterImage: 'https://rotek.de/wp-content/uploads/2021/05/Kanaluntersuchung-Sat.jpg',
    price: 199,
    fromPrice: 199,
    slogan: 'Satelliten-TV & 3D Rohrortung',
    introEn: 'Inspection of side sewers from the main sewer. The used satellite technology enables simultaneous flushing, inspection and measurement.',
    introDe: 'Untersuchung von Nebenkanälen vom Hauptkanal aus. Die verwendete Satellitentechnik ermöglicht gleichzeitiges Spülen, Inspizieren und Vermessen.',
    whatWeDoEn: [
      'Satellite inspection of property and house connection lines from the main sewer',
      '3D capture of sewer run with ASYS mapping system (CAD/GIS compatible export)',
      'Condition recording supported by inspection software standards (DIN EN 13508-2, DWA-M 149-2)',
    ],
    whatWeDoDe: [
      'Satelliten-Inspektion von Grundstücks- und Hausanschlussleitungen vom Hauptkanal aus',
      '3D-Erfassung des Kanalverlaufs mit ASYS (CAD/GIS-kompatible Daten)',
      'Zustandserfassung unterstützt durch Inspektionssoftware-Standards (DIN EN 13508-2, DWA-M 149-2)',
    ],
    whenToCallEn: ['House connection inspection from main sewer', 'Inventory plan and precise sewer run documentation'],
    whenToCallDe: ['Hausanschlussinspektion vom Hauptkanal', 'Bestandsplan und präzise Kanalverlaufsdokumentation'],
    processEn: [
      { title: 'Positioning', desc: 'Advance camera to the branch and position for turning.' },
      { title: 'Inspection + mapping', desc: 'Inspect branches and capture the run digitally during the inspection.' },
      { title: 'Handover', desc: 'Provide documentation, images/videos and exportable datasets.' },
    ],
    processDe: [
      { title: 'Positionierung', desc: 'Kamera zum Abzweig vorbringen und für das Abbiegen positionieren.' },
      { title: 'Inspektion + Vermessung', desc: 'Abzweige inspizieren und den Verlauf während der Untersuchung digital erfassen.' },
      { title: 'Übergabe', desc: 'Dokumentation, Bild-/Videomaterial und exportierbare Datensätze bereitstellen.' },
    ],
  },
  {
    id: 'hebeanlagen',
    slug: 'hebeanlagen',
    titleEn: 'Lifting stations (maintenance & cleaning)',
    titleDe: 'Hebeanlagen (Wartung & Reinigung)',
    shortDescEn: 'Regular maintenance per DIN EN 12056-4 with documented protocols for insurance protection.',
    shortDescDe: 'Regelmäßige Wartung nach DIN EN 12056-4 mit Nachweis/Protokoll – auch relevant für Versicherungsschutz.',
    image: 'https://rotek.de/wp-content/uploads/2021/05/Wartung_Hebeanlagen.jpg',
    afterImage: 'https://rotek.de/wp-content/uploads/2021/05/Wartung_Hebeanlagen.jpg',
    price: 129,
    fromPrice: 129,
    slogan: 'Wartung & Dichtheitsprüfung nach DIN',
    introEn: 'Lifting stations transport wastewater from below the backflow level into the sewer connection. Regular maintenance is recommended and regulated in DIN EN 12056-4.',
    introDe: 'Hebeanlagen leiten Abwässer unterhalb der Rückstauebene in den Kanalisationsanschluss. Regelmäßige Wartung ist sinnvoll und in der DIN EN 12056-4 geregelt.',
    whatWeDoEn: [
      'Inspection and maintenance including key functional checks',
      'Cleaning of components and connected pipe sections',
      'Maintenance protocols as proof of regular service',
    ],
    whatWeDoDe: [
      'Inspektion und Wartung inklusive Funktionsprüfungen',
      'Reinigung von Komponenten und angeschlossenen Leitungsbereichen',
      'Wartungsprotokolle als Nachweis der regelmäßigen Wartung',
    ],
    whenToCallEn: ['Regular maintenance intervals', 'After backflow events', 'For documented maintenance proof'],
    whenToCallDe: ['Regelmäßige Wartungsintervalle', 'Nach Rückstauereignissen', 'Wenn Wartungsnachweise benötigt werden'],
    processEn: [
      { title: 'Inspection', desc: 'Check valves, electrical parts and key components.' },
      { title: 'Cleaning', desc: 'Clean tank and components; flush as required.' },
      { title: 'Protocol', desc: 'Document the work for your records.' },
    ],
    processDe: [
      { title: 'Inspektion', desc: 'Prüfung von Schiebern, elektrischen Teilen und Kernkomponenten.' },
      { title: 'Reinigung', desc: 'Innenreinigung und Funktionsprüfung; Spülung nach Bedarf.' },
      { title: 'Protokoll', desc: 'Dokumentation der Arbeiten für Ihre Unterlagen.' },
    ],
  },
  {
    id: 'fettabscheider',
    slug: 'fettabscheider',
    titleEn: 'Grease separators (cleaning & disposal)',
    titleDe: 'Fettabscheider (Reinigung & Entsorgung)',
    shortDescEn: 'Complete emptying, pressure cleaning and proper disposal per applicable standards.',
    shortDescDe: 'Komplettlösung: Leerung, Hochdruckreinigung und fachgerechte Entsorgung nach Norm.',
    image: 'https://rotek.de/wp-content/uploads/2021/05/entsorgung02.jpg',
    afterImage: 'https://rotek.de/wp-content/uploads/2021/05/entsorgung02.jpg',
    price: 189,
    fromPrice: 189,
    slogan: 'Wir machen Fettabsaugungen',
    introEn: 'Grease separators must be operated and serviced according to standards. Rotek cleans separators efficiently and disposes of fats and sludges properly.',
    introDe: 'Fettabscheider sind nach Norm zu betreiben und regelmäßig durch sachkundige Fachbetriebe zu reinigen. Rotek übernimmt Reinigung und ordnungsgemäße Entsorgung von Fetten und Schlämmen.',
    whatWeDoEn: [
      'Complete emptying of grease separator and sludge trap',
      'Flushing and cleaning of the system with high-pressure water',
      'Correct closing and recommissioning of the system',
      'Optional high-pressure flushing and/or electromechanical cleaning of feeding lines',
      'Environmentally responsible processing/disposal of contents',
    ],
    whatWeDoDe: [
      'Vollständige Leerung von Fettabscheider und Schlammfang',
      'Ausspülung und Reinigung der Anlage mit Wasserhochdruck',
      'Korrektes Verschließen und Inbetriebnahme der Anlage',
      'Bei Bedarf Hochdruckspülung und/oder elektromechanische Reinigung der zuführenden Sammelleitungen',
      'Umweltgerechte Verwertung/Entsorgung der Inhalte',
    ],
    whenToCallEn: ['Regular service intervals', 'Odour issues', 'Blockages in connected lines', 'Required compliance checks'],
    whenToCallDe: ['Regelmäßige Intervalle', 'Geruchsbelästigungen', 'Verstopfungen', 'Norm-/Satzungsanforderungen'],
    processEn: [
      { title: 'Emptying', desc: 'Remove fats/sludge from separator and sludge trap.' },
      { title: 'Pressure cleaning', desc: 'Clean with water high pressure and flush lines as needed.' },
      { title: 'Recommission', desc: 'Close correctly and bring the system back into operation.' },
    ],
    processDe: [
      { title: 'Leerung', desc: 'Entfernung von Fetten/Schlämmen aus Abscheider und Schlammfang.' },
      { title: 'Hochdruckreinigung', desc: 'Reinigung mit Wasserhochdruck und Spülung nach Bedarf.' },
      { title: 'Inbetriebnahme', desc: 'Korrektes Verschließen und Wiederinbetriebnahme.' },
    ],
  },
  {
    id: 'dichtheitspruefung',
    slug: 'dichtheitspruefung',
    titleEn: 'Leak tightness testing (wastewater lines)',
    titleDe: 'Dichtheitsprüfung (Abwasserkanäle)',
    shortDescEn: 'Certified tightness tests with documented protocols (DIN EN 1610, DIN 1986-30 and more).',
    shortDescDe: 'Zertifizierte Dichtheitsprüfungen mit Protokoll (u. a. DIN EN 1610, DIN 1986-30).',
    image: 'https://rotek.de/wp-content/uploads/2021/05/dichtheitspruefung02.jpg',
    afterImage: 'https://rotek.de/wp-content/uploads/2021/05/dichtheitspruefung02.jpg',
    price: 199,
    fromPrice: 199,
    slogan: 'Prüfprotokolle nach DIN EN 1610',
    introEn: 'Tightness protects the environment and prevents moisture damage. Rotek performs tightness tests across different systems and provides the required protocols for authorities.',
    introDe: 'Dichtheit schützt Umwelt und verhindert Nässeschäden. Rotek führt Dichtheitsprüfungen in verschiedenen Systemen durch und erstellt die geforderten Protokolle als Nachweis.',
    whatWeDoEn: [
      'Testing of entire runs (with/without including manholes)',
      'Testing of individual pipes/sections and connections',
      'Testing of house connection lines when access points are available',
      'Creation of tightness test protocols for authorities',
    ],
    whatWeDoDe: [
      'Prüfung der Gesamthaltung (mit/ohne Einbeziehung der Schächte)',
      'Prüfung einzelner Rohre/Rohrabschnitte und Rohrverbindungen',
      'Prüfung der Hausanschlussleitungen bei Vorhandensein von Öffnungen/Kontrollschächten',
      'Erstellung der geforderten Dichtheitsprotokolle als Nachweis',
    ],
    whenToCallEn: ['Authority-required proof', 'Environmental protection and damage prevention', 'Before/after rehabilitation planning'],
    whenToCallDe: ['Behördlicher Nachweis', 'Schutz von Umwelt und Bausubstanz', 'Im Rahmen von Sanierungsplanung'],
    processEn: [
      { title: 'Preparation', desc: 'Assess access points and the testing scope.' },
      { title: 'Testing', desc: 'Execute tightness testing within technical and legal requirements.' },
      { title: 'Protocol', desc: 'Provide documented protocol as proof.' },
    ],
    processDe: [
      { title: 'Vorbereitung', desc: 'Klärung von Zugängen und Prüfungsumfang.' },
      { title: 'Prüfung', desc: 'Durchführung der Dichtheitsprüfung nach technischem und rechtlichem Rahmen.' },
      { title: 'Protokoll', desc: 'Übergabe des dokumentierten Prüfprotokolls.' },
    ],
  },
  {
    id: 'kanalsanierung',
    slug: 'kanalsanierung',
    titleEn: 'Sewer rehabilitation (often without excavation)',
    titleDe: 'Kanalsanierung (oft ohne Grabearbeiten)',
    shortDescEn: 'Inliner and point repairs with reduced excavation and fast reinstatement.',
    shortDescDe: 'Inliner- und Partliner-Sanierung – weniger Aufgraben, schnelle Wiederherstellung.',
    image: 'https://rotek.de/wp-content/uploads/2021/05/kanalisierung01.jpg',
    afterImage: 'https://rotek.de/wp-content/uploads/2021/05/kanalisierung01.jpg',
    price: 249,
    fromPrice: 249,
    slogan: 'Grabenlose Sanierung - nachhaltig & sauber',
    introEn: 'Property owners are responsible for maintaining private wastewater lines. Rotek offers cost-effective rehabilitation methods (including epros method with DIBt approval) where excavation is often unnecessary.',
    introDe: 'Grundstückseigentümer sind zur Instandhaltung privater Abwasserleitungen verpflichtet. Rotek bietet kostengünstige Sanierungsmethoden (u. a. epros mit DIBt-Zulassung), bei denen Aufgraben oftmals entfällt.',
    whatWeDoEn: [
      'Rehabilitation of house connections using inliner systems under air pressure',
      'Point repairs with part liners for localized damage',
      'Rehabilitation planning based on inspection results',
    ],
    whatWeDoDe: [
      'Sanierung von Hausanschlüssen mittels Inlinersystem unter Luftdruck',
      'Punktgenaue Reparatur räumlich begrenzter Schäden mit Partlinern',
      'Sanierungsplanung auf Basis von Untersuchungsergebnissen',
    ],
    whenToCallEn: ['Damaged wastewater lines', 'Root intrusion/groundwater ingress', 'Avoiding excavation where possible'],
    whenToCallDe: ['Beschädigte Abwasserleitungen', 'Wurzeleinwuchs/Grundwassereinbruch', 'Wenn Aufgraben möglichst vermieden werden soll'],
    processEn: [
      { title: 'Assessment', desc: 'Determine damage scope and suitable method.' },
      { title: 'Inliner installation', desc: 'Introduce liner material into the pipe and cure for a durable composite.' },
      { title: 'Handover', desc: 'Restore operation with smooth inner surface and documented outcome.' },
    ],
    processDe: [
      { title: 'Einschätzung', desc: 'Schadensbild aufnehmen und geeignetes Verfahren wählen.' },
      { title: 'Inliner-Einbau', desc: 'Sanierungsmaterial einziehen/einbringen und zum Verbundsystem aushärten.' },
      { title: 'Übergabe', desc: 'Wiederherstellung der Funktion mit glatter Innenbeschichtung und dokumentiertem Ergebnis.' },
    ],
  },
]

export function getServiceBySlug(slug: string): ServiceContent | undefined {
  return services.find((s) => s.slug === slug)
}

export function getServiceById(id: string): ServiceContent | undefined {
  return services.find((s) => s.id === id)
}
