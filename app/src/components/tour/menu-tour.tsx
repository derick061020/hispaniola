import { Etiqueta } from '@/components/ui/etiqueta'
import { BLOQUE_FICHA } from '@/components/tour/bloque-ficha'
import { formatoDinero, type Tour } from '@/data/home'
import type { FichaTour } from '@/data/tours'

// «Tu menú, a tu elección» (wireframe A4) — el diferenciador estrella: fotos
// reales de los platos, un activo que ningún competidor tiene. Solo en
// 'completo': charter cotiza su menú a medida y Saona no tiene paquetes.
//
// 2026-07-17: el menú es POR PAQUETE (portado de la web aprobada, ver
// data/tours.ts). Light = 2 platos a la parrilla; Premium = 7 platos. Se lee
// de ficha.menuLight / ficha.menuPremium — antes usaba un PLATOS compartido de
// 4 que no distinguía paquete.
//
// ⚠️ Premium se lee como DELTA («+US$ 15»), nunca como precio total (US$ 114):
// el mismo lenguaje que el widget, el fix 1.1 de analisis/revision-wireframes.md
// — es lo que hace que el «desde US$ 99» de la home no se sienta una trampa al
// llegar aquí. Y el mensaje clave: lo ÚNICO que cambia entre paquetes es el
// menú, todo lo demás del tour es idéntico.

export function MenuTour({ tour, ficha }: { tour: Tour; ficha: FichaTour }) {
  // Los 4 platos fotografiados del Premium (los otros 3 —lasañas, cóctel— no
  // tienen asset y viven solo en la lista de abajo).
  const conFoto = ficha.menuPremium.filter((p) => p.foto)

  return (
    <section id="ancla-menu" className={`${BLOQUE_FICHA} scroll-mt-sticky-top`}>
      <Etiqueta>Tu menú, a tu elección</Etiqueta>
      <p className="mt-3 max-w-2xl text-sm text-navy-sub">
        Cada persona elige su plato al reservar. Recién hecho a bordo, no buffet recalentado.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {conFoto.map((p) => (
          <figure key={p.nombre} className="overflow-hidden rounded-card bg-papel ring-1 ring-linea">
            {/* ⚠️ Surf & Turf y Vegetariano solo existen como thumbnails
                368×224 en la web actual — el contenedor no los estira más allá
                de su nativo. */}
            <img
              src={`/fotos/${p.foto}.webp`}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="h-28 w-full object-cover"
            />
            <figcaption className="p-3">
              <p className="font-display text-sm font-semibold text-navy">{p.nombre}</p>
              {p.desc ? <p className="mt-0.5 text-xs text-navy-soft">{p.desc}</p> : null}
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Light vs Premium — el menú es lo único que cambia entre paquetes. Dos
          columnas (apiladas en móvil): precio + lista de platos de cada uno. */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-card p-4 ring-1 ring-linea">
          <p className="font-display text-sm font-semibold text-navy">Light — {formatoDinero(tour.precioLight)}</p>
          <p className="mt-0.5 text-xs text-navy-soft">{ficha.menuLight.length} platos a elegir</p>
          <ul className="mt-2 flex flex-col gap-1 text-sm text-navy-sub">
            {ficha.menuLight.map((p) => (
              <li key={p.nombre}>
                {p.nombre}
                {p.desc ? <span className="text-navy-soft"> — {p.desc}</span> : null}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-card p-4 ring-1 ring-linea">
          <p className="font-display text-sm font-semibold text-navy">
            Premium — <span className="text-aqua-dark">+{formatoDinero(ficha.upgradePremium)}</span>
          </p>
          <p className="mt-0.5 text-xs text-navy-soft">{ficha.menuPremium.length} platos a elegir</p>
          <ul className="mt-2 flex flex-col gap-1 text-sm text-navy-sub">
            {ficha.menuPremium.map((p) => (
              <li key={p.nombre}>{p.nombre}</li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-3 text-xs text-navy-soft">
        El resto del tour es idéntico en los dos paquetes — solo cambia el menú. Langosta se sustituye por langostino
        salvaje de marzo a junio (veda).
      </p>
    </section>
  )
}
