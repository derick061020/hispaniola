import { useEffect, useRef, useState } from 'react'
import { Menu } from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { Boton } from '@/components/ui/boton'
import { EnlacePrototipo } from '@/components/ui/enlace-prototipo'
import { MegaTours } from './mega-tours'
import { MegaEventos } from './mega-eventos'
import { MenuMovil } from './menu-movil'
import { useDevFlag } from '@/dev/use-dev-flag'

type MenuId = 'tours' | 'eventos' | 'nosotros' | 'ayuda'

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
  // Los paneles de megamenú/dropdown NUNCA cambian: son cards bg-papel con
  // sombra sobre cualquier fondo (foto, video o página sólida) — es el mismo
  // componente que viajará a Figma.
  const claseLink = sobreVideo
    ? 'rounded-lg px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10'
    : 'rounded-lg px-3 py-2 text-sm font-medium text-navy transition-colors hover:bg-papel-hueso'
  const claseLinkAbierto = sobreVideo ? 'bg-white/15' : 'bg-papel-hueso'

  return (
    <header className={sobreVideo ? '' : 'sticky top-0 z-40 bg-papel'}>
      {/* Topbar (WhatsApp + idioma) retirada — vuelve como botones flotantes
          (pendiente, ver conversación 2026-07-14). */}
      <div
        className={`flex items-center justify-between px-5 py-3 ${sobreVideo ? '' : 'border-b border-linea'}`}
        ref={navRef}
      >
        <Logo sobreOscuro={sobreVideo} />

        <nav className="hidden items-center gap-1 md:flex">
          <div className="relative">
            <button
              type="button"
              onClick={() => toggle('tours')}
              className={`${claseLink} ${menuAbierto === 'tours' ? claseLinkAbierto : ''}`}
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
              className={`${claseLink} ${menuAbierto === 'eventos' ? claseLinkAbierto : ''}`}
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
              className={`${claseLink} ${menuAbierto === 'nosotros' ? claseLinkAbierto : ''}`}
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

          <EnlacePrototipo className={claseLink}>Guías</EnlacePrototipo>

          <div className="relative">
            <button
              type="button"
              onClick={() => toggle('ayuda')}
              className={`${claseLink} ${menuAbierto === 'ayuda' ? claseLinkAbierto : ''}`}
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
