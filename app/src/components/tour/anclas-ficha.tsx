import type { Tour } from '@/data/home'

// Nav de anclas de la ficha (wireframe A2). La ficha es larga y el visitante
// no llega con la misma pregunta: unos quieren la hora de recogida, otros el
// menú. Esto es el índice.
//
// Sticky JUSTO bajo el header (top = --spacing-header-alto, sin aire: es una
// barra que se apoya en otra, no un objeto flotando). El widget se pega más
// abajo, con --spacing-sticky-top, que ya cuenta con esta fila. Los tres
// offsets salen del mismo token — Trampa №5: tres números sueltos se
// desincronizan a la primera.
//
// El ancla «Menú» solo existe en 'completo' (charter cotiza su menú a medida,
// Saona no tiene paquetes): un índice que apunta a una sección inexistente es
// peor que no tener índice.
//
// Sin estado activo por sección visible (resaltar dónde estás): es un
// IntersectionObserver y una decisión visual, no un olvido — decisión abierta
// §13.8, si Samuel lo pide al verlo.
//
// Etapa A (PLAN-ALIGNUI.md): el inventario proponía TabMenuHorizontal aquí y
// se DESCARTÓ mirándolo de cerca — es Radix Tabs, y un tablist sin tabpanels
// miente a los lectores de pantalla (esto es una nav de anclas, no un
// conmutador de vistas). Sin estado activo (§13.8) tampoco hay indicador que
// ganar: el look ya coincide con el del sistema (label-sm/medium). Si algún
// día entra el scroll-spy, se revisa — con nav+aria-current, no con Tabs.

export function AnclasFicha({ tour }: { tour: Tour }) {
  // El salto va suave, pero con `scrollIntoView` y NO con
  // `html { scroll-behavior: smooth }`: ese es global y cambiaría también los
  // anclas de la home (#tours del hero y del header), que esta fase no toca.
  // `scroll-margin-top` (scroll-mt-sticky-top en cada sección) lo respeta
  // igual, así que el título no queda debajo del chrome sticky.
  const irA = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const destino = document.getElementById(id)
    if (!destino) return
    e.preventDefault()
    const suave = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    destino.scrollIntoView({ behavior: suave ? 'smooth' : 'auto' })
  }

  const anclas = [
    { id: 'ancla-itinerario', label: 'Itinerario' },
    { id: 'ancla-incluye', label: 'Incluye' },
    ...(tour.booking === 'completo' ? [{ id: 'ancla-menu', label: 'Menú' }] : []),
    { id: 'ancla-opiniones', label: 'Opiniones' },
    { id: 'ancla-faq', label: 'FAQ' },
  ]

  return (
    <nav
      aria-label="Secciones de esta página"
      className="sticky top-header-alto z-30 hidden border-b border-linea bg-papel/90 backdrop-blur-sm md:block"
    >
      <div className="mx-auto flex max-w-contenido gap-1 px-5 sm:px-10">
        {anclas.map((a) => (
          <a
            key={a.id}
            href={`#${a.id}`}
            onClick={(e) => irA(e, a.id)}
            className="rounded-lg px-3 py-3.5 text-sm font-medium text-navy-sub transition-colors hover:bg-papel-hueso hover:text-navy"
          >
            {a.label}
          </a>
        ))}
      </div>
    </nav>
  )
}
