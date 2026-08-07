import { Sparkles } from 'lucide-react'
import { Campo } from '@/components/ui/campo'
import { OCASIONES, type DatosCelebracion, type DatosContacto } from '@/components/reservar/tipos'

// Paso «Contacto» del funnel. Como Viator (2026-07-17, Samuel: "Viator dice para
// qué se usará la información, hagámoslo también"): un subtítulo general + una
// línea de microcopy bajo cada campo explicando para qué se pide. Nombre y
// apellidos en 2 columnas; email con confirmación (deben coincidir para poder
// continuar, evita erratas); teléfono para avisos de última hora. El gancho de
// marca sigue siendo el trato directo (WhatsApp con el equipo del barco).
//
// 2026-08-07 (pedido de Samuel): cierra el paso «¿Celebras algo especial?»,
// opcional y de un clic. Ver el comentario de `Ocasion` en tipos.ts — la
// pregunta ya existía en la pantalla de gracias, pero llegaba tarde.
export function PasoContacto({
  datos,
  onCambio,
  celebracion,
  onCambioCelebracion,
}: {
  datos: DatosContacto
  onCambio: (parcial: Partial<DatosContacto>) => void
  celebracion: DatosCelebracion
  onCambioCelebracion: (parcial: Partial<DatosCelebracion>) => void
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

      {/* CELEBRACIÓN (opcional). Va al final del paso y sobre papel-hueso para
          que se lea como un extra y no como un campo más que hay que rellenar:
          quien solo quiere reservar sigue de largo hasta «Continuar». El campo
          de texto solo aparece con una ocasión elegida — un input libre siempre
          visible pesa, y sin ocasión no hay nada que detallar. */}
      <div className="rounded-card border border-linea bg-papel-hueso p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-0.5 size-5 shrink-0 text-coral" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="font-display text-base font-semibold text-navy">
              ¿Celebras algo especial?{' '}
              <span className="text-sm font-normal text-navy-soft">(opcional)</span>
            </p>
            <p className="mt-1 text-sm text-navy-sub">
              Si nos lo dices ahora, la tripulación lo sabe antes de que subas a bordo.
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {OCASIONES.map((o) => {
                const activa = celebracion.ocasion === o.id
                return (
                  <button
                    key={o.id}
                    type="button"
                    aria-pressed={activa}
                    // Segundo clic en la misma píldora la deselecciona: es un
                    // campo opcional, tiene que poder quedarse vacío después
                    // de haberlo tocado.
                    onClick={() =>
                      onCambioCelebracion({
                        ocasion: activa ? null : o.id,
                        ...(o.id === 'ninguna' ? { nota: '' } : {}),
                      })
                    }
                    className={`rounded-chip border px-3 py-1.5 text-sm font-medium transition-colors ${
                      activa
                        ? 'border-aqua bg-aqua-tint text-aqua-dark'
                        : 'border-linea bg-papel text-navy-sub hover:border-navy-soft hover:text-navy'
                    }`}
                  >
                    {o.etiqueta}
                  </button>
                )
              })}
            </div>

            {celebracion.ocasion && celebracion.ocasion !== 'ninguna' ? (
              <div className="mt-4">
                <Campo
                  etiqueta="Cuéntanos (opcional)"
                  placeholder="Ej. es el cumpleaños de Ana, cumple 40"
                  value={celebracion.nota}
                  onChange={(e) => onCambioCelebracion({ nota: e.target.value })}
                />
                <p className="mt-1.5 text-xs text-navy-soft">
                  Si quieres algo concreto —tarta, decoración— lo organizamos por WhatsApp antes del tour.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
