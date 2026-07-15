import { Hero } from '@/components/home/hero'
import { Premios } from '@/components/home/premios'
import { Experiencia } from '@/components/home/experiencia'
import { ToursGrid } from '@/components/home/tours-grid'
import { WhyDirect } from '@/components/home/why-direct'
import { IncluyeCrucero } from '@/components/home/incluye-crucero'
import { Diferenciadores } from '@/components/home/diferenciadores'
import { Reviews } from '@/components/home/reviews'
import { GaleriaFaqCierre } from '@/components/home/galeria-faq-cierre'
import { Footer } from '@/components/home/footer'

// Home completa (F0-F6) — ver app/PLAN.md. v3: el Header vive DENTRO del
// Hero (app/PLAN-v3.md §4), ya no se monta aquí como hermano.
export function HomePage() {
  return (
    <div className="pb-16 md:pb-0">
      <Hero />
      <Premios />
      <Experiencia />
      <ToursGrid />
      <WhyDirect />
      <IncluyeCrucero />
      <Diferenciadores />
      <Reviews />
      <GaleriaFaqCierre />
      <Footer />
    </div>
  )
}
