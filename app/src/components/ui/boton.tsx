import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'
import { Link, type LinkProps } from 'react-router-dom'

const clasesBase =
  'inline-flex items-center justify-center gap-2 bg-coral font-semibold text-white transition hover:bg-coral-dark'

// v3-F13 (PLAN-v3.md §15.8): 'lg' es el CTA principal del hero — más ancho,
// con halo (--shadow-cta) y un levantamiento sutil al pasar el ratón. No es
// un botón nuevo: mismo componente de Figma con una property "tamaño". 'md'
// (default) se queda igual en el resto de usos (header, CTA sticky, menú
// móvil) — no cambia nada donde no se pidió.
// 'sm' (isla-flotante.tsx, pedido de Samuel 2026-07-17): el Reservar de la
// isla flotante — redondo del todo, no --radius-btn (10px, el de md/lg): a
// este alto de botón, 10px no se lee "redondo" al lado de una píldora.
// El radio vive por tamaño (no en clasesBase) precisamente para esto: sm
// necesita uno distinto sin tocar md/lg. py-4 (no py-2): flota SEPARADO de
// la píldora de logo+tabs, pero tiene que igualar su alto EN REPOSO (52px,
// medido) para que las 2 piezas lean como un solo cluster — ver el
// comentario de isla-flotante.tsx sobre por qué no se limita a `stretch`.
const tamaños = {
  sm: 'rounded-full px-4 py-4 text-sm shadow-sm',
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
} & (
  | ({ to: LinkProps['to'] } & Omit<LinkProps, 'to'>)
  | ({ href: string } & AnchorHTMLAttributes<HTMLAnchorElement>)
  | ({ href?: undefined; to?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>)
)

export function Boton({ className = '', tamaño = 'md', ...props }: Props) {
  const clases = `${clasesBase} ${tamaños[tamaño]} ${className}`
  if ('to' in props && props.to !== undefined) {
    return <Link className={clases} {...(props as LinkProps)} />
  }
  if (props.href !== undefined) {
    return <a className={clases} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)} />
  }
  return <button type="button" className={clases} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)} />
}
