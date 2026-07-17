import { TituloSeccion } from '@/components/tour/titulo-seccion'
import { BLOQUE_FICHA } from '@/components/tour/bloque-ficha'
import type { FichaEvento } from '@/data/eventos'

// "Qué ofrecemos" de las landings de eventos (PLAN-EVENTOS.md) — 3 cards
// de formato/incentivo. Mismo lenguaje visual que la ficha de tour (cards
// con foto + título + texto), sin icono forzado: las fotos YA son la
// imagen. La sección de la ficha de tour equivalente es `IncluyeTour`,
// pero con cards de foto (no icono+texto) porque los formatos son
// experiencias distintas, no items de una lista.
//
// Replica el lenguaje de los "formatos" de la versión vieja de
// data/eventos.ts (la que tenía `formatos-evento.tsx`), solo que con
// el look de la ficha de tour.

export function QueOfrecemos({ evento }: { evento: FichaEvento }) {
  if (evento.formatos.length === 0) return null

  return (
    <section id="ancla-formatos" className={`${BLOQUE_FICHA} scroll-mt-sticky-top`}>
      <TituloSeccion>{evento.formatosTitulo}</TituloSeccion>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {evento.formatos.map((f) => (
          <article
            key={f.titulo}
            className="flex flex-col overflow-hidden rounded-card ring-1 ring-linea"
          >
            <div className="aspect-[4/3] overflow-hidden bg-papel-hueso">
              <img
                src={`/fotos/${f.foto}.webp`}
                alt={f.fotoAlt}
                loading="lazy"
                className="size-full object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col p-4">
              <h3 className="font-display text-base font-semibold text-navy">{f.titulo}</h3>
              <p className="mt-1 text-sm text-navy-sub">{f.texto}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
