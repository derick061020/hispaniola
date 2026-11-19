import { Sparkles, Wine } from 'lucide-react'
import { TituloSeccion } from '@/components/tour/titulo-seccion'
import { BLOQUE_FICHA } from '@/components/tour/bloque-ficha'
import type { FichaEvento } from '@/data/eventos'
import { idiomaUI, t } from '@/lib/i18n'

// «02 Choose your bar» — la segunda mitad de la decisión.
//
// [2026-10-08, Derick, con el tarifario del cliente delante: «esta información
// debe de agregarse en la sección EVENTS»]
//
// Hasta hoy la web publicaba la comida con su precio y de beber solo decía
// «national open bar», suelto en la lista de «qué incluye». Pero se venden DOS
// cosas, y la barra se cobra POR PERSONA: en un party boat de 30, subir a
// Signature son 900 dólares. Enterarse de eso en la cotización y no en la
// página es la clase de sorpresa que tumba la venta.
//
// POR QUÉ NO SON LAS CARDS DE LOS PAQUETES. Allí las 4 enseñan los MISMOS 8
// platos con ✓ y — porque se comparan plato a plato. Aquí no hay nada que
// tabular: son marcas y cócteles, y una lista de doce bullets por card se lee
// peor que la frase. Lo que sí se copia es lo que allí funcionó: el precio con
// su unidad PEGADA («+US$ 15 · por persona»), que es lo que impide leer el
// número como el precio de la barra entera.
export function BarrasEvento({ evento }: { evento: FichaEvento }) {
  const barras = evento.barras
  if (!barras || barras.items.length === 0) return null

  return (
    <section id="ancla-barras" className={`${BLOQUE_FICHA} scroll-mt-sticky-top`}>
      <TituloSeccion>{barras.titulo}</TituloSeccion>
      <p className="mt-2 text-sm text-navy-sub">{barras.intro}</p>

      {/* [2026-11-19, Sr. Fernando, Gerencia] Cada barra con SU foto (botellas y
          vasos de lo que se sirve) y el detalle exacto, con la estructura de la
          web de Party Boat que puso de modelo: botellas, lo demás de la barra y
          los cócteles. La frase de antes (`texto`) se queda para /food-and-bar. */}
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {barras.items.map((barra) => (
          <article
            key={barra.id}
            className={[
              'flex h-full flex-col overflow-hidden rounded-card transition',
              barra.destacado
                ? 'bg-aqua-tint/40 ring-1 ring-aqua'
                : 'ring-1 ring-linea',
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

              <h3 className="font-display text-base font-semibold text-navy">
                {t(barra.nombre)}
              </h3>

              {/* El precio y su unidad, juntos. Separarlos es lo que hacía leer
                  «15» como el precio de la barra para todo el grupo. */}
              <p className="mt-2 font-display text-h3 font-semibold text-coral">
                {/* La ficha del evento llega ya traducida (`traducible`), y
                    «Included» se traduce como «Qué incluye» (el título de otra
                    sección). La barra incluida es la que no lleva «+US$». */}
                {barra.precio.startsWith('+') ? barra.precio : idiomaUI() === 'en' ? 'Included' : t('Included in the price')}
              </p>
              <p className="text-xs uppercase tracking-wide text-navy-sub">
                {t(barra.precioNota)}
              </p>

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
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
