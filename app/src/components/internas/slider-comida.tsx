import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Slider de fotos de comida (correcciones v2, plan 01 §10 — slide 7).
//
// El cliente marcó con un círculo la PRIMERA celda del mosaico y escribió
// «mini galería de fotos del menú». No es una tira a ancho completo: es esa
// misma celda del grid, con el mismo tamaño y la misma estética que las
// demás, pero en vez de una foto fija pasan en bucle TODOS los platos del
// menú de ese tour o evento. Al pasar el ratón aparecen flechas para
// adelantar y retroceder.
//
// Por qué encaja aquí y no a ancho completo: las fotos de plato de la web del
// cliente están a 368×224. En una celda del mosaico eso da de sobra; estiradas
// a los ~1.400px de la columna se verían reventadas. Con esta lectura la
// corrección deja de estar bloqueada por las fotos nuevas.
//
// El avance automático se detiene al pasar el ratón (para poder mirar un
// plato) y respeta `prefers-reduced-motion`: sin animación, las flechas siguen
// funcionando y el slider simplemente no avanza solo — mismo criterio que los
// marquees del sitio (WCAG 2.2.2).

const INTERVALO_MS = 2600

export function SliderComida({
  fotos,
  etiqueta,
  onAbrir,
}: {
  fotos: string[]
  etiqueta: string
  /** Abre el lightbox, como cualquier otra celda del mosaico. */
  onAbrir?: () => void
}) {
  const [indice, setIndice] = useState(0)
  const [pausado, setPausado] = useState(false)
  const reduce = useRef(false)

  useEffect(() => {
    reduce.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  useEffect(() => {
    if (pausado || reduce.current || fotos.length <= 1) return
    const id = window.setInterval(() => {
      setIndice((i) => (i + 1) % fotos.length)
    }, INTERVALO_MS)
    return () => window.clearInterval(id)
  }, [pausado, fotos.length])

  if (fotos.length === 0) return null

  const ir = (delta: number) => {
    setIndice((i) => (i + delta + fotos.length) % fotos.length)
  }

  return (
    // size-full NO es decorativo: las fotos van `absolute inset-0` (se funden
    // entre sí en vez de deslizarse), así que sin altura propia este div
    // colapsa a 0 y la celda se ve BLANCA. Pasó exactamente eso en la primera
    // versión — el slider existía, con sus 9 fotos y sus flechas, pero medía
    // cero. La celda del mosaico ya trae su alto de la rejilla; aquí solo hay
    // que ocuparla.
    <div
      className="group relative size-full overflow-hidden bg-papel-hueso"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
    >
      {/* Las fotos se apilan y se funden entre sí en vez de deslizarse: dentro
          de una celda pequeña un desplazamiento lateral se lee como un tirón,
          y además obligaría a medir el ancho de la celda. */}
      {fotos.map((f, i) => (
        <img
          key={f}
          src={`/fotos/${f}.webp`}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className={`absolute inset-0 size-full object-cover transition-opacity duration-700 motion-reduce:transition-none ${
            i === indice ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      {/* Capa pulsable: abre el lightbox igual que el resto de celdas, para que
          esta no se comporte distinta del resto del mosaico. */}
      <button
        type="button"
        onClick={onAbrir}
        aria-label={`Ver las fotos de ${etiqueta}`}
        className="absolute inset-0 size-full"
      />

      {/* Etiqueta permanente: sin ella, una celda que cambia sola se lee como
          un fallo de carga en vez de como una galería. */}
      <span className="pointer-events-none absolute left-2 top-2 rounded-full bg-navy/80 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
        El menú
      </span>

      {/* Flechas solo al hover (y siempre visibles con teclado, via focus).
          En táctil no hay hover: ahí el avance automático es la navegación. */}
      {fotos.length > 1 ? (
        <>
          <button
            type="button"
            onClick={() => ir(-1)}
            aria-label="Foto anterior"
            className="absolute left-1.5 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full bg-papel/85 text-navy opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => ir(1)}
            aria-label="Foto siguiente"
            className="absolute right-1.5 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full bg-papel/85 text-navy opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        </>
      ) : null}
    </div>
  )
}
