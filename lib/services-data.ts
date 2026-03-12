/**
 * Service definitions and content for individual service pages.
 * Uses real plumbing imagery from Unsplash (free commercial use, real photos).
 * Before/after style: damaged/old state → repaired/renovated state.
 */

export type ServiceId = 'drain-cleaning' | 'leak-repair' | 'emergency' | 'bathroom' | 'kitchen' | 'heating'

export interface ServiceContent {
  id: ServiceId
  slug: string
  titleEn: string
  titleDe: string
  shortDescEn: string
  shortDescDe: string
  fromPrice: number
  /** Real plumbing photos - Unsplash (CC0, free commercial use) */
  beforeImage: string
  afterImage: string
  /** Detailed long-form content for the service page */
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
    id: 'drain-cleaning',
    slug: 'drain-cleaning',
    titleEn: 'Drain & Toilet Unblocking',
    titleDe: 'Abfluss- und Toiletten-Entstopfung',
    shortDescEn: 'Blocked toilet, shower or kitchen drain? We clear blockages quickly and reliably.',
    shortDescDe: 'Verstopfte Toilette, Dusche oder Spüle? Wir beheben Verstopfungen schnell und zuverlässig.',
    fromPrice: 89,
    beforeImage: 'https://images.unsplash.com/photo-1618228298959-0198d476d2ba?auto=format&fit=crop&w=900&q=80',
    afterImage: 'https://images.unsplash.com/photo-1650246363606-a2402ec42b08?auto=format&fit=crop&w=900&q=80',
    introEn: 'A blocked toilet or slow-draining sink is more than an inconvenience – it can lead to overflows, odours and, in the worst case, sewage backup. Our team uses professional drain snakes, high-pressure jetting where appropriate, and camera inspections to find and clear blockages without damaging your pipes.',
    introDe: 'Eine verstopfte Toilette oder langsam ablaufendes Waschbecken ist mehr als lästig – es kann zu Überläufen, Gerüchen und im schlimmsten Fall zu Rückstau führen. Wir setzen professionelle Rohrreinigungsspiralen, Hochdruck-Spülungen und Kamera-Inspektionen ein, um Verstopfungen zu finden und zu beseitigen, ohne Ihre Rohre zu beschädigen.',
    whatWeDoEn: [
      'Unblock toilets, showers, bathtub drains and kitchen sinks',
      'Sewer and drain line cleaning with high-pressure water jetting',
      'Camera inspection to locate blockages and assess pipe condition',
      'Removal of tree roots, grease buildup and foreign objects',
      'Prevention tips to reduce future blockages',
    ],
    whatWeDoDe: [
      'Entstopfen von Toiletten, Duschen, Badewannen und Küchenspülen',
      'Rohr- und Kanalreinigung mit Hochdruck-Spülung',
      'Kamera-Inspektion zur Ortung und Zustandsprüfung',
      'Entfernung von Wurzeln, Fettablagerungen und Fremdkörpern',
      'Tipps zur Vorbeugung künftiger Verstopfungen',
    ],
    whenToCallEn: [
      'Water rising in the toilet or draining very slowly',
      'Gurgling sounds or bad odours from drains',
      'Multiple drains backing up at once',
      'Water pooling around floor drains',
    ],
    whenToCallDe: [
      'Wasser steigt in der Toilette oder läuft sehr langsam ab',
      'Gurgelnde Geräusche oder unangenehme Gerüche aus Abflüssen',
      'Mehrere Abflüsse verstopfen gleichzeitig',
      'Wasser sammelt sich um Bodenabläufe',
    ],
    processEn: [
      { title: 'Assessment', desc: 'We ask a few questions by phone and may ask you to run water to see which drains are affected. This helps us bring the right equipment.' },
      { title: 'Inspection', desc: 'On site we check the affected drain and, if needed, use a camera to see what is causing the blockage.' },
      { title: 'Clearance', desc: 'We clear the blockage using drain rods, a drain snake or high-pressure jetting, depending on the situation.' },
      { title: 'Verification', desc: 'We run water and check that everything drains properly before we leave.' },
    ],
    processDe: [
      { title: 'Einschätzung', desc: 'Wir stellen am Telefon kurze Fragen und bitten Sie ggf., Wasser laufen zu lassen, um zu sehen, welche Abflüsse betroffen sind. So bringen wir die richtige Ausrüstung mit.' },
      { title: 'Prüfung', desc: 'Vor Ort prüfen wir den betroffenen Abfluss und setzen bei Bedarf eine Kamera ein, um die Ursache zu finden.' },
      { title: 'Beseitigung', desc: 'Wir entfernen die Verstopfung mit Rohrreinigungs spiralen, einer Spirale oder Hochdruck-Spülung – je nach Situation.' },
      { title: 'Kontrolle', desc: 'Wir lassen Wasser laufen und prüfen, ob alles ordnungsgemäß abfließt, bevor wir gehen.' },
    ],
  },
  {
    id: 'leak-repair',
    slug: 'leak-repair',
    titleEn: 'Leak Detection & Repair',
    titleDe: 'Leckage-Ortung und Reparatur',
    shortDescEn: 'Leaking pipes, dripping taps or burst hoses – we find and fix leaks before they cause damage.',
    shortDescDe: 'Undichte Leitungen, tropfende Hähne oder geplatzte Schläuche – wir finden und beheben Lecks, bevor sie Schäden anrichten.',
    fromPrice: 99,
    beforeImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80',
    afterImage: 'https://images.unsplash.com/photo-1542632867-261e4be41c7c?auto=format&fit=crop&w=900&q=80',
    introEn: 'Even a small drip can waste hundreds of litres a year and lead to mould, rust and structural damage. We locate leaks – including hidden ones under sinks, behind walls or under floors – and repair them with the right materials so you do not have to worry about repeat problems.',
    introDe: 'Schon ein kleines Tropfen kann hunderte Liter pro Jahr verschwenden und zu Schimmel, Rost und Bausubstanz-Schäden führen. Wir orten Lecks – auch versteckte unter Spülen, hinter Wänden oder unter Fußböden – und reparieren sie fachgerecht, damit Sie keine Folgeprobleme haben.',
    whatWeDoEn: [
      'Repair dripping taps, worn washers and faulty cartridges',
      'Fix leaks under sinks, basins and behind appliances',
      'Replace burst flexible hoses and damaged pipe sections',
      'Locate hidden leaks with pressure tests and thermal imaging',
      'Seal joints and replace fittings where necessary',
    ],
    whatWeDoDe: [
      'Reparatur tropfender Armaturen, abgenutzter Dichtungen und defekter Kartuschen',
      'Behebung von Lecks unter Spülen, Waschbecken und hinter Geräten',
      'Austausch geplatzter Schläuche und beschädigter Rohrleitungen',
      'Ortung versteckter Lecks mittels Druckprüfung und Thermographie',
      'Abdichten von Verbindungen und Austausch von Fittings',
    ],
    whenToCallEn: [
      'Visible dripping from taps or pipes',
      'Damp patches, stains or mould on walls or ceilings',
      'Unexplained increase in water bills',
      'Water under the sink, washing machine or boiler',
    ],
    whenToCallDe: [
      'Sichtbares Tropfen an Armaturen oder Leitungen',
      'Feuchte Stellen, Flecken oder Schimmel an Wänden oder Decken',
      'Unerklärlicher Anstieg der Wasserrechnung',
      'Wasser unter der Spüle, unter der Waschmaschine oder am Boiler',
    ],
    processEn: [
      { title: 'Diagnosis', desc: 'We identify the source of the leak – often by turning off different branches and checking pressure.' },
      { title: 'Quote', desc: 'We explain what needs to be done and give you a clear price before starting work.' },
      { title: 'Repair', desc: 'We carry out the repair with suitable materials and, where possible, without opening walls or floors unnecessarily.' },
      { title: 'Test', desc: 'We run water and check that the leak is fully resolved.' },
    ],
    processDe: [
      { title: 'Diagnose', desc: 'Wir ermitteln die Leckquelle – oft durch Absperren von Leitungssträngen und Druckprüfung.' },
      { title: 'Angebot', desc: 'Wir erklären, was nötig ist, und nennen Ihnen einen klaren Preis vor Beginn der Arbeiten.' },
      { title: 'Reparatur', desc: 'Wir führen die Reparatur mit passenden Materialien durch und vermeiden unnötige Öffnungen.' },
      { title: 'Test', desc: 'Wir lassen Wasser laufen und prüfen, ob das Leck vollständig behoben ist.' },
    ],
  },
  {
    id: 'emergency',
    slug: 'emergency-plumbing',
    titleEn: 'Emergency Plumbing',
    titleDe: 'Notdienst Sanitär',
    shortDescEn: 'Burst pipe, flood or no water at all? We are available 24/7 for urgent call-outs.',
    shortDescDe: 'Rohrbruch, Überflutung oder kein Wasser? Wir sind rund um die Uhr für dringende Einsätze erreichbar.',
    fromPrice: 149,
    beforeImage: 'https://images.unsplash.com/photo-1599463698367-11cb72775b67?auto=format&fit=crop&w=900&q=80',
    afterImage: 'https://images.unsplash.com/photo-1726931535180-d27a2ffd7474?auto=format&fit=crop&w=900&q=80',
    introEn: 'When water is flooding your home or you have no water at all, every minute counts. Our emergency team responds quickly, shuts off the water if needed, and repairs or temporarily secures the problem so you can get through the night safely. We explain the next steps and what a permanent fix will cost.',
    introDe: 'Wenn Wasser in die Wohnung läuft oder Sie gar kein Wasser mehr haben, zählt jede Minute. Unser Notdienst kommt schnell, sperrt bei Bedarf das Wasser ab und repariert oder sichert die Situation vorübergehend, damit Sie sicher durch die Nacht kommen. Wir erklären die nächsten Schritte und die Kosten einer dauerhaften Lösung.',
    whatWeDoEn: [
      '24/7 emergency call-out in Berlin and the surrounding area',
      'Water shut-off and temporary repairs to stop flooding',
      'Burst pipe repair and pipe replacement',
      'Restoration of water supply after a major leak',
      'Advice on drying, ventilation and preventing mould',
    ],
    whatWeDoDe: [
      '24/7 Notdienst-Einsatz in Berlin und Umgebung',
      'Wasserabstellung und provisorische Reparaturen zur Schadensbegrenzung',
      'Reparatur und Austausch geplatzter Rohre',
      'Wiedereinschalten der Wasserversorgung nach größeren Lecks',
      'Beratung zu Trocknung, Lüftung und Schimmelvermeidung',
    ],
    whenToCallEn: [
      'Water actively flowing from a burst pipe or fitting',
      'No water in the whole flat or house',
      'Sewage backing up into the bathroom or basement',
      'Gas smell (we coordinate with the gas emergency service)',
    ],
    whenToCallDe: [
      'Wasser läuft aktiv aus einem geplatzten Rohr oder einer Armatur',
      'Kein Wasser in der gesamten Wohnung oder im Haus',
      'Abwasser läuft in Bad oder Keller zurück',
      'Gasgeruch (wir koordinieren mit dem Gassperrdienst)',
    ],
    processEn: [
      { title: 'Call', desc: 'You call, describe the situation briefly, and we give you an estimated arrival time.' },
      { title: 'Shut-off', desc: 'We shut off the main or local stopcock to stop further damage.' },
      { title: 'Repair', desc: 'We carry out the necessary repair or temporary fix.' },
      { title: 'Handover', desc: 'We explain what we did and what permanent measures may still be needed.' },
    ],
    processDe: [
      { title: 'Anruf', desc: 'Sie rufen an, schildern kurz die Lage – wir nennen Ihnen eine grobe Ankunftszeit.' },
      { title: 'Absperrung', desc: 'Wir sperren Haupt- oder Absperrhahn ab, um weiteren Schaden zu verhindern.' },
      { title: 'Reparatur', desc: 'Wir führen die nötige Reparatur oder Provisorium durch.' },
      { title: 'Übergabe', desc: 'Wir erklären, was wir gemacht haben und welche dauerhaften Schritte noch nötig sein können.' },
    ],
  },
  {
    id: 'bathroom',
    slug: 'bathroom-plumbing',
    titleEn: 'Bathroom & Fittings',
    titleDe: 'Bad und Armaturen',
    shortDescEn: 'New taps, showers, toilets or full bathroom upgrades – we install and connect everything correctly.',
    shortDescDe: 'Neue Armaturen, Duschen, Toiletten oder komplette Badmodernisierungen – wir installieren und schließen alles fachgerecht an.',
    fromPrice: 199,
    beforeImage: 'https://images.unsplash.com/photo-1596180744691-d19a1b90b53c?auto=format&fit=crop&w=900&q=80',
    afterImage: 'https://images.unsplash.com/photo-1595515770330-ceeea7d82cfd?auto=format&fit=crop&w=900&q=80',
    introEn: 'Whether you are replacing a single tap or planning a full bathroom renovation, correct plumbing connections are essential. We install new toilets, showers, basins and taps, connect them to existing pipes, and ensure everything is leak-free and compliant with regulations.',
    introDe: 'Ob Sie nur eine Armatur tauschen oder das komplette Bad sanieren – die fachgerechte Installation ist entscheidend. Wir montieren neue Toiletten, Duschen, Waschbecken und Armaturen, schließen sie an bestehende Leitungen an und sorgen für dichte, normgerechte Anschlüsse.',
    whatWeDoEn: [
      'Installation of toilets, bidets and urinals',
      'Fitting new taps, shower mixers and thermostatic valves',
      'Shower and bathtub connections',
      'Basin and vanity unit plumbing',
      'Underfloor heating connections in bathrooms',
    ],
    whatWeDoDe: [
      'Installation von Toiletten, Bidets und Urinalen',
      'Einbau neuer Armaturen, Duschmischer und thermostatischer Ventile',
      'Anschluss von Dusche und Badewanne',
      'Anschluss von Waschbecken und Spülenschränken',
      'Anschluss von Bodenheizung im Bad',
    ],
    whenToCallEn: [
      'Renovating or modernising your bathroom',
      'Replacing old, dripping or damaged taps',
      'Installing a new shower or bathtub',
      'Moving or replacing the toilet',
    ],
    whenToCallDe: [
      'Sie sanieren oder modernisieren Ihr Bad',
      'Alte, tropfende oder defekte Armaturen sollen ersetzt werden',
      'Neue Dusche oder Badewanne soll eingebaut werden',
      'Toilette soll versetzt oder ersetzt werden',
    ],
    processEn: [
      { title: 'Planning', desc: 'We discuss your ideas, measure the existing connections and advise on what is feasible.' },
      { title: 'Quote', desc: 'You receive a transparent quote for labour and materials.' },
      { title: 'Installation', desc: 'We install the new fittings, connect them and seal all joints.' },
      { title: 'Handover', desc: 'We test everything and explain maintenance and warranty.' },
    ],
    processDe: [
      { title: 'Planung', desc: 'Wir besprechen Ihre Wünsche, messen die bestehenden Anschlüsse und beraten, was möglich ist.' },
      { title: 'Angebot', desc: 'Sie erhalten ein transparentes Angebot für Arbeit und Material.' },
      { title: 'Installation', desc: 'Wir montieren die neuen Armaturen, schließen sie an und dichten alle Anschlüsse ab.' },
      { title: 'Übergabe', desc: 'Wir testen alles und erklären Pflege und Garantie.' },
    ],
  },
  {
    id: 'kitchen',
    slug: 'kitchen-plumbing',
    titleEn: 'Kitchen Sinks & Appliances',
    titleDe: 'Küchenspülen und Geräte',
    shortDescEn: 'Kitchen sink installation, dishwasher and washing machine connections – done properly.',
    shortDescDe: 'Küchenspülen, Geschirrspüler und Waschmaschinen – fachgerecht angeschlossen.',
    fromPrice: 149,
    beforeImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80',
    afterImage: 'https://images.unsplash.com/photo-1661044437616-71100c9f638e?auto=format&fit=crop&w=900&q=80',
    introEn: 'A kitchen sink needs solid connections, correct waste routing and often a mixer tap or boiling-water tap. Dishwashers and washing machines require proper water and drain connections. We install and connect everything so it works reliably and stays leak-free.',
    introDe: 'Eine Küchenspüle braucht sichere Anschlüsse, korrekten Ablauf und oft eine Mischbatterie oder Kochendwasserhahn. Geschirrspüler und Waschmaschinen benötigen fachgerechte Wasser- und Ablaufanschlüsse. Wir installieren und schließen alles so an, dass es zuverlässig funktioniert und dicht bleibt.',
    whatWeDoEn: [
      'Installation of single and double kitchen sinks',
      'Fitting taps, spray arms and boiling-water taps',
      'Dishwasher and washing machine connections',
      'Waste and trap installation and repair',
      'Connection of water filters and softeners',
    ],
    whatWeDoDe: [
      'Einbau von ein- und zweigeteilten Küchenspülen',
      'Montage von Armaturen, Ausziehdüsen und Kochendwasserhähnen',
      'Anschluss von Geschirrspüler und Waschmaschine',
      'Einbau und Reparatur von Abfluss und Siphon',
      'Anschluss von Wasserfiltern und Enthärtungsanlagen',
    ],
    whenToCallEn: [
      'Installing a new kitchen or replacing the sink',
      'Adding or replacing a dishwasher or washing machine',
      'Fitting a boiling-water or filtered-water tap',
      'Leak or blockage under the kitchen sink',
    ],
    whenToCallDe: [
      'Neue Küche oder neue Spüle wird eingebaut',
      'Geschirrspüler oder Waschmaschine soll angeschlossen werden',
      'Kochendwasser- oder Filterarmatur soll eingebaut werden',
      'Leck oder Verstopfung unter der Küchenspüle',
    ],
    processEn: [
      { title: 'Survey', desc: 'We check existing connections and appliance positions.' },
      { title: 'Quote', desc: 'We provide a clear quote for installation and any extra parts.' },
      { title: 'Installation', desc: 'We mount the sink or appliance and connect water and waste.' },
      { title: 'Test', desc: 'We run water and check for leaks and correct drainage.' },
    ],
    processDe: [
      { title: 'Besichtigung', desc: 'Wir prüfen bestehende Anschlüsse und Gerätestellplätze.' },
      { title: 'Angebot', desc: 'Sie erhalten ein klares Angebot für Montage und eventuelle Zusatzteile.' },
      { title: 'Einbau', desc: 'Wir montieren Spüle oder Gerät und schließen Wasser und Ablauf an.' },
      { title: 'Test', desc: 'Wir testen mit Wasser und prüfen auf Dichtheit und korrekten Abfluss.' },
    ],
  },
  {
    id: 'heating',
    slug: 'heating-hot-water',
    titleEn: 'Heating & Hot Water',
    titleDe: 'Heizung und Warmwasser',
    shortDescEn: 'Hot water problems, boiler repairs and heating system maintenance – we keep you warm.',
    shortDescDe: 'Warmwasser-Probleme, Boiler-Reparaturen und Heizungswartung – wir sorgen dafür, dass es warm wird.',
    fromPrice: 199,
    beforeImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80',
    afterImage: 'https://images.unsplash.com/photo-1623850804422-692d18a4e2e3?auto=format&fit=crop&w=900&q=80',
    introEn: 'No hot water or cold radiators can make daily life uncomfortable. We repair and maintain boilers, hot water cylinders, circulators and heating systems. For larger projects we work with trusted heating engineers – we handle the plumbing side and coordinate the rest.',
    introDe: 'Kein Warmwasser oder kalte Heizkörper machen den Alltag schwer. Wir reparieren und warten Boiler, Warmwasserspeicher, Umwälzpumpen und Heizungsanlagen. Bei größeren Projekten arbeiten wir mit bewährten Heizungsbauern zusammen – wir übernehmen den Sanitärteil und koordinieren den Rest.',
    whatWeDoEn: [
      'Boiler and hot water cylinder repair',
      'Replacement of circulators and expansion vessels',
      'Radiator and underfloor heating connections',
      'Thermostatic valve fitting and repair',
      'Draining and refilling heating systems',
    ],
    whatWeDoDe: [
      'Reparatur von Boilern und Warmwasserspeichern',
      'Austausch von Umwälzpumpen und Ausdehnungsgefäßen',
      'Anschluss von Heizkörpern und Fußbodenheizung',
      'Einbau und Reparatur thermostatischer Ventile',
      'Entleeren und Befüllen von Heizungsanlagen',
    ],
    whenToCallEn: [
      'No or insufficient hot water',
      'Radiators stay cold or heat unevenly',
      'Strange noises from the boiler or pipes',
      'Leak from boiler, cylinder or heating pipes',
    ],
    whenToCallDe: [
      'Kein oder zu wenig Warmwasser',
      'Heizkörper bleiben kalt oder heizen ungleichmäßig',
      'Seltsame Geräusche von Boiler oder Leitungen',
      'Leck an Boiler, Speicher oder Heizungsrohren',
    ],
    processEn: [
      { title: 'Diagnosis', desc: 'We check pressure, circulation and hot water output to find the cause.' },
      { title: 'Quote', desc: 'We explain the fault and the cost of repair or replacement.' },
      { title: 'Repair', desc: 'We carry out the repair or replacement and refill the system if needed.' },
      { title: 'Check', desc: 'We verify that hot water and heating work correctly.' },
    ],
    processDe: [
      { title: 'Diagnose', desc: 'Wir prüfen Druck, Zirkulation und Warmwasserausbeute.' },
      { title: 'Angebot', desc: 'Wir erklären den Defekt und die Kosten für Reparatur oder Austausch.' },
      { title: 'Reparatur', desc: 'Wir führen die Reparatur oder den Austausch durch und füllen bei Bedarf die Anlage nach.' },
      { title: 'Kontrolle', desc: 'Wir prüfen, ob Warmwasser und Heizung korrekt funktionieren.' },
    ],
  },
]

export function getServiceBySlug(slug: string): ServiceContent | undefined {
  return services.find((s) => s.slug === slug)
}

export function getServiceById(id: ServiceId): ServiceContent | undefined {
  return services.find((s) => s.id === id)
}
