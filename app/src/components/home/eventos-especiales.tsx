import { Link } from 'react-router-dom'
import { EVENTOS_ESPECIALES, type EventoEspecial } from '@/data/home'
import { Etiqueta } from '@/components/ui/etiqueta'
import { EnlacePrototipo } from '@/components/ui/enlace-prototipo'

// «Eventos especiales» (2026-07-17, pedido de Samuel) — la vitrina de 4 boxes
// del final de la home actual (Cumpleaños/Bodas/Aniversarios/Despedidas),
// nueva en este build. Ref. visual de Samuel: paneles de destino que se
// EXPANDEN al hover (tipo "London/Paris/New York") — los 4 boxes nacen del
// mismo tamaño, con título+descripción+CTA alineados abajo; al posar el
// ratón sobre uno, ESE crece y los otros 3 se adelgazan y pierden su
// contenido. El juego de hover es SOLO desde lg y con puntero real (ver
// .eventos-especiales-* en componentes.css); en móvil/tablet es un grid 2×2
// fijo, todo el contenido siempre visible (no hay hover persistente táctil).
//
// Mismo idioma que MegaEventos (mega-eventos.tsx): Bodas tiene landing real
// (/eventos/bodas) → <Link>; el resto no existe como página en este build →
// EnlacePrototipo, igual que la ocasión genérica de OCASIONES.
export function EventosEspeciales() {
  return (
    <section className="px-5 py-seccion-sm sm:px-10 sm:py-seccion">
      <div className="mx-auto max-w-contenido">
        <div className="text-center">
          <Etiqueta>Eventos especiales</Etiqueta>
          <h2 className="mt-3 font-display text-h2 font-semibold text-navy">
            Cada ocasión merece su propio catamarán
          </h2>
        </div>

        <div className="eventos-especiales-fila mt-10 grid grid-cols-2 gap-4 lg:h-eventos-especiales-alto lg:flex">
          {EVENTOS_ESPECIALES.map((evento) => (
            <EventoBox key={evento.id} evento={evento} />
          ))}
        </div>
      </div>
    </section>
  )
}

function EventoBox({ evento }: { evento: EventoEspecial }) {
  const clases =
    'eventos-especiales-item group relative flex h-80 items-end overflow-hidden rounded-card-grande sm:h-96 lg:h-full'

  const contenido = (
    <>
      <img
        src={`/fotos/${evento.foto}.webp`}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent" />
      <span className="eventos-especiales-contenido relative z-10 block p-5 text-white sm:p-6">
        <span className="block font-display text-lg font-semibold sm:text-xl">{evento.nombre}</span>
        <span className="mt-1 block text-sm text-white/85">{evento.meta}</span>
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold">Más información →</span>
      </span>
    </>
  )

  if (evento.slug) {
    return (
      <Link to={`/eventos/${evento.slug}`} className={clases}>
        {contenido}
      </Link>
    )
  }
  return <EnlacePrototipo className={clases}>{contenido}</EnlacePrototipo>
}
