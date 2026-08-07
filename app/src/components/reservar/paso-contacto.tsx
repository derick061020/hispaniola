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
        <h2 className="font-display text-h3 font-semibold text-navy">Contact details</h2>
        <p className="mt-1 text-sm text-navy-sub">
          We’ll use this information to send you your confirmation and to let you know about anything new with your
          booking. No spam.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo
            etiqueta="First name"
            autoComplete="given-name"
            value={datos.nombre}
            onChange={(e) => onCambio({ nombre: e.target.value })}
          />
          <Campo
            etiqueta="Last name"
            autoComplete="family-name"
            value={datos.apellidos}
            onChange={(e) => onCambio({ apellidos: e.target.value })}
          />
        </div>

        <div>
          <Campo
            etiqueta="Email"
            type="email"
            autoComplete="email"
            placeholder="you@email.com"
            value={datos.email}
            onChange={(e) => onCambio({ email: e.target.value })}
          />
          <p className="mt-1.5 text-xs text-navy-soft">We’ll send your booking confirmation to this address.</p>
        </div>

        <div>
          <Campo
            etiqueta="Confirm your email"
            type="email"
            autoComplete="email"
            placeholder="you@email.com"
            value={datos.emailConfirm}
            onChange={(e) => onCambio({ emailConfirm: e.target.value })}
          />
          {noCoincide ? (
            <p className="mt-1.5 text-xs font-medium text-coral">The two emails don’t match.</p>
          ) : (
            <p className="mt-1.5 text-xs text-navy-soft">To make sure there isn’t a single typo.</p>
          )}
        </div>

        <div>
          <Campo
            etiqueta="WhatsApp / phone"
            type="tel"
            autoComplete="tel"
            placeholder="+1 809 000 0000"
            value={datos.telefono}
            onChange={(e) => onCambio({ telefono: e.target.value })}
          />
          <p className="mt-1.5 text-xs text-navy-soft">
            Only to let you know about last-minute changes — for example, if the weather forces us to move the tour.
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
              Celebrating something special?{' '}
              <span className="text-sm font-normal text-navy-soft">(optional)</span>
            </p>
            <p className="mt-1 text-sm text-navy-sub">
              Tell us now and the crew will know before you step on board.
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
                  etiqueta="Tell us more (optional)"
                  placeholder="E.g. it’s Ana’s birthday, she’s turning 40"
                  value={celebracion.nota}
                  onChange={(e) => onCambioCelebracion({ nota: e.target.value })}
                />
                <p className="mt-1.5 text-xs text-navy-soft">
                  If you want something specific —a cake, decorations— we’ll arrange it over WhatsApp before the tour.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
