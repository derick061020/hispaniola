import { Banknote, Check, CreditCard, Lock } from 'lucide-react'
import * as FancyButton from '@/components/alignui/fancy-button'
import { formatoDinero } from '@/data/home'
import { DESCUENTO_EFECTIVO, type DesglosePago, type MetodoPago } from '@/lib/tarifas'

// Sección «Payment» del funnel (Fase C, layout Viator). El desglose completo del
// precio vive en la columna derecha (ResumenReserva); aquí se ELIGE cómo se
// paga, que desde el 2026-09-01 es una decisión de verdad y no una explicación.
//
// [2026-09-01, pedido de Samuel] LAS DOS FORMAS DE PAGAR. Hasta hoy había una
// sola —depósito del 25% con tarjeta y el resto a bordo— y el 5% de efectivo se
// mencionaba de pasada, como algo que pasaría el día del tour sobre el saldo.
// Samuel: «en checkout permitir pagar en cash todo; al seleccionar el método de
// pago en cash pues no se usaría cobro por tarjeta y se aplicaría el descuento
// de pagar por cash; si se selecciona stripe pues no se aplica el descuento. Al
// pagar la idea sería que se selecciona alguno de los 2 en el módulo pago y se
// despliega el seleccionado y el no seleccionado se contrae».
//
// De ahí salen las tres reglas de esta pantalla:
//  1. Son DOS OPCIONES EXCLUYENTES, no dos párrafos. Por eso es un radiogroup
//     de verdad (`role="radio"` + `aria-checked`) y no dos cards decorativas:
//     con teclado se recorre y se elige como cualquier grupo de radios.
//  2. ACORDEÓN. Solo la elegida enseña su detalle; la otra se queda en una
//     línea con su titular. Enseñar los dos desgloses a la vez obliga a
//     comparar cuatro cifras en el momento de pagar, que es justo cuando menos
//     margen hay para leer.
//  3. EL DESCUENTO CUELGA DE LA ELECCIÓN, no del calendario. Lo calcula
//     `desglosePago` (lib/tarifas.ts) en un solo sitio, porque el mismo número
//     lo tienen que decir esta sección, la tarjeta de la derecha y la barra
//     fija de móvil.
//
// ⚠️ LA FRONTERA DEL BUILD SIGUE DONDE ESTABA: no se cobra nada. El motor de
// pago (Stripe / lo que decida el cliente con Odoo) está pendiente, así que
// «pagar» guarda la reserva y navega. Elegir efectivo no es un atajo para
// saltarse una pasarela que todavía no existe.
export function PasoPago({
  metodo,
  onMetodo,
  desglose,
  fechaElegida,
  onPagar,
}: {
  metodo: MetodoPago
  onMetodo: (m: MetodoPago) => void
  /** Reparto del total según el método elegido — ver `desglosePago`. */
  desglose: DesglosePago
  /** Sin fecha no se puede pagar — ver el aviso de abajo. */
  fechaElegida: boolean
  onPagar: () => void
}) {
  return (
    <div className="flex flex-col gap-4">
      <div role="radiogroup" aria-label="Payment method" className="flex flex-col gap-2.5">
        <OpcionPago
          activa={metodo === 'efectivo'}
          onElegir={() => onMetodo('efectivo')}
          icono={Banknote}
          titulo="Pay in cash"
          resumen={`Nothing today · save ${DESCUENTO_EFECTIVO}%`}
          // El ahorro va como distintivo y no dentro del texto: es el único
          // motivo por el que alguien elegiría esta opción, y tiene que leerse
          // sin abrir nada.
          distintivo={desglose.descuento > 0 ? `−${formatoDinero(desglose.descuento)}` : undefined}
        >
          <p>
            You pay the full amount in cash on the day of the tour, directly to the boat’s team.
            There’s no card payment and nothing is charged today.
          </p>
          <ul className="mt-3 flex flex-col gap-1.5">
            <Linea etiqueta="Today" valor={formatoDinero(desglose.hoy)} />
            <Linea etiqueta="On the day, in cash" valor={formatoDinero(desglose.pendiente)} destacado />
          </ul>
          <p className="mt-2.5 flex items-start gap-1.5 font-medium text-menta-texto">
            <Check className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            The {DESCUENTO_EFECTIVO}% cash discount is already applied to this amount.
          </p>
        </OpcionPago>

        <OpcionPago
          activa={metodo === 'tarjeta'}
          onElegir={() => onMetodo('tarjeta')}
          icono={CreditCard}
          titulo="Pay by card"
          resumen="25% deposit today, the rest on the day"
        >
          <p>
            Confirm your spot with a {formatoDinero(desglose.hoy)} deposit today and pay the balance
            on the day of the tour. The deposit is not an extra charge: it comes off the total.
          </p>
          <ul className="mt-3 flex flex-col gap-1.5">
            <Linea etiqueta="Today, by card" valor={formatoDinero(desglose.hoy)} destacado />
            <Linea etiqueta="On the day of the tour" valor={formatoDinero(desglose.pendiente)} />
          </ul>
          {/* Se dice lo que se PIERDE al elegir tarjeta, no solo lo que se gana
              con efectivo. Enterarse del descuento después de pagar es la queja
              que este bloque evita. */}
          <p className="mt-2.5 text-navy-soft">
            Card payments don’t get the {DESCUENTO_EFECTIVO}% cash discount.
          </p>
        </OpcionPago>
      </div>

      {/* Entrando directo a /book/:slug (sin pasar por el widget) la reserva
          llegaba hasta aquí SIN FECHA y el botón cobraba igual. 2026-08-07: el
          paso se bloquea y dice dónde se arregla — el calendario está a la
          derecha, en el resumen (en móvil, arriba del todo). */}
      {!fechaElegida ? (
        <p className="rounded-lg border border-linea bg-papel-hueso px-3 py-2 text-xs leading-relaxed text-navy-sub">
          You haven’t chosen <strong className="text-navy">the date</strong> yet. Pick it in your booking summary so you
          can confirm.
        </p>
      ) : null}

      {/* [2026-08-21, auditoría móvil] `max-lg:hidden` — igual que el
          «Continuar» de los otros pasos: en móvil el botón de pagar vive en
          BarraMovilReserva, fija abajo y con el importe al lado.
          Lo que SÍ se queda visible en móvil es lo de alrededor: el aviso de
          que falta la fecha y la línea de pago seguro, que es la reassurance
          copy del instante de pagar. */}
      <FancyButton.Root
        variant="primary"
        className="w-full max-lg:hidden"
        disabled={!fechaElegida}
        onClick={onPagar}
      >
        {/* Con efectivo no hay nada que cobrar hoy, así que un «Pay deposit ·
            US$ 0» sería mentira dos veces. El copy dice lo que hace el botón. */}
        {metodo === 'efectivo'
          ? 'Confirm booking'
          : `Pay deposit · ${formatoDinero(desglose.hoy)}`}
      </FancyButton.Root>

      <p className="flex items-center justify-center gap-1.5 text-xs text-navy-soft">
        <Lock className="size-3.5" aria-hidden="true" />
        {metodo === 'efectivo'
          ? 'No card needed · Free cancellation up to 7 days before'
          : 'Secure payment · Free cancellation up to 7 days before'}
      </p>
    </div>
  )
}

