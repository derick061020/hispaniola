import { Check, Users } from 'lucide-react'
import { formatoDinero } from '@/data/home'
import { aforoDe, minimoDe, precioDeTramo, tramoDe } from '@/lib/tarifas'
import type { SubVarianteTour } from '@/data/tours'

// ═══════════════════════════════════════════════════════════════════════════
// TRES PROPUESTAS DE TARIFARIO — bloque TEMPORAL de comparación
// ═══════════════════════════════════════════════════════════════════════════
//
// Pedido de Samuel (2026-08-06): «los price list… ¿pudieses crearme 3 opciones
// nuevas de diseño y estructura, que sea sumamente fácil de entender? El
// cliente es un señor mayor y al menos la versión anterior lo confundió
// muchísimo». Y: «duplica la primera de Maite 3 veces solo en private charter,
// ponle a cada uno un diseño distinto y mantén las 5 que ya hay».
//
// ⚠️ ESTO SE BORRA. Son tres candidatas puestas una debajo de otra para
// elegir; cuando Samuel diga cuál, las otras dos y este archivo desaparecen y
// la ganadora sustituye a la card actual. Por eso llevan etiqueta visible: sin
// ella no hay forma de decir «me quedo con la B».
//
// EL DIAGNÓSTICO, que es lo que las tres intentan resolver. El tarifario de
// Maite no es difícil por la cifra, es difícil por el MODELO: hasta 8 personas
// se paga el barco (US$ 625 vayan 2 o vayan 8) y desde 9 se paga por cabeza
// (US$ 99 × TODAS, no solo por las que pasan de 8). Eso son dos reglas, una
// frontera y una excepción contraintuitiva —el precio SALTA hacia arriba al
// llegar a 9— y la versión actual las explica todas a la vez: leyenda de dos
// tipos de tarifa, tabla de tramos, barras proporcionales y una cuenta hecha
// al pie. Es correcta y es mucha.
//
// Las tres candidatas atacan el mismo problema por sitios distintos:
//   A. NO EXPLICAR EL MODELO. Enseñar solo TU precio, ya calculado.
//   B. EXPLICARLO COMO DOS ESCENARIOS, no como una tabla de tramos.
//   C. NO EXPLICARLO TAMPOCO, pero enseñar la lista completa de totales ya
//      resueltos, tamaño por tamaño. Cero aritmética para el lector.
//
// Ninguna inventa datos: las tres leen la MISMA `tabla` de tramos que la
// versión actual y calculan con `precioDeTramo()`, el mismo motor que cobra.

/** Cabecera común: foto grande + nombre + a quién le sirve el barco. Las tres
 *  propuestas la comparten para que lo que se compare sea la ESTRUCTURA del
 *  precio y no el encabezado. */
function CabeceraBarco({ s, etiqueta }: { s: SubVarianteTour; etiqueta: string }) {
  return (
    <div className="flex items-center gap-3">
      {s.foto ? (
        <img
          src={`/fotos/${s.foto}.webp`}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="h-20 w-28 shrink-0 rounded-card object-cover sm:h-24 sm:w-36"
        />
      ) : null}
      <div className="min-w-0">
        <span className="inline-flex rounded-chip bg-navy px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
          {etiqueta}
        </span>
        <h3 className="mt-1 font-display text-lg font-semibold text-navy">{s.nombre}</h3>
        <p className="text-xs text-navy-soft">
          {s.duracion ? `${s.duracion} · ` : ''}
          {s.capacidad}
        </p>
      </div>
    </div>
  )
}

const CAJA = 'rounded-card-grande bg-fondo-ficha p-4 ring-1 ring-linea sm:p-5'

