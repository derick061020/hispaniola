import { Users, LayoutGrid, CalendarDays, Globe2 } from 'lucide-react'
import { EQUIPO_PAGINA } from '@/data/equipo'

// Franja de datos del equipo, justo debajo del hero (correcciones v2, slide 37).
//
// [v2 2026-07-28, pedido de Samuel] La página del PDF es MÁS DIRECTA que la
// nuestra: hero (badge + título + descripción) → esta franja compacta → filtros
// → todo el equipo. Nada más. Los 3 KPIs que vivían DENTRO del hero se mudan
// aquí y ganan un cuarto (RD + España), que es el dato que el cliente sí quería
// contar y no estaba en ninguna parte.
//
// Por qué sale del hero: en el hero competían con el título sobre el vídeo y
// eran tres cifras blancas sin ancla; sobre papel, en su propia franja, son lo
// primero que se lee después del titular y funcionan como el resumen de la
// página — que es exactamente el papel que les da la slide.
//
// SIN LAS RAYITAS VERTICALES de la maqueta: el cliente pidió justo lo
// contrario en la slide 8 («muchas rayitas separadoras, eliminarlas o con algún
// fondo tipo glassmorphism») y esa corrección ya se aplicó en la ficha de tour
// (tour/datos-tour.tsx). Se usa el MISMO anatómico que aquel bloque —fondo
// sólido suave con radio, círculo aqua-tint con el icono, sin bordes entre
// celdas— porque es el mismo tipo de dato: cuatro campos de una misma tabla.
// La diferencia es el orden tipográfico: aquí manda la CIFRA (va arriba, en
// display) y la etiqueta la explica debajo, como en la maqueta.
const ICONOS = {
  personas: Users,
  departamentos: LayoutGrid,
  desde: CalendarDays,
  origen: Globe2,
} as const

export function FranjaEquipo() {
  return (
    <ul className="grid grid-cols-1 gap-x-8 gap-y-5 rounded-2xl bg-papel-hueso px-5 py-6 sm:grid-cols-2 lg:grid-cols-4">
      {EQUIPO_PAGINA.datos.map((d) => {
        const Icono = ICONOS[d.id as keyof typeof ICONOS]
        return (
          // items-start por el mismo motivo que en datos-tour.tsx: «equipo
          // local y gerencia» ocupa dos líneas en anchos intermedios y el
          // resto una — anclados arriba, los cuatro iconos riman a la misma
          // altura pase lo que pase con el largo de la etiqueta.
          <li key={d.id} className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="grid size-9 shrink-0 place-items-center rounded-full bg-aqua-tint text-aqua-dark"
            >
              <Icono className="size-4" />
            </span>
            <span className="min-w-0">
              <span className="block font-display text-xl font-semibold text-navy">{d.valor}</span>
              <span className="mt-0.5 block text-sm text-navy-soft">{d.etiqueta}</span>
            </span>
          </li>
        )
      })}
    </ul>
  )
}
