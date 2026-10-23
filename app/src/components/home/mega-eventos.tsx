import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { OCASIONES, WEBS_GRUPO } from '@/data/home'
import { EnlacePrototipo } from '@/components/ui/enlace-prototipo'
import { t } from '@/lib/i18n'

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
//
// 3ª vuelta (2026-10-22, Samuel tras hablar con Raymond): se SUMAN las 4
// webs de party boat del grupo (WEBS_GRUPO) — los 3 eventos se quedan. Son
// 7 cards y 7 no cuadra en ninguna rejilla sin hueco, así que van en DOS
// filas rotuladas, cada una con su propia rejilla: «Private events» (3) y
// «Our party boats» (4). Desde lg el panel mide 4 cards y la fila de 3
// eventos se REPARTE de borde a borde (justify-between): alineada a la
// izquierda dejaba un hueco de una card arriba a la derecha — el mismo
// «espacio blanco raro» de la 2ª vuelta—, y estirar las cards está vetado.
// Entre md y lg (768-1023, donde 4 no caben en 92vw) el panel mide 3: los
// eventos llenan la fila y los barcos van a 2×2 centrados. (Desde el
// 2026-10-23 los tabs solo se muestran desde lg —ver nav-flotante.tsx—, así
// que esa variante hoy no se ve; se deja por si el corte vuelve a md.) Las cards son
// las mismas (foto, nombre, una línea); lo único que
// distingue a las externas es la flechita ↗ junto al nombre y que abren en
// pestaña nueva.
function ContenidoCard({ foto, nombre, meta, externa }: { foto: string; nombre: string; meta: string; externa?: boolean }) {
  // El zoom vive en el contenedor con overflow-hidden, no en el <img>
  // suelto — mismo motivo que MegaTours.
  return (
    <>
      <span className="block h-36 overflow-hidden rounded-card bg-papel-hueso">
        <img
          src={`/fotos/${foto}.webp`}
          alt=""
          aria-hidden="true"
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </span>
      <span className="mt-2 flex items-start gap-1 font-display text-sm font-semibold leading-tight text-navy transition-colors group-hover:text-aqua-dark">
        {nombre}
        {externa ? (
          <>
            <ArrowUpRight aria-hidden="true" className="mt-px size-3.5 shrink-0 text-navy-soft transition-colors group-hover:text-aqua-dark" />
            <span className="sr-only">{t('(opens in a new tab)')}</span>
          </>
        ) : null}
      </span>
      <span className="mt-0.5 block text-xs text-navy-soft">{meta}</span>
    </>
  )
}

function Rotulo({ children }: { children: ReactNode }) {
  return <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-navy-soft">{children}</p>
}

export function MegaEventos() {
  return (
    <div className="flex w-fit max-w-[92vw] flex-col gap-5 p-4">
      <div>
        <Rotulo>{t('Private events')}</Rotulo>
        <div className="flex justify-between gap-4">
          {OCASIONES.map((o) => {
            const contenido = <ContenidoCard foto={o.foto} nombre={o.nombre} meta={o.meta} />

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
      {/* El rótulo va DENTRO del bloque centrado: entre md y lg, con el 2×2
          en medio, se alinea con la primera card y no con el borde. */}
      <div className="mx-auto w-fit lg:mx-0">
        <Rotulo>{t('Our party boats')}</Rotulo>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {WEBS_GRUPO.map((w) => (
            <a
              key={w.id}
              href={w.url}
              target="_blank"
              rel="noopener"
              className="group block w-mega-card-ancho"
              data-mega-item
            >
              <ContenidoCard foto={w.foto} nombre={w.nombre} meta={w.meta} externa />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
