import { Etiqueta } from '@/components/ui/etiqueta'
import { BLOQUE_FICHA } from '@/components/tour/bloque-ficha'
import type { FichaTour } from '@/data/tours'

// Itinerario (wireframe A3): los 5 párrafos de prosa de la web actual se
// convierten en un timeline con horas. El turista escanea «a qué hora me
// recogen» sin leer un bloque de texto.
//
// 2026-07-17 (Samuel): se quita la columna de foto de la derecha — "no aporta
// nada, solo hace que el itinerario tenga más saltos de línea y sea más largo
// el scroll". El timeline va a ancho completo (antes 2 columnas foto+texto).
export function Itinerario({ ficha }: { ficha: FichaTour }) {
  return (
    <section id="ancla-itinerario" className={`${BLOQUE_FICHA} scroll-mt-sticky-top`}>
      <Etiqueta>Itinerario — {ficha.duracion}</Etiqueta>

      {/* El raíl es un border-left en la <ul>; cada hito pone su punto encima.
          Con `hora` vacía (charter y Saona coordinan a demanda) la fila no se
          rompe: la columna de hora queda vacía y el raíl sigue recto. */}
      <ul className="mt-5 flex flex-col gap-6 border-l border-linea pl-5">
        {ficha.itinerario.map((paso, i) => (
          <li key={i} className="relative">
            {/* El punto se coloca DONDE EMPIEZA el padding del raíl (-left-5 es
                el espejo exacto del pl-5 de la <ul>) y se centra sobre sí mismo
                con -translate-x-1/2 → cae sobre la línea. El ring-4 en color
                papel es lo que «perfora» la línea detrás del punto. */}
            <span
              aria-hidden="true"
              className="absolute -left-5 top-1.5 size-2.5 -translate-x-1/2 rounded-chip bg-aqua ring-4 ring-papel"
            />
            {paso.hora ? (
              <span className="font-display text-xs font-semibold uppercase tracking-wide text-aqua-dark">
                {paso.hora}
              </span>
            ) : null}
            <h3 className="font-display text-base font-semibold text-navy">{paso.titulo}</h3>
            {paso.texto ? <p className="mt-1 text-sm text-navy-sub">{paso.texto}</p> : null}
          </li>
        ))}
      </ul>
    </section>
  )
}
