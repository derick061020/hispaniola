import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { Boton } from '@/components/ui/boton'
import { MegaTours } from './mega-tours'
import { MegaEventos } from './mega-eventos'
import { DropdownNosotros } from './dropdown-nosotros'
import { DropdownAyuda } from './dropdown-ayuda'
import { MenuMovil } from './menu-movil'
import { NotchMenu } from './notch-menu'
import { claseLinkTab, crearBotonTab, TabsPrincipales } from './nav-tabs'
import { useMenuDropdown } from '@/lib/use-menu-dropdown'
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
  const [movilAbierto, setMovilAbierto] = useState(false)
  const { pathname } = useLocation()
  const { menuAbierto, setMenuAbierto, toggle, navRef } = useMenuDropdown()

  // [dev-mode] deep-links del Glosario Dev — ver src/dev/dev-registry.ts
  useDevFlag('dev-mega', (v) => setMenuAbierto(v as MenuId))
  useDevFlag('dev-movil', (v) => setMovilAbierto(v === 'abierto'))

  // Al navegar, la hoja del menú móvil se cierra (el menú de tabs ya lo
  // resuelve useMenuDropdown, mismo motivo — ver su comentario). Entre dos
  // fichas React Router reusa la misma TourPage (misma ruta, otro param) y NO
  // la desmonta, así que sin esto la hoja —con su scroll bloqueado— se
  // quedaría abierta encima de la página de destino.
  const pathnameAnterior = useRef(pathname)
  useEffect(() => {
    if (pathnameAnterior.current === pathname) return
    pathnameAnterior.current = pathname
    setMovilAbierto(false)
  }, [pathname])

  const sobreVideo = variante === 'sobreVideo'

  // Botón de un tab para 'solida': idéntico al de TabsPrincipales (misma
  // fábrica, nav-tabs.tsx), pero envuelto en su propio panel colgado — en
  // 'sobreVideo' el panel activo lo pinta NotchMenu, no cada botón.
  const botonTab = crearBotonTab(menuAbierto, toggle)

  // 'solida': cada botón envuelve su propio panel flotante — sin cambios de
  // comportamiento frente a antes de F8, solo con los dropdowns ya extraídos
  // a sus propios componentes (§11.3).
  const tabsConPaneles = (
    <>
      <Link to="/" className={claseLinkTab}>
        Inicio
      </Link>

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
      {/* Topbar (WhatsApp + teléfono + idioma) vive aparte, FUERA de este
          Header y de la caja del hero — ver components/home/topbar.tsx,
          montado en App.tsx antes de cada página. */}
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
            <NotchMenu abierto={menuAbierto} tabs={<TabsPrincipales menuAbierto={menuAbierto} toggle={toggle} />} />
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
