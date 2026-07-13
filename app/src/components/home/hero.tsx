import { Boton } from '@/components/ui/boton'
import { BarajaHero } from './baraja-hero'

// Hero v2 — «Boutique luminoso» (app/PLAN-v2.md §2).
// Cambios frente a v1: contenedor redondeado (ya no va a sangre, refs Journeo
// y Vacationeeze) y el buscador de disponibilidad se sustituye por la BARAJA
// de los 4 tours (ref ExploreX). El copy es el mismo del wireframe aprobado.
//
// Conversión: la baraja asume el papel que tenía el buscador — cada card es un
// producto real con precio y CTA. Se conservan además el CTA primario, la meta
// de cancelación/depósito y el CTA sticky de móvil.
export function Hero() {
  return (
    <>
      <section id="hero" className="px-4 pt-4 sm:px-6 sm:pt-6">
        <div className="relative overflow-hidden rounded-hero">
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

          <div className="relative grid grid-cols-1 items-center gap-10 px-6 py-12 sm:px-10 sm:py-16 lg:grid-cols-[1.1fr_auto] lg:gap-14 lg:py-20">
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
