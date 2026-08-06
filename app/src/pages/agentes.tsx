import { Footer } from '@/components/home/footer'
import { HeroInterna } from '@/components/internas/hero-interna'
import { CabeceraAgentes } from '@/components/agentes/cabecera-agentes'
import { FormularioAgentes } from '@/components/agentes/formulario-agentes'
import { Meta } from '@/components/seo/meta'

// Página Agentes de viaje (/agentes-de-viaje) — mapea
// travel-agent-registration.php. Mismo hero compartido (PLAN-INTERNAS-V2.md).
export function AgentesPage() {
  return (
    <div>
      <Meta
        titulo="Agentes de viaje"
        descripcion="Registro para agencias de viaje y DMCs — coordinación directa, factura fiscal y disponibilidad real."
        ruta="/travel-agents"
      />
      <HeroInterna ctaHref="/#tours">
        <CabeceraAgentes />
      </HeroInterna>

      <div className="mx-auto max-w-contenido px-5 py-12 sm:px-10 lg:py-16">
        <FormularioAgentes />
      </div>

      <Footer />
    </div>
  )
}
