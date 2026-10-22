import { recortePlato } from '@/data/comida-y-bar'
import { TOURS, formatoDinero } from '@/data/home'
import { FICHAS } from '@/data/tours'
import { t } from '@/lib/i18n'

// EL MODELO DE LOS MENÚS DE /food-and-bar — cada menú UNA vez, con los tours
// en los que se sirve.
//
// [2026-10-17, Samuel: «"¿Qué menú lleva mi tour?" con Caribbean Escape →
// Light, Premium; Coral Quest → Light, Premium… se repite y no se entiende»]
// La 1ª versión partía del TOUR y repetía los menús. Aquí se parte del MENÚ:
// cinco menús, y cada uno lleva la lista de tours donde se sirve (con su
// matiz: «Upgrade», «3-hour menu»…). Las dos variantes de la sección (carta
// con filtro / selector de tour, ver menus-comida.tsx) leen ESTE mismo modelo.
//
// Todo lo que se come se LEE de las fichas (FICHAS). Sin precios de tour: el
// salto a Premium del Coral Quest (+US$ 15) está marcado en data/tours.ts como
// «un supuesto, no un dato». El único precio es el add-on de langosta de
// Saona, que ya publica su ficha.
//
// Lo que se deja fuera, a propósito: la descripción del Kid's Meal (se leyó de
// la foto y sigue pendiente de que Fernando la confirme). Sale solo el nombre.

export type SlugTour = 'caribbean-escape' | 'coral-quest' | 'private-charter' | 'saona-island'
export const SLUGS_TOUR: SlugTour[] = ['caribbean-escape', 'coral-quest', 'private-charter', 'saona-island']

export const nombreTour = (slug: string) => TOURS.find((x) => x.slug === slug)?.nombre ?? slug
export const duracionTour = (slug: string) => TOURS.find((x) => x.slug === slug)?.duracionCorta ?? ''

export type PlatoComida = { nombre: string; desc?: string; recorte?: string; ninos?: boolean }

export type VisualMenu =
  /** Los platos recortados son la imagen (Premium, Light, Taste of Hispaniola). */
  | { tipo: 'platos' }
  /** Un recorte suelto que representa el menú. */
  | { tipo: 'recorte'; src: string; alt: string }
  /** Una foto de ambiente, con un recorte encima opcional (la langosta de Saona). */
  | { tipo: 'foto'; src: string; alt: string; posicion?: string; acompana?: { src: string; alt: string } }

export type MenuComida = {
  id: 'menu-premium' | 'menu-light' | 'menu-taste' | 'menu-skewer-buffet' | 'menu-beach-buffet'
  titulo: string
  bajada?: string
  texto?: string
  tours: { slug: SlugTour; nota: string }[]
  platos: PlatoComida[]
  visual: VisualMenu
  extra?: string
  /** Recorte que acompaña al extra (la langosta de Saona). */
  extraImagen?: string
  /** La letra pequeña del extra, de la ficha (la veda de la langosta). */
  extraNota?: string
}

const ESCAPE = FICHAS['caribbean-escape']
const QUEST = FICHAS['coral-quest']
const CHARTER = FICHAS['private-charter']
const SAONA = FICHAS['saona-island']
const carta = (id: '4h' | '3h' | '21+') => CHARTER.menuCharter?.cartas.find((c) => c.id === id)

