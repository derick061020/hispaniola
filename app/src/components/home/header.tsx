import { useEffect, useRef, useState } from 'react'
import { Menu, MessageCircle } from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { Boton } from '@/components/ui/boton'
import { EnlacePrototipo } from '@/components/ui/enlace-prototipo'
import { MegaTours } from './mega-tours'
import { MegaEventos } from './mega-eventos'
import { MenuMovil } from './menu-movil'
import { useDevFlag } from '@/dev/use-dev-flag'

type MenuId = 'tours' | 'eventos' | 'nosotros' | 'ayuda'

export function Header() {
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

  return (
    <header className="sticky top-0 z-40 bg-papel">
      <div className="flex items-center justify-between bg-navy px-5 py-1.5 text-xs text-white">
        <a href="https://wa.me/18293052804" target="_blank" rel="noopener" className="flex items-center gap-1.5 hover:text-aqua">
          <MessageCircle className="size-3.5" />
          WhatsApp +1 829 305 2804
        </a>
        <div className="hidden items-center gap-1.5 sm:flex">
          <span className="font-semibold text-white">ES</span>
          <span className="text-white/40">·</span>
          <span className="text-white/60">EN</span>
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-linea px-5 py-3" ref={navRef}>
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          <div className="relative">
            <button
              type="button"
              onClick={() => toggle('tours')}
              className={`rounded-lg px-3 py-2 text-sm font-medium text-navy transition-colors hover:bg-papel-hueso ${menuAbierto === 'tours' ? 'bg-papel-hueso' : ''}`}
            >
              Tours ▾
            </button>
            {menuAbierto === 'tours' ? (
              <div className="absolute left-0 top-full mt-2 rounded-card bg-papel shadow-card ring-1 ring-linea">
                <MegaTours />
              </div>
            ) : null}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => toggle('eventos')}
              className={`rounded-lg px-3 py-2 text-sm font-medium text-navy transition-colors hover:bg-papel-hueso ${menuAbierto === 'eventos' ? 'bg-papel-hueso' : ''}`}
            >
              Eventos ▾
            </button>
            {menuAbierto === 'eventos' ? (
              <div className="absolute left-0 top-full mt-2 rounded-card bg-papel shadow-card ring-1 ring-linea">
                <MegaEventos />
              </div>
            ) : null}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => toggle('nosotros')}
              className={`rounded-lg px-3 py-2 text-sm font-medium text-navy transition-colors hover:bg-papel-hueso ${menuAbierto === 'nosotros' ? 'bg-papel-hueso' : ''}`}
            >
              Nosotros ▾
            </button>
            {menuAbierto === 'nosotros' ? (
              <div className="absolute left-0 top-full mt-2 flex w-60 flex-col gap-0.5 rounded-card bg-papel p-2 shadow-card ring-1 ring-linea">
                <EnlacePrototipo className="rounded-lg px-3 py-2 text-sm font-medium text-navy hover:bg-papel-hueso">
                  La tripulación y la flota
                </EnlacePrototipo>
                <EnlacePrototipo className="rounded-lg px-3 py-2 text-sm font-medium text-navy hover:bg-papel-hueso">
                  El arrecife que reconstruimos
                </EnlacePrototipo>
              </div>
            ) : null}
          </div>

          <EnlacePrototipo className="rounded-lg px-3 py-2 text-sm font-medium text-navy hover:bg-papel-hueso">
            Guías
          </EnlacePrototipo>

          <div className="relative">
            <button
              type="button"
              onClick={() => toggle('ayuda')}
              className={`rounded-lg px-3 py-2 text-sm font-medium text-navy transition-colors hover:bg-papel-hueso ${menuAbierto === 'ayuda' ? 'bg-papel-hueso' : ''}`}
            >
              Ayuda ▾
            </button>
            {menuAbierto === 'ayuda' ? (
              <div className="absolute right-0 top-full mt-2 flex w-56 flex-col gap-0.5 rounded-card bg-papel p-2 shadow-card ring-1 ring-linea">
                <EnlacePrototipo className="rounded-lg px-3 py-2 text-sm font-medium text-navy hover:bg-papel-hueso">
                  Preguntas frecuentes
                </EnlacePrototipo>
                <a href="https://wa.me/18293052804" target="_blank" rel="noopener" className="rounded-lg px-3 py-2 text-sm font-medium text-navy hover:bg-papel-hueso">
                  Contacto y WhatsApp
                </a>
                <EnlacePrototipo className="rounded-lg px-3 py-2 text-sm font-medium text-navy hover:bg-papel-hueso">
                  Gestionar mi reserva
                </EnlacePrototipo>
              </div>
            ) : null}
          </div>
        </nav>

        <div className="flex items-center gap-2">
          <Boton href="#tours" className="hidden sm:inline-flex">
            Reservar
          </Boton>
          <button
            type="button"
            onClick={() => setMovilAbierto(true)}
            aria-label="Menú"
            className="grid size-10 place-items-center rounded-lg text-navy hover:bg-papel-hueso md:hidden"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </div>

      <MenuMovil abierto={movilAbierto} onCerrar={() => setMovilAbierto(false)} />
    </header>
  )
}
