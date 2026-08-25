import { useId } from 'react'
import { PREFIJOS, prefijoPorId } from '@/lib/telefono'
import { t } from '@/lib/i18n'

// [2026-08-25, pedido de Samuel] El teléfono del funnel, partido en prefijo de
// país + número. El porqué está en `lib/telefono.ts`: sin prefijo, la mitad de
// los teléfonos que llegaban a Odoo no se podían marcar desde República
// Dominicana y el aviso de última hora no salía de la oficina.
//
// El prefijo es un `<select>` nativo a propósito (~45 países, no 270 como los
// hoteles): en móvil abre la rueda del sistema, que es lo más rápido que hay.
export function CampoTelefono({
  etiqueta,
  prefijo,
  numero,
  onCambio,
}: {
  etiqueta: string
  prefijo: string
  numero: string
  onCambio: (parcial: { prefijo?: string; numero?: string }) => void
}) {
  const id = useId()
  const elegido = prefijoPorId(prefijo)

  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-navy">
        {etiqueta}
      </label>
      <div className="mt-1.5 flex items-stretch gap-2">
        <div className="relative shrink-0">
          <select
            aria-label={t('Country calling code')}
            value={prefijo}
            onChange={(e) => onCambio({ prefijo: e.target.value })}
            className="h-full w-[7.5rem] appearance-none rounded-btn bg-papel py-3 pl-3 pr-7 text-sm text-navy ring-1 ring-linea focus:outline-none focus:ring-2 focus:ring-aqua"
          >
            {PREFIJOS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.bandera} {p.codigo} {p.id}
              </option>
            ))}
          </select>
          {/* La flecha del `select` nativo se pinta aparte: `appearance-none`
              la quita, y sin ella no se lee como desplegable. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-navy-soft"
          >
            ▾
          </span>
        </div>
        <input
          id={id}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          className="w-full rounded-btn bg-papel px-4 py-3 text-sm text-navy ring-1 ring-linea placeholder:text-navy-soft focus:outline-none focus:ring-2 focus:ring-aqua"
          placeholder={elegido?.id === 'ES' ? '612 345 678' : '809 000 0000'}
          value={numero}
          onChange={(e) => onCambio({ numero: e.target.value })}
        />
      </div>
    </div>
  )
}
