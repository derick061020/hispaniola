import { EVENTOS } from '@/data/eventos'
import type { Tour } from '@/data/home'
import type { FichaTour } from '@/data/tours'
import { traducible } from '@/lib/i18n'

// [2026-08-25, pedido de Samuel: «deja que tenga un funnel que permita pagar y
// todo, permítelo correctamente»]
//
// Party boat y bodas dejan de ser solo formulario: se reservan y se pagan como
// un tour, con su depósito del 25 %. Lo que lo hacía imposible no era el
// botón, era el precio — los cuatro paquetes (Classic 660, Signature 780,
// Grand 900, Premium 1.188, más el extra por invitado a partir de 12) vivían
// SOLO aquí, en el front, y Odoo tenía un único juego de números por
// excursión. Cobrar así le habría cobrado 1.188 a quien eligió el Classic.
//
// Los paquetes están ya sembrados en Odoo como VARIANTES con su precio propio
// (`scripts/seed_event_packages.py` del módulo), así que aquí no se calcula
// nada: el funnel pregunta y pinta lo que contesta el servidor, igual que los
// cuatro tours. Estas entradas son solo la FORMA que el funnel espera.
//
// **MICE se queda fuera a propósito.** No tiene paquetes ni precio cerrado en
// ningún sitio —se cotiza a medida—, así que ponerle un botón de pagar
// obligaría a inventarse una cifra. Su landing sigue con el formulario, que
// para ese producto es lo correcto.
//
// Por qué un registro aparte y no una entrada más en `TOURS`: `TOURS` es la
// lista de los cuatro productos de catálogo y de ahí comen el grid de la home,
// el megamenú, el ticker, el sitemap y las páginas de comparación. Meter dos
// eventos ahí los publicaría en los cinco sitios. El funnel los busca aquí
// cuando no los encuentra allí, y no cambia nada más.

/** Los dos eventos que se pueden pagar online. MICE no está y es deliberado. */
export const SLUGS_EVENTO_RESERVABLE = ['party-boat', 'weddings'] as const

export type SlugEventoReservable = (typeof SLUGS_EVENTO_RESERVABLE)[number]

/** El paquete más barato: es el ancla que se pinta mientras Odoo contesta. */
function precioDesde(slug: SlugEventoReservable): number {
  const items = EVENTOS[slug]?.paquetes?.items ?? []
  const precios = items.map((p) => p.precioBase).filter((n): n is number => n !== null)
  return precios.length ? Math.min(...precios) : 0
}

/** Los paquetes como sub-variantes: es la pieza que el funnel ya sabe pintar
 *  (la usa el charter para elegir barco) y la que viaja a Odoo como `variant`.
 *
 *  ⚠️ El `id` tiene que ser el MISMO slug que la variante en Odoo, porque es
 *  lo que se manda en `?variante=`. Los ids del front (`package-i`, `premium`)
 *  son de la landing y no coinciden, así que se traducen aquí y en un solo
 *  sitio. */
const SLUG_ODOO: Record<string, string> = {
  'package-i': 'classic',
  'package-ii': 'signature',
  'package-iii': 'grand',
  premium: 'premium',
}

export function slugOdooDePaquete(id: string | null): string | null {
  return id ? SLUG_ODOO[id] ?? null : null
}

function subVariantesDe(slug: SlugEventoReservable) {
  return (EVENTOS[slug]?.paquetes?.items ?? []).map((p) => ({
    id: SLUG_ODOO[p.id] ?? p.id,
    nombre: p.nombreCorto || p.nombre,
    descripcion: p.meta ?? '',
    capacidad: p.capacidad ?? '',
    // Premium son 4 h; el resto, 3. Sale del propio dato de la landing en vez
    // de escribirlo otra vez: `duracionHoras` es lo que decide qué carta se
    // come en el charter, y aquí lo que decide el rótulo de duración.
    duracionHoras: p.meta?.startsWith('4') ? 4 : 3,
    tabla: [],
  }))
}

function fichaDe(slug: SlugEventoReservable): FichaTour {
  const evento = EVENTOS[slug]
  return {
    tituloLargo: evento.nombre,
    audiencia: evento.paquetes?.titulo ?? evento.nombre,
    duracion: '3-4 h',
    // Sin horarios fijos: la hora de un evento privado se acuerda con el
    // equipo. El funnel esconde el selector cuando no hay dos salidas, así que
    // la lista vacía es la respuesta correcta y no un hueco por rellenar.
    horarios: [],
    upgradePremium: null,
    menuLight: [],
    menuPremium: [],
    // El menú de un evento ES el paquete: ya se eligió antes de entrar al
    // funnel y se enseña entero en la landing. Sin `menuBuffet` ni cartas, el
    // funnel se salta el paso de platos, que es lo que corresponde.
    galeriaCompleta: evento.galeria ?? [],
    videoGaleria: null,
    quoteDestacada: null,
    itinerario: [],
    incluye: [],
    noIncluido: [],
    queLlevar: [],
    faqTour: [],
    tambienTeGusta: [],
    subVariantes: subVariantesDe(slug),
  } as unknown as FichaTour
}

function tarjetaDe(slug: SlugEventoReservable): Tour {
  const evento = EVENTOS[slug]
  return {
    slug,
    nombre: evento.nombre,
    audienciaChip: 'Private event',
    duracionCorta: '3-4 h',
    rating: 5,
    resenas: 0,
    maxPax: 85,
    precioLight: precioDesde(slug),
    precioNino: null,
    booking: 'completo',
    descripcionCorta: evento.paquetes?.intro ?? '',
    foto: evento.foto,
    galeria: evento.galeria ?? [],
  } as unknown as Tour
}

export const TOURS_EVENTO: Tour[] = traducible(
  SLUGS_EVENTO_RESERVABLE.map((slug) => tarjetaDe(slug)),
)

export const FICHAS_EVENTO: Record<string, FichaTour> = Object.fromEntries(
  SLUGS_EVENTO_RESERVABLE.map((slug) => [slug, fichaDe(slug)]),
)

export function esEventoReservable(slug: string | undefined): boolean {
  return !!slug && (SLUGS_EVENTO_RESERVABLE as readonly string[]).includes(slug)
}
