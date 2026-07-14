import { useEffect, useRef, useState } from 'react'
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
export function Header({ variante = 'solida' }: { variante?: 'solida' | 'sobreVideo' }) {
  const [menuAbierto, setMenuAbierto] = useState<MenuId | null>(null)
  const [movilAbierto, setMovilAbierto] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)

  // [dev-mode] deep-links del Glosario Dev — ver src/dev/dev-registry.ts
  useDevFlag('dev-mega', (v) => setMenuAbierto(v as MenuId))
  useDevFlag('dev-movil', (v) => setMovilAbierto(v === 'abierto'))

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
        className={`relative flex items-center justify-between px-5 py-3 ${sobreVideo ? '' : 'border-b border-linea'}`}
        ref={navRef}
      >
        <Logo sobreOscuro={sobreVideo} />

        {sobreVideo ? (
          <div className="absolute left-1/2 top-0 z-30 hidden w-max -translate-x-1/2 md:block">
            <NotchMenu abierto={menuAbierto} tabs={tabsBotones} />
          </div>
        ) : (
          <nav className="hidden items-center gap-1 md:flex">{tabsConPaneles}</nav>
        )}

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex">
            <Boton href="#tours">Reservar</Boton>
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

      <MenuMovil abierto={movilAbierto} onCerrar={() => setMovilAbierto(false)} />
    </header>
  )
}
