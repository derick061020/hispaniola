import { useCallback, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import * as CompactButton from '@/components/alignui/compact-button'
import * as Modal from '@/components/alignui/modal'

// Lightbox de la galería de la ficha (wireframe A1: "Ver 33 fotos →").
//
// Etapa A (PLAN-ALIGNUI.md): el andamiaje del overlay pasa a Modal del sistema
// (Radix Dialog) — scroll-lock, focus-trap con retorno al disparador, Escape y
// portal salen del primitive, no de efectos a mano (los 4 arreglos de UX que
// antes heredábamos de MenuMovil viven ahora en Radix). Lo que sigue siendo
// nuestro: el CONTENIDO de galería — contador, flechas con wraparound, ← →
// como navegación primaria de teclado — y la piel fullscreen sobre navy/95,
// que se monta con overrides de className sobre el vendor (patrón del cerebro:
// «override sin tocar el vendor»).

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
  const n = fotos.length

  const ir = useCallback((i: number) => setIndice(((i % n) + n) % n), [n])

  // Devolver el foco al disparador al cerrar. Radix lo haría con su propio
  // Trigger, pero aquí el Root entero se desmonta por render condicional del
  // padre (y el deep-link dev abre sin disparador): medido, el foco caía a
  // BODY. Este cleanup corre DESPUÉS del de Radix (React limpia hijos antes
  // que padres), así que la última palabra es nuestra.
  useEffect(() => {
    const disparador = document.activeElement as HTMLElement | null
    return () => disparador?.focus()
  }, [])

  // ← → pasan foto. Escape NO va aquí: lo maneja Radix (onOpenChange).
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') ir(indice - 1)
      if (e.key === 'ArrowRight') ir(indice + 1)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [indice, ir])

  return (
    <Modal.Root open onOpenChange={(abierto) => (abierto ? undefined : onCerrar())}>
      <Modal.Content
        showClose={false}
        // El overlay del sistema es --color-overlay (navy 70%) con blur; una
        // galería quiere el fondo casi opaco y sin blur (la foto ES el foco).
        overlayClassName="bg-navy/95 p-0 backdrop-blur-none"
        // De card centrada de 400px a lienzo fullscreen: la pila de conflictos
        // la resuelve tailwind-merge (cnExt del vendor).
        className="flex h-dvh w-screen max-w-none flex-col rounded-none bg-transparent shadow-none focus:outline-none"
        aria-describedby={undefined}
        // Click en el FONDO cierra; los controles y la foto paran la
        // propagación para que pasar fotos no cierre por accidente.
        onClick={onCerrar}
      >
        <Modal.Title className="sr-only">Galería de {etiqueta}</Modal.Title>

        <div className="flex items-center justify-between px-5 py-4 text-white">
          <span className="text-sm text-white/70">
            {indice + 1} / {n}
          </span>
          <Modal.Close asChild>
            <CompactButton.Root
              variant="ghost"
              size="large"
              aria-label="Cerrar galería"
              className="text-white hover:bg-white/10 hover:text-white"
            >
              <CompactButton.Icon as={X} />
            </CompactButton.Root>
          </Modal.Close>
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
      </Modal.Content>
    </Modal.Root>
  )
}
