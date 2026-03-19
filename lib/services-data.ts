export interface Service {
  id: string
  image: string
  titleKey: string
  descKey: string
  price: number
  slogan?: string
  icon?: string
}

export const services: Service[] = [
  {
    id: 'kanal-tv',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
    titleKey: 'services.kanal-tv.title',
    descKey: 'services.kanal-tv.desc',
    slogan: 'Wir machen schmutzige Filme',
    price: 149
  },
  {
    id: 'rohrreinigung',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
    titleKey: 'services.rohrreinigung.title',
    descKey: 'services.rohrreinigung.desc',
    slogan: '24/7 Notdienst - Keine Verstopfung ist uns zu groß',
    price: 95
  },
  {
    id: 'fettabscheider',
    image: 'https://images.unsplash.com/photo-1585704032915-c3400ca1f987?w=800&q=80',
    titleKey: 'services.fettabscheider.title',
    descKey: 'services.fettabscheider.desc',
    slogan: 'Wir machen Fettabsaugungen',
    price: 189
  },
  {
    id: 'kanalsanierung',
    image: 'https://images.unsplash.com/photo-1541888941293-1e8fbf3d12c8?w=800&q=80',
    titleKey: 'services.kanalsanierung.title',
    descKey: 'services.kanalsanierung.desc',
    slogan: 'Grabenlose Sanierung - nachhaltig & sauber',
    price: 249
  },
  {
    id: 'hebeanlagen',
    image: 'https://images.unsplash.com/photo-1621905235276-cca1752e807a?w=800&q=80',
    titleKey: 'services.hebeanlagen.title',
    descKey: 'services.hebeanlagen.desc',
    slogan: 'Wartung & Dichtheitsprüfung nach DIN',
    price: 129
  }
]
