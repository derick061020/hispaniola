import { UtensilsCrossed } from 'lucide-react'
import { TituloSeccion } from '@/components/tour/titulo-seccion'
import { BLOQUE_FICHA } from '@/components/tour/bloque-ficha'
import { formatoDinero, type Tour } from '@/data/home'
import type { FichaTour, PlatoMenu } from '@/data/tours'

// «Tu menú, a tu elección» (wireframe A4) — el diferenciador estrella: fotos
// reales de los platos, un activo que ningún competidor tiene. Solo en
// 'completo': charter cotiza su menú a medida y Saona no tiene paquetes.
//
// 2026-07-17 (2ª pasada, feedback de Samuel: "el apartado de los menús me
// parece rarísimo"): antes eran 4 fotos sueltas (ni siquiera todos los platos)
// + 2 listas de texto repitiéndolos. Ahora se organiza POR PAQUETE — un bloque
// Light y un bloque Premium, cada uno con TODOS sus platos como cards con foto,
// para que se entienda de un vistazo qué es de cada paquete. Referencia de
// organización: Viator (pedido de Samuel).
//
// ⚠️ Premium se lee como DELTA («+US$ 15»), nunca como total (US$ 114): mismo
// lenguaje que el widget (fix 1.1 de revision-wireframes.md). Y el mensaje
// clave: lo ÚNICO que cambia entre paquetes es el menú.
//
// ⚠️ Faltan 3 fotos: los platos Premium «Lasaña vegetariana», «Lasaña con
// pollo» y «Cóctel de mariscos» no tienen asset en /fotos — se pintan con un
// placeholder de icono (no se rellenan con stock, regla del proyecto). Pedir
// las fotos reales a Samuel para completarlos.

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

function PaqueteMenu({
  nombre,
  precio,
  precioAcento,
  platos,
  cols,
}: {
  nombre: string
  precio: string
  /** true = el precio va en aqua (el delta «+US$ 15» del Premium). */
  precioAcento?: boolean
  platos: PlatoMenu[]
  cols: string
}) {
  return (
    // Fondo gris clarito y SIN borde (2026-07-17, Samuel): antes era card
    // blanca con borde igual que el bloque padre — se confundían. El gris lo
    // separa del padre blanco, y las cards de plato (blancas) resaltan encima.
    <div className="rounded-card-grande bg-fondo-ficha p-4 sm:p-5">
      <header className="mb-4 flex items-baseline justify-between gap-3 border-b border-linea pb-3">
        <div>
          <h3 className="font-display text-h3 font-semibold text-navy">Menú {nombre}</h3>
          <p className="mt-0.5 text-xs text-navy-soft">{platos.length} platos a elegir</p>
        </div>
        <span className={`shrink-0 font-display text-lg font-semibold ${precioAcento ? 'text-aqua-dark' : 'text-navy'}`}>
          {precio}
          <span className="ml-1 text-xs font-normal text-navy-soft">/persona</span>
        </span>
      </header>
      <div className={`grid gap-3 ${cols}`}>
        {platos.map((p) => (
          <PlatoCard key={p.nombre} plato={p} />
        ))}
      </div>
    </div>
  )
}

export function MenuTour({ tour, ficha }: { tour: Tour; ficha: FichaTour }) {
  return (
    <section id="ancla-menu" className={`${BLOQUE_FICHA} scroll-mt-sticky-top`}>
      <TituloSeccion>Tu menú, a tu elección</TituloSeccion>
      <p className="mt-3 max-w-2xl text-sm text-navy-sub">
        Cada persona elige su plato al reservar, recién hecho a bordo — no buffet recalentado. El menú es lo único que
        cambia entre los dos paquetes; el resto del tour es idéntico.
      </p>

      <div className="mt-5 flex flex-col gap-4">
        {/* Light: 2 platos → grid de 2 columnas, cards anchas que llenan la
            fila. Premium: 7 platos → hasta 4 columnas, más denso (se ve que
            trae más por el +US$ 15). */}
        <PaqueteMenu
          nombre="Light"
          precio={formatoDinero(tour.precioLight)}
          platos={ficha.menuLight}
          cols="grid-cols-2"
        />
        <PaqueteMenu
          nombre="Premium"
          precio={`+${formatoDinero(ficha.upgradePremium)}`}
          precioAcento
          platos={ficha.menuPremium}
          cols="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
        />
      </div>

      <p className="mt-3 text-xs text-navy-soft">
        * Langosta se sustituye por langostino salvaje de marzo a junio (veda).
      </p>
    </section>
  )
}
