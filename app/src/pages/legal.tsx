import { Navigate, useParams } from 'react-router-dom'
import { Footer } from '@/components/home/footer'
import { HeroInterna } from '@/components/internas/hero-interna'
import { CabeceraLegal } from '@/components/legal/cabecera-legal'
import { CuerpoLegal } from '@/components/legal/cuerpo-legal'
import { Meta } from '@/components/seo/meta'
import { LEGAL } from '@/data/legal'

// Plantilla legal (/legal/:slug) — UNA página para las 4 (política de
// cancelación, privacidad, términos, cookies), igual que la ficha de tour es
// una plantilla para los 4 productos. En Figma: una página con frames de
// variante, no 4 diseños. Mismo hero compartido (PLAN-INTERNAS-V2.md),
// compacto y estático (una sola foto, sin fundido — no hace falta más para
// una página de utilidad). `noindex`: son páginas de cumplimiento, no
// contenido que competir por tráfico.
export function LegalPage() {
  const { slug } = useParams()
  const doc = slug ? LEGAL[slug] : undefined

  if (!doc) return <Navigate to="/" replace />

  return (
    <div>
      <Meta titulo={doc.nombre} descripcion={doc.intro} ruta={`/legal/${doc.slug}`} indexable={false} />
      <HeroInterna ctaHref="/#tours">
        <CabeceraLegal doc={doc} />
      </HeroInterna>

      <div className="mx-auto max-w-contenido px-5 py-12 sm:px-10 lg:py-16">
        <CuerpoLegal doc={doc} />
      </div>

      <Footer />
    </div>
  )
}
