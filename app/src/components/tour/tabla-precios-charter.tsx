import { Fragment, useState } from 'react'
import { ChevronDown, Rotate3d, Users } from 'lucide-react'
import type { FichaTour, SubVarianteTour, TramoPrecio } from '@/data/tours'
import { formatoDinero } from '@/data/home'
import { BLOQUE_FICHA } from '@/components/tour/bloque-ficha'
import { TituloSeccion } from '@/components/tour/titulo-seccion'
import { aforoDe, precioDeTramo, precioDesde, tramoDe } from '@/lib/tarifas'
import { Visor360 } from '@/components/flota/visor-360'
import {
  TarifarioOpcionA,
  TarifarioOpcionB,
  TarifarioOpcionBMas,
  TarifarioOpcionC,
  TarifarioOpcionCMas,
} from '@/components/tour/tarifario-opciones'

// Tabla de precios por barco (v3 2026-07-17, pedido de Samuel: «no agregaste
// la información de cada barco a la izquierda, la tabla con la información de
// precios»). Un bloque con el tarifario de cada sub-variante — los precios
// vienen verbatim del JSON-LD de la web del cliente.
//
// [v2 2026-07-28] REDISEÑO. Samuel: «se ve sosa, aburrida y poco relevante».
// Se le puso foto y «desde» a cada barco, el tramo que aplica se resalta con
// su total (antes el texto lo prometía y no lo hacía), y cada tramo estrena
// una barra sobre el eje del aforo.
//
// [v2 2026-07-28, 2ª vuelta] JERARQUÍA INTERNA. Samuel: «están bien, pero
// siento que pueden tener mejor jerarquía interna para que se entienda todo
// mejor: los tramos, el precio desde, etc.». Lo que fallaba, en orden de
// gravedad:
//
//  1) EL MODELO DE PRECIO NO SE EXPLICABA EN NINGUNA PARTE. Que un tramo sea
//     «de grupo» o «por persona» es LA diferencia que hay que entender, y se
//     contaba con dos palabras grises de 12px bajo la cifra. Peor: el matiz
//     que de verdad sorprende —cuando se pasa a un tramo por persona se cobra
//     por TODAS, no solo por las que exceden el tramo anterior— no se decía en
//     ningún sitio (vive en lib/tarifas.ts y en el aviso de salto del widget).
//     → Ahora el modelo se explica UNA vez arriba, con las dos etiquetas de
//       color que luego se repiten en cada tramo, y cada tramo por persona
//       enseña su total mínimo hecho («19 pers. = US$ 2.090»), que es la
//       cuenta que el visitante estaba intentando hacer de cabeza.
//  2) EL COLOR NO SIGNIFICABA NADA. Las barras se pintaban todas del mismo
//     gris azulado y solo cambiaban en la fila resaltada, así que el color
//     decía «estás aquí» y nada más. → El color pasa a significar TIPO DE
//     TARIFA (navy = barco entero, aqua = por persona) en la barra y en la
//     etiqueta. En el Forever Teresa, que alterna cerrado/persona/cerrado/
//     persona, esa alternancia por fin se VE.
//  3) TODO PESABA IGUAL. El nombre del barco a 32px competía con el «desde»,
//     y el «desde» aparecía suelto, sin decir a qué corresponde — y en el
//     tramo resaltado el mismo número salía hasta tres veces (precio, «en
//     total» y cabecera). → El nombre baja a 18px y el «desde» sube a 20px con
//     una línea que dice QUÉ es ese precio («el barco entero, hasta 18
//     personas»); y el total solo se imprime cuando NO coincide con el precio
//     del tramo, o sea en los tramos por persona, que es donde hace falta.
//
// ⚠️ EL ORDEN DE LOS TRAMOS NO SE TOCA: es ascendente por nº de personas, y
// esa es la única forma honesta de leerlos. Se evaluó agruparlos en dos
// bloques («precio cerrado» / «por persona»), que para el charter de 2 tramos
// habría quedado muy claro — pero el Forever Teresa tiene CUATRO tramos que
// alternan de tipo, así que agrupar por tipo lo reordenaría y el eje de
// personas —lo único que el visitante conoce de su propio grupo— dejaría de
// leerse de arriba abajo.
//
// La comparte Isla Saona (también tiene subVariantes), así que todo lo que
// pueda faltar —fotos, duración— se pinta condicionalmente.

