import { Link } from 'react-router-dom'
import { ArrowRight, CalendarDays, Ruler, Users } from 'lucide-react'
import type { BarcoFlota } from '@/data/nosotros'

// Card de barco de la flota — ES LA CARD DE TOUR DE LA HOME, no una card
// nueva (pedido explícito de Samuel, 2026-07-22: «las cards de los barcos no
// inventes, usa el mismo diseño que las cards de tours del home»). Misma
// anatomía, mismos tokens, mismo orden de lectura que home/tour-card.tsx:
//
//   wrapper rounded-card-grande + shadow-card + ring hairline, con el mismo
//   levantamiento al hover → stretched link invisible → passe-partout de 8px
//   con la foto a rounded-card (el radio CONCÉNTRICO: 24 − 8 = 16) y el chip
//   a left-5/top-5 → título → descripción a 2 líneas → fila de meta con
//   iconos → chips → CTA coral ancho con la receta fancy de AlignUI.
//
// Es un componente aparte y no una prop de TourCard porque los DATOS son
// otros: un tour tiene precio, rating y galería; un barco tiene eslora, año y
// una sola foto. Meterlos en el mismo componente daría un archivo con dos
// mitades excluyentes. En Figma son dos variantes del mismo componente de
// card — de ahí que las clases se copien literalmente en vez de aproximarse.
//
// Diferencias con TourCard, todas por falta de dato y no por criterio:
//   - sin carrusel: cada barco tiene UNA foto (data/nosotros.ts), así que la
//     foto es un <img> plano. Sin botones dentro, pero el wrapper se queda
//     como <article> + stretched link igual que el original — así las dos
//     cards siguen siendo la misma pieza si mañana hay galería por barco.
//   - sin precio a la derecha del título: los barcos no se venden sueltos, se
//     reservan a través de un tour o se cotizan como evento.
//   - sin rating: no hay reseñas por barco.
export function BarcoCard({ barco }: { barco: BarcoFlota }) {
  const destino = barco.cta === 'charter' ? '/tours/charter-privado' : '/eventos/bodas'
  const etiquetaCta = barco.cta === 'charter' ? 'Ver tours con este barco' : 'Cotizar para tu evento'

  return (
    <article className="nosotros-cascada-diagonal group relative flex flex-col overflow-hidden rounded-card-grande bg-papel shadow-card ring-1 ring-linea transition motion-safe:hover:-translate-y-1 hover:shadow-card-flotante">
      <Link to={destino} tabIndex={-1} aria-hidden="true" className="absolute inset-0 z-10" />

      <div className="relative z-20 h-64 p-2">
        <img
          src={`/fotos/${barco.foto}.webp`}
          alt={barco.fotoAlt}
          loading="lazy"
          className="size-full rounded-card object-cover"
        />
        <span className="pointer-events-none absolute left-5 top-5 z-10 rounded-chip bg-papel/90 px-3 py-1 text-xs font-medium text-navy shadow-sm backdrop-blur-sm">
          {barco.chipFoto}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 px-5 pb-5 pt-3">
        <h3 className="font-display text-h3 font-semibold text-navy">{barco.nombre}</h3>

        <p className="line-clamp-2 text-sm text-navy-sub">{barco.descripcionCorta}</p>

        {/* Ficha técnica desglosada — el equivalente a la fila de
            rating/duración/aforo de TourCard. Cada casilla se pinta solo si
            hay dato: la fuente no fecha todos los barcos ni publica una
            capacidad para el Joker, y ahí no se rellena el hueco (ver
            data/nosotros.ts). */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-navy-soft">
          <span className="flex items-center gap-1.5">
            <Ruler className="size-4" aria-hidden="true" />
            {barco.eslora ?? barco.tipo}
          </span>
          {barco.capacidad ? (
            <span className="flex items-center gap-1.5">
              <Users className="size-4" aria-hidden="true" />
              {barco.capacidad}
            </span>
          ) : null}
          {barco.anio ? (
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-4" aria-hidden="true" />
              {barco.anio}
            </span>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-chip bg-papel-hueso px-2.5 py-1 text-xs font-medium text-navy-sub ring-1 ring-inset ring-linea">
            {barco.idealPara}
          </span>
          {/* El tipo solo entra como chip si NO se está usando ya de sustituto
              de la eslora arriba — si no, el mismo dato dos veces. */}
          {barco.eslora ? (
            <span className="rounded-chip bg-papel-hueso px-2.5 py-1 text-xs font-medium text-navy-sub ring-1 ring-inset ring-linea">
              {barco.tipo}
            </span>
          ) : null}
        </div>

        {/* CTA — la receta del FancyButton primary de AlignUI portada a tokens
            Hispaniola, COPIADA VERBATIM de home/tour-card.tsx (ver allí el
            comentario largo con las 3 capas). Si esa receta cambia, cambia en
            los dos sitios: son la misma pieza. */}
        <div className="mt-auto pt-3">
          <Link
            to={destino}
            className="relative z-20 flex w-full items-center justify-center gap-2 rounded-chip bg-coral px-4 py-3 text-sm font-semibold text-white shadow-boton-fancy transition duration-200 ease-out before:pointer-events-none before:absolute before:inset-0 before:z-10 before:rounded-[inherit] before:bg-linear-to-b before:from-white/12 before:to-transparent before:p-px before:[mask-clip:content-box,border-box] before:[mask-composite:exclude] before:[mask-image:linear-gradient(#fff_0_0),linear-gradient(#fff_0_0)] after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:bg-linear-to-b after:from-white after:to-transparent after:opacity-[.16] after:transition after:duration-200 after:ease-out hover:after:opacity-[.24]"
          >
            {etiquetaCta}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  )
}
