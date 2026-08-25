import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { t } from '@/lib/i18n'

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
  /** Abre el lightbox, como cualquier otra celda del mosaico. Entrega su
   *  propio nodo para que el visor pueda EXPANDIRSE desde esta celda. */
  onAbrir?: (el: HTMLElement, indice: number) => void
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
        onClick={(e) => onAbrir?.(e.currentTarget.parentElement as HTMLElement, indice)}
        aria-label={`See the photos of ${etiqueta}`}
        className="absolute inset-0 size-full"
      />

      {/* Etiqueta permanente: sin ella, una celda que cambia sola se lee como
          un fallo de carga en vez de como una galería. */}
      <span className="pointer-events-none absolute left-2 top-2 rounded-full bg-navy/80 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
        {t('Menu')}
      </span>

      {/* [v2 2026-07-27] DOTS dentro de la propia imagen, abajo (pedido de
          Samuel). Cumplen dos funciones que las flechas no: dicen CUÁNTAS
          fotos hay y en cuál vas — sin ellos, una celda que cambia sola no se
          distingue de una que parpadea.
          El activo se ENSANCHA en vez de solo cambiar de color: el ancho se
          lee de un vistazo incluso a 6px y sin depender del contraste, que
          sobre fotos de comida cambia en cada plato.
          `pointer-events-none` en el contenedor y `auto` en cada dot: la capa
          no debe tapar el botón que abre el lightbox, pero los dots sí se
          pulsan. */}
      {/* Velo de pie. SIN esto los dots son invisibles: van en blanco y las
          fotos de comida son en su mayoría platos claros sobre mantel claro —
          verificado en pantalla, sobre la langosta no se veía ninguno. Mismo
          recurso que `.reel-card__velo` usa para que su título lea sobre
          cualquier fotograma. */}
      {fotos.length > 1 ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-navy/55 to-transparent"
        />
      ) : null}

      {/* [2026-08-21, auditoría móvil] Misma corrección que en
          ui/carrusel-imagenes.tsx: el punto se sigue DIBUJANDO a 6px y es el
          `before` transparente el que le da tamaño de dedo. Aquí importa más
          todavía porque el mosaico de la ficha llega a 10 fotos: diez dianas
          de 6px separadas por 4 son una lotería. */}
      {fotos.length > 1 ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-2 flex items-center justify-center gap-2">
          {fotos.map((f, i) => (
            <button
              key={f}
              type="button"
              onClick={() => setIndice(i)}
              aria-label={`See photo ${i + 1} of ${fotos.length}`}
              aria-current={i === indice}
              className={`pointer-events-auto relative h-1.5 rounded-full transition-all duration-300 before:absolute before:-inset-x-1 before:-inset-y-3 before:content-[''] motion-reduce:transition-none ${
                i === indice ? 'w-4 bg-white' : 'w-1.5 bg-white/55 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      ) : null}

      {/* Flechas solo al hover (y siempre visibles con teclado, via focus).
          En táctil no hay hover: ahí el avance automático y los dots son la
          navegación. */}
      {fotos.length > 1 ? (
        <>
          <button
            type="button"
            onClick={() => ir(-1)}
            aria-label={t('Previous photo')}
            className="absolute left-1.5 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full bg-papel/85 text-navy opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => ir(1)}
            aria-label={t('Next photo')}
            className="absolute right-1.5 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full bg-papel/85 text-navy opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        </>
      ) : null}
    </div>
  )
}
