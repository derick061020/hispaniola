import { Footer } from '@/components/home/footer'
import { HeroInterna } from '@/components/internas/hero-interna'
import { CabeceraNosotros } from '@/components/nosotros/cabecera-nosotros'
import { IntroNosotros } from '@/components/nosotros/intro-nosotros'
import { ExperienciaABordo } from '@/components/nosotros/experiencia-abordo'
import { CocinaFlotante } from '@/components/nosotros/cocina-flotante'
import { TripulacionFlota } from '@/components/nosotros/tripulacion-flota'
import { ArrecifeTeaser } from '@/components/nosotros/arrecife-teaser'
import { Meta } from '@/components/seo/meta'

// Página Nosotros (/nosotros) — mapea about-hispaniola.php de la web actual
// (Crew + Fleet; Foundation vive en /sostenibilidad desde que es tab propio).
// Mismo hero compartido (PLAN-INTERNAS-V2.md) que el resto de páginas
// internas. Página de MARCA: sin widget ni cotización.
//
// REDISEÑO 2026-07-17 (pedido de Samuel — ver data/nosotros.ts para el
// detalle de fuentes y decisiones de contenido): de 2 bloques (tripulación
// + flota) a 5, portando el contenido real de about-hispaniola.php que no
// vivía en ningún lugar del sitio — bienvenida, itinerario en 3 paradas y
// la cocina flotante como diferenciador propio, antes de la tripulación y
// la flota (ahora con los 6 catamaranes reales, no la versión simplificada).
export function NosotrosPage() {
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

      <div className="mx-auto max-w-contenido px-5 py-12 sm:px-10 lg:py-16">
        <div className="flex flex-col gap-12 lg:gap-16">
          <IntroNosotros />
          <ExperienciaABordo />
          <CocinaFlotante />
          <TripulacionFlota />
          <ArrecifeTeaser />
        </div>
      </div>

      <Footer />
    </div>
  )
}
