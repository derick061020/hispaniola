import { useEffect, useId, useState } from 'react'
import {
  MASCOTA,
  WORDMARK,
  JALLA,
  TAGLINE,
  VIEWBOX,
  RECORTE_BRAZO,
  RECORTE_CUERPO,
  EJE_HOMBRO,
  CORTES_LETRA,
} from './logo-trazados'

// Logo real del cliente (langosta pirata + wordmark), no se rediseña
// (docs/proceso/analisis/direccion-visual.md §1). Dos variantes porque el lockup
// original lleva el texto en oscuro y es ilegible sobre el video del hero:
//   - sobreOscuro: wordmark + tagline en blanco.
//   - por defecto: lockup original, wordmark + tagline en el negro de la marca.
//
// [2026-08-20] Los PNG viejos se sustituyeron por los VECTORES que entregó el cliente.
//
// [2026-08-21, pedido de Samuel] DEJA DE SER UN <img>: pasa a SVG en línea y se
// anima. Al cargar la página, el logo se monta solo — sale la mascota, saluda,
// aparecen las letras una a una, se pinta la jalla y entra el tagline. Al pasar
// el ratón por encima, la mascota vuelve a saludar. Los trazados viven aparte en
// `logo-trazados.ts` (generados del SVG del cliente); el movimiento, en
// `styles/componentes.css` (bloque «Logo animado»), que es donde explica POR QUÉ
// el brazo se recorta en vez de girar una capa.
//
// UNA SOLA GEOMETRÍA PARA LAS DOS VARIANTES. Comprobado trazado a trazado: la
// versión blanca del cliente es el MISMO vector con el wordmark y el tagline en
// blanco. Así que `sobreOscuro` ya no carga otro archivo, solo cambia el relleno
// de esos 22 trazados — y de paso se cae toda la maquinaria de letterboxing que
// existía porque los dos PNG tenían proporciones distintas: ahora es
// literalmente el mismo viewBox, así que alternar variante EN CALIENTE (el logo
// compacto de nav-flotante.tsx lo hace con el scroll) no puede mover ni un píxel.

const NEGRO_A_BLANCO = '#fff'

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

// [2026-08-21] El ancho ya no necesita fijarse a mano. Aquí vivió un comentario
// largo explicando por qué el compacto llevaba un ancho FIJO calculado con la
// proporción de UNA variante y la otra encajada con `object-contain`: eran dos
// ARCHIVOS con proporciones nativas distintas (250×110 vs 512×240) y alternar
// entre ellos al scrollear hacía un resize real del <img> que empujaba tabs y
// Reservar. Con un solo SVG para las dos variantes el problema no existe: el
// ancho sale del viewBox y es el mismo siempre.
const PROPORCION = 360 / 139.44

// Duraciones — tienen que cuadrar con las de componentes.css. La entrada acaba
// cuando termina el tagline; el saludo, cuando el brazo vuelve a su sitio.
const MS_ENTRADA = 3400
const MS_SALUDO = 1100

// La entrada suena UNA VEZ POR CARGA DE PÁGINA, no en cada navegación: Header se
// remonta al cambiar de ruta (vive dentro de cada página, no en App.tsx), y ver
// 3,4s de animación en cada clic del menú cansa. Módulo, no estado: sobrevive al
// remontaje. Si algún día se quiere en cada ruta, se borra este flag y ya.
let yaSonoEnEstaCarga = false

type Fase = 'quieto' | 'entrando' | 'saludando'

