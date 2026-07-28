import { useEffect, useRef, useState } from 'react'
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  DIAS_CORTOS,
  MESES,
  MESES_CORTOS,
  diasEnMes,
  fechaAISO,
  hoyISO,
  parseFechaISO,
  primerDiaSemana,
  sumarDias,
} from '@/lib/fechas'
import { useDevFlag } from '@/dev/use-dev-flag'

// Ventana de reserva del demo: 3 meses hacia delante desde el mes actual —
// mismo criterio que el DIAS_VISIBLES=14 que este calendario reemplaza (un
// tope explícito, no una disponibilidad real: el motor de reservas real
// sigue pendiente del cliente, ver widget-reserva.tsx).
const MESES_ADELANTE = 3

// 2 fechas agotadas de ejemplo (mismo criterio que antes: hoy+3 y hoy+10) —
// el estado «sin plazas» tiene que existir en pantalla, es un frame de Figma
// y la realidad de un tour que se llena.
function fechasAgotadas(hoy: string): string[] {
  return [sumarDias(hoy, 3), sumarDias(hoy, 10)]
}

function formatoFechaCorta(iso: string): string {
  const d = parseFechaISO(iso)
  return `${DIAS_CORTOS[d.getDay()]}, ${d.getDate()} ${MESES_CORTOS[d.getMonth()]}.`
}

type Celda = { iso: string; dia: number }

