import { useState } from 'react'
import { Estrellas } from '@/components/ui/estrellas'
import { GaleriaLightbox } from '@/components/tour/galeria-lightbox'
import { useDevFlag } from '@/dev/use-dev-flag'

// Mosaico de fotos reales del tour/evento — vive DENTRO del contenido, no en
// el hero (2026-07-17, 2ª vuelta: la 1ª iteración lo incrustó en el hero
// junto al video, pero Samuel: "no me gusta nada" — el título quedaba
// alineado a la izquierda sin respetar el max-width común de la página, y el
// grid no pertenecía ahí). Se resuelve al revés de la 1ª vez: el hero vuelve
// a ser solo el video (hero-interna.tsx) y este mosaico pasa a ser UN BLOQUE
// MÁS dentro de la columna de contenido — en la ficha de tour, la columna
// izquierda junto al widget (no ya una sección aparte a ancho completo entre
// el hero y el nav de anclas, como la v1 de PLAN-TOURS.md). Por eso vive más
// angosto que antes: el ancho de esa columna, no max-w-contenido completo.
//
// Sin celda "grande": a este ancho (columna, no la página entera) un cuadrante
// 2×2 uniforme lee mejor que un hueco gigante + 4 chicas.
//
// `quote` (solo 1ª celda): la reseña destacada por tour (`ficha.quoteDestacada`)
// — mismo esmerilado papel/90+blur que el chip de audiencia de TourCard. Los
// eventos no traen quote propia (FichaEvento no la tiene) → prop opcional.
export function GaleriaMosaico({
  fotos,
  etiqueta,
  quote,
}: {
  fotos: string[]
  /** describe el conjunto para lectores de pantalla (el nombre del tour/evento) */
  etiqueta: string
  quote?: { texto: string; rating: number }
}) {
  const [lightbox, setLightbox] = useState<number | null>(null)

  // [dev-mode] ?dev-galeria=abierta — ver src/dev/dev-registry.ts
  useDevFlag('dev-galeria', (v) => setLightbox(v === 'abierta' ? 0 : null))

  if (fotos.length <= 1) return null

  const celdas = fotos.slice(0, 4)
  const restantes = fotos.length - celdas.length

  // Sin celda vacía cuando faltan fotos para completar el 2×2: 4 fotos → grid;
  // menos de 4 → columna única a lo alto (nunca un hueco en blanco).
  const claseGrid =
    celdas.length === 4
      ? 'grid-cols-2 grid-rows-2'
      : celdas.length === 3
        ? 'grid-cols-1 grid-rows-3'
        : 'grid-cols-1 grid-rows-2'

  return (
    <>
      <div className={`grid h-56 gap-1 overflow-hidden rounded-card-grande sm:h-72 lg:h-galeria-ficha-alto ${claseGrid}`}>
        {celdas.map((foto, i) => {
          const esUltima = i === celdas.length - 1
          const conQuote = i === 0 && quote
          return (
            <button
              key={foto}
              type="button"
              onClick={() => setLightbox(i)}
              className="group relative overflow-hidden bg-papel-hueso"
            >
              <img
                src={`/fotos/${foto}.webp`}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {esUltima && restantes > 0 ? (
                <span className="absolute inset-0 grid place-items-center bg-overlay-foto text-sm font-semibold text-white">
                  +{restantes} fotos →
                </span>
              ) : null}
              {conQuote ? (
                <figure className="pointer-events-none absolute inset-x-2 bottom-2 rounded-card bg-papel/90 p-2 text-left shadow-card backdrop-blur-sm sm:inset-x-3 sm:bottom-3 sm:p-3">
                  <Estrellas calificacion={quote.rating} className="mb-1" />
                  <blockquote className="line-clamp-2 text-xs font-medium leading-snug text-navy sm:text-sm">
                    «{quote.texto}»
                  </blockquote>
                </figure>
              ) : null}
            </button>
          )
        })}
      </div>

      {lightbox !== null ? (
        <GaleriaLightbox fotos={fotos} indiceInicial={lightbox} etiqueta={etiqueta} onCerrar={() => setLightbox(null)} />
      ) : null}
    </>
  )
}
