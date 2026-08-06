import { useState } from 'react'
import { Minus, Package, Plus, Users } from 'lucide-react'
import * as CompactButton from '@/components/alignui/compact-button'
import * as FancyButton from '@/components/alignui/fancy-button'
import { EnlacePrototipo } from '@/components/ui/enlace-prototipo'
import { formatoDinero } from '@/data/home'
import {
  NOVIOS_GRATIS_DESDE,
  personasQuePagan,
  totalPaqueteEvento,
  type PaqueteEvento,
} from '@/data/eventos'

// Reserva online de eventos (correcciones v2, plan 03 §1 — slides 14 y 15:
// «agregar reserva online y debajo el formulario de cotización»).
//
// Hasta ahora las 3 landings de evento eran 100% asíncronas: pedías
// presupuesto y alguien te contestaba. Eso trataba igual a quien quiere un
// party boat estándar de 20 personas que a quien organiza una boda de 120 con
// menú a medida — y no son el mismo cliente.
//
// El cliente confirmó en la reunión del 07-24 (12:53) que sí quiere reserva
// online, y el tarifario que lo permite ya existe y es de PRECIO CERRADO:
// US$ 1.188 para 1-12 personas + US$ 99 por cada persona extra (Samuel lo leyó
// en voz alta a las 13:05 y propuso «hacerlo tal cual como está el resto»).
//
// ⚠️ MODELO MARGINAL, no sustitución de tramo. Los eventos son el único
// producto que funciona así: base fija hasta 12 y luego un tanto por cabeza.
// Los tours (charter, Saona) usan sustitución — ver lib/tarifas.ts. No
// mezclar los dos.
//
// FRONTERA DEL BUILD: igual que en tours, esto NO cobra. El depósito es el 25%
// (decisión de Samuel, 2026-07-27 — el mismo que los tours, sin porcentaje
// especial por ser evento) y el paso de pago lo dirá con todas las letras
// cuando el funnel acepte slugs de evento. Mientras tanto, el CTA es
// EnlacePrototipo: enseña el estado real sin fingir que reserva.

const DEPOSITO = 0.25

