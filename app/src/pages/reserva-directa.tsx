import { Footer } from '@/components/home/footer'
import { HeroInterna } from '@/components/internas/hero-interna'
import { CabeceraReservaDirecta } from '@/components/reserva-directa/cabecera-reserva-directa'
import { Comparacion } from '@/components/reserva-directa/comparacion'
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

      <div className="mx-auto max-w-contenido px-5 py-12 sm:px-10 lg:py-16">
        <Comparacion />
      </div>

      <Footer />
    </div>
  )
}
