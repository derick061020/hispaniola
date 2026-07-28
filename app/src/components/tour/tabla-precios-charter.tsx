import { Users } from 'lucide-react'
import type { FichaTour, TramoPrecio } from '@/data/tours'
import { formatoDinero } from '@/data/home'
import { BLOQUE_FICHA } from '@/components/tour/bloque-ficha'
import { TituloSeccion } from '@/components/tour/titulo-seccion'
import { aforoDe, precioDeTramo, precioDesde, tramoDe } from '@/lib/tarifas'

// Tabla de precios por barco (v3 2026-07-17, pedido de Samuel: «no agregaste
// la información de cada barco a la izquierda, la tabla con la información de
// precios»). Un bloque con el tarifario de cada sub-variante — los precios
// vienen verbatim del JSON-LD de la web del cliente.
//
// [v2 2026-07-28] REDISEÑO. Samuel: «se ve sosa, aburrida y poco relevante».
// Las tres palabras señalaban cosas distintas y las tres tenían arreglo:
//
//  · POCO RELEVANTE era literal, y además una PROMESA FALSA. El texto de
//    entrada llevaba desde julio diciendo «la tabla muestra el tramo que
//    aplica según las personas que elijas en el widget» — y no lo hacía: no
//    recibía las personas, así que los cinco tarifarios se pintaban idénticos
//    pusieras 2 o 40 pax. Ahora `personas` sube desde el widget (igual que
//    `variante` y `paquete` antes) y el tramo que aplica se resalta, con su
//    TOTAL ya calculado. Eso convierte la tabla en la explicación del precio
//    del widget en vez de en un anexo.
//  · SOSA: cinco cards grises con la misma cabecera «Personas | Precio»
//    repetida cinco veces se leían como una hoja de cálculo. Las cabeceras
//    pasan a `sr-only` (el `<table>` se mantiene —esto ES tabular, y los
//    lectores de pantalla la necesitan— pero deja de dibujarse), y en su
//    lugar cada barco estrena FOTO y su «desde US$ X».
//  · ABURRIDA: no había nada que mirar. Ahora cada tramo lleva una barra que
//    dibuja QUÉ PORCIÓN del aforo cubre, sobre el mismo eje 1→aforo para todos
//    los tramos del barco. Es lo que hace visible de un vistazo lo que el
//    tarifario esconde: que el precio de grupo cubre la primera franja y que a
//    partir de cierto punto se pasa a pagar por cabeza.
//
// La comparte Isla Saona (también tiene subVariantes), así que todo lo que
// pueda faltar —fotos, duración— se pinta condicionalmente.

