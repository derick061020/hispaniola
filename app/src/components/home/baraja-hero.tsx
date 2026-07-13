import { useCallback, useEffect, useRef, useState } from 'react'
import { TOURS, bookingCta, formatoDinero, type Tour } from '@/data/home'
import { EnlacePrototipo } from '@/components/ui/enlace-prototipo'
import { useDevFlag } from '@/dev/use-dev-flag'

// Baraja del hero — sustituye al buscador de disponibilidad (decisión de
// Samuel, ver app/PLAN-v2.md §2). Las 4 cards son los TOURS: cada una es un
// producto real con precio y CTA, así que la baraja asume el papel de camino
// a la reserva que antes tenía el buscador.
//
// Mecánica: la card activa (profundidad 0) está al frente y grande; las demás
// asoman hacia arriba, encogidas. Al avanzar, la activa SUBE, encoge y se va
// al final de la cola; la siguiente baja y se agranda hasta activa.
//
// ⚠️ Para el traspaso a Figma (playbook animaciones-a-figma): esto es un LOOP
// INFINITO → se construye como componente interactivo con una variante por
// card activa + Smart Animate. Por eso las 4 cards existen SIEMPRE en el DOM
// (solo cambia su transform/opacidad, nunca se montan/desmontan): es lo que
// permite que Smart Animate interpole entre variantes. Los delays salen de
// los tokens --baraja-*, no de valores sueltos.

/** Estilo por profundidad. Índice = posición en la cola (0 = activa).
 *
 * Los `y` están MEDIDOS, no elegidos a ojo: `scale()` transforma desde el
 * centro, así que encoger una card de ~380px ya baja su borde superior
 * (380 · (1−escala) / 2). Para que asome N px por encima de la activa, el
 * translateY tiene que compensar ESO y además subir N px más. Con los valores
 * "naturales" (−18px) la baraja no se veía: las cards de atrás quedaban
 * escondidas justo detrás de la activa. */
const PROFUNDIDAD = [
  { escala: 1, y: 0, opacidad: 1, z: 40 }, // activa
  { escala: 0.94, y: -30, opacidad: 0.9, z: 30 }, // asoma ~19px
  { escala: 0.88, y: -56, opacidad: 0.7, z: 20 }, // asoma ~33px
  { escala: 0.82, y: -78, opacidad: 0, z: 10 }, // fuera de la baraja (esperando turno)
] as const

function leerMs(nombre: string, porDefecto: number) {
  if (typeof window === 'undefined') return porDefecto
  const valor = getComputedStyle(document.documentElement).getPropertyValue(nombre).trim()
  const n = Number.parseFloat(valor)
  return Number.isFinite(n) ? n : porDefecto
}

