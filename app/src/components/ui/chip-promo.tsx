import { Tag } from 'lucide-react'
import { usePromo } from '@/lib/api/use-promo'
import { fechaLarga } from '@/lib/fechas'
import { t } from '@/lib/i18n'

/** Cartel «PROMO 10%» de un tour (ver `usePromo`). `conFecha` añade hasta
 *  cuándo vale; en las tarjetas pequeñas del menú va solo el porcentaje. */
export function ChipPromo({
  slug,
  variante,
  conFecha = false,
  className = '',
}: {
  slug: string
  /** slug de Odoo de la variante (p. ej. 'premium'). */
  variante?: string | null
  conFecha?: boolean
  className?: string
}) {
  const promo = usePromo(slug)
  if (!promo) return null
  // [2026-11-24, Sr. Fernando] Una promo de solo unas variantes (el 5 % del
  // Premium de eventos) no se anuncia como si valiera para todo el producto:
  // sale solo en la tarjeta de esa variante.
  if (promo.variants?.length && !(variante && promo.variants.includes(variante))) return null
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-chip bg-[#e11d48] px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-white ${className}`}
    >
      <Tag className="size-3 shrink-0" aria-hidden="true" />
      {t('Promo')} {promo.pct}%
      {conFecha && promo.until ? (
        <span className="font-medium normal-case tracking-normal">
          {' '}· {t('until')} {fechaLarga(promo.until)}
        </span>
      ) : null}
    </span>
  )
}
