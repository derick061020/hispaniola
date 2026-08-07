import { Etiqueta } from '@/components/ui/etiqueta'

// Cabecera de /trabaja-con-nosotros — children de HeroInterna, mismo patrón
// que CabeceraAgentes/CabeceraContacto. Sin migaja (retirada de todos los
// heros de internas, 2026-07-22).
export function CabeceraTrabaja() {
  return (
    <div>
      <Etiqueta sobreOscuro>Work with us</Etiqueta>

      <h1 className="mt-3 max-w-2xl text-balance font-display text-h2 font-semibold text-white">
        There’s room on board for more than one trade
      </h1>

      <p className="mt-4 max-w-2xl text-lead text-white/85">
        Providers operating in Punta Cana, creators who tell the sea as it is, and affiliates with a
        community of travelers. Tell us which one you are and let’s talk. We answer on WhatsApp, not
        with an automated form.
      </p>
    </div>
  )
}
