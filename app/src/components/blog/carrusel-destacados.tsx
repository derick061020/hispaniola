import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Articulo } from '@/data/blog'
import { CardDestacado } from './card-destacado'
import { t } from '@/lib/i18n'

// Carrusel de destacados del índice del blog (pedido de Samuel 2026-07-22):
// «un slider de al menos 4 cards... a los extremos se vea la card que viene y
// la que ya pasó, más pequeña e inactiva... la que viene se pone más grande
// y activa mientras la activa se pone para la izquierda e inactiva». Cada
// slide es la MISMA CardDestacado de siempre (mismo tamaño/estilo que ya
// tenía cuando era la única) — este componente solo la posiciona/escala
// alrededor, no la reimplementa.
//
// 2ª vuelta: el activo debía pesar EXACTO lo mismo que "el contenido normal
// de la web", no un % arbitrario de un contenedor ya angosto.
//
// 3ª vuelta (Samuel, con captura: "aun no se logra ver los slider hermanos en
// los extremos, siguen tapándose por un overflow hidden"). La ventana solo
// cancelaba el padding del ANCESTRO INMEDIATO — eso deja la ventana del MISMO
// ancho que el activo, sin margen de sobra para que un vecino asome. Arreglo:
// la ventana sangra hasta el borde real del VIEWPORT, MEDIDO en el DOM
// (`ancla`, un div normal sin margin tricks, mismo flujo que la rejilla/
// header) — no con 100vw/50vw (hero.tsx ya descartó esa técnica: con
// scrollbar clásica mide más que el viewport visible y mete overflow-x). De
// `ancla.getBoundingClientRect()` + `document.documentElement.clientWidth`
// (que sí excluye la scrollbar) sale todo: cuánto le falta a la ventana a
// cada lado para llegar al borde, cuánto mide el activo (= el ancho medido
// del ancla, ya exacto) y a qué posición local hay que llevarlo para que
// quede centrado donde el contenido normal empieza. Se re-mide en cada
// resize.
//
// 4ª vuelta (mismo día, Samuel: "hay que hacer que se puede draggear el
// slider y que haya flechas a los lados"). Dos piezas nuevas:
//
//   - FLECHAS: dos <button> absolutos DENTRO de `ancla` (no de la ventana
//     sangrada) — así quedan ancladas a los bordes de la COLUMNA DE
//     CONTENIDO (el ancho natural de `ancla`), justo pegadas al activo, no
//     perdidas en el borde del viewport.
//
//   - ARRASTRE: Pointer Events sobre la ventana. Mientras se arrastra, la
//     pista sigue al dedo/cursor 1:1 (sin transition — `arrastrando` se suma
//     a `sinTransicion` en un solo flag `sinAnim`); al soltar, si el
//     desplazamiento superó un umbral (proporcional al ancho del slide, con
//     tope) se avanza/retrocede un índice, si no vuelve a su sitio (con
//     transition, porque `arrastrando` ya se apagó). `arrastroRef` (un ref,
//     no state — no necesita re-render) recuerda si el gesto ACTUAL superó
//     un umbral mínimo de movimiento (no solo un tap); un onClickCapture en
//     la ventana cancela el click (preventDefault + stopPropagation, en fase
//     de captura, antes de que llegue al <Link> de la card) cuando sí hubo
//     arrastre — si no, soltar el dedo tras arrastrar TAMBIÉN navegaría a la
//     card de debajo, que no es la intención.
//
//   - LOOP BIDIRECCIONAL: con flechas ya se puede ir hacia atrás, así que el
//     truco de "pista duplicada 2x + salto invisible" (que solo cubría
//     avanzar) no basta — hace falta también poder retroceder desde el
//     primer slide sin que se note el salto. Pista TRIPLICADA; `index` vive
//     en reposo en el tramo [N, 2N-1] (la copia del medio). Al salir de ese
//     tramo por cualquier lado (± N), tras esperar a que la transition CSS
//     term ine, se salta SIN transition a la posición equivalente en la copia
//     del medio (sumando o restando N) — `normalizar()` hace ese ajuste
//     siempre relativo al tramo seguro, así que aguanta también clics
//     repetidos rápidos que empujen `index` más de un paso fuera de rango.
const GAP_REM = 1
const EASING = 'cubic-bezier(0.4, 0, 0.2, 1)'
// Por debajo de esto (px), un gesto de puntero es un tap/click, no un drag —
// evita que un temblor mínimo de la mano cancele el click de la card.
const UMBRAL_ARRASTRE_TAP = 5
// Tope del umbral que decide si un drag suelto avanza/retrocede — sin tope,
// en un slide muy ancho (desktop) haría falta arrastrar una barbaridad.
const UMBRAL_ARRASTRE_AVANCE_MAX = 120

