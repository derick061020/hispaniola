import { Etiqueta } from '@/components/ui/etiqueta'

// Sin migaja (retirada de todos los heros de internas, 2026-07-22, pedido
// de Samuel).
export function CabeceraReservaDirecta() {
  return (
    <div>
      <Etiqueta sobreOscuro>Reserva directa</Etiqueta>

      <h1 className="mt-3 max-w-2xl text-balance font-display text-h2 font-semibold text-white">
        Mismo tour, mismo precio. Lo que cambia es lo que viene después.
      </h1>

      <p className="mt-4 max-w-2xl text-lead text-white/85">
        En un portal como Viator o Civitatis pagas exactamente lo mismo. Reservando aquí, directo, te llevas esto
        además.
      </p>
    </div>
  )
}
