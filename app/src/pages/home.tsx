import { Header } from '@/components/home/header'
import { Hero } from '@/components/home/hero'
import { Stats } from '@/components/home/stats'
import { ToursGrid } from '@/components/home/tours-grid'
import { WhyDirect } from '@/components/home/why-direct'
import { Diferenciadores } from '@/components/home/diferenciadores'
import { Reviews } from '@/components/home/reviews'
import { Footer } from '@/components/home/footer'

// Home — se construye por fases (ver app/PLAN.md). F5: why-direct +
// diferenciadores + reviews. Eventos/galería/FAQ/cierre llegan en F6.
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
      <main className="flex min-h-[20vh] flex-col items-center justify-center gap-2 bg-papel px-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-aqua-dark">Hispaniola — F5</p>
        <h2 className="font-display text-h2 font-semibold text-navy">Why-direct + diferenciadores + reviews listos</h2>
        <p className="max-w-md text-navy-sub">Eventos, galería y cierre llegan en F6. Ver app/PLAN.md.</p>
      </main>
      <Footer />
    </div>
  )
}
