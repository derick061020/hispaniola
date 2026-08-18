/** [2026-08-18] LOS NÚMEROS DE LA FICHA SALEN DE ODOO.
 *
 *  El precio que se COBRA ya venía del servidor (`/quote`), pero la ficha
 *  seguía enseñando su tabla de tarifas, sus horarios, sus aforos y sus
 *  add-ons desde `data/tours.ts`. Coincidían —el catálogo de Odoo se sembró
 *  del mismo tarifario—, pero eran dos verdades: el día que alguien suba un
 *  precio en Odoo, la ficha seguiría anunciando el viejo y el cliente pagaría
 *  otro. Un cliente que ve US$ 1.100 y paga US$ 1.250 no vuelve.
 *
 *  Aquí se fusionan las dos fuentes con una regla clara:
 *
 *    Odoo manda en lo VENDIBLE  → precios, tramos, aforo, horarios, add-ons,
 *                                 upgrade de menú, máximo de personas.
 *    El front manda en lo CONTADO → fotos, descripciones, copy, cartas de
 *                                 menú, itinerario, FAQ. Nada de eso existe
 *                                 en Odoo y no tiene por qué.
 *
 *  SI ODOO NO CONTESTA SE PINTA LO ESTÁTICO. Es la misma decisión que en el
 *  calendario: con el backend caído, una ficha sin precios no vende nada,
 *  mientras que una que enseña la tarifa de ayer al menos deja llegar al
 *  checkout — y allí el precio SÍ lo pone el servidor, así que no se puede
 *  cobrar de menos.
 */
import type { Tour as TourOdoo, Variante, Tramo, Horario as HorarioOdoo, AddOn as AddOnOdoo } from './tipos'
import type { FichaTour, Horario, TramoPrecio, SubVarianteTour } from '@/data/tours'
import type { AddOn } from '@/lib/tarifas'
import type { Tour as TarjetaTour } from '@/data/home'

function aHorario(h: HorarioOdoo): Horario {
  return { hora: h.departure, regreso: h.back ?? '' }
}

function aTramo(t: Tramo): TramoPrecio {
  return {
    desde: t.from,
    hasta: t.to,
    precio: t.price,
    tipo: t.kind === 'group' ? 'grupo' : 'persona',
    ...(t.note ? { extra: t.note } : {}),
  }
}

function aAddOn(a: AddOnOdoo, estatico?: AddOn): AddOn {
  return {
    // El id es el contrato con el resto del front (la franja de la langosta
    // apunta a un add-on por id), y es el mismo slug en los dos lados.
    id: a.slug,
    etiqueta: a.label || estatico?.etiqueta || a.slug,
    descripcion: a.description ?? estatico?.descripcion ?? '',
    base: a.base === 'group' ? 'grupo' : 'persona',
    precio: a.price,
    porDefecto: a.default_on,
    // `nota` es copy del front (la langosta no hay de marzo a junio): se conserva.
    ...(estatico?.nota ? { nota: estatico.nota } : {}),
    // A qué barcos aplica lo decide Odoo si lo dice; si no, lo que ya sabía
    // el front (la langosta solo en los charters de 4 h, que son los que
    // llevan cocina flotante).
    ...(a.only_variants.length
      ? { soloSubVariantes: a.only_variants }
      : estatico?.soloSubVariantes
        ? { soloSubVariantes: estatico.soloSubVariantes }
        : {}),
  }
}

function aSubVariante(v: Variante, estatica?: SubVarianteTour): SubVarianteTour {
  return {
    id: v.slug,
    nombre: v.name || estatica?.nombre || v.slug,
    descripcion: v.description ?? estatica?.descripcion ?? '',
    capacidad: v.capacity_label ?? estatica?.capacidad ?? '',
    tabla: v.tiers.length ? v.tiers.map(aTramo) : (estatica?.tabla ?? []),
    // La foto NO está en Odoo: es del front y se conserva siempre.
    ...(estatica?.foto ? { foto: estatica.foto } : {}),
    ...(v.schedules.length
      ? { horarios: v.schedules.map(aHorario) }
      : estatica?.horarios
        ? { horarios: estatica.horarios }
        : {}),
    ...(v.duration_label ?? estatica?.duracion ? { duracion: v.duration_label ?? estatica?.duracion } : {}),
    ...(v.duration_hours ?? estatica?.duracionHoras
      ? { duracionHoras: v.duration_hours ?? estatica?.duracionHoras }
      : {}),
  }
}

/** La ficha del front con los números de Odoo encima. `odoo === null`
 *  (cargando, o el servidor no contesta) devuelve la ficha tal cual. */
