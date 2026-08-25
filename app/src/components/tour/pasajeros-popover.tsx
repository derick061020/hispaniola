import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ChevronDown, Minus, Plus, Users } from 'lucide-react'
import * as CompactButton from '@/components/alignui/compact-button'
import { PistaInfo } from '@/components/ui/pista-info'
import { NumeroEditable } from '@/components/ui/numero-editable'
import { t } from '@/lib/i18n'

// Selector de pasajeros plegable (correcciones v2, 2026-07-27; rediseñado el
// 07-28 siguiendo la captura de Viator que pasó Samuel).
//
// El problema que resuelve: los tres steppers ocupaban ~190px de alto SIEMPRE,
// aunque la inmensa mayoría de reservas no lleve menores. En un widget sticky
// que compite por caber en el primer viewport, eso es mucho sitio pagado por
// un caso minoritario.
//
// ANATOMÍA (2ª vuelta, del patrón de Viator):
//  · El disparador dice «Pasajeros», no la mezcla. Antes ponía «2 adultos» y
//    Samuel lo corrigió: el campo se nombra por lo que ES, y el recuento vive
//    a la derecha. Así el label no cambia de longitud al tocar los steppers.
//  · Cada fila va SIN BORDE ni caja: el título es quien la delimita
//    («Adultos (13-99)»), y debajo, en pequeño, el mínimo y el máximo. Con
//    borde eran tres cajas dentro de otra caja.
//  · La franja de arriba dice el tope global — el dato que evita descubrir el
//    límite a base de topar con un botón deshabilitado.
//  · Botón APLICAR. No hace falta pulsarlo (el total de fuera se actualiza al
//    instante), y eso es deliberado: es un remate de confianza, no una
//    validación. Un selector que exige confirmar para que el precio reaccione
//    se siente lento; uno sin ningún cierre se siente inacabado.
//
// Mismo mecanismo de cierre que CalendarioWidget (clic fuera + Escape) y no un
// Dialog de AlignUI: esto no es un modal —no bloquea la página ni atrapa el
// foco— es un desplegable del formulario, hermano del calendario.
//
// ⚠️ El panel va `absolute` dentro del widget, que desde el 07-27 es un
// contenedor con scroll propio: por eso NO se ancla al viewport ni se
// portaliza. Al ir en el flujo del scroll del widget se puede alcanzar
// scrolleando aunque caiga por debajo del borde — mismo trato que el popover
// del calendario.
export function PasajerosPopover({
  total,
  max,
  children,
}: {
  total: number
  max: number
  children: ReactNode
}) {
  const [abierto, setAbierto] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!abierto) return
    function onClickFuera(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setAbierto(false)
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setAbierto(false)
    }
    document.addEventListener('mousedown', onClickFuera)
    document.addEventListener('keydown', onEscape)
    return () => {
      document.removeEventListener('mousedown', onClickFuera)
      document.removeEventListener('keydown', onEscape)
    }
  }, [abierto])

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setAbierto((a) => !a)}
        aria-label={t('Passengers')}
        aria-expanded={abierto}
        className="flex h-10 w-full items-center gap-2 rounded-10 border border-stroke-soft-200 bg-bg-white-0 px-3 text-left text-paragraph-sm text-text-strong-950 transition"
      >
        <Users className="size-5 shrink-0 text-text-sub-600" aria-hidden="true" />
        <span>{t('Passengers')}</span>
        <span className="ml-auto font-semibold tabular-nums text-navy">{total}</span>
        <ChevronDown
          className={`size-4 shrink-0 text-text-sub-600 transition-transform ${
            abierto ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {abierto ? (
        <div className="absolute left-0 top-full z-20 mt-2 w-full rounded-card bg-papel p-4 shadow-card ring-1 ring-linea">
          <p className="mb-3 text-xs text-navy-sub">{t('Up to')}{' '}{max} {t('passengers in total.')}</p>
          {children}
          {/* `text-papel`, NO `text-white` (2026-07-28). El resto del panel ya
              seguía al tema oscuro del widget premium —vive dentro de
              `.widget-premium`, que redefine los tokens— pero este botón se
              quedaba ilegible: en ese ámbito `--color-navy` pasa a ser el
              color de TEXTO claro, así que `bg-navy` se vuelve un fondo casi
              blanco… con el rótulo en blanco fijo encima. Con `text-papel` el
              rótulo viaja con el tema: blanco sobre navy en claro, y oscuro
              sobre el botón claro en premium. Un token en vez de un color
              literal y las dos pieles salen bien sin una segunda clase. */}
          <button
            type="button"
            onClick={() => setAbierto(false)}
            className="mt-4 w-full rounded-btn bg-navy px-4 py-2.5 text-sm font-semibold text-papel transition hover:brightness-110"
          >
            {t('Apply')}
          </button>
        </div>
      ) : null}
    </div>
  )
}

/** Una fila del selector: título con el rango de edad + mínimo/máximo debajo,
 *  y el stepper a la derecha. Sin borde ni fondo — el título es quien delimita
 *  la fila (patrón de Viator). */
export function FilaPasajero({
  titulo,
  edades,
  minimo,
  maximo,
  pista,
  children,
}: {
  titulo: string
  /** Rango de edad, ej. «13-99». Va en el propio título, entre paréntesis. */
  edades: string
  minimo: number
  maximo: number
  /** La «i» con la explicación larga. */
  pista?: ReactNode
  /** El stepper. */
  children: ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <div className="min-w-0">
        <p className="flex items-center gap-1.5 text-sm font-semibold text-navy">
          {titulo} <span className="font-normal text-navy-sub">({edades})</span>
          {pista}
        </p>
        <p className="mt-0.5 text-xs text-navy-soft">
          {t('Minimum:')}{' '}{minimo}{t(', Maximum:')}{' '}{maximo}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">{children}</div>
    </div>
  )
}

// [2026-08-25, Samuel: «en el resumen de compra hay un select solo de personas
// y cuando lo usas se rompe porque no sabe qué cambiar»] Las tres filas
// —adultos, niños, bebés— vivían escritas a mano dentro del widget de la
// ficha. El resumen del checkout tenía en su lugar UN stepper de «personas», y
// con un grupo desglosado ese control es irresoluble: bajar de 4 a 2 con 2
// niños dentro no dice a quién quitar, y lo que hacía era restarlo todo del
// carril de adultos y dejar el total sin cuadrar con el número que se estaba
// pintando. En Snorkel, que cobra distinto al niño, eso además cambiaba el
// precio sin que nadie lo hubiera pedido.
//
// Se extraen aquí para que la ficha y el checkout usen LA MISMA pieza y no dos
// parecidas que se desincronizan — que es justo la regla que el propio resumen
// dice seguir para la fecha y el stepper.
export function FilasPasajeros({
  adultos,
  ninos,
  bebes,
  maxPersonas,
  onAdultos,
  onNinos,
  onBebes,
  sobreOscuro = false,
}: {
  adultos: number
  ninos: number
  bebes: number
  /** Aforo del barco. Los bebés NO cuentan para él (decisión de Samuel). */
  maxPersonas: number
  onAdultos: (n: number) => void
  onNinos: (n: number) => void
  onBebes: (n: number) => void
  /** Piel premium: solo la usa el widget de la ficha. */
  sobreOscuro?: boolean
}) {
  const setAdultos = (f: (n: number) => number) => onAdultos(f(adultos))
  const setNinos = (f: (n: number) => number) => onNinos(f(ninos))
  const setBebes = (f: (n: number) => number) => onBebes(f(bebes))
  return (
          <div role="group" aria-label={t('Passengers')} className="divide-y divide-linea">
            <FilaPasajero
              titulo={t('Adults')}
              edades="13-99"
              minimo={1}
              maximo={maxPersonas}
              pista={
                <PistaInfo
                  sobreOscuro={sobreOscuro}
                  etiqueta={t('What counts as an adult')}
                  texto={t('From age 13 the full fare applies. At least one adult has to travel with the minors.')}
                />
              }
            >
                <NumeroEditable
                  valor={adultos}
                  min={1}
                  max={maxPersonas - ninos}
                  onCambio={onAdultos}
                  etiqueta={t('Number of adults')}
                  className="min-w-[1.5rem] font-semibold tabular-nums text-navy"
                />
                <CompactButton.Root
                  type="button"
                  variant="stroke"
                  fullRadius
                  aria-label={t('Remove an adult')}
                  disabled={adultos <= 1}
                  onClick={() => setAdultos((a) => Math.max(1, a - 1))}
                  className="size-11 active:scale-90 active:border-transparent active:bg-navy active:text-papel active:shadow-none"
                >
                  <CompactButton.Icon as={Minus} />
                </CompactButton.Root>
                <CompactButton.Root
                  type="button"
                  variant="stroke"
                  fullRadius
                  aria-label={t('Add an adult')}
                  disabled={adultos + ninos >= maxPersonas}
                  onClick={() => setAdultos((a) => Math.min(maxPersonas - ninos, a + 1))}
                  className="size-11 active:scale-90 active:border-transparent active:bg-navy active:text-papel active:shadow-none"
                >
                  <CompactButton.Icon as={Plus} />
                </CompactButton.Root>
            </FilaPasajero>

            <FilaPasajero
              titulo={t('Children')}
              edades="4-7"
              minimo={0}
              maximo={maxPersonas - 1}
              pista={
                <PistaInfo
                  sobreOscuro={sobreOscuro}
                  etiqueta={t('What age counts as a child')}
                  texto={t('Ages 4 to 7 pay a reduced fare. Under 4s do not pay: add them as infants.')}
                />
              }
            >
                <NumeroEditable
                  valor={ninos}
                  min={0}
                  max={maxPersonas - adultos}
                  onCambio={onNinos}
                  etiqueta={t('Number of children')}
                  className="min-w-[1.5rem] font-semibold tabular-nums text-navy"
                />
                <CompactButton.Root
                  type="button"
                  variant="stroke"
                  fullRadius
                  aria-label={t('Remove a child')}
                  disabled={ninos <= 0}
                  onClick={() => setNinos((n) => Math.max(0, n - 1))}
                  className="size-11 active:scale-90 active:border-transparent active:bg-navy active:text-papel active:shadow-none"
                >
                  <CompactButton.Icon as={Minus} />
                </CompactButton.Root>
                <CompactButton.Root
                  type="button"
                  variant="stroke"
                  fullRadius
                  aria-label={t('Add a child')}
                  disabled={adultos + ninos >= maxPersonas}
                  onClick={() => setNinos((n) => Math.min(maxPersonas - adultos, n + 1))}
                  className="size-11 active:scale-90 active:border-transparent active:bg-navy active:text-papel active:shadow-none"
                >
                  <CompactButton.Icon as={Plus} />
                </CompactButton.Root>
            </FilaPasajero>

            {/* Los bebés NO restan del aforo (decisión de Samuel del 07-27:
                «los bebés no suman»), por eso su máximo no depende de
                `maxPersonas` ni deshabilita el «+». */}
            <FilaPasajero
              titulo={t('Infants')}
              edades="0-3"
              minimo={0}
              maximo={maxPersonas}
              pista={
                <PistaInfo
                  sobreOscuro={sobreOscuro}
                  etiqueta={t('What age counts as an infant')}
                  texto={t('Up to age 3 they travel free and do not take up a spot. From age 4 they pay the child fare.')}
                />
              }
            >
                {/* El máximo NO es el aforo (los bebés no ocupan plaza), pero
                    sí es el tope que anuncia la propia fila: escribir 40
                    bebés en un barco de 30 no tendría a quién sentar. */}
                <NumeroEditable
                  valor={bebes}
                  min={0}
                  max={maxPersonas}
                  onCambio={onBebes}
                  etiqueta={t('Number of infants')}
                  className="min-w-[1.5rem] font-semibold tabular-nums text-navy"
                />
                <CompactButton.Root
                  type="button"
                  variant="stroke"
                  fullRadius
                  aria-label={t('Remove an infant')}
                  disabled={bebes <= 0}
                  onClick={() => setBebes((b) => Math.max(0, b - 1))}
                  className="size-11 active:scale-90 active:border-transparent active:bg-navy active:text-papel active:shadow-none"
                >
                  <CompactButton.Icon as={Minus} />
                </CompactButton.Root>
                <CompactButton.Root
                  type="button"
                  variant="stroke"
                  fullRadius
                  aria-label={t('Add an infant')}
                  disabled={false}
                  onClick={() => setBebes((b) => b + 1)}
                  className="size-11 active:scale-90 active:border-transparent active:bg-navy active:text-papel active:shadow-none"
                >
                  <CompactButton.Icon as={Plus} />
                </CompactButton.Root>
            </FilaPasajero>
          </div>
  )
}
