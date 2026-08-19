import { t } from '@/lib/i18n'
// Logo real del cliente (langosta pirata + wordmark), descargado de la web actual —
// no se rediseña (docs/proceso/analisis/direccion-visual.md §1). Dos variantes porque el lockup
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
// Ancho FIJO del compacto (2026-07-22, pedido de Samuel: "al cambiar entre
// oscuro/claro los elementos se mueven"). El logo compacto es el ÚNICO que
// alterna `sobreOscuro` EN CALIENTE, sin remontar (nav-flotante.tsx, según
// `sobreOscuro` cambia con el scroll) — claro y oscuro son dos ARCHIVOS con
// proporciones nativas DISTINTAS (250×110 vs 512×240), así que el ancho que
// antes salía de `(alto × ancho) / alto` de CADA variante cambiaba unos px
// al alternar, y ese cambio empujaba todo lo que comparte fila con él
// (tabs, Reservar) — el "salto" que se veía no era percepción, era un
// resize real del `<img>`. Fijar el ancho a la proporción de UNA sola
// variante (claro, la que ya era el default) y forzar la otra a encajar
// ahí con `object-contain` (en vez de dejar que cada variante mida lo
// suyo) es lo que lo vuelve estable — la variante oscura queda unos px más
// angosta DENTRO de esa caja fija (letterboxing invisible, es solo
// transparencia del PNG) en vez de ensanchar la fila entera.
const ANCHO_RENDER_COMPACTO = Math.round((ALTO_RENDER_COMPACTO * VARIANTES.claro.ancho) / VARIANTES.claro.alto)

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
  const anchoRender = compacto ? ANCHO_RENDER_COMPACTO : Math.round((altoRender * ancho) / alto)

  return (
    <img
      src={src}
      alt={t('Hispaniola Aquatic Adventures')}
      width={anchoRender}
      height={altoRender}
      style={{ marginBlock: holgura }}
      className={`${compacto ? 'h-11 object-contain object-left' : 'w-auto h-16'} ${className}`}
    />
  )
}
