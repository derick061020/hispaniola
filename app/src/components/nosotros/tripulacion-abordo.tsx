import { Anchor, ChefHat, Fish, Waves } from 'lucide-react'
import { NOSOTROS, TRIPULACION } from '@/data/nosotros'

// «Y nuestra tripulación dominicana a bordo» — los 4 roles SIN nombre propio
// (el cliente no ha dado esos datos; inventar un «Capitán José» sería fabricar
// contenido, ver TRIPULACION en data/nosotros.ts).
//
// Sale de tripulacion-flota.tsx, que era el archivo con los dos bloques
// (tripulación + flota) metidos en uno. Se parte porque en el rediseño de
// 2026-07-22 van a sitios distintos de la página: la tripulación cierra la
// franja de personas (justo debajo del equipo con nombre, como en la maqueta
// slide 3) y la flota se va abajo del todo con su rejilla de cards.
//
// La maqueta lo monta como UNA card blanca con los 4 roles en fila, no como 4
// cards sueltas — es un cierre, no un escaparate: la jerarquía correcta es un
// bloque con cuatro elementos dentro. Cada rol lleva ahora una línea de
// función debajo (`nota`), que es lo que el chip pelado de antes no decía.
//
// SIN sombra ni borde (Samuel, 2026-07-22): la maqueta lo dibujaba como card
// blanca con hairline y sombra, y quedaba una caja vacía sobre el papel blanco
// justo debajo de las 3 cards de equipo, que sí son cajas de verdad. Es un
// cierre de sección — el aire y el centrado bastan para agruparlo, no necesita
// contorno. Solo se queda el círculo de icono como superficie.
const ICONOS: Record<string, typeof Anchor> = {
  Capitán: Anchor,
  'Bióloga marina': Fish,
  'Chef a bordo': ChefHat,
  'Guía de snorkel': Waves,
}

export function TripulacionAbordo() {
  return (
    <div className="p-6 sm:p-8">
      <div className="text-center">
        <h3 className="font-display text-h3 font-semibold text-navy">{NOSOTROS.tripulacionTitulo}</h3>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-navy-sub">{NOSOTROS.tripulacionTexto}</p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
        {TRIPULACION.map((m) => {
          const Icono = ICONOS[m.rol] ?? Anchor
          return (
            <div key={m.rol} className="flex flex-col items-center gap-3 text-center">
              <span className="grid size-14 place-items-center rounded-full bg-aqua-tint text-aqua-dark">
                <Icono className="size-6" strokeWidth={2} aria-hidden="true" />
              </span>
              <span className="font-display text-sm font-semibold text-navy">{m.rol}</span>
              <span className="-mt-2 text-xs text-navy-soft">{m.nota}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
