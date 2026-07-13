import { Header } from '@/components/home/header'
import { Hero } from '@/components/home/hero'
import { Stats } from '@/components/home/stats'
import { ToursGrid } from '@/components/home/tours-grid'
import { WhyDirect } from '@/components/home/why-direct'
import { Diferenciadores } from '@/components/home/diferenciadores'
import { Reviews } from '@/components/home/reviews'
import { EventosBanda } from '@/components/home/eventos-banda'
import { GaleriaFaqCierre } from '@/components/home/galeria-faq-cierre'
import { Footer } from '@/components/home/footer'

// Home completa (F0-F6) — ver app/PLAN.md.
export function HomePage() {
  return (
    <div className="pb-16 md:pb-0">
      <Header />
      <Hero />
      <Stats />
      <ToursGrid />
      <WhyDirect />
      <Diferenciadores />
      <Reviews />
      <EventosBanda />
      <GaleriaFaqCierre />
      <Footer />
    </div>
  )
}