// Grid mensual real (2026-07-17, pedido de Samuel: "que no tenga scroll,
// tipo calendario con un grid más convencional, con flechas para pasar entre
// meses") — reemplaza a la tira de 14 chips con scroll-x horizontal. Vive
// DENTRO del popover de CalendarioWidget (abajo), no suelto: 2ª vuelta,
// Samuel pidió que el campo de fecha se colapse a un input compacto para que
// el widget entero quepa en pantallas de laptop, y el grid solo aparezca al
// abrirlo — mismo criterio que Horario/Personas, que ya son campos de una
// fila.
function GridMensual({ fecha, onSeleccionar }: { fecha: string | null; onSeleccionar: (iso: string) => void }) {
  const hoy = hoyISO()
  const hoyDate = parseFechaISO(hoy)
  const agotados = fechasAgotadas(hoy)

  const mesActual = new Date(hoyDate.getFullYear(), hoyDate.getMonth(), 1)
  const mesMaximo = new Date(hoyDate.getFullYear(), hoyDate.getMonth() + MESES_ADELANTE, 1)
  const [mesVisible, setMesVisible] = useState(mesActual)

  const anio = mesVisible.getFullYear()
  const mes = mesVisible.getMonth()
  const puedeRetroceder = mesVisible.getTime() > mesActual.getTime()
  const puedeAvanzar = mesVisible.getTime() < mesMaximo.getTime()

  const celdas: Array<Celda | null> = []
  for (let i = 0; i < primerDiaSemana(anio, mes); i++) celdas.push(null)
  for (let dia = 1; dia <= diasEnMes(anio, mes); dia++) {
    celdas.push({ iso: fechaAISO(new Date(anio, mes, dia)), dia })
  }

  return (
    // Fondo blanco (2026-07-17, 2ª vuelta: pasa de bg-papel-hueso a bg-papel
    // — con el calendario ya vuelto popover, el gris ya no separa nada de un
    // "resto del widget" del que ahora vive DESPEGADO; es una card flotante
    // más, como el resto de dropdowns del sitio). Hover de días/flechas
    // vuelve a bg-papel-hueso (antes bg-papel, para contrastar con el gris
    // que este mismo bloque tenía).
    <div className="rounded-card bg-papel p-3 shadow-card ring-1 ring-linea">
      <div className="mb-2 flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setMesVisible(new Date(anio, mes - 1, 1))}
          disabled={!puedeRetroceder}
          aria-label="Mes anterior"
          className="grid size-6 place-items-center rounded-lg text-navy-sub transition-colors hover:bg-papel-hueso hover:text-navy disabled:pointer-events-none disabled:opacity-30"
        >
          <ChevronLeft className="size-4" />
        </button>
        <span className="min-w-[9ch] text-center text-xs font-semibold capitalize text-navy">
          {MESES[mes]} {anio}
        </span>
        <button
          type="button"
          onClick={() => setMesVisible(new Date(anio, mes + 1, 1))}
          disabled={!puedeAvanzar}
          aria-label="Mes siguiente"
          className="grid size-6 place-items-center rounded-lg text-navy-sub transition-colors hover:bg-papel-hueso hover:text-navy disabled:pointer-events-none disabled:opacity-30"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {DIAS_CORTOS.map((d) => (
          <span key={d} aria-hidden="true" className="text-center text-[0.6875rem] font-medium uppercase text-navy-soft">
            {d}
          </span>
        ))}
        {celdas.map((c, i) => {
          if (c === null) return <span key={`vacio-${i}`} aria-hidden="true" />
          const agotado = agotados.includes(c.iso)
          const pasado = c.iso < hoy
          const deshabilitado = agotado || pasado
          const elegido = fecha === c.iso
          return (
            <button
              key={c.iso}
              type="button"
              disabled={deshabilitado}
              onClick={() => onSeleccionar(c.iso)}
              aria-pressed={elegido}
              aria-label={`${diaSemanaLargo(c.iso)}${agotado ? ' — sin plazas' : ''}`}
              className={`aspect-square rounded-lg text-sm transition-colors ${
                elegido
                  ? 'bg-navy font-semibold text-white'
                  : deshabilitado
                    ? 'cursor-not-allowed text-linea-fuerte line-through'
                    : 'text-navy-sub hover:bg-papel-hueso hover:text-menta-texto'
              }`}
            >
              {c.dia}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function diaSemanaLargo(iso: string): string {
  return `${DIAS_CORTOS[parseFechaISO(iso).getDay()]} ${parseFechaISO(iso).getDate()}`
}

// Campo "Fecha" + popover (2026-07-17, 2ª vuelta — pedido de Samuel: reducir
// el alto del widget para que quepa en pantallas de laptop). Mismo trato que
// el campo de Personas (h-10, rounded-10, border-stroke-soft-200): un input
// compacto más, no una pieza que domina el widget — el grid solo se pinta al
// abrirlo, igual que un date-picker cualquiera. Clic fuera o Escape cierran
// (mismo patrón que los dropdowns del header — ver lib/use-menu-dropdown.ts);
// elegir un día también cierra, para no obligar a un 2º clic.
export function CalendarioWidget({
  fecha,
  onSeleccionar,
  hora = null,
}: {
  fecha: string | null
  onSeleccionar: (iso: string) => void
  /** [v2 2026-07-28] Hora de salida elegida, para mostrarla junto a la fecha
   *  (pedido de Samuel: «que quede súper claro fecha y hora que se está
   *  escogiendo»). Al haber pasado el horario a píldoras de una línea, el
   *  campo de fecha es el único sitio donde las dos decisiones se leen
   *  juntas — y son las dos que definen la reserva.
   *  `null` = todavía no hay horario (o el tour no publica ninguno). */
  hora?: string | null
}) {
  const [abierto, setAbierto] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  // [dev-mode] deep-link del Glosario Dev — ver src/dev/dev-registry.ts.
  // ?dev-widget=calendario fuerza el popover abierto → frame limpio para
  // Figma (el resto de valores de dev-widget los consume WidgetReserva).
  useDevFlag('dev-widget', (v) => {
    if (v === 'calendario') setAbierto(true)
  })

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
      {/* [v2 2026-07-27] SIN label visible (pedido de Samuel, para bajar el
          alto del widget). Es seguro porque el campo ya se explica solo: icono
          de calendario + placeholder «Elige una fecha», que es exactamente lo
          que hace Viator.
          ⚠️ Pero el label NO desaparece del todo: pasa a `aria-label` en el
          botón. Sin él, un lector de pantalla anunciaría «Elige una fecha,
          botón» sin decir de qué campo se trata — y aquí el ahorro de alto no
          justifica perder eso. */}
      {/* La fecha es la ENTRADA primaria del flujo (2ª vuelta 2026-07-17,
          pedido de Samuel: "no parece importante"). Dos señales de jerarquía
          sobre el resto de campos: (1) el icono va en aqua-dark —el acento de
          marca, "con cuentagotas"— en vez de gris, y (2) mientras NO hay fecha
          elegida, el campo lleva un anillo aqua suave de "empieza aquí"; al
          elegir vuelve al borde neutro como los demás. */}
      <button
        type="button"
        onClick={() => setAbierto((a) => !a)}
        // El nombre accesible incluye la hora: quien navega con lector de
        // pantalla tiene que oír la misma información que se ve.
        aria-label={
          fecha && hora
            ? `Fecha y hora del tour: ${formatoFechaCorta(fecha)}, salida ${hora}`
            : 'Fecha del tour'
        }
        aria-expanded={abierto}
        className={`flex h-10 w-full items-center gap-2 rounded-10 border bg-bg-white-0 px-3 text-left text-paragraph-sm text-text-strong-950 transition ${
          fecha ? 'border-stroke-soft-200' : 'border-aqua/40 ring-1 ring-aqua/20'
        }`}
      >
        <CalendarDays className="size-5 shrink-0 text-aqua-dark" aria-hidden="true" />
        <span className={fecha ? '' : 'text-text-sub-600'}>
          {fecha ? formatoFechaCorta(fecha) : 'Elige una fecha'}
          {fecha && hora ? (
            <>
              <span className="mx-1.5 text-navy-soft/50" aria-hidden="true">
                &middot;
              </span>
              <span className="font-semibold">{hora}</span>
            </>
          ) : null}
        </span>
        <ChevronDown
          className={`ml-auto size-4 shrink-0 text-text-sub-600 transition-transform ${abierto ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {abierto ? (
        <div className="absolute left-0 top-full z-20 mt-2 w-full min-w-[19rem] sm:w-[22rem]">
          <GridMensual
            fecha={fecha}
            onSeleccionar={(iso) => {
              onSeleccionar(iso)
              setAbierto(false)
            }}
          />
        </div>
      ) : null}
    </div>
  )
}
