import { useEffect, useState } from 'react'
import { Etiqueta } from '@/components/ui/etiqueta'
import { QUOTES, FUNDADOR, type Review } from '@/data/home'
import { useDevFlag } from '@/dev/use-dev-flag'

// «Reseñas verificadas» — rediseño v6 (Pedro, 2026-07-15). Estructura:
//
//   [Eyebrow centrado]
//   [h2 centrado: «4.9 de 5 en 1.782 reseñas»]
//   ┌──────────────────┬──────────────────────────────────┐
//   │                  │                                  │
//   │  <video>         │  [Carrusel step-based, 2 cards] │
//   │  + gradient      │  r0/r1 → r1/r2 → r2/r3 → ...    │
//   │  + texto blanco  │                                  │
//   │  abajo-izq       │  (avanza, espera 4s, avanza...)  │
//   │                  │                                  │
//   └──────────────────┴──────────────────────────────────┘
//              [Ver más → TripAdvisor · Facebook]
//
// El video llena toda la altura de su columna (mismo alto que el
// carrusel). El carrusel es step-based, NO un ticker continuo: avanza
// una posición, espera 4s, avanza otra. Loop invisible con pista
// duplicada + truco de "saltar sin transición" al wrap (CSS transitions
// + estado React).
//
// ⚠️ El video es placeholder (hero.mp4 = catamaran navegando, asset real
// de la marca). La referencia visual pide un video del cofundador hablando
// a cámara en primer plano — cuando llegue, se cambia solo el `src`.
//
// El link "ver más" NO apunta a Viator (NOTAS['home-reviews'] del
// prototipo) pero sí a TripAdvisor y Facebook (los 2 canales con
// presencia propia verificable del cliente, según la auditoría del sitio).

function StarRating({ count = 5 }: { count: number }) {
  return (
    <p className="text-estrella text-lg lg:text-xl" aria-label={`${count} de 5 estrellas`}>
      {'★'.repeat(count)}
    </p>
  )
}

function Iniciales({ nombre }: { nombre: string }) {
  // No tenemos fotos de clientes (privacidad) — iniciales en círculo
  // aqua-tint como placeholder honesto, no inventado.
  const iniciales = nombre
    .split(/\s+/)
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
  return (
    <div
      aria-hidden="true"
      className="grid size-12 shrink-0 place-items-center rounded-full bg-aqua-tint text-base font-semibold text-aqua-dark"
    >
      {iniciales}
    </div>
  )
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex h-full flex-col justify-between rounded-card bg-papel-hueso p-6 lg:p-7">
      {/* Texto del testimonio — full width arriba */}
      <p className="text-base text-navy lg:text-lg">
        &ldquo;{review.texto}&rdquo;
      </p>

      {/* Bottom: 3 sub-columnas (foto | nombre+social | estrellas a la derecha) */}
      <div className="mt-6 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4">
        <Iniciales nombre={review.autor} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-navy lg:text-base">{review.autor}</p>
          <p className="truncate text-xs text-navy-soft lg:text-sm">
            {review.plataforma} · {review.fecha}
          </p>
        </div>
        <StarRating count={5} />
      </div>
    </div>
  )
}