export function fusionarFicha(ficha: FichaTour, odoo: TourOdoo | null): FichaTour {
  if (!odoo) return ficha

  const addOnsPorId = new Map((ficha.addOns ?? []).map((a) => [a.id, a]))
  const addOns = odoo.addons.length
    ? odoo.addons.map((a) => aAddOn(a, addOnsPorId.get(a.slug)))
    : ficha.addOns

  // El precio de la franja de menú (la langosta) es el del MISMO add-on: se
  // busca por el id que ya declara el dato, no adivinando por nombre.
  const precioDeAddOn = (id?: string) =>
    id ? (addOns ?? []).find((a) => a.id === id)?.precio : undefined

  const subEstaticasPorId = new Map((ficha.subVariantes ?? []).map((s) => [s.id, s]))
  const subVariantes = odoo.variants.length
    ? odoo.variants.map((v) => aSubVariante(v, subEstaticasPorId.get(v.slug)))
    : ficha.subVariantes

  const menuBuffet = ficha.menuBuffet?.addOn
    ? {
        ...ficha.menuBuffet,
        addOn: {
          ...ficha.menuBuffet.addOn,
          precio: precioDeAddOn(ficha.menuBuffet.addOn.addOnId) ?? ficha.menuBuffet.addOn.precio,
        },
      }
    : ficha.menuBuffet

  const menuCharter = ficha.menuCharter
    ? {
        ...ficha.menuCharter,
        cartas: ficha.menuCharter.cartas.map((c) =>
          c.addOn
            ? { ...c, addOn: { ...c.addOn, precio: precioDeAddOn(c.addOn.addOnId) ?? c.addOn.precio } }
            : c,
        ),
      }
    : ficha.menuCharter

  return {
    ...ficha,
    horarios: odoo.schedules.length ? odoo.schedules.map(aHorario) : ficha.horarios,
    upgradePremium: odoo.premium_upgrade ?? ficha.upgradePremium,
    ...(subVariantes ? { subVariantes } : {}),
    ...(addOns ? { addOns } : {}),
    ...(menuBuffet ? { menuBuffet } : {}),
    ...(menuCharter ? { menuCharter } : {}),
  }
}

/** La tarjeta del tour (nombre, «desde US$», aforo) con los precios de Odoo.
 *  Es lo que ancla el «from US$ 99» del home y de la cabecera de la ficha. */
export function fusionarTarjeta(tarjeta: TarjetaTour, odoo: TourOdoo | null): TarjetaTour {
  if (!odoo) return tarjeta
  return {
    ...tarjeta,
    precioLight: odoo.adult_price ?? precioMasBajo(odoo) ?? tarjeta.precioLight,
    ...(odoo.child_price !== null ? { precioNino: odoo.child_price } : {}),
    maxPax: odoo.max_pax ?? tarjeta.maxPax,
  }
}

/** El «desde» de los tours que no tienen precio por adulto sino tabla por
 *  barco (charter, Saona): el tramo más barato POR PERSONA que exista, y si
 *  todos son de grupo, el total de grupo más bajo. Es exactamente lo que el
 *  cliente puede llegar a pagar como mínimo. */
function precioMasBajo(odoo: TourOdoo): number | null {
  const tramos = [...(odoo.tiers ?? []), ...odoo.variants.flatMap((v) => v.tiers)]
  if (!tramos.length) return null
  const porPersona = tramos.filter((t) => t.kind === 'person').map((t) => t.price)
  if (porPersona.length) return Math.min(...porPersona)
  return Math.min(...tramos.map((t) => t.price))
}

/** La lista de tarjetas del sitio (home, menú y pie) contra el catálogo
 *  publicado en Odoo.
 *
 *  Hace dos cosas y ninguna más:
 *
 *  1. **Quita lo que Odoo ya no publica.** Despublicar un tour en el
 *     back-office lo saca de la web sin tocar código. Al revés no: un tour
 *     publicado en Odoo que no tenga tarjeta aquí NO aparece solo, porque la
 *     tarjeta necesita foto, copy y ficha, y eso no vive en Odoo. Sale
 *     avisado en `npm run qa:catalogo` para que nadie lo dé por publicado.
 *  2. **Pone el «desde US$» de verdad**, pero solo donde ya había precio: los
 *     productos que se cotizan (bodas, corporativo) enseñan su CTA sin cifra a
 *     propósito, y no se les inventa una.
 *
 *  Si Odoo no contesta (`catalogo === null`) devuelve la lista intacta. */
export function fusionarLista(tarjetas: TarjetaTour[], catalogo: TourOdoo[] | null): TarjetaTour[] {
  if (!catalogo) return tarjetas
  const porSlug = new Map(catalogo.map((t) => [t.slug, t]))
  return tarjetas
    .filter((t) => porSlug.has(t.slug))
    .map((t) => {
      const odoo = porSlug.get(t.slug)!
      const fusionada = fusionarTarjeta(t, odoo)
      // Los que se cotizan siguen sin precio: `precioLight: null` es una
      // decisión de producto, no un dato que falte.
      return t.precioLight === null ? { ...fusionada, precioLight: null } : fusionada
    })
}
