import type { FichaTour } from '@/data/tours'
import { formatoDinero } from '@/data/home'
import { BLOQUE_FICHA } from '@/components/tour/bloque-ficha'
import { TituloSeccion } from '@/components/tour/titulo-seccion'

// Tabla de precios por bote del charter (v3 2026-07-17, pedido de
// Samuel: «no agregaste la información de cada barco a la izquierda, la
// tabla con la información de precios»). Un bloque en la ficha con la
// tabla de tramos de cada sub-variante (Maite, GrandMa, Santa Maria,
// Forever Teresa) — los precios vienen verbatim del JSON-LD de la web
// del cliente.
//
// Solo se pinta cuando la ficha tiene subVariantes + un campo que
// indique "tabla de precios pública" (futuro: si la ficha tiene
// `precioPublico: true`). Charter es el único caso actual.
//
// Layout: 1 fila por sub-variante, con nombre + capacidad + duración a
// la izquierda, y la tabla de tramos a la derecha. La fila del bote
// activo (el que el usuario eligió en el widget) se marca con un
// highlight (borde aqua + fondo aqua-tint sutil) — coherente con el
// feedback del SubVariantePicker.

export function TablaPreciosCharter({ ficha, activa }: { ficha: FichaTour; activa: string | null }) {
  if (!ficha.subVariantes || ficha.subVariantes.length === 0) return null

  return (
    <section id="ancla-precios" className={`${BLOQUE_FICHA} scroll-mt-sticky-top`}>
      <TituloSeccion>Tabla de precios por barco</TituloSeccion>
      <p className="mt-3 max-w-2xl text-sm text-navy-sub">
        El precio depende del barco y del número de personas. La tabla muestra el tramo que aplica según las personas que elijas en el widget.
      </p>

      <div className="mt-5 flex flex-col gap-4">
        {ficha.subVariantes.map((s) => {
          const esActivo = s.id === activa
          return (
            <div
              key={s.id}
              className={`rounded-card-grande bg-fondo-ficha p-4 transition-all sm:p-5 ${
                esActivo
                  ? 'ring-2 ring-aqua-dark'
                  : 'ring-1 ring-linea'
              }`}
            >
              {/* Cabecera del bote */}
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2 border-b border-linea pb-3">
                <div className="flex items-baseline gap-2">
                  <h3 className="font-display text-h3 font-semibold text-navy">{s.nombre}</h3>
                  {esActivo ? (
                    <span className="rounded-full bg-aqua-tint px-2 py-0.5 text-xs font-medium text-aqua-dark">
                      Seleccionado
                    </span>
                  ) : null}
                </div>
                <p className="text-xs text-navy-soft">
                  {s.duracion ? `${s.duracion} · ` : ''}
                  {s.capacidad}
                </p>
              </div>

              {/* Tabla de tramos de pax */}
              <div className="overflow-hidden rounded-card bg-papel ring-1 ring-linea">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-linea bg-papel-hueso/40">
                      <th className="px-3 py-2 text-left text-xs font-medium text-navy-sub">Personas</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-navy-sub">Precio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {s.tabla.map((tr, i) => (
                      <tr key={i} className="border-b border-linea/60 last:border-b-0">
                        <td className="px-3 py-2 text-navy">
                          {tr.desde}
                          {tr.hasta !== null ? `–${tr.hasta}` : '+'} pax
                        </td>
                        <td className="px-3 py-2 text-right">
                          <span className="font-semibold text-navy">
                            {tr.tipo === 'grupo' ? formatoDinero(tr.precio) : `${formatoDinero(tr.precio)}`}
                          </span>
                          <span className="ml-1 text-xs text-navy-soft">
                            {tr.tipo === 'grupo' ? 'grupo' : 'por persona'}
                          </span>
                          {tr.extra ? (
                            <p className="mt-0.5 text-xs text-aqua-dark">{tr.extra}</p>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
