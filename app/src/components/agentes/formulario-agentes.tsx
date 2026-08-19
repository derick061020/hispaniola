import { useState } from 'react'
import { Boton } from '@/components/ui/boton'
import { Campo } from '@/components/ui/campo'
import { errorEnvio, useEnvioFormulario } from '@/lib/use-envio-formulario'
import { useDevFlag } from '@/dev/use-dev-flag'
import { t } from '@/lib/i18n'

// Registro de agentes de viaje (/agentes-de-viaje) — mapea
// travel-agent-registration.php de la web actual. Footer: "Es B2B, el 99% del
// tráfico es turista" (arquitectura-nueva.md §2) — por eso vive en footer, no
// en el menú principal.
//
// [2026-08-18] YA ENVÍA. Era un lead B2B que se perdía entero: `setEnviado(true)`
// y nada más. Ahora entra en Odoo como `haa.web.lead` de tipo `agents`, que es
// donde el equipo lo ve y lo gestiona. Sigue sin ser un portal de afiliados con
// comisiones y tarifas: esos datos no existen en ninguna fuente y no se inventan.
export function FormularioAgentes() {
  const { estado, enviar, enviando } = useEnvioFormulario('agents')

  // [dev-mode] ?dev-agentes=enviado congela la confirmación → frame para Figma.
  const [forzado, setForzado] = useState(false)
  useDevFlag('dev-agentes', (v) => {
    if (v === 'enviado') setForzado(true)
  }) // [dev-mode]
  const enviado = estado === 'enviado' || forzado

  return (
    <section className="mx-auto max-w-xl">
      <form
        onSubmit={(e) => void enviar(e)}
        className="rounded-card-grande bg-papel p-6 ring-1 ring-linea sm:p-8"
      >
        <div className="flex flex-col gap-4">
          {/* Los `name` son los que espera `haa.web.lead` (company/name/email/
              phone/message): así el lead llega con sus campos rellenos y no
              solo dentro del payload en bruto. */}
          <Campo etiqueta={t('Agency / DMC name')} name="company" required />
          <Campo etiqueta={t('Contact person')} name="name" required />
          <Campo etiqueta={t('Email')} name="email" type="email" required />
          <Campo etiqueta={t('Phone / WhatsApp')} name="phone" type="tel" required />
          <Campo etiqueta={t('Message')} name="message" textarea placeholder={t('Estimated volume, destinations, season…')} />
        </div>
        <Boton type="submit" className="mt-5 w-full disabled:cursor-not-allowed disabled:opacity-60" disabled={enviando}>
          {enviando ? 'Sending…' : t('Send registration')}
        </Boton>

        {enviado ? (
          <p role="status" className="mt-4 rounded-btn bg-papel-hueso p-4 text-sm font-medium text-menta-texto">
            {t('We got your registration. We’ll be in touch within 24 h.')}
          </p>
        ) : estado === 'error' ? (
          <p role="alert" className="mt-4 rounded-btn border border-coral/40 bg-coral/5 p-4 text-sm leading-relaxed text-navy-sub">
            {errorEnvio()}
          </p>
        ) : null}
      </form>
    </section>
  )
}
