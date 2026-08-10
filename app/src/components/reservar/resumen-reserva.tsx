import { Check, Lock, MessageCircle, Minus, Plus, ShieldCheck, UtensilsCrossed, Users } from 'lucide-react'
import * as CompactButton from '@/components/alignui/compact-button'
import { CalendarioWidget } from '@/components/tour/calendario-widget'
import { NumeroEditable } from '@/components/ui/numero-editable'
import { formatoDinero, type Tour } from '@/data/home'
import type { MenuReserva } from '@/lib/menu-reserva'

// Columna DERECHA del funnel (Fase C, layout Viator): «qué estás comprando»,
// sticky, siempre visible mientras se rellena el formulario de la izquierda.
//
// El GRIS lo pone la ZONA derecha entera (reservar.tsx: bg-fondo-ficha + ::after
// a sangre hasta el borde, "todo el lado derecho gris" — 2026-07-17, Samuel), no
// este componente: aquí solo va la tarjeta de producto en BLANCO + los puntos de
// confianza sobre el gris de la zona. Nada de un box gris alrededor (eso era el
// error anterior).
//
// Se basa en el checkout de Viator PERO sin su urgencia inventada: nada de
// contador «te guardamos la plaza 18 min» ni «reservado 5+ veces» — el proyecto
// prohíbe la urgencia que no se sostiene con un dato real (revision-wireframes.md
// §2.7). Lo que queda es honesto: producto, config, precio, depósito y cancelación.
//
// 2026-08-07 (iteración pedida por Samuel sobre el funnel). Tres cambios y todos
// van en la misma dirección — que nadie tenga que salir del checkout ni fiarse
// de un número que no puede comprobar:
//   1. LA CONFIG SE EDITA AQUÍ (fecha + personas). Antes venían de la URL y eran
//      de solo lectura: para cambiar de 2 a 3 personas había que volver a la
//      ficha y empezar de nuevo. La fecha, además, podía quedarse en «Fecha por
//      confirmar» si se entraba directo a /book/:slug — se podía completar una
//      reserva SIN fecha.
//   2. EL PRECIO SE EXPLICA. Antes: una línea «2 personas · Menú Premium» y un
//      total. Ahora el desglose dice de dónde sale cada dólar (tarifa × personas,
//      upgrade aparte) y, sobre todo, que el depósito NO es un cargo extra: se
//      descuenta del total. El cliente es un señor mayor y la versión anterior
//      del tarifario ya le confundió — mismo criterio aquí.
//   3. «PAGO SEGURO» sale del widget y baja a los puntos de confianza, junto a
//      flexibilidad y trato directo (antes solo aparecía al pie del paso 4, o
//      sea, cuando ya habías decidido).
//
// 2026-08-07 (2ª vuelta): la tarjeta deja de dar por hecho Light/Premium y
// recibe el menú resuelto (lib/menu-reserva.ts). Dos consecuencias visibles:
// la línea de producto de Saona ya no miente con «Light menu» —dice «Island
// buffet»—, y cuando el menú es FIJO esta tarjeta pasa a ser el sitio donde se
// enseña la comida, porque el funnel ya no pinta un paso para ella. Enseñarla
// aquí no es un adorno: es parte de lo que se está comprando, y quitar el paso
// sin enseñarla en algún sitio sería esconder el producto.
export function ResumenReserva({
  tour,
  fechaISO,
  onFecha,
  horarios,
  horarioIdx,
  onHorario,
  horarioTxt,
  horaSalida,
  menu,
  personas,
  minPersonas,
  maxPersonas,
  onPersonas,
  conceptoBase,
  precioBase,
  upgrade,
  lineas,
  total,
  deposito,
  saldo,
}: {
  tour: Tour
  fechaISO: string | null
  onFecha: (iso: string) => void
  /** Horarios publicados del tour; el selector solo se pinta si hay más de uno. */
  horarios: { hora: string; regreso?: string }[]
  horarioIdx: number
  onHorario: (i: number) => void
  horarioTxt: string
  /** Solo la hora de zarpe, para pintarla dentro del campo de fecha. */
  horaSalida: string | null
  /** El menú que le toca a esta reserva; null en un tour sin comida publicada. */
  menu: MenuReserva | null
  personas: number
  minPersonas: number
  maxPersonas: number
  onPersonas: (n: number) => void
  /** Rótulo de la primera línea del desglose. Con paquetes es el nombre del
   *  paquete («Light menu»); sin ellos (Saona, charter) es la tarifa del tour —
   *  llamarla «Island buffet» daría a entender que la comida se paga aparte. */
  conceptoBase: string
  /** Tarifa por persona del paquete base (Light). */
  precioBase: number
  /** Sobrecoste por persona del Premium; 0 si la reserva es Light. */
  upgrade: number
  /** Desglose que devuelve Odoo. Cuando llega, sustituye al cálculo local: es
   *  el único que sabe explicar un tramo de grupo («Catamaran — flat rate»),
   *  que no es una multiplicación y no se puede escribir como tal. */
  lineas?: { label: string; quantity: number; unit_price: number; amount: number }[]
  total: number
  deposito: number
  saldo: number
}) {
  const enEfectivo = Math.round(saldo * 0.95)
  const ahorro = saldo - enEfectivo

  return (
    <div>
      {/* SIN `overflow-hidden` (2026-08-07): al entrar el calendario en la
          tarjeta, ese clip le cortaba el popover — el grid mensual es más ancho
          que la columna y perdía la columna del sábado. Las esquinas de abajo
          las redondea ahora el propio bloque de pago (rounded-b-card). */}
      <div className="rounded-card bg-papel ring-1 ring-linea">
        <div className="flex items-center gap-3 p-4">
          <img
            src={`/fotos/${tour.foto}.webp`}
            alt=""
            aria-hidden="true"
            className="size-16 shrink-0 rounded-card object-cover"
          />
          <div className="min-w-0">
            <p className="font-display text-sm font-semibold leading-snug text-navy">{tour.nombre}</p>
            <p className="mt-0.5 text-xs text-navy-soft">
              {menu ? `${menu.etiqueta} · ` : ''}
              {tour.duracionCorta}
            </p>
          </div>
        </div>

        {/* QUÉ SE COME, cuando no hay nada que elegir. Es el reverso de haber
            quitado el paso del menú: sin este bloque, un visitante de Saona
            haría el checkout entero sin ver que la comida va incluida ni qué
            es. Va plegado en un <details> porque es información de apoyo —no
            una decisión— y la tarjeta ya es larga. */}
        {menu?.modo === 'fijo' && (menu.platos.length > 0 || menu.texto) ? (
          <details className="group border-t border-linea">
            <summary className="flex cursor-pointer list-none items-center gap-2 p-4 text-sm">
              <UtensilsCrossed className="size-4 shrink-0 text-aqua-dark" aria-hidden="true" />
              <span className="font-semibold text-navy">{menu.titulo}</span>
              <span className="ml-auto text-xs font-medium text-aqua-dark group-open:hidden">See what’s served</span>
              <span className="ml-auto hidden text-xs font-medium text-aqua-dark group-open:inline">Hide</span>
            </summary>
            <div className="px-4 pb-4">
              {menu.texto ? <p className="text-xs text-navy-soft">{menu.texto}</p> : null}
              <ul className="mt-2 flex flex-col gap-1 text-sm text-navy-sub">
                {menu.platos.map((p) => (
                  <li key={p.nombre} className="flex gap-2">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-menta-texto" aria-hidden="true" />
                    <span>
                      <span className="text-navy">{p.nombre}</span>
                      {p.desc ? <span className="text-navy-soft"> · {p.desc}</span> : null}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </details>
        ) : null}

        {/* CONFIGURACIÓN EDITABLE. Los dos campos que cambian el precio —fecha y
            personas— son las MISMAS piezas del widget de la ficha (mismo
            CalendarioWidget, mismo stepper h-10 de AlignUI), no una versión
            parecida: quien viene de configurar allí reconoce el control. */}
        <div className="flex flex-col gap-2 border-t border-linea p-4">
          <CalendarioWidget fecha={fechaISO} onSeleccionar={onFecha} hora={horaSalida} />

          <div
            role="group"
            aria-label="Number of people"
            className="flex h-10 items-center justify-between rounded-10 border border-stroke-soft-200 bg-bg-white-0 pl-3 pr-1.5"
          >
            <span className="flex items-center gap-1 text-paragraph-sm text-text-strong-950">
              <Users className="mr-1 size-5 shrink-0 text-text-sub-600" aria-hidden="true" />
              <NumeroEditable
                valor={personas}
                min={minPersonas}
                max={maxPersonas}
                onCambio={onPersonas}
                etiqueta="Number of people"
                className="tabular-nums"
              />
              {personas === 1 ? 'person' : 'people'}
            </span>
            <div className="flex items-center gap-1">
              <CompactButton.Root
                type="button"
                variant="stroke"
                fullRadius
                aria-label="Remove one person"
                disabled={personas <= minPersonas}
                onClick={() => onPersonas(Math.max(minPersonas, personas - 1))}
                className="size-9 active:scale-90 active:border-transparent active:bg-navy active:text-papel active:shadow-none"
              >
                <CompactButton.Icon as={Minus} />
              </CompactButton.Root>
              <CompactButton.Root
                type="button"
                variant="stroke"
                fullRadius
                aria-label="Add one person"
                disabled={personas >= maxPersonas}
                onClick={() => onPersonas(Math.min(maxPersonas, personas + 1))}
                className="size-9 active:scale-90 active:border-transparent active:bg-navy active:text-papel active:shadow-none"
              >
                <CompactButton.Icon as={Plus} />
              </CompactButton.Root>
            </div>
          </div>

          {/* HORARIO. Misma píldora que el widget de la ficha (solo la hora de
              SALIDA; el regreso vive en la línea de confirmación de abajo).
              Se pinta solo con 2+ salidas: con una sola, elegir no es elegir.
              Sin esto, quien entraba directo a /book/:slug se quedaba con la
              salida de la mañana sin manera de cambiarla — el mismo agujero
              que tenía la fecha. */}
          {horarios.length > 1 ? (
            <div className="flex flex-wrap gap-2">
              {horarios.map((h, i) => {
                const elegido = horarioIdx === i
                return (
                  <button
                    key={h.hora}
                    type="button"
                    onClick={() => onHorario(i)}
                    aria-pressed={elegido}
                    aria-label={`Departure ${h.hora}${h.regreso ? `, back at ${h.regreso}` : ''}`}
                    className={`rounded-full px-3.5 py-2 text-sm tabular-nums transition-colors ${
                      elegido
                        ? 'bg-navy font-semibold text-papel shadow-sm'
                        : 'bg-papel-hueso text-navy-sub hover:bg-papel-hueso/70 hover:text-navy'
                    }`}
                  >
                    {h.hora}
                  </button>
                )
              })}
            </div>
          ) : null}

          <p className="text-xs text-navy-soft">
            {fechaISO ? horarioTxt : 'Choose the date to confirm your spot.'}
          </p>
        </div>

        {/* DESGLOSE. Se pinta SIEMPRE, también sin extras: ver de dónde sale el
            total es la mitad del argumento de reservar directo (mismo criterio
            que la calculadora de eventos). El upgrade Premium va en su propia
            línea porque es la decisión que se puede deshacer. */}
        <div className="border-t border-linea p-4 text-sm">
          {/* [2026-08-10] El desglose lo manda el SERVIDOR cuando ya ha
              contestado (`lineas`). Antes se componía aquí con
              `precioBase × personas`, y en los tours que se venden por tramos
              eso imprimía una fórmula que no existe: «US$ 184 × 30» encima de
              un total de US$ 1.950, porque 184 es un ancla «desde» y 1.950 es
              el precio plano del catamarán. Explicar mal de dónde sale el
              dinero es peor que no explicarlo: es justo lo que hace dudar y
              abandonar. Mientras la primera respuesta viaja se pinta la
              estimación local, que en el caso de tarifa única sí es correcta. */}
          {lineas && lineas.length > 0 ? (
            lineas.map((linea, i) => (
              <FilaPrecio
                key={i}
                concepto={
                  <>
                    {linea.label}{' '}
                    {linea.quantity > 1 ? (
                      <span className="text-navy-soft">
                        {formatoDinero(linea.unit_price)} × {linea.quantity}
                      </span>
                    ) : null}
                  </>
                }
                importe={linea.amount}
              />
            ))
          ) : (
            <>
              <FilaPrecio
                concepto={
                  <>
                    {conceptoBase}{' '}
                    <span className="text-navy-soft">
                      {formatoDinero(precioBase)} × {personas}
                    </span>
                  </>
                }
                importe={precioBase * personas}
              />
              {upgrade > 0 ? (
                <FilaPrecio
                  concepto={
                    <>
                      Upgrade to Premium{' '}
                      <span className="text-navy-soft">
                        {formatoDinero(upgrade)} × {personas}
                      </span>
                    </>
                  }
                  importe={upgrade * personas}
                />
              ) : null}
            </>
          )}
          <div className="mt-3 flex items-center justify-between border-t border-linea pt-3">
            <span className="font-semibold text-navy">Total</span>
            <span className="font-display text-precio font-semibold text-navy">{formatoDinero(total)}</span>
          </div>
        </div>

        {/* CÓMO SE PAGA. Dos líneas que suman el total de arriba, y la frase que
            evita la duda de siempre: el depósito no se suma, se descuenta. */}
        <div className="rounded-b-card border-t border-linea bg-papel-hueso p-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-navy">You pay today (25%)</span>
            <span className="font-semibold text-navy">{formatoDinero(deposito)}</span>
          </div>
          <div className="mt-1.5 flex items-center justify-between">
            <span className="text-navy-sub">On the day of the tour</span>
            <span className="text-navy">{formatoDinero(saldo)}</span>
          </div>
          <p className="mt-2.5 text-xs leading-relaxed text-navy-soft">
            The deposit is not an extra charge: it comes off the total. Paying cash on board brings the balance down to{' '}
            <span className="font-semibold text-navy">{formatoDinero(enEfectivo)}</span>. You save{' '}
            {formatoDinero(ahorro)}.
          </p>
          <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-menta-texto">
            <Check className="size-3.5 shrink-0" aria-hidden="true" />
            Free cancellation up to 7 days before
          </p>
        </div>
      </div>

      <div className="mt-5 px-1">
        <h2 className="font-display text-sm font-semibold text-navy">Book with confidence</h2>
        <ul className="mt-3 flex flex-col gap-3 text-xs text-navy-sub">
          <li className="flex gap-2.5">
            <ShieldCheck className="size-4 shrink-0 text-aqua-dark" aria-hidden="true" />
            <span>
              <strong className="font-semibold text-navy">Total flexibility.</strong> Free cancellation up to 7 days before
              and a full refund for bad weather.
            </span>
          </li>
          <li className="flex gap-2.5">
            <MessageCircle className="size-4 shrink-0 text-aqua-dark" aria-hidden="true" />
            <span>
              <strong className="font-semibold text-navy">Talk to us directly.</strong> You chat on WhatsApp with the boat’s
              team, not with a call center.
            </span>
          </li>
          {/* «Pago seguro» vivía al pie del paso 4 — se leía cuando ya habías
              decidido pagar. Aquí acompaña a la decisión. El copy dice solo lo
              que se puede sostener: la pasarela cifra y nosotros no guardamos
              la tarjeta. Nada de logos de marcas que aún no están contratadas
              (el motor de pago sigue pendiente del cliente). */}
          <li className="flex gap-2.5">
            <Lock className="size-4 shrink-0 text-aqua-dark" aria-hidden="true" />
            <span>
              <strong className="font-semibold text-navy">Secure payment.</strong> Encrypted connection; your card details
              are handled by the payment gateway and never stored on our site.
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}

function FilaPrecio({ concepto, importe }: { concepto: React.ReactNode; importe: number }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-0.5">
      <span className="text-navy">{concepto}</span>
      <span className="shrink-0 tabular-nums text-navy">{formatoDinero(importe)}</span>
    </div>
  )
}
