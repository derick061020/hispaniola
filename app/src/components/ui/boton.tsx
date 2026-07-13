import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'

const clases =
  'inline-flex items-center justify-center rounded-btn bg-coral px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-coral-dark'

type Props =
  | ({ href: string } & AnchorHTMLAttributes<HTMLAnchorElement>)
  | ({ href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>)

export function Boton({ className = '', ...props }: Props) {
  if (props.href !== undefined) {
    return <a className={`${clases} ${className}`} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)} />
  }
  return <button type="button" className={`${clases} ${className}`} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)} />
}
