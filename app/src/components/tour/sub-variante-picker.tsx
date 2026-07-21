import type { SubVarianteTour } from '@/data/tours'

// Selector de sub-variantes del widget (v3 2026-07-17).
// Reutilizable para Saona (3 botes: speedboat/fishing/catamarán) y para
// Charter (4 botes: Maite/GrandMa/Santa Maria/Forever Teresa). N viene
// del array `subVariantes` que se pinta — el grid y el thumb se calculan
// dinámicamente.
//
// Layout: 1 segmented control (mismo idioma que el toggle Light/Premium
// de Fase B — thumb blanco sobre pista gris, mismo translateX animado)
// + 1 card de preview con la foto, duración y capacidad del bote activo.
//
// Por qué la card de preview (v3 2026-07-17, charter): con 4 botes
// distintos, el nombre solo ("Forever Teresa") no basta para que el
// usuario entienda qué está eligiendo — la foto + la duración + la
// capacidad cierran la decisión. Sin la card, el selector parece un
// toggle de Light/Premium en vez de un selector de BOTE.

export function SubVariantePicker({
  subVariantes,
  activa,
  onChange,
}: {
  subVariantes: SubVarianteTour[]
  activa: string
  onChange: (id: string) => void
}) {
  const idx = Math.max(0, subVariantes.findIndex((s) => s.id === activa))
  const N = subVariantes.length
  // v3 (2026-07-17, fix Samuel): la fórmula correcta del thumb.
  // Contenedor: padding p-1 (4px) cada lado + gap-1 (4px) entre N
  // columnas. Cada columna mide:
  //   colWidth = (100% - 8px - (N-1)*4px) / N
  // El thumb tiene EXACTAMENTE ese ancho. Su translateX para saltar
  // idx columnas es `idx × (100% + 4px)` — donde el 100% es 1 width
  // del thumb (= 1 columna) y el 4px es el gap entre columnas. NO
  // usar `100%/N` dentro del translateX: eso sería 1/N del thumb, no
  // 1 columna. La fórmula `idx × (100% + 4px)` está verificada a mano
  // para N=2/3/4.
  const subActiva = subVariantes[idx]

  return (
    <div>
      <div
        role="tablist"
        className="relative grid gap-1 rounded-full bg-linea p-1"
        style={{ gridTemplateColumns: `repeat(${N}, minmax(0, 1fr))` }}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-1 left-1 rounded-full bg-papel shadow-sm transition-transform duration-200 ease-out motion-reduce:transition-none"
          style={{
            // v3 (2026-07-17, fix Samuel): el thumb mide exactamente el
            // ancho de una columna = 100% - 8px - (N-1)*4px, dividido N.
            // Su translateX para saltar idx columnas es `idx × (100% + 4px)`:
            // 100% = 1 width del thumb (= 1 columna), 4px = el gap.
            width: `calc((100% - 8px - ${(N - 1) * 4}px) / ${N})`,
            transform:
              idx > 0 ? `translateX(calc(${idx} * (100% + 4px)))` : 'translateX(0)',
          }}
        />
        {subVariantes.map((s) => {
          const activo = s.id === activa
          return (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={activo}
              onClick={() => onChange(s.id)}
              className={`relative z-10 flex items-center justify-center rounded-full px-0.5 py-2 text-center text-xs font-semibold leading-tight transition-colors sm:px-1 sm:text-sm ${
                activo ? 'text-navy' : 'text-navy-sub/55 hover:text-navy-sub'
              }`}
            >
              {s.nombre}
            </button>
          )
        })}
      </div>
      {subActiva ? (
        <p className="mt-2 text-center text-xs text-navy-soft">
          {subActiva.capacidad}
          {subActiva.duracion ? <> · {subActiva.duracion}</> : null}
        </p>
      ) : null}

      {/* Card de preview del bote activo (v3 2026-07-17, charter). Solo se
          pinta si la sub-variante tiene foto. Saona no tiene `foto` en
          sus sub-variantes (la diferenciación es por nombre + descripción
          de capacidad), así que Saona se queda con solo la línea de
          meta. */}
      {subActiva?.foto ? (
        <figure className="mt-3 overflow-hidden rounded-card bg-papel ring-1 ring-linea">
          <img
            src={`/fotos/${subActiva.foto}.webp`}
            alt={subActiva.nombre}
            loading="lazy"
            className="aspect-[16/9] w-full object-cover"
          />
          <figcaption className="px-3 py-2 text-xs text-navy-sub">
            {subActiva.descripcion}
          </figcaption>
        </figure>
      ) : null}
    </div>
  )
}
