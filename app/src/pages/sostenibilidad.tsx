import { useRef, useState } from 'react'
import { Footer } from '@/components/home/footer'
import { HeroInterna } from '@/components/internas/hero-interna'
import { CabeceraSostenibilidad } from '@/components/sostenibilidad/cabecera-sostenibilidad'
import { IntroSostenibilidad } from '@/components/sostenibilidad/intro-sostenibilidad'
import { RecorridoSostenibilidad } from '@/components/sostenibilidad/recorrido-sostenibilidad'
import { ImpactoSostenibilidad } from '@/components/sostenibilidad/impacto-sostenibilidad'
import { VideosSostenibilidad } from '@/components/sostenibilidad/videos-sostenibilidad'
import { CierreSostenibilidad } from '@/components/sostenibilidad/cierre-sostenibilidad'
import { Meta } from '@/components/seo/meta'
import { SOSTENIBILIDAD } from '@/data/sostenibilidad'
import { useDevFlag } from '@/dev/use-dev-flag'
import { useSostenibilidadReveal } from '@/components/sostenibilidad/use-sostenibilidad-reveal'

// Página Sostenibilidad (/sostenibilidad) — combina las 2 páginas reales de la
// web actual: sustainability.php (intro + 3 pilares + cierre) y
// competitive-advantage.php (la frase + los 7 videos), tal como preveía la
// arquitectura (arquitectura-nueva.md: Competitive Advantage se absorbe aquí).
//
// Orden del contenido (3ª vuelta, 2026-07-22): misión + video → EL RECORRIDO
// de los 3 pilares (zigzag con la curva, la estela y el catamarán) → banda de
// impacto (las 6 cifras) → los 7 videos → cierre. La banda de impacto va justo
// DESPUÉS del recorrido a propósito: los pilares cuentan QUÉ se hace y las
// cifras rematan CUÁNTO — separarlas con los videos en medio rompía el remate.
//
// PLAN-INTERNAS-V2.md (2026-07-17, Samuel): adopta el HERO COMPARTIDO con la
// home, la ficha de tour y las landings de evento (internas/hero-interna.tsx)
// — mismo box redondeado + Header `sobreVideo` dentro, con las fotos reales
// del arrecife en fundido en vez de una imagen fija al lado. Es página de
// MARCA (informa), no de conversión: sin widget ni cotización. "Reservar" del
// header no tiene ancla propia aquí → lleva al grid de tours de la home.
export function SostenibilidadPage() {
  const contenidoRef = useRef<HTMLDivElement>(null)

  // [dev-mode] ?dev-sost=estatico congela el reveal de scroll en su estado
  // FINAL (todos los bloques ya visibles) → frame limpio para Figma. Ver
  // dev-registry.ts. Sin GSAP enganchado, la página se ve directamente
  // asentada (el estado natural del JSX).
  const [estatico, setEstatico] = useState(false)
  useDevFlag('dev-sost', (v) => {
    if (v === 'estatico') setEstatico(true)
  })
  useSostenibilidadReveal(contenidoRef, { activo: !estatico }) // [dev-mode] gate

  return (
    <div>
      <Meta
        titulo={SOSTENIBILIDAD.titulo}
        descripcion="Restauración de arrecifes de coral, apoyo a comunidades locales y operación responsable — la Bávaro Reefs Foundation detrás de cada tour."
        ruta="/sostenibilidad"
      />
      <HeroInterna ctaHref="/#tours">
        <CabeceraSostenibilidad />
      </HeroInterna>

      <div ref={contenidoRef} className="mx-auto max-w-contenido px-5 py-12 sm:px-10 lg:py-16">
        <div className="flex flex-col gap-16 lg:gap-24">
          <IntroSostenibilidad />
          <RecorridoSostenibilidad activo={!estatico} /> {/* [dev-mode] gate */}
          <ImpactoSostenibilidad />
          <VideosSostenibilidad />
          <CierreSostenibilidad />
        </div>
      </div>

      <Footer />
    </div>
  )
}
