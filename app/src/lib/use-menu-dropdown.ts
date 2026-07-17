import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import type { MenuId } from '@/components/home/header'

// Estado + comportamiento de un nav de tabs con panel flotante — extraído del
// Header (donde vivía en solitario) al sumarse un 2º consumidor con el MISMO
// comportamiento: la isla flotante (isla-flotante.tsx, 2026-07-17). Clic
// fuera cierra, Escape cierra, y navegar a otra ruta cierra (evita que el
// panel de una ficha se quede abierto encima de la página de destino — bug
// real ya cazado una vez en el Header, ver su comentario histórico sobre
// StrictMode/useDevFlag).
export function useMenuDropdown() {
  const [menuAbierto, setMenuAbierto] = useState<MenuId | null>(null)
  const navRef = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()

  const pathnameAnterior = useRef(pathname)
  useEffect(() => {
    if (pathnameAnterior.current === pathname) return
    pathnameAnterior.current = pathname
    setMenuAbierto(null)
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

  return { menuAbierto, setMenuAbierto, toggle, navRef }
}
