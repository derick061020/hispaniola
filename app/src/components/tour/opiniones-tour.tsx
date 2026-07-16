import { Etiqueta } from '@/components/ui/etiqueta'
import { Estrellas } from '@/components/ui/estrellas'
import type { Tour } from '@/data/home'
import type { FichaTour } from '@/data/tours'

// Opiniones (wireframe A5 · fix 1.2 de analisis/revision-wireframes.md).
//
// ⚠️ EL LINK DE SALIDA ES SOLO TRIPADVISOR — jamás Viator. Viator vende el
// MISMO tour, al mismo precio, con Reserve-Now-Pay-Later y cupones del 10%:
// mandarle tráfico desde aquí es regalarle la venta al canal que este rediseño
// existe para desintermediar, y encima en el momento exacto de la decisión.
// Citar a Viator como FUENTE de una reseña en texto está bien (atribuir no
// manda tráfico); un botón «ver en Viator», nunca.
//
// ⚠️ Sin barras de distribución (92% 5★, 6% 4★…): ese dato no existe en
// ninguna fuente del proyecto. El wireframe las dibujó como placeholder;
// pintarlas aquí sería inventar estadística. Decisión abierta §13.5 — cuando
// el cliente dé el dato real (o el motor lo exponga), tienen su sitio hecho.
//
// TODO(cliente): la URL es el TripAdvisor genérico. La del perfil real ya está
// pedida (PLAN-v3.md §9, junto a los assets de premios en alta) — es la otra
// mitad de la crítica de la auditoría: «premios sin enlaces verificables».
const TRIPADVISOR_URL = 'https://www.tripadvisor.com'

export function OpinionesTour({ tour, ficha }: { tour: Tour; ficha: FichaTour }) {
  return (
    <section id="ancla-opiniones" className="scroll-mt-sticky-top">
      <Etiqueta>Opiniones</Etiqueta>

      <div className="mt-5 grid gap-6 lg:grid-cols-3">
        <div>
          <p className="font-display text-h2 font-semibold text-navy">
            {tour.rating}
            <span className="text-lead font-normal text-navy-soft"> / 5</span>
          </p>
          <Estrellas calificacion={tour.rating} className="mt-2" />
          <p className="mt-3 text-sm text-navy-soft">{tour.resenas.toLocaleString('en-US')} reseñas verificadas</p>
          <a
            href={TRIPADVISOR_URL}
            target="_blank"
            rel="noopener"
            className="mt-1 inline-block text-sm font-semibold text-aqua-dark hover:underline"
          >
            Ver en TripAdvisor →
          </a>
        </div>

        <figure className="rounded-card bg-papel-hueso p-5 lg:col-span-2">
          <blockquote className="text-lead text-navy">«{ficha.quoteDestacada} Volveríamos sin dudarlo.»</blockquote>
          <figcaption className="mt-3 flex items-center gap-2 text-xs text-navy-soft">
            <Estrellas calificacion={5} />
            Cliente verificado · jun 2026
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