export function Logo({
  className = '',
  sobreOscuro = false,
  compacto = false,
  entrada = false,
}: {
  className?: string
  sobreOscuro?: boolean
  compacto?: boolean
  /** Dispara la animación completa al montar. Solo lo pasa Header — una vez por carga. */
  entrada?: boolean
}) {
  const [fase, setFase] = useState<Fase>('quieto')

  // useId trae dos puntos (`:r1:`) y estos ids acaban dentro de un `url(#…)`
  // de clip-path — se quitan para no depender de cómo cada navegador parsea
  // ese fragmento. Hacen falta ids únicos porque puede haber varios logos
  // montados a la vez (header + footer + el compacto de nav-flotante).
  const uid = useId().replace(/:/g, '')

  useEffect(() => {
    if (!entrada || yaSonoEnEstaCarga) return
    yaSonoEnEstaCarga = true
    setFase('entrando')
  }, [entrada])

  // El temporizador cuelga de `fase`, no del efecto de arriba: así también
  // devuelve al reposo el saludo del hover, y sobrevive al doble montaje de
  // StrictMode (que en desarrollo ejecuta el efecto de entrada dos veces).
  useEffect(() => {
    if (fase === 'quieto') return
    const t = window.setTimeout(() => setFase('quieto'), fase === 'entrando' ? MS_ENTRADA : MS_SALUDO)
    return () => window.clearTimeout(t)
  }, [fase])

  const altoRender = compacto ? ALTO_RENDER_COMPACTO : ALTO_RENDER
  const holgura = compacto ? HOLGURA_COMPACTO : HOLGURA
  const anchoRender = Math.round(altoRender * PROPORCION)

  const tintaTexto = (original: string) => (sobreOscuro ? NEGRO_A_BLANCO : original)

  return (
    <svg
      viewBox={VIEWBOX}
      width={anchoRender}
      height={altoRender}
      role="img"
      aria-label="Hispaniola Aquatic Adventures"
      style={{ marginBlock: holgura }}
      // El saludo también responde al toque en móvil; es un gesto de adorno,
      // el <Link> de alrededor sigue navegando igual.
      onPointerEnter={() => {
        if (fase === 'quieto') setFase('saludando')
      }}
      className={`logo-marca ${fase !== 'quieto' ? `logo-marca--${fase}` : ''} ${className}`}
    >
      <defs>
        {/* La mascota se declara UNA vez y se pinta DOS con <use>: el cuerpo sin
            brazo y el brazo suelto. Sin esto habría 152 trazados duplicados. */}
        <g id={`${uid}-mascota`}>
          {MASCOTA.map((t, i) => (
            <path key={i} fill={t.f} d={t.d} />
          ))}
        </g>
        <g id={`${uid}-word`}>
          {WORDMARK.map((t, i) => (
            <path key={i} fill={tintaTexto(t.f)} d={t.d} />
          ))}
        </g>
        <clipPath id={`${uid}-brazo`} clipPathUnits="userSpaceOnUse">
          <polygon points={RECORTE_BRAZO} />
        </clipPath>
        <clipPath id={`${uid}-cuerpo`} clipPathUnits="userSpaceOnUse">
          <path clipRule="evenodd" d={RECORTE_CUERPO} />
        </clipPath>
        {CORTES_LETRA.map((l, i) => (
          <clipPath key={i} id={`${uid}-l${i}`} clipPathUnits="userSpaceOnUse">
            <polygon points={l.pts} />
          </clipPath>
        ))}
      </defs>

      <g className="logo-flota">
        <g className="logo-mascota">
          <use href={`#${uid}-mascota`} clipPath={`url(#${uid}-cuerpo)`} />
          <g className="logo-brazo" style={{ transformOrigin: `${EJE_HOMBRO.x}px ${EJE_HOMBRO.y}px` }}>
            <use href={`#${uid}-mascota`} clipPath={`url(#${uid}-brazo)`} />
          </g>
        </g>
      </g>

      <g className="logo-wordmark">
        {CORTES_LETRA.map((l, i) => (
          <g
            key={i}
            className="logo-letra"
            style={{ ['--i' as string]: i, transformOrigin: `${l.ox}px 106px` }}
          >
            <use href={`#${uid}-word`} clipPath={`url(#${uid}-l${i})`} />
          </g>
        ))}
      </g>

      <g className="logo-jalla">
        {JALLA.map((t, i) => (
          <path key={i} fill={t.f} d={t.d} />
        ))}
      </g>

      <g className="logo-tagline">
        {TAGLINE.map((t, i) => (
          <path key={i} className="logo-tl" style={{ ['--i' as string]: i }} fill={tintaTexto(t.f)} d={t.d} />
        ))}
      </g>
    </svg>
  )
}