/** Etiqueta del tramo en el eje de personas. `hasta: null` = sin tope.
 *  Un tramo de una sola persona («7–7») se dice «7 personas»: Saona tiene
 *  cuatro escalones de uno en uno y repetir el número los hacía ilegibles. */
function rangoTramo(t: TramoPrecio): string {
  if (t.hasta === null) return `${t.desde}+ guests`
  if (t.hasta === t.desde) return `${t.desde} guests`
  return `${t.desde}–${t.hasta} guests`
}

/** Qué hay detrás del «desde US$ X» de la cabecera. Sin esta línea el número
 *  es un precio suelto: no se sabe si es por persona, por barco o por hora. */
function explicaDesde(tabla: TramoPrecio[]): string | null {
  const desde = precioDesde(tabla)
  const tramo = tabla.find((t) => precioDeTramo(t, t.desde) === desde)
  if (!tramo) return null
  return tramo.tipo === 'grupo'
    ? tramo.hasta === null
      ? 'the whole boat'
      : `the whole boat, up to ${tramo.hasta} guests`
    : `${tramo.desde} guests × ${formatoDinero(tramo.precio)}`
}

/** Etiqueta de color del tipo de tarifa. El mismo par se pinta en la leyenda
 *  de arriba y en cada tramo — es lo que hace que la leyenda sirva de algo. */
