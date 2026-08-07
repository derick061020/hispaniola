import { useState } from 'react'
import { Boton } from '@/components/ui/boton'
import { Campo } from '@/components/ui/campo'
import { useDevFlag } from '@/dev/use-dev-flag'

// Registro de agentes de viaje (/agentes-de-viaje) — mapea
// travel-agent-registration.php de la web actual. Footer: "Es B2B, el 99% del
// tráfico es turista" (arquitectura-nueva.md §2) — por eso vive en footer, no
// en el menú principal.
//
// ⚠️ SOLO PROTOTIPO (sin backend), mismo criterio que home/contacto.tsx: es
// un lead B2B, no un portal de afiliados con comisiones/tarifas — esos datos
// no existen en ninguna fuente y no se inventan.
export function FormularioAgentes() {
  const [enviado, setEnviado] = useState(false)

  // [dev-mode] ?dev-agentes=enviado congela la confirmación → frame para Figma.
  useDevFlag('dev-agentes', (v) => {
    if (v === 'enviado') setEnviado(true)
  }) // [dev-mode]

  return (
    <section className="mx-auto max-w-xl">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          setEnviado(true)
        }}
        className="rounded-card-grande bg-papel p-6 ring-1 ring-linea sm:p-8"
      >
        <div className="flex flex-col gap-4">
          <Campo etiqueta="Agency / DMC name" name="agencia" required />
          <Campo etiqueta="Contact person" name="contacto" required />
          <Campo etiqueta="Email" name="email" type="email" required />
          <Campo etiqueta="Teléfono / WhatsApp" name="telefono" type="tel" required />
          <Campo etiqueta="Mensaje" name="mensaje" textarea placeholder="Volumen estimado, destinos, temporada…" />
        </div>
        <Boton type="submit" className="mt-5 w-full">
          Enviar registro
        </Boton>

        {enviado ? (
          <p role="status" className="mt-4 rounded-btn bg-papel-hueso p-4 text-sm font-medium text-menta-texto">
            We got your registration. We’ll be in touch within 24 h.
          </p>
        ) : null}
      </form>
    </section>
  )
}
