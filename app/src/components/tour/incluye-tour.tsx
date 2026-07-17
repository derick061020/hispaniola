import { Etiqueta } from '@/components/ui/etiqueta'
import { BLOQUE_FICHA } from '@/components/tour/bloque-ficha'
import type { FichaTour } from '@/data/tours'

// Qué incluye (wireframe A4). Sin iconos: los 4 beneficios son de cada tour
// («Bióloga marina», «Barco entero», «Coordinación dedicada») y no hay un
// juego de iconos que los cubra sin forzar metáforas — la sección Incluye de
// la home sí los tiene porque sus 8 ítems son fijos y genéricos. Cards de
// texto, como en el wireframe.
//
// `noIncluido` NO es letra pequeña que esconder: la auditoría de la web actual
// celebró que exista (dice el precio de las fotos HD y el suplemento de
// transporte antes de cobrarlos). En Saona ese campo dice que el precio está
// por confirmar — se pinta igual.
export function IncluyeTour({ ficha }: { ficha: FichaTour }) {
  return (
    <section id="ancla-incluye" className={`${BLOQUE_FICHA} scroll-mt-sticky-top`}>
      <Etiqueta>Qué incluye</Etiqueta>

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {ficha.incluye.map((b) => (
          <div key={b.titulo} className="rounded-card bg-papel p-4 ring-1 ring-linea">
            <h3 className="font-display text-sm font-semibold text-navy">{b.titulo}</h3>
            <p className="mt-1 text-xs text-navy-soft">{b.texto}</p>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-navy-soft">{ficha.noIncluido}</p>
    </section>
  )
}
