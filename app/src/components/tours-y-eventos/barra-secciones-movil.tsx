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
// ── EL DISEÑO: UN SWITCHER FLOTANTE ──────────────────────────────────────
// [2026-10-02, 2ª vuelta, Samuel: «el menú fijo de abajo no me gusta, quiero
// que sea tipo un button switcher selector, donde el background activo se
// mueve hacia tours o eventos; que el div no toque a sangre sino que esté
// como flotando, con opacidad y backdrop blur, y fondo negro pero
// transparente»]
//
// La 1ª vuelta copiaba las otras barras fijas de móvil (barra-movil-ficha,
// el CTA sticky de la home): papel blanco a sangre con border-t, y el activo
// pintado en navy de golpe. Se leía como una barra de checkout, no como un
// selector. Ahora:
//
//  · FLOTA: centrada, con aire a los lados y abajo, sin tocar los bordes. El
//    `bottom-[max(1rem,env(safe-area-inset-bottom))]` la sube por encima del
//    gesto de inicio del iPhone (mismo motivo que el `pb-[max(...)]` de las
//    otras barras, ahora como distancia en vez de relleno).
//  · VIDRIO OSCURO: la misma receta que la píldora del NavFlotante en su
//    variante oscura — `--color-vidrio-oscuro` (negro al 62 %),
//    `--blur-vidrio` + `--saturate-vidrio` y el canto más claro que la cara
//    (`--color-vidrio-oscuro-borde`). Dos piezas de navegación flotante, una
//    sola familia de vidrio; ningún color nuevo.
//  · LA PASTILLA SE DESLIZA: un solo fondo blanco (`bg-papel`) absoluto
//    detrás de las dos opciones, que se traslada con `transform` — no dos
//    fondos que se encienden y apagan. `translateX(n × 100%)` sobre su propio
//    ancho (una celda): funciona igual con dos secciones que con tres. Con
//    `prefers-reduced-motion` salta sin animar.
//
// Sin aqua — no es un acento, es navegación.
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

  const indice = Math.max(
    0,
    secciones.findIndex((s) => s.id === activa),
  )

  return (
    // El <nav> es solo el carril a ancho completo que centra la píldora;
    // `pointer-events-none` para que sus laterales vacíos no se coman los
    // toques sobre las cards de debajo. La píldora los recupera.
    <nav
      aria-label={t('Page sections')}
      className="pointer-events-none fixed inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 flex justify-center px-4 md:hidden"
    >
      <ul
        className="pointer-events-auto relative grid w-full max-w-xs rounded-chip border border-vidrio-oscuro-borde bg-vidrio-oscuro p-1 shadow-card-flotante backdrop-blur-[var(--blur-vidrio)] backdrop-saturate-[var(--saturate-vidrio)]"
        style={{ gridTemplateColumns: `repeat(${secciones.length}, minmax(0, 1fr))` }}
      >
        {/* La pastilla que se desliza. Mide una celda (el ancho útil entre
            los `p-1` dividido por el número de secciones) y se traslada su
            propio ancho por cada posición. aria-hidden: el estado lo dice
            `aria-current` en el enlace, esto es solo la forma. */}
        <span
          aria-hidden="true"
          className="absolute inset-y-1 left-1 rounded-chip bg-papel shadow-card transition-transform duration-300 ease-[var(--notch-fondo-easing)] motion-reduce:transition-none"
          style={{
            width: `calc((100% - 0.5rem) / ${secciones.length})`,
            transform: `translateX(${indice * 100}%)`,
          }}
        />
        {secciones.map(({ id, etiqueta, total }) => {
          const esActiva = id === activa
          return (
            <li key={id} className="relative">
              <a
                href={`#${id}`}
                onClick={(e) => ir(e, id)}
                aria-current={esActiva ? 'true' : undefined}
                className={`flex h-11 items-center justify-center gap-2 rounded-chip text-sm font-semibold transition-colors duration-300 motion-reduce:transition-none ${
                  esActiva ? 'text-navy' : 'text-white/85'
                }`}
              >
                {etiqueta}
                {/* El número es pista, no contenido: cuántas cards hay en
                    cada lado. Oculto al lector de pantalla para que el
                    enlace se anuncie «Tours» y no «Tours 4». */}
                <span
                  aria-hidden="true"
                  className={`text-xs font-medium transition-colors duration-300 motion-reduce:transition-none ${
                    esActiva ? 'text-navy-soft' : 'text-white/60'
                  }`}
                >
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
