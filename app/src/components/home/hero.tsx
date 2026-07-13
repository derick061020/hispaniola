import { useState } from 'react'
import { TOURS } from '@/data/home'
import { Boton } from '@/components/ui/boton'
import { useDevFlag } from '@/dev/use-dev-flag'

// Hero + buscador — la sección más importante del home (ver
// NOTAS['home-hero'] del prototipo): el buscador fecha+personas ES el CTA,
// patrón Civitatis (disponibilidad antes que datos personales). Copy exacto
// de prototipo/app.js `seccionHero()` — no se inventa nada nuevo aquí.
export function Hero() {
  const [buscadorAbierto, setBuscadorAbierto] = useState(false)

  // [dev-mode] — ver src/dev/dev-registry.ts
  useDevFlag('dev-buscador', (v) => setBuscadorAbierto(v === 'abierto'))

  return (
    <>
      <section id="hero" className="relative overflow-hidden">
        <img
          src="/fotos/hero-catamaran-2.webp"
          alt="Catamarán navegando en aguas turquesas frente a Punta Cana"
          className="absolute inset-0 size-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(90deg, var(--color-overlay-hero) 0%, var(--color-overlay-hero-suave) 55%, transparent 85%)' }}
        />

        <div className="relative px-5 pb-16 pt-14 sm:px-10 sm:pb-24 sm:pt-20">
          <p className="text-eyebrow font-semibold uppercase tracking-[0.14em] text-white/90">Punta Cana · Bávaro</p>
          <h1 className="mt-3 max-w-xl font-display text-hero font-medium text-white">
            Los catamaranes originales de Punta Cana, en grupos pequeños
          </h1>
          <p className="mt-4 max-w-md text-lead text-white/90">
            Snorkel en un vivero de coral real, cocina flotante con menú a tu elección y barcos a
            media capacidad. Desde 2012.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white">
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
        </div>

        {/* Buscador — colapsado en móvil detrás de un botón, siempre visible en desktop */}
        <div className="relative px-5 pb-8 sm:px-10 sm:pb-10">
          {!buscadorAbierto ? (
            <button
              type="button"
              onClick={() => setBuscadorAbierto(true)}
              className="w-full rounded-card bg-papel px-5 py-4 text-left text-sm font-semibold text-navy shadow-hero sm:hidden"
            >
              Ver disponibilidad →
            </button>
          ) : null}

          <div
            className={`${buscadorAbierto ? 'flex' : 'hidden'} flex-col gap-3 rounded-card bg-papel p-4 shadow-hero sm:flex sm:flex-row sm:items-end sm:gap-4 sm:p-5`}
          >
            <label className="flex flex-1 flex-col gap-1 text-xs font-medium text-navy-soft">
              Tour
              <select className="rounded-lg border border-linea px-3 py-2.5 text-sm text-navy">
                <option value="">Todos los tours</option>
                {TOURS.map((t) => (
                  <option key={t.slug} value={t.slug}>
                    {t.nombre}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-1 flex-col gap-1 text-xs font-medium text-navy-soft">
              Fecha
              <input type="date" className="rounded-lg border border-linea px-3 py-2.5 text-sm text-navy" />
            </label>
            <label className="flex flex-1 flex-col gap-1 text-xs font-medium text-navy-soft sm:max-w-28">
              Personas
              <select defaultValue={2} className="rounded-lg border border-linea px-3 py-2.5 text-sm text-navy">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            <Boton href="#tours" className="sm:h-[42px]">
              Ver disponibilidad
            </Boton>
          </div>

          <p className="relative mt-3 text-xs text-white/90">
            ✓ Cancelación gratis hasta 7 días antes · ✓ Confirma con solo 25% de depósito
          </p>
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
