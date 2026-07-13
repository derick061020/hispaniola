import { Header } from '@/components/home/header'
import { Hero } from '@/components/home/hero'
import { Stats } from '@/components/home/stats'
import { ToursGrid } from '@/components/home/tours-grid'
import { Footer } from '@/components/home/footer'

// Home — se construye por fases (ver app/PLAN.md). F4: confianza + tours.
// Why-direct/diferenciadores/reviews llegan en F5, eventos/galería en F6.
export function HomePage() {
  return (
    <div className="pb-16 md:pb-0">
      <Header />
      <Hero />
      <Stats />
      <ToursGrid />
      <main className="flex min-h-[20vh] flex-col items-center justify-center gap-2 bg-papel-hueso px-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-aqua-dark">Hispaniola — F4</p>
        <h2 className="font-display text-h2 font-semibold text-navy">Confianza + tours listos</h2>
        <p className="max-w-md text-navy-sub">El resto de secciones llega en F5-F6. Ver app/PLAN.md.</p>
      </main>
      <Footer />
    </div>
  )
}
