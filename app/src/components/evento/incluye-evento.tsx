import { Etiqueta } from '@/components/ui/etiqueta'
import { Estrellas } from '@/components/ui/estrellas'
import type { FichaEvento } from '@/data/eventos'

// «Qué incluye» (bodas, 6 beneficios + la nota de los wedding planners) /
// «Lo que un organizador necesita saber» (empresas, 4) — el grid-2 del
// prototipo: beneficios a la izquierda, el testimonio a la derecha. Cards de
// texto con el MISMO anatómico que IncluyeTour de la ficha (rounded-card +
// ring-linea, título sm, texto xs): en Figma es el mismo componente.
//
// ⚠️ La columna derecha del prototipo traía además una galería («Bodas
// reales», mosaico) y 6 logos («Han navegado con nosotros»). NO se pintan:
// no existen fotos de bodas reales (la única es la de la cabecera) ni logos
// de empresas cliente, y rellenar con fotos de otros tours o logos falsos
// mentiría sobre el producto — mismo criterio que la galería vacía de Isla
// Saona. Cuando el cliente entregue el material (PLAN-v3.md §9), su sitio es
// esta columna.
export function IncluyeEvento({ evento }: { evento: FichaEvento }) {
  return (
    <section className="grid items-start gap-8 lg:grid-cols-[2fr_1fr]">
      <div>
        <Etiqueta>{evento.incluyeTitulo}</Etiqueta>

        <div className="mt-5 grid grid-cols-2 gap-3">
          {evento.incluye.map((b) => (
            <div key={b.titulo} className="rounded-card bg-papel p-4 ring-1 ring-linea">
              <h3 className="font-display text-sm font-semibold text-navy">{b.titulo}</h3>
              <p className="mt-1 text-xs text-navy-soft">{b.texto}</p>
            </div>
          ))}
        </div>

        {evento.incluyeNota ? <p className="mt-4 text-xs text-navy-soft">{evento.incluyeNota}</p> : null}
      </div>

      {/* El testimonio — misma figure que OpinionesTour (caja papel-hueso,
          quote en lead). El de bodas es una reseña 5★ de WeddingWire; el de
          empresas es institucional (Directora de RRHH), sin estrellas. */}
      <figure className="rounded-card bg-papel-hueso p-5">
        <blockquote className="text-lead text-navy">«{evento.quote.texto}»</blockquote>
        <figcaption className="mt-3 flex items-center gap-2 text-xs text-navy-soft">
          {evento.quote.estrellas ? <Estrellas calificacion={5} /> : null}
          {evento.quote.meta}
        </figcaption>
      </figure>
    </section>
  )
}
