import { Boton } from '@/components/ui/boton'
import { Header } from './header'
import { BarajaHero } from './baraja-hero'

// Hero v3 — «inmersivo» (app/PLAN-v3.md). Cambio clave frente a v2: el Header
// pasa a vivir DENTRO del box del hero (antes era una barra hermana sticky).
//
// ⚠️ Trampa evitada (PLAN-v3.md §4): el box redondeado YA NO lleva
// `overflow-hidden` — si lo llevara, recortaría los megamenús del header
// (son `absolute`, se salen del box). El recorte de la media (foto/video)
// vive en una capa interna propia (`absolute inset-0 overflow-hidden`);
// el header y el contenido viven en la capa de encima, sin recorte.
export function Hero() {
  return (
    <>
      <section id="hero" className="px-4 pt-4 sm:px-6 sm:pt-6">
        <div className="relative rounded-hero">
          <div className="absolute inset-0 overflow-hidden rounded-hero">
            <img
              src="/fotos/hero-catamaran-2.webp"
              alt="Catamarán navegando en aguas turquesas frente a Punta Cana"
              className="absolute inset-0 size-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(90deg, var(--color-overlay-hero) 0%, var(--color-overlay-hero) 40%, var(--color-overlay-hero-suave) 75%, transparent 100%)',
              }}
            />
          </div>

          <div className="relative z-10">
            <Header variante="sobreVideo" />

            <div className="grid grid-cols-1 items-center gap-10 px-6 py-12 sm:px-10 sm:py-16 lg:grid-cols-[1.1fr_auto] lg:gap-14 lg:py-20">
              {/* Columna de texto */}
              <div>
                <p className="text-eyebrow font-semibold uppercase tracking-[0.14em] text-white/90">
                  Punta Cana · Bávaro
                </p>
                <h1 className="mt-3 max-w-xl font-display text-hero-movil font-semibold text-white sm:text-hero">
                  Los catamaranes originales de Punta Cana, en grupos pequeños
                </h1>
                <p className="mt-4 max-w-md text-lead text-white/90">
                  Snorkel en un vivero de coral real, cocina flotante con menú a tu elección y barcos a
                  media capacidad. Desde 2012.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white">
                  <span className="text-amber-300">★★★★★</span>
                  <span>
                    <strong>4.9</strong> · 1.782 reseñas
                  </span>
                  <span className="rounded-chip bg-white/15 px-2.5 py-1 text-xs font-medium backdrop-blur-sm">
                    #1 en TripAdvisor · 7 años
                  </span>
                  <span className="rounded-chip bg-white/15 px-2.5 py-1 text-xs font-medium backdrop-blur-sm">
                    Premios Viator 22-24
                  </span>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Boton href="#tours">Ver disponibilidad</Boton>
                  <p className="text-xs text-white/90">
                    ✓ Cancelación gratis hasta 7 días antes
                    <br />✓ Confirma con solo 25% de depósito
                  </p>
                </div>
              </div>

              {/* Baraja de tours — el escaparate que sustituye al buscador */}
              <div className="flex justify-center lg:justify-end">
                <BarajaHero />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA sticky — solo móvil, persiste al scrollear el resto del home */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-linea bg-papel p-3 shadow-card md:hidden">
        <Boton href="#tours" className="w-full">
          Ver disponibilidad
        </Boton>
      </div>
    </>
  )
}
