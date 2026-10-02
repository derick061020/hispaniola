import { useEffect, useState, type MouseEvent } from 'react'
import { t } from '@/lib/i18n'

// Barra inferior fija de /tours-and-events en móvil — el índice de la página.
//
// [2026-10-02, Samuel, pedido de marketing: «en móvil, si bien se tienen que
// mostrar los dos siempre al mismo tiempo (arriba tours y abajo eventos), sí
// debería tener un menú fijo abajo que se vea en cuál estoy … le doy tap y me
// lleva rápidamente a la sección»]
//
// NO son pestañas: las dos secciones están siempre pintadas, una debajo de la
// otra, y esto solo dice dónde estás y te lleva a la otra. Por eso es un
// <nav> con dos enlaces de ancla y `aria-current`, no un `role="tablist"` —
// un lector de pantalla anunciaría pestañas que no esconden nada.
//
// Mismo idioma que las otras barras fijas de móvil (barra-movil-ficha.tsx, el
// CTA sticky de home/hero.tsx): bg-papel + border-t hairline + el
// `pb-[max(...,env(safe-area-inset-bottom))]` que la saca de la franja del
// gesto de inicio del iPhone. Dentro, un segmentado de dos mitades: el activo
// en navy lleno, el otro en texto secundario. Sin aqua — no es un acento, es
// navegación.
//
// `md:hidden`: desde tablet las dos rejillas caben a la vista con poco scroll
// y el NavFlotante ya ocupa ese papel. El hueco que deja abajo lo reserva la
// página (pages/tours-y-eventos.tsx), al mismo breakpoint.

type Seccion = { id: string; etiqueta: string; total: number }

export function BarraSeccionesMovil({ secciones }: { secciones: Seccion[] }) {
  const [activa, setActiva] = useState(secciones[0]?.id)
  // Las etiquetas cambian con el idioma y el array se crea en cada render;
  // los ids no. El observador depende solo de ellos, o se rehacía en cada
  // render de la página.
  const ids = secciones.map((s) => s.id).join(' ')

  // Cuál está «en pantalla»: la sección que cruza la línea del 45 % del alto.
  // Una línea y no un umbral de visibilidad: con dos secciones de alto muy
  // distinto (cuatro tours contra tres eventos), un `threshold` dejaría
  // tramos en los que ninguna llega al porcentaje, o las dos a la vez.
  // Por encima de la primera (el hero) sigue marcada la primera, que es la
  // que viene; por debajo de la última (el footer), la última.
  useEffect(() => {
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (entrada.isIntersecting) setActiva(entrada.target.id)
        }
      },
      { rootMargin: '-45% 0px -55% 0px' },
    )
    for (const id of ids.split(' ')) {
      const el = document.getElementById(id)
      if (el) observador.observe(el)
    }
    return () => observador.disconnect()
  }, [ids])

  // Scroll suave a mano, y no el salto nativo del ancla: el `href` se queda
  // para que el enlace sea un enlace de verdad (se puede copiar, abrir en
  // otra pestaña, y `/tours-and-events#events` funciona entrando en frío vía
  // ScrollAlNavegar). `replaceState` actualiza la URL sin apilar una entrada
  // de historial por cada tap — «atrás» tiene que sacarte de la página, no
  // devolverte a la sección anterior.
  const ir = (evento: MouseEvent<HTMLAnchorElement>, id: string) => {
    const destino = document.getElementById(id)
    if (!destino) return
    evento.preventDefault()
    const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    destino.scrollIntoView({ behavior: reducir ? 'auto' : 'smooth', block: 'start' })
    window.history.replaceState(window.history.state, '', `#${id}`)
    setActiva(id)
  }

  return (
    <nav
      aria-label={t('Page sections')}
      className="fixed inset-x-0 bottom-0 z-30 border-t border-linea bg-papel px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-card md:hidden"
    >
      <ul className="grid grid-cols-2 gap-1 rounded-chip bg-papel-hueso p-1">
        {secciones.map(({ id, etiqueta, total }) => {
          const esActiva = id === activa
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={(e) => ir(e, id)}
                aria-current={esActiva ? 'true' : undefined}
                className={`flex h-11 items-center justify-center gap-2 rounded-chip text-sm font-semibold transition-colors duration-200 motion-reduce:transition-none ${
                  esActiva ? 'bg-navy text-white' : 'text-navy-sub'
                }`}
              >
                {etiqueta}
                {/* El número es pista, no contenido: cuántas cards hay en
                    cada lado. Oculto al lector de pantalla para que el
                    enlace se anuncie «Tours» y no «Tours 4». */}
                <span aria-hidden="true" className={`text-xs font-medium ${esActiva ? 'text-white/70' : 'text-navy-soft'}`}>
                  {total}
                </span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
