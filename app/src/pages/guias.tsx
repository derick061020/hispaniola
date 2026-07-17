import { useRef, useState } from 'react'
import { Footer } from '@/components/home/footer'
import { HeroInterna } from '@/components/internas/hero-interna'
import { CabeceraGuias } from '@/components/guias/cabecera-guias'
import { TipsRapidos } from '@/components/guias/tips-rapidos'
import { ListaGuias } from '@/components/guias/lista-guias'
import { useGuiasReveal } from '@/components/guias/use-guias-reveal'
import { Meta } from '@/components/seo/meta'
import { useDevFlag } from '@/dev/use-dev-flag'

// Página Guías (/guias) — mapea tips-for-punta-cana-....php: de página suelta
// a índice de blog (arquitectura-nueva.md §2). Mismo hero compartido
// (PLAN-INTERNAS-V2.md) que el resto de páginas internas. Dos bloques: los
// tips reales de esa página vieja primero (TipsRapidos — es el contenido con
// más peso que tiene hoy la página), el índice de futuros artículos después.
//
// REDISEÑO EDITORIAL (2026-07-17, pedido de Samuel: "parece una página con
// solo cajas... más editorial, más creativa e interesante"). Ambos bloques
// son ahora autocontenidos (cada uno con su propia Etiqueta+h2, ver
// tips-rapidos.tsx/lista-guias.tsx) — la página ya no envuelve ListaGuias en
// su propia sección con encabezado duplicado. useGuiasReveal se engancha UNA
// VEZ aquí (mismo patrón que useSostenibilidadReveal en sostenibilidad.tsx)
// porque los `.guias-reveal` viven repartidos en los 2 componentes hijos.
export function GuiasPage() {
  const contenidoRef = useRef<HTMLDivElement>(null)

  // [dev-mode] ?dev-guias=estatico congela el reveal de scroll en su estado
  // FINAL (todo ya visible) → frame limpio para Figma. Ver dev-registry.ts.
  const [estatico, setEstatico] = useState(false)
  useDevFlag('dev-guias', (v) => {
    if (v === 'estatico') setEstatico(true)
  })
  useGuiasReveal(contenidoRef, { activo: !estatico }) // [dev-mode] gate

  return (
    <div>
      <Meta
        titulo="Guías"
        descripcion="Tips reales sobre esnórquel y navegación en Punta Cana: cómo es el arrecife, cuánto se navega a vela, si el mar es seguro y qué mariscos sirvimos a bordo."
        ruta="/guias"
      />
      <HeroInterna ctaHref="/#tours">
        <CabeceraGuias />
      </HeroInterna>

      <div ref={contenidoRef} className="mx-auto flex max-w-contenido flex-col gap-16 px-5 py-12 sm:px-10 lg:py-16">
        <TipsRapidos />
        <ListaGuias />
      </div>

      <Footer />
    </div>
  )
}
