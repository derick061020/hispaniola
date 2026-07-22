import { useRef, useState } from 'react'
import { Footer } from '@/components/home/footer'
import { EquipoTeaser } from '@/components/home/equipo-teaser'
import { HeroInterna } from '@/components/internas/hero-interna'
import { CabeceraNosotros } from '@/components/nosotros/cabecera-nosotros'
import { IntroNosotros } from '@/components/nosotros/intro-nosotros'
import { NuestraHistoria } from '@/components/nosotros/nuestra-historia'
import { TripulacionAbordo } from '@/components/nosotros/tripulacion-abordo'
import { ExperienciaABordo } from '@/components/nosotros/experiencia-abordo'
import { FlotaGrid } from '@/components/nosotros/flota-grid'
import { ArrecifeTeaser } from '@/components/nosotros/arrecife-teaser'
import { Meta } from '@/components/seo/meta'
import { EQUIPO, NOSOTROS } from '@/data/nosotros'
import { useDevFlag } from '@/dev/use-dev-flag'
import { useAperturaIntro } from '@/components/nosotros/use-apertura-intro'
import { useTimelineHistoria } from '@/components/nosotros/use-timeline-historia'
import { useCascadaNosotros } from '@/components/nosotros/use-cascada-nosotros'

// Página Nosotros (/nosotros) — mapea about-hispaniola.php de la web actual
// (Crew + Fleet; Foundation vive en /sostenibilidad desde que es tab propio).
// Mismo hero compartido (PLAN-INTERNAS-V2.md) que el resto de páginas
// internas. Página de MARCA: sin widget ni cotización.
//
// REDISEÑO 2026-07-22 — la página se REORDENA para seguir la estructura de la
// maqueta del cliente (correcciones-v1-cliente/nosotros…pdf, slides 1-5), que
// hasta ahora se había cumplido a trozos. Antes eran 6 bloques en fila sobre
// papel; ahora son 4 tiempos con un tema cada uno:
//
//   1. QUIÉNES SOMOS — la bienvenida (IntroNosotros).
//   2. NUESTRA HISTORIA — la voz del fundador + la línea de tiempo
//      (NuestraHistoria), y a continuación LAS PERSONAS: la sección de equipo
//      de la home REUTILIZADA (pedido de Samuel), cerrada con la tripulación
//      a bordo (TripulacionAbordo) en vez de con su enlace a /nosotros, que
//      aquí apuntaría a sí misma.
//   3. LA EXPERIENCIA A BORDO — la cocina flotante de apertura y las 3
//      paradas del itinerario (ExperienciaABordo). La cocina venía suelta y
//      enterrada tres bloques más abajo; era el argumento más fuerte de la
//      página sin sitio propio.
//   4. LA FLOTA — los 6 catamaranes en rejilla de cards (FlotaGrid), con LA
//      MISMA card que el escaparate de tours de la home.
//
// El cierre (ArrecifeTeaser) no se toca: sigue mencionando el arrecife y
// mandando a /sostenibilidad, que es donde se cuenta.
//
// Toda la página vive en UN contenedor. La franja de experiencia llegó a
// tener el suyo propio para poder sangrar el gris de la maqueta; al retirar
// Samuel ese fondo, el contenedor aparte se fue con él — mantenerlo habría
// dejado dos sistemas de ancho y padding conviviendo para pintar exactamente
// lo mismo.
export function NosotrosPage() {
  const contenidoRef = useRef<HTMLDivElement>(null)

  // [dev-mode] ?dev-nosotros=estatico congela los 3 efectos de scroll (la
  // apertura de la foto de bienvenida, el trazado de la línea de tiempo y las
  // cascadas de paradas/flota) en su estado FINAL → frame limpio para Figma.
  // Ver dev-registry.ts. Sin GSAP enganchado, la página se ve directamente
  // asentada (el estado natural del JSX) — que es también lo que ve quien
  // tiene prefers-reduced-motion.
  const [estatico, setEstatico] = useState(false)
  useDevFlag('dev-nosotros', (v) => setEstatico(v === 'estatico')) // [dev-mode]
  useAperturaIntro(contenidoRef, { activo: !estatico }) // [dev-mode] gate
  useTimelineHistoria(contenidoRef, { activo: !estatico }) // [dev-mode] gate
  useCascadaNosotros(contenidoRef, { activo: !estatico }) // [dev-mode] gate

  // Los 2 miembros PLACEHOLDER (Capitán / Bióloga marina) no son personas
  // reales y además tienen su propio bloque más abajo en esta misma página
  // (TripulacionAbordo): como card con nombre serían el mismo dato dos veces.
  // Ver el comentario largo de EQUIPO en data/nosotros.ts.
  const equipoConNombre = EQUIPO.filter((m) => !m.placeholder)

  return (
    <div>
      <Meta
        titulo="Nosotros"
        descripcion="La tripulación, la flota de 6 catamaranes y la cocina flotante detrás de cada tour de Hispaniola Aquatic Adventures."
        ruta="/nosotros"
      />
      <HeroInterna ctaHref="/#tours">
        <CabeceraNosotros />
      </HeroInterna>

      <div ref={contenidoRef}>
        <div className="mx-auto max-w-contenido px-5 py-12 sm:px-10 lg:py-16">
          <div className="flex flex-col gap-16 lg:gap-24">
            <IntroNosotros />
            <NuestraHistoria />
            <EquipoTeaser
              miembros={equipoConNombre}
              etiqueta={NOSOTROS.equipoEyebrow}
              titulo={NOSOTROS.equipoTitulo}
              texto={NOSOTROS.equipoTexto}
              cierre={<TripulacionAbordo />}
              enmarcada={false}
              hrefHistoria="#historia"
            />
            <ExperienciaABordo />
            <FlotaGrid />
            <ArrecifeTeaser />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
