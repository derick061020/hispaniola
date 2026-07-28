import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ChevronDown, Users } from 'lucide-react'

// Selector de pasajeros plegable (correcciones v2, 2026-07-27 — pedido de
// Samuel con la referencia de Viator: «un solo selector de "pasajeros" y al
// hacer click se despliega un pequeño modal con los selectores de adultos,
// niños y bebés»).
//
// El problema que resuelve: los tres steppers ocupaban ~190px de alto SIEMPRE,
// aunque la inmensa mayoría de reservas no lleve menores. En un widget que es
// sticky y compite por caber en el primer viewport, eso es mucho sitio pagado
// por un caso minoritario. Plegado, la línea ocupa 40px y el detalle aparece
// solo si hace falta.
//
// Mismo mecanismo de cierre que CalendarioWidget (clic fuera + Escape) y no un
// Dialog de AlignUI: esto no es un modal —no bloquea la página ni atrapa el
// foco— es un desplegable del formulario, hermano del calendario. Que los dos
// campos del widget se comporten igual importa más que reutilizar un vendor
// que aquí sobraría.
//
// ⚠️ El panel va `absolute` dentro del widget, que desde el 07-27 es un
// contenedor con scroll propio: por eso NO se ancla al viewport ni se
// portaliza. Al ir en el flujo del scroll del widget, se puede alcanzar
// scrolleando aunque el panel caiga por debajo del borde — el mismo trato que
// ya tenía el popover del calendario.
export function PasajerosPopover({
  resumen,
  total,
  max,
  children,
}: {
  /** Texto de la línea plegada, ej. «2 adultos · 1 niño». */
  resumen: string
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
        aria-label="Pasajeros"
        aria-expanded={abierto}
        className="flex h-10 w-full items-center gap-2 rounded-10 border border-stroke-soft-200 bg-bg-white-0 px-3 text-left text-paragraph-sm text-text-strong-950 transition"
      >
        <Users className="size-5 shrink-0 text-text-sub-600" aria-hidden="true" />
        <span>{resumen}</span>
        {/* El aforo restante se muestra SIEMPRE, plegado incluido: es el dato
            que decide si hay que abrir el panel o no. */}
        <span className="ml-auto text-xs tabular-nums text-navy-soft">
          {total} / {max}
        </span>
        <ChevronDown
          className={`size-4 shrink-0 text-text-sub-600 transition-transform ${
            abierto ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {abierto ? (
        <div className="absolute left-0 top-full z-20 mt-2 w-full rounded-card bg-papel p-3 shadow-card ring-1 ring-linea">
          {children}
        </div>
      ) : null}
    </div>
  )
}

/** Resumen legible de la mezcla de pasajeros para la línea plegada.
 *  Omite las categorías en cero — «2 adultos» se lee mejor que
 *  «2 adultos · 0 niños · 0 bebés», que es justo el ruido que se quería
 *  quitar del widget. */
export function resumirPasajeros(adultos: number, ninos: number, bebes: number): string {
  const partes: string[] = [`${adultos} ${adultos === 1 ? 'adulto' : 'adultos'}`]
  if (ninos > 0) partes.push(`${ninos} ${ninos === 1 ? 'niño' : 'niños'}`)
  if (bebes > 0) partes.push(`${bebes} ${bebes === 1 ? 'bebé' : 'bebés'}`)
  return partes.join(' · ')
}
