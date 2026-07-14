import { useEffect, useRef, useState } from 'react'
import { Boton } from '@/components/ui/boton'
import { Header } from './header'
import { TickerHero } from './ticker-hero'
import { useDevFlag } from '@/dev/use-dev-flag'
import { STATS } from '@/data/home'

// Hero v3 — «inmersivo» (app/PLAN-v3.md). Cambios frente a v2: el Header pasa
// a vivir DENTRO del box del hero (antes era una barra hermana sticky), y la
// baraja de tours se retira del todo a favor de un ticker horizontal al pie
// del hero (con los 4 tours + las 6 ocasiones — ver ticker-hero.tsx).
//
// ⚠️ Trampa evitada (PLAN-v3.md §4): el box redondeado YA NO lleva
// `overflow-hidden` — si lo llevara, recortaría los megamenús del header
// (son `absolute`, se salen del box). El recorte de la media (foto/video)
// vive en una capa interna propia (`absolute inset-0 overflow-hidden`);
// el header y el contenido viven en la capa de encima, sin recorte.
export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)
  // [dev-mode] ?dev-hero=poster congela el video en el poster — es el frame
  // que viaja a Figma (a Figma no va video, va el poster). Ver dev-registry.ts
  const [forzarPoster, setForzarPoster] = useState(false)
  useDevFlag('dev-hero', (v) => {
    if (v === 'poster') setForzarPoster(true)
  })

  const reducirMovimiento =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (forzarPoster || reducirMovimiento) {
      video.pause()
    } else {
      video.play().catch(() => {})
    }
  }, [forzarPoster, reducirMovimiento])

  return (
    <>
      <section id="hero" className="px-hero-margen pt-hero-margen sm:px-hero-margen-sm sm:pt-hero-margen-sm">
        <div className="relative rounded-hero">
          <div className="absolute inset-0 overflow-hidden rounded-hero">
            <video
              ref={videoRef}
              className="absolute inset-0 size-full object-cover"
              poster="/fotos/hero-video-poster.webp"
              autoPlay={!reducirMovimiento && !forzarPoster}
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
            >
              <source src="/video/hero.mp4" type="video/mp4" />
            </video>
            {/* Overlay uniforme (ya no lateral: el contenido va centrado,
                PLAN-v3.md §6) + gradiente vertical inferior para asentar el
                ticker (PLAN-v3.md §7). Solo tokens — si el contraste falla
                en QA, se ajusta el token, no un valor inline. */}
            <div className="absolute inset-0 bg-overlay-hero" />
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(180deg, transparent 45%, var(--color-overlay-hero) 100%)',
              }}
            />
          </div>

          <div className="relative z-10">
            <Header variante="sobreVideo" />

            {/* La pirámide de confianza (PLAN-v3.md §14): el rating (lo más
                condensado) sube arriba del título, en el slot donde vivía el
                eyebrow de localización — la localización no se pierde, el H1
                ya la dice ("...de Punta Cana..."). Los 4 stats bajan aquí
                desde su propia sección: los números son la prueba que debe
                acompañar al CTA, no vivir solos en una pantalla aparte. */}
            {/* pb-16, no pb-10: con la fila de stats nueva (§14.3) el bloque
                de contenido baja y el CTA quedaba a 6px del ticker (medido
                en navegador) — bajo el mínimo de 24px de la Trampa №10.
                px-4 en vez de px-6 (móvil, PLAN-v3.md §11/pendientes): con
                solo 8px menos de aire por lado el H1 pasa de 6 a 4 líneas
                (medido con Playwright) — el resto del bloque no lo necesita,
                pero es un único padding compartido por toda la columna. */}
            <div className="px-4 pb-16 pt-12 text-center sm:px-10 sm:pt-16 lg:pt-20">
              {/* v3-F12: max-w-4xl, no max-w-3xl — el H1 ya no lleva su propio
                  max-w-xl (576px, heredado de cuando el hero llevaba grid de 2
                  columnas en v2): a 768px el titular envolvía en 4 líneas con
                  el tamaño nuevo (3.75rem); medido con Playwright, a 896px
                  (max-w-4xl) vuelve a envolver en 3. La lead pasó de max-w-md
                  a max-w-xl por la misma razón (era 3 líneas, ahora 2). El
                  resto del bloque (rating, stats, CTA) no tiene max-width
                  propio — se queda igual de centrado, con más aire. */}
              <div className="mx-auto max-w-4xl">
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-white">
                  <span className="text-amber-300">★★★★★</span>
                  <span>
                    <strong>4.9</strong> · 1.782 reseñas
                  </span>
                  <span className="rounded-chip bg-white/15 px-2.5 py-1 text-xs font-medium backdrop-blur-sm">
                    #1 en TripAdvisor · 7 años
                  </span>
                  <span className="rounded-chip bg-white/15 px-2.5 py-1 text-xs font-medium backdrop-blur-sm">
                    Premios Viator 22-24
                  </span>
                </div>
                <h1 className="mt-3 font-display text-hero-movil font-semibold text-white sm:text-hero">
                  Los catamaranes originales de Punta Cana, en grupos pequeños
                </h1>
                <p className="mx-auto mt-4 max-w-xl text-lead text-white/90">
                  Snorkel en un vivero de coral real, cocina flotante con menú a tu elección y barcos a
                  media capacidad. Desde 2012.
                </p>

                <div className="mt-6 flex flex-wrap items-start justify-center gap-x-10 gap-y-4">
                  {STATS.map((s) => (
                    <div key={s.label} className="text-center">
                      <p className="font-display text-stat font-semibold text-white">{s.valor}</p>
                      <p className="mx-auto mt-1 max-w-[16ch] text-xs text-white/80">{s.label}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                  <Boton href="#tours">Ver disponibilidad</Boton>
                  <p className="text-xs text-white/90">
                    ✓ Cancelación gratis hasta 7 días antes
                    <br />✓ Confirma con solo 25% de depósito
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Ticker — tours + ocasiones, en loop infinito. A caballo sobre el
              borde inferior del hero: mitad sobre el video, mitad sobre la
              siguiente sección (translate-y-1/2 sobre el propio alto).
              A SANGRE: el `<section>` tiene padding lateral
              (--spacing-hero-margen) para el box redondeado, pero el ticker
              tiene que llegar al borde real de la pantalla — si no, las
              cards se recortan 8-12px ANTES del borde y se ve como si
              desaparecieran contra una pared invisible en vez de deslizarse
              fuera de la pantalla.
              ⚠️ Dos técnicas descartadas, en orden:
              1) `left-1/2 -translate-x-1/2`: el `50%` se calcula sobre el
                 ancho de `.rounded-hero` (ya angosto por el padding del
                 hero), no sobre el viewport → queda descuadrado por el
                 propio margen que se quiere ignorar.
              2) `w-screen` (100vw): en desktop, con scrollbar clásica, 100vw
                 incluye el ancho de la scrollbar (aquí, 15px) — más ancho
                 que el área visible real (`100%`/`clientWidth`) → overflow-x
                 de página, el mismo que el propio PLAN-v3.md §8 avisaba
                 vigilar en este componente.
              La que sí funciona, sin vw ni transforms: cancelar el padding
              EXACTO del hero con el mismo token que lo puso (inset negativo),
              así el ticker queda flush con el borde real del layout sea cual
              sea el ancho de la scrollbar. */}
          <div className="absolute bottom-0 z-20 inset-x-[calc(var(--spacing-hero-margen)*-1)] sm:inset-x-[calc(var(--spacing-hero-margen-sm)*-1)] translate-y-1/2">
            <TickerHero />
          </div>
        </div>
      </section>

      {/* CTA sticky — solo móvil, persiste al scrollear el resto del home */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-linea bg-papel p-3 shadow-card md:hidden">
        <Boton href="#tours" className="w-full">
          Ver disponibilidad
        </Boton>
      </div>
    </>
  )
}
