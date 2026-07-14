import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { MegaTours } from './mega-tours'
import { MegaEventos } from './mega-eventos'
import { DropdownNosotros } from './dropdown-nosotros'
import { DropdownAyuda } from './dropdown-ayuda'
import type { MenuId } from './header'

// Notch dinámico (PLAN-v3.md §11) — como la Dynamic Island de Apple: al abrir
// un menú, el notch entero se EXPANDE (ancho y alto, animado) y el panel vive
// DENTRO, en vez de colgar como card flotante debajo del botón. Mismo reparto
// de papeles que el dock del ticker (§10): JS mide, CSS anima — el
// useLayoutEffect solo escribe --notch-ancho/--notch-alto, la transición vive
// en componentes.css (.notch-caja).
//
// Anatomía en 3 capas (§11.1):
//   1. marco (`relative w-max`, sin overflow) — shrink-to-fit alrededor de la
//      caja; las esquinas cóncavas viven aquí, NO dentro de la caja, porque la
//      caja necesita overflow:hidden para el morph y eso se comería las
//      esquinas (trampa №5).
//   2. caja (`.notch-caja`) — blanca, `overflow:hidden`, anima width/height.
//      `flex-col items-center`: tabs y panel se centran respecto a la caja, y
//      como el wrapper del header centra el marco completo con
//      `-translate-x-1/2` (resuelto contra el ancho ACTUAL en cada frame), la
//      caja crece simétrica alrededor de su centro fijo → los tabs no se
//      mueven ni un píxel al abrir.
//   3. panel — el contenido del menú activo, con `key={abierto}` para que
//      re-monte (y su animación de entrada se repita) al cambiar de tab.
export function NotchMenu({ abierto, tabs }: { abierto: MenuId | null; tabs: ReactNode }) {
  const cajaRef = useRef<HTMLElement>(null)
  const tabsRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const caja = cajaRef.current
    const tabsEl = tabsRef.current
    if (!caja || !tabsEl) return

    // Trampa №6: hay que medir el tamaño INTRÍNSECO del panel (por eso lleva
    // w-max en vez de dejarse apretar por la caja) — si no, offsetWidth daría
    // el ancho ya recortado por el overflow mientras la caja aún es pequeña.
    const medir = () => {
      const panelEl = panelRef.current
      const ancho = Math.max(tabsEl.offsetWidth, panelEl?.offsetWidth ?? 0)
      const alto = tabsEl.offsetHeight + (panelEl?.offsetHeight ?? 0)
      caja.style.setProperty('--notch-ancho', `${ancho}px`)
      caja.style.setProperty('--notch-alto', `${alto}px`)
    }

    medir()

    // Cubre resize del viewport (los megamenús miden 92vw) y el reflow por
    // fuentes cargando tarde — no solo el cambio de `abierto`.
    const ro = new ResizeObserver(medir)
    ro.observe(tabsEl)
    if (panelRef.current) ro.observe(panelRef.current)
    return () => ro.disconnect()
  }, [abierto])

  return (
    <div className="relative w-max">
      <span className="notch-esquina notch-esquina--izquierda" aria-hidden="true" />
      <span className="notch-esquina notch-esquina--derecha" aria-hidden="true" />
      <nav ref={cajaRef} className="notch-caja flex flex-col items-center bg-papel">
        <div ref={tabsRef} className="flex w-max items-center gap-1 whitespace-nowrap px-2 py-2">
          {tabs}
        </div>
        {abierto ? (
          <div key={abierto} ref={panelRef} className="notch-panel w-max border-t border-linea">
            <PanelMenu id={abierto} />
          </div>
        ) : null}
      </nav>
    </div>
  )
}

function PanelMenu({ id }: { id: MenuId }) {
  switch (id) {
    case 'tours':
      return <MegaTours />
    case 'eventos':
      return <MegaEventos />
    case 'nosotros':
      return <DropdownNosotros />
    case 'ayuda':
      return <DropdownAyuda />
  }
}
