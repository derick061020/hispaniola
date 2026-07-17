import { Etiqueta } from '@/components/ui/etiqueta'
import { SOSTENIBILIDAD } from '@/data/sostenibilidad'

// Rediseño 2026-07-17 (pedido de Samuel: "se ve muy feo ese montón de
// cajas... mejoralo que se vea más editorial"). Antes: 3 cards idénticas de
// texto sobre --color-papel-hueso — el «montón de cajas». Ahora: una
// declaración de misión GRANDE (el copy completo que se recortó del hero,
// ver data/sostenibilidad.ts §sub/mision) seguida de los 3 pilares como
// lista editorial — numeral fantasma (.sost-numero, misma mecánica que
// .incluye-numero pero en versión clara) + hairline (border-t), sin fondo ni
// caja. El pilar "operación" suma sus 2 cifras ($3.50/$2.00) como highlight
// tipográfico aparte del párrafo, en vez de enterradas en el texto corrido.
// Cada bloque (.sost-reveal) entra por su cuenta al hacer scroll —
// use-sostenibilidad-reveal.ts, enganchado una sola vez desde la página.
export function PilaresSostenibilidad() {
  return (
    <section>
      <Etiqueta className="sost-reveal">{SOSTENIBILIDAD.misionEyebrow}</Etiqueta>
      <p className="sost-reveal mt-4 max-w-3xl text-balance font-display text-narrativa-movil font-medium text-navy sm:text-narrativa">
        {SOSTENIBILIDAD.mision}
      </p>

      <p className="sost-reveal mt-16 text-eyebrow font-semibold uppercase tracking-[0.12em] text-navy-soft sm:mt-20">
        {SOSTENIBILIDAD.pilaresTitulo}
      </p>

      <div className="mt-6 divide-y divide-linea border-t border-linea">
        {SOSTENIBILIDAD.pilares.map((p, i) => (
          <article
            key={p.id}
            id={p.id}
            className="sost-reveal scroll-mt-header-alto flex flex-col gap-4 py-10 sm:flex-row sm:gap-10 lg:gap-16"
          >
            <div className="sm:w-64 sm:shrink-0 lg:w-80">
              <p className="sost-numero" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="sost-item-titulo font-display text-h3 font-semibold text-navy">{p.titulo}</h3>
            </div>

            <div className="sm:max-w-xl sm:pt-1">
              <p className="text-lead text-navy-sub">{p.texto}</p>

              {p.stats ? (
                <div className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
                  {p.stats.map((stat) => (
                    <div key={stat.label}>
                      <p className="font-display text-h2 font-semibold text-aqua-dark">{stat.valor}</p>
                      <p className="mt-1 max-w-[16rem] text-sm text-navy-soft">{stat.label}</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
