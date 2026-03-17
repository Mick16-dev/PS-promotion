export interface Service {
  id: string
  image: string
  titleKey: string
  descKey: string
  price: number
}

export const services: Service[] = [
  {
    id: 'leak-detection',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
    titleKey: 'services.leak-detection.title',
    descKey: 'services.leak-detection.desc',
    price: 89
  },
  {
    id: 'drain-cleaning',
    image: '/services/drain-cleaning.png',
    titleKey: 'services.drain-cleaning.title',
    descKey: 'services.drain-cleaning.desc',
    price: 109
  },
  {
    id: 'fixture-replacement',
    image: 'https://images.unsplash.com/photo-1585704032915-c3400ca1f987?w=800&q=80',
    titleKey: 'services.fixture-replacement.title',
    descKey: 'services.fixture-replacement.desc',
    price: 129
  },
  {
    id: 'water-heater',
    image: '/water-heater-overview.png',
    titleKey: 'services.water-heater.title',
    descKey: 'services.water-heater.desc',
    price: 149
  },
  {
    id: 'sewer-line',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
    titleKey: 'services.sewer-line.title',
    descKey: 'services.sewer-line.desc',
    price: 169
  }
]
