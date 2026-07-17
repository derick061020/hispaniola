import { Etiqueta } from '@/components/ui/etiqueta'
import { GUIAS } from '@/data/guias'

// Las tarjetas NO enlazan a nada: el prototipo solo tiene título + resumen +
// lectura por artículo, no el cuerpo del texto — inventar 5 artículos
// completos sería fabricar contenido (CLAUDE.md, "contenido jamás
// inventado"). Se listan honestamente como pendientes de redacción, mismo
// criterio que la galería vacía de Isla Saona o el hueco de fotos de eventos.
//
// REDISEÑO EDITORIAL (2026-07-17, pedido de Samuel: "parece una página con
// solo cajas... más editorial, más creativa e interesante"). Antes: 5 cards
// `ring-1 ring-linea` apiladas, alternando fondo por `destacado`. Ahora,
// mismo lenguaje que TipsRapidos (numeral fantasma + hairline, ver ese
// archivo): la entrada `destacado` (hoy la única con `lectura`) rompe el
// patrón y ocupa una fila ANCHA de una sola columna, con numeral y título
// más grandes — un "artículo destacado" real, no una card más gris; las
// otras 4 mantienen el split numeral/título + resumen en 2 columnas. Gana su
// propio `<Etiqueta>`+`<h2>` (antes vivían en guias.tsx) para ser
// autocontenido, igual que TipsRapidos. El reveal de scroll (`.guias-reveal`)
// vive en use-guias-reveal.ts, enganchado una sola vez desde la página junto
// con TipsRapidos.
export function ListaGuias() {
  return (
    <section>
      <Etiqueta className="guias-reveal">Próximamente</Etiqueta>
      <h2 className="guias-reveal mt-3 max-w-2xl text-balance font-display text-h3 font-semibold text-navy">
        Guías completas, en camino
      </h2>

      <div className="mt-10 divide-y divide-linea border-t border-linea">
        {GUIAS.map((g, i) => {
          const numero = String(i + 1).padStart(2, '0')

          if (g.destacado) {
            return (
              <article key={g.slug} className="guias-reveal py-10">
                <p className="guias-numero" aria-hidden="true">
                  {numero}
                </p>
                <h3 className="guias-item-titulo max-w-3xl text-balance font-display text-h2 font-semibold text-navy">
                  {g.titulo}
                </h3>
                <p className="mt-4 max-w-2xl text-lead text-navy-sub">{g.resumen}</p>
                {g.lectura ? (
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.1em] text-aqua-dark">{g.lectura}</p>
                ) : null}
              </article>
            )
          }

          return (
            <article
              key={g.slug}
              className="guias-reveal flex flex-col gap-4 py-10 sm:flex-row sm:gap-10 lg:gap-16"
            >
              <div className="sm:w-64 sm:shrink-0 lg:w-80">
                <p className="guias-numero" aria-hidden="true">
                  {numero}
                </p>
                <h3 className="guias-item-titulo font-display text-h3 font-semibold text-navy">{g.titulo}</h3>
              </div>

              <div className="sm:max-w-xl sm:pt-1">
                <p className="text-lead text-navy-sub">{g.resumen}</p>
              </div>
            </article>
          )
        })}
      </div>

      <p className="guias-reveal mt-10 text-center text-sm italic text-navy-soft">
        Artículos completos, próximamente — estamos escribiéndolos.
      </p>
    </section>
  )
}
