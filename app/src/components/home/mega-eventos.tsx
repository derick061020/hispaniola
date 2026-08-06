import { Link } from 'react-router-dom'
import { OCASIONES } from '@/data/home'
import { EnlacePrototipo } from '@/components/ui/enlace-prototipo'

// Megamenú Eventos — mismo patrón que MegaTours (2026-07-17, pedido de
// Samuel: "ya que los eventos los redujimos a 3, haz que tenga el mismo
// patrón de diseño que los tours, mismas cards que el mega menú de tours,
// quitamos ese box a la izquierda con eventos privados"). Con solo 3
// ocasiones (LOS 3 EVENTOS de la web actual), la foto editorial de la
// columna izquierda ("Eventos privados" + "Pedir cotización") ya no aporta
// nada que las propias cards no digan — se retira, y el menú pasa a ser
// SOLO la rejilla de cards: foto grande, nombre, una línea de meta.
//
// 2ª vuelta (mismo día, Samuel: "quita ese footer... y ya que son 3, que el
// ancho del megamenú se adapte para los 3, queda un espacio blanco raro,
// pero ojo no hagas que las cards sean más anchas"): se quita la salida "Ver
// los N eventos →" (con solo 3 cards mostrando ya el total, no llevaba a un
// catálogo más grande) y `xl:grid-cols-4` pasa a `xl:grid-cols-3` — 3
// columnas para 3 ítems, sin celda vacía. El panel ya no tiene un ancho en
// rem fijo (antes copiado 1:1 de MegaTours, calibrado para 4 columnas): es
// `w-fit` con cada card a --spacing-mega-card-ancho (mismo token que
// MegaTours) — el ancho se autoajusta al Nº de columnas sin tocar el ancho
// de card, así los 2 megamenús siguen siendo el mismo componente con datos
// distintos.
export function MegaEventos() {
  return (
    <div className="w-fit max-w-[92vw] p-4">
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
        {OCASIONES.map((o) => {
          // El zoom vive en el contenedor con overflow-hidden, no en el
          // <img> suelto — mismo motivo que MegaTours.
          const contenido = (
            <>
              <span className="block h-36 overflow-hidden rounded-card bg-papel-hueso">
                <img
                  src={`/fotos/${o.foto}.webp`}
                  alt=""
                  aria-hidden="true"
                  className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </span>
              <span className="mt-2 block font-display text-sm font-semibold leading-tight text-navy transition-colors group-hover:text-aqua-dark">
                {o.nombre}
              </span>
              <span className="mt-0.5 block text-xs text-navy-soft">{o.meta}</span>
            </>
          )

          // Bodas y MICE llevan a su landing real; «Eventos y party boat»
          // sigue en el prototipo (formulario del hub) — misma unión por
          // `slug` que antes tenía ItemOcasion.
          // data-mega-item: ver el comentario en item-menu.tsx — marcador
          // que TabsConPaneles (nav-tabs.tsx) anima con stagger al abrir.
          if (o.slug) {
            return (
              <Link key={o.tipo} to={`/events/${o.slug}`} className="group block w-mega-card-ancho" data-mega-item>
                {contenido}
              </Link>
            )
          }
          return (
            <EnlacePrototipo key={o.tipo} className="group block w-mega-card-ancho" data-mega-item>
              {contenido}
            </EnlacePrototipo>
          )
        })}
      </div>
    </div>
  )
}
