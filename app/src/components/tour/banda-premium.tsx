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
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-card bg-premium-fondo px-4 py-3">
      <p className="flex items-center gap-2 text-sm font-semibold text-premium-oro">
        <Sparkles className="size-4 shrink-0" aria-hidden="true" />
        Estás viendo la versión Premium
      </p>
      <p className="text-sm text-premium-texto-suave">
        Incluye {ventajas[0].toLowerCase()}.
      </p>
    </div>
  )
}
