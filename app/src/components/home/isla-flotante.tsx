import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Logo } from '@/components/ui/logo'
import { Boton } from '@/components/ui/boton'
import { NotchMenu } from './notch-menu'
import { TabsPrincipales } from './nav-tabs'
import { useMenuDropdown } from '@/lib/use-menu-dropdown'
import { useDevFlag } from '@/dev/use-dev-flag'
import type { MenuId } from './header'

// Isla flotante (2026-07-17, pedido de Samuel) — nav fijo que aparece al
// pasar el hero. NO es el header de siempre vuelto `position: fixed`: a
// ancho completo, sobre el contenido de cada sección, no habría quedado
// bien (feedback explícito de Samuel al plantear la tarea). En su lugar, un
// cluster COMPACTO tipo Dynamic Island — 2 chips flotantes, centrados, cada
// uno shrink-to-fit — que NO abarca el ancho completo porque no le hace
// falta: (1) logo + tabs FUNDIDOS en una sola píldora (el logo vive DENTRO
// del NotchMenu, primer ítem de su fila de tabs — 2ª vuelta, Samuel: "que no
// haya un div solo con el logo flotando"; usa <Logo compacto />, más chico
// que el del header normal, para no dominar la fila de 36px de los botones
// de tab) y (2) Reservar, separado.
//
// Reservar tiene que IGUALAR el alto en reposo de la píldora de logo+tabs
// (Boton tamaño="sm": py-4, medido para calzar los 52px de la píldora) Y no
// moverse ni un píxel cuando esa píldora se EXPANDE hacia abajo al abrir un
// tab (NotchMenu anima su propio alto vía --notch-alto). Por eso el
// contenedor de abajo lleva `items-start`: el default de flex es `stretch`,
// que habría estirado a Reservar (y antes, al chip del logo) a la altura de
// la píldora expandida — exactamente el bug que Samuel reportó.
//
// Vive en App.tsx, fuera de cada página: su aparición es comportamiento del
// SHELL (como ScrollAlNavegar), no de una sección de una página en concreto.
//
// Solo desktop (md:): en móvil ya hay CTA sticky al pie (hero.tsx) + hoja de
// menú (MenuMovil) — una 2ª isla ahí competiría por la misma franja que el
// pulgar necesita para scrollear.
//
// NO aparece en:
//   - /tours/:slug: esa página ya tiene su propio chrome fijo
//     (AnclasFicha, pegado a top-0, con --spacing-sticky-top calculado
//     asumiendo que ese es el ÚNICO elemento fijo — ver tokens.css). Dos
//     navs fijos ahí competirían por la misma franja superior.
//   - /reservar/:slug/gracias y /mi-reserva (2026-07-17, pedido de Samuel):
//     pantallas de "ya pagaste, gestiona tu reserva" — un nav compacto
//     flotando encima invita a salirse en mitad de algo que NO es navegación.
//     El header local con Logo de cada página sigue siendo el ancla. Aunque
//     estas páginas no tienen hero (no activan el sentinel), la exclusión
//     es defensiva por si `?dev-isla=abierta` la forzara a aparecer.
//
// Sí aparece en /eventos/:slug: esas landings hoy NO tienen ningún chrome
// fijo («por eso no lleva barra móvil ni sticky», ver evento.tsx) — la
// isla es pura ganancia ahí, no un 2º nav que reconciliar.
export function IslaFlotante() {
  const { pathname } = useLocation()
  const [pasoElHero, setPasoElHero] = useState(false)
  const [forzarVisible, setForzarVisible] = useState(false)
  const { menuAbierto, setMenuAbierto, toggle, navRef } = useMenuDropdown()

  // [dev-mode] ?dev-isla=abierta fuerza la isla visible sin depender del
  // scroll → frame limpio para Figma. ?dev-isla=tours (o eventos/nosotros/
  // ayuda) además abre ese tab, para capturar el panel expandido.
  useDevFlag('dev-isla', (v) => {
    setForzarVisible(true)
    if (v !== 'abierta') setMenuAbierto(v as MenuId)
  })

  // Sentinel = el hero de la página actual (home/hero.tsx y
  // internas/hero-interna.tsx comparten el mismo id="hero"). Se re-observa
  // en cada cambio de ruta porque cada página monta su PROPIO hero.
  useEffect(() => {
    const hero = document.getElementById('hero')
    if (!hero) return
    const observer = new IntersectionObserver(([entrada]) => setPasoElHero(!entrada.isIntersecting), {
      rootMargin: '-1px 0px 0px 0px',
    })
    observer.observe(hero)
    return () => observer.disconnect()
  }, [pathname])

  const visible = forzarVisible || pasoElHero

  if (
    pathname.startsWith('/tours/') ||
    pathname.startsWith('/reservar/') ||
    pathname === '/mi-reserva'
  )
    return null

  return (
    <div
      aria-hidden={!visible}
      inert={!visible}
      className={`pointer-events-none fixed inset-x-0 top-4 z-50 hidden items-start justify-center gap-2 transition-all duration-300 md:flex ${
        visible ? 'translate-y-0 opacity-100' : '-translate-y-6 opacity-0'
      }`}
    >
      <div ref={navRef} className="pointer-events-auto">
        <NotchMenu
          flotante
          abierto={menuAbierto}
          tabs={
            <>
              <Link
                to="/"
                aria-label="Hispaniola Aquatic Adventures — inicio"
                className="mr-1 flex items-center"
              >
                <Logo compacto />
              </Link>
              <TabsPrincipales menuAbierto={menuAbierto} toggle={toggle} />
            </>
          }
        />
      </div>

      <Boton to="/#tours" tamaño="sm" className="pointer-events-auto">
        Reservar
      </Boton>
    </div>
  )
}
