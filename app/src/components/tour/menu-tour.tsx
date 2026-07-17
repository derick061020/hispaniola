import { Check, UtensilsCrossed, Plus } from 'lucide-react'
import { TituloSeccion } from '@/components/tour/titulo-seccion'
import { BLOQUE_FICHA } from '@/components/tour/bloque-ficha'
import { formatoDinero, type Tour } from '@/data/home'
import type { FichaTour, PlatoBuffet, PlatoMenu } from '@/data/tours'

// «Tu menú, a tu elección» (wireframe A4) — el diferenciador estrella: fotos
// reales de los platos, un activo que ningún competidor tiene. Solo en
// 'completo': charter cotiza su menú a medida.
//   - Si la ficha tiene menuBuffet (Saona, v3 2026-07-17): formato buffet
//     con lista de platos + add-on opcional. Misma cabecera y misma nota de
//     langosta al pie, sin comparador Light/Premium (Saona no se vende por
//     menú — se vende por BOTE, vía subVariantes en el widget).
//   - Si no: el modelo clásico con comparador Light/Premium.
//
// 2026-07-17 (2ª pasada, feedback de Samuel: "el apartado de los menús me
// parece rarísimo"): antes eran 4 fotos sueltas + 2 listas de texto. Se
// reorganizó POR PAQUETE — un bloque Light y un bloque Premium, cada uno con
// TODOS sus platos como cards con foto.
//
// 2026-07-17 (Fase B): la COMPARACIÓN de paquetes se FUNDE aquí (decisión de
// Samuel — en vez de una sección aparte, que solaparía con este menú). Arriba,
// un comparador de 2 columnas Light vs Premium (precio de lista + nº de platos
// + «todo el tour incluido»), con el mismo tratamiento LIGERO que la barra de
// KPIs (hairlines sobre blanco, no una card gris más); debajo, los platos de
// cada paquete con foto. El mensaje clave: el tour es idéntico, lo ÚNICO que
// cambia es el menú.
// ⚠️ La versión ANTERIOR de esta caja (sin comparador, con precio + conteo en
// la cabecera de cada bloque) queda guardada en el commit c23249a por si Samuel
// quiere volver: `git checkout c23249a -- app/src/components/tour/menu-tour.tsx`.
//
// ⚠️ Premium se lee con su tarifa de lista (US$ 114) y el delta «+US$ 15» como
// apoyo — mismo idioma que el widget de Fase B (precio de lista, no anclado en
// el descuento).

const GRID_PLATOS = 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'

function PlatoCard({ plato }: { plato: PlatoMenu }) {
  return (
    <figure className="overflow-hidden rounded-card bg-papel ring-1 ring-linea">
      {plato.foto ? (
        <img
          src={`/fotos/${plato.foto}.webp`}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="h-28 w-full object-cover"
        />
      ) : (
        <div className="grid h-28 w-full place-items-center bg-aqua-tint text-aqua-dark">
          <UtensilsCrossed className="size-6" aria-hidden="true" />
        </div>
      )}
      <figcaption className="p-3">
        <p className="font-display text-sm font-semibold text-navy">{plato.nombre}</p>
        {plato.desc ? <p className="mt-0.5 text-xs text-navy-soft">{plato.desc}</p> : null}
      </figcaption>
    </figure>
  )
}

// Una columna del comparador (Fase B): el resumen «qué te llevas con cada
// paquete». El precio es el de LISTA; el Premium añade su delta «+US$ 15».
function ComparaColumna({
  nombre,
  precio,
  delta,
  platos,
}: {
  nombre: string
  precio: string
  /** El delta «+US$ 15» del Premium; ausente en Light. */
  delta?: string
  platos: string
}) {
  return (
    <div className="px-4 first:pl-0 last:pr-0">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="font-display text-base font-semibold text-navy">Menú {nombre}</h3>
        <span className="shrink-0 font-display text-lg font-semibold text-navy">
          {precio}
          {delta ? <span className="ml-1 text-xs font-normal text-aqua-dark">{delta}</span> : null}
        </span>
      </div>
      <p className="mt-1 text-sm text-navy-sub">{platos}</p>
      <p className="mt-1.5 flex items-center gap-1.5 text-xs text-navy-soft">
        <Check className="size-3.5 shrink-0 text-menta-texto" aria-hidden="true" />
        Todo el tour incluido
      </p>
    </div>
  )
}

// Un bloque de platos por paquete. Fondo gris clarito y SIN borde (2026-07-17,
// Samuel): antes era card blanca con borde igual que el bloque padre — se
// confundían. Cabecera SIMPLE (solo el nombre): el precio y el nº de platos ya
// viven en el comparador de arriba (Fase B).
function PaqueteMenu({ nombre, platos }: { nombre: string; platos: PlatoMenu[] }) {
  return (
    <div className="rounded-card-grande bg-fondo-ficha p-4 sm:p-5">
      <h3 className="mb-4 border-b border-linea pb-3 font-display text-h3 font-semibold text-navy">Menú {nombre}</h3>
      <div className={`grid gap-3 ${GRID_PLATOS}`}>
        {platos.map((p) => (
          <PlatoCard key={p.nombre} plato={p} />
        ))}
      </div>
    </div>
  )
}

