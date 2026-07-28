import { Check } from 'lucide-react'
import { Boton } from '@/components/ui/boton'
import { Etiqueta } from '@/components/ui/etiqueta'
import { formatoDinero } from '@/data/home'
import { RAZONES, TOTAL_RAZONES, PRECIO_TODO_INCLUIDO } from '@/data/por-que-reservar'

// «19 razones para elegirnos» — slide 55.
//
// El cliente pide 19 razones y van las 19: las quiere todas. Lo que no va es
// su formato — un muro de 19 cards idénticas, todas del mismo tamaño y con el
// mismo icono placeholder, que nadie lee. Aquí se agrupan en 5 bloques
// temáticos con foto real, y cada bloque dice PRIMERO su titular (el
// `resumen`) y después su lista: se puede entender la sección entera leyendo
// 5 líneas, o bajar al detalle si de verdad interesa.
//
// El razonamiento de fondo está en data/por-que-reservar.ts (precedente de
// «Diferenciadores» en la v3 y el principio «una prueba por trabajo»), y
// encaja con lo que el cliente dijo en la reunión (33:30): esta no es una
// página para retener, es una página de paso.
//
// La rejilla es un BENTO, no 5 cards iguales: los dos bloques más fuertes
// —la comida y el barco— ocupan media fila cada uno, y los tres de abajo van a
// un tercio. El bloque «el precio y la reserva» es el único SIN foto y va en
// navy: no tiene una foto que le corresponda (no se fotografía «hablar con el
// propietario») y, en vez de rellenarlo con una imagen de archivo que no dice
// nada, se convierte en el respiro oscuro de la rejilla.
const ANCHO: Record<string, string> = {
  comida: 'lg:col-span-3',
  barco: 'lg:col-span-3',
  ubicacion: 'lg:col-span-2',
  reserva: 'lg:col-span-2',
  // A 2 columnas (sm) son 5 cards impares: la última se estira a lo ancho en
  // vez de dejar media fila vacía a su derecha.
  personas: 'sm:col-span-2 lg:col-span-2',
}

export function Razones() {
  return (
    <section>
      <div className="max-w-2xl">
        <Etiqueta>Todo lo que incluye reservar con nosotros</Etiqueta>
        <h2 className="mt-2 font-display text-h2 font-semibold text-navy">
          {TOTAL_RAZONES} razones para elegirnos
        </h2>
        <p className="mt-4 text-lead text-navy-sub">
          No es marketing — es lo que vive cada uno de nuestros huéspedes. Van agrupadas en{' '}
          {RAZONES.length} bloques para que se puedan leer de un vistazo.
        </p>
      </div>

      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-6">
        {RAZONES.map((g) => {
          const oscuro = g.foto === undefined
          return (
            <li
              key={g.id}
              className={`flex flex-col overflow-hidden rounded-card-grande shadow-card ${ANCHO[g.id] ?? 'lg:col-span-2'} ${
                oscuro ? 'bg-navy' : 'bg-papel ring-1 ring-linea'
              }`}
            >
              {g.foto ? (
                <div className="relative h-48 shrink-0 overflow-hidden bg-papel-hueso">
                  <img
                    src={`/fotos/${g.foto}.webp`}
                    alt={g.fotoAlt}
                    loading="lazy"
                    className="size-full object-cover"
                  />
                  <span className="absolute left-4 top-4 rounded-chip bg-papel/95 px-3 py-1 text-xs font-semibold text-navy">
                    {g.razones.length} razones
                  </span>
                </div>
              ) : null}

              <div className="flex flex-1 flex-col p-6">
                {oscuro ? (
                  <span className="mb-4 w-fit rounded-chip bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                    {g.razones.length} razones
                  </span>
                ) : null}

                <h3
                  className={`font-display text-h3 font-semibold ${oscuro ? 'text-white' : 'text-navy'}`}
                >
                  {g.titulo}
                </h3>
                <p className={`mt-2 text-sm ${oscuro ? 'text-white/75' : 'text-navy-sub'}`}>
                  {g.resumen}
                </p>

                <ul
                  className={`mt-5 flex flex-col gap-2.5 border-t pt-5 ${
                    oscuro ? 'border-white/15' : 'border-linea'
                  }`}
                >
                  {g.razones.map((r) => (
                    <li key={r} className="flex items-start gap-2.5">
                      <Check
                        className={`mt-0.5 size-4 shrink-0 ${oscuro ? 'text-aqua-claro' : 'text-aqua-dark'}`}
                        strokeWidth={2.5}
                        aria-hidden="true"
                      />
                      <span
                        className={`text-sm leading-snug ${oscuro ? 'text-white/90' : 'text-navy-sub'}`}
                      >
                        {r}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          )
        })}
      </ul>

      {/* El cierre verde del slide 55 — la única banda de color grande de la
          página, y se la gana: es donde las 19 razones se convierten en un
          precio. */}
      <div className="mt-8 flex flex-col items-center gap-5 rounded-card-grande bg-menta px-6 py-10 text-center">
        <p className="text-balance font-display text-h3 font-semibold text-menta-texto">
          Todo esto, por {formatoDinero(PRECIO_TODO_INCLUIDO)} — todo incluido
        </p>
        <p className="max-w-md text-sm text-navy-sub">
          El mismo día que reservan miles de familias felices. Te toca a ti.
        </p>
        <Boton to="/#tours">Reservar mi tour</Boton>
      </div>
    </section>
  )
}
