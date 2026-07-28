import { Etiqueta } from '@/components/ui/etiqueta'
import { REJILLA_FLOTA } from '@/data/flota'
import { FLOTA } from '@/data/nosotros'
import { BarcoCard } from './barco-card'

// LA REJILLA DE BARCOS de /flota. Sustituye a
// `components/nosotros/flota-grid.tsx`, que pintaba la card antigua.
//
// DOS COLUMNAS EN sm, TRES EN xl (antes: dos en sm, tres ya en lg). La card
// nueva no es la de antes: además de la foto lleva la tira de miniaturas, dos
// botones y tres chips de specs. A 1024px, tres columnas dejaban ~310px por
// card y la tira de 5 miniaturas caía a 55px de ancho cada una — a ese tamaño
// dejan de decir qué hay dentro, que es su único trabajo. Con el corte en xl,
// las miniaturas nunca bajan de ~75px.
//
// La cascada DIAGONAL de entrada (`.nosotros-cascada-diagonal`, la pone la
// propia card) sigue funcionando igual: use-cascada-nosotros.ts MIDE la
// columna real de cada card con `offsetLeft` en vez de deducirla del índice,
// justamente para que el efecto no dependa de cuántas columnas haya en cada
// breakpoint. Cambiar la rejilla aquí no le afecta.
export function FlotaGrid() {
  return (
    <section id="barcos" className="scroll-mt-24">
      <Etiqueta>{REJILLA_FLOTA.eyebrow}</Etiqueta>
      <h2 className="mt-3 max-w-2xl text-balance font-display text-h2 font-semibold text-navy">
        {REJILLA_FLOTA.titulo}
      </h2>
      <p className="mt-4 max-w-2xl text-lead text-navy-sub">{REJILLA_FLOTA.texto}</p>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {FLOTA.map((b, i) => (
          <BarcoCard key={b.nombre} barco={b} primera={i === 0} /> // [dev-mode] `primera`
        ))}
      </div>
    </section>
  )
}
