import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type Ref } from 'react'
import { Link, type LinkProps } from 'react-router-dom'

const clasesBase =
  'inline-flex items-center justify-center gap-2 font-semibold text-white transition'

// El COLOR sale de `clasesBase` y pasa a ser una property propia (2026-08-07,
// pedido de Samuel: «el botón de chat now de WhatsApp… que tenga el color de
// WhatsApp»). Es una property del mismo componente, no un botón nuevo — igual
// que `tamaño`: en Figma mapea a una variante, no a otro componente.
//
// 'whatsapp' es un caso ESTRICTO, no un tono más de la paleta: se usa cuando
// el botón abre WhatsApp y el verde de marca es lo que hace que se reconozca
// de un vistazo. Ver --color-whatsapp en tokens.css (marca de terceros, y la
// nota de contraste que la acompaña). Cualquier otro CTA del sitio es 'coral'.
const tonos = {
  coral: 'bg-coral hover:bg-coral-dark',
  whatsapp: 'bg-whatsapp hover:bg-whatsapp-dark',
}

// v3-F13 (PLAN-v3.md §15.8): 'lg' es el CTA principal del hero — más ancho,
// con halo (--shadow-cta) y un levantamiento sutil al pasar el ratón. No es
// un botón nuevo: mismo componente de Figma con una property "tamaño". 'md'
// (default) se queda igual en el resto de usos (header, CTA sticky, menú
// móvil) — no cambia nada donde no se pidió.
// 'sm': el Reservar FUNDIDO dentro de NavFlotante (nav-flotante.tsx,
// 2026-07-21). Redondo del todo, no --radius-btn (10px, el de md/lg): a este
// alto, 10px no se lee "redondo". El radio vive por tamaño (no en
// clasesBase) precisamente para esto: sm necesita uno distinto sin tocar
// md/lg.
// REDISEÑADO 2026-07-21, 2ª vuelta (antes: py-4, 52px de alto) — esa altura
// venía de la isla-flotante original (2026-07-17), donde el Reservar flotaba
// SEPARADO de la píldora de logo+tabs, como chip aparte, y tenía que igualar
// el alto de ESA píldora en reposo. Ahora vive FUNDIDO en la misma barra que
// los tabs (mismo padre flex), así que el listón ya no es aquella píldora —
// es la altura de los propios tabs (claseLinkTab: px-3 py-2 text-sm, 36px
// medido). py-4 lo dejaba 16px más alto que el resto de la fila y se leía
// como un botón ajeno asomando por encima, no como parte de un solo cluster
// (Samuel: "no veo centrado el menú de tabs con respecto a logo y botón" —
// el desbalance era de ALTURA, no de posición horizontal, que ya medía
// centrada). py-2 iguala esos 36px.
const tamaños = {
  sm: 'rounded-full px-4 py-2 text-sm shadow-sm',
  md: 'rounded-btn px-5 py-3 text-sm shadow-sm',
  // motion-safe: (no motion-reduce plano) — con prefers-reduced-motion:reduce
  // el hover no desplaza el botón, solo cambia de color (Trampa §15.10 №6).
  lg: 'rounded-btn px-8 py-4 text-base shadow-cta motion-safe:hover:-translate-y-0.5',
}

// `to` (Link de react-router, navegación SPA) se suma a `href` (ancla plana)
// y sin ninguno de los dos (botón real) — el footer, compartido con la
// ficha de tour y las landings de evento, necesita `/#tours` como
// navegación SPA (mismo motivo que el «Reservar ahora» de footer.tsx).
type Props = {
  tamaño?: keyof typeof tamaños
  tono?: keyof typeof tonos
} & (
  | ({ to: LinkProps['to'] } & Omit<LinkProps, 'to'>)
  | ({ href: string } & AnchorHTMLAttributes<HTMLAnchorElement>)
  | ({ href?: undefined; to?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>)
)

// forwardRef (2026-07-21, pedido de Samuel — "mete gsap y usalo"): el
// Reservar fundido de NavFlotante necesita un ref real para que gsap pueda
// animarlo directamente (entrada Y salida, interrumpible) — antes era una
// función simple, sin manera de exponer el nodo DOM subyacente. 3 elementos
// posibles (Link/a/button) → el ref es la unión de los dos que de verdad
// ocurren (ningún consumidor actual necesita apuntar a un <button>, pero se
// tipa completo por si acaso).
export const Boton = forwardRef<HTMLAnchorElement | HTMLButtonElement, Props>(function Boton(
  { className = '', tamaño = 'md', tono = 'coral', ...props },
  ref,
) {
  const clases = `${clasesBase} ${tonos[tono]} ${tamaños[tamaño]} ${className}`
  if ('to' in props && props.to !== undefined) {
    return <Link ref={ref as Ref<HTMLAnchorElement>} className={clases} {...(props as LinkProps)} />
  }
  if (props.href !== undefined) {
    return <a ref={ref as Ref<HTMLAnchorElement>} className={clases} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)} />
  }
  return (
    <button
      ref={ref as Ref<HTMLButtonElement>}
      type="button"
      className={clases}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    />
  )
})
