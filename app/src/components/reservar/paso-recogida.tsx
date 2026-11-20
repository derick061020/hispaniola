import { Campo } from '@/components/ui/campo'
import { SelectorHotel, zonaDeHotel } from '@/components/ui/selector-hotel'
import type { DatosRecogida } from '@/components/reservar/tipos'
import type { FichaTour } from '@/data/tours'
import { formatoDinero } from '@/data/home'
import { t, tp } from '@/lib/i18n'

// Paso 2 del funnel: dónde recogemos al huésped. La web actual promete
// «recogida gratis desde tu hotel» pero la hora exacta depende del hotel y se
// confirma aparte — el copy lo dice, no se inventa una hora fija (mismo criterio
// anti-invención que el resto del build). Sin campo de nº de habitación
// (2026-07-17, Samuel): se pide el hotel y, si hace falta, se afina por WhatsApp.
//
// [2026-08-25, pedido de Samuel] El hotel ya no se escribe: se elige de la
// lista de Odoo (`SelectorHotel`). Escrito a mano no casaba con ninguna ficha
// de `haa.hotel`, y sin ficha no hay tabla de recogidas.
export function PasoRecogida({
  datos,
  onCambio,
  horaSalida,
  transportePrivado,
  conTransportePrivado = false,
  onTransportePrivado,
  importeTransportePrivado,
}: {
  datos: DatosRecogida
  onCambio: (parcial: Partial<DatosRecogida>) => void
  /** Hora de zarpe del horario elegido, para contextualizar la recogida. */
  horaSalida: string | null
  /** [2026-11-19, Sr. Fernando] Si el tour ofrece transporte privado. */
  transportePrivado?: FichaTour['transportePrivado']
  conTransportePrivado?: boolean
  onTransportePrivado?: (quiere: boolean) => void
  /** Lo que cotizó Odoo, cuando ya contestó. Manda sobre la estimación. */
  importeTransportePrivado?: number | null
}) {
  // [2026-11-19, Sr. Fernando: «aquí tener la opción de un transporte extra…
  // y que refleje el precio»] El precio depende de la zona del hotel elegido:
  // US$ 60 en Uvero Alto y Cap Cana, US$ 50 en el resto. Antes de que Odoo
  // conteste se rotula con la zona del catálogo; después, con lo que cotizó.
  const zona = zonaDeHotel(datos.hotel)
  const precioTp = transportePrivado
    ? importeTransportePrivado ??
      (zona && transportePrivado.zonasLejanas.includes(zona)
        ? transportePrivado.precioZonaLejana
        : transportePrivado.precio)
    : 0
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-display text-h3 font-semibold text-navy">{t('Where do we pick you up?')}</h2>
        <p className="mt-1 text-sm text-navy-sub">
          {horaSalida
            ? tp('Free pick-up at hotels in Bávaro and Punta Cana for the {hora} departure', { hora: horaSalida })
            : t('Free pick-up at hotels in Bávaro and Punta Cana')}
          {t('. We confirm the exact time over WhatsApp depending on your hotel.')}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <SelectorHotel
          etiqueta={t('Hotel or pick-up point')}
          value={datos.hotel}
          onChange={(hotel) => onCambio({ hotel })}
        />
        <Campo
          etiqueta={t('Pick-up notes (optional)')}
          textarea
          placeholder={t('Allergies, reduced mobility, if you’re coming with kids…')}
          value={datos.notas}
          onChange={(e) => onCambio({ notas: e.target.value })}
        />
        {transportePrivado && onTransportePrivado ? (
          <label className="flex cursor-pointer items-start gap-3 rounded-card border border-linea bg-papel px-4 py-3">
            <input
              type="checkbox"
              className="mt-0.5 size-4 shrink-0 accent-aqua"
              checked={conTransportePrivado}
              onChange={(e) => onTransportePrivado(e.target.checked)}
            />
            <span className="text-sm">
              <span className="font-semibold text-navy">
                {t('Add private round-trip transportation')}{' '}
                <span className="tabular-nums">+{formatoDinero(precioTp)}</span>
              </span>
              <span className="mt-0.5 block text-xs text-navy-sub">
                {tp('Just for your group. {lejano} from Uvero Alto and Cap Cana, {normal} from other areas. Shared transportation is still included.', {
                  lejano: formatoDinero(transportePrivado.precioZonaLejana),
                  normal: formatoDinero(transportePrivado.precio),
                })}
              </span>
              <span className="mt-1 block text-xs font-medium text-navy">
                {t('Private transportation is paid in full at the time of booking.')}
              </span>
            </span>
          </label>
        ) : null}
      </div>
    </div>
  )
}