// Bloque BUFFET (v3 2026-07-17, Saona): una lista de platos servidos en la
// propia isla + el add-on opcional de langosta premium. Sin cards con foto
// (la comida del buffet no se ha fotografiado) y sin comparador Light/Premium
// (Saona no se vende por menú — se vende por BOTE).
function MenuBuffet({ platos, addOn }: { platos: PlatoBuffet[]; addOn?: { nombre: string; precio: number; descripcion?: string } }) {
  return (
    <div className="rounded-card-grande bg-fondo-ficha p-4 sm:p-5">
      <h3 className="mb-4 border-b border-linea pb-3 font-display text-h3 font-semibold text-navy">
        Buffet en Isla Saona
      </h3>
      <ul className="flex flex-col gap-2.5">
        {platos.map((p) => (
          <li key={p.nombre} className="flex items-start gap-2.5 text-sm text-navy">
            <Check className="mt-0.5 size-4 shrink-0 text-menta-texto" aria-hidden="true" />
            <span>
              <span className="font-semibold">{p.nombre}</span>
              {p.desc ? <span className="text-navy-soft"> · {p.desc}</span> : null}
            </span>
          </li>
        ))}
      </ul>
      {addOn ? (
        <div className="mt-4 flex items-center gap-3 rounded-card border border-linea bg-papel p-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-aqua-tint text-aqua-dark">
            <Plus className="size-4" aria-hidden="true" />
          </span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-navy">
              {addOn.nombre} · {formatoDinero(addOn.precio)}{' '}
              <span className="text-xs font-normal text-navy-soft">por persona</span>
            </p>
            {addOn.descripcion ? <p className="mt-0.5 text-xs text-navy-soft">{addOn.descripcion}</p> : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export function MenuTour({ tour, ficha }: { tour: Tour; ficha: FichaTour }) {
  const precioPremium =
    tour.precioLight !== null && ficha.upgradePremium !== null ? tour.precioLight + ficha.upgradePremium : null

  // v3 (2026-07-17, Saona): si la ficha tiene menuBuffet, pintamos formato
  // buffet + add-on en vez del comparador Light/Premium clásico. Saona no
  // se vende por menú, se vende por BOTE (subVariantes en el widget) — el
  // menú es el mismo en las 3 sub-variantes.
  const esBuffet = ficha.menuBuffet !== undefined

  return (
    <section id="ancla-menu" className={`${BLOQUE_FICHA} scroll-mt-sticky-top`}>
      <TituloSeccion>{esBuffet ? 'El menú del día' : 'Tu menú, a tu elección'}</TituloSeccion>
      <p className="mt-3 max-w-2xl text-sm text-navy-sub">
        {esBuffet
          ? 'Buffet típico dominicano servido en la propia isla, con parada en la piscina natural antes y después.'
          : 'Cada persona elige su plato al reservar, recién hecho a bordo — no buffet recalentado.'}
      </p>

      {esBuffet ? (
        <div className="mt-4">
          <MenuBuffet platos={ficha.menuBuffet!.platos} addOn={ficha.menuBuffet!.addOn} />
        </div>
      ) : (
        <>
          {/* Comparador de paquetes fundido en el menú (Fase B). Tratamiento
              LIGERO —hairlines sobre blanco, como la barra de KPIs— y NO una card
              gris más: las 2 columnas se dividen con un divisor vertical. */}
          <div className="mt-5 border-y border-linea py-4">
            <div className="grid grid-cols-2 divide-x divide-linea">
              <ComparaColumna
                nombre="Light"
                precio={formatoDinero(tour.precioLight)}
                platos={`${ficha.menuLight.length} platos a la parrilla`}
              />
              <ComparaColumna
                nombre="Premium"
                precio={formatoDinero(precioPremium)}
                delta={ficha.upgradePremium !== null ? `+${formatoDinero(ficha.upgradePremium)}` : undefined}
                platos={`${ficha.menuPremium.length} platos gourmet`}
              />
            </div>
            <p className="mt-3 text-center text-xs text-navy-soft">
              El tour es idéntico en los dos — lo único que cambia es el menú.
            </p>
          </div>

          {/* Los platos de cada paquete, con foto real. Ambos usan el mismo grid de
              hasta 4 columnas: así las 2 cards de Light quedan del tamaño de las de
              Premium y dejan huecos en blanco (2026-07-17, Samuel). */}
          <div className="mt-4 flex flex-col gap-4">
            <PaqueteMenu nombre="Light" platos={ficha.menuLight} />
            <PaqueteMenu nombre="Premium" platos={ficha.menuPremium} />
          </div>
        </>
      )}

      <p className="mt-3 text-xs text-navy-soft">
        * Langosta se sustituye por langostino salvaje de marzo a junio (veda).
      </p>
    </section>
  )
}
