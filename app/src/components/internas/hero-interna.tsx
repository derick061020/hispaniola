import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import { Header } from '@/components/home/header'
import { useDevFlag } from '@/dev/use-dev-flag'

// Hero compartido de las páginas internas (PLAN-INTERNAS-V2.md §C1) — ficha
// de tour y landing de evento. Reproduce el lenguaje del hero de la home
// (box redondeado con el mismo margen, Header variante="sobreVideo" DENTRO
// del box, overlay, el mismo video de marca hero.mp4) pero COMPACTO
// (--spacing-hero-interna-alto, no --spacing-hero-alto: ese es exclusivo de
// la home).
//
// Iteración 2026-07-17, 2ª vuelta: la 1ª iteración de este mismo día partió
// el hero en dos (video + mosaico de fotos incrustado a un lado) — Samuel,
// al verlo: "no me gusta nada". Dos problemas de ESA versión, no de esta:
// 1) el mosaico no pertenecía al hero (se muda al contenido, ver
//    internas/galeria-mosaico.tsx, ahora un bloque más de la columna
//    izquierda de la ficha). 2) el título quedaba alineado a la izquierda
//    SIN respetar el max-w-contenido común del resto de la página — bug real,
//    no solo gusto: el wrapper del contenido usaba padding plano
//    (`px-4 sm:px-10`) sobre una caja YA angosta por --spacing-hero-margen,
//    en vez de re-centrar con `mx-auto max-w-contenido` como hace Header
//    (más abajo en este archivo) y como hace TODO el resto del contenido de
//    la página. La caja del hero está inset simétricamente (mismo margen a
//    los 2 lados) — centrar max-w-contenido DENTRO de esa caja da la MISMA
//    línea central que centrarlo contra el viewport real (el margen se
//    cancela algebraicamente), así que reusar el patrón basta: no hace falta
//    ningún truco de margen negativo. Header ya lo hacía bien (por eso el
//    logo nunca se vio desalineado) — el título no.
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
  ctaHref = '#tours',
  children,
}: {
  ctaHref?: string
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

  return (
    // id="hero": mismo id que el hero de la home (home/hero.tsx) — es el
    // sentinel que IslaFlotante observa para saber cuándo aparecer (una vez
    // este hero sale del viewport). Un solo hero por página, sin colisión.
    // pt-hero-margen SOLO en móvil: desde sm: el Topbar vive justo encima,
    // blanco y sin borde — sm:pt-0 pega el hero a su borde inferior sin
    // espaciado (mismo criterio que home/hero.tsx).
    <section id="hero" className="px-hero-margen pt-hero-margen sm:px-hero-margen-sm sm:pt-0">
      <div className="relative flex min-h-[22rem] flex-col rounded-hero sm:min-h-hero-interna-alto">
        <div className="absolute inset-0 overflow-hidden rounded-hero">
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

          <div className="flex flex-1 flex-col justify-end pb-6 pt-8 sm:pb-8">
            <div className="mx-auto w-full max-w-contenido px-5 sm:px-10">
              <div className="max-w-4xl">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
