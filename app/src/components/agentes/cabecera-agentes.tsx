import { Etiqueta } from '@/components/ui/etiqueta'

// Sin migaja (retirada de todos los heros de internas, 2026-07-22, pedido
// de Samuel).
export function CabeceraAgentes() {
  return (
    <div>
      <Etiqueta sobreOscuro>Travel agents</Etiqueta>

      <h1 className="mt-3 max-w-2xl text-balance font-display text-h2 font-semibold text-white">
        Register your agency or DMC
      </h1>

      <p className="mt-4 max-w-2xl text-lead text-white/85">
        We coordinate with you directly: real availability, formal invoicing (local and international) and answers on
        WhatsApp, not a call center.
      </p>
    </div>
  )
}
