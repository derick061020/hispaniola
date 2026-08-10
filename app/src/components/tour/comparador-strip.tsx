import { Link } from 'react-router-dom'
import * as Button from '@/components/alignui/button'

// Comparador anti-OTA (fix 1.6 de docs/proceso/analisis/revision-wireframes.md).
//
// Por qué está AQUÍ y no solo en la página /por-que-reservar: quien duda entre
// reservar aquí o en Viator está mirando ESTE precio en ESTE momento. La
// página-argumento hay que ir a buscarla; esta franja le sale al paso. Viator
// vende el mismo tour al mismo precio con Pay-Later y cupones — es el
// competidor que hay que desintermediar, y este es el punto donde se decide.
//
// El aqua como FONDO es una excepción consciente al guardarraíl de la
// dirección B (§6: «el aqua con cuentagotas, nunca fondo grande de sección»):
// esto no es una sección, es un badge de argumento de una línea — el mismo
// estatus que el chip aqua de «Evento privado» del ticker. Si crece, deja de
// estar amparado por ese precedente.
export function ComparadorStrip() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-card bg-aqua-tint px-4 py-3 ring-1 ring-aqua/20">
      <p className="text-sm text-navy-sub">
        Same price as on Viator or Civitatis. Here with a <strong className="font-semibold text-navy">25% deposit</strong>
        , menú a elección y WhatsApp directo.
      </p>
      {/* Etapa A: Button neutral/stroke del sistema (xsmall) — la pastilla
          blanca de antes, dicha en el idioma AlignUI. [v2 2026-07-28] Apunta
          a /por-que-reservar: /reserva-directa se retiró y ahora el destino
          es la página completa de argumento (slides 50-56 del cliente). */}
      <Button.Root variant="neutral" mode="stroke" size="xsmall" className="shrink-0" asChild>
        <Link to="/why-book-direct">Why book direct →</Link>
      </Button.Root>
    </div>
  )
}
