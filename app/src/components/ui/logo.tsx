// Logo real del cliente (langosta pirata + wordmark), descargado de la web actual —
// no se rediseña (analisis/direccion-visual.md §1). Dos variantes porque el lockup
// original lleva el texto en oscuro y es ilegible sobre el video del hero:
//   - sobreOscuro: variante reversed (langosta a color + texto blanco) que aporta Samuel.
//   - por defecto: lockup original tal cual sale de la web actual.
// Ambas se sirven a 64px de alto, muy por debajo de su ancho nativo (250px / 512px),
// así que quedan nítidas en retina.
const VARIANTES = {
  claro: { src: '/marca/logo.png', ancho: 250, alto: 110 },
  oscuro: { src: '/marca/logo-hispaniola-white.png', ancho: 512, alto: 240 },
} as const

const ALTO_RENDER = 64
// La fila del header se dimensiona con esta altura (52px, la de antes) — el
// logo crece visualmente con margen vertical negativo que absorbe el
// excedente, así el header no se hace más alto y no empuja el hero.
const ALTO_FILA = 52
const HOLGURA = (ALTO_FILA - ALTO_RENDER) / 2

export function Logo({ className = '', sobreOscuro = false }: { className?: string; sobreOscuro?: boolean }) {
  const { src, ancho, alto } = sobreOscuro ? VARIANTES.oscuro : VARIANTES.claro

  return (
    <img
      src={src}
      alt="Hispaniola Aquatic Adventures"
      width={Math.round((ALTO_RENDER * ancho) / alto)}
      height={ALTO_RENDER}
      style={{ marginBlock: HOLGURA }}
      className={`h-16 w-auto ${className}`}
    />
  )
}
