import { useEffect, useState } from 'react'
import { X, Clock } from 'lucide-react'
import { TOURS } from '@/data/home'
import { useDevFlag } from '@/dev/use-dev-flag'

// «Pruebas de compra» — avisos de reservas recientes (correcciones v1 del
// cliente, 2026-07-20 — planes/01-home.md slide 19: «agregar pruebas de
// compra», con la captura de un badge tipo "Last reservation: 50 minutes ago").
//
// ⚠️ ESTO ES UN PROTOTIPO VISUAL, Y SE DICE. No hay motor de reservas
// conectado (xpotours sigue pendiente del cliente), así que no existen
// reservas reales que mostrar. Las alternativas eran:
//   (a) inventarse un feed y presentarlo como real → es justo lo que el
//       proyecto no hace, y con un dato de venta es además engañoso;
//   (b) no construir nada hasta tener backend → el cliente no vería su
//       petición reflejada;
//   (c) construirlo con datos de EJEMPLO y marcarlo como tal.
// Se eligió (c): el aviso lleva la palabra «ejemplo» visible. Cuando el motor
// esté conectado, se sustituye la fuente de datos, se quita esa marca y el
// componente no cambia.
//
// DECISIÓN ABIERTA PARA SAMUEL: este patrón (urgencia social) es de manual de
// growth, y la dirección del proyecto es «Charter Premium». Un hotel de lujo
// no te dice «¡3 personas están viendo esto!». Si el tono no encaja, se
// borra el componente y su línea en home.tsx — no tiene más dependencias.
//
// Comportamiento: aparece abajo-izquierda tras una espera, se queda unos
// segundos, se va, y rota al siguiente tour. Cerrable (y al cerrar no vuelve
// en toda la sesión). Respeta prefers-reduced-motion (sin animación de
// entrada) y no se monta en móvil, donde taparía el CTA sticky de reserva.

// Minutos «desde la última reserva» de cada aviso. Son de ejemplo, y por eso
// están aquí y no en data/ — el día que haya motor, este array desaparece
// entero en vez de quedar como un dato del proyecto que alguien pueda creerse.
const EJEMPLOS = [
  { minutos: 12 },
  { minutos: 47 },
  { minutos: 5 },
  { minutos: 23 },
]

export function PruebaSocial() {
  const [indice, setIndice] = useState(0)
  const [visible, setVisible] = useState(false)
  const [cerrado, setCerrado] = useState(false)
  // [dev-mode] ?dev-prueba=visible fuerza el aviso ya montado, sin esperar el
  // ciclo → frame limpio para Figma. Ver dev-registry.ts.
  const [forzado, setForzado] = useState(false)
  useDevFlag('dev-prueba', (v) => setForzado(v === 'visible')) // [dev-mode]

  useEffect(() => {
    if (cerrado || forzado) return
    if (typeof window === 'undefined') return
    // No en móvil: taparía el CTA sticky de reserva del hero.
    if (!window.matchMedia('(min-width: 768px)').matches) return

    let cancelado = false
    const timers: number[] = []

    const ciclo = () => {
      if (cancelado) return
      setVisible(true)
      timers.push(
        window.setTimeout(() => {
          if (cancelado) return
          setVisible(false)
          timers.push(
            window.setTimeout(() => {
              if (cancelado) return
              setIndice((i) => (i + 1) % EJEMPLOS.length)
              ciclo()
            }, 9000),
          )
        }, 6000),
      )
    }

    // La primera espera es larga a propósito: saltar encima del visitante
    // apenas carga la página es exactamente lo que hacía el popup que este
    // mismo lote de correcciones manda eliminar.
    timers.push(window.setTimeout(ciclo, 8000))

    return () => {
      cancelado = true
      for (const t of timers) window.clearTimeout(t)
    }
  }, [cerrado, forzado])

  if (cerrado) return null
  const mostrado = forzado || visible
  const ejemplo = EJEMPLOS[indice]
  const tour = TOURS[indice % TOURS.length]

  return (
    <div
      aria-live="polite"
      className={`pointer-events-none fixed bottom-5 left-5 z-30 hidden md:block ${
        mostrado ? 'prueba-social--dentro' : 'prueba-social--fuera'
      }`}
    >
      <div className="pointer-events-auto flex items-start gap-3 rounded-card bg-papel p-3 pr-2 shadow-card ring-1 ring-linea">
        <div
          aria-hidden="true"
          className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-menta text-menta-texto"
        >
          <Clock className="size-4" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-navy">
            Última reserva hace {ejemplo.minutos} min
          </p>
          <p className="truncate text-xs text-navy-soft">{tour.nombre}</p>
          {/* La marca de «ejemplo» no es letra pequeña legal: es la diferencia
              entre una demo y un engaño. No quitarla hasta que el dato sea real. */}
          <p className="mt-1 text-[0.6875rem] uppercase tracking-wide text-navy-soft/70">
            Dato de ejemplo
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCerrado(true)}
          aria-label="Cerrar aviso"
          className="ml-1 shrink-0 rounded-full p-1.5 text-navy-soft transition-colors hover:bg-papel-hueso hover:text-navy"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  )
}
