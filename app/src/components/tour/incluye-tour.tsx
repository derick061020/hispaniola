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

      {/* «También incluye» — el resto de lo que trae el tour más allá de los 4
          titulares (WiFi, aperitivos, barra flotante…), como chips para que se
          lea de un vistazo sin competir con las cards. */}
      {ficha.incluyeExtra && ficha.incluyeExtra.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {ficha.incluyeExtra.map((item) => (
            <span key={item} className="inline-flex items-center gap-1.5 rounded-chip bg-papel-hueso px-3 py-1 text-xs text-navy-sub">
              <span aria-hidden="true" className="text-menta-texto">
                ✓
              </span>
              {item}
            </span>
          ))}
        </div>
      ) : null}

      <p className="mt-4 text-xs text-navy-soft">{ficha.noIncluido}</p>

      {/* Qué llevar — dato práctico de la web aprobada. Solo si hay lista (en
          Saona no hay datos → no se pinta). */}
      {ficha.queLlevar.length > 0 ? (
        <div className="mt-4 border-t border-linea pt-4">
          <h3 className="text-eyebrow font-semibold uppercase tracking-[0.12em] text-navy-soft">Qué llevar</h3>
          <p className="mt-1.5 text-sm text-navy-sub">{ficha.queLlevar.join(' · ')}</p>
        </div>
      ) : null}
    </section>
  )
}
