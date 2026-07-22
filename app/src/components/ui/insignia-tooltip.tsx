import { useEffect, useRef, useState, type ElementType } from 'react'
import * as StatusBadge from '@/components/alignui/status-badge'
import * as Tooltip from '@/components/alignui/tooltip'

// Insignia con explicación al pasar el ratón (correcciones de Samuel
// 2026-07-22, ficha de producto): «agrega el badge de distintivo de
// excelencia que al ponerte hover sale un tooltip».
//
// Es el patrón de Viator/GetYourGuide: la insignia sola no dice nada (¿quién
// la da? ¿con qué criterio?), así que el texto que la justifica vive a un
// hover de distancia en vez de ocupar sitio en la cabecera.
//
// POR QUÉ NO ES UN Tooltip DE RADIX «Y YA»: Radix Tooltip está diseñado
// SOLO para puntero — su propia documentación dice que en táctil no abre (y
// recomienda Popover). Esta insignia vive en el hero de la ficha, que es
// donde más móvil hay de todo el sitio, así que un tooltip que en móvil no
// existe sería la mitad del componente. Solución: el Root va CONTROLADO y se
// abre por dos vías —`hover` (lo que Radix ya sabe hacer) y `fijado` (un
// toggle por click/tap que Radix no trae)—. En escritorio se comporta como
// un tooltip normal; en móvil, tocar la insignia lo abre y tocar fuera lo
// cierra. Un solo componente, no dos piezas paralelas.
//
// En Figma: 2 estados del mismo componente (insignia / insignia + tooltip),
// con el tooltip mapeado al Tooltip del kit de AlignUI.

type Props = {
  /** Icono de la insignia (lucide). */
  icono: ElementType
  /** Texto de la propia insignia. */
  children: React.ReactNode
  /** Titular del tooltip — la frase corta que nombra el distintivo. */
  titulo: string
  /** Cuerpo del tooltip: el criterio que justifica la insignia. */
  texto: string
  /**
   * Slot de color del StatusBadge (mismo lenguaje que el resto de chips).
   *
   * ⚠️ NO SE ADMITE `pending` — y esto es una trampa con víctimas. `pending`
   * pinta `bg-warning-lighter text-warning-base`, y la familia `warning` está
   * SIN DEFINIR a propósito en styles/alignui.css («antes de inventar un
   * amarillo que la dirección B no tiene, ese mapeo se decide con Samuel»).
   * Tailwind v4 no genera utilidades de un slot inexistente, así que la
   * insignia sale con fondo TRANSPARENTE y texto heredado: sobre el papel
   * casi no se nota, pero estas viven sobre la foto del hero y ahí
   * desaparecen. Es exactamente lo que le pasaba al badge «#1 en TripAdvisor»
   * desde que se creó (bug medido el 2026-07-22, al mover ese badge al
   * eyebrow). El tipo lo prohíbe para que no vuelva a pasar por descuido.
   */
  status?: 'completed' | 'disabled'
  variant?: 'light' | 'stroke'
}

export function InsigniaTooltip({ icono, children, titulo, texto, status = 'completed', variant = 'stroke' }: Props) {
  const [hover, setHover] = useState(false)
  const [fijado, setFijado] = useState(false)
  const disparador = useRef<HTMLButtonElement>(null)

  // Cierre del modo «fijado» al tocar fuera. No se delega en
  // `onPointerDownOutside` del Content: el contenido vive en un portal y con
  // el tooltip cerrado no hay Content montado que escuche, así que el
  // listener tiene que estar en el documento. El pointerdown sobre la propia
  // insignia se ignora aquí a propósito — de eso se encarga su onClick, y si
  // lo tratáramos en los dos sitios el toggle se anularía a sí mismo.
  useEffect(() => {
    if (!fijado) return
    const alTocar = (e: PointerEvent) => {
      if (disparador.current?.contains(e.target as Node)) return
      setFijado(false)
    }
    document.addEventListener('pointerdown', alTocar)
    return () => document.removeEventListener('pointerdown', alTocar)
  }, [fijado])

  return (
    <Tooltip.Provider>
      <Tooltip.Root
        open={hover || fijado}
        onOpenChange={setHover}
        // 120ms: lo justo para no dispararse al cruzar la fila de chips de
        // camino a otro sitio, sin que se sienta perezoso al apuntar.
        delayDuration={120}
      >
        <Tooltip.Trigger asChild>
          <StatusBadge.Root asChild status={status} variant={variant}>
            <button
              ref={disparador}
              type="button"
              onClick={() => setFijado((f) => !f)}
              // cursor-help, no pointer: no navega a ningún sitio — lo único
              // que hace es explicarse.
              className="cursor-help focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              <StatusBadge.Icon as={icono} />
              {children}
            </button>
          </StatusBadge.Root>
        </Tooltip.Trigger>

        <Tooltip.Content
          variant="light"
          size="medium"
          side="bottom"
          collisionPadding={16}
          onEscapeKeyDown={() => setFijado(false)}
          // max-w-72: el texto es una frase de dos líneas, no un párrafo —
          // más ancho y deja de leerse como una nota al pie de la insignia.
          className="max-w-72"
        >
          <p className="font-semibold text-navy">{titulo}</p>
          <p className="mt-1 text-paragraph-xs text-navy-sub">{texto}</p>
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}