export function BarajaHero() {
  // `orden` guarda los slugs; orden[0] es la card activa.
  const [orden, setOrden] = useState<string[]>(() => TOURS.map((t) => t.slug))
  const [pausada, setPausada] = useState(false)
  // Congelada = un deep-link del Dev Mode fijó una card; no auto-avanza.
  const [congelada, setCongelada] = useState(false)
  const intervaloRef = useRef<number | null>(null)

  const traerAlFrente = useCallback((slug: string) => {
    setOrden((actual) => {
      const i = actual.indexOf(slug)
      if (i <= 0) return actual
      return [...actual.slice(i), ...actual.slice(0, i)]
    })
  }, [])

  // [dev-mode] — congela una card como activa (frame limpio para Figma) o
  // simula reduced-motion. Ver src/dev/dev-registry.ts
  useDevFlag('dev-baraja', (v) => {
    setCongelada(true)
    if (v !== 'estatica') traerAlFrente(v)
  })

  const reducirMovimiento =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (pausada || congelada || reducirMovimiento) return
    const intervalo = leerMs('--baraja-intervalo', 4000)
    intervaloRef.current = window.setInterval(() => {
      setOrden((actual) => [...actual.slice(1), actual[0]])
    }, intervalo)
    return () => {
      if (intervaloRef.current !== null) window.clearInterval(intervaloRef.current)
    }
  }, [pausada, congelada, reducirMovimiento])

  return (
    // Ancho EXPLÍCITO a propósito: todas las cards son `absolute`, así que no
    // hay contenido en flujo que dimensione la caja — sin un ancho fijo el
    // contenedor colapsa a 0 dentro de una columna de grid `auto`.
    <div
      className="relative h-baraja-alto w-baraja-ancho shrink-0 sm:h-baraja-alto-sm sm:w-baraja-ancho-sm"
      onMouseEnter={() => setPausada(true)}
      onMouseLeave={() => setPausada(false)}
    >
      {TOURS.map((tour) => {
        const profundidad = orden.indexOf(tour.slug)
        const p = PROFUNDIDAD[Math.min(profundidad, PROFUNDIDAD.length - 1)]
        const activa = profundidad === 0
        return (
          <CardBaraja
            key={tour.slug}
            tour={tour}
            activa={activa}
            estilo={p}
            onClick={() => traerAlFrente(tour.slug)}
          />
        )
      })}

      {/* Indicadores — también dicen cuál está activa cuando está congelada */}
      <div className="absolute -bottom-1 left-1/2 z-50 flex -translate-x-1/2 gap-1.5">
        {TOURS.map((tour) => (
          <button
            key={tour.slug}
            type="button"
            aria-label={`Ver ${tour.nombre}`}
            onClick={() => traerAlFrente(tour.slug)}
            className={`h-1.5 rounded-chip transition-all ${
              orden[0] === tour.slug ? 'w-6 bg-papel' : 'w-1.5 bg-papel/50 hover:bg-papel/80'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

function CardBaraja({
  tour,
  activa,
  estilo,
  onClick,
}: {
  tour: Tour
  activa: boolean
  estilo: (typeof PROFUNDIDAD)[number]
  onClick: () => void
}) {
  const contenido = (
    <>
      <div className="relative h-44 overflow-hidden sm:h-52">
        <img src={`/fotos/${tour.foto}.webp`} alt="" className="size-full object-cover" />
        <span className="absolute bottom-2.5 left-2.5 rounded-chip bg-navy/85 px-2.5 py-1 text-xs font-medium text-white">
          {tour.audienciaChip}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="font-display text-h3 font-semibold text-navy">{tour.nombre}</p>
        <p className="text-sm text-navy-soft">
          ★ {tour.rating} ({tour.resenas.toLocaleString('en-US')}) · {tour.duracionCorta}
          {tour.maxPax ? ` · máx. ${tour.maxPax}` : ''}
        </p>
        <div className="mt-auto flex items-end justify-between pt-3">
          <div>
            <p className="text-xs text-navy-soft">{tour.precioLight !== null ? 'desde' : ''}</p>
            <p className="font-display text-precio font-semibold text-navy">
              {tour.precioLight !== null ? formatoDinero(tour.precioLight) : bookingCta[tour.booking]}
            </p>
          </div>
          <span className="rounded-btn bg-coral px-4 py-2 text-xs font-semibold text-white">
            {bookingCta[tour.booking]}
          </span>
        </div>
      </div>
    </>
  )

  // El borde blanco separa las capas donde se solapan: sin él, el trozo de
  // foto de la card de atrás se funde con la foto de la de delante.
  const clases =
    'absolute inset-x-0 top-0 flex flex-col overflow-hidden rounded-hero bg-papel shadow-baraja ring-4 ring-papel'
  const estiloInline = {
    transform: `translateY(${estilo.y}px) scale(${estilo.escala})`,
    opacity: estilo.opacidad,
    zIndex: estilo.z,
    transition: `transform var(--baraja-transicion) var(--baraja-easing), opacity var(--baraja-transicion) var(--baraja-easing)`,
    pointerEvents: estilo.opacidad === 0 ? ('none' as const) : ('auto' as const),
  }

  // La card activa es un enlace al producto (camino a la reserva). Las de
  // atrás son botones: su clic las trae al frente, no navega.
  if (activa) {
    return (
      <EnlacePrototipo className={clases} style={estiloInline}>
        {contenido}
      </EnlacePrototipo>
    )
  }
  return (
    <button type="button" onClick={onClick} className={`${clases} text-left`} style={estiloInline}>
      {contenido}
    </button>
  )
}
