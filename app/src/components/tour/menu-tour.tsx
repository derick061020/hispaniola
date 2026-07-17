import { Etiqueta } from '@/components/ui/etiqueta'
import { BLOQUE_FICHA } from '@/components/tour/bloque-ficha'
import { PLATOS, formatoDinero, type Tour } from '@/data/home'
import type { FichaTour } from '@/data/tours'

// «Tu menú, a tu elección» (wireframe A4) — el diferenciador estrella: fotos
// reales de los platos, un activo que ningún competidor tiene. Solo en
// 'completo': charter cotiza su menú a medida y Saona no tiene paquetes.
//
// ⚠️ Premium se lee como DELTA («+US$ 15»), nunca como precio total (US$ 114).
// Es el mismo lenguaje que el widget y que el paso 1 del booking — el fix 1.1
// de analisis/revision-wireframes.md, y es lo que hace que el «desde US$ 99»
// de la home no se sienta una trampa al llegar aquí.
//
// Los precios salen de los datos (`precioLight`, `upgradePremium`), no de
// strings fijos: la misma tabla dice US$ 99 en Semi-Privado y US$ 98 en
// Snorkel Lovers sin tocar el componente.

export function MenuTour({ tour, ficha }: { tour: Tour; ficha: FichaTour }) {
  return (
    <section id="ancla-menu" className={`${BLOQUE_FICHA} scroll-mt-sticky-top`}>
      <Etiqueta>Tu menú, a tu elección</Etiqueta>
      <p className="mt-3 max-w-2xl text-sm text-navy-sub">
        Cada persona elige su plato al reservar. Recién hecho a bordo, no buffet recalentado.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {PLATOS.map((p) => (
          <figure key={p.id} className="overflow-hidden rounded-card bg-papel ring-1 ring-linea">
            {/* ⚠️ Surf & Turf y Vegetariano solo existen como thumbnails
                368×224 en la web actual (limitación documentada desde la v1 de
                la home) — el contenedor no los estira más allá de su nativo. */}
            <img
              src={`/fotos/${p.foto}.webp`}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="h-28 w-full object-cover"
            />
            <figcaption className="p-3">
              <p className="font-display text-sm font-semibold text-navy">{p.nombre}</p>
              <p className="mt-0.5 text-xs text-navy-soft">{p.desc}</p>
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Tabla Light/Premium — en móvil sigue siendo una tabla de 3 columnas
          estrechas (no se apila): son 2 filas y el valor está en comparar de un
          vistazo. `text-xs` + padding corto la hacen caber a 390. */}
      <div className="mt-6 overflow-hidden rounded-card ring-1 ring-linea">
        <table className="w-full border-collapse text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-linea bg-papel-hueso">
              <th className="p-3 font-medium text-navy-soft"></th>
              <th className="p-3 font-display font-semibold text-navy">Light — {formatoDinero(tour.precioLight)}</th>
              <th className="p-3 font-display font-semibold text-navy">
                Premium — <span className="text-aqua-dark">+{formatoDinero(ficha.upgradePremium)}</span>
              </th>
            </tr>
          </thead>
          <tbody className="text-navy-sub">
            <tr className="border-b border-linea">
              <td className="p-3 font-medium text-navy">Menú</td>
              <td className="p-3">Pollo o pescado a la parrilla</td>
              <td className="p-3">4 platos: mariscos, carne, surf & turf, vegetariano</td>
            </tr>
            <tr>
              <td className="p-3 font-medium text-navy">Todo lo demás</td>
              <td className="p-3 text-menta-texto">✓ idéntico</td>
              <td className="p-3 text-menta-texto">✓ idéntico</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-navy-soft">
        * Langosta se sustituye por langostino salvaje de marzo a junio (veda).
      </p>
    </section>
  )
}
