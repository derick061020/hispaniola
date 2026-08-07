import { Hourglass } from 'lucide-react'
import { IconoFuego } from '@/components/ui/icono-fuego'
import { MESES, hoyISO, parseFechaISO } from '@/lib/fechas'

// Chips de aceleración sobre el widget de reserva (Samuel, 2026-07-22: «al
// widget arriba agregar unos chips de "el más reservado" tal vez con un icono
// svg de fuego que tenga animación constante tipo lottie y otro de que acaba
// el 28 de julio, este último que se vea que es de que queda poco»).
//
// ⚠️ LEER ANTES DE TOCAR — ESTOS DOS CHIPS SON MAQUETA, NO DATO.
// El comentario grande de widget-reserva.tsx explica por qué en la v1 de
// correcciones se dejaron FUERA los cuatro elementos de urgencia que pedía
// la maqueta del cliente: no hay motor de reservas conectado, así que nadie
// sabe qué tour se reserva más ni cuánta disponibilidad queda, y pintar
// urgencia inventada es el mismo bait-and-switch contra el que ese archivo
// lleva avisando desde el primer día. Eso no ha cambiado. Lo que cambia es
// la DECISIÓN: Samuel los pide explícitamente para el prototipo que ve el
// cliente, y son suyos.
//
// Para que la deuda no se pierda de vista, los dos datos viven AQUÍ, arriba,
// con nombre propio y no enterrados en el JSX. Cuando el motor exponga
// datos reales, se sustituyen los dos y este componente no cambia:
//  - `MAS_RESERVADO` → debería salir de las reservas del último mes.
//  - `OFERTA_FIN` → debería salir de la promo vigente, si existe.
//
// El chip de la fecha SE OCULTA SOLO cuando la fecha pasa. Es la única
// protección posible contra el peor final de un dato inventado: un «acaba
// el 28 de julio» que en septiembre sigue ahí, delatando que nunca acabó
// nada. Un prototipo puede exagerar; no puede contradecirse a sí mismo.
const MAS_RESERVADO = true
const OFERTA_FIN = '2026-07-28'

// Los dos chips comparten receta y solo cambia el icono: en Figma es UN
// componente con una variante de icono, no dos chips parecidos.
function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-chip bg-urgencia-fondo px-2.5 py-1 text-xs font-semibold text-urgencia-texto">
      {children}
    </span>
  )
}

export function ChipsUrgencia() {
  const fin = parseFechaISO(OFERTA_FIN)
  const vigente = OFERTA_FIN >= hoyISO()

  if (!MAS_RESERVADO && !vigente) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      {MAS_RESERVADO ? (
        <Chip>
          {/* size-4 en la clase y no en el SVG: el icono se dimensiona con
              el texto del chip, como los de lucide que lo rodean. */}
          <IconoFuego className="size-4 shrink-0" />
          Most booked
        </Chip>
      ) : null}

      {vigente ? (
        <Chip>
          {/* El «queda poco» se dice con MOVIMIENTO, no con más texto: el
              reloj de arena voltea en bucle. En una caja tan estrecha, un
              «· quedan N días» detrás de la fecha obligaba a partir la fila
              de chips en dos líneas, y dos líneas de urgencia encima del
              precio empiezan a parecer un anuncio. */}
          <Hourglass className="icono-reloj size-3.5 shrink-0" aria-hidden="true" />
          Acaba el {fin.getDate()} de {MESES[fin.getMonth()]}
        </Chip>
      ) : null}
    </div>
  )
}
