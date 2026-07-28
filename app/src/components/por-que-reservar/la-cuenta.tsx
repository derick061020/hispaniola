import { Boton } from '@/components/ui/boton'
import { Etiqueta } from '@/components/ui/etiqueta'
import { formatoDinero } from '@/data/home'
import { CONCEPTOS_SUELTOS, PRECIO_TODO_INCLUIDO } from '@/data/por-que-reservar'

// «La cuenta» — slide 53 del PDF de correcciones v2, la mejor idea del
// PowerPoint del cliente: demostrar EN DINERO por qué reservar directo, en vez
// de repetir que hay que hacerlo.
//
// Su maqueta lo resuelve con una lista de precios estilo factura. Aquí la
// lista se convierte en SEIS FOTOS con su precio encima, y sólo después llega
// la aritmética: la factura desnuda pide leer 6 filas para entender qué se
// está comparando, mientras que las fotos lo cuentan antes de leer nada —
// esto es la parrilla, esto es el arrecife, esto es el coco loco. El
// argumento entero es «lo que recibes vale más de lo que pagas», así que lo
// que hay que enseñar es lo que recibes.
//
// Las dos barras del final son la comparación entera en un vistazo: la de
// arriba mide 190 y la de abajo 114, a escala real (la segunda es el 60% de la
// primera porque 114 es el 60% de 190). Es un gráfico, no una decoración —
// por eso las anchuras se CALCULAN y no se escriben.
//
// ⚠️ Los 6 importes son PRECIOS DE REFERENCIA DEL MERCADO, no facturas
// nuestras, y la letra pequeña lo dice. Si alguien audita el «almuerzo de
// mariscos US$ 50» y le parece generoso, el argumento se vuelve en contra: una
// cifra con su origen declarado es más creíble que una cifra desnuda.
export function LaCuenta() {
  const suelto = CONCEPTOS_SUELTOS.reduce((s, c) => s + c.importe, 0)
  const ahorro = suelto - PRECIO_TODO_INCLUIDO
  const proporcion = Math.round((PRECIO_TODO_INCLUIDO / suelto) * 100)

  return (
    <section>
      <div className="max-w-2xl">
        <Etiqueta>La diferencia</Etiqueta>
        <h2 className="mt-2 text-balance font-display text-h2 font-semibold text-navy">
          No somos los más baratos. Pero recibes{' '}
          <span className="text-coral">exactamente lo que pagas</span>.
        </h2>
        <p className="mt-4 text-lead text-navy-sub">
          Hay compañías que ofrecen tours parecidos, a veces más baratos. Sólo son parecidos por
          fuera. Esto es lo que entra en tu día en el mar, pieza por pieza — y lo que costaría
          contratar cada una por separado.
        </p>
      </div>

      {/* Las 6 piezas, con su precio de referencia encima. */}
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CONCEPTOS_SUELTOS.map((c) => (
          <li
            key={c.id}
            className="group relative aspect-[4/3] overflow-hidden rounded-card-grande bg-papel-hueso shadow-card"
          >
            <img
              src={`/fotos/${c.foto}.webp`}
              alt={c.fotoAlt}
              loading="lazy"
              className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Degradado al pie: el texto va sobre foto real, y sin él se
                queda ilegible en las tomas con agua clara o cielo. */}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-navy/85 via-navy/40 to-transparent"
            />
            <span className="absolute right-3 top-3 rounded-chip bg-papel/95 px-3 py-1 font-display text-sm font-semibold tabular-nums text-navy">
              {formatoDinero(c.importe)}
            </span>
            <span className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
              <span className="block font-display text-lg font-semibold text-white">{c.nombre}</span>
              <span className="mt-0.5 block text-sm text-white/75">{c.nota}</span>
            </span>
          </li>
        ))}
      </ul>

      {/* La aritmética, a escala. Las barras son decoración de un dato que ya
          está escrito al lado, así que van aria-hidden: un lector de pantalla
          lee las cifras, no dos rectángulos. */}
      <div className="mt-8 rounded-card-grande bg-papel-hueso p-6 ring-1 ring-linea sm:p-8">
        <div className="flex flex-col gap-6 sm:gap-7">
          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className="text-sm font-medium text-navy-sub">Contratándolo todo por separado</p>
              <p className="font-display text-xl font-semibold tabular-nums text-navy-soft line-through">
                {formatoDinero(suelto)}
              </p>
            </div>
            <div aria-hidden="true" className="mt-2 h-3 rounded-chip bg-linea-fuerte" />
          </div>

          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className="text-sm font-semibold text-navy">Con nosotros, todo incluido</p>
              <p className="font-display text-3xl font-semibold tabular-nums text-menta-texto">
                {formatoDinero(PRECIO_TODO_INCLUIDO)}
              </p>
            </div>
            <div aria-hidden="true" className="mt-2 h-3 rounded-chip bg-menta">
              <div
                className="h-full rounded-chip bg-menta-texto"
                style={{ width: `${proporcion}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-4 border-t border-linea pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-lg font-semibold text-navy">
            Reservando directo te ahorras {formatoDinero(ahorro)} — y no pagas nada aparte.
          </p>
          <Boton to="/#tours" className="shrink-0">
            Quiero este precio
          </Boton>
        </div>

        <p className="mt-5 text-xs leading-relaxed text-navy-soft">
          Los importes de la izquierda son precios de referencia de servicios equivalentes en la
          zona, para dar una idea de lo que cuesta cada pieza por separado. No son tarifas nuestras:
          nuestra tarifa es la de abajo, y lo incluye todo.
        </p>
      </div>
    </section>
  )
}
