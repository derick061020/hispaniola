import { Etiqueta } from '@/components/ui/etiqueta'
import { CONTACTO } from '@/data/home'

// Above the fold de /contacto — children de HeroInterna (PLAN-INTERNAS-V2.md),
// mismo anatómico blanco-sobre-foto que Nosotros y Sostenibilidad: eyebrow ·
// H1 · lead. Mapea contact.php de la web actual (H1 "Contact Us"). Sin
// migaja (retirada de todos los heros de internas, 2026-07-22, pedido de
// Samuel).
export function CabeceraContacto() {
  return (
    <div>
      <Etiqueta sobreOscuro>{CONTACTO.eyebrow}</Etiqueta>

      <h1 className="mt-3 max-w-2xl text-balance font-display text-h2 font-semibold text-white">{CONTACTO.titulo}</h1>

      <p className="mt-4 max-w-2xl text-lead text-white/85">{CONTACTO.lead}</p>
    </div>
  )
}