export function CalculadoraEvento({
  paquetes,
  elegido,
  onElegir,
  slug,
}: {
  paquetes: PaqueteEvento[]
  /** [v3 2026-08-06] La landing. Solo bodas aplica el perk de los novios
   *  gratis (WEBSITE-EVENTOS pag. 5), y el precio lo decide `data/eventos.ts`
   *  — aqui solo se pasa el dato para que el total del widget sea el mismo
   *  que cobrara el funnel. */
  slug?: 'party-boat' | 'weddings' | 'corporate'
  /** [v2 2026-07-28, 2ª vuelta] El paquete elegido SUBE a pages/evento.tsx:
   *  el bloque de paquetes de la columna izquierda marca el mismo que está
   *  activo aquí, y se puede elegir desde cualquiera de los dos. Mismo patrón
   *  que `variante` en la ficha de tour, que gobierna a la vez el widget y la
   *  tabla de precios del charter — dos piezas que hablan del mismo dato no
   *  pueden tener cada una el suyo. */
  elegido: string | null
  onElegir: (id: string) => void
}) {
  const conPrecio = paquetes.filter((p) => p.precioBase !== null)
  const [personas, setPersonas] = useState(12)

  if (conPrecio.length === 0) return null

  const idx = Math.max(
    0,
    conPrecio.findIndex((p) => p.id === elegido),
  )
  const paquete = conPrecio[idx]
  const total = totalPaqueteEvento(paquete, personas, slug)
  const incluidas = paquete.incluyeHasta ?? 12
  const pagan = personasQuePagan(personas, slug)
  const extras = Math.max(0, pagan - incluidas)
  // [v3 2026-08-06, slide 79] ¿Se esta aplicando el regalo de los novios? Es
  // lo que hay que DECIR en pantalla: sin la linea, el total baja al pasar de
  // 13 a 14 invitados y parece un fallo de la calculadora.
  const novios = slug === 'weddings' && personas >= NOVIOS_GRATIS_DESDE

  return (
    // `widget-marco` (sombra INSET de 1px) y no `ring-1 ring-linea`, por el
    // mismo motivo que ya documenta widget-reserva.tsx: el ring de Tailwind se
    // pinta POR FUERA del borde, así que el contenedor de scroll de la columna
    // (lg:overflow-y-auto en pages/evento.tsx) lo recortaba a izquierda y
    // derecha — el borde se veía a trozos. Una sombra inset se dibuja DENTRO
    // de la caja y no hay overflow que pueda comérsela.
    <div className="flex flex-col gap-4 rounded-card-grande bg-papel p-4 widget-marco sm:p-5">
      <div>
        <p className="font-display text-lg font-semibold text-navy">Reserva online</p>
        {/* Una línea, no dos (2026-07-28): cada línea que se ahorra aquí es
            una línea que la card de «¿tu evento no encaja?» gana para entrar
            sin scroll en una ventana de portátil. */}
        <p className="mt-0.5 text-sm text-navy-sub">Precio cerrado, sin esperar cotización.</p>
      </div>

      {/* ── ELEGIR PAQUETE ───────────────────────────────────────────────
          Los 4 tienen precio publicado, así que los 4 son reservables
          directo; lo que necesita cotización es lo que se sale de estos
          paquetes (menú a medida, aforos grandes), y para eso está el
          formulario de abajo.

          [v2 2026-07-28, Samuel: «los paquetes, en vez de estar uno debajo
          del otro, se ven poco atractivos»] Eran 4 filas apiladas de nombre +
          precio: una lista de precios, no un menú de comida. Ahora son un
          SEGMENTED + una card de preview del paquete activo, que es
          exactamente el patrón que este proyecto ya resolvió para los 4 botes
          del charter (tour/sub-variante-picker.tsx) — mismo problema (elegir
          entre 4 cosas dentro de un widget angosto) y misma solución, así que
          en Figma es un componente con dos usos y no dos piezas parecidas.
          Gana en tres cosas a la vez:
            · APETITO — entra la foto del plato, que es lo que se vende. Un
              «US$ 780.00» en una fila gris no da hambre.
            · ALTURA — de ~242px a ~130px. Eso es lo que permite que la card
              «¿tu evento no encaja?» entre sin scroll (ver el porqué en
              widget-evento.tsx).
            · COMPARAR — al saltar de pestaña, el Total de abajo cambia en el
              sitio. Antes había 4 precios de lista a la vista pero ninguno
              era el TUYO (dependen del nº de invitados); ahora el número que
              se compara es el que se va a pagar.
          La etiqueta de la pestaña es `nombreCorto` (data/eventos.ts): a ~85px
          por pestaña, «Hispaniola Premium Package» no cabe ni a 12px. El
          nombre completo lo pinta la card de preview justo debajo, así que la
          abreviatura nunca aparece sola. */}
      <div>
        <span className="mb-1 block text-xs font-medium text-navy-sub" id="calc-label-paquete">
          Paquete
        </span>
        <div
          role="tablist"
          aria-labelledby="calc-label-paquete"
          className="relative grid gap-1 rounded-full bg-linea p-1"
          style={{ gridTemplateColumns: `repeat(${conPrecio.length}, minmax(0, 1fr))` }}
        >
          {/* Thumb deslizante. La fórmula del ancho y del translateX es la
              MISMA que la del picker de botes, y la de allí está verificada a
              mano para N=2/3/4 — no se re-deriva aquí: contenedor con p-1
              (4px) y gap-1 (4px), así que una columna mide
              (100% - 8px - (N-1)*4px)/N y saltar idx columnas es
              idx × (100% + 4px), donde el 100% es UN ancho de thumb. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-1 left-1 rounded-full bg-papel shadow-sm transition-transform duration-200 ease-out motion-reduce:transition-none"
            style={{
              width: `calc((100% - 8px - ${(conPrecio.length - 1) * 4}px) / ${conPrecio.length})`,
              transform: idx > 0 ? `translateX(calc(${idx} * (100% + 4px)))` : 'translateX(0)',
            }}
          />
          {conPrecio.map((p) => {
            const activo = p.id === paquete.id
            return (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={activo}
                onClick={() => onElegir(p.id)}
                className={`relative z-10 flex items-center justify-center rounded-full px-0.5 py-2 text-center text-xs font-semibold leading-tight transition-colors sm:px-1 sm:text-sm ${
                  activo ? 'text-navy' : 'text-navy-sub/55 hover:text-navy-sub'
                }`}
              >
                {p.nombreCorto}
              </button>
            )
          })}
        </div>

        {/* Preview del paquete activo: foto del plato + nombre completo +
            los primeros platos del menú. El PRECIO no se repite aquí a
            propósito — está 60px más abajo en el desglose, con su total
            real; ponerlo dos veces en la misma tarjeta es ruido. */}
        <div className="mt-2 flex items-center gap-3 rounded-card bg-papel-hueso p-2">
          {paquete.foto ? (
            <img
              src={`/fotos/${paquete.foto}.webp`}
              alt={paquete.fotoAlt}
              loading="lazy"
              className="size-14 shrink-0 rounded-btn object-cover"
            />
          ) : (
            <span className="grid size-14 shrink-0 place-items-center rounded-btn bg-linea">
              <Package className="size-6 text-navy-soft" aria-hidden="true" />
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-navy">{paquete.nombre}</p>
            <p className="truncate text-xs text-navy-soft">
              {paquete.capacidad} · {paquete.meta}
            </p>
            {paquete.items.length > 0 ? (
              <p className="truncate text-xs text-navy-sub">
                {/* Dos y no tres: al tercero ya no le queda ancho y se
                    cortaba a mitad de palabra («Shrimp Sk…»), que es peor
                    que no ponerlo. El menú completo está en la sección de
                    paquetes de la izquierda. */}
                {paquete.items
                  .slice(0, 2)
                  .map((it) => it.titulo)
                  .join(' · ')}
                {paquete.items.length > 2 ? ` +${paquete.items.length - 2}` : ''}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {/* Personas. Arranca en 12 (el tope del precio base) a propósito: es el
          número donde el paquete rinde más, y así el primer total que ve el
          visitante es el de la tarifa cerrada, sin extras. */}
      <div>
        <span className="mb-1 block text-xs font-medium text-navy-sub">Personas</span>
        <div className="flex h-10 items-center justify-between rounded-10 border border-stroke-soft-200 bg-bg-white-0 pl-3 pr-1.5">
          <span className="flex items-center gap-2 text-paragraph-sm">
            <Users className="size-5 shrink-0 text-text-sub-600" aria-hidden="true" />
            <span className="text-navy-sub">Invitados</span>
          </span>
          <div className="flex items-center gap-2">
            <span
              key={personas}
              aria-live="polite"
              className="stepper-tick min-w-[2rem] text-center font-semibold tabular-nums text-navy"
            >
              {personas}
            </span>
            <div className="flex items-center gap-1">
              <CompactButton.Root
                type="button"
                variant="stroke"
                fullRadius
                aria-label="Quitar un invitado"
                disabled={personas <= 1}
                onClick={() => setPersonas((n) => Math.max(1, n - 1))}
                className="size-11 active:scale-90 active:border-transparent active:bg-navy active:text-papel active:shadow-none"
              >
                <CompactButton.Icon as={Minus} />
              </CompactButton.Root>
              <CompactButton.Root
                type="button"
                variant="stroke"
                fullRadius
                aria-label="Añadir un invitado"
                onClick={() => setPersonas((n) => n + 1)}
                className="size-11 active:scale-90 active:border-transparent active:bg-navy active:text-papel active:shadow-none"
              >
                <CompactButton.Icon as={Plus} />
              </CompactButton.Root>
            </div>
          </div>
        </div>
      </div>

      {/* Desglose. Se enseña SIEMPRE, no solo cuando hay extras: que el
          visitante vea de dónde sale el total es la mitad del argumento de
          reservar directo. */}
      {total !== null ? (
        <div className="flex flex-col gap-1.5 border-t border-linea pt-3 text-sm">
          <div className="flex justify-between text-navy-sub">
            <span>Paquete (hasta {incluidas} personas)</span>
            <span className="tabular-nums">{formatoDinero(paquete.precioBase!)}</span>
          </div>
          {extras > 0 ? (
            <div className="flex justify-between text-navy-sub">
              <span>
                {extras} {extras === 1 ? 'persona extra' : 'personas extra'} ×{' '}
                {formatoDinero(paquete.porPersonaExtra ?? 0)}
              </span>
              <span className="tabular-nums">
                {formatoDinero(extras * (paquete.porPersonaExtra ?? 0))}
              </span>
            </div>
          ) : null}
          {/* [v3 2026-08-06, slide 79] La linea que evita que el total parezca
              un error: al pasar de 13 a 14 invitados el precio BAJA, porque
              los dos ultimos son los novios y no pagan. Se dice como linea de
              descuento del desglose, en el idioma de ahorro del sitio. */}
          {novios ? (
            <div className="flex justify-between font-medium text-menta-texto">
              <span>Bride &amp; Groom sail free</span>
              <span className="tabular-nums">
                −{formatoDinero(2 * (paquete.porPersonaExtra ?? 0))}
              </span>
            </div>
          ) : null}
          <div className="mt-1 flex justify-between border-t border-linea pt-2 font-display text-lg font-semibold text-navy">
            <span>Total</span>
            <span className="tabular-nums">{formatoDinero(total)}</span>
          </div>
          <p className="text-xs text-navy-soft">
            Reservas con el {DEPOSITO * 100}% ({formatoDinero(Math.round(total * DEPOSITO))}) y pagas
            el resto el día del evento.
          </p>
        </div>
      ) : null}

      <EnlacePrototipo>
        <FancyButton.Root variant="primary" className="w-full" asChild>
          <span>Reservar este paquete</span>
        </FancyButton.Root>
      </EnlacePrototipo>
    </div>
  )
}
