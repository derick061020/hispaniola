import { useState } from 'react'
import { useDevFlag } from '@/dev/use-dev-flag'

// «Checks en ticker» — extraído del widget de reserva de tour
// (widget-reserva.tsx, función `Checks` local) a un componente
// compartido (PLAN-EVENTOS.md §3) para reusarlo en el widget de
// evento. Misma animación, mismas clases CSS, mismo deep-link dev.
//
// LAYOUT
// - 1 fila continua con las N frases del array, repetidas 2x (la
//   segunda copia es aria-hidden para que el loop -50% funcione
//   sin duplicar el contenido a los lectores de pantalla).
// - Con prefers-reduced-motion se quita la animación y se pinta
//   en 1 sola fila (overflow-x: auto para que el usuario la
//   recorra a mano) — WCAG 2.2.2.
//
// POR QUÉ EXISTE (el racional del componente)
// - Pedido de Samuel 2026-07-17: "que los 3 puntos (que son los
//   mismos que tenemos en tours) sean igual un ticker infinito
//   pasando en horizontal, tiene que ser el mismo que esta en
//   tours". El widget de evento v2 tenia 3 <li> estaticos
//   (Diferencia de la v1 — sin ticker), y Samuel quiere que el
//   lenguaje sea IDENTICO al de tour: misma pieza, misma
//   animacion, misma reaccion al hover (pausa).
// - "Misma pieza" es la regla del proyecto: 1 componente = 1
//   componente de Figma. Si tour y evento tienen el mismo
//   reassurance, van al mismo componente en Figma.
//
// CSS
// - Las clases .widget-checks-* viven en components.css (no se
//   mueven). El wrapper detecta prefers-reduced-motion en
//   cliente (la regla de @media en CSS no se puede leer en JS sin
//   matchMedia, así que se duplica en runtime para el modo
//   estatico).
//
// DEV MODE
// - ?dev-widget-checks=pausado congela la pista — frame de Figma.
// - ?dev-widget-checks=estatico (en tour) o prefers-reduced-motion
//   en sistema: 1 sola fila navegable a mano.

type Props = { lineas: string[] }

export function ChecksTicker({ lineas }: Props) {
  const [pausado, setPausado] = useState(false)
  // [dev-mode] deep-link del Glosario Dev — ver src/dev/dev-registry.ts.
  // 'pausado' congela la pista en su posicion actual (frame de
  // Figma sin animacion). 'estatico' (solo el de tour) la pasa a
  // modo navegable a mano.
  useDevFlag('dev-widget-checks', (v) => {
    if (v === 'pausado') setPausado(true)
  })

  const reducirMovimiento =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const item = (texto: string, key: string, oculto: boolean) => (
    <span
      key={key}
      aria-hidden={oculto || undefined}
      className="widget-checks-item flex items-center gap-1.5 text-xs text-navy-soft"
    >
      <span aria-hidden="true" className="text-menta-texto">
        ✓
      </span>
      {texto}
    </span>
  )

  return (
    <div
      role="group"
      aria-label="Garantías de la reserva"
      className={`widget-checks-wrapper ${reducirMovimiento ? 'widget-checks-wrapper--estatico' : ''}`}
    >
      <div className={`widget-checks-pista ${pausado ? 'widget-checks-pista--pausada' : ''}`}>
        {lineas.map((l) => item(l, l, false))}
        {/* 2ª copia para el loop del -50%, oculta a lectores de
            pantalla (mismo trato que el ticker del hero) — no hace
            falta si es estático (reduced-motion). */}
        {!reducirMovimiento ? lineas.map((l) => item(l, `dup-${l}`, true)) : null}
      </div>
    </div>
  )
}
