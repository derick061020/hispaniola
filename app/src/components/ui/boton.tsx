import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'

const base = 'inline-flex items-center justify-center rounded-btn text-sm font-semibold transition'
const variantes = {
  primario: 'bg-coral px-5 py-3 text-white shadow-sm hover:bg-coral-dark',
  secundario: 'border border-aqua px-5 py-2.5 text-aqua-dark hover:bg-[#EAF3F4]',
} as const

type Variante = keyof typeof variantes

type Props =
  | ({ variante?: Variante; href: string } & AnchorHTMLAttributes<HTMLAnchorElement>)
  | ({ variante?: Variante; href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>)

export function Boton({ variante = 'primario', className = '', ...props }: Props) {
  const clases = `${base} ${variantes[variante]} ${className}`
  if (props.href !== undefined) {
    return <a className={clases} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)} />
  }
  return <button type="button" className={clases} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)} />
}
