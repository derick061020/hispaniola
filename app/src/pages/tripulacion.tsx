import { Footer } from '@/components/home/footer'
import { CabeceraInterna } from '@/components/internas/cabecera-interna'
import { HeroInterna } from '@/components/internas/hero-interna'
import { CierreEquipo } from '@/components/equipo/cierre-equipo'
import { FranjaEquipo } from '@/components/equipo/franja-equipo'
import { GridEquipo } from '@/components/equipo/grid-equipo'
import { MuroTripulacion } from '@/components/equipo/muro-tripulacion'
import { Meta } from '@/components/seo/meta'
import { EQUIPO_PAGINA } from '@/data/equipo'

// Página Tripulación / Equipo (/tripulacion) — correcciones v2, plan 05.
//
// La ruta se llama /tripulacion porque es la etiqueta que el cliente pidió en
// el menú (reunión 07-24, 26:50), aunque la página incluye contabilidad, RRHH,
// marketing y la fundación — gente que no es tripulación. El H1 dice «las
// personas detrás de cada tour», que es más honesto que «tripulación» y es lo
// que su propia maqueta titulaba.
//
// [v2 2026-07-28, pedido de Samuel] LA PÁGINA SE ALINEA CON EL PDF (slides
// 36-43), que es MÁS DIRECTA que la versión anterior. Cuatro tiempos y nada
// más:
//   1. Hero: badge + título + descripción. Y SOLO eso — los 3 KPIs que vivían
//      dentro se bajan a la franja.
//   2. FranjaEquipo: la info compacta (cuántas personas, cuántos
//      departamentos, desde cuándo, y que el equipo es de RD + España).
//   3. Filtros por departamento + todo el equipo (GridEquipo).
//   4. Cierre «¿Quieres remar con nosotros?» (dentro de GridEquipo).
//
// SALE «Bienvenido a la familia Hispaniola» (nosotros/intro-nosotros.tsx). Se
// había reubicado aquí el 07-27 al desaparecer /nosotros, como colocación
// PROVISIONAL a la espera de que Samuel confirmara el reparto — ya lo hizo: en
// el PDF no existe, y metía una bienvenida de marca de dos párrafos + foto
// apaisada entre el titular y la gente, que es justo lo que hacía la página
// menos directa. ⚠️ El bloque NO se borra: sigue en components/nosotros/ con
// su contenido real portado de about-hispaniola.php, hoy SIN COLOCAR. Si al
// final no aterriza en ninguna página, ese contenido se pierde con /nosotros —
// conviene decidirlo, no dejarlo caducar en silencio.
//
// ⚠️ PÁGINA DE MOLDE: los nombres, retratos y frases son placeholders. Ver la
// cabecera de data/equipo.ts. El aviso también se pinta EN PANTALLA (GridEquipo)
// mientras dure — no basta con un comentario en el código.
export function TripulacionPage() {
  return (
    <div>
      <Meta
        titulo="Tripulación"
        descripcion="Las personas detrás de cada tour de Hispaniola Aquatic Adventures: capitanes, guías, cocina, biología marina, oficina y la fundación."
        ruta="/tripulacion"
      />
      <HeroInterna ctaHref="/#tours">
        <CabeceraInterna
          eyebrow={EQUIPO_PAGINA.eyebrow}
          titulo={EQUIPO_PAGINA.titulo}
          lead={EQUIPO_PAGINA.lead}
        />
      </HeroInterna>

      {/* La franja pega arriba, contra el hero: el orden del PDF es hero →
          datos → filtros → gente, sin respiros de por medio. */}
      <div className="mx-auto max-w-contenido px-5 pt-12 sm:px-10 lg:pt-16">
        <FranjaEquipo />
      </div>

      {/* El muro va A SANGRE, así que vive FUERA del contenedor de contenido
          —igual que ReelsSociales en /instalaciones—. Se cuela entre la franja
          y la rejilla: primero el número, luego las caras, luego el orden. */}
      <MuroTripulacion />

      <div className="mx-auto max-w-contenido px-5 pb-12 sm:px-10 lg:pb-16">
        <div className="flex flex-col gap-10 lg:gap-12">
          <GridEquipo />
          {/* El cierre va fuera de GridEquipo (donde vivía): no depende del
              filtro ni del equipo, es el remate de la página. */}
          <div className="mt-6">
            <CierreEquipo />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
