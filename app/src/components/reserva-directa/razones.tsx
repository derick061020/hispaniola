import { Link } from 'react-router-dom'

// «Todo lo que incluye reservar con nosotros» (plan 07 §4 — slide 55).
//
// El cliente pide 19 razones. Van las 19 —las quiere todas— pero AGRUPADAS en
// 5 bloques temáticos, no como un muro de 19 cards seguidas.
//
// Por qué agrupadas, que no es capricho: en la v3 se ELIMINÓ la sección
// «Diferenciadores» de la home con este razonamiento (pages/home.tsx): «sus 4
// verdades ya se decían todas antes y su número editorial gigante repetía el
// de IncluyeCrucero justo encima». Y del diagnóstico del hero cargado salió el
// principio general: «un hero cargado casi siempre es N lenguajes de confianza
// compitiendo → una prueba por trabajo». 19 cards seguidas es exactamente eso
// en formato lista: nadie lee 19 razones, se ven como una pared y se saltan.
// Además varias se solapaban («la mejor ubicación» y «en el centro de la zona
// hotelera» son la misma; «sin mareos» es consecuencia de la ubicación).
//
// Y encaja con lo que el cliente pidió en la reunión (33:30): «no es tampoco
// para que la gente se vaya mucho ahí» — esta no es una página para retener,
// es una página de paso hacia Tours. Agrupado se escanea en segundos.

type Grupo = { titulo: string; razones: string[] }

const GRUPOS: Grupo[] = [
  {
    titulo: 'La comida',
    razones: [
      'Mariscos frescos, nunca congelados',
      'Solo bebidas de marca',
      'Plataforma de cocina certificada',
      'La única cocina flotante de Punta Cana',
    ],
  },
  {
    titulo: 'El barco y la comodidad',
    razones: [
      'Semi-privado de verdad, en grupo pequeño',
      'Barcos limpios y bien mantenidos',
      'Fácil subir y bajar',
      'Baños limpios a bordo',
      'Sin mareos, apto para toda la familia',
    ],
  },
  {
    titulo: 'La ubicación',
    razones: [
      'En el centro de la zona hotelera',
      'Traslados en bus con aire acondicionado',
      'Snorkel en vivero de coral, no en cualquier punto',
    ],
  },
  {
    titulo: 'El precio y la reserva',
    razones: [
      'Reserva directa con el propietario',
      'Fotos del tour incluidas',
      'Excursión de medio día: te queda tarde libre',
    ],
  },
  {
    titulo: 'Las personas y el planeta',
    razones: [
      'Empresa legal y asegurada',
      'Respetuosos con el medio ambiente',
      'Salario justo a nuestro personal',
      'Equipo multilingüe',
    ],
  },
]

export function Razones() {
  const total = GRUPOS.reduce((s, g) => s + g.razones.length, 0)

  return (
    <section>
      <p className="text-eyebrow font-semibold uppercase tracking-[0.14em] text-aqua">
        Todo lo que incluye reservar con nosotros
      </p>
      <h2 className="mt-3 font-display text-h2 font-semibold text-navy">
        {total} razones, ordenadas
      </h2>
      <p className="mt-3 max-w-xl text-lg text-navy-sub">
        No es marketing — es lo que vive cada uno de nuestros huéspedes.
      </p>

      <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {GRUPOS.map((g) => (
          <div key={g.titulo}>
            <h3 className="border-b border-linea pb-2 font-display text-lg font-semibold text-navy">
              {g.titulo}
            </h3>
            <ul className="mt-3 flex flex-col gap-2">
              {g.razones.map((r) => (
                <li key={r} className="text-sm leading-relaxed text-navy-sub">
                  {r}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-card-grande bg-menta px-6 py-8 text-center">
        <p className="font-display text-xl font-semibold text-menta-texto">
          Todo esto, por US$ 114 — todo incluido
        </p>
        <Link
          to="/#tours"
          className="mt-5 inline-flex rounded-full bg-coral px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
        >
          Reservar mi tour
        </Link>
      </div>
    </section>
  )
}
