import { Quote } from 'lucide-react'
import * as StatusBadge from '@/components/alignui/status-badge'
import { SelloTripAdvisor } from '@/components/ui/sello-tripadvisor'
import type { FichaEvento } from '@/data/eventos'

// Cabecera de las landings de eventos (PLAN-EVENTOS.md) — clon de la
// `cabecera-ficha.tsx`: los chips son GENÉRICOS del producto (no
// reassurance del cliente) — la home ya carga 4.9★ y #1 TripAdvisor. Aquí
// los chips cuentan lo que distingue a ESTE evento (capacidad, duración,
// "ruta a medida"…).
//
// Reusa el mismo lenguaje visual de la ficha: Header DENTRO del hero
// (HeroInterna), cabecera blanca sobre el video de marca, todo en
// max-w-contenido para que el H1 alinie con el resto de la página. Sin
// migaja (retirada de todos los heros de internas, 2026-07-22, pedido de
// Samuel — este archivo la traía vía Breadcrumb de AlignUI, igual que
// cabecera-ficha.tsx).

type Props = { evento: FichaEvento }

export function CabeceraEvento({ evento }: Props) {
  return (
    <div>
      {/* [v2 2026-07-28, pedido de Samuel: «añádelo en todas»] El sello de
          TripAdvisor encabeza también las landings de evento. Deroga en parte
          el criterio de arriba —«los chips son genéricos del producto, la
          prueba social la carga la home»—, y con razón: ese criterio vale para
          una FILA DE CHIPS, que compite con la meta del producto, pero no para
          un sello sobre el H1, que funciona como eyebrow y da contexto antes
          del título. Además una landing de boda o de party boat se alcanza a
          menudo por enlace directo o anuncio, sin pasar por la home, así que
          la prueba social que «ya carga la home» no ha llegado nunca.
          Mismo sitio y misma pieza que en la ficha de tour: dos cabeceras que
          se declaran clones no deberían diferir en esto. */}
      <SelloTripAdvisor className="mb-4" />

      {/* Mismo --text-h2 que la ficha de tour (32px). El H1 manda por
          jerarquía, no por tamaño — el hero de la home es el único con
          --text-hero. text-balance equilibra las 2 líneas en desktop. */}
      <h1 className="text-balance font-display text-h2 font-semibold text-white">
        {evento.titulo}
      </h1>

      <p className="mt-3 max-w-3xl text-pretty text-base text-white/90 sm:text-lg">
        {evento.sub}
      </p>

      {/* Chips del producto. Estilo "disabled/stroke" (gris neutro) — son
          meta del producto, no reassurance. La home ya carga la prueba
          social. Diferencia con la ficha de tour: en tour "Cancelación
          gratis" es un status "completed" (menta, lo que ya está pagado);
          aquí no aplica (los eventos se cotizan). */}
      <div className="mt-4 flex flex-wrap gap-2">
        {evento.chips.map((chip) => (
          <StatusBadge.Root key={chip} status="disabled" variant="stroke">
            {chip}
          </StatusBadge.Root>
        ))}
      </div>

      {/* Slogan/quote (solo bodas, según data). Va AQUÍ, no sobre la foto
          del mosaico, para no romper el lenguaje de la ficha (la quote
          destacada de tour es de un review de cliente, 5★). El slogan
          de bodas es poesía institucional — se gana su sitio en el hero,
          con el icono Quote de lucide para que se lea como tal. */}
      {evento.quotePrincipal ? (
        <p className="mt-5 flex items-start gap-2 text-pretty font-display text-base italic text-white/90 sm:text-lg">
          <Quote className="mt-1 size-5 shrink-0 text-aqua-tint" aria-hidden="true" />
          <span>{evento.quotePrincipal}</span>
        </p>
      ) : null}
    </div>
  )
}
