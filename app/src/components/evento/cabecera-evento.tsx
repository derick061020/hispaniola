import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import * as Breadcrumb from '@/components/alignui/breadcrumb'
import * as StatusBadge from '@/components/alignui/status-badge'
import { EnlacePrototipo } from '@/components/ui/enlace-prototipo'
import { Quote } from 'lucide-react'
import type { FichaEvento } from '@/data/eventos'

// Cabecera de las landings de eventos (PLAN-EVENTOS.md) — clon de la
// `cabecera-ficha.tsx` con 2 diferencias:
//
// 1) Los chips son GENÉRICOS del producto (no reassurance del cliente) — la
//    home ya carga 4.9★ y #1 TripAdvisor. Aquí los chips cuentan lo que
//    distingue a ESTE evento (capacidad, duración, "ruta a medida"…).
// 2) La migaja tiene "Eventos" como 2do tramo (no "Tours"). EnlacePrototipo
//    porque el hub `/eventos` general (sin landing) ya no existe — las 3
//    landings son el catálogo completo.
//
// Reusa el mismo lenguaje visual de la ficha: Header DENTRO del hero
// (HeroInterna), cabecera blanca sobre el video de marca, todo en
// max-w-contenido para que el H1 alinie con el resto de la página.

type Props = { evento: FichaEvento }

export function CabeceraEvento({ evento }: Props) {
  return (
    <div>
      {/* Migaja: Inicio / Eventos / {nombre}. "Eventos" va por
          EnlacePrototipo: no hay hub general en este build, las 3
          landings son el catálogo completo. Mismo trato que "Tours" en
          la ficha de tour. El asChild pone los estilos del Item
          directamente sobre el Link. */}
      <nav aria-label="Migaja de pan" className="migaja-sobre-foto">
        <Breadcrumb.Root>
          <Breadcrumb.Item asChild>
            <Link to="/">Inicio</Link>
          </Breadcrumb.Item>
          <Breadcrumb.ArrowIcon as={ChevronRight} className="size-4 self-center" />
          <Breadcrumb.Item asChild>
            <EnlacePrototipo>Eventos</EnlacePrototipo>
          </Breadcrumb.Item>
          <Breadcrumb.ArrowIcon as={ChevronRight} className="size-4 self-center" />
          <Breadcrumb.Item active>{evento.nombre}</Breadcrumb.Item>
        </Breadcrumb.Root>
      </nav>

      {/* Mismo --text-h2 que la ficha de tour (32px). El H1 manda por
          jerarquía, no por tamaño — el hero de la home es el único con
          --text-hero. text-balance equilibra las 2 líneas en desktop. */}
      <h1 className="mt-3 text-balance font-display text-h2 font-semibold text-white">
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
