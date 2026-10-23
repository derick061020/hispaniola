import { useEffect, useRef, useState, type TouchEvent } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useCatalogo } from '@/lib/api/use-catalogo'
import { fusionarLista } from '@/lib/api/fusion-catalogo'
import { TOURS, OCASIONES, NAV_NOSOTROS, NAV_SOSTENIBILIDAD, NAV_AYUDA } from '@/data/home'
import { CardTour } from './mega-tours'
import { CardOcasion, FranjaWebsGrupo } from './mega-eventos'
import { ItemMenu } from './item-menu'
import { Boton } from '@/components/ui/boton'
import { t, traducible } from '@/lib/i18n'
import { SelectorIdioma } from '@/components/ui/selector-idioma'

type Seccion = 'tours' | 'eventos' | 'nosotros' | 'sostenibilidad' | 'ayuda'

// [v2 2026-07-27] Mismo orden que el nav de escritorio (nav-tabs.tsx), dictado
// por el cliente en la reunión del 07-24: Nosotros · Tours · Eventos ·
// Sostenibilidad · Ayuda. Si aquí y allí divergen, el sitio se lee distinto
// según el dispositivo.
const secciones: { id: Seccion; label: string }[] = traducible([
  { id: 'nosotros', label: 'About us' },
  { id: 'tours', label: 'Tours' },
  { id: 'eventos', label: 'Events' },
  { id: 'sostenibilidad', label: 'Sustainability' },
  { id: 'ayuda', label: 'Help' },
])

