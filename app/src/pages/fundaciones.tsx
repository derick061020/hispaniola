// Página de validación de fundaciones (F0): swatches de paleta + type scale.
// No es parte de la home — sirve para revisar tokens antes de construir bloques.
const swatches: { nombre: string; token: string; hex: string; textoClaro?: boolean }[] = [
  { nombre: 'Papel', token: 'papel', hex: '#FFFFFF' },
  { nombre: 'Papel hueso', token: 'papel-hueso', hex: '#F7F9FA' },
  { nombre: 'Navy', token: 'navy', hex: '#0B2545', textoClaro: true },
  { nombre: 'Navy sub', token: 'navy-sub', hex: '#42525F', textoClaro: true },
  { nombre: 'Aqua', token: 'aqua', hex: '#0E8C9C', textoClaro: true },
  { nombre: 'Coral', token: 'coral', hex: '#EF5B44', textoClaro: true },
  { nombre: 'Menta', token: 'menta', hex: '#E7F5EF' },
  { nombre: 'Línea', token: 'linea', hex: '#DFE6EA' },
]

export function FundacionesPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <p className="text-xs font-semibold uppercase tracking-wide text-aqua-dark">Fundaciones — F0</p>
      <h1 className="mt-2 font-display text-h2 font-semibold text-navy">
        Dirección B — Charter Premium
      </h1>
      <p className="mt-2 max-w-prose text-navy-sub">
        Tokens de <code className="text-sm">src/styles/tokens.css</code>. El aqua se usa con
        cuentagotas (ver guardarraíles en <code className="text-sm">analisis/direccion-visual.md</code>) —
        aquí se ve grande solo para validar el tono, no como referencia de proporción real.
      </p>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-navy-soft">Paleta</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {swatches.map((s) => (
            <div key={s.token} className="overflow-hidden rounded-card ring-1 ring-linea">
              <div
                className="flex h-20 items-end p-2"
                style={{ background: `var(--color-${s.token})`, color: s.textoClaro ? `var(--color-papel)` : `var(--color-navy)` }}
              >
                <span className="text-xs font-medium">{s.hex}</span>
              </div>
              <div className="bg-papel p-2">
                <p className="text-sm font-medium text-navy">{s.nombre}</p>
                <p className="font-mono text-[11px] text-navy-soft">--color-{s.token}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-navy-soft">Type scale</h2>
        <div className="mt-4 space-y-6 rounded-card bg-papel p-6 ring-1 ring-linea">
          <div>
            <p className="text-hero font-display font-medium text-navy">Navega el arrecife</p>
            <p className="font-mono text-[11px] text-navy-soft">--text-hero · Lora</p>
          </div>
          <div>
            <p className="text-h2 font-display font-semibold text-navy">Título de sección</p>
            <p className="font-mono text-[11px] text-navy-soft">--text-h2 · Lora</p>
          </div>
          <div>
            <p className="text-h3 font-display font-semibold text-navy">Título de card</p>
            <p className="font-mono text-[11px] text-navy-soft">--text-h3 · Lora</p>
          </div>
          <div>
            <p className="text-lead text-navy-sub">
              Párrafo destacado / lead — 4.9★ en 1.782 reseñas y #1 en TripAdvisor durante 7 años.
            </p>
            <p className="font-mono text-[11px] text-navy-soft">--text-lead · Inter</p>
          </div>
          <div>
            <p className="text-precio font-semibold text-menta-texto">$99</p>
            <p className="font-mono text-[11px] text-navy-soft">--text-precio · Inter (sobre fondo menta)</p>
          </div>
          <div>
            <p className="text-eyebrow font-semibold uppercase tracking-[0.14em] text-aqua-dark">
              Punta Cana · Desde 2012
            </p>
            <p className="font-mono text-[11px] text-navy-soft">--text-eyebrow · Inter caps</p>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-navy-soft">
          Forma y sombra — v2 «Boutique luminoso»
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-6 rounded-card bg-papel p-6 ring-1 ring-linea sm:grid-cols-4">
          <div>
            <div className="h-20 rounded-hero bg-papel-hueso ring-1 ring-linea" />
            <p className="mt-2 text-sm font-medium text-navy">Hero</p>
            <p className="font-mono text-[11px] text-navy-soft">--radius-hero · 28px</p>
          </div>
          <div>
            <div className="h-20 rounded-card bg-papel-hueso ring-1 ring-linea" />
            <p className="mt-2 text-sm font-medium text-navy">Card</p>
            <p className="font-mono text-[11px] text-navy-soft">--radius-card · 12px</p>
          </div>
          <div>
            <div className="h-20 rounded-hero bg-papel shadow-baraja" />
            <p className="mt-2 text-sm font-medium text-navy">Baraja (activa)</p>
            <p className="font-mono text-[11px] text-navy-soft">--shadow-baraja</p>
          </div>
          <div>
            <div className="h-20 rotate-[-4deg] rounded-foto bg-papel p-1.5 shadow-polaroid">
              <div className="size-full rounded-foto bg-papel-hueso" />
            </div>
            <p className="mt-2 text-sm font-medium text-navy">Photo-stack</p>
            <p className="font-mono text-[11px] text-navy-soft">--shadow-polaroid · --radius-foto</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-navy-soft">
          Ritmo vertical: <code>--spacing-seccion</code> 7rem (desktop) /{' '}
          <code>--spacing-seccion-sm</code> 4rem (móvil) — cableados como{' '}
          <code>py-seccion</code> en las secciones (en v1 el token existía pero nadie lo usaba).
          Movimiento de la baraja: <code>--baraja-intervalo</code> 4000ms ·{' '}
          <code>--baraja-transicion</code> 600ms — <strong>de aquí salen los delays del
          prototipo de Figma</strong>, no de ojo.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-navy-soft">Botones</h2>
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-card bg-papel p-6 ring-1 ring-linea">
          <button className="rounded-btn bg-coral px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-coral-dark">
            Ver disponibilidad
          </button>
          <button className="rounded-btn border border-aqua px-5 py-2.5 text-sm font-semibold text-aqua transition hover:bg-aqua-tint">
            Nuestros tours
          </button>
          <div className="rounded-card bg-menta px-4 py-2.5">
            <span className="text-xs text-navy-sub">Desde, por persona&nbsp;&nbsp;</span>
            <span className="text-lg font-semibold text-menta-texto">$99</span>
          </div>
        </div>
      </section>
    </main>
  )
}