export function Reviews() {
  const N = QUOTES.length
  const [index, setIndex] = useState(0)
  const [noTransition, setNoTransition] = useState(false)
  const [pausado, setPausado] = useState(false)

  // [dev-mode] ?dev-reviews=pausado congela el carrusel → frame limpio
  // para Figma. Misma mecánica que ?dev-ticker=pausado.
  useDevFlag('dev-reviews', (v) => setPausado(v === 'pausado')) // [dev-mode]

  // Auto-advance step-by-step. Lee intervalo y transición de tokens.css
  // (FUENTE del prototipo de Figma — playbook animaciones-a-figma).
  useEffect(() => {
    if (pausado) return
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ms = leerMs('--reviews-step-intervalo', 5000)
    const id = window.setInterval(() => {
      setIndex((i) => i + 1)
    }, ms)
    return () => window.clearInterval(id)
  }, [pausado, N])

  // Wrap invisible: cuando index llega a N (entró en la copia duplicada,
  // visualmente igual a 0), esperamos a que termine la transition CSS y
  // saltamos a 0 SIN transition. El usuario nunca ve el "salto" porque
  // la posición visual es la misma (la copia es idéntica a la primera).
  // Trampa: el re-enable de la transition tiene que esperar 2 frames
  // para que React aplique el cambio antes de que la transition tome el
  // control otra vez (un solo rAF no basta en React 19 strict mode).
  useEffect(() => {
    if (index !== N) return
    const transMs = leerMs('--reviews-step-transicion', 700)
    const id = window.setTimeout(() => {
      setNoTransition(true)
      setIndex(0)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setNoTransition(false)
        })
      })
    }, transMs + 50)
    return () => window.clearTimeout(id)
  }, [index, N])

  // Pista duplicada: la segunda mitad es idéntica a la primera, así
  // translateY(-N * cardHeight) (el wrap) muestra el mismo par de cards
  // que translateY(0) — sin él, el "salto" del wrap sería visible.
  const pista = [...QUOTES, ...QUOTES]
  const visibleIndex = ((index % N) + N) % N

  return (
    <section className="px-5 py-seccion-sm sm:px-10 sm:py-seccion">
      <div className="mx-auto max-w-contenido">
        {/* Header centrado: eyebrow + h2 */}
        <div className="text-center">
          <Etiqueta>Reseñas verificadas</Etiqueta>
          <h2 className="mt-3 font-display text-h2 font-semibold text-navy sm:text-h2">
            4.9 de 5 en 1.782 reseñas
          </h2>
        </div>

        {/* 2 columnas, mismo alto (items-stretch). El video llena su
            columna al alto del carrusel de la derecha. */}
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-stretch">
          {/* IZQUIERDA — video con gradient + texto blanco abajo-izquierda */}
          <div className="relative overflow-hidden rounded-card bg-navy shadow-card">
            <video
              className="absolute inset-0 size-full object-cover"
              src={FUNDADOR.videoSrc}
              poster={FUNDADOR.videoPoster}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Video del equipo de Hispaniola Aquatic Adventures"
            />
            {/* Gradient para legibilidad: denso abajo (donde va el texto),
               se desvanece hacia arriba. Solo tokens — sin valores sueltos. */}
            <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/40 to-transparent" />
            {/* Texto en la parte inferior, alineado a la izquierda */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white lg:p-8">
              <p className="text-base italic lg:text-lg">
                &ldquo;{FUNDADOR.frase}&rdquo;
              </p>
              <p className="mt-3 text-sm lg:text-base">
                <span className="font-semibold">{FUNDADOR.nombre}</span>
                <span className="opacity-80"> · {FUNDADOR.cargo}</span>
              </p>
            </div>
          </div>

          {/* DERECHA — carrusel step-based */}
          <div
            className="flex flex-col"
            onPointerEnter={() => setPausado(true)}
            onPointerLeave={() => setPausado(false)}
          >
            <div className="reviews-step-container flex-1 overflow-hidden">
              <div
                className={`reviews-step-track ${noTransition ? '' : 'reviews-step-track--animated'}`}
                style={{ transform: `translateY(calc(-${index} * (var(--reviews-card-alto) + var(--reviews-step-gap))))` }}
              >
                {pista.map((q, i) => (
                  <div key={i} className="reviews-step-slot">
                    <ReviewCard review={q} />
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination dots — sutil, dan control y orientación sin
                romper la estética limpia. La dot activa es coral, las
                otras son line-fuerte. */}
            <div className="mt-6 flex justify-center gap-2" role="tablist" aria-label="Navegar reseñas">
              {QUOTES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={visibleIndex === i}
                  aria-label={`Ir a la reseña ${i + 1} de ${N}`}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    visibleIndex === i ? 'w-6 bg-coral' : 'w-1.5 bg-linea-fuerte hover:bg-navy-soft'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Ver más — fuera del grid, debajo de las 2 columnas */}
        <p className="mt-8 text-center text-sm text-navy-soft">
          Ver más reseñas →{' '}
          <a
            href="https://www.tripadvisor.com"
            target="_blank"
            rel="noopener"
            className="font-semibold text-aqua-dark hover:underline"
          >
            TripAdvisor
          </a>
          {' · '}
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener"
            className="font-semibold text-aqua-dark hover:underline"
          >
            Facebook
          </a>
        </p>
      </div>
    </section>
  )
}

// Lee un token de tiempo del :root (--x: 4s | 400ms) y lo devuelve en ms.
// Mismo helper que ui/carrusel-imagenes.tsx.
function leerMs(nombre: string, fallback: number): number {
  if (typeof window === 'undefined') return fallback
  const bruto = getComputedStyle(document.documentElement).getPropertyValue(nombre).trim()
  const n = parseFloat(bruto)
  if (Number.isNaN(n)) return fallback
  return bruto.endsWith('ms') ? n : n * 1000
}
