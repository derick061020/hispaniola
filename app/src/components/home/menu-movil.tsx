import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { TOURS, OCASIONES, NAV_NOSOTROS, NAV_SOSTENIBILIDAD, NAV_AYUDA, bookingCta, formatoDinero } from '@/data/home'
import { EnlacePrototipo } from '@/components/ui/enlace-prototipo'
import { Boton } from '@/components/ui/boton'

type Seccion = 'tours' | 'eventos' | 'nosotros' | 'sostenibilidad' | 'ayuda'

// [v2 2026-07-27] Mismo orden que el nav de escritorio (nav-tabs.tsx), dictado
// por el cliente en la reunión del 07-24: Nosotros · Tours · Eventos ·
// Sostenibilidad · Ayuda. Si aquí y allí divergen, el sitio se lee distinto
// según el dispositivo.
const secciones: { id: Seccion; label: string }[] = [
  { id: 'nosotros', label: 'About us' },
  { id: 'tours', label: 'Tours' },
  { id: 'eventos', label: 'Events' },
  { id: 'sostenibilidad', label: 'Sustainability' },
  { id: 'ayuda', label: 'Help' },
]

// Menú móvil (PLAN-v3.md §13) — "objeto que se despliega", no una pantalla
// que sustituye a la página: la hoja lleva el mismo margen y radio que el
// hero (--spacing-hero-margen, --radius-hero — el mismo lenguaje visual del
// resto del sitio) sobre un scrim que atenúa el fondo.
export function MenuMovil({
  abierto,
  onCerrar,
  ctaHref = '#tours',
}: {
  abierto: boolean
  onCerrar: () => void
  /** Destino de «Reservar ahora» — lo pasa el Header, que sabe en qué página
   *  está (en la ficha, #tours no existe). */
  ctaHref?: string
}) {
  const [expandida, setExpandida] = useState<Seccion | null>('tours')
  const hojaRef = useRef<HTMLDivElement>(null)
  const cerrarBtnRef = useRef<HTMLButtonElement>(null)

  // Bloqueo de scroll + foco de entrada/salida (§13.4, los 3 fallos de UX que
  // tenía la pantalla completa): mientras la hoja está abierta, el fondo NO
  // scrollea, y el foco entra al botón de cerrar; al cerrar, ambos vuelven
  // exactamente a como estaban — se guarda el `overflow` PREVIO (no se asume
  // `''`) porque otro elemento (el CTA sticky, un futuro botón flotante)
  // podría estar tocando lo mismo, y se guarda qué elemento disparó la
  // apertura para devolverle el foco (no siempre es el botón hamburguesa —
  // también se abre por `?dev-movil=abierto`).
  useEffect(() => {
    if (!abierto) return
    const disparador = document.activeElement as HTMLElement | null
    const overflowPrevio = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    cerrarBtnRef.current?.focus()
    return () => {
      document.body.style.overflow = overflowPrevio
      disparador?.focus()
    }
  }, [abierto])

  // Escape cierra (paridad con el notch de escritorio, header.tsx). Tab queda
  // ATRAPADO dentro de la hoja: sin esto, se puede tabular hacia links de la
  // página de detrás mientras la hoja "modal" sigue abierta encima.
  useEffect(() => {
    if (!abierto) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onCerrar()
        return
      }
      if (e.key !== 'Tab') return
      const hoja = hojaRef.current
      if (!hoja) return
      const focosables = hoja.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
      if (focosables.length === 0) return
      const primero = focosables[0]
      const ultimo = focosables[focosables.length - 1]
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault()
        ultimo.focus()
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault()
        primero.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [abierto, onCerrar])

  if (!abierto) return null

  // Portal a document.body (PLAN-v3.md §13): Header vive dentro de un
  // ancestro `relative z-10` (hero.tsx) que crea su PROPIO contexto de
  // apilamiento — sin portal, el z-50 de la hoja compite puertas adentro de
  // ese z-10, no contra el resto de la página, y el CTA sticky (`fixed
  // z-30`, hermano de ese z-10 en el árbol) terminaba pintándose ENCIMA de
  // la hoja a pesar de su z-index más bajo. Verificado con
  // `document.elementFromPoint` antes del fix. El portal saca la hoja y el
  // scrim de ese árbol por completo.
  return createPortal(
    <>
      {/* Scrim — oscurece la página detrás y cierra al tocarlo (gesto de
          objeto, no de pantalla). Decorativo: el cierre accesible ya está
          cubierto por Escape y el botón de cerrar, así que se saca del árbol
          de accesibilidad. */}
      <div className="fixed inset-0 z-50 bg-navy/40 backdrop-blur-sm md:hidden" onClick={onCerrar} aria-hidden="true" />

      {/* La hoja — mismo margen (--spacing-hero-margen) y radio (--radius-hero)
          que el hero: por eso se lee como parte del mismo sistema y no como
          un modal genérico a sangre. Cae desde arriba (transform-origin +
          keyframes en componentes.css): en desktop los menús salen del notch,
          en el header — en móvil deben salir del mismo sitio, no subir desde
          abajo como un bottom sheet, que mentiría sobre su origen. */}
      <div
        ref={hojaRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menú"
        className="menu-hoja fixed inset-hero-margen z-50 flex flex-col overflow-hidden rounded-hero bg-papel shadow-hero md:hidden"
      >
        <div className="flex items-center justify-between border-b border-linea px-5 py-4">
          <strong className="font-display text-lg text-navy">Menú</strong>
          <button
            ref={cerrarBtnRef}
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="grid size-9 place-items-center rounded-lg text-navy hover:bg-papel-hueso"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-2">
          {/* "Inicio" (2026-07-17, pedido de Samuel): primer ítem de todos,
              link plano a "/" — a diferencia de las 4 secciones de abajo, no
              tiene subítems que desplegar, así que no pasa por el estado
              `expandida`. */}
          <Link
            to="/"
            onClick={onCerrar}
            className="block border-b border-linea py-3 font-display text-base font-semibold text-navy"
          >
            Home
          </Link>
          {secciones.map((s) => (
            <div key={s.id} className="border-b border-linea py-1">
              <button
                type="button"
                onClick={() => setExpandida((e) => (e === s.id ? null : s.id))}
                className="flex w-full items-center justify-between py-3 text-left font-display text-base font-semibold text-navy"
              >
                {s.label}
                <span className={`text-navy-soft transition-transform ${expandida === s.id ? 'rotate-180' : ''}`}>▾</span>
              </button>
              {expandida === s.id ? (
                <div className="pb-3">
                  {s.id === 'tours' ? (
                    <div className="flex flex-col gap-2">
                      {/* Los tours llevan a su ficha real. La hoja se cierra
                          sola al navegar: el header escucha el cambio de
                          pathname (header.tsx) — hace falta porque entre dos
                          fichas React Router NO desmonta la página, así que la
                          hoja se quedaría abierta encima, con el scroll del
                          fondo aún bloqueado. */}
                      {TOURS.map((t) => (
                        <Link
                          key={t.slug}
                          to={`/tours/${t.slug}`}
                          className="flex items-center justify-between rounded-lg bg-papel-hueso px-3 py-2.5"
                        >
                          <span className="text-sm font-medium text-navy">{t.nombre}</span>
                          <span className="text-xs font-semibold text-menta-texto">
                            {t.precioLight !== null ? `Desde ${formatoDinero(t.precioLight)}` : bookingCta[t.booking]}
                          </span>
                        </Link>
                      ))}
                    </div>
                  ) : null}
                  {s.id === 'eventos' ? (
                    <div className="flex flex-col gap-1.5">
                      {/* Bodas y MICE llevan a su landing real; «Eventos y
                          party boat» sigue en el prototipo (formulario del
                          hub). Misma unión por `slug` que el megamenú. */}
                      {OCASIONES.map((o) =>
                        o.slug ? (
                          <Link
                            key={o.tipo}
                            to={`/events/${o.slug}`}
                            className="rounded-lg px-3 py-2 hover:bg-papel-hueso"
                          >
                            <span className="text-sm font-medium text-navy">{o.nombre}</span>
                          </Link>
                        ) : (
                          <EnlacePrototipo key={o.tipo} className="rounded-lg px-3 py-2 hover:bg-papel-hueso">
                            <span className="text-sm font-medium text-navy">{o.nombre}</span>
                          </EnlacePrototipo>
                        ),
                      )}
                    </div>
                  ) : null}
                  {s.id === 'nosotros' ? (
                    <div className="flex flex-col gap-1.5">
                      {/* Igual que ItemMenu del dropdown de escritorio: `to`
                          decide página real vs. placeholder del prototipo. */}
                      {NAV_NOSOTROS.map((item) =>
                        item.to ? (
                          <Link
                            key={item.id}
                            to={item.to}
                            className="rounded-lg px-3 py-2 text-sm font-medium text-navy hover:bg-papel-hueso"
                          >
                            {item.nombre}
                          </Link>
                        ) : (
                          <EnlacePrototipo
                            key={item.id}
                            className="rounded-lg px-3 py-2 text-sm font-medium text-navy hover:bg-papel-hueso"
                          >
                            {item.nombre}
                          </EnlacePrototipo>
                        ),
                      )}
                    </div>
                  ) : null}
                  {/* [v2 2026-07-27] Sostenibilidad, tab nuevo del menú v2.
                      Mismo tratamiento que Nosotros y Ayuda. */}
                  {s.id === 'sostenibilidad' ? (
                    <div className="flex flex-col gap-1.5">
                      {NAV_SOSTENIBILIDAD.map((item) =>
                        item.to ? (
                          <Link
                            key={item.id}
                            to={item.to}
                            className="rounded-lg px-3 py-2 text-sm font-medium text-navy hover:bg-papel-hueso"
                          >
                            {item.nombre}
                          </Link>
                        ) : (
                          <EnlacePrototipo
                            key={item.id}
                            className="rounded-lg px-3 py-2 text-sm font-medium text-navy hover:bg-papel-hueso"
                          >
                            {item.nombre}
                          </EnlacePrototipo>
                        ),
                      )}
                    </div>
                  ) : null}
                  {s.id === 'ayuda' ? (
                    <div className="flex flex-col gap-1.5">
                      {NAV_AYUDA.map((item) =>
                        item.to ? (
                          <Link
                            key={item.id}
                            to={item.to}
                            className="rounded-lg px-3 py-2 text-sm font-medium text-navy hover:bg-papel-hueso"
                          >
                            {item.nombre}
                          </Link>
                        ) : (
                          <EnlacePrototipo
                            key={item.id}
                            className="rounded-lg px-3 py-2 text-sm font-medium text-navy hover:bg-papel-hueso"
                          >
                            {item.nombre}
                          </EnlacePrototipo>
                        ),
                      )}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div className="border-t border-linea p-4">
          {/* `#tours` solo existe en la home; en la ficha este botón no haría
              nada. Se resuelve contra la página actual: en la ficha manda al
              widget de reserva (el mismo destino que el «Reservar» del header),
              y en la home al grid de tours. */}
          <Boton href={ctaHref} onClick={onCerrar} className="w-full">
            Reservar ahora
          </Boton>
        </div>
      </div>
    </>,
    document.body,
  )
}
