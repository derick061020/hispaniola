import { Campo } from '@/components/ui/campo'
import type { DatosContacto } from '@/components/reservar/tipos'

// Paso «Contacto» del funnel. Como Viator (2026-07-17, Samuel: "Viator dice para
// qué se usará la información, hagámoslo también"): un subtítulo general + una
// línea de microcopy bajo cada campo explicando para qué se pide. Nombre y
// apellidos en 2 columnas; email con confirmación (deben coincidir para poder
// continuar, evita erratas); teléfono para avisos de última hora. El gancho de
// marca sigue siendo el trato directo (WhatsApp con el equipo del barco).
export function PasoContacto({
  datos,
  onCambio,
}: {
  datos: DatosContacto
  onCambio: (parcial: Partial<DatosContacto>) => void
}) {
  const noCoincide = datos.emailConfirm !== '' && datos.emailConfirm !== datos.email

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-display text-h3 font-semibold text-navy">Datos de contacto</h2>
        <p className="mt-1 text-sm text-navy-sub">
          Usaremos esta información para enviarte la confirmación y avisarte de cualquier novedad de tu reserva. Nada de
          spam.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo
            etiqueta="Nombre"
            autoComplete="given-name"
            value={datos.nombre}
            onChange={(e) => onCambio({ nombre: e.target.value })}
          />
          <Campo
            etiqueta="Apellidos"
            autoComplete="family-name"
            value={datos.apellidos}
            onChange={(e) => onCambio({ apellidos: e.target.value })}
          />
        </div>

        <div>
          <Campo
            etiqueta="Correo electrónico"
            type="email"
            autoComplete="email"
            placeholder="tu@email.com"
            value={datos.email}
            onChange={(e) => onCambio({ email: e.target.value })}
          />
          <p className="mt-1.5 text-xs text-navy-soft">Te enviaremos la confirmación de la reserva a esta dirección.</p>
        </div>

        <div>
          <Campo
            etiqueta="Confirma tu correo"
            type="email"
            autoComplete="email"
            placeholder="tu@email.com"
            value={datos.emailConfirm}
            onChange={(e) => onCambio({ emailConfirm: e.target.value })}
          />
          {noCoincide ? (
            <p className="mt-1.5 text-xs font-medium text-coral">Los dos correos no coinciden.</p>
          ) : (
            <p className="mt-1.5 text-xs text-navy-soft">Para asegurarnos de que no hay ninguna errata.</p>
          )}
        </div>

        <div>
          <Campo
            etiqueta="WhatsApp / teléfono"
            type="tel"
            autoComplete="tel"
            placeholder="+1 809 000 0000"
            value={datos.telefono}
            onChange={(e) => onCambio({ telefono: e.target.value })}
          />
          <p className="mt-1.5 text-xs text-navy-soft">
            Solo para avisarte de cambios de última hora — por ejemplo, si el clima obliga a mover el tour.
          </p>
        </div>
      </div>
    </div>
  )
}
