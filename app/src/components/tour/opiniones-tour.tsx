import { useState } from 'react'
import { TituloSeccion } from '@/components/tour/titulo-seccion'
import { Estrellas } from '@/components/ui/estrellas'
import { BLOQUE_FICHA } from '@/components/tour/bloque-ficha'
import { useDevFlag } from '@/dev/use-dev-flag'
import { QUOTES, type Review, type Tour } from '@/data/home'

// Opiniones (wireframe A5 · fix 1.2 de analisis/revision-wireframes.md).
//
// PLAN-INTERNAS-V2.md (§C3, pedido de Samuel): fuera el link de salida —
// «no quiero que lleven a TripAdvisor» — y el resumen (rating + reseñas
// verificadas) pasa a preceder un MARQUEE horizontal infinito de reseñas, en
// vez de una sola quote fija. El ⚠️ anti-Viator de siempre sigue vigente en
// otro sentido: CERO enlaces de salida en esta sección, ni a Viator ni ya a
// TripAdvisor — nada que distraiga de la decisión en el momento exacto en
// que se está tomando.
//
// El pool de reseñas es QUOTES (data/home.ts) — las mismas 5 reales que usa
// la home, no un texto redactado para la ficha: no hay reseñas por-tour en
// ninguna fuente del proyecto (prototipo/datos.js tampoco las tiene), y
// inventarlas sería peor que reusar las genéricas. Si el loop se siente
// corto, hacen falta más reseñas REALES (pedirlas, no inventarlas — ver
// PLAN-INTERNAS-V2.md §Decisiones abiertas). La quote destacada de ESTE tour
// (`ficha.quoteDestacada`) sigue haciendo su trabajo donde ya vivía — flotando
// sobre la 1ª foto del mosaico, ahora incrustado en el propio hero
// (internas/galeria-hero.tsx) — así que no se pierde, solo deja de
// repetirse aquí.
//
// Mecánica: pista duplicada 2x, igual que el ticker del hero — ver el
// bloque .opiniones-marquee-* en componentes.css para el porqué de cada
// pieza. Pausa al hover (CSS) y con prefers-reduced-motion no avanza sola
// (WCAG 2.2.2): una sola copia, scrollable a mano.
//
// ⚠️ Sin barras de distribución (92% 5★, 6% 4★…): ese dato no existe en
// ninguna fuente del proyecto. El wireframe las dibujó como placeholder;
// pintarlas aquí sería inventar estadística. Decisión abierta §13.5 — cuando
// el cliente dé el dato real (o el motor lo exponga), tienen su sitio hecho.

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex h-full flex-col justify-between gap-4 rounded-card bg-papel-hueso p-5">
      <p className="text-sm text-navy">«{review.texto}»</p>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-navy">{review.autor}</p>
          <p className="truncate text-xs text-navy-soft">
            {review.plataforma} · {review.fecha}
          </p>
        </div>
        <Estrellas calificacion={review.estrellas} />
      </div>
    </div>
  )
}

export function OpinionesTour({ tour }: { tour: Tour }) {
  const [pausado, setPausado] = useState(false)

  // [dev-mode] deep-link del Glosario Dev — ver src/dev/dev-registry.ts
  useDevFlag('dev-opiniones', (v) => {
    if (v === 'pausado') setPausado(true)
  })

  const estatico =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <section id="ancla-opiniones" className={`${BLOQUE_FICHA} scroll-mt-sticky-top`}>
      <TituloSeccion>Opiniones</TituloSeccion>

      <div className="mt-5 flex items-center gap-4">
        <p className="font-display text-h2 font-semibold text-navy">
          {tour.rating}
          <span className="text-lead font-normal text-navy-soft"> / 5</span>
        </p>
        <div>
          <Estrellas calificacion={tour.rating} />
          <p className="mt-1 text-sm text-navy-soft">{tour.resenas.toLocaleString('en-US')} reseñas verificadas</p>
        </div>
      </div>

      <div
        className={`opiniones-marquee-wrapper mt-6 ${estatico ? 'opiniones-marquee-wrapper--estatico' : ''}`}
        role="group"
        aria-roledescription="carrusel"
        aria-label="Reseñas de huéspedes"
      >
        <div className={`opiniones-marquee-pista ${pausado ? 'opiniones-marquee-pista--pausada' : ''}`}>
          {QUOTES.map((q) => (
            <div key={q.id} className="opiniones-marquee-card">
              <ReviewCard review={q} />
            </div>
          ))}
          {/* Segunda copia para el loop del -50%: oculta a lectores de
              pantalla (PLAN-v3.md §7.3, mismo trato que el ticker del hero),
              no hace falta si es estático (reduced-motion). */}
          {!estatico
            ? QUOTES.map((q) => (
                <div key={`dup-${q.id}`} className="opiniones-marquee-card" aria-hidden="true">
                  <ReviewCard review={q} />
                </div>
              ))
            : null}
        </div>
      </div>
    </section>
  )
}
