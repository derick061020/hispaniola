import { useState } from 'react'
import { Check, Sparkles } from 'lucide-react'
import { formatoDinero } from '@/data/home'
import { precioAddOn, type AddOn } from '@/lib/tarifas'
import { t } from '@/lib/i18n'

// Add-ons del widget de reserva (correcciones v2, 2026-07-27).
//
// Los tres extras del negocio (langosta, comida opcional y álbum de fotos) se
// venden aquí como UPSELL: superficie de venta con peso visual, no letra
// pequeña. Decisión de Samuel del 07-27: «un check fácil de clickar y
// atractivo, piensa en él como un upsell».
//
// Cómo se cobran (TARIFARIO-WEB-ORIGINAL.md §4-C):
//  · base 'persona' → un solo check que multiplica por TODAS las personas de
//    la reserva (no se elige comensal a comensal). Langosta US$ 30, comida
//    opcional US$ 25/45.
//  · base 'grupo'   → precio fijo que no escala. Solo el álbum, US$ 20.
//
// ⚠️ EL ÁLBUM ARRANCA MARCADO (`porDefecto: true`). Es una decisión de negocio
// de Samuel del 2026-07-27, tomada sabiendo que un extra de pago premarcado
// contraviene la Directiva 2011/83/UE art. 22 (consentimiento expreso para
// pagos adicionales; derecho a reembolso cuando se infiere de una casilla que
// hay que desmarcar). El riesgo está registrado en TARIFARIO §4-C y el
// comportamiento vive en DOS BOOLEANOS de lib/tarifas.ts (ALBUM_UPSELL) a
// propósito: desactivarlo o variarlo por mercado tiene que ser una línea, no
// una refactorización de este componente. NO cablees esa lógica aquí.

export function AddOnsWidget({
  addOns,
  personas,
  elegidos,
  onCambiar,
  mensajeAlDesmarcar,
}: {
  addOns: AddOn[]
  personas: number
  elegidos: string[]
  onCambiar: (ids: string[]) => void
  mensajeAlDesmarcar: boolean
}) {
  // Qué add-on está pidiendo confirmación al desmarcarse. Solo uno a la vez.
  const [confirmando, setConfirmando] = useState<string | null>(null)

  if (addOns.length === 0) return null

  function alternar(addOn: AddOn) {
    const activo = elegidos.includes(addOn.id)
    // Al DESMARCAR un add-on que lo pide, se interpone una confirmación en vez
    // de quitarlo directamente. Solo aplica al desmarcado: marcar es siempre
    // inmediato — poner fricción para gastar más y no para gastar menos sería
    // el patrón inverso al que queremos.
    if (activo && mensajeAlDesmarcar && addOn.porDefecto) {
      setConfirmando(addOn.id)
      return
    }
    onCambiar(activo ? elegidos.filter((i) => i !== addOn.id) : [...elegidos, addOn.id])
  }

  return (
    <div className="flex flex-col gap-2">
      {addOns.map((a) => {
        const activo = elegidos.includes(a.id)
        const importe = precioAddOn(a, personas)
        const enConfirmacion = confirmando === a.id

        // [v2 2026-07-27, 2ª vuelta] La confirmación SUSTITUYE el contenido de
        // la tarjeta en vez de añadirse debajo. Antes crecía hacia abajo y el
        // widget —que es sticky y ya va justo de alto— empujaba el CTA fuera
        // de pantalla justo en el momento de decidir. Ocupando el mismo hueco,
        // el alto del widget no cambia al abrirse.
        if (enConfirmacion) {
          return (
            <div key={a.id} className="rounded-xl border border-aqua bg-aqua/5 p-3">
              <p className="flex items-start gap-2 text-sm font-semibold text-navy">
                <Sparkles size={16} className="mt-0.5 shrink-0 text-aqua" aria-hidden="true" />
                {t('Sure? These photos don’t happen twice.')}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-navy-sub">
                {t('The full album at top quality (all of them, uncropped) for')}{' '}
                {formatoDinero(a.precio)} {t('for the whole group.')}
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmando(null)}
                  // `text-papel` y no `text-white`: ver calendario-widget.tsx —
                  // el blanco fijo desaparece sobre el navy remapeado a crema.
                  className="rounded-full bg-navy px-4 py-2 text-xs font-semibold text-papel transition hover:brightness-110"
                >
                  {t('Keep it')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onCambiar(elegidos.filter((i) => i !== a.id))
                    setConfirmando(null)
                  }}
                  className="rounded-full px-4 py-2 text-xs font-medium text-navy-sub underline transition hover:text-navy"
                >
                  {t('No, thanks')}
                </button>
              </div>
            </div>
          )
        }

        return (
          <div
            key={a.id}
            className={`rounded-xl border transition ${
              activo ? 'border-aqua bg-aqua/5' : 'border-linea bg-papel'
            }`}
          >
            <button
              type="button"
              onClick={() => alternar(a)}
              aria-pressed={activo}
              className="flex w-full items-start gap-3 p-3 text-left"
            >
              <span
                aria-hidden="true"
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                  activo ? 'border-aqua bg-aqua text-white' : 'border-linea bg-papel'
                }`}
              >
                {activo ? <Check size={14} strokeWidth={3} /> : null}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-semibold text-navy">{a.etiqueta}</span>
                  <span className="shrink-0 text-sm font-semibold text-navy">
                    +{formatoDinero(importe)}
                  </span>
                </span>
                {a.descripcion ? (
                  <span className="mt-0.5 block text-xs leading-relaxed text-navy-sub">
                    {a.descripcion}
                  </span>
                ) : null}
                {/* [v2 2026-07-27, 2ª vuelta] El badge «Precio único para todo
                    el grupo» SE RETIRA (pedido de Samuel, para bajar alto): la
                    propia descripción ya termina con «…para todo el grupo», así
                    que era la misma frase dos veces en tres líneas.
                    En los add-ons POR PERSONA sí se queda: ahí no es una
                    repetición, es la cuenta (US$ 30 × 4) que explica de dónde
                    sale el importe de la derecha. */}
                {a.base === 'persona' ? (
                  <span className="mt-1 block text-[11px] font-medium uppercase tracking-wide text-aqua">
                    {formatoDinero(a.precio)} {t('per person ×')}{' '}{personas}
                  </span>
                ) : null}
                {/* Nota honesta del cliente (ej. la langosta de marzo a junio).
                    Se muestra SIEMPRE, no solo al marcarlo: enterarse después
                    de pagar es exactamente la queja que evita. */}
                {a.nota ? (
                  <span className="mt-1 block text-[11px] italic leading-relaxed text-navy-sub/80">
                    {a.nota}
                  </span>
                ) : null}
              </span>
            </button>
          </div>
        )
      })}
    </div>
  )
}
