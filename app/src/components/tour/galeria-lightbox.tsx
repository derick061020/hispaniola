import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

// Lightbox de la galería de la ficha (wireframe A1: "Ver 33 fotos →").
//
// Los 4 arreglos de UX que MenuMovil ya resolvió (PLAN-v3.md §13.4) se
// heredan tal cual, porque el problema es el mismo —un overlay modal sobre la
// página—: scroll del fondo bloqueado guardando el valor PREVIO (no se asume
// `''`: el CTA sticky o un futuro botón flotante pueden tocar lo mismo), foco
// que entra al cerrar y vuelve al disparador, Escape, y click fuera. Va por
// portal a document.body por la misma razón que la hoja del menú: el lightbox
// no puede quedar preso del contexto de apilamiento de un ancestro.
//
// Extra propio de una galería: ← → pasan foto (aquí el teclado es navegación
// primaria, no un extra de accesibilidad).

export function GaleriaLightbox({
  fotos,
  indiceInicial,
  etiqueta,
  onCerrar,
}: {
  fotos: string[]
  indiceInicial: number
  /** describe el conjunto para lectores de pantalla (el nombre del tour) */
  etiqueta: string
  onCerrar: () => void
}) {
  const [indice, setIndice] = useState(indiceInicial)
  const cerrarBtnRef = useRef<HTMLButtonElement>(null)
  const n = fotos.length

  const ir = useCallback((i: number) => setIndice(((i % n) + n) % n), [n])

  useEffect(() => {
    const disparador = document.activeElement as HTMLElement | null
    const overflowPrevio = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    cerrarBtnRef.current?.focus()
    return () => {
      document.body.style.overflow = overflowPrevio
      disparador?.focus()
    }
  }, [])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onCerrar()
      if (e.key === 'ArrowLeft') ir(indice - 1)
      if (e.key === 'ArrowRight') ir(indice + 1)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [indice, ir, onCerrar])

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Galería de ${etiqueta}`}
      className="fixed inset-0 z-50 flex flex-col bg-navy/95"
      // Click en el FONDO cierra; los controles y la foto paran la propagación
      // (abajo) para que pasar fotos no cierre la galería por accidente.
      onClick={onCerrar}
    >
      <div className="flex items-center justify-between px-5 py-4 text-white">
        <span className="text-sm text-white/70">
          {indice + 1} / {n}
        </span>
        <button
          ref={cerrarBtnRef}
          type="button"
          onClick={onCerrar}
          aria-label="Cerrar galería"
          className="grid size-10 place-items-center rounded-lg text-white transition-colors hover:bg-white/10"
        >
          <X className="size-5" />
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center gap-2 overflow-hidden px-2 pb-6 sm:px-5">
        {n > 1 ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              ir(indice - 1)
            }}
            aria-label="Foto anterior"
            className="grid size-10 shrink-0 place-items-center rounded-chip bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <ChevronLeft className="size-5" />
          </button>
        ) : null}

        {/* ⚠️ La foto va dentro de un contenedor `min-w-0 flex-1`, no suelta en
            la fila: como flex item, su `max-w-full` se resuelve contra la fila
            ENTERA, así que se llevaba los 1400px y empujaba las flechas fuera
            del viewport (medido: left −28 y 1428 a 1440 de ancho) — `shrink-0`
            en las flechas no protege de eso, porque el que no encoge es quien
            crece. Con `min-w-0 flex-1` la foto solo puede ocupar lo que sobra. */}
        <div className="flex h-full min-w-0 flex-1 items-center justify-center">
          <img
            src={`/fotos/${fotos[indice]}.webp`}
            alt={`${etiqueta} — foto ${indice + 1} de ${n}`}
            onClick={(e) => e.stopPropagation()}
            className="max-h-full max-w-full rounded-card object-contain"
          />
        </div>

        {n > 1 ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              ir(indice + 1)
            }}
            aria-label="Foto siguiente"
            className="grid size-10 shrink-0 place-items-center rounded-chip bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <ChevronRight className="size-5" />
          </button>
        ) : null}
      </div>
    </div>,
    document.body,
  )
}
