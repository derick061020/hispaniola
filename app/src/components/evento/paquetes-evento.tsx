import { useState } from 'react'
import { Check, Sparkles, Package } from 'lucide-react'
import { TituloSeccion } from '@/components/tour/titulo-seccion'
import { BLOQUE_FICHA } from '@/components/tour/bloque-ficha'
import { useDevFlag } from '@/dev/use-dev-flag'
import type { FichaEvento, PaqueteEvento } from '@/data/eventos'

// "Paquetes" de las landings de evento (PLAN-EVENTOS.md §3) — solo
// presente en party-boat (la web del cliente vende 4 paquetes para
// eventos). Misma estructura que el comparador de paquetes de la
// ficha de tour (`menu-tour.tsx`) pero sin el toggle Light/Premium —
// cada paquete es INDEPENDIENTE, no un upgrade de otro.
//
// Layout:
//  - 1 col en móvil, 2 cols desde lg (2x2 en desktop) — pedido de
//    Samuel 2026-07-17: "estan muy apretados, ponlos en un grid de
//    2 columnas". La card en 1/4 de pantalla quedaba con fotos
//    pequenas y poco aire — 2 columnas da espacio a la foto del
//    plato y a la lista de items con check.
//  - Cada card: foto (si tiene) + nombre + precio + capacidad + items
//    con check + extra de precio. El Premium lleva un badge "Most
//    complete" y un acento aqua en el borde (mismo lenguaje que la
//    card "recomendado" de la ficha de tour, pero en lugar del coral
//    usa aqua — el coral está reservado para el CTA del widget).
//  - La card "premium" se pinta primero, con un fondo `bg-aqua-tint`
//    sutil para destacar.
//  - El click en una card NO navega a otro lado — el form sigue
//    siendo la única acción. La card es informativa: el visitante
//    LEE los 4 paquetes, luego rellena el form mencionando el que
//    quiere en el campo "mensaje".
//
// Si en el futuro se quiere que el form incluya el paquete
// seleccionado como campo separado, este componente ya pasa el id
// del paquete por hover/focus — solo hay que levantar el estado al
// padre (pages/evento.tsx) y añadir un hidden input al widget.

function Card({ paquete }: { paquete: PaqueteEvento }) {
  const esPremium = paquete.destacado === 'premium'
  return (
    <article
      className={[
        'flex flex-col overflow-hidden rounded-card ring-1 transition-shadow',
        esPremium ? 'ring-2 ring-aqua bg-aqua-tint/40' : 'ring-linea',
        'hover:shadow-card',
      ].join(' ')}
    >
      {/* Foto (si tiene) o placeholder */}
      {paquete.foto ? (
        <div className="aspect-[4/3] overflow-hidden bg-papel-hueso">
          <img
            src={`/fotos/${paquete.foto}.webp`}
            alt={paquete.fotoAlt}
            loading="lazy"
            className="size-full object-cover"
          />
        </div>
      ) : (
        <div className="flex aspect-[4/3] items-center justify-center bg-papel-hueso">
          <Package className="size-12 text-navy-soft" aria-hidden="true" />
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        {esPremium ? (
          <span className="mb-2 inline-flex w-fit items-center gap-1 rounded-chip bg-aqua-tint px-2 py-0.5 text-xs font-semibold text-aqua-dark">
            <Sparkles className="size-3" aria-hidden="true" />
            El más completo
          </span>
        ) : null}

        <h3 className="font-display text-lg font-semibold text-navy">{paquete.nombre}</h3>

        <p className="mt-1 font-display text-2xl font-semibold text-navy">{paquete.precio}</p>
        <p className="text-xs text-navy-soft">
          {paquete.capacidad} · {paquete.meta}
        </p>

        {/* Items con check. Si el array viene vacío (paquetes #I, #II,
            #III pendientes de confirmar con la web del cliente), se
            muestra un placeholder honesto en vez de inventar items. */}
        {paquete.items.length > 0 ? (
          <ul className="mt-4 flex-1 space-y-2">
            {paquete.items.map((it) => (
              <li key={it.titulo} className="flex items-start gap-2 text-sm text-navy-sub">
                <Check
                  className="mt-0.5 size-4 shrink-0 text-menta-texto"
                  aria-hidden="true"
                />
                <span>
                  {it.titulo}
                  {it.texto ? <span className="text-navy-soft"> · {it.texto}</span> : null}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 flex-1 text-sm italic text-navy-soft">
            Menú detallado al confirmar — escríbenos por WhatsApp y te lo pasamos.
          </p>
        )}

        {paquete.extraPrecio ? (
          <p className="mt-4 border-t border-linea pt-3 text-xs text-navy-soft">
            {paquete.extraPrecio}
          </p>
        ) : null}
      </div>
    </article>
  )
}

export function PaquetesEvento({ evento }: { evento: FichaEvento }) {
  const paquetes = evento.paquetes
  if (!paquetes || paquetes.items.length === 0) return null

  // [dev-mode] deep-link del Glosario Dev — ver src/dev/dev-registry.ts.
  // 'package-i' / 'package-ii' / 'package-iii' / 'premium' añade un
  // borde más grueso a la card correspondiente (frame de Figma con
  // un paquete destacado). No se usa en producción.
  const [destacado, setDestacado] = useState<string | null>(null)
  useDevFlag('dev-paquete', (v) => {
    if (['premium', 'package-i', 'package-ii', 'package-iii'].includes(v)) {
      setDestacado(v)
    }
  })

  return (
    <section id="ancla-paquetes" className={`${BLOQUE_FICHA} scroll-mt-sticky-top`}>
      <TituloSeccion>{paquetes.titulo}</TituloSeccion>
      <p className="mt-2 text-sm text-navy-sub">{paquetes.intro}</p>

      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {paquetes.items.map((p) => (
          <div
            key={p.id}
            className={destacado === p.id ? 'ring-2 ring-coral ring-offset-2 rounded-card' : ''}
          >
            <Card paquete={p} />
          </div>
        ))}
      </div>

      {paquetes.nota ? (
        <p className="mt-5 border-t border-linea pt-4 text-xs text-navy-soft">
          {paquetes.nota}
        </p>
      ) : null}
    </section>
  )
}
