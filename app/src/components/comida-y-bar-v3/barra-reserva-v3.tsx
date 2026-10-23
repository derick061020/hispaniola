import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { t } from '@/lib/i18n'

// CTA FIJO PARA RESERVAR de /food-and-bar.
//
// [2026-10-22, Samuel: «hay pocos CTA; en otra página ya hicimos un CTA fijo
// abajo, reutilízalo para que siempre se pueda reservar»] El patrón es el de
// la barra de reserva del museo (museo/barra-reserva-museo.tsx, pedida por
// Marketing): una píldora abajo y centrada que acompaña el scroll y SE CALLA
// donde estorbaría o sobraría — el héroe (ya tiene su «Book now» en el header),
// el cierre (`#your-tour`, que es un bloque entero de salidas a reservar) y el
// footer. La del museo vigila con un IntersectionObserver; esta, igual.
// (La ficha de tour tiene otra, edge-to-edge en móvil: es la del widget de
// precio, no encaja aquí, donde no hay un tour concreto.)
//
// DESTINO: `/tours`. Esta página enseña los menús y la barra de TODOS los
// tours, no vende uno: a diferencia del museo (que manda a /tours/coral-quest,
// su único producto), aquí el sitio correcto es la lista, donde se elige tour
// y arranca el flujo de reserva. Es el mismo destino del «Book now» del header.
//
// ESCRITORIO (≥ 1024): esta píldora. MÓVIL Y TABLETA: no hay píldora aparte —
// el mismo botón va DENTRO de la barra del índice (indice-v3.tsx) para no
// apilar dos barras fijas; los dos comparten `useCtaVisible`.
//
// DOS BOTONES [2026-10-22, Samuel: «la página habla de tours y de eventos»]:
// el principal (coral) a /tours y un SECUNDARIO (contorno, `comida3-boton-
// secundario`) a /events, que nunca compite con el principal. En móvil y
// tableta, donde no caben con texto largo, llevan rótulo corto («Tours» /
// «Events») y el largo queda en `aria-label` (ver indice-v3.tsx).
//
// Sin sombra decorativa (4ª revisión): se separa del contenido con un anillo
// blanco del fondo claro.

/** `true` mientras no esté a la vista el héroe, el cierre ni el footer. */
export function useCtaVisible() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const vigilados = ['#hero', '#your-tour', 'footer']
      .map((s) => document.querySelector(s))
      .filter((el): el is Element => !!el)
    const enVista = new Map<Element, boolean>()
    const io = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => enVista.set(e.target, e.isIntersecting))
        setVisible(![...enVista.values()].some(Boolean))
      },
      { threshold: 0.05 },
    )
    vigilados.forEach((el) => {
      enVista.set(el, true)
      io.observe(el)
    })
    return () => io.disconnect()
  }, [])
  return visible
}

export const RUTA_RESERVA_V3 = '/tours'
export const RUTA_EVENTOS_V3 = '/events'

export function BarraReservaV3() {
  const visible = useCtaVisible()
  return (
    <div className="comida3-cta-fijo" data-visible={visible ? '' : undefined} aria-hidden={!visible}>
      <Link to={RUTA_RESERVA_V3} className="museo-boton-coral group" tabIndex={visible ? 0 : -1}>
        {t('Book your tour')}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </Link>
      <Link to={RUTA_EVENTOS_V3} className="comida3-boton-secundario" tabIndex={visible ? 0 : -1}>
        {t('Plan an event')}
      </Link>
    </div>
  )
}
