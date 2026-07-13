import { Header } from '@/components/home/header'
import { Hero } from '@/components/home/hero'
import { Footer } from '@/components/home/footer'

// Home — se construye por fases (ver app/PLAN.md). F3: hero + buscador.
// El resto de secciones (stats, tours, why-direct…) llega en F4-F6.
export function HomePage() {
  return (
    <div className="pb-16 md:pb-0">
      <Header />
      <Hero />
      <main className="flex min-h-[30vh] flex-col items-center justify-center gap-2 bg-papel-hueso px-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-aqua-dark">Hispaniola — F3</p>
        <h2 className="font-display text-h2 font-semibold text-navy">Hero listo</h2>
        <p className="max-w-md text-navy-sub">El resto de secciones llega en F4-F6. Ver app/PLAN.md.</p>
      </main>
      <Footer />
    </div>
  )
}
