import { Footer } from '@/components/home/footer'
import { HeroInterna } from '@/components/internas/hero-interna'
import { CabeceraReservaDirecta } from '@/components/reserva-directa/cabecera-reserva-directa'
import { Comparacion } from '@/components/reserva-directa/comparacion'
import { DesgloseValor } from '@/components/reserva-directa/desglose-valor'
import { TablaComparativa } from '@/components/reserva-directa/tabla-comparativa'
import { Razones } from '@/components/reserva-directa/razones'
import { Meta } from '@/components/seo/meta'

// Página Reserva directa (/reserva-directa) — NOTAS['reserva-directa'] del
// prototipo + arquitectura-nueva.md §3: fuera del menú principal, se llega
// desde "Ver comparación →" (tour/comparador-strip.tsx) y el footer. Mismo
// hero compartido (PLAN-INTERNAS-V2.md) que el resto de internas.
export function ReservaDirectaPage() {
  return (
    <div>
      <Meta
        titulo="¿Por qué reservar directo?"
        descripcion="Mismo precio que en Viator o Civitatis — reservando directo te llevas depósito del 25%, menú a elección, WhatsApp directo y reembolso total."
        ruta="/reserva-directa"
      />
      <HeroInterna ctaHref="/#tours">
        <CabeceraReservaDirecta />
      </HeroInterna>

      {/* [v2 2026-07-27, plan 07] La página pasa de 30 líneas (hero + 2 boletos)
          a 5 bloques de argumento. El cliente pidió una «página nueva dedicada
          al contenido» tras la insignia amarilla de su web (slides 50-56); en
          realidad la página YA existía —incluso con este mismo título— pero
          estaba casi vacía.

          ⚠️ NO es una página para retener. El cliente fue explícito en la
          reunión (33:30): «no es tampoco para que la gente se vaya mucho ahí,
          pero sí que, si lo pinchan, que sepan por qué», y remató (33:52):
          «sobre todo que haya mucho botón que vaya a la pestaña de Tours».
          Por eso cada bloque cierra con su propia salida a /#tours.

          Lo que NO se pinta: la banda de urgencia de su slide 54 («cada día
          que lo piensas se llenan plazas»). Apretar escasez en la página cuyo
          argumento es «no somos los más baratos, somos los que te tratan bien»
          es contradictorio. Se le da lo que pidió —más botones— sin presión
          inventada. */}
      <div className="mx-auto flex max-w-contenido flex-col gap-16 px-5 py-12 sm:px-10 lg:gap-24 lg:py-16">
        <DesgloseValor />
        <Comparacion />
        <TablaComparativa />
        <Razones />
      </div>

      <Footer />
    </div>
  )
}
