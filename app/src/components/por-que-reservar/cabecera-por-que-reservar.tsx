import { Boton } from '@/components/ui/boton'
import { Etiqueta } from '@/components/ui/etiqueta'
import { SelloTripAdvisor } from '@/components/ui/sello-tripadvisor'
import { KPIS } from '@/data/por-que-reservar'

// Cabecera de /por-que-reservar — el contenido del hero compartido
// (internas/hero-interna.tsx). Slide 52 del PDF de correcciones v2.
//
// Los KPIs van DENTRO del hero, no en una banda aparte debajo: es lo que hace
// la maqueta del cliente y es lo correcto aquí — quien llega a esta página
// viene de pulsar «¿por qué reservar con nosotros?», así que la primera
// pantalla tiene que contestar con pruebas, no con una promesa más.
//
// El 3er KPI de su maqueta («#1 en TripAdvisor») se pinta con el SELLO real
// (ui/sello-tripadvisor.tsx) en vez de con una cifra de texto: el sello ya
// dice «#1 en TripAdvisor · 7 años seguidos» y trae la imagen del premio, así
// que una cifra escrita al lado sería decir lo mismo dos veces y con menos
// fuerza. Es además la pieza que Samuel pidió repetir «en todas» (2026-07-28).
//
// ⚠️ Las cifras salen de STATS (ver el comentario largo en
// data/por-que-reservar.ts): las MISMAS que la home, no las de la maqueta del
// cliente, que son 3,3× más grandes y vienen de una web que se contradice a
// sí misma.
export function CabeceraPorQueReservar() {
  return (
    // Dos columnas (Samuel, 2026-07-28: «pon el botón a la derecha, en una
    // columna derecha, para que esté separado visualmente»): el argumento a la
    // izquierda, la acción a la derecha, con un hairline entre las dos — el
    // mismo recurso que ya separa los KPIs, no una caja nueva. La columna de
    // la derecha es `auto`: mide lo que mide el botón, así el texto se queda
    // con todo el ancho sobrante en vez de repartir a medias.
    // En móvil no hay dos columnas (no caben): se apila y el botón vuelve a
    // ir debajo, a ancho de contenido.
    <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-12">
      <div>
        <Etiqueta sobreOscuro>Por qué reservar con nosotros</Etiqueta>

        <h1 className="mt-3 max-w-2xl text-balance font-display text-h2 font-semibold text-white">
          Reserva directo. Recibe más.
        </h1>

        <p className="mt-4 max-w-xl text-lead text-white/85">
          Somos el <strong className="font-semibold text-aqua-claro">propietario</strong>, no un
          intermediario. Eso significa mejor servicio y mejor precio — sin comisiones que se coman tu
          experiencia.
        </p>

      {/* Los KPIs + el sello en una sola fila, separados por hairlines: la
          maqueta del cliente los mete en 4 cajitas con fondo, que sobre el
          video del hero serían 4 parches. Aquí el peso lo pone la tipografía,
          igual que en la banda de impacto de /sostenibilidad. */}
        <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-6 sm:gap-x-10">
          {/* Rejilla fija de 3 y no flex-wrap: envolviendo, el 3er KPI caía
              solo en la línea de abajo arrastrando su divisoria izquierda,
              que sin nada a su izquierda se leía como una raya suelta. */}
          <div className="grid w-full grid-cols-3 gap-x-4 sm:w-auto sm:gap-x-8">
            {KPIS.map((k) => (
              <div key={k.label} className="border-l border-white/20 pl-4 first:border-l-0 first:pl-0">
                <p className="font-display text-2xl font-semibold leading-none text-white sm:text-3xl">
                  {k.valor}
                </p>
                <p className="mt-1.5 text-xs text-white/70">{k.label}</p>
              </div>
            ))}
          </div>
          <SelloTripAdvisor />
        </div>
      </div>

      {/* Columna derecha: la acción. La letra pequeña va DEBAJO del botón, no
          a su lado — al lado competía con él por la misma línea de lectura y
          hacía que el CTA pareciera llevar una coletilla. */}
      <div className="flex flex-col items-start gap-3 lg:border-l lg:border-white/20 lg:pl-12">
        <Boton to="/#tours" tamaño="lg">
          Reservar mi tour
        </Boton>
        <p className="max-w-[15rem] text-xs leading-relaxed text-white/70">
          Cancela gratis · Reserva ahora, paga después
        </p>
      </div>
    </div>
  )
}
