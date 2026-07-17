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

// Un bloque de platos por paquete. Fondo gris clarito y SIN borde (2026-07-17,
// Samuel): antes era card blanca con borde igual que el bloque padre — se
// confundían. La cabecera lleva el NOMBRE del menú y, en columna a la
// derecha, el precio (US$ X para Light, +US$ Y para Premium, sin precio
// para el menú Niños — incluido en la tarifa de niño). Es el idioma que
// Samuel pidió el 2026-07-17: «quita la comparativa, y deja que cada
// menú diga su precio (Light = US$ 99, Premium = +US$ 15)» — fija el
// anti bait-and-switch sin necesitar la tabla comparativa de Fase B.
function PaqueteMenu({
  nombre,
  precio,
  platos,
}: {
  nombre: string
  precio?: string
  platos: PlatoMenu[]
}) {
  return (
    <div className="rounded-card-grande bg-fondo-ficha p-4 sm:p-5">
      <div className="mb-4 flex items-baseline justify-between gap-3 border-b border-linea pb-3">
        <h3 className="font-display text-h3 font-semibold text-navy">Menú {nombre}</h3>
        {precio ? <span className="shrink-0 font-display text-lg font-semibold text-navy">{precio}</span> : null}
      </div>
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

// Bloque CHARTER (v3 2026-07-17, charter-privado): los 7 platos a elegir +
// 1 add-on de langosta premium, transversal a los 4 botes. Mismo idioma
// visual que MenuBuffet (lista con check + card de add-on) pero con los
// 7 platos en grid de 2 columnas en vez de lista vertical — son 7 ítems,
// la lista vertical se alarga demasiado.
function MenuCharter({
  platos,
  addOn,
}: {
  platos: { nombre: string; desc?: string }[]
  addOn?: { nombre: string; precio: number; descripcion?: string }
}) {
  return (
    <div className="rounded-card-grande bg-fondo-ficha p-4 sm:p-5">
      <h3 className="mb-4 border-b border-linea pb-3 font-display text-h3 font-semibold text-navy">
        El menú a medida
      </h3>
      <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
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
  // v3 (2026-07-17, Saona): si la ficha tiene menuBuffet, pintamos formato
  // buffet + add-on en vez del comparador Light/Premium clásico. Saona no
  // se vende por menú, se vende por BOTE (subVariantes en el widget) — el
  // menú es el mismo en las 3 sub-variantes.
  const esBuffet = ficha.menuBuffet !== undefined
  // v3 (2026-07-17, charter-privado): si la ficha tiene menuCharter,
  // pintamos el menú transversal (7 platos + 1 add-on). Misma idea que el
  // buffet de Saona — formato distinto al Light/Premium clásico.
  const esCharter = ficha.menuCharter !== undefined

  return (
    <section id="ancla-menu" className={`${BLOQUE_FICHA} scroll-mt-sticky-top`}>
      <TituloSeccion>
        {esBuffet ? 'El menú del día' : esCharter ? 'El menú a medida' : 'Tu menú, a tu elección'}
      </TituloSeccion>
      <p className="mt-3 max-w-2xl text-sm text-navy-sub">
        {esBuffet
          ? 'Buffet típico dominicano servido en la propia isla, con parada en la piscina natural antes y después.'
          : 'Cada persona elige su plato al reservar, recién hecho a bordo — no buffet recalentado.'}
      </p>

      {esBuffet ? (
        <div className="mt-4">
          <MenuBuffet platos={ficha.menuBuffet!.platos} addOn={ficha.menuBuffet!.addOn} />
        </div>
      ) : ficha.menuCharter ? (
        // v3 (2026-07-17, charter completo): pinta los 7 platos
        // transversales + 1 add-on de langosta premium. El menú es el
        // mismo en los 4 botes — lo que cambia es la BARCO (selector en
        // el widget, tabla de precios por pax).
        <div className="mt-4">
          <MenuCharter platos={ficha.menuCharter.platos} addOn={ficha.menuCharter.addOn} />
        </div>
      ) : (
        // v3 (2026-07-17, pedido de Samuel): se QUITA el comparador de
        // paquetes y se QUITA la opción Light/Premium del widget. El menú
        // único pinta los 7 platos del Premium (Snorkel Lovers) o 2 Light
        // + 7 Premium (Semi-privado). Si `menuLight` está VACÍO, no se
        // pinta el bloque Light y el bloque Premium se renombra a "Tu menú"
        // (sin la coletilla "Premium" — no hay diferenciador al que
        // contraponerse).
        <div className="mt-4 flex flex-col gap-4">
          {ficha.menuLight.length > 0 ? (
            <PaqueteMenu
              nombre="Light"
              precio={tour.precioLight !== null ? formatoDinero(tour.precioLight) : undefined}
              platos={ficha.menuLight}
            />
          ) : null}
          <PaqueteMenu
            // v3 (2026-07-17, pedido de Samuel): el nombre del menú único de
            // snorkel-lovers pasa a ser "Hispaniola" (sin coletilla "Tu menú"
            // que se leía redundante con el "Menú " que prepende el
            // componente). El bloque se pinta "Menú Hispaniola" — más
            // natural, y refuerza la marca del operador.
            nombre={ficha.menuLight.length > 0 ? 'Premium' : 'Hispaniola'}
            precio={
              ficha.menuLight.length > 0 && ficha.upgradePremium !== null
                ? `+${formatoDinero(ficha.upgradePremium)}`
                : tour.precioLight !== null
                  ? formatoDinero(tour.precioLight)
                  : undefined
            }
            platos={ficha.menuPremium}
          />
        </div>
      )}

      <p className="mt-3 text-xs text-navy-soft">
        * Langosta se sustituye por langostino salvaje de marzo a junio (veda).
      </p>
    </section>
  )
}
