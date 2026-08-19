import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ChevronDown, Users } from 'lucide-react'
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
