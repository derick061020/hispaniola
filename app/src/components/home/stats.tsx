// Cinta de confianza — estos datos hoy están enterrados en la ficha del
// wireframe (ver NOTAS['home-stats'] del prototipo); aquí suben a la home.
const STATS = [
  { valor: '91.607', label: 'clientes felices' },
  { valor: '4.454', label: 'días navegados' },
  { valor: '≤35%', label: 'de la capacidad del barco' },
  { valor: '0', label: 'plástico a bordo' },
]

export function Stats() {
  return (
    <section className="border-b border-linea bg-papel px-5 py-seccion-sm sm:px-10">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-y-8 sm:grid-cols-4 sm:gap-y-0">
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className={`text-center ${i > 0 ? 'sm:border-l sm:border-linea' : ''}`}
          >
            <p className="font-display text-hero-movil font-semibold text-navy sm:text-stat">{s.valor}</p>
            <p className="mt-1 text-sm text-navy-soft">{s.label}</p>
          </div>
        ))}
      </div>
      <p className="mt-8 text-center text-xs text-navy-soft">
        Reconocido en TripAdvisor · Viator · WeddingWire · LTG Awards
      </p>
    </section>
  )
}
