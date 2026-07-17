import { Campo } from '@/components/ui/campo'
import type { DatosContacto } from '@/components/reservar/tipos'

// Paso 3 del funnel: datos de contacto para mandar la confirmación. El gancho
// de marca es el trato directo (WhatsApp con el equipo del barco, no un call
// center) — el copy lo refleja.
export function PasoContacto({
  datos,
  onCambio,
}: {
  datos: DatosContacto
  onCambio: (parcial: Partial<DatosContacto>) => void
}) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-display text-h3 font-semibold text-navy">Tus datos de contacto</h2>
        <p className="mt-1 text-sm text-navy-sub">
          Te enviamos la confirmación y el punto de recogida por email y WhatsApp — hablas con el equipo del barco, no con
          un call center.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <Campo
          etiqueta="Nombre completo"
          placeholder="Nombre y apellido"
          autoComplete="name"
          value={datos.nombre}
          onChange={(e) => onCambio({ nombre: e.target.value })}
        />
        <Campo
          etiqueta="Email"
          type="email"
          placeholder="tu@email.com"
          autoComplete="email"
          value={datos.email}
          onChange={(e) => onCambio({ email: e.target.value })}
        />
        <Campo
          etiqueta="WhatsApp / teléfono"
          type="tel"
          placeholder="+1 809 000 0000"
          autoComplete="tel"
          value={datos.telefono}
          onChange={(e) => onCambio({ telefono: e.target.value })}
        />
      </div>
    </div>
  )
}
