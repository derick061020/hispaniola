import { useId } from 'react'
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

// Campo de formulario — label arriba (sección Contacto, ref. Lumoro). Sin
// AlignUI: la home no tiene un Input/Textarea copiado del vendor (solo el
// Accordion, en la sección FAQ) — este es tokens Hispaniola puros, como el
// resto de la home.
type Props = { etiqueta: string } & (
  | ({ textarea: true } & TextareaHTMLAttributes<HTMLTextAreaElement>)
  | ({ textarea?: false } & InputHTMLAttributes<HTMLInputElement>)
)

const clasesCampo =
  'mt-1.5 w-full rounded-btn bg-papel px-4 py-3 text-sm text-navy ring-1 ring-linea placeholder:text-navy-soft focus:outline-none focus:ring-2 focus:ring-aqua'

export function Campo({ etiqueta, textarea, className = '', ...props }: Props) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-navy">
        {etiqueta}
      </label>
      {textarea ? (
        <textarea id={id} rows={5} className={`${clasesCampo} resize-none ${className}`} {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)} />
      ) : (
        <input id={id} className={`${clasesCampo} ${className}`} {...(props as InputHTMLAttributes<HTMLInputElement>)} />
      )}
    </div>
  )
}
