import { ArrowRight, Crown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BLOQUE_FICHA } from '@/components/tour/bloque-ficha'
import type { FichaTour } from '@/data/tours'

// «En esta sección ofrecemos nuestro Charter privado en modalidad Premium»
// (correcciones v3, plan 02 — slide 77).
//
// El cliente pidió literalmente «agregar SECCIÓN con este texto» + un botón a
// eventos/party boat. 📞 REUNIÓN 07-31 (23:12–26:41): el racional es de
// catálogo — el charter que se enseña ES la versión premium, y las opciones de
// entrada viven en Eventos/Party Boat.
//
// TRES CORRECCIONES DE SAMUEL (2026-08-06) están cocidas en este archivo,
// porque las tres nacieron de haberlo montado mal la primera vez:
//
//  1. NO ES LA BANDA «ESTÁS EN PREMIUM». Se probó a reutilizarla y la devolvió:
//     «el banner que te avisa que estás en algo premium debe seguir como
//     estaba antes». No hacen el mismo trabajo — aquella avisa de un ESTADO
//     que el visitante eligió y puede deshacer con el toggle del widget; esta
//     habla del CATÁLOGO y ofrece una salida hacia otro producto.
//
//  2. NO VA EN DORADO. «Justo antes está el banner dorado de la langosta», y
//     tiene razón: dos láminas de oro seguidas se anulan entre sí — la segunda
//     deja de significar «premium» y pasa a leerse como el fondo de la página.
//     Va con el material NEUTRO de las secciones de ficha (papel + hairline),
//     que además es lo coherente con que el cliente pidiera una «sección» y no
//     una banda. El acento premium queda en el icono y el eyebrow, en oro
//     oscuro sobre claro: un cuentagotas, no una superficie.
//
//  3. EL TEXTO ES EL DEL SLIDE, literal. La primera versión lo reescribió a
//     algo más comercial y Samuel lo cortó: «los textos no son como los que
//     dice el slide».
//     ⚠️ Eso incluye la promesa del botón («modalidades más económicas»), que
//     HOY NO CUADRA: el charter más barato (Maite, US$ 625) sale por debajo
//     del party boat más barato (US$ 660). Lo detectó el propio Samuel en la
//     reunión y Miguel respondió que van a reestructurar precios; se porta el
//     texto aprobado y el aviso queda anotado en data/tours.ts.
//
// DÓNDE VA: debajo de los menús, sitio que fijó Samuel. Tiene su lógica — el
// visitante ya ha visto lo que se sirve a bordo, así que ya tiene el nivel de
// producto en la cabeza. Ofrecerle la alternativa más barata ANTES de eso
// sería regalar la venta; ofrecérsela después es dar salida a quien no encaja.
export function SeccionModalidad({ ficha }: { ficha: FichaTour }) {
  const modalidad = ficha.bandaModalidad
  if (!modalidad) return null

  return (
    <section className={BLOQUE_FICHA}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="flex items-start gap-3">
          {/* El único acento premium de la pieza. En aqua no diría «modalidad
              superior»; en oro oscuro sobre claro sí, y sin gastar superficie. */}
          <span
            aria-hidden="true"
            className="grid size-9 shrink-0 place-items-center rounded-full bg-premium-oro-claro/25 text-premium-oro-oscuro"
          >
            <Crown className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="text-eyebrow font-semibold uppercase tracking-[0.14em] text-premium-oro-oscuro">
              {modalidad.eyebrow}
            </p>
            {/* [v3 2026-08-07] Sin tope de ancho (ver comparador-premium.tsx). */}
            <p className="mt-1 text-navy-sub">{modalidad.texto}</p>
          </div>
        </div>

        {/* Enlace, no botón coral: el CTA de esta página es reservar, y un
            segundo botón fuerte compitiendo con él en la misma pantalla resta.
            Esto es una salida lateral para quien no encaja en el producto. */}
        <Link
          to={modalidad.cta.a}
          className="inline-flex shrink-0 items-center gap-1.5 self-start text-sm font-semibold text-aqua-dark transition-colors hover:text-aqua sm:self-auto"
        >
          {modalidad.cta.texto}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
