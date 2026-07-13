// Reseñas verificadas — el link "ver más" NO apunta a Viator a propósito
// (ver NOTAS['home-reviews'] del prototipo): no regalar tráfico al canal que
// vende el mismo tour, en pleno momento de decisión.
const QUOTES = [
  {
    texto: 'El coral fue lo mejor del viaje — la bióloga nos explicó todo, y la comida a bordo, increíble.',
    autor: 'Jessica M. · Viator · jun 2026',
  },
  {
    texto: 'Muy buen trato, grupo pequeño como prometían, no como otros catamaranes llenos de gente.',
    autor: 'Carlos R. · TripAdvisor · may 2026',
  },
  {
    texto: 'Reservamos directo por WhatsApp y nos resolvieron todo en minutos. Repetiríamos sin dudar.',
    autor: 'Ana P. · Facebook · may 2026',
  },
]

export function Reviews() {
  return (
    <section className="bg-papel-hueso px-5 py-seccion-sm sm:px-10 sm:py-seccion">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-aqua-dark">Reseñas verificadas</p>
        <h2 className="mt-2 font-display text-h2 font-semibold text-navy">4.9 de 5 en 1.782 reseñas</h2>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {QUOTES.map((q) => (
            <div key={q.autor} className="rounded-card bg-papel p-5 shadow-card ring-1 ring-linea">
              <p className="text-amber-400">★★★★★</p>
              <p className="mt-2 text-sm text-navy">&ldquo;{q.texto}&rdquo;</p>
              <p className="mt-3 text-xs text-navy-soft">{q.autor}</p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-sm text-navy-soft">
          Ver más reseñas →{' '}
          <a href="https://www.tripadvisor.com" target="_blank" rel="noopener" className="font-semibold text-aqua-dark hover:underline">
            TripAdvisor
          </a>{' '}
          ·{' '}
          <a href="https://www.facebook.com" target="_blank" rel="noopener" className="font-semibold text-aqua-dark hover:underline">
            Facebook
          </a>
        </p>
      </div>
    </section>
  )
}
