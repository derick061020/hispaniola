import { Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { FichaTour } from '@/data/tours'

// Banda «esto es la modalidad Premium del producto» (correcciones v3, plan 02
// — slide 77).
//
// El cliente: «agregar sección con este texto: "En ésta sección ofrecemos
// nuestros Charter privado en modalidad Premium que es el más vendido"», con
// un botón que lleva a eventos/party boat.
// 📞 REUNIÓN 07-31 (23:12–26:41): el racional es de catálogo — el charter que
// se enseña ES la versión premium, y las opciones de entrada viven en
// Eventos/Party Boat.
//
// ⚠️ NO ES LA MISMA PIEZA QUE `banda-premium.tsx`, aunque compartan material.
// Se probó a fusionarlas y Samuel lo devolvió (2026-08-06): «el banner que te
// avisa que estás en algo premium debe seguir como estaba antes». Y tiene
// razón, porque no hacen el mismo trabajo:
//   · BandaPremium avisa de un ESTADO que el visitante acaba de elegir y
//     puede deshacer con el toggle del widget. Vive arriba, junto a la ficha
//     técnica, y desaparece si vuelve a Light.
//   · Esta habla del CATÁLOGO: no hay nada que deshacer, no depende de ningún
//     selector y su trabajo es ofrecer una salida hacia otro producto.
// Fundirlas obligaba a que una sola pieza cambiara de sitio, de condición y de
// significado según la ficha — que es como se construyen los componentes que
// nadie entiende medio año después.
//
// POR ESO VA DEBAJO DE LOS MENÚS (sitio que fijó Samuel): el visitante ya ha
// visto lo que se sirve a bordo, o sea que ya tiene el nivel de producto en la
// cabeza. Ofrecerle la alternativa más barata ANTES de eso sería regalar la
// venta; ofrecérsela después es dar una salida a quien no encaja.
export function BandaModalidad({ ficha }: { ficha: FichaTour }) {
  const modalidad = ficha.bandaModalidad
  if (!modalidad) return null

  return (
    // Mismo material que la banda de estado y que la franja de la langosta:
    // lámina de oro con tinta casi negra (--color-premium-fondo, no navy —
    // sobre oro el navy tira a morado). Es el idioma que el sitio ya usa para
    // «esto es el nivel premium», y usar otro dorado sería inventar un
    // segundo.
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-card bg-gradient-to-br from-premium-oro-oscuro via-premium-oro-claro to-premium-oro px-4 py-3 ring-1 ring-premium-oro-oscuro/40">
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 text-sm font-semibold text-premium-fondo">
          <Sparkles className="size-4 shrink-0" aria-hidden="true" />
          {modalidad.titulo}
        </p>
        <p className="mt-0.5 text-sm text-premium-fondo/75">{modalidad.texto}</p>
      </div>
      {/* El puente a la otra modalidad va como enlace subrayado y no como
          botón: es una salida lateral, no la acción que esta página quiere que
          hagas — el CTA de la ficha es reservar, y un segundo botón compitiendo
          con él en la misma pantalla resta en vez de sumar. */}
      <Link
        to={modalidad.cta.a}
        className="shrink-0 text-sm font-semibold text-premium-fondo underline decoration-premium-fondo/40 underline-offset-4 transition-colors hover:decoration-premium-fondo"
      >
        {modalidad.cta.texto}
      </Link>
    </div>
  )
}
