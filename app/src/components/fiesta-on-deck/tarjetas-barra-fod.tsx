import { Sparkles, Wine } from 'lucide-react'
import type { BarraEvento } from '@/data/eventos'
import type { MarcaFod } from '@/data/fiesta-on-deck'
import { textoPrecioBarra } from '@/components/evento/tarjetas-barra'
import { t } from '@/lib/i18n'

// Las tres tarjetas del open bar con la línea visual de CADA landing.
//
// [2026-11-26, Sr. Fernando en Gerencia: «los menús en Afro y Latin los
// necesitamos con cada estilo de la página, así como esto» + dos maquetas]
// Hasta hoy las landings pintaban `TarjetasBarra` (la pieza de Hispaniola, en
// blanco) dentro de un panel de papel: se leía como un trozo de otra web. Esta
// es la variante de Fiesta on Deck; `TarjetasBarra` NO cambia, sigue igual en
// los eventos y en /food-and-bar.
//   - AFRO: tarjeta amarilla, letra negra; el precio y los rótulos en bloque
//     negro inclinado con letra amarilla; cócteles en chip negro.
//   - LATIN: tarjeta azul con filete mango; el NOMBRE y los rótulos en bloque
//     rojo bandera; el precio en mango; chips con borde mango.
// Los colores salen de las variables --barra-* que define fiesta-on-deck.css
// por marca; aquí solo se decide QUÉ va en bloque, que cambia de una a otra.
//
// El contenido (fotos, botellas, «también en la barra», cócteles y trago de
// bienvenida por temático) es el mismo de siempre: llega de `barrasFod(marca)`.
// ⚠️ Las maquetas dicen «POR PERSONAL»: errata; se mantiene «por persona».
export function TarjetasBarraFod({
  marca,
  items,
  elegida,
  onElegir,
}: {
  marca: MarcaFod
  items: BarraEvento[]
  elegida?: string
  onElegir?: (id: string) => void
}) {
  const latin = marca === 'latin'
  // Rótulo de sección dentro de la tarjeta. En Afro «También en la barra» va
  // sin bloque (así está en la maqueta: tres bloques seguidos se comían el
  // contenido); en Latin van los tres en rojo.
  const rotulo = 'fod-barra__bloque mt-5 self-start font-fod text-sm font-extrabold uppercase tracking-wide'
  const rotuloSuave = latin ? rotulo : 'mt-4 font-fod text-sm font-extrabold uppercase tracking-wide'

  return (
    <div className="mt-12 grid gap-6 md:grid-cols-3">
      {items.map((barra) => {
        const esElegida = elegida === barra.id
        return (
          <article key={barra.id} className="fod-barra flex h-full flex-col overflow-hidden rounded-card">
            <div className="aspect-[3/2] overflow-hidden">
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
                <span className="fod-barra__sello mb-3 inline-flex w-fit items-center gap-1 rounded-chip px-2.5 py-0.5 text-xs font-bold">
                  <Sparkles className="size-3" aria-hidden="true" />
                  {t('Top shelf')}
                </span>
              ) : (
                <Wine className="fod-barra__icono mb-3 size-5" aria-hidden="true" />
              )}

              {latin ? (
                <h3 className="fod-barra__bloque fod-display self-start text-3xl">{t(barra.nombre)}</h3>
              ) : (
                <h3 className="font-fod text-xl font-extrabold">{t(barra.nombre)}</h3>
              )}

              {/* El precio y su unidad, juntos (el porqué en tarjetas-barra.tsx). */}
              <p
                className={`fod-display mt-3 text-4xl ${
                  latin ? 'fod-barra__precio' : 'fod-barra__bloque self-start'
                }`}
              >
                {textoPrecioBarra(barra)}
              </p>
              <p className="mt-1.5 text-xs font-bold uppercase tracking-wide">{t(barra.precioNota)}</p>

              {barra.bienvenida ? (
                <div className="fod-barra__caja mt-4 rounded-card px-3 py-2">
                  <p className="fod-barra__titulo-caja font-fod text-xs font-extrabold uppercase tracking-wider">
                    {t('Welcome drink')}
                  </p>
                  <p className="text-sm font-semibold">{t(barra.bienvenida)}</p>
                </div>
              ) : null}

              <p className={rotulo}>{t('The bottles')}</p>
              <ul className="mt-2 space-y-1 text-sm font-semibold">
                {barra.botellas.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <span className="fod-barra__vineta mt-1.5 size-2 shrink-0 rounded-full" aria-hidden="true" />
                    {t(b)}
                  </li>
                ))}
              </ul>

              <p className={rotuloSuave + (latin ? '' : ' self-start')}>{t('Also on the bar')}</p>
              <p className="fod-barra__suave mt-1.5 text-sm">{barra.tambien.map((x) => t(x)).join(' · ')}</p>

              <p className={rotulo}>
                {t('Cocktails')} · {barra.cocteles.length}
              </p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {barra.cocteles.map((c) => (
                  <li key={c} className="fod-barra__chip rounded-chip px-3 py-1 text-xs font-semibold">
                    {t(c)}
                  </li>
                ))}
              </ul>

              {onElegir ? (
                // mt-auto: el botón cae al pie en las tres, aunque Signature
                // tenga más líneas que las otras dos.
                <div className="mt-auto pt-6">
                  <button
                    type="button"
                    onClick={() => onElegir(barra.id)}
                    aria-pressed={esElegida}
                    className="fod-barra__boton w-full rounded-chip px-4 py-3 font-fod text-base font-extrabold"
                  >
                    {esElegida ? t('✓ Selected') : t('Choose this bar')}
                  </button>
                </div>
              ) : null}
            </div>
          </article>
        )
      })}
    </div>
  )
}
