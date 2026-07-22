import { useId } from 'react'
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

// Campo de formulario — label arriba (sección Contacto, ref. Lumoro). Sin
// AlignUI: la home no tiene un Input/Textarea copiado del vendor (solo el
// Accordion, en la sección FAQ) — este es tokens Hispaniola puros, como el
// resto de la home.
// `claseContenedor` (2026-07-22, rediseño de Contacto) — clases del DIV que
// envuelve label+control, no del control (para eso ya está `className`). Existe
// por un caso concreto: en el panel de Contacto el formulario tiene que llegar
// al mismo alto que el carril de al lado, y la palanca es que el textarea del
// mensaje CREZCA hasta llenar el hueco. Para eso el contenedor tiene que ser
// `flex flex-col flex-1`, y ese div vivía aquí dentro sin manera de tocarlo.
type Props = { etiqueta: string; claseContenedor?: string } & (
  | ({ textarea: true } & TextareaHTMLAttributes<HTMLTextAreaElement>)
  | ({ textarea?: false } & InputHTMLAttributes<HTMLInputElement>)
)

const clasesCampo =
  'mt-1.5 w-full rounded-btn bg-papel px-4 py-3 text-sm text-navy ring-1 ring-linea placeholder:text-navy-soft focus:outline-none focus:ring-2 focus:ring-aqua'

export function Campo({ etiqueta, textarea, className = '', claseContenedor = '', ...props }: Props) {
  const id = useId()
  return (
    <div className={claseContenedor}>
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
