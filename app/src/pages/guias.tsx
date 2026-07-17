import { useRef, useState } from 'react'
import { Footer } from '@/components/home/footer'
import { HeroInterna } from '@/components/internas/hero-interna'
import { CabeceraGuias } from '@/components/guias/cabecera-guias'
import { TipsRapidos } from '@/components/guias/tips-rapidos'
import { useGuiasReveal } from '@/components/guias/use-guias-reveal'
import { Meta } from '@/components/seo/meta'
import { useDevFlag } from '@/dev/use-dev-flag'

// Página Guías (/guias) — mapea tips-for-punta-cana-....php: de página suelta
// a la página que es hoy, sin más. Mismo hero compartido (PLAN-INTERNAS-V2.md)
// que el resto de páginas internas. UNA sola sección: TipsRapidos, con las 4
// preguntas evergreen de la página vieja (esnórquel/arrecife, vela, mar,
// mariscos) — las 4 de COVID-19 de esa misma página original se dejaron
// FUERA por obsoletas, decisión de Samuel 2026-07-17.
//
// Antes la página tenía 2 bloques (TipsRapidos + ListaGuias, un índice de 5
// artículos fantasma con "próximamente" al pie) — ListaGuias NO tiene
// contraparte en la web original y el "próximamente" sonaba raro en un sitio
// live. Samuel pidió quitarlo el 2026-07-17 ("la web original no dice nada
// de eso"); sin ListaGuias, la página queda con las 4 preguntas que sí
// existen. Cuando el cliente dé el copy real de futuros artículos, cada uno
// se monta como página aparte (mismo patrón que tours/eventos), no como
// tarjeta placeholder.
//
// REDISEÑO EDITORIAL (2026-07-17, pedido de Samuel: "parece una página con
// solo cajas... más editorial, más creativa e interesante"). El bloque es
// autocontenido (Etiqueta+h2 propios, ver tips-rapidos.tsx) — numeral
// fantasma + hairline, sin cards. useGuiasReveal se engancha UNA VEZ aquí
// (mismo patrón que useSostenibilidadReveal en sostenibilidad.tsx) porque
// los `.guias-reveal` viven repartidos dentro de TipsRapidos.
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
        descripcion="Tips reales sobre esnórquel y navegación en Punta Cana: cómo es el arrecife, cuánto se navega a vela, si el mar es seguro y qué mariscos sirvemos a bordo."
        ruta="/guias"
      />
      <HeroInterna ctaHref="/#tours">
        <CabeceraGuias />
      </HeroInterna>

      <div ref={contenidoRef} className="mx-auto max-w-contenido px-5 py-12 sm:px-10 lg:py-16">
        <TipsRapidos />
      </div>

      <Footer />
    </div>
  )
}
