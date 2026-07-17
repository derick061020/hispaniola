import { Link } from 'react-router-dom'
import { ArrowRight, Clock, Star, Users } from 'lucide-react'
import type { Tour } from '@/data/home'
import { formatoDinero } from '@/data/home'
import { CarruselImagenes } from '@/components/ui/carrusel-imagenes'

// Card de tour — el escaparate de "Nuestros tours". El CTA "Ver tour" navega a
// la ficha REAL (/tours/:slug, PLAN-TOURS.md): era un EnlacePrototipo mientras
// la ficha solo existía en prototipo/.
//
// v3-F20 (PLAN-v3.md §18, pedido de Samuel): las cards se rediseñan con la FOTO
// de protagonista — un CARRUSEL con la galería real del servicio que desliza
// solo y, al hover, se pausa y saca flechas para pasarlo a mano (ui/
// carrusel-imagenes.tsx). Debajo, la anatomía de la ref. soft-UI: título +
// precio, descripción, fila de meta con iconos (rating/duración/aforo), chips
// de "incluye" y un CTA ancho.
//
// v3-F22 (nueva ref. soft-UI de Samuel, 2026-07-16): la foto deja la sangre y
// vive en un passe-partout de aire con esquinas propias (radio concéntrico), y
// el CTA pasa de navy plano a coral con la RECETA del FancyButton primary de
// AlignUI (it.2 — ver el comentario del CTA abajo).
//
// ⚠️ La card ya NO es un <a> (como en §17): el carrusel mete botones (flechas/
// puntos) y anidar botones dentro de un <a> es HTML inválido. En su lugar es un
// <article> con un Link-overlay invisible (z-10, "stretched link") para que
// TODA la card navegue al tour. El carrusel Y el CTA van en z-20 —por encima
// del overlay— para que su hover/flechas/puntos reciban el puntero.
//
// v3-F17.2 sigue vivo: las clases `tour-card` (aquí) + `.tours-cards` (en
// tours-grid.tsx) enganchan el hover de GRUPO por `:has()` (componentes.css) —
// al pasar por una, crece/rota y las demás se apagan.
export function TourCard({ tour, autoAvance = true }: { tour: Tour; autoAvance?: boolean }) {
  const galeria = tour.galeria ?? [tour.foto]

  return (
    <article className="tour-card group relative flex flex-col overflow-hidden rounded-card-grande bg-papel shadow-card ring-1 ring-linea transition motion-safe:hover:-translate-y-1 hover:shadow-card-flotante">
      {/* Stretched link (v3-F22 it.2): antes era el ::after del CTA; la receta
          fancy necesita los DOS pseudos del botón (borde-luz + brillo), así
          que el overlay pasa a ser este Link invisible aparte. Duplica el
          destino del CTA a propósito — tabIndex -1 + aria-hidden: ni parada de
          tab extra ni entrada doble en lectores; el CTA visible sigue siendo
          EL enlace. */}
      <Link to={`/tours/${tour.slug}`} tabIndex={-1} aria-hidden="true" className="absolute inset-0 z-10" />
      {/* v3-F22 (ref. soft-UI de Samuel, 2026-07-16): la foto ya NO va a
          sangre — passe-partout de aire (p-2) con esquinas propias. El radio
          interior NO es libre: rounded-card (16px) es el radio CONCÉNTRICO
          exacto — radio exterior (24px, --radius-card-grande) − aire (8px).
          Si cambia el aire, cambia el radio o las curvas dejan de ser
          paralelas. El chip pasa de left-3/top-3 a left-5/top-5 para
          conservar sus 12px de margen contra el borde de la FOTO (que ahora
          empieza 8px adentro). */}
      <div className="relative z-20 h-64 p-2">
        <CarruselImagenes imagenes={galeria} etiqueta={tour.nombre} autoAvance={autoAvance} className="h-full rounded-card" />
        <span className="pointer-events-none absolute left-5 top-5 z-10 rounded-chip bg-papel/90 px-3 py-1 text-xs font-medium text-navy shadow-sm backdrop-blur-sm">
          {tour.audienciaChip}
        </span>
      </div>

      {/* pt-3 (no p-5): el passe-partout ya pone 8px bajo la foto — 8+12
          conserva los 20px de aire foto→título que había con la foto a sangre. */}
      <div className="flex flex-1 flex-col gap-2 px-5 pb-5 pt-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-h3 font-semibold text-navy">{tour.nombre}</h3>
          {tour.precioLight !== null && (
            <p className="shrink-0 text-right leading-none">
              <span className="mb-0.5 block text-xs text-navy-soft">desde</span>
              <span className="font-display text-precio font-semibold text-navy">{formatoDinero(tour.precioLight)}</span>
            </p>
          )}
        </div>

        <p className="line-clamp-2 text-sm text-navy-sub">{tour.descripcionCorta}</p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-navy-soft">
          <span className="flex items-center gap-1.5">
            <Star className="size-4 fill-estrella text-estrella" aria-hidden="true" />
            {tour.rating}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-4" aria-hidden="true" />
            {tour.duracionCorta}
          </span>
          {tour.maxPax && (
            <span className="flex items-center gap-1.5">
              <Users className="size-4" aria-hidden="true" />
              máx. {tour.maxPax}
            </span>
          )}
        </div>

        {tour.destacados && (
          <div className="flex flex-wrap gap-1.5">
            {tour.destacados.map((d) => (
              <span
                key={d}
                className="rounded-chip bg-papel-hueso px-2.5 py-1 text-xs font-medium text-navy-sub ring-1 ring-inset ring-linea"
              >
                {d}
              </span>
            ))}
          </div>
        )}

        {/* CTA — la receta del FancyButton primary de AlignUI (v3-F22 it.2,
            pedido de Samuel) PORTADA a tokens Hispaniola, no el componente: la
            home no importa la capa AlignUI (PLAN-ALIGNUI.md — vive de la ficha
            hacia dentro). Tres capas sobre el coral plano, calcadas del vendor
            (components/alignui/fancy-button.tsx):
              ::before → borde-luz de 1px (degradado blanco 12%→0 recortado a
                         anillo con mask-composite: exclude),
              ::after  → brillo blanco 16% que baña la cara (24% al hover),
              sombra   → --shadow-boton-fancy (1px de caída + anillo coral).
            Al mudarse el stretched link al overlay (arriba), este botón queda
            en z-20 POR ENCIMA y por fin tiene :hover propio — el "lavado" que
            aquí prohibía cualquier hover (el del ancla se disparaba desde toda
            la card) ya no pasa. La flecha se queda con group-hover a
            propósito: se corre con el hover de la CARD, como hasta ahora. */}
        <div className="mt-auto pt-3">
          <Link
            to={`/tours/${tour.slug}`}
            className="relative z-20 flex w-full items-center justify-center gap-2 rounded-chip bg-coral px-4 py-3 text-sm font-semibold text-white shadow-boton-fancy transition duration-200 ease-out before:pointer-events-none before:absolute before:inset-0 before:z-10 before:rounded-[inherit] before:bg-linear-to-b before:from-white/12 before:to-transparent before:p-px before:[mask-clip:content-box,border-box] before:[mask-composite:exclude] before:[mask-image:linear-gradient(#fff_0_0),linear-gradient(#fff_0_0)] after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:bg-linear-to-b after:from-white after:to-transparent after:opacity-[.16] after:transition after:duration-200 after:ease-out hover:after:opacity-[.24]"
          >
            Ver tour
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  )
}
