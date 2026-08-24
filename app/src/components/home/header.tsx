import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { Boton } from '@/components/ui/boton'
import { MenuMovil } from './menu-movil'
import { TabsConPaneles } from './nav-tabs'
import { useMenuDropdown } from '@/lib/use-menu-dropdown'
import { useDevFlag } from '@/dev/use-dev-flag'

// [v2 2026-07-27] 'sostenibilidad' entra como tab propio del nav principal
// (correcciones v2, plan 02 §1 — el cliente dictó el menú en la reunión del
// 07-24). Con esto el nav pasa de 5 a 6 entradas.
export type MenuId = 'tours' | 'eventos' | 'nosotros' | 'sostenibilidad' | 'ayuda'

// v3: el header vive DENTRO del box del hero (app/PLAN-v3.md §4), así que
// necesita una variante transparente sobre el video. 'solida' (default) es
// la barra opaca de siempre (única usuaria: no-encontrado.tsx, la 404 —
// necesita su propio nav completo porque no tiene hero ni NavFlotante); NO
// se toca en este cambio. 'sobreVideo' quita el fondo blanco/sticky y pasa
// el texto a blanco para leerse sobre el video del hero.
//
// 2026-07-21 (pedido de Samuel): 'sobreVideo' pierde los TABS de escritorio
// (antes un notch cortado en el bisel del hero) — ese trabajo lo hace ahora,
// site-wide, un solo componente flotante y fijo (nav-flotante.tsx, "vidrio"
// oscuro, visible desde que carga la página). Logo y CTA «Reservar» SÍ
// siguen aquí, en desktop también — viven en flujo normal (NO fijos: se van
// con el scroll junto con el resto del hero), a diferencia de los tabs.
// Cuando el usuario scrollea y este logo sale de vista, NavFlotante funde su
// propia versión compacta (logo + Reservar) dentro del panel de tabs — ver
// el comentario de nav-flotante.tsx. Por eso el logo lleva `id="logo-hero"`
// solo en esta variante: es el sentinel que ese observer usa para saberlo.
export function Header({
  variante = 'solida',
  // [2026-08-24, barrido de enlaces] EL DEFAULT ERA `#tours`, Y ERA UNA
  // TRAMPA: un ancla suelta solo resuelve en la home, asi que cualquier pagina
  // que se olvidara de pasar `ctaHref` heredaba un «Book now» muerto. Le paso
  // exactamente eso a la 404. Ahora el default es el destino que vale desde
  // CUALQUIER pagina —el que ya pasan las 18 internas— y la home, que es el
  // unico sitio donde el ancla suelta es lo correcto, lo pasa explicito
  // (components/home/hero.tsx).
  ctaHref = '/#tours',
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

  return (
    <header className={sobreVideo ? '' : 'sticky top-0 z-40 bg-papel'}>
      {/* Topbar (WhatsApp + teléfono + idioma) vive aparte, FUERA de este
          Header y de la caja del hero — ver components/home/topbar.tsx,
          montado en App.tsx antes de cada página.
          px-5 sm:px-10 (no solo px-5): mismo padding lateral que usa
          CUALQUIER OTRO contenedor max-w-contenido del sitio (Topbar,
          hero-interna.tsx, footer, todas las páginas internas) — sin el
          sm:px-10, el logo/nav de aquí quedaba más pegado al borde que el
          resto del contenido debajo, desalineado con el Topbar que vive
          justo encima (detectado visualmente por Samuel). */}
      <div
        className={`relative mx-auto flex max-w-contenido items-center justify-between px-5 py-3 sm:px-10 ${sobreVideo ? '' : 'border-b border-linea'}`}
        ref={navRef}
      >
        {/* El logo lleva a la home. Mientras el sitio era una sola página no
            hacía falta y era un <img> suelto; desde que existe la ficha, es la
            salida universal a casa y su ausencia se nota (verificado en el
            flujo de QA: era el único paso que no navegaba).
            id="logo-hero" SOLO en 'sobreVideo': sentinel de NavFlotante (ver
            su comentario) — cuando este logo sale de vista, NavFlotante funde
            su propia versión compacta dentro del panel de tabs. 'solida' no
            lo necesita (no tiene NavFlotante propio, la 404 es autónoma). */}
        <Link to="/" aria-label="Hispaniola Aquatic Adventures, home" id={sobreVideo ? 'logo-hero' : undefined}>
          {/* `entrada`: la animación completa del logo al cargar la página
              ([2026-08-21] pedido de Samuel). Solo la dispara Header, y Logo
              se encarga de que suene UNA vez por carga y no en cada
              navegación — Header se remonta al cambiar de ruta. */}
          <Logo sobreOscuro={sobreVideo} entrada />
        </Link>

        {/* 2026-07-21: los TABS de escritorio de 'sobreVideo' (antes un
            NotchMenu cortado en el bisel del hero) se retiran — NavFlotante
            (App.tsx) los reemplaza, site-wide y ya visible desde que carga la
            página. Logo y CTA (a los lados) SÍ se quedan aquí — ver más
            abajo. 'solida' no cambia. */}
        {sobreVideo ? null : (
          <nav className="hidden items-center gap-1 md:flex">
            <TabsConPaneles menuAbierto={menuAbierto} toggle={toggle} />
          </nav>
        )}

        <div className="flex items-center gap-2">
          {/* CTA de escritorio: se queda en 'sobreVideo' también (a
              diferencia de los tabs) — vive en flujo normal, no fijo, así que
              se va con el scroll. NavFlotante funde su propia versión
              compacta cuando este boton sale de vista junto con el logo (ver
              nav-flotante.tsx). 'solida' no cambia: sigue visible desde sm. */}
          <span className="hidden sm:inline-flex">
            <Boton href={ctaHref}>Book now</Boton>
          </span>
          <button
            type="button"
            onClick={() => setMovilAbierto(true)}
            aria-label="Menu"
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