function EtiquetaTipo({ tipo, className = '' }: { tipo: TramoPrecio['tipo']; className?: string }) {
  const esGrupo = tipo === 'grupo'
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium ${
        esGrupo ? 'text-navy-sub' : 'text-aqua-dark'
      } ${className}`}
    >
      <span
        aria-hidden="true"
        className={`size-2 shrink-0 rounded-full ${esGrupo ? 'bg-navy/55' : 'bg-aqua-dark'}`}
      />
      {/* Corto a propósito: la frase entera («precio cerrado POR EL BARCO») la
          enseña la leyenda de arriba una vez, y aquí se repite en cada tramo
          de cada barco — hasta 6 veces en Saona. Con el punto de color, dos
          palabras bastan para reconocerla. */}
      {esGrupo ? 'flat rate' : 'per person'}
    </span>
  )
}

export function TablaPreciosCharter({
  ficha,
  activa,
  personas,
}: {
  ficha: FichaTour
  activa: string | null
  /** Personas elegidas en el widget. Resalta el tramo que aplica y muestra su
   *  total. `null` mientras el widget no haya reportado (SSR / primer paint). */
  personas?: number | null
}) {
  if (!ficha.subVariantes || ficha.subVariantes.length === 0) return null

  // La card que se duplica para comparar propuestas. `?? null` y no un índice:
  // si mañana Maite cambia de id o de orden, el bloque de comparación
  // desaparece solo en vez de enseñar el barco equivocado.
  const maite = ficha.subVariantes.find((s) => s.id === 'maite') ?? null

  // ¿Algún barco cobra por persona? Si no, la mitad de la explicación sobra.
  const hayPorPersona = ficha.subVariantes.some((s) => s.tabla.some((t) => t.tipo === 'persona'))

  return (
    <section id="ancla-precios" className={`${BLOQUE_FICHA} scroll-mt-sticky-top`}>
      <TituloSeccion>Price list by boat</TituloSeccion>

      {/* CÓMO SE LEE ESTA TABLA, una vez y arriba. Antes esto no estaba en
          ninguna parte y cada fila tenía que explicarse sola con dos palabras
          en gris. */}
      <p className="mt-3 max-w-2xl text-sm text-navy-sub">
        The price depends on the boat and how many of you are sailing. Each boat has its own
        tiers:
      </p>
      <ul className="mt-2 flex flex-col gap-1.5 text-sm text-navy-sub">
        <li className="flex items-start gap-2">
          <span
            aria-hidden="true"
            className="mt-1.5 size-2 shrink-0 rounded-full bg-navy/55"
          />
          <span>
            <strong className="font-semibold text-navy">Flat rate for the whole boat:</strong> you
            pay the same whether the group is full or half empty.
          </span>
        </li>
        {hayPorPersona ? (
          <li className="flex items-start gap-2">
            <span aria-hidden="true" className="mt-1.5 size-2 shrink-0 rounded-full bg-aqua-dark" />
            <span>
              <strong className="font-semibold text-navy">Per person:</strong> charged for{' '}
              <strong className="font-semibold text-navy">every</strong> guest, not just the ones
              above the previous tier.
            </span>
          </li>
        ) : null}
      </ul>

      {personas ? (
        <p className="mt-3 text-sm text-navy-sub">
          Showing the tier for{' '}
          <strong className="font-semibold text-navy">
            {personas === 1 ? '1 guest' : `${personas} guests`}
          </strong>{' '}
          — change the number in the booking widget and this follows you.
        </p>
      ) : null}

      <div className="mt-5 flex flex-col gap-4">
        {ficha.subVariantes.map((s) => (
          <CardBarco key={s.id} s={s} activa={activa} personas={personas} />
        ))}
      </div>

      {/* ⚠️ BLOQUE TEMPORAL DE COMPARACION (2026-08-06, pedido de Samuel).
          «El cliente es un señor mayor y al menos la version anterior lo
          confundio muchisimo»: se piden 3 propuestas de diseño y estructura
          para el tarifario, duplicando la card de Maite —y solo en el charter—
          para poder verlas una debajo de otra sin perder las 5 actuales.
          Cuando elija una, este bloque entero y tarifario-opciones.tsx
          desaparecen y la ganadora sustituye a CardBarco. */}
      {maite ? (
        <div className="mt-8 flex flex-col gap-4 border-t border-linea pt-8">
          <p className="text-sm text-navy-soft">
            Tres propuestas para este mismo tarifario — la misma tarifa de Maite contada de tres
            maneras. Elige una y se aplica a los cinco barcos.
          </p>
          <TarifarioOpcionA s={maite} personas={personas} />
          <TarifarioOpcionB s={maite} personas={personas} />
          <TarifarioOpcionC s={maite} personas={personas} />
          {/* [2026-08-06] La prueba que pidió Samuel sobre la recomendación:
              la estructura de B con el injerto de C (el total del grupo en
              grande + la frontera dicha en voz alta). */}
          <TarifarioOpcionBMas s={maite} personas={personas} />
          <TarifarioOpcionCMas s={maite} personas={personas} />
        </div>
      ) : null}

      <p className="mt-4 text-xs text-navy-soft">
        * Premium lobster is an optional add-on at checkout (US$ 30 per person). * Prices may vary
        with season and availability — confirm with the team when you book.
      </p>
    </section>
  )
}

// [v3 2026-08-06, PowerPoint slides 76 + 78 + reunión 07-31 22:15–23:12] LA
// CARD DE UN BARCO, con el tarifario PLEGADO.
//
// El cliente sobre las dos tablas (Saona y charter): «agregar foto, mejorar
// diseño en general», «agregar foto ampliada… potenciando más las imágenes».
// En la reunión fue más directo: «no le gustó… es mucho texto», «las tablas
// son raras». La salida la propuso Samuel y Miguel la aceptó: **enseñar solo
// el tramo en el que estás** — «que no te muestre todo de una vez sino que te
// vaya mostrando en lo que estás… de 1 a 6 tanto, de 7 en adelante tanto».
//
// Así que la tabla no desaparece, se PLIEGA:
//   · En reposo se ve UN tramo: el que aplica al número de personas del widget
//     si este es el barco elegido, y si no el de entrada (el del «desde»), que
//     es el que sostiene la cifra de la cabecera.
//   · «See all tiers» despliega la tabla entera, tal cual estaba — con sus
//     barras comparables y su leyenda. Quien quiere la letra pequeña la tiene
//     a un clic; quien no, ve un precio y una foto.
//
// Y la FOTO crece (de 80×56 a 144×96 en desktop): era una miniatura de fichero
// al lado de una tabla, y el cliente pide justo lo contrario.
//
// ⚠️ SIN BOTÓN «Ver en 360º» aquí, aunque el slide 78 lo pida: los 360 del
// sitio son material de ejemplo (ver el bloque «El 360º» en data/flota.ts) y
// en /flota se pintan con una etiqueta ENCIMA del reproductor que lo deja
// claro. Un botón de 360 en la zona de decisión de compra, abriendo un vídeo
// que no es de ese barco, es otra cosa. Vuelve en cuanto lleguen los archivos
// reales: el gancho es el mismo que ya usa flota/barco-card.tsx.
function CardBarco({
  s,
  activa,
  personas,
}: {
  s: SubVarianteTour
  activa: string | null
  personas?: number | null
}) {
  const [abierta, setAbierta] = useState(false)
  const [visor360, setVisor360] = useState(false)
  const esActivo = s.id === activa
  const aforo = aforoDe(s.tabla)
  const desde = s.tabla.length > 0 ? precioDesde(s.tabla) : null
  const detalleDesde = s.tabla.length > 0 ? explicaDesde(s.tabla) : null
  // El tramo que aplica SOLO se marca en el barco seleccionado: en los
  // demás, resaltar una fila sugeriría que ese es «tu» precio en un
  // barco que no has elegido.
  const tramoAplica = esActivo && personas ? tramoDe(s.tabla, personas) : null
  // El que se ve plegado: el tuyo si lo hay, y si no el de entrada — el mismo
  // que explica el «desde» de la cabecera, para que las dos cifras cuadren.
  const tramoEntrada =
    s.tabla.length > 0
      ? s.tabla.reduce((a, b) => (precioDeTramo(b, b.desde) < precioDeTramo(a, a.desde) ? b : a))
      : null
  const tramoVisible = tramoAplica ?? tramoEntrada
  const ocultos = Math.max(0, s.tabla.length - 1)

  return (
    <div
      className={`overflow-hidden rounded-card-grande transition-all ${
        esActivo ? 'bg-aqua-tint/40 ring-2 ring-aqua-dark' : 'bg-fondo-ficha ring-1 ring-linea'
      }`}
    >
              {/* CABECERA DEL BARCO: identidad a la izquierda, precio de
                  entrada a la derecha. El nombre a 18px y el «desde» a 20px —
                  esto es una tabla de PRECIOS y se recorre comparando cifras
                  entre barcos; con el nombre a 32px el ojo tropezaba con la
                  etiqueta antes que con el número. */}
              {/* En móvil la cabecera se APILA (foto+identidad arriba, precio
                  debajo): en una sola fila a 390px el bloque del «desde» —que
                  ahora lleva su línea de explicación— estrujaba el nombre a un
                  canal de 4 líneas y se salía de la card. */}
              <div className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:gap-4 sm:p-5">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  {/* [v3 2026-08-06, slide 78: «agregar foto ampliada y video
                      360»] La foto crece y estrena su boton de 360º, encima y
                      a la derecha — el mismo sitio y el mismo estilo que en la
                      card de /flota, para que sea el MISMO gesto en las dos
                      pantallas.
                      ⚠️ El recorrido que abre es el vídeo de ejemplo que
                      comparten los 6 barcos (data/flota.ts §2): Samuel pidió
                      pintar el botón igualmente para maquetar, y el visor lo
                      dice en pantalla con una etiqueta ENCIMA del reproductor
                      —«Recorrido de ejemplo»—, no en una nota al pie. En
                      cuanto lleguen los 360 reales se cambia el `src` y ya.
                      Sin foto no hay boton: el visor necesita un poster y las
                      variantes de Saona no traen imagen propia. */}
                  {s.foto ? (
                    <span className="relative shrink-0">
                      <img
                        src={`/fotos/${s.foto}.webp`}
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                        className="h-20 w-28 rounded-card object-cover sm:h-24 sm:w-36"
                      />
                      <button
                        type="button"
                        onClick={() => setVisor360(true)}
                        className="absolute right-1.5 top-1.5 inline-flex items-center gap-1 rounded-chip bg-papel/90 px-2 py-1 text-[11px] font-semibold text-navy shadow-sm backdrop-blur-sm transition hover:bg-papel"
                      >
                        <Rotate3d className="size-3.5" aria-hidden="true" />
                        360º
                        <span className="sr-only"> — view {s.nombre} in 360 degrees</span>
                      </button>
                    </span>
                  ) : null}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <h3 className="font-display text-lg font-semibold text-navy">{s.nombre}</h3>
                      {esActivo ? (
                        <span className="rounded-full bg-aqua-dark px-2 py-0.5 text-xs font-semibold text-white">
                          Selected
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-0.5 text-xs text-navy-soft">
                      {s.duracion ? `${s.duracion} · ` : ''}
                      {s.capacidad}
                    </p>
                  </div>
                </div>
                {desde !== null ? (
                  <div className="shrink-0 sm:text-right">
                    {/* En móvil, «desde» y la cifra van en la misma línea:
                        apiladas gastaban tres líneas para tres datos cortos. */}
                    <span className="flex items-baseline gap-1.5 sm:block">
                      <span className="text-eyebrow uppercase tracking-wide text-navy-soft">
                        from
                      </span>
                      <span className="block font-display text-xl font-semibold text-navy">
                        {formatoDinero(desde)}
                      </span>
                    </span>
                    {/* La línea que faltaba: un «desde US$ 1.600» a secas no
                        dice si es por persona, por barco o por hora. */}
                    {detalleDesde ? (
                      <span className="block text-[11px] leading-tight text-navy-soft">
                        {detalleDesde}
                      </span>
                    ) : null}
                  </div>
                ) : null}
              </div>

              {/* `table-fixed` + colgroup (2026-07-28, 2º reporte de Samuel:
                  «tienen anchos diferentes entre progress bar de las tablas»).
                  Con el auto-layout del navegador, el ancho de la columna
                  izquierda lo decidía el CONTENIDO de la derecha —y ese
                  contenido cambia por barco: los que llevan píldora de comida
                  opcional o una línea «14 pers. = US$ 1.386» empujan distinto—,
                  así que las barras medían 532 / 390 / 532 / 392 / 528 px en
                  las cinco cards. Medido en el navegador. Con reparto fijo
                  60/40 las cinco tablas tienen la misma geometría, que es lo
                  que hace que las barras se puedan comparar de un barco a
                  otro y no solo dentro de uno. */}
              <table className="w-full table-fixed border-t border-linea text-sm">
                <caption className="sr-only">{s.nombre} rates by number of guests</caption>
                {/* En móvil la columna de precio necesita más sitio: ahí caben
                    «US$ 110» + su unidad + la línea «14 pers. = US$ 1.386», y
                    con 40% se salían de la card (medido: 115px de texto en 97
                    de hueco, recortado por el overflow del contenedor). */}
                <colgroup>
                  <col className="w-[54%] sm:w-3/5" />
                  <col className="w-[46%] sm:w-2/5" />
                </colgroup>
                <thead className="sr-only">
                  <tr>
                    <th scope="col">Guests and rate type</th>
                    <th scope="col">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {s.tabla.map((tr, i) => {
                    // Plegado: solo se pinta el tramo visible. La tabla no se
                    // reconstruye al desplegar — son las mismas filas, con las
                    // mismas barras sobre el mismo eje 1→aforo.
                    if (!abierta && tr !== tramoVisible) return null
                    const aplica = tr === tramoAplica
                    // La etiqueta de tipo se imprime solo cuando CAMBIA
                    // respecto al tramo anterior. En Saona los cinco primeros
                    // escalones son de precio cerrado y repetir la etiqueta
                    // cinco veces la convertía en ruido; así los escalones se
                    // leen como un bloque y la palabra aparece justo donde
                    // pasa algo. En el Forever Teresa, que alterna en cada
                    // tramo, se imprime en todos — que es cuando hace falta.
                    // El color de la barra sigue marcando el tipo fila a fila,
                    // y los lectores de pantalla lo reciben siempre (sr-only).
                    const cambiaTipo = !abierta || i === 0 || s.tabla[i - 1].tipo !== tr.tipo
                    // Porción del aforo que cubre este tramo. Todos los tramos
                    // del barco se dibujan sobre el mismo eje 1→aforo, así que
                    // las barras son comparables ENTRE SÍ dentro de la card.
                    const hasta = tr.hasta ?? aforo
                    const ancho = Math.max(4, Math.round(((hasta - tr.desde + 1) / aforo) * 100))
                    const inicio = Math.round(((tr.desde - 1) / aforo) * 100)
                    // En un tramo de grupo el precio YA es el total: repetirlo
                    // debajo con un «en total» era decir dos veces lo mismo. En
                    // uno por persona son dos cifras distintas y la que importa
                    // —la que se paga— es justo la que no está en grande.
                    const esPorPersona = tr.tipo === 'persona'
                    const totalTuGrupo = aplica && personas ? precioDeTramo(tr, personas) : null
                    return (
                      <Fragment key={`${tr.desde}-${tr.hasta ?? 'max'}`}>
                      <tr className={aplica ? 'bg-papel' : ''}>
                        <td className="pl-4 pr-2 pt-3 align-top sm:pl-5">
                          <span className="flex flex-wrap items-center gap-2">
                            <span
                              className={`font-medium ${aplica ? 'text-navy' : 'text-navy-sub'}`}
                            >
                              {rangoTramo(tr)}
                            </span>
                            {aplica ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-aqua-dark px-2 py-0.5 text-xs font-semibold text-white">
                                <Users className="size-3" aria-hidden="true" />
                                Your group
                              </span>
                            ) : null}
                          </span>

                          {/* El tipo de tarifa, con su punto de color. Es la
                              misma etiqueta que la leyenda de arriba: la
                              leyenda se aprende una vez y aquí solo hay que
                              reconocer el color. */}
                          {cambiaTipo ? (
                            <EtiquetaTipo tipo={tr.tipo} className="mt-1" />
                          ) : (
                            <span className="sr-only">
                              {tr.tipo === 'grupo' ? 'flat rate for the whole boat' : 'per person'}
                            </span>
                          )}

                          {/* El extra del tramo. Va como PÍLDORA y no como
                              línea suelta con un «+» delante (2026-07-28): es
                              una comida OPCIONAL —decisión de Samuel del 07-27,
                              ver el comentario del tarifario en data/tours.ts—
                              y colgada del precio con un signo de más se leía
                              como un recargo obligatorio. Una píldora aparte
                              dice «esto es algo que puedes añadir». */}
                          {tr.extra ? (
                            <span className="mt-2 inline-flex rounded-full bg-aqua-tint px-2 py-0.5 text-xs text-aqua-dark">
                              {tr.extra}
                            </span>
                          ) : null}
                        </td>
                        <td className="pl-2 pr-4 pt-3 text-right align-top sm:pr-5">
                          {/* `whitespace-nowrap` solo en la CIFRA (que nunca
                              debe partirse por el «US$»), no en toda la celda:
                              con la celda entera en nowrap, la línea de la
                              cuenta hecha se salía de la card en móvil en vez
                              de pasar a dos líneas. */}
                          <span
                            className={`block whitespace-nowrap font-display text-base font-semibold ${
                              aplica ? 'text-aqua-dark' : 'text-navy'
                            }`}
                          >
                            {formatoDinero(tr.precio)}
                            {/* La unidad baja a su propia línea en móvil: ahí
                                «US$ 110 /persona» no cabe en la columna a
                                ninguna anchura razonable, y partido queda peor
                                que apilado. Con sitio, va pegada a la cifra. */}
                            {esPorPersona ? (
                              <span className="block text-xs font-normal text-navy-soft sm:ml-0.5 sm:inline">
                                <span className="sm:hidden">per person</span>
                                <span className="hidden sm:inline">/guest</span>
                              </span>
                            ) : null}
                          </span>

                          {/* LA CUENTA HECHA. En los tramos por persona el
                              número grande NO es lo que se paga, así que
                              debajo va siempre un total real: el del grupo del
                              visitante si este es su tramo, y si no el mínimo
                              del tramo — que además explica solo el salto
                              respecto al tramo anterior. */}
                          {esPorPersona ? (
                            totalTuGrupo !== null ? (
                              <span className="mt-1 block text-xs font-semibold text-navy">
                                {formatoDinero(totalTuGrupo)} total
                              </span>
                            ) : (
                              <span className="mt-1 block text-xs text-navy-soft">
                                {tr.desde} guests = {formatoDinero(precioDeTramo(tr, tr.desde))}
                              </span>
                            )
                          ) : null}
                        </td>
                      </tr>

                      {/* LA BARRA, EN SU PROPIA FILA A ANCHO COMPLETO (Samuel,
                          2026-07-28, 2º reporte: «sigo viendo que no abarcan
                          todo»). Dentro de la celda izquierda solo podía llegar
                          hasta donde empieza la columna del precio — el 60% de
                          la card — y como el eje representa el AFORO ENTERO del
                          barco, terminar a media card contradice lo que dibuja.
                          En fila propia con `colSpan` ocupa el ancho completo de
                          la tabla, igual en los cinco barcos.
                          `aria-hidden` en toda la fila: es la MISMA información
                          que el rango de personas de arriba, dibujada. A un
                          lector de pantalla no le aporta nada y le costaría una
                          fila vacía por tramo. El borde inferior de la pareja
                          (fila de datos + fila de barra) vive aquí, que es donde
                          termina el tramo. */}
                      <tr
                        aria-hidden="true"
                        className={`border-b border-linea/60 last:border-b-0 ${
                          aplica ? 'bg-papel' : ''
                        }`}
                      >
                        <td colSpan={2} className="px-4 pb-3 pt-2 sm:px-5">
                          {/* Coloreada POR TIPO (navy = barco entero, aqua =
                              por persona) en vez de todas iguales: así se ve de
                              un vistazo qué porción del barco se paga de cada
                              manera — y en el Forever Teresa, que alterna
                              cuatro veces, se ve la alternancia sin leer una
                              cifra. Sobre pista `linea`: en la 1ª vuelta era
                              `linea-fuerte` sobre `linea` —dos grises casi
                              iguales— y a 6px de alto no se leía como barra
                              sino como un subrayado roto. */}
                          <span className="block h-2 w-full overflow-hidden rounded-full bg-linea">
                            <span
                              className={`block h-full rounded-full ${
                                esPorPersona ? 'bg-aqua-dark' : 'bg-navy/55'
                              } ${aplica ? '' : 'opacity-70'}`}
                              style={{ marginLeft: `${inicio}%`, width: `${ancho}%` }}
                            />
                          </span>
                        </td>
                      </tr>
                      </Fragment>
                    )
                  })}
        </tbody>
      </table>

      {/* El pie que pliega. Solo si hay algo que esconder — con un tramo unico
          (ningun barco hoy, pero el dato manda) un boton que no abre nada. */}
      {ocultos > 0 ? (
        <button
          type="button"
          onClick={() => setAbierta((v) => !v)}
          aria-expanded={abierta}
          className="flex w-full items-center justify-center gap-1.5 border-t border-linea px-4 py-3 text-sm font-semibold text-aqua-dark transition-colors hover:bg-papel/60 sm:px-5"
        >
          {abierta ? 'Hide the full rate table' : `See all ${s.tabla.length} tiers`}
          <ChevronDown
            className={`size-4 transition-transform ${abierta ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>
      ) : null}

      {visor360 && s.foto ? (
        <Visor360
          src="/video/hero.mp4"
          poster={`/fotos/${s.foto}.webp`}
          nombre={s.nombre}
          onCerrar={() => setVisor360(false)}
        />
      ) : null}
    </div>
  )
}
