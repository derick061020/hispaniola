import { Etiqueta } from '@/components/ui/etiqueta'

// Cabecera de /trabaja-con-nosotros — children de HeroInterna, mismo patrón
// que CabeceraAgentes/CabeceraContacto. Sin migaja (retirada de todos los
// heros de internas, 2026-07-22).
export function CabeceraTrabaja() {
  return (
    <div>
      <Etiqueta sobreOscuro>Trabaja con nosotros</Etiqueta>

      <h1 className="mt-3 max-w-2xl text-balance font-display text-h2 font-semibold text-white">
        Hay sitio a bordo para más de un oficio
      </h1>

      <p className="mt-4 max-w-2xl text-lead text-white/85">
        Proveedores que operan en Punta Cana, creadores que cuentan el mar como es y afiliados con
        una comunidad viajera. Dinos cuál eres y hablamos — respondemos por WhatsApp, no por
        formulario automático.
      </p>
    </div>
  )
}
