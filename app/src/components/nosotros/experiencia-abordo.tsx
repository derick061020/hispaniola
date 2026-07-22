import { Link } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'
import { Etiqueta } from '@/components/ui/etiqueta'
import { COCINA_FLOTANTE, EXPERIENCIA, EXPERIENCIA_ABORDO } from '@/data/nosotros'

// «Un día de mar, cuidado al detalle» — la franja de experiencia (correcciones
// v1 del cliente, slide 4). Reescrita 2026-07-22 para seguir la maqueta:
//
//   1. La sección estrena CABECERA CENTRADA (eyebrow + titular + una línea) y
//      un CTA que la cierra. Antes era un eyebrow suelto a la izquierda y se
//      quedaba sin remate.
//   2. La COCINA FLOTANTE se muda aquí como card de apertura. Vivía tres
//      bloques más abajo, suelta, con la foto a sangre y un gradiente encima
//      — y era el argumento más fuerte de la página enterrado en medio. La
//      maqueta lo pone primero y con formato de prueba: badge sobre la foto,
//      titular, párrafo y 3 puntos verificables. cocina-flotante.tsx se retira.
//   3. Las 3 paradas del itinerario pasan de bloques planos (foto + número +
//      texto sueltos) a CARDS con el número en chip sobre la foto, que es lo
//      que las lee como una secuencia y no como tres cosas al azar.
//
// SIN fondo gris (Samuel, 2026-07-22). La maqueta pinta esta franja de
// --color-papel-hueso a sangre y así se montó primero, con contenedor y
// padding propios para poder sangrar; retirado el gris, ya no hay motivo para
// que sea la excepción de la página: vuelve a ser una sección normal dentro
// del contenedor común, y son las cards (blancas, con hairline) las que
// sostienen solas la separación contra el papel — igual que la rejilla de
// flota, que nunca tuvo banda de color detrás.
//
// SIN sombra y con las fotos EN MARCO (Samuel, 2026-07-22): las cards se
// apoyan solo en el hairline, y las fotos dejan de ir a sangre contra el
// borde — viven dentro del padding de la card con su propio
// --radius-card (16px) dentro del --radius-card-grande (24px) del marco.
//
// `.nosotros-cascada` en cada parada: entrada escalonada al cruzar el umbral
// (use-cascada-nosotros.ts). La card de cocina NO la lleva — es la primera
// cosa que se ve de la sección y no debe llegar tarde.
export function ExperienciaABordo() {
  return (
    <section>
      <div className="text-center">
        <Etiqueta>{EXPERIENCIA.eyebrow}</Etiqueta>
        <h2 className="mx-auto mt-3 max-w-2xl text-balance font-display text-h2 font-semibold text-navy">
          {EXPERIENCIA.titulo}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lead text-navy-sub">{EXPERIENCIA.sub}</p>
      </div>

      {/* Cocina flotante: foto a un lado, panel al otro. En lg la celda de la
          foto pierde el aspect ratio y estira a la altura de la fila (grid
          `stretch`), así los dos lados terminan a la misma altura sin fijar
          un alto a mano. */}
      <div className="mt-10 grid grid-cols-1 gap-6 rounded-card-grande bg-papel p-4 ring-1 ring-linea lg:grid-cols-2 lg:gap-10 lg:p-5">
        <div className="relative aspect-[4/3] overflow-hidden rounded-card lg:aspect-auto">
          <img
            src={`/fotos/${COCINA_FLOTANTE.foto}.webp`}
            alt={COCINA_FLOTANTE.fotoAlt}
            loading="lazy"
            className="absolute inset-0 size-full object-cover"
          />
          <span className="absolute left-4 top-4 rounded-chip bg-navy px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
            {COCINA_FLOTANTE.badge}
          </span>
        </div>

        <div className="flex flex-col justify-center py-2 lg:py-6 lg:pr-5">
          <Etiqueta>{COCINA_FLOTANTE.eyebrow}</Etiqueta>
          <h3 className="mt-3 font-display text-h2 font-semibold text-navy">{COCINA_FLOTANTE.titulo}</h3>
          <p className="mt-4 text-navy-sub">{COCINA_FLOTANTE.texto}</p>
          <ul className="mt-6 flex flex-col gap-3">
            {COCINA_FLOTANTE.puntos.map((punto) => (
              <li key={punto} className="flex items-center gap-3 text-sm font-medium text-navy">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-aqua-tint text-aqua-dark">
                  <Check className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
                </span>
                {punto}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {EXPERIENCIA_ABORDO.map((parada) => (
          <article
            key={parada.numero}
            className="nosotros-cascada flex flex-col rounded-card-grande bg-papel p-4 ring-1 ring-linea"
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-card">
              <img
                src={`/fotos/${parada.foto}.webp`}
                alt={parada.fotoAlt}
                loading="lazy"
                className="absolute inset-0 size-full object-cover"
              />
              <span className="absolute left-3 top-3 grid size-9 place-items-center rounded-full bg-navy font-display text-xs font-semibold text-white shadow-sm">
                {parada.numero}
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-2 pt-4">
              <h3 className="font-display text-h3 font-semibold text-navy">{parada.titulo}</h3>
              <p className="text-sm text-navy-sub">{parada.texto}</p>
              {/* Crédito de la fundación — solo la parada del vivero lo
                  tiene. `mt-auto` lo pega abajo para que las 3 cards rimen
                  aunque las otras dos no lleven chip. */}
              {parada.chip ? (
                <span className="mt-auto self-start rounded-chip bg-aqua-tint px-3 py-1.5 text-xs font-medium text-aqua-dark">
                  {parada.chip}
                </span>
              ) : null}
            </div>
          </article>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Link
          to="/#tours"
          className="group inline-flex items-center gap-2 rounded-btn bg-coral px-6 py-3.5 text-sm font-semibold text-white shadow-boton-fancy transition hover:bg-coral-dark"
        >
          {EXPERIENCIA.cta}
          <ArrowRight
            className="size-4 transition-transform duration-200 motion-safe:group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      </div>
    </section>
  )
}
