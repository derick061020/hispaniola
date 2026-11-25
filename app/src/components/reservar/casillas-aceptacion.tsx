import { forwardRef, useId, type ReactNode } from 'react'
import { t } from '@/lib/i18n'
import type { EstadoAceptacion } from '@/lib/aceptacion-legal'

// [2026-10-30, Samuel: «las casillas de aceptación las hacemos nosotros»]
// Las dos casillas del anexo del PDF HAA-LEG-002 (págs. 5-6), justo antes del
// botón de pagar, una debajo de la otra. Reglas del anexo que explican cada
// decisión de aquí:
//
//  · Las dos se ven IGUALES (mismo tamaño, letra y estilo). La única diferencia
//    es el asterisco rojo de la primera. No se escribe «obligatorio» ni
//    «opcional» en ningún sitio.
//  · Van SEPARADAS porque la autorización de imagen tiene que ser libre: dentro
//    de la casilla 1 el cliente estaría obligado a darla para reservar, y esa
//    autorización se podría anular. Por eso la 2 nunca viene marcada.
//  · Sin la 1 no se paga. El bloqueo NO está aquí: está en `paso-pago.tsx`
//    (`exigeTerminos`), que es quien sabe cuándo se intenta pagar —botón,
//    barra móvil, PayPal y los wallets de Stripe—. Aquí solo se pinta el aviso.
//  · Cada documento enlaza a su página en pestaña nueva; la casilla 2, sin enlaces.
//
// ⚠️ Texto: el ESPAÑOL es el del PDF, literal. El INGLÉS (lo que sale por
// defecto) es traducción nuestra y la tiene que revisar Marketing — está en
// docs/proceso/politicas-haa-leg-002/TRADUCCION-EN-PARA-REVISAR.md.
//
// La frase de la casilla 1 es UNA sola entrada del diccionario, con los
// documentos entre [corchetes], en vez de trocearla en «the» + enlace + «, the»:
// así el traductor ve la frase entera y los títulos salen con la mayúscula del
// PDF («Términos y Condiciones») y no con la del pie («Términos y condiciones»,
// que ya existe con esa clave). Los corchetes van en el mismo orden en los dos
// idiomas y cada uno se convierte en el enlace de `DOCUMENTOS`.
const FRASE_TERMINOS =
  'I have read and accept the [Terms and Conditions], the [Cancellation and Refund Policy], the [Privacy Policy] and the [Release of Liability and Assumption of Risk], on my own behalf and on behalf of all the people in this booking.'

/** A dónde lleva cada [corchete], en orden. */
const DOCUMENTOS: (string | null)[] = [
  '/legal/terms',
  '/legal/cancellation-policy',
  '/legal/privacy',
  // TODO(HAA-LEG-001): el Relevo de Responsabilidad y Asunción de Riesgos aún
  // no nos ha llegado, así que no tiene página. Cuando llegue: crear
  // /legal/release (App.tsx + public/sitemap.xml + vercel.json, mismo commit)
  // y poner aquí su ruta. Mientras, el título sale como texto, sin enlace.
  null,
]

const FRASE_IMAGEN =
  'I authorize Hispaniola Aquatic Adventures and Bávaro Reefs Group to use, on social media, the website and in advertising, the photos and videos of the tour in which I and the minors in my booking appear.'

/** Convierte los [corchetes] de la frase traducida en enlaces. */
function conEnlaces(frase: string): ReactNode[] {
  let n = 0
  return frase.split(/(\[[^\]]+\])/).map((trozo, i) => {
    if (!trozo.startsWith('[')) return trozo
    const titulo = trozo.slice(1, -1)
    const ruta = DOCUMENTOS[n++]
    if (!ruta) return titulo
    return (
      <a
        key={i}
        href={ruta}
        target="_blank"
        rel="noopener"
        className="font-medium text-navy underline underline-offset-2 hover:text-aqua-dark"
      >
        {titulo}
      </a>
    )
  })
}

type Props = {
  valor: EstadoAceptacion
  onCambio: (valor: EstadoAceptacion) => void
  /** Se intentó pagar sin la casilla 1: se resalta en rojo con el aviso. */
  avisoTerminos: boolean
  desactivado?: boolean
}

/** El `ref` es el de la casilla 1: `paso-pago.tsx` le lleva el foco cuando se
 *  intenta pagar sin marcarla. */
export const CasillasAceptacion = forwardRef<HTMLInputElement, Props>(function CasillasAceptacion(
  { valor, onCambio, avisoTerminos, desactivado = false },
  refTerminos,
) {
  const idAviso = useId()

  return (
    <div className="flex flex-col gap-3">
      <div>
        <label
          className={`flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5 transition-colors ${
            avisoTerminos ? 'border-coral bg-coral/5' : 'border-transparent'
          }`}
        >
          <input
            ref={refTerminos}
            type="checkbox"
            className="mt-0.5 size-4 shrink-0 accent-aqua"
            checked={valor.aceptaTerminos}
            disabled={desactivado}
            aria-required="true"
            aria-invalid={avisoTerminos || undefined}
            aria-describedby={avisoTerminos ? idAviso : undefined}
            onChange={(e) =>
              onCambio({
                ...valor,
                aceptaTerminos: e.target.checked,
                aceptadoEn: e.target.checked ? new Date().toISOString() : null,
              })
            }
          />
          <span className="text-sm leading-relaxed text-navy-sub">
            {conEnlaces(t(FRASE_TERMINOS))}{' '}
            {/* El asterisco es la única marca: se esconde al lector de
                pantalla, que ya oye «obligatorio» por el `aria-required`. */}
            <span className="font-semibold text-coral-texto" aria-hidden="true">*</span>
          </span>
        </label>
        {avisoTerminos ? (
          <p id={idAviso} role="alert" className="mt-1.5 px-3 text-xs font-medium text-coral-texto">
            {t('You must accept the Terms and Conditions to continue.')}
          </p>
        ) : null}
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-transparent px-3 py-2.5">
        <input
          type="checkbox"
          className="mt-0.5 size-4 shrink-0 accent-aqua"
          checked={valor.autorizaImagen}
          disabled={desactivado}
          onChange={(e) => onCambio({ ...valor, autorizaImagen: e.target.checked })}
        />
        <span className="text-sm leading-relaxed text-navy-sub">{t(FRASE_IMAGEN)}</span>
      </label>
    </div>
  )
})
