import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'

const clasesBase =
  'inline-flex items-center justify-center gap-2 rounded-btn bg-coral font-semibold text-white transition hover:bg-coral-dark'

// v3-F13 (PLAN-v3.md §15.8): 'lg' es el CTA principal del hero — más ancho,
// con halo (--shadow-cta) y un levantamiento sutil al pasar el ratón. No es
// un botón nuevo: mismo componente de Figma con una property "tamaño". 'md'
// (default) se queda igual en el resto de usos (header, CTA sticky, menú
// móvil) — no cambia nada donde no se pidió.
const tamaños = {
  md: 'px-5 py-3 text-sm shadow-sm',
  // motion-safe: (no motion-reduce plano) — con prefers-reduced-motion:reduce
  // el hover no desplaza el botón, solo cambia de color (Trampa §15.10 №6).
  lg: 'px-8 py-4 text-base shadow-cta motion-safe:hover:-translate-y-0.5',
}

type Props = {
  tamaño?: keyof typeof tamaños
} & (({ href: string } & AnchorHTMLAttributes<HTMLAnchorElement>) | ({ href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>))

export function Boton({ className = '', tamaño = 'md', ...props }: Props) {
  const clases = `${clasesBase} ${tamaños[tamaño]} ${className}`
  if (props.href !== undefined) {
    return <a className={clases} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)} />
  }
  return <button type="button" className={clases} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)} />
}
