import { PREMIOS } from '@/data/home'

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

      {/* Los 7 premios reales (data/home.ts). Sustituyen a la línea de texto
          "Reconocido en TripAdvisor · Viator · WeddingWire · LTG Awards", que
          decía lo mismo pero pidiéndole al lector que se fiara de nuestra
          palabra: el badge ES la prueba. Van aquí, junto a las cifras, porque
          es LA sección de demostrar — premios y números se refuerzan. */}
      <div className="mx-auto mt-8 max-w-5xl border-t border-linea pt-7">
        <p className="text-center text-eyebrow font-semibold uppercase tracking-[0.14em] text-navy-soft">
          Reconocido por
        </p>
        <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-6 sm:gap-x-10">
          {PREMIOS.map((premio) => (
            <li key={premio.id}>
              <img
                src={`/premios/${premio.foto}.webp`}
                alt={premio.nombre}
                width={premio.ancho}
                height={premio.alto}
                loading="lazy"
                className="premio-logo"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
