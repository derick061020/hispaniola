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
//
// `imagen` (correcciones v1, pedido de Samuel 2026-07-22 — hero del artículo
// de blog): sustituye el video de marca por una foto fija cuando el fondo NO
// es el catamarán genérico sino algo propio de la página (la portada del
// artículo). Mismas capas de overlay/gradiente/scrim, misma caja — el video
// es el DEFAULT del hero compartido, no un requisito.
//
// `pie` (correcciones v1, pedido de Samuel — el artículo tenía "Volver al
// blog" + Compartir en una fila aparte, bajo el hero: "quita el botón de
// volver al blog, que los botones de compartir estén en ese mismo lugar a
// la derecha pero arriba dentro del hero"; 3ª vuelta, mismo día: "que los
// iconos de compartir estén alineados a la parte inferior del hero"). 1ª
// vuelta lo anclaba debajo del Header, arriba del todo — Samuel pidió
// bajarlo. Ahora vive DENTRO del mismo bloque bottom-anchored que
// `children` (misma `flex-1 justify-end` que empuja todo al pie del hero),
// en su propia fila justo debajo del título/lead/meta, alineado a la
// derecha. Solo el artículo lo usa hoy (CompartirArticulo sobreOscuro); el
// resto de internas no pasa esta prop y el hero se ve igual que siempre.
export function HeroInterna({
  ctaHref = '#tours',
  imagen,
  pie,
  children,
}: {
  ctaHref?: string
  imagen?: { src: string; alt: string }
  pie?: ReactNode
  children: ReactNode
}) {
  const videoRef = useRef<HTMLVideoElement>(null)

  // [dev-mode] ?dev-hero-interna=pausado congela el video en el poster —
  // igual mecánica que ?dev-hero=poster en el hero de la home: es el frame
  // que viaja a Figma (a Figma no va video, va el poster). Sin efecto cuando
  // hay `imagen`: ya es un frame fijo.
  const [pausado, setPausado] = useState(false)
  useDevFlag('dev-hero-interna', (v) => {
    if (v === 'pausado') setPausado(true)
  })

  const reducirMovimiento =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (imagen) return
    const video = videoRef.current
    if (!video) return
    if (pausado || reducirMovimiento) {
      video.pause()
    } else {
      video.play().catch(() => {})
    }
  }, [pausado, reducirMovimiento, imagen])

  return (
    // id="hero": mismo id que el hero de la home (home/hero.tsx) — es el
    // sentinel que NavFlotante busca para decidir si esta página lo muestra
    // (2026-07-21: ya no observa scroll, solo comprueba que exista). Un solo
    // hero por página, sin colisión.
    // pt-hero-margen SOLO en móvil: desde sm: el Topbar vive justo encima,
    // blanco y sin borde — sm:pt-0 pega el hero a su borde inferior sin
    // espaciado (mismo criterio que home/hero.tsx).
    <section id="hero" className="px-hero-margen pt-hero-margen sm:px-hero-margen-sm sm:pt-0">
      {/* data-nav-oscuro (2026-07-22): mismo sentinel que home/hero.tsx —
          NavFlotante lo observa para decidir el color del texto de los tabs.
          En la caja redondeada con el video, no en el <section> de afuera
          (padding transparente, no oscuro). */}
      <div data-nav-oscuro className="relative flex min-h-[22rem] flex-col rounded-hero sm:min-h-hero-interna-alto">
        <div className="absolute inset-0 overflow-hidden rounded-hero">
          {/* rounded-hero también AQUÍ, no solo en el div ancestro — mismo
              bug/arreglo que home/hero.tsx (Samuel, 2026-07-22, con captura:
              "en las 4 esquinas no se ve el border redondeando, hay un
              overlay que no deja que se vea bien"): el <video> es un
              elemento reemplazado con su propia capa de composición que en
              varios navegadores IGNORA el overflow-hidden+border-radius de
              un ANCESTRO. border-radius en el propio elemento sí recorta
              siempre, sea cual sea la ruta de composición. */}
          {imagen ? (
            <img
              src={imagen.src}
              alt={imagen.alt}
              className="absolute inset-0 size-full rounded-hero object-cover"
            />
          ) : (
            <video
              ref={videoRef}
              className="absolute inset-0 size-full rounded-hero object-cover"
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
          )}
          <div className="absolute inset-0 bg-overlay-hero" />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, transparent 20%, var(--color-overlay-hero) 100%)',
            }}
          />
          {/* Refuerzo de contraste solo en la franja del nav — ver el
              comentario de --color-scrim-nav en tokens.css. */}
          <div className="scrim-nav-superior absolute inset-x-0 top-0" />
        </div>

        <div className="relative z-10 flex flex-1 flex-col">
          <Header variante="sobreVideo" ctaHref={ctaHref} />

          <div className="flex flex-1 flex-col justify-end pb-6 pt-8 sm:pb-8">
            <div className="mx-auto w-full max-w-contenido px-5 sm:px-10">
              <div className="max-w-4xl">{children}</div>
              {pie ? <div className="mt-4 flex justify-end sm:mt-6">{pie}</div> : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
