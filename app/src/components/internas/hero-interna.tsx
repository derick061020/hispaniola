import type { ReactNode } from 'react'
import { useState } from 'react'
import { Header } from '@/components/home/header'
import { FotosFundido } from '@/components/ui/fotos-fundido'
import { useDevFlag } from '@/dev/use-dev-flag'

// Hero compartido de las páginas internas (PLAN-INTERNAS-V2.md §C1) — ficha
// de tour y landing de evento. Reproduce el lenguaje del hero de la home
// (box redondeado con el mismo margen, Header variante="sobreVideo" DENTRO
// del box, overlay) pero COMPACTO (--spacing-hero-interna-alto, no
// --spacing-hero-alto: ese es exclusivo de la home) y con las fotos reales
// del tour/evento en fundido en vez de video — es la pieza que homogeniza el
// "empieza con media, header transparente encima" entre home e internas sin
// que la internas se sienta un sitio aparte.
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
  children,
}: {
  fotos: string[]
  /** describe el conjunto para lectores de pantalla (p. ej. el nombre del tour) */
  etiqueta: string
  ctaHref?: string
  children: ReactNode
}) {
  // [dev-mode] ?dev-hero-interna=pausado congela el fundido en su 1ª foto —
  // es el frame que viaja a Figma (a Figma no va el fundido, va el frame).
  const [pausado, setPausado] = useState(false)
  useDevFlag('dev-hero-interna', (v) => {
    if (v === 'pausado') setPausado(true)
  })

  return (
    <section className="px-hero-margen pt-hero-margen sm:px-hero-margen-sm sm:pt-hero-margen-sm">
      <div className="relative flex min-h-[22rem] flex-col rounded-hero sm:min-h-hero-interna-alto">
        <div className="absolute inset-0 overflow-hidden rounded-hero">
          <FotosFundido
            fotos={fotos}
            etiqueta={etiqueta}
            activa={!pausado} // [dev-mode]
            className="absolute inset-0 size-full"
          />
          {/* Overlay uniforme (mismo tono que el hero de la home) + gradiente
              inferior más denso donde se apoya el contenido — la misma
              receta de contraste, aquí con el peso invertido: en la home el
              contenido va centrado y el gradiente cierra el pie para el
              ticker; aquí el contenido ES el pie. */}
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

          <div className="flex flex-1 flex-col justify-end px-4 pb-6 pt-8 sm:px-10 sm:pb-8">
            <div className="max-w-4xl">{children}</div>
          </div>
        </div>
      </div>
    </section>
  )
}