// Una de las dos formas de pagar: cabecera siempre visible + detalle que solo
// se despliega si está elegida.
function OpcionPago({
  activa,
  onElegir,
  icono: Icono,
  titulo,
  resumen,
  distintivo,
  children,
}: {
  activa: boolean
  onElegir: () => void
  icono: typeof Banknote
  titulo: string
  /** La línea corta de la cabecera: lo que hay que saber sin desplegar. */
  resumen: string
  distintivo?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={`overflow-hidden rounded-card border transition-colors ${
        activa ? 'border-aqua bg-aqua/5' : 'border-linea bg-papel'
      }`}
    >
      <button
        type="button"
        role="radio"
        aria-checked={activa}
        onClick={onElegir}
        className="flex w-full items-center gap-3 p-3.5 text-left sm:p-4"
      >
        {/* El propio radio. Se dibuja a mano (y no con un <input>) por lo mismo
            que el resto de controles del checkout: el foco y el estado tienen
            que hablar el lenguaje del sitio. La semántica la pone el `role`. */}
        <span
          aria-hidden="true"
          className={`grid size-5 shrink-0 place-items-center rounded-full border transition ${
            activa ? 'border-aqua bg-aqua' : 'border-linea bg-papel'
          }`}
        >
          {activa ? <span className="size-2 rounded-full bg-papel" /> : null}
        </span>
        <Icono
          className={`size-5 shrink-0 ${activa ? 'text-aqua-dark' : 'text-navy-soft'}`}
          aria-hidden="true"
        />
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-navy">{titulo}</span>
          <span className="mt-0.5 block text-xs text-navy-sub">{resumen}</span>
        </span>
        {distintivo ? (
          <span className="shrink-0 rounded-full bg-menta px-2.5 py-1 text-xs font-semibold text-menta-texto">
            {distintivo}
          </span>
        ) : null}
      </button>

      {/* El detalle se MONTA solo cuando la opción está activa, en vez de
          esconderse con una clase: así el contenido de la opción contraída no
          sale en el orden de tabulación ni lo lee un lector de pantalla como si
          estuviera en pantalla. */}
      {activa ? (
        <div className="border-t border-aqua/25 px-3.5 pb-3.5 pt-3 text-xs leading-relaxed text-navy-sub duration-200 animate-in fade-in slide-in-from-top-1 sm:px-4 sm:pb-4">
          {children}
        </div>
      ) : null}
    </div>
  )
}

function Linea({
  etiqueta,
  valor,
  destacado = false,
}: {
  etiqueta: string
  valor: string
  destacado?: boolean
}) {
  return (
    <li className="flex items-baseline justify-between gap-3">
      <span className={destacado ? 'font-medium text-navy' : ''}>{etiqueta}</span>
      <span className={`shrink-0 tabular-nums ${destacado ? 'font-semibold text-navy' : 'text-navy'}`}>
        {valor}
      </span>
    </li>
  )
}
