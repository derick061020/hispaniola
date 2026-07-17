import { Estrellas } from '@/components/ui/estrellas'

// Mosaico de fotos reales incrustado en HeroInterna (PLAN-INTERNAS-V2.md,
// iteración 2026-07-17 — Samuel: "se ve raro que justo debajo del hero esté
// el grid [de fotos]" suelto en su propia sección. Se resuelve integrándolo
// DENTRO del hero, junto al video, en vez de vivir después de él).
//
// Puramente presentacional — el estado del lightbox y el deep-link de Dev
// Mode viven en HeroInterna (única fuente: las 2 variantes se montan a la
// vez, una la esconde CSS según el viewport, y duplicar el estado del
// lightbox en cada una abriría dos modales fullscreen a la vez).
//
//  - `columna` (sm+): mosaico dentro de la mitad derecha del hero, junto al
//    video. Sin celda "grande": el video ya carga ese peso visual.
//  - `tira` (móvil): fila horizontal con scroll, pegada al pie del hero,
//    sobre el propio video — a 390px no hay sitio para partir el hero en dos.
//
// `quote` (solo `columna`, 1ª celda): la reseña destacada por tour
// (`ficha.quoteDestacada`) que antes flotaba sobre la foto grande de
// galeria-mosaico.tsx (retirado en esta iteración) — mismo esmerilado
// papel/90+blur que el chip de audiencia de TourCard, aquí más compacto
// porque la celda ya no es la mitad del hero. No se pierde, se muda de
// sitio. Los eventos no traen quote propia (FichaEvento no la tiene) → prop
// opcional, sin overlay cuando falta.
export function GaleriaHero({
  fotos,
  variante,
  onAbrir,
  quote,
}: {
  fotos: string[]
  variante: 'columna' | 'tira'
  onAbrir: (indice: number) => void
  quote?: { texto: string; rating: number }
}) {
  const celdas = fotos.slice(0, 4)
  const restantes = fotos.length - celdas.length

  const celda = (foto: string, i: number) => {
    const esUltima = i === celdas.length - 1
    const conQuote = variante === 'columna' && i === 0 && quote
    return (
      <button
        key={foto}
        type="button"
        onClick={() => onAbrir(i)}
        className="group relative overflow-hidden bg-papel-hueso/20"
      >
        <img
          src={`/fotos/${foto}.webp`}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {esUltima && restantes > 0 ? (
          <span className="absolute inset-0 grid place-items-center bg-overlay-foto text-xs font-semibold text-white">
            +{restantes} fotos →
          </span>
        ) : null}
        {conQuote ? (
          <figure className="pointer-events-none absolute inset-x-2 bottom-2 rounded-card bg-papel/90 p-2 text-left shadow-card backdrop-blur-sm">
            <Estrellas calificacion={quote.rating} className="mb-1" />
            <blockquote className="line-clamp-2 text-xs font-medium leading-snug text-navy">«{quote.texto}»</blockquote>
          </figure>
        ) : null}
      </button>
    )
  }

  if (variante === 'tira') {
    return (
      <div className="flex gap-2 overflow-x-auto px-4 pb-3" style={{ scrollbarWidth: 'none' }}>
        {celdas.map((foto, i) => (
          <div key={foto} className="size-16 shrink-0 overflow-hidden rounded-card">
            {celda(foto, i)}
          </div>
        ))}
      </div>
    )
  }

  // Sin celda vacía cuando faltan fotos para completar el 2×2: 4 fotos → grid;
  // menos de 4 → columna única a lo alto (nunca un hueco en blanco).
  const claseGrid =
    celdas.length === 4
      ? 'grid-cols-2 grid-rows-2'
      : celdas.length === 3
        ? 'grid-cols-1 grid-rows-3'
        : celdas.length === 2
          ? 'grid-cols-1 grid-rows-2'
          : 'grid-cols-1 grid-rows-1'

  return <div className={`grid h-full gap-1 ${claseGrid}`}>{celdas.map((foto, i) => celda(foto, i))}</div>
}
