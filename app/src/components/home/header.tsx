import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { Boton } from '@/components/ui/boton'
import { EnlacePrototipo } from '@/components/ui/enlace-prototipo'
import { MegaTours } from './mega-tours'
import { MegaEventos } from './mega-eventos'
import { DropdownNosotros } from './dropdown-nosotros'
import { DropdownAyuda } from './dropdown-ayuda'
import { MenuMovil } from './menu-movil'
import { NotchMenu } from './notch-menu'
import { useDevFlag } from '@/dev/use-dev-flag'

export type MenuId = 'tours' | 'eventos' | 'nosotros' | 'ayuda'

// v3: el header vive DENTRO del box del hero (app/PLAN-v3.md §4), así que
// necesita una variante transparente sobre el video. 'solida' (default) es
// la barra opaca de siempre; 'sobreVideo' quita el fondo blanco/sticky y
// pasa el texto a blanco para leerse sobre el video del hero.
//
// `ctaHref`: el botón «Reservar» apunta al grid de tours en la home (#tours,
// el default), pero en la ficha de tour ese ancla NO existe y el botón no
// haría nada — allí apunta al widget de reserva (PLAN-TOURS.md §7).
export function Header({
  variante = 'solida',
  ctaHref = '#tours',
}: {
  variante?: 'solida' | 'sobreVideo'
  ctaHref?: string
}) {
  const [menuAbierto, setMenuAbierto] = useState<MenuId | null>(null)
  const [movilAbierto, setMovilAbierto] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()

  // [dev-mode] deep-links del Glosario Dev — ver src/dev/dev-registry.ts
  useDevFlag('dev-mega', (v) => setMenuAbierto(v as MenuId))
  useDevFlag('dev-movil', (v) => setMovilAbierto(v === 'abierto'))

  // Al navegar, los menús se cierran. Desde que los tours llevan a una ficha
  // real (/tours/:slug) esto NO es opcional: entre dos fichas React Router
  // reusa la misma TourPage (misma ruta, otro param) y NO la desmonta, así que
  // sin esto el megamenú —o la hoja del menú móvil, con su scroll bloqueado—
  // se quedaría abierto encima de la página de destino.
  //
  // ⚠️ Cierra solo cuando el pathname CAMBIA de verdad, comparándolo con el
  // anterior — y no con un flag de «primer render». Dos razones, las dos
  // encontradas en la verificación de T-F6:
  //   1. Los efectos de `useDevFlag` se declaran arriba, así que en el montaje
  //      corren ANTES que éste: sin guarda, cerraba de inmediato el menú que
  //      `?dev-mega=tours` / `?dev-movil=abierto` acababan de abrir, y esos
  //      deep-links son los frames de Figma.
  //   2. Un flag de primer render NO basta: StrictMode invoca los efectos dos
  //      veces al montar (efecto → cleanup → efecto), así que la 2ª pasada ya
  //      no se saltaba y volvía a cerrar. Comparar el valor anterior es
  //      idempotente: si el pathname no cambió, no hay nada que cerrar.
  //
  // Depende solo de `pathname`: useDevFlag limpia su query param tras
  // aplicarse, y con `search` en las dependencias ese cambio volvería a
  // cerrar el menú recién abierto.
  const pathnameAnterior = useRef(pathname)
  useEffect(() => {
    if (pathnameAnterior.current === pathname) return
    pathnameAnterior.current = pathname
    setMenuAbierto(null)
    setMovilAbierto(false)
  }, [pathname])

  useEffect(() => {
    if (!menuAbierto) return
    function onClickFuera(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setMenuAbierto(null)
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuAbierto(null)
    }
    document.addEventListener('mousedown', onClickFuera)
    document.addEventListener('keydown', onEscape)
    return () => {
      document.removeEventListener('mousedown', onClickFuera)
      document.removeEventListener('keydown', onEscape)
    }
  }, [menuAbierto])

  const toggle = (id: MenuId) => setMenuAbierto((actual) => (actual === id ? null : id))

  const sobreVideo = variante === 'sobreVideo'
  // Los tabs del menú SIEMPRE viven sobre blanco: el fondo bg-papel del
  // header entero en 'solida', o el notch blanco en 'sobreVideo' — nunca
  // directo sobre el video. Por eso el texto es navy en los dos casos.
  const claseLink = 'rounded-lg px-3 py-2 text-sm font-medium text-navy transition-colors hover:bg-papel-hueso'
  const claseLinkAbierto = 'bg-papel-hueso'

  // Botón de un tab — idéntico en las 2 variantes (mismo texto/estado); lo
  // que cambia es dónde va su panel (PLAN-v3.md §11.1): colgado del propio
  // botón en 'solida', dentro del notch compartido en 'sobreVideo'.
  const botonTab = (id: MenuId, label: string) => (
    <button
      key={id}
      type="button"
      onClick={() => toggle(id)}
      aria-expanded={menuAbierto === id}
      className={`${claseLink} ${menuAbierto === id ? claseLinkAbierto : ''}`}
    >
      {label}
    </button>
  )

  // 'sobreVideo': solo botones — el panel activo lo renderiza NotchMenu
  // dentro de la caja que se expande, no un elemento colgado del botón.
  const tabsBotones = (
    <>
      {botonTab('tours', 'Tours ▾')}
      {botonTab('eventos', 'Eventos ▾')}
      {botonTab('nosotros', 'Nosotros ▾')}
      <EnlacePrototipo className={claseLink}>Guías</EnlacePrototipo>
      {botonTab('ayuda', 'Ayuda ▾')}
    </>
  )

  // 'solida': cada botón envuelve su propio panel flotante — sin cambios de
  // comportamiento frente a antes de F8, solo con los dropdowns ya extraídos
  // a sus propios componentes (§11.3).
  const tabsConPaneles = (
    <>
      <div className="relative">
        {botonTab('tours', 'Tours ▾')}
        {menuAbierto === 'tours' ? (
          <div className="absolute left-0 top-full mt-2 rounded-card bg-papel shadow-card ring-1 ring-linea">
            <MegaTours />
          </div>
        ) : null}
      </div>

      <div className="relative">
        {botonTab('eventos', 'Eventos ▾')}
        {menuAbierto === 'eventos' ? (
          <div className="absolute left-0 top-full mt-2 rounded-card bg-papel shadow-card ring-1 ring-linea">
            <MegaEventos />
          </div>
        ) : null}
      </div>

      <div className="relative">
        {botonTab('nosotros', 'Nosotros ▾')}
        {menuAbierto === 'nosotros' ? (
          <div className="absolute left-0 top-full mt-2 rounded-card bg-papel shadow-card ring-1 ring-linea">
            <DropdownNosotros />
          </div>
        ) : null}
      </div>

      <EnlacePrototipo className={claseLink}>Guías</EnlacePrototipo>

      <div className="relative">
        {botonTab('ayuda', 'Ayuda ▾')}
        {menuAbierto === 'ayuda' ? (
          <div className="absolute right-0 top-full mt-2 rounded-card bg-papel shadow-card ring-1 ring-linea">
            <DropdownAyuda />
          </div>
        ) : null}
      </div>
    </>
  )

  return (
    <header className={sobreVideo ? '' : 'sticky top-0 z-40 bg-papel'}>
      {/* Topbar (WhatsApp + idioma) retirada — vuelve como botones flotantes
          (pendiente, ver conversación 2026-07-14). */}
      <div
        className={`relative mx-auto flex max-w-contenido items-center justify-between px-5 py-3 ${sobreVideo ? '' : 'border-b border-linea'}`}
        ref={navRef}
      >
        {/* El logo lleva a la home. Mientras el sitio era una sola página no
            hacía falta y era un <img> suelto; desde que existe la ficha, es la
            salida universal a casa y su ausencia se nota (verificado en el
            flujo de QA: era el único paso que no navegaba). */}
        <Link to="/" aria-label="Hispaniola Aquatic Adventures — inicio">
          <Logo sobreOscuro={sobreVideo} />
        </Link>

        {sobreVideo ? (
          <div className="absolute left-1/2 top-0 z-30 hidden w-max -translate-x-1/2 md:block">
            <NotchMenu abierto={menuAbierto} tabs={tabsBotones} />
          </div>
        ) : (
          <nav className="hidden items-center gap-1 md:flex">{tabsConPaneles}</nav>
        )}

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex">
            <Boton href={ctaHref}>Reservar</Boton>
          </span>
          <button
            type="button"
            onClick={() => setMovilAbierto(true)}
            aria-label="Menú"
            className={`grid size-10 place-items-center rounded-lg md:hidden ${sobreVideo ? 'text-white hover:bg-white/10' : 'text-navy hover:bg-papel-hueso'}`}
          >
            <Menu className="size-5" />
          </button>
        </div>
      </div>

      <MenuMovil abierto={movilAbierto} onCerrar={() => setMovilAbierto(false)} ctaHref={ctaHref} />
    </header>
  )
}
