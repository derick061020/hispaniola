import { Footer } from '@/components/home/footer'
import { HeroInterna } from '@/components/internas/hero-interna'
import { CabeceraTrabaja } from '@/components/trabaja/cabecera-trabaja'
import { FormularioTrabaja } from '@/components/trabaja/formulario-trabaja'
import { Meta } from '@/components/seo/meta'

// Página «Trabaja con nosotros» (/trabaja-con-nosotros) — PÁGINA NUEVA de las
// correcciones v1 del cliente (2026-07-22, pedido de Samuel con captura de
// referencia). No mapea nada de la web actual: allí no existe.
//
// Un solo destino para los tres enlaces del footer (proveedor / creador /
// afiliado), que llegan con `?perfil=` — el porqué, en el formulario. Mismo
// esqueleto que /agentes-de-viaje, su página hermana: las dos son captación
// de partners, viven en el footer y no en el menú (el 99% del tráfico es
// turista, arquitectura-nueva.md §2).
export function TrabajaConNosotrosPage() {
  return (
    <div>
      <Meta
        titulo="Work with us"
        descripcion="Activity providers, content creators and affiliates: tell us who you are and let’s talk. We reply on WhatsApp within 24 hours."
        ruta="/careers"
      />
      <HeroInterna ctaHref="/#tours">
        <CabeceraTrabaja />
      </HeroInterna>

      <div className="mx-auto max-w-contenido px-5 py-12 sm:px-10 lg:py-16">
        <FormularioTrabaja />
      </div>

      <Footer />
    </div>
  )
}
