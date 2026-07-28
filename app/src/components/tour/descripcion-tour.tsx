import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

// Descripción del tour con «leer más» (2026-07-17): la web aprobada trae una
// descripción larga (varios párrafos) que no cabe entera sin empujar el
// itinerario y el widget fuera de vista. Se muestra el 1er párrafo (como lead)
// y el resto se despliega. Si el tour no tiene descripción larga —solo la
// corta de home.ts— se pinta esa sola, sin botón.
//
// prefers-reduced-motion: el giro del chevron es la única animación y es
// puramente decorativa (transform), así que se deja; el contenido aparece de
// golpe (no hay transición de altura que valga la pena guardar).
export function DescripcionTour({ parrafos, corta }: { parrafos?: string[]; corta: string }) {
  const [abierto, setAbierto] = useState(false)

  if (!parrafos || parrafos.length === 0) {
    return <p className="mt-2 text-lead text-navy-sub">{corta}</p>
  }

  const [primero, ...resto] = parrafos

  // [v2 2026-07-27] Fuera el `max-w-2xl` (pedido de Samuel: «en esa caja
  // estamos dando un espacio blanco pronunciado a la derecha, que el texto
  // abarque toda su caja»). No era padding: era un tope de 672px dentro de una
  // card bastante más ancha, así que sobraba una franja a la derecha.
  // El ancho de línea lo sigue acotando la card (BLOQUE_FICHA) y, sobre todo,
  // la columna de la ficha, que ya convive con el widget al lado.
  return (
    <div className="mt-2">
      <p className="text-lead text-navy-sub">{primero}</p>

      {resto.length > 0 ? (
        <>
          {abierto ? (
            <div className="mt-3 flex flex-col gap-3">
              {resto.map((p, i) => (
                <p key={i} className="text-sm leading-relaxed text-navy-sub">
                  {p}
                </p>
              ))}
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => setAbierto((v) => !v)}
            aria-expanded={abierto}
            className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-aqua-dark transition-colors hover:text-aqua"
          >
            {abierto ? 'Leer menos' : 'Leer más'}
            <ChevronDown className={`size-4 transition-transform ${abierto ? 'rotate-180' : ''}`} aria-hidden="true" />
          </button>
        </>
      ) : null}
    </div>
  )
}
