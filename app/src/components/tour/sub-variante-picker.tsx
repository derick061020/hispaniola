import { Ship } from 'lucide-react'
import { formatoDinero } from '@/data/home'
import { aforoDe, precioDesde } from '@/lib/tarifas'
import type { SubVarianteTour } from '@/data/tours'

// Selector de sub-variantes del widget (v3 2026-07-17).
// Reutilizable para Saona (3 botes: speedboat/fishing/catamarán) y para
// Charter (5 tarifarios: Maite, GrandMa, Santa Maria y el Forever Teresa en
// sus dos duraciones).
//
// [v2 2026-07-28] DE SEGMENTED CONTROL A LISTA VERTICAL. Samuel: «se ve muy
// apretado por los nombres, que son largos».
//
// El diagnóstico exacto: un segmented control reparte el ancho a partes
// iguales y el widget mide 384 px. Con 5 opciones tocaban ~72 px por pestaña
// para rótulos como «Forever Teresa · 4h» — se partían en tres líneas, la
// pastilla crecía a 90 px de alto y los nombres quedaban ilegibles. Ese patrón
// sirve para 2 o 3 etiquetas cortas (Light/Premium), no para nombres propios.
//
// La lista vertical le da a cada barco una línea entera, y de paso cabe lo que
// antes no cabía:
//  · La FOTO de los cinco a la vez, en miniatura. Antes solo se veía la del
//    bote activo, en una card de preview debajo — para comparar barcos había
//    que ir pinchando uno por uno.
//  · El «desde US$ X» de cada uno, que es el dato que de verdad decide y que
//    hasta ahora solo aparecía en la tabla de precios, a media página de
//    distancia. Se DERIVA de la tabla de tramos del propio bote
//    (`precioDesde`), nunca se escribe a mano.
// La card de preview desaparece: era el parche que compensaba que el selector
// no dijera nada, y ahora lo dice todo él.
//
// La altura sale casi igual que antes (5 filas ≈ lo que ocupaban la pastilla
// de 3 líneas + su meta + la card de preview), así que el CTA no baja.

export function SubVariantePicker({
  subVariantes,
  activa,
  onChange,
}: {
  subVariantes: SubVarianteTour[]
  activa: string
  onChange: (id: string) => void
}) {
  return (
    // radiogroup y no tablist: esto elige un valor de una reserva, no cambia
    // de panel. Antes era `tablist` porque parecía un toggle; en lista, la
    // semántica correcta también es la que mejor navega con teclado.
    <div role="radiogroup" aria-label="Elige tu barco" className="flex flex-col gap-1.5">
      {subVariantes.map((s) => {
        const activo = s.id === activa
        const desde = s.tabla.length > 0 ? precioDesde(s.tabla) : null
        return (
          <button
            key={s.id}
            type="button"
            role="radio"
            aria-checked={activo}
            onClick={() => onChange(s.id)}
            className={`flex items-center gap-3 rounded-card p-2 text-left transition-colors ${
              activo
                ? 'bg-aqua-tint ring-2 ring-aqua-dark'
                : 'bg-papel-hueso ring-1 ring-linea hover:bg-aqua-tint/50'
            }`}
          >
            {/* Saona no trae `foto` en sus sub-variantes (se diferencian por
                nombre y capacidad): en su lugar va el icono, para que las
                filas rimen igual y no se descuadre la rejilla. */}
            {s.foto ? (
              <img
                src={`/fotos/${s.foto}.webp`}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="size-11 shrink-0 rounded-lg object-cover"
              />
            ) : (
              <span
                aria-hidden="true"
                className="grid size-11 shrink-0 place-items-center rounded-lg bg-aqua-tint text-aqua-dark"
              >
                <Ship className="size-5" />
              </span>
            )}

            <span className="min-w-0 flex-1">
              <span
                className={`block truncate font-display text-sm font-semibold ${
                  activo ? 'text-navy' : 'text-navy-sub'
                }`}
              >
                {s.nombre}
              </span>
              {/* El aforo se DERIVA de la tabla de tramos en vez de usar
                  `capacidad`: ese campo lleva paréntesis largos («Hasta 45
                  personas (plated hasta 20, skewers desde 21)») que en 384 px
                  se cortaban a mitad de frase y no decían nada. El matiz sigue
                  publicado donde hay sitio para leerlo — la tabla de precios.
                  truncate igualmente, como red de seguridad: la fila mide lo
                  que mide y ningún texto puede volver a partir la caja. */}
              <span className="block truncate text-xs text-navy-soft">
                {s.duracion ? <>{s.duracion} · </> : null}
                hasta {aforoDe(s.tabla)} pax
              </span>
            </span>

            {desde !== null ? (
              <span className="shrink-0 text-right">
                <span className="block text-eyebrow uppercase tracking-wide text-navy-soft">
                  desde
                </span>
                <span
                  className={`block font-display text-sm font-semibold ${
                    activo ? 'text-aqua-dark' : 'text-navy-sub'
                  }`}
                >
                  {formatoDinero(desde)}
                </span>
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
