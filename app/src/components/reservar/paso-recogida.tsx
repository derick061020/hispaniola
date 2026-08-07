import { Campo } from '@/components/ui/campo'
import type { DatosRecogida } from '@/components/reservar/tipos'

// Paso 2 del funnel: dónde recogemos al huésped. La web actual promete
// «recogida gratis desde tu hotel» pero la hora exacta depende del hotel y se
// confirma aparte — el copy lo dice, no se inventa una hora fija (mismo criterio
// anti-invención que el resto del build). Sin campo de nº de habitación
// (2026-07-17, Samuel): se pide el hotel y, si hace falta, se afina por WhatsApp.
export function PasoRecogida({
  datos,
  onCambio,
  horaSalida,
}: {
  datos: DatosRecogida
  onCambio: (parcial: Partial<DatosRecogida>) => void
  /** Hora de zarpe del horario elegido, para contextualizar la recogida. */
  horaSalida: string | null
}) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-display text-h3 font-semibold text-navy">Where do we pick you up?</h2>
        <p className="mt-1 text-sm text-navy-sub">
          Free pick-up at hotels in Bávaro and Punta Cana{horaSalida ? ` for the ${horaSalida} departure` : ''}. We
          confirm the exact time over WhatsApp depending on your hotel.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <Campo
          etiqueta="Hotel or pick-up point"
          placeholder="E.g. Meliá Caribe Beach"
          value={datos.hotel}
          onChange={(e) => onCambio({ hotel: e.target.value })}
        />
        <Campo
          etiqueta="Pick-up notes (optional)"
          textarea
          placeholder="Allergies, reduced mobility, if you’re coming with kids…"
          value={datos.notas}
          onChange={(e) => onCambio({ notas: e.target.value })}
        />
      </div>
    </div>
  )
}
