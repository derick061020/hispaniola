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
        <h2 className="font-display text-h3 font-semibold text-navy">¿Dónde te recogemos?</h2>
        <p className="mt-1 text-sm text-navy-sub">
          Recogida gratis en hoteles de Bávaro y Punta Cana{horaSalida ? ` para la salida de las ${horaSalida}` : ''}. La
          hora exacta la confirmamos por WhatsApp según tu hotel.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <Campo
          etiqueta="Hotel o punto de recogida"
          placeholder="Ej. Meliá Caribe Beach"
          value={datos.hotel}
          onChange={(e) => onCambio({ hotel: e.target.value })}
        />
        <Campo
          etiqueta="Notas para la recogida (opcional)"
          textarea
          placeholder="Alergias, movilidad reducida, si vais con niños…"
          value={datos.notas}
          onChange={(e) => onCambio({ notas: e.target.value })}
        />
      </div>
    </div>
  )
}
