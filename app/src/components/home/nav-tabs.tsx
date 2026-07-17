import { Link } from 'react-router-dom'
import type { MenuId } from './header'

export const claseLinkTab = 'rounded-lg px-3 py-2 text-sm font-medium text-navy transition-colors hover:bg-papel-hueso'
const claseLinkAbierto = 'bg-papel-hueso'

// Fábrica del botón de un tab — la misma pieza vive en 3 sitios (Header
// 'solida', con el panel colgado del propio botón; Header 'sobreVideo' y la
// isla flotante, los dos DENTRO de un NotchMenu que pinta el panel él solo):
// un botón, no 3 implementaciones.
export function crearBotonTab(menuAbierto: MenuId | null, toggle: (id: MenuId) => void) {
  return (id: MenuId, label: string) => (
    <button
      key={id}
      type="button"
      onClick={() => toggle(id)}
      aria-expanded={menuAbierto === id}
      className={`${claseLinkTab} ${menuAbierto === id ? claseLinkAbierto : ''}`}
    >
      {label}
    </button>
  )
}

// Fila de tabs para los 2 usos que viven DENTRO de un NotchMenu (Header
// sobreVideo y la isla flotante) — ahí el panel activo lo pinta el propio
// NotchMenu, así que aquí solo hacen falta los botones.
//
// "Guías" ya NO es su propio tab (2026-07-17, pedido de Samuel) — vive como
// subtab dentro de Ayuda (NAV_AYUDA, data/home.ts → DropdownAyuda), que de
// paso rellena la 4ª celda de su grid que antes se dejaba vacía a propósito.
//
// "Inicio" (2026-07-17, pedido de Samuel): primer ítem del menú, link plano
// a "/" — no es un tab con panel (no hay menuAbierto que le corresponda), así
// que no pasa por crearBotonTab, mismo trato que llevaba "Guías" cuando era
// su propio tab.
export function TabsPrincipales({
  menuAbierto,
  toggle,
}: {
  menuAbierto: MenuId | null
  toggle: (id: MenuId) => void
}) {
  const botonTab = crearBotonTab(menuAbierto, toggle)
  return (
    <>
      <Link to="/" className={claseLinkTab}>
        Inicio
      </Link>
      {botonTab('tours', 'Tours ▾')}
      {botonTab('eventos', 'Eventos ▾')}
      {botonTab('nosotros', 'Nosotros ▾')}
      {botonTab('ayuda', 'Ayuda ▾')}
    </>
  )
}
