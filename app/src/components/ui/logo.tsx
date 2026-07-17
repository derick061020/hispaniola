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

// Variante `compacto` (isla-flotante.tsx, 2026-07-17, pedido de Samuel): el
// logo pasa a compartir fila con los botones de tab (36px de alto cada uno,
// contando su propio padding) en vez de vivir en su chip flotante aparte —
// a 52px de fila dominaba y desalineaba la píldora fusionada.
const ALTO_RENDER_COMPACTO = 44
const ALTO_FILA_COMPACTO = 36
const HOLGURA_COMPACTO = (ALTO_FILA_COMPACTO - ALTO_RENDER_COMPACTO) / 2

export function Logo({
  className = '',
  sobreOscuro = false,
  compacto = false,
}: {
  className?: string
  sobreOscuro?: boolean
  compacto?: boolean
}) {
  const { src, ancho, alto } = sobreOscuro ? VARIANTES.oscuro : VARIANTES.claro
  const altoRender = compacto ? ALTO_RENDER_COMPACTO : ALTO_RENDER
  const holgura = compacto ? HOLGURA_COMPACTO : HOLGURA

  return (
    <img
      src={src}
      alt="Hispaniola Aquatic Adventures"
      width={Math.round((altoRender * ancho) / alto)}
      height={altoRender}
      style={{ marginBlock: holgura }}
      className={`w-auto ${compacto ? 'h-11' : 'h-16'} ${className}`}
    />
  )
}
