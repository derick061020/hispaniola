// Constructores de datos estructurados (schema.org). Todo sale de src/data/*
// — nunca se inventa un dato que el sitio no muestre ya en algún lado.
import { CONTACTO } from '@/data/home'
import type { Tour } from '@/data/home'
import type { FichaTour, PreguntaTour } from '@/data/tours'

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
    // [v3 2026-08-06] El sitio es en inglés (plan 01). Declararlo aquí evita
    // que Google infiera el idioma solo del contenido.
    inLanguage: 'en',
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
 *  soporta peor). Isla Saona v3 (2026-07-17): cuando `ficha` tiene
 *  `subVariantes` (Saona: speedboat / fishing / catamarán), el `offers` pasa
 *  a ser un `AggregateOffer` con low/high + lista de Offer por tramo — más fiel
 *  a la web del cliente que el único `precioLight` que ven los otros tours.
 *  Para los tours sin subVariantes se mantiene un único Offer con `precioLight`
 *  (el ancla del widget). */
export function schemaTour(tour: Tour, ficha?: FichaTour) {
  const base = {
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
  }

  // Con subVariantes (Saona): AggregateOffer con todos los tramos.
  if (ficha?.subVariantes && ficha.subVariantes.length > 0) {
    const precios: number[] = []
    const tramos: Array<Record<string, unknown>> = []
    for (const v of ficha.subVariantes) {
      for (const t of v.tabla) {
        // Para el schema publicamos el precio POR PERSONA cuando es
        // tramo-por-persona, y el total del grupo cuando es fijo (precio real
        // que pagaría alguien con `t.desde` pax).
        const precioPublicado = t.tipo === 'persona' ? t.precio : t.precio
        precios.push(precioPublicado)
        tramos.push({
          '@type': 'Offer',
          name: `${v.nombre} · ${t.desde}${t.hasta === null ? '+' : `-${t.hasta}`} pax`,
          price: String(precioPublicado),
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: `${SITIO()}/tours/${tour.slug}`,
        })
      }
    }
    return {
      ...base,
      offers: {
        '@type': 'AggregateOffer',
        lowPrice: String(Math.min(...precios)),
        highPrice: String(Math.max(...precios)),
        priceCurrency: 'USD',
        offerCount: String(tramos.length),
        offers: tramos,
      },
    }
  }

  // Sin subVariantes: tarifa dual (Snorkel Lovers, v3 2026-07-17) o un
  // único Offer con precioLight (modelo clásico).
  if (tour.precioLight !== null) {
    if (tour.precioNino !== null && tour.precioNino !== undefined) {
      return {
        ...base,
        offers: {
          '@type': 'AggregateOffer',
          lowPrice: String(tour.precioNino),
          highPrice: String(tour.precioLight),
          priceCurrency: 'USD',
          offerCount: '2',
          offers: [
            {
              '@type': 'Offer',
              name: 'Adult',
              price: String(tour.precioLight),
              priceCurrency: 'USD',
              availability: 'https://schema.org/InStock',
              url: `${SITIO()}/tours/${tour.slug}`,
            },
            {
              '@type': 'Offer',
              name: 'Child',
              price: String(tour.precioNino),
              priceCurrency: 'USD',
              availability: 'https://schema.org/InStock',
              url: `${SITIO()}/tours/${tour.slug}`,
            },
          ],
        },
      }
    }
    return {
      ...base,
      offers: {
        '@type': 'Offer',
        price: String(tour.precioLight),
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: `${SITIO()}/tours/${tour.slug}`,
      },
    }
  }

  // Sin precio (consulta): no se publica `offers` — no hay precio real.
  return base
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
