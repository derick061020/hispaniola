import { Link } from 'react-router-dom'
import { Etiqueta } from '@/components/ui/etiqueta'
import { TIPS_GUIAS } from '@/data/guias'

// El contenido REAL de la página (el resto sigue siendo índice de artículos
// aún sin escribir, ver lista-guias.tsx) — portado de tips-for-punta-cana-
// ....php, la página que este /guias reemplaza. Estático y abierto, no en
// acordeón: es la pieza que da a la página su peso de guía real, no de FAQ
// de soporte (ese registro ya lo cubre /faq).
//
// REDISEÑO EDITORIAL (2026-07-17, pedido de Samuel: "parece una página con
// solo cajas... más editorial, más creativa e interesante"). Antes: 4 cards
// `bg-papel-hueso ring-1 ring-linea` apiladas. Ahora, mismo lenguaje que el
// rediseño de Sostenibilidad de este mismo día (PilaresSostenibilidad):
// numeral fantasma (.guias-numero) + pregunta montada encima en la columna
// izquierda, la respuesta (ya es prosa real y larga) en la columna derecha,
// separados por hairline (`divide-y`/`border-t`) en vez de fondo o caja. El
// reveal de scroll (`.guias-reveal`) vive en use-guias-reveal.ts, enganchado
// una sola vez desde la página (guias.tsx) junto con ListaGuias.
export function TipsRapidos() {
  return (
    <section>
      <Etiqueta className="guias-reveal">Antes de reservar</Etiqueta>
      <h2 className="guias-reveal mt-3 max-w-2xl text-balance font-display text-h3 font-semibold text-navy">
        Lo que preguntan más sobre esnórquel y navegación en Punta Cana
      </h2>

      <div className="mt-10 divide-y divide-linea border-t border-linea">
        {TIPS_GUIAS.map((t, i) => (
          <article
            key={t.pregunta}
            className="guias-reveal flex flex-col gap-4 py-10 sm:flex-row sm:gap-10 lg:gap-16"
          >
            <div className="sm:w-64 sm:shrink-0 lg:w-80">
              <p className="guias-numero" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="guias-item-titulo font-display text-h3 font-semibold text-navy">{t.pregunta}</h3>
            </div>

            <div className="sm:max-w-xl sm:pt-1">
              <p className="text-lead text-navy-sub">{t.respuesta}</p>
              {t.enlace ? (
                <Link
                  to={t.enlace.to}
                  className="mt-3 inline-block text-sm font-semibold text-aqua-dark hover:underline"
                >
                  {t.enlace.texto}
                </Link>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
