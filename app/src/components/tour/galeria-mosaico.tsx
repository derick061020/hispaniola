import { useState } from 'react'
import { Estrellas } from '@/components/ui/estrellas'
import { CarruselImagenes } from '@/components/ui/carrusel-imagenes'
import { GaleriaLightbox } from './galeria-lightbox'
import { useDevFlag } from '@/dev/use-dev-flag'
import type { Tour } from '@/data/home'
import type { FichaTour } from '@/data/tours'

// Mosaico de galería (wireframe A1): foto principal grande + 4 celdas, la
// última con la salida al lightbox. Layout clásico de ficha de producto
// (Airbnb/Civitatis): el visitante ve el sitio antes de leer una línea.
//
// La QUOTE flotante sobre la foto principal es prueba social ANTES del primer
// scroll — el mismo esmerilado (papel/90 + blur) del chip de audiencia de la
// TourCard, para no manchar la foto con un bloque opaco.
//
// ⚠️ Isla Saona no tiene galería (`galeriaCompleta: []`) y NO se rellena con
// fotos de los otros tours: son barcos y planes distintos, y mentiría sobre el
// producto. Su ficha muestra la portada sola, sin tile ni lightbox — la misma
// honestidad que el resto de su ficha (precio y capacidad «por confirmar»).

type Props = { tour: Tour; ficha: FichaTour }

function Quote({ texto, rating }: { texto: string; rating: number }) {
  return (
    <figure className="pointer-events-none absolute bottom-3 left-3 right-3 max-w-sm rounded-card bg-papel/90 p-3 shadow-card backdrop-blur-sm sm:bottom-4 sm:left-4">
      <Estrellas calificacion={rating} className="mb-1.5" />
      <blockquote className="text-xs font-medium leading-snug text-navy sm:text-sm">«{texto}»</blockquote>
    </figure>
  )
}

export function GaleriaMosaico({ tour, ficha }: Props) {
  const [lightbox, setLightbox] = useState<number | null>(null)

  // [dev-mode] deep-link del Glosario Dev — ver src/dev/dev-registry.ts
  useDevFlag('dev-galeria', (v) => setLightbox(v === 'abierta' ? 0 : null))

  // La portada del producto va primera; detrás, el material completo del tour.
  // El nº del tile sale de aquí (no de un número escrito a mano: el «33 fotos»
  // del wireframe era un placeholder).
  const todas = [tour.foto, ...ficha.galeriaCompleta]
  const hayGaleria = ficha.galeriaCompleta.length > 0
  const celdas = ficha.galeriaCompleta.slice(0, 4)

  return (
    <div className="mx-auto mt-5 max-w-contenido px-5 sm:px-10">
      {/* Móvil: el mosaico no cabe — se hojea. Reusa el carrusel de la
          TourCard, con el auto-avance APAGADO: aquí es una galería que el
          visitante controla, no un escaparate que se ofrece solo. */}
      <div className="md:hidden">
        <CarruselImagenes
          imagenes={todas}
          etiqueta={tour.nombre}
          autoAvance={false}
          className="relative h-64 rounded-card-grande"
        />
      </div>

      <div className="hidden md:block">
        {hayGaleria ? (
          <div className="grid h-mosaico-alto grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-card-grande">
            <button
              type="button"
              onClick={() => setLightbox(0)}
              className="group relative col-span-2 row-span-2 overflow-hidden bg-papel-hueso"
            >
              <img
                src={`/fotos/${tour.foto}.webp`}
                alt={`${tour.nombre} — foto principal`}
                className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <Quote texto={ficha.quoteDestacada} rating={tour.rating} />
            </button>

            {celdas.map((foto, i) => {
              const esUltima = i === celdas.length - 1
              return (
                <button
                  key={foto}
                  type="button"
                  // +1 porque la portada ocupa el índice 0 de `todas`.
                  onClick={() => setLightbox(i + 1)}
                  className="group relative overflow-hidden bg-papel-hueso"
                >
                  <img
                    src={`/fotos/${foto}.webp`}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {esUltima ? (
                    <span className="absolute inset-0 grid place-items-center bg-overlay-foto text-sm font-semibold text-white">
                      Ver las {todas.length} fotos →
                    </span>
                  ) : null}
                </button>
              )
            })}
          </div>
        ) : (
          <div className="relative h-mosaico-alto overflow-hidden rounded-card-grande bg-papel-hueso">
            <img
              src={`/fotos/${tour.foto}.webp`}
              alt={`${tour.nombre} — foto principal`}
              className="size-full object-cover"
            />
            <Quote texto={ficha.quoteDestacada} rating={tour.rating} />
          </div>
        )}
      </div>

      {lightbox !== null ? (
        <GaleriaLightbox
          fotos={todas}
          indiceInicial={lightbox}
          etiqueta={tour.nombre}
          onCerrar={() => setLightbox(null)}
        />
      ) : null}
    </div>
  )
}
