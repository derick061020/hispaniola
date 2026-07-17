// Constructores de datos estructurados (schema.org). Todo sale de src/data/*
// — nunca se inventa un dato que el sitio no muestre ya en algún lado.
import { CONTACTO } from '@/data/home'
import type { Tour } from '@/data/home'
import type { PreguntaTour } from '@/data/tours'

const SITIO = () => window.location.origin

/** Organización — se monta una vez, en la home. Coordenadas y dirección
 *  parseadas de CONTACTO (data/home.ts), no re-tecleadas. */
export function schemaOrganizacion() {
  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: 'Hispaniola Aquatic Adventures',
    url: SITIO(),
    image: `${SITIO()}/marca/logo.png`,
    telephone: '+1-829-305-2804',
    email: CONTACTO.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Calle P.º del Sol',
      addressLocality: 'Punta Cana',
      postalCode: '23500',
      addressCountry: 'DO',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 18.66974,
      longitude: -68.401262,
    },
    // Mismo 4.9 / 1.782 reseñas que se muestra en las 4 fichas de tour y en
    // la cinta de confianza de la home (data/home.ts TOURS + STATS) — no es
    // un número aparte inventado para el schema.
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '1782',
    },
  }
}

/** Un tour bookeable (Product es el tipo con más soporte real de rich
 *  results, incluido el de 'TouristTrip' que schema.org sugiere pero Google
 *  soporta peor). Isla Saona (precioLight null, booking 'consulta') no
 *  publica `offers` — no hay precio real que anunciar. */
export function schemaTour(tour: Tour) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: tour.nombre,
    description: tour.descripcionCorta,
    image: `${SITIO()}/fotos/${tour.foto}.webp`,
    url: `${SITIO()}/tours/${tour.slug}`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: String(tour.rating),
      reviewCount: String(tour.resenas),
    },
    ...(tour.precioLight !== null
      ? {
          offers: {
            '@type': 'Offer',
            price: String(tour.precioLight),
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            url: `${SITIO()}/tours/${tour.slug}`,
          },
        }
      : {}),
  }
}

/** FAQPage — misma forma {p,r} que usan FAQ_HOME (data/home.ts) y
 *  ficha.faqTour (data/tours.ts), así que sirve para ambas secciones. */
export function schemaFaq(items: PreguntaTour[] | { p: string; r: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.p,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.r,
      },
    })),
  }
}