// ── OPCIÓN A ───────────────────────────────────────────────────────────────
// «Tu precio, y nada más».
//
// La apuesta: un señor mayor no quiere entender el tarifario, quiere saber
// cuánto le cuesta. Así que la card enseña UNA cifra —la de su grupo, ya
// calculada— del tamaño de un titular, y debajo una sola frase que dice qué
// incluye. La regla del salto en 9 no se explica: se avisa en una línea al pie
// («si sois 9 o más, el precio pasa a US$ 99 por persona»), que es lo único
// que necesita saber alguien que todavía no ha decidido cuántos van.
//
// Riesgo conocido: sin la tabla no se puede comparar el barco con los otros
// cuatro de un vistazo. Es el precio de la simplicidad, y por eso es una
// candidata y no la respuesta.
export function TarifarioOpcionA({ s, personas }: { s: SubVarianteTour; personas?: number | null }) {
  const pax = personas ?? minimoDe(s.tabla)
  const tramo = tramoDe(s.tabla, pax)
  const total = tramo ? precioDeTramo(tramo, pax) : null
  // El otro tramo, el que todavía no le aplica — para la línea del pie.
  const otro = s.tabla.find((t) => t !== tramo)

  return (
    <div className={CAJA}>
      <CabeceraBarco s={s} etiqueta="Opción A · tu precio" />

      <div className="mt-5 rounded-card bg-papel p-5 text-center ring-1 ring-linea">
        <p className="text-sm text-navy-sub">
          For <strong className="font-semibold text-navy">{pax === 1 ? '1 guest' : `${pax} guests`}</strong>
        </p>
        {total !== null ? (
          <p className="mt-1 font-display text-5xl font-semibold leading-none text-navy">
            {formatoDinero(total)}
          </p>
        ) : null}
        <p className="mt-2 text-sm text-navy-sub">
          {tramo?.tipo === 'grupo'
            ? 'Total for the whole boat, however many of you come.'
            : `Total for your group (${formatoDinero(tramo?.precio ?? 0)} per guest).`}
        </p>
      </div>

      {otro ? (
        <p className="mt-3 text-center text-sm text-navy-soft">
          {otro.tipo === 'persona'
            ? `From ${otro.desde} guests the price becomes ${formatoDinero(otro.precio)} per guest.`
            : `Up to ${otro.hasta} guests it is ${formatoDinero(otro.precio)} for the whole boat.`}
        </p>
      ) : null}
    </div>
  )
}

