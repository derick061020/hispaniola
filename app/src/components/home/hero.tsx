import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { ArrowRight } from 'lucide-react'
import { Boton } from '@/components/ui/boton'
import { InsigniaConfianza } from '@/components/ui/insignia-confianza'
import { Pajaros } from '@/components/ui/pajaros'
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

  // [dev-mode] ?dev-cta=hover congela el catamarán ZARPADO (asomando por
  // arriba del botón), sin depender de un puntero real → es el frame que
  // viaja a Figma (igual que ?dev-dock=activo con el ticker). Ver dev-registry.ts
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
      {/* pt-hero-margen SOLO en móvil: desde sm: el Topbar (components/home/topbar.tsx)
          vive justo encima, blanco y sin borde — sm:pt-0 pega el hero a su borde
          inferior sin espaciado, en vez de repetir el margen general del box. */}
      <section id="hero" className="px-hero-margen pt-hero-margen sm:px-hero-margen-sm sm:pt-0">
        {/* v3-F13 (PLAN-v3.md §15.5): flex-col + min-h-hero-alto (solo desde
            sm — en móvil el contenido manda). svh, no vh/dvh: vh es el
            viewport GRANDE en móvil (la barra de URL escondida) y dvh baila
            mientras se scrollea, con el ticker a caballo del borde inferior.
            min-height es un MÍNIMO: si el contenido natural crece, el %
            deja de cumplirse en silencio (Trampa §15.10 №1) — por eso el
            padding del bloque de contenido se recortó (más abajo) para
            mantenerlo por debajo del techo.
            v3-F21 (Samuel, 2026-07-15): sube a 84svh (antes 78svh) — el hero
            «un poco más alto», ya NO persiguiendo que la banda de premios se
            vea entera sin scroll (--spacing-hero-alto, tokens.css). */}
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

            {/* La pirámide de confianza (PLAN-v3.md §14): el eyebrow de
                localización que vivía arriba del título se retira — la
                localización no se pierde, el H1 ya la dice ("...de Punta
                Cana..."). Los 4 stats bajan aquí desde su propia sección: los
                números son la prueba que debe acompañar al CTA, no vivir
                solos en una pantalla aparte. v3-F17: las 3 insignias
                (guirnalda de laurel, v3-F16) vivieron primero ARRIBA del
                título, en ese mismo slot — Samuel: "no me gusta tanto como se
                ve arriba del todo" (2026-07-14). Bajan a cerrar el bloque,
                después del CTA y los 2 checks: como remate de confianza justo
                antes del ticker, no como preámbulo antes del titular. */}
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
                {/* PRUEBA (Samuel, 2026-07-14) — 4ª iteración: el subrayado de
                    ola viva SE QUEDA, pero el flotado suave («titulo-palabra»)
                    ya no va en todo el titular — se restringe a las 2 palabras
                    que lleva subrayadas, «catamaranes originales». El resto
                    ("Los", "de", "Punta Cana, en grupos pequeños") es texto
                    quieto, sin envolver en spans que no aportan nada si no
                    animan. text-balance vuelve a decidir el salto de línea
                    (ya no hace falta partirlo a mano: ninguna línea entera
                    necesita ya su propio tratamiento). */}
                <h1 className="text-balance font-display text-hero-movil font-semibold text-white sm:text-hero">
                  Los{' '}
                  <span className="titulo-subrayado">
                    <span className="titulo-palabra" style={{ '--i': 0 } as CSSProperties}>
                      catamaranes
                    </span>{' '}
                    <span className="titulo-palabra" style={{ '--i': 1 } as CSSProperties}>
                      originales
                    </span>
                    <span className="titulo-ola" aria-hidden="true" />
                  </span>{' '}
                  de Punta Cana, en grupos pequeños
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
                    icono) y las 2 condiciones bajan debajo, una junto a la
                    otra con una divisoria de 1px (oculta en móvil: apiladas,
                    una divisoria vertical entre filas no se lee).
                    v3-F18 (Samuel, 2026-07-14): pierden el icono Check y bajan
                    de opacidad (white/90 → white/70) — se barajó subirlas como
                    insignia arriba del título, pero esa reassurance copy
                    cumple su trabajo justo AL LADO del botón, en el instante
                    de decidir el clic; su función es ser texto de letra
                    pequeña, no una credencial que compita con las insignias
                    de confianza (§F16/F17) por atención. */}
                <div className="mt-8 flex flex-col items-center gap-4">
                  {/* CTA «mar» (pedido de Samuel, 2026-07-14): el botón lleva
                      su propio mar — 2 capas de olas en deriva infinita al
                      pie, y el catamarán REAL del cliente (recorte de
                      hero-catamaran-2.webp, espejado para navegar hacia la
                      flecha) amarrado en un hueco que NACE EN 0 y se EXPANDE
                      al hover (v3-F14.1: antes el hueco estaba siempre
                      reservado — 120px de vacío a la derecha del texto en
                      reposo, feedback de Samuel). Al hover ZARPA: sale de
                      abajo (el casco se recorta en el borde inferior del
                      botón, la línea de flotación) y el mástil asoma por
                      ARRIBA del botón — más arriba que en la 1ª iteración
                      (subió --spacing-cta-barco-alto: a la altura anterior,
                      la mayor parte del barco quedaba pegada sobre la cara
                      coral en vez de leerse saliendo de ella). Toda la
                      mecánica (ventana de recorte asimétrica, olas con mask,
                      reduced-motion) vive en componentes.css. */}
                  <Boton
                    href="#tours"
                    tamaño="lg"
                    className={`cta-mar relative ${forzarCatamaran ? 'cta-mar--forzado' : ''}`} // [dev-mode]
                  >
                    {/* La ventana del barco va ANTES de las olas en el DOM:
                        las olas pintan encima y el casco navega ENTRE ellas. */}
                    <span aria-hidden="true" className="cta-barco-ventana">
                      <img src="/fotos/catamaran-recorte.webp" alt="" width={276} height={360} className="cta-barco" />
                    </span>
                    {/* La bandada va FUERA de la ventana: allí dentro el
                        overflow:hidden (que corta el casco en la línea de
                        flotación) se comería a los pájaros que vuelan alto. */}
                    <Pajaros className="cta-pajaros" />
                    <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-btn">
                      <span className="cta-ola cta-ola--fondo bg-white/20" />
                      <span className="cta-ola bg-white/30" />
                    </span>
                    {/* relative: ventana y olas están posicionadas y pintarían
                        encima del texto si éste no lo estuviera también. */}
                    <span className="relative inline-flex items-center gap-2">
                      Ver disponibilidad
                      <ArrowRight className="size-5" aria-hidden="true" />
                    </span>
                  </Boton>

                  <div className="flex flex-col items-center gap-1.5 text-xs text-white/70 sm:flex-row sm:gap-3">
                    <span>Cancelación gratis hasta 7 días antes</span>
                    <span className="hidden h-3 w-px bg-white/20 sm:block" aria-hidden="true" />
                    <span>Confirma con solo 25% de depósito</span>
                  </div>

                  {/* v3-F16/F17 (pedido de Samuel, 2026-07-14): las 3 insignias
                      (antes fila de texto ★★★★★ 4.9 + 2 chips píldora) pasan al
                      diseño de guirnalda de laurel — mismo trazado que
                      RatingBadge de Untitled UI (MIT, gratuito), portado a
                      mano con nuestros tokens (ver insignia-confianza.tsx: no
                      se instaló la librería, cero dependencia de runtime para
                      este componente). Vivieron primero arriba del título
                      (mismo slot que el eyebrow de localización); Samuel:
                      "no me gusta tanto como se ve arriba del todo" — bajan
                      a cerrar el bloque, después del CTA y los 2 checks, como
                      remate de confianza justo antes del ticker. #1
                      TripAdvisor y Premios Viator no tienen una calificación
                      propia — llevan 5 estrellas como remate decorativo de
                      "excelencia", no como cifra citada; la única calificación
                      real (4.9, con relleno fraccionario en la 5ª estrella)
                      es la de reseñas. */}
                  <div className="mt-2 flex flex-wrap items-start justify-center gap-x-8 gap-y-4">
                    <InsigniaConfianza calificacion={4.9} titulo="4.9" subtitulo="1.782 reseñas" />
                    <InsigniaConfianza calificacion={5} titulo="#1 en TripAdvisor" subtitulo="7 años consecutivos" />
                    <InsigniaConfianza calificacion={5} titulo="Premios Viator" subtitulo="2022 · 2023 · 2024" />
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
