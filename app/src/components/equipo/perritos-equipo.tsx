import { PERRITOS, PERRITOS_INTRO } from '@/data/perritos'
import { BLOQUE_FICHA } from '@/components/tour/bloque-ficha'

// [2026-11-19, Sr. Fernando] Los tres perros de la tripulación, debajo de su
// historia en /crew. Mismo lenguaje que el retrato del CEO de arriba: foto a
// 4/5 con `rounded-card-grande` y `object-top` (las fuentes son 2:3 y la
// cabeza se iría fuera con el recorte centrado).
export function PerritosEquipo() {
  return (
    <section className={BLOQUE_FICHA}>
      <h2 className="font-display text-h3 font-semibold text-navy">{PERRITOS_INTRO.titulo}</h2>
      <p className="mt-2 max-w-prose text-navy-sub">{PERRITOS_INTRO.lead}</p>
      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        {PERRITOS.map((p) => (
          <article key={p.foto} className="flex flex-col gap-3">
            <img
              src={`/fotos/${p.foto}.webp`}
              alt={p.nombre}
              loading="lazy"
              className="aspect-[4/5] w-full rounded-card-grande object-cover object-top"
            />
            <p className="font-display text-lg font-semibold text-navy">{p.nombre}</p>
            <p className="text-sm text-navy-sub">{p.texto}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
