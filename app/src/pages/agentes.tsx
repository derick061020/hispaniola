import { Footer } from '@/components/home/footer'
import { HeroInterna } from '@/components/internas/hero-interna'
import { CabeceraAgentes } from '@/components/agentes/cabecera-agentes'
import { FormularioAgentes } from '@/components/agentes/formulario-agentes'
import { Meta } from '@/components/seo/meta'
import { t } from '@/lib/i18n'

// Página Agentes de viaje (/agentes-de-viaje) — mapea
// travel-agent-registration.php. Mismo hero compartido (PLAN-INTERNAS-V2.md).
export function AgentesPage() {
  return (
    <div>
      <Meta
        titulo={t('Travel agents')}
        descripcion={t('Registration for travel agencies and DMCs: direct coordination, formal invoicing and real availability.')}
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
