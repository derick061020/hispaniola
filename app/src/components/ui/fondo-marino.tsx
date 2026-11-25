import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

// EL AGUA DE TODA LA WEB.
//
// [2026-11-25, Sr. Fernando en «Hispaniola Gerencia», sobre /underwater-museum:
// «Necesitamos que toda la web tenga ese formato de agua y burbujas»; y sobre
// una captura de Caribbean Escape: «los laterales y las aberturas, todo el
// background con ese estilo marino; las casillas con texto se quedan tal cual,
// fondo blanco esos contenedores, pero todo lo demás estilo marino».]
//
// No es el shader del museo: un WebGL por página se come la batería del móvil
// en la ficha y la home, que son las páginas que venden. Es una capa FIJA detrás
// de todo (z-index -1, styles/marino.css): un degradado turquesa con los rayos
// de sol de arriba y burbujas en CSS que solo animan transform/opacity (capa
// de composición, sin repintar). Al ser fija, el contenido pasa por encima y el
// agua se queda quieta, como al bucear.
//
// Este componente además marca <html data-marino> mientras la ruta lo lleva:
// es lo que enciende las reglas de marino.css (fondos de sección
// transparentes, texto blanco fuera de las tarjetas). Se pone en un
// useLayoutEffect para que no haya un fotograma de página blanca al navegar.

// Las rutas que NO llevan el agua, y por qué:
//  · el museo y Food & Bar ya viven en su propia agua (shader con descenso);
//  · Fiesta on Deck es otra marca (negro/amarillo y azul/rojo);
//  · el funnel de reserva, sus gracias, la cuenta y «mi reserva» son
//    formularios largos: ahí manda leer y pagar sin distracciones.
const SIN_AGUA: RegExp[] = [
  /^\/underwater-museum\/?$/,
  /^\/food-and-bar\/?$/,
  /^\/events\/fiesta-on-deck-/,
  /^\/book\//,
  /\/thank-you\/?$/,
  /^\/account\/?$/,
  /^\/my-booking\/?$/,
]

function rutaConAgua(ruta: string) {
  return !SIN_AGUA.some((r) => r.test(ruta))
}

// Lista FIJA, no aleatoria (como las de Food & Bar, comida-y-bar-v3/burbujas.tsx):
// el HTML no cambia entre recargas. x = columna, s = tamaño, d = lo que tarda
// en subir, w = desfase (negativo: arranca ya a media subida, sin esperar).
const BURBUJAS: { x: string; s: string; d: string; w: string }[] = [
  { x: '2%', s: '14px', d: '16s', w: '-3s' },
  { x: '6%', s: '7px', d: '12s', w: '-9s' },
  { x: '10%', s: '22px', d: '20s', w: '-14s' },
  { x: '15%', s: '9px', d: '14s', w: '-6s' },
  { x: '21%', s: '6px', d: '11s', w: '-2s' },
  { x: '28%', s: '12px', d: '18s', w: '-11s' },
  { x: '37%', s: '8px', d: '15s', w: '-7s' },
  { x: '46%', s: '16px', d: '19s', w: '-16s' },
  { x: '55%', s: '10px', d: '17s', w: '-15s' },
  { x: '63%', s: '6px', d: '13s', w: '-4s' },
  { x: '71%', s: '14px', d: '19s', w: '-12s' },
  { x: '79%', s: '9px', d: '14s', w: '-1s' },
  { x: '85%', s: '20px', d: '21s', w: '-17s' },
  { x: '90%', s: '7px', d: '12s', w: '-8s' },
  { x: '95%', s: '12px', d: '17s', w: '-5s' },
  { x: '98%', s: '6px', d: '13s', w: '-10s' },
]

export function FondoMarino() {
  const { pathname } = useLocation()
  const activo = rutaConAgua(pathname)

  useLayoutEffect(() => {
    document.documentElement.toggleAttribute('data-marino', activo)
  }, [activo])

  if (!activo) return null
  return (
    <div aria-hidden="true" className="marino-fondo">
      <div className="marino-rayos" />
      <div className="marino-lejanas" />
      {BURBUJAS.map((b, i) => (
        <span
          key={i}
          className="marino-burbuja"
          style={{ ['--x' as string]: b.x, ['--s' as string]: b.s, ['--d' as string]: b.d, ['--w' as string]: b.w }}
        />
      ))}
    </div>
  )
}