// Menú móvil (PLAN-v3.md §13) — "objeto que se despliega", no una pantalla
// que sustituye a la página: la hoja lleva el mismo margen y radio que el
// hero (--spacing-hero-margen, --radius-hero — el mismo lenguaje visual del
// resto del sitio) sobre un scrim que atenúa el fondo.
export function MenuMovil({
  abierto,
  onCerrar,
  // Mismo motivo que el default de Header: ver components/home/header.tsx.
  // [2026-10-02, Samuel: «el boton Book Now debe dirigir a esta pagina:
  // /tours/»] Era `/#tours`: un ancla que devolvia a la HOME y bajaba al
  // escaparate de cuatro tarjetas. El catalogo de verdad esta en /tours, y es
  // ahi donde se elige. Los CTA que apuntan al widget de reserva de su propia
  // pagina (la ficha, el evento) NO cambian: mandarlos a una lista desde una
  // pagina donde ya se puede reservar seria un paso atras.
  // [2026-10-02, Samuel: «el botón Book Now debe dirigir a /tours/»] Y ahí se
  // queda: el 05/10 llegó a apuntar a /tours-and-events por un malentendido
  // mío —el botón que abre esa página es «See availability», no este— y se
  // devolvió el mismo día.
  ctaHref = '/tours',
}: {
  abierto: boolean
  onCerrar: () => void
  /** Destino de «Reservar ahora» — lo pasa el Header, que sabe en qué página
   *  está (en la ficha, #tours no existe). */
  ctaHref?: string
}) {
  // [2026-08-18] La lista sale de Odoo: un tour despublicado desaparece de aquí
  // sin tocar código, y el «desde US$» es el del catálogo, no el que quedó
  // escrito en `data/home.ts`. Si Odoo no contesta se pinta la lista estática.
  const tours = fusionarLista(TOURS, useCatalogo())
  // [2026-10-23] `vista`: la sub-vista abierta (null = listado principal).
  // `mostrada`: qué contenido pinta el panel de sub-vista — se separa de
  // `vista` para que, al volver, el panel siga mostrando su contenido
  // mientras sale deslizándose en vez de vaciarse de golpe.
  const [vista, setVista] = useState<Seccion | null>(null)
  const [mostrada, setMostrada] = useState<Seccion>('tours')
  const hojaRef = useRef<HTMLDivElement>(null)
  const cerrarBtnRef = useRef<HTMLButtonElement>(null)
  const atrasRef = useRef<HTMLButtonElement>(null)
  // El botón de cada apartado, para devolverle el foco al volver.
  const botonesRef = useRef<Partial<Record<Seccion, HTMLButtonElement | null>>>({})
  const volviendoDe = useRef<Seccion | null>(null)
  const toque = useRef<{ x: number; y: number } | null>(null)

  const abrirVista = (s: Seccion) => {
    setMostrada(s)
    setVista(s)
  }
  const volver = () => {
    volviendoDe.current = vista
    setVista(null)
  }

  // Cada vez que se abre la hoja, empieza en el listado.
  useEffect(() => {
    if (abierto) setVista(null)
  }, [abierto])

  // Foco: al entrar en una sub-vista, al «Atrás»; al volver, al apartado del
  // que se venía (no al principio de la lista). preventScroll: el foco no
  // debe arrastrar el panel que aún se está deslizando.
  useEffect(() => {
    if (vista) {
      atrasRef.current?.focus({ preventScroll: true })
    } else if (volviendoDe.current) {
      botonesRef.current[volviendoDe.current]?.focus({ preventScroll: true })
      volviendoDe.current = null
    }
  }, [vista])

  // Gesto: deslizar hacia la derecha en una sub-vista vuelve al listado.
  // Umbral de 70px y casi horizontal, para no confundirlo con un scroll.
  const alTocar = (e: TouchEvent<HTMLDivElement>) => {
    toque.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }
  const alSoltar = (e: TouchEvent<HTMLDivElement>) => {
    const inicio = toque.current
    toque.current = null
    if (!inicio || !vista) return
    const dx = e.changedTouches[0].clientX - inicio.x
    const dy = e.changedTouches[0].clientY - inicio.y
    if (dx > 70 && Math.abs(dy) < 40) volver()
  }

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
        // [2026-10-23] En una sub-vista, Escape vuelve un nivel (como el
        // «Atrás»); en el listado, cierra la hoja.
        if (vista) {
          volviendoDe.current = vista
          setVista(null)
        } else {
          onCerrar()
        }
        return
      }
      if (e.key !== 'Tab') return
      const hoja = hojaRef.current
      if (!hoja) return
      // Sin los de la vista que está fuera de pantalla (`inert`).
      const focosables = [...hoja.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')].filter(
        (el) => !el.closest('[inert]'),
      )
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
  }, [abierto, onCerrar, vista])

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
      <div className="fixed inset-0 z-50 bg-navy/40 backdrop-blur-sm lg:hidden" onClick={onCerrar} aria-hidden="true" />

      {/* La hoja — mismo margen (--spacing-hero-margen) y radio (--radius-hero)
          que el hero: por eso se lee como parte del mismo sistema y no como
          un modal genérico a sangre. Cae desde arriba (transform-origin +
          keyframes en componentes.css): en desktop los menús salen del notch,
          en el header — en móvil deben salir del mismo sitio, no subir desde
          abajo como un bottom sheet, que mentiría sobre su origen.
          [2026-10-23] lg:hidden y no md:hidden: entre 768 y 1023 ya no hay
          tabs (nav-flotante.tsx) y la hamburguesa abre esta misma hoja. */}
      <div
        ref={hojaRef}
        role="dialog"
        aria-modal="true"
        aria-label={t('Menu')}
        className="menu-hoja fixed inset-hero-margen z-50 flex flex-col overflow-hidden rounded-hero bg-papel shadow-hero lg:hidden"
      >
        {/* Barra superior. En el listado: «Menu». En una sub-vista: «Atrás»
            arriba a la izquierda (2026-10-23, Samuel) — mismo sitio donde
            cualquier móvil pone el «volver», para que no haya que buscarlo. */}
        <div className="flex items-center justify-between border-b border-linea px-5 py-4">
          {vista ? (
            <button
              ref={atrasRef}
              type="button"
              onClick={volver}
              className="-ml-2 flex items-center gap-1 rounded-lg py-1 pr-2 pl-1 font-display text-base font-semibold text-navy hover:bg-papel-hueso"
            >
              <ChevronLeft aria-hidden="true" className="size-5" />
              {t('Back')}
            </button>
          ) : (
            <strong className="font-display text-lg text-navy">{t('Menu')}</strong>
          )}
          <button
            ref={cerrarBtnRef}
            type="button"
            onClick={onCerrar}
            aria-label={t('Close')}
            className="grid size-9 place-items-center rounded-lg text-navy hover:bg-papel-hueso"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* NAVEGACIÓN POR PÁGINAS (2026-10-23, pedido de Samuel). Antes cada
            apartado era un acordeón que empujaba el contenido; ahora tocar un
            apartado DESLIZA la hoja a una sub-vista que solo muestra ese
            apartado, con el mismo lenguaje que el megamenú de escritorio
            (foto + nombre + línea en Tours y Eventos; icono + nombre +
            descripción en Nosotros, Sostenibilidad y Ayuda, que en escritorio
            tampoco tienen foto — no se inventan imágenes).
            Las dos vistas viven a la vez, una al lado de la otra, y se mueven
            con translate (motion-reduce: sin transición, cambio seco). La que
            está fuera de pantalla va `inert`: ni foco ni lector de pantalla.
            Volver: botón «Atrás», Escape (en una sub-vista vuelve un nivel; en
            el listado cierra) o deslizar el dedo hacia la derecha. */}
        <div className="relative flex-1 overflow-hidden" onTouchStart={alTocar} onTouchEnd={alSoltar}>
          <div
            inert={vista !== null}
            className={`absolute inset-0 overflow-y-auto px-5 py-2 transition-transform duration-300 ease-out motion-reduce:transition-none ${
              vista ? '-translate-x-full' : 'translate-x-0'
            }`}
          >
            {/* "Inicio" (2026-07-17, pedido de Samuel): primer ítem de todos,
                link plano a "/" — no tiene sub-vista. */}
            <Link
              to="/"
              onClick={onCerrar}
              className="block border-b border-linea py-3 font-display text-base font-semibold text-navy"
            >
              {t('Home')}
            </Link>
            {secciones.map((s) => (
              <button
                key={s.id}
                ref={(el) => {
                  botonesRef.current[s.id] = el
                }}
                type="button"
                onClick={() => abrirVista(s.id)}
                className="flex w-full items-center justify-between border-b border-linea py-4 text-left font-display text-base font-semibold text-navy"
              >
                {s.label}
                <ChevronRight aria-hidden="true" className="size-5 text-navy-soft" />
              </button>
            ))}
          </div>

          <div
            inert={vista === null}
            className={`absolute inset-0 overflow-y-auto px-5 pt-4 pb-5 transition-transform duration-300 ease-out motion-reduce:transition-none ${
              vista ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <h2 className="mb-4 font-display text-xl font-semibold text-navy">
              {secciones.find((s) => s.id === mostrada)?.label}
            </h2>
            {mostrada === 'tours' ? (
              // Los tours llevan a su ficha real. La hoja se cierra sola al
              // navegar: el header escucha el cambio de pathname (header.tsx).
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {tours.map((tour) => (
                  <CardTour key={tour.slug} tour={tour} />
                ))}
              </div>
            ) : null}
            {mostrada === 'eventos' ? (
              // Igual que el megamenú: los 3 eventos propios arriba, grandes;
              // las webs del grupo en su franja de fondo plano al pie, a sangre
              // (-mx-5 / -mb-5 anulan el padding de esta vista).
              <>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-navy-soft">{t('Private events')}</p>
                {/* [2026-10-23, Samuel] Menos scroll en móvil: rejilla de 2
                    columnas con fotos bajas; el 3.º ocupa el ancho completo
                    (una celda vacía al lado se leería como hueco). Desde sm
                    (≥640, tablet) vuelve a 3 columnas, como antes. */}
                <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-3 sm:gap-4">
                  {OCASIONES.map((o, i) => (
                    <div key={o.tipo} className={i === OCASIONES.length - 1 && OCASIONES.length % 2 === 1 ? 'col-span-2 sm:col-span-1' : ''}>
                      <CardOcasion
                        o={o}
                        compacto
                        alto={i === OCASIONES.length - 1 && OCASIONES.length % 2 === 1 ? 'h-28' : 'h-24'}
                      />
                    </div>
                  ))}
                </div>
                <FranjaWebsGrupo className="-mx-5 mt-5 -mb-5 px-5 pt-4 pb-5" />
              </>
            ) : null}
            {mostrada === 'nosotros' || mostrada === 'sostenibilidad' || mostrada === 'ayuda' ? (
              // El mismo ItemMenu de los dropdowns de escritorio, con la
              // descripción visible. -mx-3: el p-3 del ítem deja el icono
              // alineado con el título de la vista.
              <div className="-mx-3 grid gap-1 sm:grid-cols-2">
                {(mostrada === 'nosotros' ? NAV_NOSOTROS : mostrada === 'sostenibilidad' ? NAV_SOSTENIBILIDAD : NAV_AYUDA).map(
                  (item) => (
                    <ItemMenu key={item.id} item={item} conDescripcion />
                  ),
                )}
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-3 border-t border-linea p-4">
          {/* [2026-08-19] El selector de idioma vive en el Topbar, que es
              `hidden sm:block` — o sea, en móvil NO EXISTE. Con el toggle ya
              conectado de verdad eso dejaba sin forma de cambiar de idioma
              justo a la mitad del tráfico que llega de un QR en el muelle.
              Aquí, junto al CTA, es el único sitio del móvil por el que pasa
              todo el mundo. */}
          <SelectorIdioma className="shrink-0" />
          {/* `#tours` solo existe en la home; en la ficha este botón no haría
              nada. Se resuelve contra la página actual: en la ficha manda al
              widget de reserva (el mismo destino que el «Reservar» del header),
              y en la home al grid de tours. */}
          <Boton href={ctaHref} onClick={onCerrar} className="flex-1">
            {t('Book now')}
          </Boton>
        </div>
      </div>
    </>,
    document.body,
  )
}