// ── OPCIÓN B ───────────────────────────────────────────────────────────────
// «Dos escenarios, no una tabla».
//
// La apuesta: el modelo SÍ se explica, pero como dos situaciones de la vida
// real («si venís pocos» / «si venís muchos»), cada una en su caja, con su
// precio y con una cuenta ya hecha de ejemplo. Lo que se elimina no es la
// información sino el formato TABLA —filas, columnas, leyenda de colores y
// barras— que es lo que convierte un precio en un documento.
//
// Es la que mejor envejece si mañana hay tres tramos en vez de dos: se añade
// una tercera caja y sigue leyéndose igual.
export function TarifarioOpcionB({ s, personas }: { s: SubVarianteTour; personas?: number | null }) {
  const tramoAplica = personas ? tramoDe(s.tabla, personas) : null

  return (
    <div className={CAJA}>
      <CabeceraBarco s={s} etiqueta="Opción B · dos escenarios" />

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {s.tabla.map((t) => {
          const aplica = t === tramoAplica
          const hasta = t.hasta ?? aforoDe(s.tabla)
          // La cuenta hecha: en grupo el precio YA es el total; por persona se
          // enseña con el tamaño más pequeño del tramo, que es el que explica
          // el salto respecto al escenario anterior.
          const ejemplo = precioDeTramo(t, t.desde)
          return (
            <div
              key={`${t.desde}-${hasta}`}
              className={`rounded-card p-4 ${
                aplica ? 'bg-papel ring-2 ring-aqua-dark' : 'bg-papel ring-1 ring-linea'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="grid size-8 shrink-0 place-items-center rounded-full bg-aqua-tint text-aqua-dark"
                >
                  <Users className="size-4" />
                </span>
                <p className="font-display text-base font-semibold text-navy">
                  {t.desde === 1 ? `Up to ${hasta} guests` : `From ${t.desde} to ${hasta} guests`}
                </p>
              </div>

              <p className="mt-3 font-display text-3xl font-semibold leading-none text-navy">
                {formatoDinero(t.precio)}
                {t.tipo === 'persona' ? (
                  <span className="ml-1 text-sm font-normal text-navy-soft">per guest</span>
                ) : null}
              </p>
              <p className="mt-1 text-sm text-navy-sub">
                {t.tipo === 'grupo'
                  ? 'For the whole boat — the same price whether you are 2 or the full group.'
                  : `Charged for every guest. Example: ${t.desde} guests = ${formatoDinero(ejemplo)}.`}
              </p>

              {aplica ? (
                <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-aqua-dark px-2.5 py-1 text-xs font-semibold text-white">
                  <Check className="size-3.5" aria-hidden="true" />
                  This is your group
                </p>
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── OPCIÓN C ───────────────────────────────────────────────────────────────
// «La lista de la compra».
//
// La apuesta más radical: el visitante NO tiene que entender nada ni hacer
// ninguna cuenta. Se le da el total ya resuelto para cada tamaño de grupo —
// «12 personas → US$ 1.188»— y se acabó. Desaparecen las palabras «tramo»,
// «por persona» y «precio cerrado»: no hay dos tipos de tarifa que aprender,
// hay una columna de personas y una columna de dinero.
//
// Los tamaños consecutivos con el MISMO total se agrupan en una sola fila
// («1–8 personas → US$ 625»), que es justo lo que hace inteligible el tramo de
// grupo sin nombrarlo: se ve que el precio no cambia porque la fila lo dice.
//
// Riesgo conocido: crece con el aforo. En Maite son 8 filas; en el Forever
// Teresa (85 plazas) serían decenas y habría que plegarla o pasar a intervalos
// de 5 en 5. Si esta es la elegida, ese es el trabajo que queda.
export function TarifarioOpcionC({ s, personas }: { s: SubVarianteTour; personas?: number | null }) {
  const min = minimoDe(s.tabla)
  const max = aforoDe(s.tabla)

  // Se recorre el aforo entero calculando el total real de cada tamaño con el
  // mismo motor que cobra, y se colapsan los consecutivos que cuestan igual.
  const filas: { desde: number; hasta: number; total: number }[] = []
  for (let n = min; n <= max; n++) {
    const tramo = tramoDe(s.tabla, n)
    if (!tramo) continue
    const total = precioDeTramo(tramo, n)
    const ultima = filas[filas.length - 1]
    if (ultima && ultima.total === total && ultima.hasta === n - 1) ultima.hasta = n
    else filas.push({ desde: n, hasta: n, total })
  }

  return (
    <div className={CAJA}>
      <CabeceraBarco s={s} etiqueta="Opción C · precio ya calculado" />

      <p className="mt-4 text-sm text-navy-sub">
        Find your group size and read the total. No calculations, no extras.
      </p>

      <ul className="mt-3 overflow-hidden rounded-card ring-1 ring-linea">
        {filas.map((f) => {
          const aplica = personas != null && personas >= f.desde && personas <= f.hasta
          return (
            <li
              key={`${f.desde}-${f.hasta}`}
              className={`flex items-center justify-between gap-4 px-4 py-3 text-sm ${
                aplica ? 'bg-aqua-tint' : 'bg-papel'
              } border-b border-linea last:border-b-0`}
            >
              <span className={`font-medium ${aplica ? 'text-navy' : 'text-navy-sub'}`}>
                {f.desde === f.hasta ? `${f.desde} guests` : `${f.desde}–${f.hasta} guests`}
                {aplica ? (
                  <span className="ml-2 rounded-full bg-aqua-dark px-2 py-0.5 text-xs font-semibold text-white">
                    your group
                  </span>
                ) : null}
              </span>
              <span
                className={`whitespace-nowrap font-display text-base font-semibold ${
                  aplica ? 'text-aqua-dark' : 'text-navy'
                }`}
              >
                {formatoDinero(f.total)}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