/** Etiqueta del tramo en el eje de personas. `hasta: null` = sin tope. */
function rangoTramo(t: TramoPrecio): string {
  return t.hasta === null ? `${t.desde}+ personas` : `${t.desde}–${t.hasta} personas`
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

  return (
    <section id="ancla-precios" className={`${BLOQUE_FICHA} scroll-mt-sticky-top`}>
      <TituloSeccion>Tabla de precios por barco</TituloSeccion>
      <p className="mt-3 max-w-2xl text-sm text-navy-sub">
        El precio depende del barco y del número de personas.{' '}
        {personas ? (
          <>
            Está resaltado el tramo que aplica a{' '}
            <strong className="font-semibold text-navy">
              {personas === 1 ? '1 persona' : `${personas} personas`}
            </strong>{' '}
            — cambia el número en el widget y la tabla te sigue.
          </>
        ) : (
          <>Cada barco cobra por grupo hasta cierto tamaño y por persona a partir de ahí.</>
        )}
      </p>

      <div className="mt-5 flex flex-col gap-4">
        {ficha.subVariantes.map((s) => {
          const esActivo = s.id === activa
          const aforo = aforoDe(s.tabla)
          const desde = s.tabla.length > 0 ? precioDesde(s.tabla) : null
          // El tramo que aplica SOLO se marca en el barco seleccionado: en los
          // demás, resaltar una fila sugeriría que ese es «tu» precio en un
          // barco que no has elegido.
          const tramoAplica = esActivo && personas ? tramoDe(s.tabla, personas) : null

          return (
            <div
              key={s.id}
              className={`overflow-hidden rounded-card-grande transition-all ${
                esActivo ? 'bg-aqua-tint/40 ring-2 ring-aqua-dark' : 'bg-fondo-ficha ring-1 ring-linea'
              }`}
            >
              {/* CABECERA DEL BARCO: foto + nombre + meta a la izquierda, el
                  «desde» a la derecha. Es lo que antes no existía — la card
                  abría directamente con la fila «Personas | Precio». */}
              <div className="flex items-center gap-3 p-4 sm:gap-4 sm:p-5">
                {s.foto ? (
                  <img
                    src={`/fotos/${s.foto}.webp`}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className="h-14 w-20 shrink-0 rounded-card object-cover sm:h-16 sm:w-24"
                  />
                ) : null}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <h3 className="font-display text-h3 font-semibold text-navy">{s.nombre}</h3>
                    {esActivo ? (
                      <span className="rounded-full bg-aqua-dark px-2 py-0.5 text-xs font-semibold text-white">
                        Seleccionado
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-0.5 text-xs text-navy-soft">
                    {s.duracion ? `${s.duracion} · ` : ''}
                    {s.capacidad}
                  </p>
                </div>
                {desde !== null ? (
                  <div className="shrink-0 text-right">
                    <span className="block text-eyebrow uppercase tracking-wide text-navy-soft">
                      desde
                    </span>
                    <span className="block font-display text-lg font-semibold text-navy">
                      {formatoDinero(desde)}
                    </span>
                  </div>
                ) : null}
              </div>

              <table className="w-full border-t border-linea text-sm">
                <caption className="sr-only">Tarifas de {s.nombre} por número de personas</caption>
                <thead className="sr-only">
                  <tr>
                    <th scope="col">Personas</th>
                    <th scope="col">Precio</th>
                  </tr>
                </thead>
                <tbody>
                  {s.tabla.map((tr) => {
                    const aplica = tr === tramoAplica
                    // Porción del aforo que cubre este tramo. Todos los tramos
                    // del barco se dibujan sobre el mismo eje 1→aforo, así que
                    // las barras son comparables ENTRE SÍ dentro de la card.
                    const hasta = tr.hasta ?? aforo
                    const ancho = Math.max(4, Math.round(((hasta - tr.desde + 1) / aforo) * 100))
                    const inicio = Math.round(((tr.desde - 1) / aforo) * 100)
                    return (
                      <tr
                        key={`${tr.desde}-${tr.hasta ?? 'max'}`}
                        className={`border-b border-linea/60 last:border-b-0 ${
                          aplica ? 'bg-papel' : ''
                        }`}
                      >
                        <td className="py-3 pl-4 pr-2 align-top sm:pl-5">
                          <span className="flex flex-wrap items-center gap-2">
                            <span
                              className={`font-medium ${aplica ? 'text-navy' : 'text-navy-sub'}`}
                            >
                              {rangoTramo(tr)}
                            </span>
                            {aplica ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-aqua-dark px-2 py-0.5 text-xs font-semibold text-white">
                                <Users className="size-3" aria-hidden="true" />
                                Tu grupo
                              </span>
                            ) : null}
                          </span>
                          {/* La barra del tramo sobre el eje del aforo. Es la
                              pieza que hace que se ENTIENDA el tarifario sin
                              leer los números: se ve que la tarifa de grupo
                              cubre el arranque y que la de por persona se
                              lleva el resto del barco.
                              El segmento va en navy/40 (o aqua si es el que
                              aplica) sobre pista `linea`: en la 1ª vuelta era
                              `linea-fuerte` sobre `linea` —dos grises casi
                              iguales— y a 6 px de alto no se leía como una
                              barra, sino como un subrayado roto. */}
                          <span
                            aria-hidden="true"
                            className="mt-2 block h-2 w-full max-w-56 overflow-hidden rounded-full bg-linea"
                          >
                            <span
                              className={`block h-full rounded-full ${
                                aplica ? 'bg-aqua-dark' : 'bg-navy/40'
                              }`}
                              style={{ marginLeft: `${inicio}%`, width: `${ancho}%` }}
                            />
                          </span>
                          {tr.extra ? (
                            <span className="mt-1.5 block text-xs text-aqua-dark">{tr.extra}</span>
                          ) : null}
                        </td>
                        <td className="py-3 pl-2 pr-4 text-right align-top sm:pr-5">
                          <span
                            className={`block font-display text-base font-semibold ${
                              aplica ? 'text-aqua-dark' : 'text-navy'
                            }`}
                          >
                            {formatoDinero(tr.precio)}
                          </span>
                          <span className="block text-xs text-navy-soft">
                            {tr.tipo === 'grupo' ? 'precio de grupo' : 'por persona'}
                          </span>
                          {/* El TOTAL solo aparece en el tramo que aplica: es
                              la cifra que el visitante está intentando calcular
                              de cabeza mientras mira esta tabla. En los tramos
                              'persona' es donde más falta hace — ahí el número
                              grande no es lo que se paga. */}
                          {aplica && personas ? (
                            <span className="mt-1 block text-xs font-semibold text-navy">
                              {formatoDinero(precioDeTramo(tr, personas))} en total
                            </span>
                          ) : null}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )
        })}
      </div>

      <p className="mt-4 text-xs text-navy-soft">
        * Langosta premium: add-on opcional al check-out (US$ 30 por persona). * Los precios pueden variar según temporada y disponibilidad — confirma con el equipo al reservar.
      </p>
    </section>
  )
}