// Lee un token de tiempo del :root (--x: 4s | 400ms) y lo devuelve en ms.
// Mismo helper que ui/carrusel-imagenes.tsx y home/reviews.tsx.
function leerMs(nombre: string, fallback: number): number {
  if (typeof window === 'undefined') return fallback
  const bruto = getComputedStyle(document.documentElement).getPropertyValue(nombre).trim()
  const n = parseFloat(bruto)
  if (Number.isNaN(n)) return fallback
  return bruto.endsWith('ms') ? n : n * 1000
}

type Medida = {
  marginLeft: number
  marginRight: number
  centro: number
  ancho: number
}

const MEDIDA_INICIAL: Medida = { marginLeft: 0, marginRight: 0, centro: 0, ancho: 0 }

export function CarruselDestacados({ articulos }: { articulos: Articulo[] }) {
  const N = articulos.length
  const [index, setIndex] = useState(N)
  const [sinTransicion, setSinTransicion] = useState(false)
  const [pausado, setPausado] = useState(false)
  const anclaRef = useRef<HTMLDivElement>(null)
  const [medida, setMedida] = useState<Medida>(MEDIDA_INICIAL)

  const arrastreInicioRef = useRef<number | null>(null)
  const arrastroRef = useRef(false)
  const [deltaArrastre, setDeltaArrastre] = useState(0)
  const [arrastrando, setArrastrando] = useState(false)

  // Mide el ancla (posición/ancho NATURALES, sin sangrar) al montar y en
  // cada resize — ver el porqué en el comentario de arriba.
  useLayoutEffect(() => {
    function medir() {
      const ancla = anclaRef.current
      if (!ancla) return
      const rect = ancla.getBoundingClientRect()
      const vw = document.documentElement.clientWidth
      setMedida({
        marginLeft: -rect.left,
        marginRight: -(vw - rect.right),
        centro: rect.left,
        ancho: rect.width,
      })
    }
    medir()
    window.addEventListener('resize', medir)
    return () => window.removeEventListener('resize', medir)
  }, [])

  // Auto-avance. Se detiene al pasar el puntero o al arrastrar (igual que
  // carrusel-imagenes/reviews) y no arranca con prefers-reduced-motion —
  // contenido en movimiento automático, WCAG 2.2.2.
  useEffect(() => {
    if (pausado || N <= 1) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ms = leerMs('--carrusel-destacados-intervalo', 6000)
    const id = window.setInterval(() => setIndex((i) => i + 1), ms)
    return () => window.clearInterval(id)
  }, [pausado, N])

  // Loop bidireccional invisible: en reposo `index` vive en [N, 2N-1] (la
  // copia del medio de la pista triplicada). Al salirse de ese tramo (± N,
  // por avanzar/retroceder desde el borde) esperamos a que la transition CSS
  // termine y saltamos SIN transition a la posición equivalente en la copia
  // del medio — el usuario nunca ve el salto porque las 3 copias son
  // visualmente idénticas. Doble rAF antes de reactivar la transition: un
  // solo rAF no basta para que React confirme el cambio antes de que la
  // transition vuelva a tomar el control.
  useEffect(() => {
    if (N === 0 || (index >= N && index <= 2 * N - 1)) return
    const transMs = leerMs('--carrusel-destacados-transicion', 700)
    const id = window.setTimeout(() => {
      setSinTransicion(true)
      setIndex((i) => (((i - N) % N) + N) % N + N)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setSinTransicion(false))
      })
    }, transMs + 50)
    return () => window.clearTimeout(id)
  }, [index, N])

  if (N === 0) return null

  function iniciarArrastre(e: React.PointerEvent<HTMLDivElement>) {
    if (N <= 1) return
    e.currentTarget.setPointerCapture(e.pointerId)
    arrastreInicioRef.current = e.clientX
    arrastroRef.current = false
    setArrastrando(true)
    setPausado(true)
  }

  function moverArrastre(e: React.PointerEvent<HTMLDivElement>) {
    if (arrastreInicioRef.current == null) return
    const delta = e.clientX - arrastreInicioRef.current
    if (Math.abs(delta) > UMBRAL_ARRASTRE_TAP) arrastroRef.current = true
    setDeltaArrastre(delta)
  }

  function soltarArrastre() {
    if (arrastreInicioRef.current == null) return
    const umbral = Math.min(UMBRAL_ARRASTRE_AVANCE_MAX, medida.ancho * 0.2)
    if (deltaArrastre <= -umbral) setIndex((i) => i + 1)
    else if (deltaArrastre >= umbral) setIndex((i) => i - 1)
    arrastreInicioRef.current = null
    setDeltaArrastre(0)
    setArrastrando(false)
    setPausado(false)
  }

  // Fase de captura, ANTES de que el click llegue al <Link> de la card: si
  // el gesto que acaba de terminar fue un drag de verdad (no un tap), lo
  // cancela — sin esto, soltar el dedo tras arrastrar también navegaría.
  function cancelarClickSiArrastro(e: React.MouseEvent<HTMLDivElement>) {
    if (arrastroRef.current) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  const gapPx = GAP_REM * (typeof window !== 'undefined' ? parseFloat(getComputedStyle(document.documentElement).fontSize) : 16)
  const sinAnim = sinTransicion || arrastrando
  const offsetPx = medida.centro - index * (medida.ancho + gapPx) + deltaArrastre

  const pista = [...articulos, ...articulos, ...articulos]
  const transicion = sinAnim
    ? undefined
    : { transitionDuration: 'var(--carrusel-destacados-transicion)', transitionTimingFunction: EASING }

  return (
    <div ref={anclaRef} className="relative">
      <div
        className="overflow-hidden"
        style={{
          marginLeft: medida.marginLeft,
          marginRight: medida.marginRight,
          touchAction: 'pan-y',
          cursor: N > 1 ? (arrastrando ? 'grabbing' : 'grab') : undefined,
          userSelect: arrastrando ? 'none' : undefined,
        }}
        onPointerDown={iniciarArrastre}
        onPointerMove={moverArrastre}
        onPointerUp={soltarArrastre}
        onPointerCancel={soltarArrastre}
        onClickCapture={cancelarClickSiArrastro}
        onPointerEnter={() => setPausado(true)}
        onPointerLeave={() => setPausado(false)}
        role="group"
        aria-roledescription="carousel"
        aria-label={t('Featured articles')}
      >
        <div
          className="flex"
          style={{
            gap: `${GAP_REM}rem`,
            transform: `translateX(${offsetPx}px)`,
            transitionProperty: 'transform',
            ...transicion,
          }}
        >
          {pista.map((articulo, i) => {
            const activo = i === index
            return (
              <div
                key={`${articulo.slug}-${i}`}
                // Solo la 1ª copia (i < N) queda expuesta a lectores de
                // pantalla — las otras dos existen solo para el mecanismo del
                // loop y repiten los mismos enlaces.
                aria-hidden={i >= N ? true : undefined}
                className="shrink-0"
                style={{
                  width: medida.ancho,
                  transform: `scale(${activo ? 1 : 0.85})`,
                  opacity: activo ? 1 : 0.5,
                  transitionProperty: 'transform, opacity',
                  ...transicion,
                }}
              >
                <CardDestacado articulo={articulo} />
              </div>
            )
          })}
        </div>
      </div>

      {N > 1 && (
        <>
          <button
            type="button"
            onClick={() => setIndex((i) => i - 1)}
            aria-label={t('Previous article')}
            className="absolute left-2 top-1/2 z-20 grid size-10 -translate-y-1/2 place-items-center rounded-chip bg-papel/90 text-navy shadow-md backdrop-blur-sm transition hover:bg-aqua hover:text-white sm:left-4"
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setIndex((i) => i + 1)}
            aria-label={t('Next article')}
            className="absolute right-2 top-1/2 z-20 grid size-10 -translate-y-1/2 place-items-center rounded-chip bg-papel/90 text-navy shadow-md backdrop-blur-sm transition hover:bg-aqua hover:text-white sm:right-4"
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
        </>
      )}
    </div>
  )
}
