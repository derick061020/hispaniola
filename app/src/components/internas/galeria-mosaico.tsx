import { useState, type CSSProperties } from 'react'
import { GaleriaLightbox } from '@/components/tour/galeria-lightbox'
import { useDevFlag } from '@/dev/use-dev-flag'

// Mosaico de fotos reales del tour/evento — vive DENTRO del contenido, no en
// el hero (2026-07-17: la iteración que lo incrustó en el hero desalineaba el
// título y no pertenecía ahí; se muda a la columna de contenido de la ficha,
// como un bloque más). Sin envoltorio blanco: es la galería, abre la columna.
//
// Layout (pedido de Samuel): 3 fotos arriba (fila más alta) + 4 abajo (fila
// más baja), y la última de abajo lleva el overlay «+N fotos» cuando quedan
// más en el lightbox. Rejilla de 12 columnas: arriba 3×col-span-4, abajo
// 4×col-span-3 — las dos filas llenan el ancho aunque tengan distinto nº de
// celdas. Necesita ≥7 fotos; con menos (los eventos traen 4) cae a un 2×2,
// nunca deja un hueco vacío.
export function GaleriaMosaico({
  fotos,
  etiqueta,
}: {
  fotos: string[]
  /** describe el conjunto para lectores de pantalla (el nombre del tour/evento) */
  etiqueta: string
}) {
  const [lightbox, setLightbox] = useState<number | null>(null)

  // [dev-mode] ?dev-galeria=abierta — ver src/dev/dev-registry.ts
  useDevFlag('dev-galeria', (v) => setLightbox(v === 'abierta' ? 0 : null))

  if (fotos.length <= 1) return null

  const amplio = fotos.length >= 7
  const visibles = amplio ? 7 : Math.min(4, fotos.length)
  const restantes = fotos.length - visibles

  const celda = (indice: number, span: string) => {
    const esUltima = indice === visibles - 1
    return (
      <button
        key={fotos[indice]}
        type="button"
        onClick={() => setLightbox(indice)}
        className={`group relative overflow-hidden bg-papel-hueso ${span}`}
      >
        <img
          src={`/fotos/${fotos[indice]}.webp`}
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
      </button>
    )
  }

  return (
    <>
      {amplio ? (
        // Fila superior 1.35fr, inferior 1fr → arriba «un poco más altas».
        <div
          className="grid h-72 grid-cols-12 gap-1.5 overflow-hidden rounded-card-grande sm:h-80 lg:h-galeria-ficha-alto"
          style={{ gridTemplateRows: '1.35fr 1fr' } as CSSProperties}
        >
          {[0, 1, 2].map((i) => celda(i, 'col-span-4'))}
          {[3, 4, 5, 6].map((i) => celda(i, 'col-span-3'))}
        </div>
      ) : (
        <div className="grid h-56 grid-cols-2 grid-rows-2 gap-1.5 overflow-hidden rounded-card-grande sm:h-72 lg:h-galeria-ficha-alto">
          {Array.from({ length: visibles }, (_, i) => celda(i, ''))}
        </div>
      )}

      {lightbox !== null ? (
        <GaleriaLightbox fotos={fotos} indiceInicial={lightbox} etiqueta={etiqueta} onCerrar={() => setLightbox(null)} />
      ) : null}
    </>
  )
}
