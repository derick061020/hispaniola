import { Header } from '@/components/home/header'
import { Footer } from '@/components/home/footer'

// Home — se construye por fases (ver app/PLAN.md). F2: shell (header+footer).
// El hero llega en F3, el resto de secciones en F4-F6.
export function HomePage() {
  return (
    <>
      <Header />
      <main className="flex min-h-[50vh] flex-col items-center justify-center gap-2 bg-papel-hueso px-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-aqua-dark">Hispaniola — F2</p>
        <h1 className="font-display text-h2 font-semibold text-navy">Shell listo</h1>
        <p className="max-w-md text-navy-sub">El hero llega en F3. Ver app/PLAN.md para el plan completo.</p>
      </main>
      <Footer />
    </>
  )
}
