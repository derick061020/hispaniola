import { Footer } from '@/components/home/footer'
import { HeroInterna } from '@/components/internas/hero-interna'
import { CabeceraFaq } from '@/components/faq/cabecera-faq'
import { CategoriasFaq } from '@/components/faq/categorias-faq'
import { Meta } from '@/components/seo/meta'

// Página FAQ standalone (/faq) — mapea frequently-asked-questions.php; la
// home enlaza aquí desde su FAQ curada ("Ver todas las preguntas →"). Mismo
// hero compartido (PLAN-INTERNAS-V2.md) que el resto de páginas internas.
export function FaqPage() {
  return (
    <div>
      <Meta
        titulo="Frequently asked questions"
        descripcion="Bookings and payments, what to bring, food, weather and children: the 17 most frequently asked questions about Hispaniola’s tours."
        ruta="/faq"
      />
      <HeroInterna ctaHref="/#tours">
        <CabeceraFaq />
      </HeroInterna>

      <div className="mx-auto max-w-5xl px-5 py-12 sm:px-10 lg:py-16">
        <CategoriasFaq />
      </div>

      <Footer />
    </div>
  )
}
