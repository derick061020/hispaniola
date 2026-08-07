import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import * as Accordion from '@/components/alignui/accordion'
import { Etiqueta } from '@/components/ui/etiqueta'
import { FAQ_CATEGORIAS } from '@/data/faq'

gsap.registerPlugin(Flip)

// 6 categorías, cada una su propio Accordion (AlignUI) independiente — mismo
// vendor/chrome que home/faq.tsx y tour/faq-tour.tsx, aquí con las 14
// preguntas completas agrupadas por categoría en vez de una curaduría plana.
//
// CORRECCIONES v1 DEL CLIENTE (2026-07-20, planes/08-faq.md): la maqueta
// muestra CHIPS DE FILTRO sobre las categorías (Todos · Reservas y pagos ·
// Antes del tour · A bordo · Comida · Clima y cancelaciones · Niños y
// accesibilidad) agrupadas en 2 COLUMNAS. El contenido ya coincidía con lo
// que hay — lo que faltaba era el filtrado y el layout en columnas.
//
// El filtro es client-side y NO oculta contenido de forma destructiva: con
// «Todos» (por defecto) se ven las 6 categorías como siempre, así que quien
// llegue con un enlace directo a #comida sigue encontrando su ancla. Al
// elegir una categoría concreta se muestra solo esa (a ancho completo:
// `lg:col-span-2` cuando solo queda una).
//
// FILTRADO CON GSAP FLIP (2026-07-22, pedido de Samuel: mismo efecto que
// demos.gsap.com/demo/flexbox-filtering). El patrón FLIP no puede envolver
// el cambio de estado de React (el DOM ya cambió cuando un efecto normal se
// entera) — por eso `elegir()` captura `Flip.getState` de los bloques
// SÍNCRONAMENTE, en el propio click, ANTES de `setActiva`; el
// useLayoutEffect siguiente (tras el commit, con el DOM ya actualizado) hace
// `Flip.from(ese estado)`. Los bloques que quedan se reacomodan en vez de
// saltar a su nueva celda del grid; los que salen del filtro reciben un
// clon temporal (lo crea Flip solo) que se desvanece en `onLeave`; los que
// entran hacen fade+scale-in en `onEnter`.
//
// SIN `scale: true`: con `scale` GSAP escala el bloque entero (ancho y alto
// por separado) en vez de animar el tamaño real — con texto de por medio eso
// se ve estirado/aplastado mientras dura la transición (probado 2026-07-22,
// pedido de Samuel de quitarlo). Se descartó porque acá no hace falta el
// trade-off: las preguntas son de una sola línea y no cambian de salto de
// línea entre la columna angosta y el ancho completo, así que animar el
// ancho/alto REAL no causa el reflow-jank que `scale` evita en otros casos
// (grids de imágenes, texto largo que sí re-envuelve).
//
// ALTO DEL CONTENEDOR: el grid en sí no lo anima nadie — si de 6 categorías
// pasas a 1, los 5 bloques que se van dejan de contar para el alto del grid
// EN CUANTO Flip los saca del flujo (position:absolute), así que el
// contenedor colapsaría de golpe a la mitad de la animación en vez de
// encogerse/crecer junto con los bloques. Por eso se congela el alto ANTES
// (con el valor medido en el click, `alturaAntesRef`) y se anima en
// paralelo hacia el alto nuevo (medido ya con el DOM filtrado, antes de que
// Flip mueva nada) — mismo timing que el propio Flip, para que el
// contenedor y los bloques lleguen juntos.
export function CategoriasFaq() {
  const [activa, setActiva] = useState<string | null>(null)
  const contenedorRef = useRef<HTMLDivElement>(null)
  const flipEstadoRef = useRef<Flip.FlipState | null>(null)
  const alturaAntesRef = useRef<number | null>(null)

  const visibles = activa ? FAQ_CATEGORIAS.filter((c) => c.id === activa) : FAQ_CATEGORIAS

  function elegir(id: string | null) {
    if (contenedorRef.current) {
      flipEstadoRef.current = Flip.getState(contenedorRef.current.querySelectorAll<HTMLElement>('.faq-categoria'))
      alturaAntesRef.current = contenedorRef.current.getBoundingClientRect().height
    }
    setActiva(id)
  }

  useLayoutEffect(() => {
    const estado = flipEstadoRef.current
    const contenedor = contenedorRef.current
    const alturaAntes = alturaAntesRef.current
    if (!estado || !contenedor) return
    flipEstadoRef.current = null
    alturaAntesRef.current = null

    // Sin animación: solo el reacomodo instantáneo del filtro, que ya hace
    // React por su cuenta.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const DURACION = 0.45

    // Medir el alto NUEVO (natural, con el DOM ya filtrado) ANTES de que Flip
    // toque nada — es el único momento en que el grid está en flujo normal
    // sin que nuestro propio congelado de altura lo distorsione.
    const alturaDespues = contenedor.getBoundingClientRect().height

    // Flip.from() mide el rect ACTUAL de cada bloque en este mismo instante
    // para saber a dónde animar — tiene que correr con el contenedor todavía
    // en su alto natural. Si el alto del contenedor se fuerza ANTES de esto
    // (como pasaba en el primer intento), el grid con más alto del que le
    // corresponde estira la celda del bloque sobreviviente (align-items:
    // stretch) y Flip mide un rect ya deformado — eso era el "bugueado".
    Flip.from(estado, {
      // `targets`: el estado capturado en el click solo tiene los bloques
      // que ESTABAN visibles ANTES (p. ej. 1 sola categoría, filtrando desde
      // ahí). Sin este selector, Flip.from solo anima esos — las categorías
      // que vuelven a aparecer (van de 1 a 6) no están en el estado viejo,
      // así que Flip nunca se entera de que "entraron" y aparecen de golpe,
      // sin fade-in, mientras la única que sí conocía se mueve sola. Con
      // `targets` apuntando al set ACTUAL completo, Flip compara viejo vs.
      // nuevo y clasifica bien qué entra y qué sale en los dos sentidos.
      targets: contenedor.querySelectorAll<HTMLElement>('.faq-categoria'),
      duration: DURACION,
      ease: 'power2.inOut',
      absolute: true,
      onEnter: (els) =>
        gsap.fromTo(els, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.3, delay: 0.12 }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.94, duration: 0.22 }),
    })

    // Recién ahora Flip ya sacó del flujo a los bloques que se mueven
    // (position:absolute) — el grid, sin hijos en flujo, colapsaría de
    // golpe. Se congela su alto ANTERIOR y se anima en paralelo hacia el
    // nuevo, mismo timing que el propio Flip, para que lleguen juntos.
    if (alturaAntes != null) {
      gsap.fromTo(
        contenedor,
        { height: alturaAntes, overflow: 'hidden' },
        {
          height: alturaDespues,
          duration: DURACION,
          ease: 'power2.inOut',
          onComplete: () => gsap.set(contenedor, { height: 'auto', overflow: '' }),
        },
      )
    }
  }, [activa])

  return (
    <div>
      {/* Chips de filtro. `null` = «Todos». Son botones y no enlaces: no
          cambian la URL ni la posición del scroll, solo lo que se pinta. */}
      <div
        role="group"
        aria-label="Filter questions by category"
        className="flex flex-wrap justify-center gap-2"
      >
        {[{ id: null, nombre: 'All' }, ...FAQ_CATEGORIAS.map((c) => ({ id: c.id, nombre: c.nombre }))].map(
          (chip) => {
            const seleccionado = activa === chip.id
            return (
              <button
                key={chip.id ?? 'todos'}
                type="button"
                onClick={() => elegir(chip.id)}
                aria-pressed={seleccionado}
                className={`rounded-chip px-4 py-2 text-sm font-medium transition-colors ${
                  seleccionado
                    ? 'bg-navy text-white'
                    : 'bg-papel text-navy-sub ring-1 ring-linea hover:bg-papel-hueso'
                }`}
              >
                {chip.nombre}
              </button>
            )
          },
        )}
      </div>

      <div ref={contenedorRef} className="mt-10 grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-2">
        {visibles.map((cat) => (
          <section
            key={cat.id}
            id={cat.id}
            className={`faq-categoria scroll-mt-header-alto ${visibles.length === 1 ? 'lg:col-span-2' : ''}`}
          >
            <Etiqueta>{cat.nombre}</Etiqueta>
            <Accordion.Root type="single" collapsible className="mt-4 flex flex-col gap-3">
              {cat.preguntas.map((item, i) => (
                <Accordion.Item key={item.p} value={`${cat.id}-${i}`}>
                  <Accordion.Header>
                    <Accordion.Trigger>
                      {item.p}
                      <Accordion.Arrow className="justify-self-end" />
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content>{item.r}</Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </section>
        ))}
      </div>
    </div>
  )
}
