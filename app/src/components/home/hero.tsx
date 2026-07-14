import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
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

  // [dev-mode] ?dev-cta=hover congela el catamarán FUERA del botón, sin
  // depender de un puntero real → es el frame que viaja a Figma (igual que
  // ?dev-dock=activo con el hover del ticker). Ver dev-registry.ts
  const [forzarCatamaran, setForzarCatamaran] = useState(false)
  useDevFlag('dev-cta', (v) => {
    if (v === 'hover') setForzarCatamaran(true)
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
        {/* v3-F13 (PLAN-v3.md §15.5): flex-col + min-h-hero-alto (78svh, solo
            desde sm — en móvil el contenido manda) para que el hero ocupe
            ~78% del alto de pantalla y deje ver la banda de premios sin
            scroll. svh, no vh/dvh: vh es el viewport GRANDE en móvil (la
            barra de URL escondida) y dvh baila mientras se scrollea, con el
            ticker a caballo del borde inferior. min-height es un MÍNIMO: si
            el contenido natural crece, el 78% deja de cumplirse en silencio
            (Trampa §15.10 №1) — por eso el padding del bloque de contenido
            se recortó (más abajo) para mantenerlo por debajo del techo. */}
        <div className="relative flex flex-col rounded-hero sm:min-h-hero-alto">
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

          <div className="relative z-10 flex flex-1 flex-col">
            <Header variante="sobreVideo" />

            {/* La pirámide de confianza (PLAN-v3.md §14): el rating (lo más
                condensado) sube arriba del título, en el slot donde vivía el
                eyebrow de localización — la localización no se pierde, el H1
                ya la dice ("...de Punta Cana..."). Los 4 stats bajan aquí
                desde su propia sección: los números son la prueba que debe
                acompañar al CTA, no vivir solos en una pantalla aparte. */}
            {/* v3-F13 (PLAN-v3.md §15.5): flex-1 + justify-center reparte el
                aire sobrante del min-h-hero-alto entre Header y este bloque;
                pt-8 sm:pt-10 (antes pt-12 sm:pt-16 lg:pt-20) recorta el
                presupuesto vertical que el 78% necesita para dejar ver la
                banda de premios sin scroll — no es cosmético, es el ajuste
                que evita que el contenido natural supere el mínimo (Trampa
                §15.10 №1). pb-16: con la fila de stats (§14.3) el CTA queda a
                más de 24px del ticker (mínimo de la Trampa №10). px-4 en vez
                de px-6 (móvil): el H1 gana algo de ancho extra. */}
            <div className="flex flex-1 flex-col justify-center px-4 pb-16 pt-8 text-center sm:px-10 sm:pt-10">
              {/* v3-F13 (PLAN-v3.md §15.6): max-w-5xl (antes max-w-4xl/896px,
                  F12) — a 896px el titular envolvía en 3 líneas con el
                  tamaño de 3.75rem; medido con Playwright, a 1024px
                  (max-w-5xl) envuelve en 2. text-balance reparte las 2 líneas
                  parejas en vez de dejar una larga y un rabo corto — no
                  existe en Figma, el salto de línea se replica a mano al
                  preparar el frame. La lead se queda en max-w-xl (2 líneas,
                  sin cambios desde F12). El resto del bloque (rating, stats,
                  CTA) no tiene max-width propio. */}
              <div className="mx-auto max-w-5xl">
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
                <h1 className="mt-3 text-balance font-display text-hero-movil font-semibold text-white sm:text-hero">
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
                      {/* v3-F13 (PLAN-v3.md §15.7): whitespace-nowrap (antes
                          max-w-[16ch]) — el label más largo ("del aforo del
                          barco", ajustado en data/home.ts) ya cabe en una
                          línea; con el clamp de caracteres, "de la capacidad
                          del barco" partía en 2 y desalineaba la fila. */}
                      <p className="mx-auto mt-1 whitespace-nowrap text-xs text-white/80">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* v3-F13 (PLAN-v3.md §15.8): columna, no fila — el botón
                    gana peso (tamaño="lg": más ancho, halo --shadow-cta,
                    icono) y los 2 checks bajan debajo, uno junto al otro con
                    una divisoria de 1px (oculta en móvil: apilados, una
                    divisoria vertical entre filas no se lee). Iconos de
                    lucide (ya usados en item-menu.tsx/menu-movil.tsx), no un
                    "✓" de texto. */}
                <div className="mt-8 flex flex-col items-center gap-4">
                  {/* El catamarán REAL del cliente (recorte de
                      hero-catamaran-2.webp) sale navegando por el borde
                      derecho del CTA al pasar el ratón — hacia donde apunta la
                      flecha del botón. Va espejado: en la foto original navega
                      hacia la izquierda y saldría de espaldas.

                      ⚠️ Vive FUERA del botón (hermano, no hijo) porque un hijo
                      NUNCA se pinta por detrás del fondo de su padre: dentro
                      del <a> el barco aparecería ENCIMA del coral desde el
                      primer frame, en vez de asomar desde detrás. Como hermano
                      anterior en el DOM y con el botón en `relative` (los dos
                      posicionados → gana el último del DOM), el botón lo tapa
                      mientras está dentro de sus límites: el propio fondo del
                      botón es la puerta por la que sale.

                      El barco es MÁS ALTO que el botón, así que en reposo
                      asomaría por arriba y por abajo — de ahí el opacity-0
                      (no basta con esconderlo detrás). Decorativo: alt vacío y
                      aria-hidden. Con prefers-reduced-motion no se mueve ni
                      aparece; no se pierde nada. */}
                  <span className="group relative inline-flex">
                    <img
                      src="/fotos/catamaran-recorte.webp"
                      alt=""
                      aria-hidden="true"
                      width={276}
                      height={360}
                      className={`pointer-events-none absolute right-0 top-1/2 h-28 w-auto -translate-y-[58%] opacity-0 transition-all duration-500 ease-out motion-safe:group-hover:translate-x-20 motion-safe:group-hover:opacity-100 ${
                        forzarCatamaran ? 'translate-x-20 opacity-100' : '' // [dev-mode]
                      }`}
                    />
                    <Boton href="#tours" tamaño="lg" className="relative">
                      Ver disponibilidad
                      <ArrowRight className="size-5" aria-hidden="true" />
                    </Boton>
                  </span>

                  <div className="flex flex-col items-center gap-2 text-xs text-white/90 sm:flex-row sm:gap-4">
                    <span className="flex items-center gap-1.5">
                      <Check className="size-4 shrink-0" strokeWidth={3} aria-hidden="true" />
                      Cancelación gratis hasta 7 días antes
                    </span>
                    <span className="hidden h-4 w-px bg-white/30 sm:block" aria-hidden="true" />
                    <span className="flex items-center gap-1.5">
                      <Check className="size-4 shrink-0" strokeWidth={3} aria-hidden="true" />
                      Confirma con solo 25% de depósito
                    </span>
                  </div>
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
