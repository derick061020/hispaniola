import { Etiqueta } from '@/components/ui/etiqueta'
import { FLOTA, NOSOTROS } from '@/data/nosotros'
import { BarcoCard } from './barco-card'

// «Seis catamaranes, uno para cada plan» — la flota (correcciones v1 del
// cliente, slide 5). Sale de tripulacion-flota.tsx (que juntaba tripulación y
// flota en un archivo) y vuelve a ser una REJILLA de cards.
//
// Historial de esta sección, porque el formato ha ido y vuelto:
//   - 2026-07-17 (2ª vuelta): de 3 cards genéricas a los 6 catamaranes reales.
//   - 2026-07-17 (3ª vuelta, Samuel): «no me gusta que los barcos se vean en
//     cards» → cada barco pasó a ser una fila foto+texto alternando lado.
//   - 2026-07-17 (4ª y 5ª vuelta): se probó el stacking con GSAP y se retiró.
//   - 2026-07-22 (esta): vuelven a ser cards, PERO por un motivo distinto al
//     de la primera vez — la maqueta del cliente las pide en rejilla 3×2 y
//     Samuel zanjó el «no inventes: usa el mismo diseño que las cards de
//     tours del home». Lo que le molestaba en julio 17 era una card
//     improvisada; ahora es la card del escaparate de la home, con su foto
//     grande en passe-partout, su ficha y su CTA (ver barco-card.tsx). Seis
//     filas alternando ocupaban además media página para decir seis cosas
//     cortas.
//
// 3 columnas en lg, que es la rejilla de la maqueta (3×2). Las cards entran en
// cascada DIAGONAL al hacer scroll — `.nosotros-cascada-diagonal` la pone la
// propia card, ver use-cascada-nosotros.ts.
export function FlotaGrid() {
  return (
    <section>
      <Etiqueta>{NOSOTROS.flotaEyebrow}</Etiqueta>
      <h2 className="mt-3 max-w-2xl text-balance font-display text-h2 font-semibold text-navy">
        {NOSOTROS.flotaTitulo}
      </h2>
      <p className="mt-4 max-w-2xl text-lead text-navy-sub">{NOSOTROS.flotaTexto}</p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FLOTA.map((b) => (
          <BarcoCard key={b.nombre} barco={b} />
        ))}
      </div>
    </section>
  )
}
