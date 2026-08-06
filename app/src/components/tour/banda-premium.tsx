import { Sparkles } from 'lucide-react'
import type { FichaTour } from '@/data/tours'

// Banda «estás en la versión Premium» (correcciones v2, plan 01 §9 — slide 6).
//
// El cliente puso la flecha en una barra gris vacía entre la ficha técnica y
// el bloque de descripción: «poner un mini banner donde agreguemos un mensaje
// que refuerce que el usuario está en la versión Premium».
//
// Es la CONTRAPARTE de la caja de upsell del widget: una aparece cuando la
// otra desaparece, así que el visitante nunca ve las dos a la vez. Con Light
// se le enseña lo que ganaría; con Premium, lo que acaba de desbloquear.
//
// Para que esto funcione, `paquete` tuvo que subir de estado interno del
// widget a estado de la página — mismo movimiento que ya se hizo con
// `variante` (el bote del charter) el 2026-07-17.
export function BandaPremium({ ficha }: { ficha: FichaTour }) {
  const ventajas = ficha.ventajasPremium
  if (!ventajas || ventajas.length === 0) return null

  return (
    // [v2 2026-07-28, pedido de Samuel: «dale fondo dorado como el de langosta
    // de charter privado y texto negro»] Deja de ser una banda NEGRA con letra
    // de oro y pasa a ser una LÁMINA DE ORO con letra casi negra — literalmente
    // el mismo degradado y el mismo anillo que la franja de add-on de
    // carta-charter.tsx, no un dorado parecido.
    //
    // Y gana con el cambio: en negro era la tercera superficie oscura de la
    // página (widget premium, cards del menú y esto), así que se perdía entre
    // ellas justo cuando su trabajo es avisar de un estado. En oro pleno sobre
    // una página clara no se pierde, y además hereda el idioma que el sitio ya
    // usa para «esto es un extra premium».
    //
    // El texto va en --color-premium-fondo (casi negro) y no en navy: sobre oro
    // el navy tira a morado, y es el mismo par de contraste que la franja de
    // langosta lleva usando desde el 07-27.
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-card bg-gradient-to-br from-premium-oro-oscuro via-premium-oro-claro to-premium-oro px-4 py-3 ring-1 ring-premium-oro-oscuro/40">
      <p className="flex items-center gap-2 text-sm font-semibold text-premium-fondo">
        <Sparkles className="size-4 shrink-0" aria-hidden="true" />
        You are viewing the Premium version
      </p>
      <p className="text-sm text-premium-fondo/75">
        {/* [v3 2026-08-06] Solo se minusculiza la PRIMERA letra, no la frase
            entera: las ventajas pasaron a ingles en F3.1 y un `toLowerCase()`
            completo dejaba «certified angus beef» y «surf & turf» — nombres
            propios de producto rotos a media frase. */}
        Includes {ventajas[0].charAt(0).toLowerCase() + ventajas[0].slice(1)}.
      </p>
    </div>
  )
}
