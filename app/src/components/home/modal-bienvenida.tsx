import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useDevFlag } from '@/dev/use-dev-flag'

const CLAVE_SESSION = 'hispaniola-bienvenida-vista'
const VIDEO_ID = 'K65cchLFwRs'

// Modal de bienvenida (2026-07-17, pedido de Samuel) — la web actual solo
// expone este video como thumbnail "click to play" dentro de la página; aquí
// SÍ aparece como popup automático al entrar, pero UNA VEZ POR SESIÓN:
// sessionStorage (no localStorage) es la elección a propósito — sobrevive a
// navegar entre páginas de la SPA dentro de la misma pestaña, pero se olvida
// al cerrar el navegador o borrar el storage/caché, que es exactamente
// cuándo Samuel quiere que vuelva a aparecer. Con localStorage no volvería
// a mostrarse nunca más en ese navegador.
//
// Diálogo a mano (NO alignui/modal.tsx): CLAUDE.md reserva AlignUI en la home
// solo para el Accordion de FAQ — el resto del shell sigue sin esa librería.
// Mismos 3 arreglos de accesibilidad que MenuMovil (bloqueo de scroll, foco
// de entrada, Escape) vía un portal a document.body.
export function ModalBienvenida() {
  const [abierto, setAbierto] = useState(false)
  const cerrarBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (sessionStorage.getItem(CLAVE_SESSION)) return
    setAbierto(true)
  }, [])

  // [dev-mode] ?dev-bienvenida=abierto fuerza el modal para poder revisarlo
  // sin borrar sessionStorage a mano. Ver src/dev/dev-registry.ts.
  useDevFlag('dev-bienvenida', (v) => {
    if (v === 'abierto') setAbierto(true)
  })

  function cerrar() {
    sessionStorage.setItem(CLAVE_SESSION, '1')
    setAbierto(false)
  }

  useEffect(() => {
    if (!abierto) return
    const overflowPrevio = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    cerrarBtnRef.current?.focus()

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') cerrar()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = overflowPrevio
      document.removeEventListener('keydown', onKeyDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [abierto])

  if (!abierto) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-navy/60 p-4 backdrop-blur-sm"
      onClick={cerrar}
      aria-hidden="true"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Video de bienvenida"
        className="relative w-full max-w-3xl overflow-hidden rounded-card-grande bg-navy shadow-hero"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={cerrarBtnRef}
          type="button"
          onClick={cerrar}
          aria-label="Cerrar video"
          className="absolute right-3 top-3 z-10 grid size-bienvenida-cerrar place-items-center rounded-full bg-navy/70 text-white transition hover:bg-navy"
        >
          <X className="size-5" />
        </button>

        {/* mute=1 obligatorio: el modal se abre SOLO (sin gesto del usuario),
            así que un autoplay con sonido lo bloquearía el navegador — YouTube
            deja controles propios para desmutear dentro del iframe. */}
        <div className="aspect-video w-full">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&mute=1&rel=0`}
            title="Video de bienvenida — Hispaniola Aquatic Adventures"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="size-full border-0"
          />
        </div>
      </div>
    </div>,
    document.body,
  )
}
