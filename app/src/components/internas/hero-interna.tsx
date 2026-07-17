import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import { Header } from '@/components/home/header'
import { GaleriaHero } from './galeria-hero'
import { GaleriaLightbox } from '@/components/tour/galeria-lightbox'
import { useDevFlag } from '@/dev/use-dev-flag'

// Hero compartido de las páginas internas (PLAN-INTERNAS-V2.md §C1) — ficha
// de tour y landing de evento. Reproduce el lenguaje del hero de la home
// (box redondeado con el mismo margen, Header variante="sobreVideo" DENTRO
// del box, overlay) pero COMPACTO (--spacing-hero-interna-alto, no
// --spacing-hero-alto: ese es exclusivo de la home).
//
// Iteración 2026-07-17 (Samuel, tras ver la v1 de fundido): "se ve raro que
// justo debajo del hero esté el grid [de fotos]" como sección aparte — y
// propuso volver al VIDEO de la home aquí también, integrando el grid DENTRO
// del hero. Se resuelve partiendo el hero en dos (sm+): el mismo video de
// marca (hero.mp4, el de la home — no hay video por tour) a la izquierda +
// el mosaico de fotos reales del tour/evento (galeria-hero.tsx) a la
// derecha, los dos dentro de la MISMA caja redondeada — ya no hay salto a
// una sección en blanco después. En móvil no hay sitio para partir el hero:
// el video queda a sangre completa y el mosaico baja a una tira horizontal
// pegada al pie, sobre el propio video. Sustituye a ui/fotos-fundido.tsx
// aquí (esa pieza sigue viva en internas/tambien-te-gusta.tsx).
//
// ⚠️ Misma trampa que PLAN-v3.md §4 (hero de la home): el box NO lleva
// `overflow-hidden` — si lo llevara, recortaría los megamenús del header (son
// `absolute`, se salen del box). El recorte de la media vive en su propia
// capa interna (`absolute inset-0 overflow-hidden`); Header y el contenido
// (children) viven en la capa de encima, sin recorte.
//
// Contenido alineado a la izquierda y pegado al pie del box (a diferencia
// del hero de la home, centrado): es la cabecera de UNA ficha, no un
// manifiesto de marca — y el pie es donde el gradiente inferior es más denso,
// así que el texto lee bien encima de cualquier foto real. Sin ticker.
export function HeroInterna({
  fotos,
  etiqueta,
  ctaHref = '#tours',
  quote,
  children,
}: {
  /** fotos reales del tour/evento — alimentan el mosaico (galeria-hero.tsx) y
   *  su lightbox. Ya NO son las que pinta el hero: el fondo es el video de
   *  marca, compartido con la home. */
  fotos: string[]
  /** describe el conjunto para lectores de pantalla (p. ej. el nombre del tour) */
  etiqueta: string
  ctaHref?: string
  /** reseña destacada del tour (ficha.quoteDestacada) — flota sobre la 1ª
   *  celda del mosaico en desktop. Los eventos no tienen quote propia. */
  quote?: { texto: string; rating: number }
  children: ReactNode
}) {
  const videoRef = useRef<HTMLVideoElement>(null)

  // [dev-mode] ?dev-hero-interna=pausado congela el video en el poster —
  // igual mecánica que ?dev-hero=poster en el hero de la home: es el frame
  // que viaja a Figma (a Figma no va video, va el poster).
  const [pausado, setPausado] = useState(false)
  useDevFlag('dev-hero-interna', (v) => {
    if (v === 'pausado') setPausado(true)
  })

  // [dev-mode] ?dev-hero-galeria=abierta abre el lightbox del mosaico en su
  // 1ª foto. Un solo estado para las 2 variantes de galeria-hero.tsx
  // (columna/tira): montan las dos a la vez (CSS decide cuál se ve según el
  // viewport), así que el lightbox no puede vivir dentro de cada una o el
  // flag abriría dos modales fullscreen apilados.
  const [lightbox, setLightbox] = useState<number | null>(null)
  useDevFlag('dev-hero-galeria', (v) => setLightbox(v === 'abierta' ? 0 : null))

  const reducirMovimiento =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (pausado || reducirMovimiento) {
      video.pause()
    } else {
      video.play().catch(() => {})
    }
  }, [pausado, reducirMovimiento])

  // Isla Saona no tiene galería (`galeriaCompleta: []`, ficha.foto sola) — el
  // mosaico no se rellena con fotos de otros tours (mentiría sobre el
  // producto), así que ni se monta: el video ocupa el hero entero, igual que
  // su cabecera ya renuncia al chip de "Cancelación gratis" por la misma
  // honestidad. `fotos` trae solo la portada en ese caso → length 1.
  const hayGaleria = fotos.length > 1

  return (
    <section className="px-hero-margen pt-hero-margen sm:px-hero-margen-sm sm:pt-hero-margen-sm">
      <div className="relative flex min-h-[22rem] flex-col rounded-hero sm:min-h-hero-interna-alto">
        <div className="absolute inset-0 overflow-hidden rounded-hero">
          <div className="flex size-full">
            <div className={`relative size-full overflow-hidden ${hayGaleria ? 'sm:w-3/5' : ''}`}>
              <video
                ref={videoRef}
                className="absolute inset-0 size-full object-cover"
                poster="/fotos/hero-video-poster.webp"
                autoPlay={!reducirMovimiento && !pausado}
                muted
                loop
                playsInline
                preload="metadata"
                aria-hidden="true"
              >
                <source src="/video/hero.mp4" type="video/mp4" />
              </video>
            </div>

            {hayGaleria ? (
              <div className="relative hidden h-full overflow-hidden bg-navy sm:block sm:w-2/5">
                <GaleriaHero fotos={fotos} variante="columna" onAbrir={setLightbox} quote={quote} />
              </div>
            ) : null}
          </div>

          {/* Overlay uniforme (mismo tono que el hero de la home) + gradiente
              inferior más denso donde se apoya el contenido — la misma
              receta de contraste, aquí con el peso invertido: en la home el
              contenido va centrado y el gradiente cierra el pie para el
              ticker; aquí el contenido ES el pie. Cubre video Y mosaico por
              igual: el mosaico queda ligeramente atenuado bajo el mismo velo,
              a propósito — no compite con el header ni con el título. */}
          <div className="absolute inset-0 bg-overlay-hero" />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, transparent 20%, var(--color-overlay-hero) 100%)',
            }}
          />
        </div>

        <div className="relative z-10 flex flex-1 flex-col">
          <Header variante="sobreVideo" ctaHref={ctaHref} />

          <div
            className={`flex flex-1 flex-col justify-end px-4 pb-6 pt-8 sm:px-10 sm:pb-8 ${hayGaleria ? 'sm:w-3/5' : ''}`}
          >
            <div className="max-w-4xl">{children}</div>
          </div>

          {/* Tira móvil — la contraparte de la columna del mosaico en sm+,
              nunca las dos a la vez. */}
          {hayGaleria ? (
            <div className="sm:hidden">
              <GaleriaHero fotos={fotos} variante="tira" onAbrir={setLightbox} />
            </div>
          ) : null}
        </div>
      </div>

      {hayGaleria && lightbox !== null ? (
        <GaleriaLightbox fotos={fotos} indiceInicial={lightbox} etiqueta={etiqueta} onCerrar={() => setLightbox(null)} />
      ) : null}
    </section>
  )
}
