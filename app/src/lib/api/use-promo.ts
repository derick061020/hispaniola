import { useCatalogo } from '@/lib/api/use-catalogo'
import type { PromoWeb } from '@/lib/api/tipos'

/** [2026-10-30, Blanka: «Agregar PROMO 10%» en Caribbean Escape y Coral Quest]
 *  La promo vigente de un tour, tal cual la publica Odoo en el catálogo.
 *
 *  El cartel sale de la MISMA oferta que descuenta en `/quote`, así que no hay
 *  cifra propia aquí: si la promo caduca o se apaga en Odoo, el cartel se va
 *  solo. Sin catálogo (cargando o Odoo caído) no se pinta nada — anunciar un
 *  descuento que quizá ya no existe es peor que no anunciarlo. */
export function usePromo(slug: string): PromoWeb | null {
  const catalogo = useCatalogo()
  return catalogo?.find((t) => t.slug === slug)?.promo ?? null
}
