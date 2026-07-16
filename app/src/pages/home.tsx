import { Hero } from '@/components/home/hero'
import { Premios } from '@/components/home/premios'
import { Experiencia } from '@/components/home/experiencia'
import { ToursGrid } from '@/components/home/tours-grid'
import { WhyDirect } from '@/components/home/why-direct'
import { IncluyeCrucero } from '@/components/home/incluye-crucero'
import { Reviews } from '@/components/home/reviews'
import { GaleriaFaqCierre } from '@/components/home/galeria-faq-cierre'
import { Footer } from '@/components/home/footer'

// Home completa (F0-F6) — ver app/PLAN.md. v3: el Header vive DENTRO del
// Hero (app/PLAN-v3.md §4), ya no se monta aquí como hermano.
//
// v3-F21 (Samuel, 2026-07-16): se elimina «Diferenciadores», que iba entre
// IncluyeCrucero y Reviews — sus 4 verdades ya se decían todas antes (dos de
// ellas, ≤35% de aforo y 0 plástico, son literalmente stats del hero) y su
// número editorial gigante repetía el de IncluyeCrucero justo encima. El único
// dato que solo vivía allí (el top-3 de restauración de coral) se rescató en la
// narrativa de Experiencia — el porqué completo, en data/home.ts.
export function HomePage() {
  return (
    <div className="pb-16 md:pb-0">
      <Hero />
      <Premios />
      <Experiencia />
      <ToursGrid />
      <WhyDirect />
      <IncluyeCrucero />
      <Reviews />
      <GaleriaFaqCierre />
      <Footer />
    </div>
  )
}
