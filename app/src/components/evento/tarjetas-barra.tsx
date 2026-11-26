import { Sparkles, Wine } from 'lucide-react'
import type { BarraEvento } from '@/data/eventos'
import { idiomaUI, t } from '@/lib/i18n'

// El texto del precio de una barra. [2026-11-26] Sale a función para que la
// variante de Fiesta on Deck (fiesta-on-deck/tarjetas-barra-fod.tsx) diga
// exactamente lo mismo; el porqué de «Included» está junto al precio, abajo.
export function textoPrecioBarra(barra: BarraEvento): string {
  return barra.precio.startsWith('+') ? barra.precio : idiomaUI() === 'en' ? 'Included' : t('Included in the price')
}

// Las tres tarjetas de barra (Caribbean · Caribbean Plus · Signature).
//
// [2026-11-25, Sr. Fernando en Gerencia: «se nos olvidó el open bar, mismo
// formato de hispaniola · 3 paquetes con costo extra los dos siguientes»]
// Salen de barras-evento.tsx para que las landings de Fiesta on Deck pinten
// EXACTAMENTE la misma pieza que las de evento, sin duplicar el markup. El
// porqué del diseño (precio con su unidad pegada; foto + botellas + lo demás +
// cócteles) está en barras-evento.tsx.
//
// `elegida` / `onElegir` (opcionales): en Fiesta on Deck la barra es una
// elección más de la calculadora, y cada tarjeta lleva su «Choose this bar»
// —como «Choose Snacks» en los paquetes—. Sin ellos no se pinta el botón.
export function TarjetasBarra({
  items,
  elegida,
  onElegir,
}: {
  items: BarraEvento[]
  elegida?: string
  onElegir?: (id: string) => void
}) {
  return (
    // [2026-11-19, Sr. Fernando, Gerencia] Cada barra con SU foto (botellas y
    // vasos de lo que se sirve) y el detalle exacto, con la estructura de la
    // web de Party Boat que puso de modelo: botellas, lo demás de la barra y
    // los cócteles. La frase de antes (`texto`) se queda para /food-and-bar.
    <div className="mt-5 grid gap-4 sm:grid-cols-3">
      {items.map((barra) => (
        <article
          key={barra.id}
          className={[
            'flex h-full flex-col overflow-hidden rounded-card transition',
            barra.destacado ? 'bg-aqua-tint/40 ring-1 ring-aqua' : 'ring-1 ring-linea',
          ].join(' ')}
        >
          <div className="aspect-[3/2] overflow-hidden bg-papel-hueso">
            <img
              src={`/fotos/${barra.foto}.webp`}
              alt={t(barra.fotoAlt)}
              loading="lazy"
              decoding="async"
              className="size-full object-cover"
            />
          </div>

          <div className="flex flex-1 flex-col p-5">
            {barra.destacado ? (
              <span className="mb-2 inline-flex w-fit items-center gap-1 rounded-chip bg-aqua-tint px-2 py-0.5 text-xs font-semibold text-aqua-dark">
                <Sparkles className="size-3" aria-hidden="true" />
                {t('Top shelf')}
              </span>
            ) : (
              <Wine className="mb-2 size-5 text-aqua-dark" aria-hidden="true" />
            )}

            <h3 className="font-display text-base font-semibold text-navy">{t(barra.nombre)}</h3>

            {/* El precio y su unidad, juntos. Separarlos es lo que hacía leer
                «15» como el precio de la barra para todo el grupo. */}
            <p className="mt-2 font-display text-h3 font-semibold text-coral">
              {/* La ficha del evento llega ya traducida (`traducible`), y
                  «Included» se traduce como «Qué incluye» (el título de otra
                  sección). La barra incluida es la que no lleva «+US$». */}
              {textoPrecioBarra(barra)}
            </p>
            <p className="text-xs uppercase tracking-wide text-navy-sub">{t(barra.precioNota)}</p>

            {barra.bienvenida ? (
              <div className="mt-4 rounded-card bg-papel px-3 py-2 ring-1 ring-aqua">
                <p className="text-eyebrow font-semibold uppercase tracking-[0.14em] text-navy-soft">
                  {t('Welcome drink')}
                </p>
                <p className="text-sm font-semibold text-aqua-dark">{t(barra.bienvenida)}</p>
              </div>
            ) : null}

            <p className="mt-4 text-eyebrow font-semibold uppercase tracking-[0.14em] text-navy-soft">
              {t('The bottles')}
            </p>
            <ul className="mt-1.5 space-y-1 text-sm font-semibold text-navy">
              {barra.botellas.map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-coral" aria-hidden="true" />
                  {t(b)}
                </li>
              ))}
            </ul>

            <p className="mt-4 text-eyebrow font-semibold uppercase tracking-[0.14em] text-navy-soft">
              {t('Also on the bar')}
            </p>
            <p className="mt-1.5 text-sm text-navy-sub">{barra.tambien.map((x) => t(x)).join(' · ')}</p>

            <p className="mt-4 text-eyebrow font-semibold uppercase tracking-[0.14em] text-navy-soft">
              {t('Cocktails')} · {barra.cocteles.length}
            </p>
            <ul className="mt-1.5 flex flex-wrap gap-1.5">
              {barra.cocteles.map((c) => (
                <li key={c} className="rounded-chip bg-papel px-2.5 py-1 text-xs font-semibold text-navy ring-1 ring-linea">
                  {t(c)}
                </li>
              ))}
            </ul>

            {onElegir ? (
              // mt-auto + pt: el botón cae al pie en las tres, aunque Signature
              // tenga más líneas que las otras dos.
              <div className="mt-auto pt-5">
                <button
                  type="button"
                  onClick={() => onElegir(barra.id)}
                  aria-pressed={elegida === barra.id}
                  className={`w-full rounded-chip px-4 py-2.5 text-sm font-semibold transition-colors ${
                    elegida === barra.id ? 'bg-navy text-papel' : 'text-navy ring-1 ring-navy hover:bg-papel-hueso'
                  }`}
                >
                  {elegida === barra.id ? t('✓ Selected') : t('Choose this bar')}
                </button>
              </div>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  )
}
