import { useState } from 'react'
import { Etiqueta } from '@/components/ui/etiqueta'
import { QUOTES, FUNDADOR, type Review } from '@/data/home'
import { useDevFlag } from '@/dev/use-dev-flag'

// «Reseñas verificadas» (v5, pedido de Samuel 2026-07-15) — el bloque de
// prueba social, rediseñado como layout 2 columnas:
//
//   [VIDEO REAL DE LA MARCA]   |   [Eyebrow + h2 «4.9 de 5 en 1.782 reseñas»]
//   [Frase del cofundador]      |   [Slider vertical: 2 reseñas grandes]
//                               |   [Link a TripAdvisor / Facebook]
//
// El slider muestra 2 reseñas a la vez y rota automáticamente bajando en
// vertical (pista duplicada 2x + translateY -50% en bucle, mismo patrón que
// el ticker del hero). Pausa al hover; prefers-reduced-motion → scroll manual.
// Constantes del bucle en tokens.css (--reviews-duracion, --spacing-review-*).
//
// ⚠️ El video de la izquierda es un PLACEHOLDER (hero.mp4 = catamaran
// navegando, asset real de la marca). La referencia visual muestra a una
// persona en primer plano hablando a cámara — cuando llegue un video real
// del cofundador, se cambia solo el `src` de <video> en este archivo.
//
// El link "ver más" NO apunta a Viator a propósito (NOTAS['home-reviews']
// del prototipo): no regalar tráfico al canal que vende el mismo tour en
// pleno momento de decisión. Sí enlaza a TripAdvisor y Facebook, donde
// el cliente tiene presencia propia y verificable (la auditoría del sitio
// los marcó como los 2 canales principales de prueba social).

function StarRating({ count = 5 }: { count: number }) {
  // 5 estrellas, todas rellenas. Si entran <5 se usará el patrón fraccional
  // de ui/insignia-confianza.tsx (mismo cálculo de progresoEstrella) — por
  // ahora todas las reseñas del pool son 5★.
  return (
    <p className="text-estrella" aria-label={`${count} de 5 estrellas`}>
      {'★'.repeat(count)}
    </p>
  )
}

function Iniciales({ nombre }: { nombre: string }) {
  // Avatares con iniciales: no tenemos fotos de clientes (privacidad) y no
  // se inventan. Las iniciales del nombre + apellido en un círculo aqua-tint
  // — placeholder honesto, queda coherente con la dirección (el único
  // punto de color es el aqua con cuentagotas).
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
      className="grid size-10 shrink-0 place-items-center rounded-full bg-aqua-tint text-sm font-semibold text-aqua-dark"
    >
      {iniciales}
    </div>
  )
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex h-full flex-col rounded-card bg-papel p-5 shadow-card ring-1 ring-linea">
      <p className="text-xs font-semibold uppercase tracking-wide text-navy-soft">
        {review.lugar}
      </p>
      <div className="mt-2">
        <StarRating count={review.estrellas} />
      </div>
      <p className="mt-3 flex-1 text-base text-navy">&ldquo;{review.texto}&rdquo;</p>
      <div className="mt-4 flex items-center gap-3">
        <Iniciales nombre={review.autor} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-navy">{review.autor}</p>
          <p className="truncate text-xs text-navy-soft">
            {review.plataforma} · {review.fecha}
          </p>
        </div>
      </div>
    </div>
  )
}

export function Reviews() {
  // [dev-mode] ?dev-reviews=pausado congela el slider → frame limpio para
  // Figma. Misma mecánica que ?dev-ticker=pausado.
  const [pausado, setPausado] = useState(false)
  useDevFlag('dev-reviews', (v) => setPausado(v === 'pausado')) // [dev-mode]

  // Pista duplicada: la animación es translateY -50% sobre el total de la
  // pista, así que la segunda mitad (idéntica a la primera) ocupa justo el
  // lugar de la primera al final del ciclo → loop invisible. Mismo patrón
  // que el ticker del hero (componentes.css → .ticker-pista).
  const pista = [...QUOTES, ...QUOTES]

  return (
    <section className="px-5 py-seccion-sm sm:px-10 sm:py-seccion">
      <div className="mx-auto max-w-contenido">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[5fr_7fr] lg:gap-12">
          {/* IZQUIERDA — video + frase del cofundador */}
          <div>
            <video
              className="aspect-video w-full overflow-hidden rounded-card object-cover shadow-card"
              src={FUNDADOR.videoSrc}
              poster={FUNDADOR.videoPoster}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Video del equipo de Hispaniola Aquatic Adventures"
            />
            <blockquote className="mt-5 border-l-2 border-coral pl-4">
              <p className="text-base italic text-navy">&ldquo;{FUNDADOR.frase}&rdquo;</p>
              <footer className="mt-2 text-sm">
                <span className="font-semibold text-navy">{FUNDADOR.nombre}</span>
                <span className="text-navy-soft"> · {FUNDADOR.cargo}</span>
              </footer>
            </blockquote>
          </div>

          {/* DERECHA — slider vertical auto-rotante */}
          <div>
            <Etiqueta>Reseñas verificadas</Etiqueta>
            <h2 className="mt-3 font-display text-h2 font-semibold text-navy">
              4.9 de 5 en 1.782 reseñas
            </h2>

            <div
              className={`reviews-slider mt-6 ${pausado ? 'reviews-slider--pausado' : ''}`}
              onPointerEnter={() => setPausado(true)}
              onPointerLeave={() => setPausado(false)}
            >
              <div className="reviews-slider-track">
                {pista.map((q, i) => (
                  <div key={i} className="reviews-slider-slot">
                    <ReviewCard review={q} />
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-6 text-sm text-navy-soft">
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
        </div>
      </div>
    </section>
  )
}
