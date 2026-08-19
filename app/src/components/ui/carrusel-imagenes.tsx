import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { t } from '@/lib/i18n'

// Carrusel de imágenes reusable (v3-F20, PLAN-v3.md §18) — las fotos reales de
// un servicio deslizándose solas; al hover (puntero fino) se PAUSA y aparecen
// las flechas para pasarlas a mano. Los puntos van siempre visibles (nav en
// táctil, donde no hay hover). Un componente React = un componente de Figma:
// la pieza vive en ui/ porque es reusable (hoy la usa la TourCard).
//
// La curva del deslizado (duración/easing) vive en el CSS de la pista
// (.carrusel-pista, componentes.css); el intervalo del auto-avance lo lee este
// hook del token --carrusel-intervalo. Con prefers-reduced-motion el
// auto-avance NO arranca (contenido en movimiento automático = WCAG 2.2.2):
// las flechas y los puntos siguen, pero nada se mueve solo.

// Lee un token de tiempo del :root (--x: 4s | 400ms) y lo devuelve en ms.
function leerMs(nombre: string, fallback: number): number {
  if (typeof window === 'undefined') return fallback
  const bruto = getComputedStyle(document.documentElement).getPropertyValue(nombre).trim()
  const n = parseFloat(bruto)
  if (Number.isNaN(n)) return fallback
  return bruto.endsWith('ms') ? n : n * 1000
}

export function CarruselImagenes({
  imagenes,
  etiqueta,
  autoAvance = true,
  className = '',
}: {
  imagenes: string[]
  /** describe el conjunto para lectores de pantalla (p. ej. el nombre del tour) */
  etiqueta: string
  /** [dev-mode] false congela el carrusel en su 1ª foto (frame para Figma) */
  autoAvance?: boolean
  className?: string
}) {
  const [indice, setIndice] = useState(0)
  const [pausado, setPausado] = useState(false)
  const n = imagenes.length

  const ir = (i: number) => setIndice(((i % n) + n) % n)

  useEffect(() => {
    if (!autoAvance || n <= 1 || pausado) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => setIndice((i) => (i + 1) % n), leerMs('--carrusel-intervalo', 4000))
    return () => window.clearInterval(id)
  }, [autoAvance, n, pausado])

  if (n === 0) return null

  return (
    <div
      className={`group/carrusel relative overflow-hidden bg-papel-hueso ${className}`}
      onPointerEnter={() => setPausado(true)}
      onPointerLeave={() => setPausado(false)}
      role="group"
      aria-roledescription="carousel"
      aria-label={etiqueta}
    >
      {/* Pista: las N fotos una al lado de otra (cada una al 100% del ancho),
          corrida -indice*100% en X. El deslizado (transición) está en CSS. */}
      <div className="carrusel-pista" style={{ transform: `translateX(-${indice * 100}%)` }}>
        {imagenes.map((foto) => (
          <img
            key={foto}
            src={`/fotos/${foto}.webp`}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="size-full shrink-0 basis-full object-cover"
          />
        ))}
      </div>

      {n > 1 && (
        <>
          <button
            type="button"
            onClick={() => ir(indice - 1)}
            aria-label={t('Previous photo')}
            className="absolute left-2 top-1/2 z-20 grid size-8 -translate-y-1/2 place-items-center rounded-chip bg-papel/85 text-navy opacity-0 shadow-sm backdrop-blur-sm transition hover:bg-papel focus-visible:opacity-100 group-hover/carrusel:opacity-100"
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => ir(indice + 1)}
            aria-label={t('Next photo')}
            className="absolute right-2 top-1/2 z-20 grid size-8 -translate-y-1/2 place-items-center rounded-chip bg-papel/85 text-navy opacity-0 shadow-sm backdrop-blur-sm transition hover:bg-papel focus-visible:opacity-100 group-hover/carrusel:opacity-100"
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>

          {/* Puntos — siempre visibles: son la única nav en táctil (sin hover) */}
          <div className="absolute inset-x-0 bottom-2.5 z-20 flex justify-center gap-1.5">
            {imagenes.map((foto, i) => (
              <button
                key={foto}
                type="button"
                onClick={() => ir(i)}
                aria-label={`Go to photo ${i + 1} of ${n}`}
                aria-current={i === indice}
                className={`h-1.5 rounded-chip shadow-sm transition-all ${
                  i === indice ? 'w-4 bg-white' : 'w-1.5 bg-white/60 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
