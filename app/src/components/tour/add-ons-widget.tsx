import { Check } from 'lucide-react'
import { formatoDinero } from '@/data/home'
import { precioAddOn, type AddOn } from '@/lib/tarifas'

// Add-ons del widget de reserva (correcciones v2, 2026-07-27).
//
// Los extras del negocio se venden aquí como UPSELL: superficie de venta con
// peso visual, no letra pequeña. Decisión de Samuel del 07-27: «un check fácil
// de clickar y atractivo, piensa en él como un upsell».
//
// Cómo se cobran (TARIFARIO-WEB-ORIGINAL.md §4-C):
//  · base 'persona' → un solo check que multiplica por TODAS las personas de
//    la reserva (no se elige comensal a comensal). Es el caso de los tres que
//    quedan vivos: la langosta de Saona (US$ 30) y las dos comidas opcionales
//    del charter (US$ 20 en Maite, US$ 25 en Santa Maria).
//  · base 'grupo'   → precio fijo que no escala. Hoy no lo usa ninguno.
//
// [2026-09-01, Samuel] AQUÍ VIVÍA LA CONFIRMACIÓN AL DESMARCAR («¿Seguro? Estas
// fotos no se repiten»), la pareja del único add-on premarcado que tuvo el
// sitio: el álbum de fotos. Con el álbum retirado no queda ningún `porDefecto`,
// así que ese diálogo era inalcanzable — y encima estaba en español dentro de
// una UI en inglés. Se va entero, junto con la prop `mensajeAlDesmarcar` y el
// estado que lo gobernaba. El porqué del cambio, en lib/tarifas.ts.
//
// ⚠️ Si algún día vuelve un extra premarcado, que vuelva SIN esta fricción:
// poner un obstáculo para gastar menos, y ninguno para gastar más, es el patrón
// inverso al que este proyecto quiere — y el riesgo legal de la casilla
// premarcada (Directiva 2011/83/UE art. 22) sigue anotado en TARIFARIO §4-C.

export function AddOnsWidget({
  addOns,
  personas,
  elegidos,
  onCambiar,
}: {
  addOns: AddOn[]
  personas: number
  elegidos: string[]
  onCambiar: (ids: string[]) => void
}) {
  if (addOns.length === 0) return null

  function alternar(addOn: AddOn) {
    const activo = elegidos.includes(addOn.id)
    onCambiar(activo ? elegidos.filter((i) => i !== addOn.id) : [...elegidos, addOn.id])
  }

  return (
    <div className="flex flex-col gap-2">
      {addOns.map((a) => {
        const activo = elegidos.includes(a.id)
        const importe = precioAddOn(a, personas)

        return (
          <div
            key={a.id}
            className={`rounded-xl border transition ${
              activo ? 'border-aqua bg-aqua/5' : 'border-linea bg-papel'
            }`}
          >
            <button
              type="button"
              onClick={() => alternar(a)}
              aria-pressed={activo}
              className="flex w-full items-start gap-3 p-3 text-left"
            >
              <span
                aria-hidden="true"
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                  activo ? 'border-aqua bg-aqua text-white' : 'border-linea bg-papel'
                }`}
              >
                {activo ? <Check size={14} strokeWidth={3} /> : null}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-semibold text-navy">{a.etiqueta}</span>
                  <span className="shrink-0 text-sm font-semibold text-navy">
                    +{formatoDinero(importe)}
                  </span>
                </span>
                {a.descripcion ? (
                  <span className="mt-0.5 block text-xs leading-relaxed text-navy-sub">
                    {a.descripcion}
                  </span>
                ) : null}
                {/* [v2 2026-07-27, 2ª vuelta] El badge «Precio único para todo
                    el grupo» SE RETIRA (pedido de Samuel, para bajar alto): la
                    propia descripción ya termina con «…para todo el grupo», así
                    que era la misma frase dos veces en tres líneas.
                    En los add-ons POR PERSONA sí se queda: ahí no es una
                    repetición, es la cuenta (US$ 30 × 4) que explica de dónde
                    sale el importe de la derecha. */}
                {/* [2026-09-01] En inglés, como el resto de la UI. Estaba en
                    español y hasta hoy casi no se veía: el único add-on por
                    persona era la langosta, y solo en dos fichas. Con las
                    comidas opcionales del charter, esta línea es la que explica
                    de dónde sale el importe de la derecha. */}
                {a.base === 'persona' ? (
                  <span className="mt-1 block text-[11px] font-medium uppercase tracking-wide text-aqua">
                    {formatoDinero(a.precio)} per guest × {personas}
                  </span>
                ) : null}
                {/* Nota honesta del cliente (ej. la langosta de marzo a junio).
                    Se muestra SIEMPRE, no solo al marcarlo: enterarse después
                    de pagar es exactamente la queja que evita. */}
                {a.nota ? (
                  <span className="mt-1 block text-[11px] italic leading-relaxed text-navy-sub/80">
                    {a.nota}
                  </span>
                ) : null}
              </span>
            </button>
          </div>
        )
      })}
    </div>
  )
}
