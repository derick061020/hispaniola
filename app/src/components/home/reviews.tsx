import { useEffect, useState } from 'react'
import { Etiqueta } from '@/components/ui/etiqueta'
import { QUOTES, FUNDADOR, type Review } from '@/data/home'
import { useDevFlag } from '@/dev/use-dev-flag'

// «Reseñas verificadas» — rediseño v6 (Pedro, 2026-07-15). Estructura:
//
//   [Eyebrow centrado]
//   [h2 centrado: «4.9 de 5 en 1.782 reseñas»]
//   ┌──────────────────┬──────────────────────────────────┐
//   │                  │  «                              │
//   │  <video>         │  [Carrusel step-based, 2 cards] │
//   │  + gradient      │  r0/r1 → r1/r2 → r2/r3 → ...    │
//   │  + texto blanco  │  (comilla decorativa de fondo)  │
//   │  abajo-izq       │  (avanza, espera 4s, avanza...)  │
//   │                  │                                  │
//   └──────────────────┴──────────────────────────────────┘
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
    // overflow-hidden en la card: recorta la comilla decorativa en el borde
    // superior de la card (en vez de depender del overflow:hidden del
    // contenedor del carrusel). La card pasa a ser una unidad visual
    // autocontenida — su contenido nunca sale de sus límites, pase lo que
    // pase con el carrusel o el layout padre. Mismo efecto visual que
    // `overflow: clip` pero con soporte universal.
    <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-card bg-papel-hueso p-6 lg:p-7">
      {/* Comilla decorativa de fondo — más grande aún (21rem → 28rem =
          448px) y con menos margin negativo arriba (-top-12 → -top-4 en
          móvil, lg:-top-16 → lg:-top-6 en desktop): la comilla ya no
          "asoma" tanto por encima del card, sino que vive más dentro
          del card, más integrada al contenido. Opacidad se mantiene
          (text-navy/5) — sigue siendo un watermark editorial sutil. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-8 -top-4 select-none font-serif text-[28rem] leading-none text-navy/5 lg:-top-6"
      >
        &ldquo;
      </span>
      {/* Texto del testimonio — full width arriba, relative para ir por
          encima de la comilla decorativa. */}
      <p className="relative text-base text-navy lg:text-lg">
        &ldquo;{review.texto}&rdquo;
      </p>

      {/* Bottom: 3 sub-columnas (foto | nombre+social | estrellas a la derecha) */}
      <div className="relative mt-6 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4">
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
            <div className="reviews-step-container overflow-hidden">
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
          </div>
        </div>
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
