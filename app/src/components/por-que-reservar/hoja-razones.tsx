import type { CSSProperties } from 'react'
import { Boton } from '@/components/ui/boton'
import { Etiqueta } from '@/components/ui/etiqueta'
import { formatoDinero } from '@/data/home'
import { RAZONES, TOTAL_RAZONES, PRECIO_TODO_INCLUIDO } from '@/data/por-que-reservar'
import { t, traducible } from '@/lib/i18n'

// Las 19 razones — slide 55.
//
// El cliente las quiere todas y todas van. Lo que no va es su formato: 19
// cards iguales con el mismo icono placeholder, que es un muro que nadie lee.
// La primera versión de esta página las agrupó en 5 cards temáticas, que era
// el mismo problema con cuatro cards menos.
//
// Aquí son UNA HOJA. Un solo papel (el mismo .boleto de la home: fondo,
// hairline, sombra de dos capas, troquel) con las 19 razones impresas en
// columnas, agrupadas por tema. Se lee como la lista de contenido de una
// caja: se escanea entera de un vistazo y no hay 19 recuadros compitiendo.
//
// Encima del papel, TRES FOTOS reales clavadas en los márgenes, cada una con
// su ángulo (.pqr-foto). Son las que impiden que la hoja se lea como un menú
// de restaurante: hay 19 afirmaciones y, al lado, tres pruebas.
// Sólo asoman en xl — por debajo no hay margen fuera del papel donde clavar
// nada sin tapar el texto, así que se esconden en vez de encogerse.
//
// La cuenta del total (TOTAL_RAZONES) se calcula: si mañana el cliente añade
// una razón, el titular no se queda diciendo 19.
const FOTOS = traducible([
  {
    foto: 'galeria-semi-privado-4-v2',
    alt: 'Guest snorkeling among sergeant major fish over the reef',
    rot: 'var(--pqr-foto-rot-1)',
    // Cada foto se cuelga de un borde distinto del papel para que no se lean
    // como una fila: arriba-izquierda, centro-derecha, abajo-izquierda.
    // `left-0`/`right-0` y NO valores negativos: el offset de un absolute se
    // mide contra la CAJA DE RELLENO del contenedor, así que con 0 la foto ya
    // caen dentro del pasillo que abre `xl:px-28` (y montan sobre el margen
    // del papel) — en negativo se salían del
    // ancho de contenido y el borde de la pantalla la cortaba.
    posicion: 'left-4 top-16 w-36',
  },
  {
    foto: 'galeria-semi-privado-6',
    alt: 'Group of guests in the water next to the Hispaniola catamaran',
    rot: 'var(--pqr-foto-rot-2)',
    posicion: 'right-4 top-1/3 w-36',
  },
  {
    foto: 'flota-forever-teresa',
    alt: 'The catamaran Forever Teresa from the Hispaniola fleet',
    rot: 'var(--pqr-foto-rot-3)',
    posicion: 'left-4 bottom-24 w-36',
  },
])

export function HojaRazones() {
  return (
    <section>
      <div className="max-w-2xl">
        <Etiqueta>{t('Everything booking with us includes')}</Etiqueta>
        <h2 className="mt-2 font-display text-h2 font-semibold text-navy">
          {TOTAL_RAZONES} {t('reasons, on one sheet')}
        </h2>
        <p className="mt-4 text-lead text-navy-sub">
          {t('It’s not marketing. It’s what every one of our guests lives. They’re all here, with no fine print.')}
        </p>
      </div>

      <div className="relative mt-10 xl:px-28">
        <article
          className="boleto relative z-10"
          style={{ ['--rot' as string]: 'var(--pqr-papel-rot-hoja)' } as CSSProperties}
        >
          <div className="boleto-superficie px-6 py-10 sm:px-12 sm:py-12">
            {/* Las 19 en columnas de imprenta: `columns` (no grid) para que
                los grupos fluyan y llenen el papel sin dejar huecos, con
                break-inside-avoid para que ningún grupo se parta a la mitad
                entre dos columnas. */}
            <div className="mx-auto max-w-4xl gap-x-12 sm:columns-2 lg:columns-3">
              {RAZONES.map((g) => (
                <div key={g.id} className="mb-8 break-inside-avoid last:mb-0">
                  <h3 className="text-eyebrow font-semibold uppercase tracking-[0.14em] text-aqua-dark">
                    {g.titulo}
                  </h3>
                  <ul className="mt-3 flex flex-col gap-2">
                    {g.razones.map((r) => (
                      <li key={r} className="flex gap-2.5 text-sm leading-snug text-navy-sub">
                        <span aria-hidden="true" className="font-semibold text-aqua-dark">
                          +
                        </span>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* El troquel remata la hoja: arriba lo que incluye, abajo lo que
                cuesta. Sin el corte real (que mide JS en el recibo) porque
                aquí el papel va a ancho completo y los semicírculos de los
                bordes se perderían — basta el filete punteado. */}
            <div aria-hidden className="boleto-perforacion -mx-6 mt-10 sm:-mx-12" />

            <div className="mt-8 flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
              <p className="font-display text-h3 font-semibold text-navy">
                {t('All of this, for')}{' '}{formatoDinero(PRECIO_TODO_INCLUIDO)}{t('. Everything included')}
              </p>
              <Boton to="/#tours" className="shrink-0">
                {t('Book my tour')}
              </Boton>
            </div>
          </div>
        </article>

        {/* Las fotos, por encima del papel y fuera de sus bordes. Van después
            en el DOM pero con z-20: el papel lleva z-10 porque su `rotate`
            crea contexto de apilamiento propio y, sin declararlo, el orden
            del DOM no bastaría. */}
        {FOTOS.map((f) => (
          <div
            key={f.foto}
            className={`pqr-foto absolute z-20 hidden xl:block ${f.posicion}`}
            style={{ ['--rot' as string]: f.rot } as CSSProperties}
          >
            <img
              src={`/fotos/${f.foto}.webp`}
              alt={f.alt}
              loading="lazy"
              className="aspect-[4/3] w-full rounded-foto object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  )
}
