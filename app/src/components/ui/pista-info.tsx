import { useEffect, useRef, useState } from 'react'
import { Info } from 'lucide-react'
import * as Tooltip from '@/components/alignui/tooltip'

// «i» de ayuda con explicación al pasar el ratón (correcciones v2,
// 2026-07-27 — pedido de Samuel para los tramos de edad del widget: «que
// ambos tengan un icono "i" que al ponerse encima diga que de 1 a 3 años es
// gratis, y que niños se considera de 4 a 7 años»).
//
// Es la versión mínima de `ui/insignia-tooltip.tsx`: mismo comportamiento,
// sin la insignia. Se separa en vez de añadirle una variante a aquella porque
// aquel componente ES una insignia (StatusBadge con texto) y esto es solo un
// disparador de 16px al lado de una etiqueta — meterlos en el mismo archivo
// daría un componente con dos mitades excluyentes.
//
// ⚠️ POR QUÉ NO ES UN Tooltip DE RADIX «Y YA» — mismo motivo que allí, y aquí
// importa incluso más: Radix Tooltip está pensado SOLO para puntero (su propia
// documentación dice que en táctil no abre). Esto vive en el WIDGET DE
// RESERVA, que es la superficie con más móvil de todo el sitio; un tooltip que
// en móvil no existe sería medio componente. Por eso el Root va CONTROLADO y
// abre por dos vías: `hover` (lo que Radix ya hace) y `fijado` (un toggle por
// tap que Radix no trae).
//
// La información que explica NO es decorativa: dice quién paga y quién no. Si
// en móvil no se pudiera abrir, una familia descubriría el precio real en el
// paso de pago — justo el patrón que este proyecto evita.
export function PistaInfo({ texto, etiqueta }: { texto: string; etiqueta: string }) {
  const [hover, setHover] = useState(false)
  const [fijado, setFijado] = useState(false)
  const disparador = useRef<HTMLButtonElement>(null)

  // El listener va en el documento y no en `onPointerDownOutside` del Content:
  // el contenido vive en un portal y, con el tooltip cerrado, no hay Content
  // montado que escuche. El pointerdown sobre el propio botón se ignora aquí
  // a propósito — de eso se encarga su onClick, y tratarlo en los dos sitios
  // anularía el toggle.
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
      <Tooltip.Root open={hover || fijado} onOpenChange={setHover} delayDuration={120}>
        <Tooltip.Trigger asChild>
          <button
            ref={disparador}
            type="button"
            aria-label={etiqueta}
            onClick={() => setFijado((f) => !f)}
            // cursor-help, no pointer: no navega a ningún sitio, solo se explica.
            className="grid size-4 shrink-0 cursor-help place-items-center rounded-full text-navy-soft transition-colors hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aqua"
          >
            <Info className="size-4" aria-hidden="true" />
          </button>
        </Tooltip.Trigger>

        <Tooltip.Content
          variant="light"
          size="medium"
          side="top"
          collisionPadding={16}
          onEscapeKeyDown={() => setFijado(false)}
          className="max-w-64"
        >
          {texto}
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}