export function menusComida(): MenuComida[] {
  const cuatro = carta('4h')
  const tres = carta('3h')
  const buffet = carta('21+')
  const kids = QUEST.menuPremium.find((p) => p.soloNinos)

  return [
    {
      id: 'menu-premium',
      titulo: t('Premium Menu'),
      bajada: t('Choose one dish when you book.'),
      tours: [
        { slug: 'caribbean-escape', nota: t('Upgrade') },
        // [2026-10-17] Coral Quest SÍ tiene Light y Premium: Samuel, 2026-09-01,
        // «los precios son 114 premium y 99 en light» (data/home.ts). La 1ª ronda
        // de verificación lo quitó leyendo el comentario viejo de tours.ts; la 2ª
        // encontró la orden posterior, que es la que manda.
        { slug: 'coral-quest', nota: t('Upgrade') },
        { slug: 'private-charter', nota: cuatro?.pestana ?? '' },
      ],
      platos: [
        ...ESCAPE.menuPremium
          .filter((p) => !p.soloNinos)
          .map((p) => ({ nombre: p.nombre, desc: p.desc, recorte: p.foto ? recortePlato(p.foto) : undefined })),
        ...(kids
          ? [{ nombre: kids.nombre, recorte: kids.foto ? recortePlato(kids.foto) : undefined, ninos: true }]
          : []),
      ],
      visual: { tipo: 'platos' },
    },
    {
      id: 'menu-light',
      titulo: t('Light Menu'),
      tours: [
        { slug: 'caribbean-escape', nota: t('Included in price') },
        { slug: 'coral-quest', nota: t('Included in price') },
      ],
      platos: ESCAPE.menuLight.map((p) => ({
        nombre: p.nombre,
        desc: p.desc,
        recorte: p.foto ? recortePlato(p.foto) : undefined,
      })),
      visual: { tipo: 'platos' },
    },
    {
      id: 'menu-taste',
      titulo: tres?.titulo ?? '',
      texto: tres?.texto,
      tours: [{ slug: 'private-charter', nota: tres?.pestana ?? '' }],
      platos: (tres?.platos ?? []).map((p) => ({ nombre: p.nombre })),
      // La foto del paquete Tide de eventos, recortada: brochetas de pollo, res
      // y camarón a la parrilla con guarnición, que es justo esta carta.
      // ⚠️ Pendiente la foto propia de las brochetas del charter (Miguel).
      visual: {
        tipo: 'recorte',
        src: '/fotos/comida-bar/paquete-iii-recorte.webp',
        alt: t('Grilled chicken, beef and shrimp skewers with fries'),
      },
    },
    {
      id: 'menu-skewer-buffet',
      titulo: buffet?.titulo ?? '',
      texto: buffet?.texto,
      tours: [{ slug: 'private-charter', nota: buffet?.pestana ?? '' }],
      platos: [],
      visual: {
        tipo: 'foto',
        // [2026-10-17, verificación] La de antes enseñaba brochetas de FRUTA;
        // esta es servicio de buffet a bordo, sin platos que contradigan la carta.
        src: '/fotos/comida-bar/ev-corporate-menu-5-720.webp',
        alt: t('Guests at the buffet on board'),
      },
    },
    {
      id: 'menu-beach-buffet',
      titulo: t('Beach buffet'),
      tours: [{ slug: 'saona-island', nota: t('Served on the island') }],
      platos: (SAONA.menuBuffet?.platos ?? []).map((p) => ({ nombre: p.nombre, desc: p.desc })),
      // ⚠️ No hay foto del buffet en la isla. [2026-10-17, verificación] La
      // bandeja de langostas enteras sugería que la langosta va incluida, y es
      // el extra de pago: se cambia por una foto de servicio de buffet, y el
      // recorte de langosta acompaña al precio del add-on. Pendiente la foto real.
      visual: {
        tipo: 'foto',
        // [2026-10-17, verificación ronda 2] La foto REAL del buffet en la isla
        // (galería de Saona), escalada ×2 con Magnific Precision photo.
        src: '/fotos/comida-bar/galeria-isla-saona-5-x2.webp',
        alt: t('The buffet served on Saona Island'),
      },
      // [2026-10-17, verificación ronda 3] Sin el recorte de langosta: era de
      // stock y con pinzas (la caribeña no tiene). Solo el precio y su nota.
      extraNota: FICHAS['saona-island'].addOns?.find((a) => a.id === 'langosta')?.nota,
      extra: SAONA.menuBuffet?.addOn
        ? `${SAONA.menuBuffet.addOn.nombre}: +${formatoDinero(SAONA.menuBuffet.addOn.precio)} ${t('per person')}`
        : undefined,
    },
  ]
}
