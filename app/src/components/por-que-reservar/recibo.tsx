import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { Boton } from '@/components/ui/boton'
import { Etiqueta } from '@/components/ui/etiqueta'
import { formatoDinero } from '@/data/home'
import { CONCEPTOS_SUELTOS, PRECIO_TODO_INCLUIDO } from '@/data/por-que-reservar'

// «La cuenta» — slide 53, la mejor idea del PowerPoint del cliente: demostrar
// EN DINERO por qué reservar directo, en vez de repetir que hay que hacerlo.
//
// Y es, literalmente, UNA CUENTA. No una card con una lista dentro: un recibo
// de papel, con el mismo cuerpo que los boletos de la home (.boleto — papel,
// perforación TROQUELADA de verdad, sello estampado, código de barras). El
// objeto ya existía en el proyecto; aquí se reusa, no se reinventa.
//
// LA PERFORACIÓN ES EL ARGUMENTO, no un adorno. Por encima del troquel está
// lo que cuesta el día contratado a trozos (190). Por debajo, lo que cuesta
// con nosotros (114). El corte separa las dos cuentas — se entiende antes de
// leer una sola cifra.
//
// ⚠️ EL RECIBO NO ES NUESTRO Y TIENE QUE NOTARSE. Los 6 importes son precios
// de referencia del mercado, no facturas que hayamos emitido: si el recibo
// llevara nuestro membrete, estaríamos fingiendo haber cobrado 190 alguna
// vez. Por eso el encabezado dice de quién es la cuenta («lo que pagarías
// suelto, por ahí fuera») y la letra pequeña va DENTRO del papel, no
// escondida al pie de la sección. Pendiente de que Fernando confirme que
// cada importe es defendible: si alguien audita el «almuerzo de mariscos
// US$ 50» y le parece generoso, el argumento entero se vuelve en contra.
//
// La suma se CALCULA. Si mañana cambia un concepto, el total y el ahorro se
// recalculan solos y no pueden contradecir a las líneas de arriba.
export function Recibo() {
  const suelto = CONCEPTOS_SUELTOS.reduce((s, c) => s + c.importe, 0)
  const ahorro = suelto - PRECIO_TODO_INCLUIDO

  // Dónde cae el troquel dentro del papel, para que el mask lo corte ahí.
  // Mismo reparto «JS mide, CSS pinta» que boleto-reserva.tsx — ver el
  // comentario largo de .boleto-superficie en componentes.css.
  const perfRef = useRef<HTMLDivElement>(null)
  const [notchY, setNotchY] = useState<number | null>(null)
  useLayoutEffect(() => {
    const medir = () => {
      if (perfRef.current) setNotchY(perfRef.current.offsetTop)
    }
    medir()
    window.addEventListener('resize', medir)
    return () => window.removeEventListener('resize', medir)
  }, [])

  return (
    <section className="grid items-center gap-10 lg:grid-cols-[1fr_26rem] lg:gap-16">
      <div>
        <Etiqueta>The bill</Etiqueta>
        <h2 className="mt-2 text-balance font-display text-h2 font-semibold text-navy">
          We’re not the cheapest. But you get{' '}
          <span className="text-coral">exactly what you pay for</span>.
        </h2>
        <p className="mt-5 text-lead text-navy-sub">
          There are similar tours, sometimes cheaper. They’re only similar on the outside. Book
          separately every single thing your day at sea includes and the bill comes out like this.
        </p>
        <p className="mt-4 text-lead text-navy-sub">
          We don’t charge you for those six things. We charge you for one, and everything comes
          inside.
        </p>
        <div className="mt-8">
          <Boton to="/#tours" tamaño="lg">
            I want this price
          </Boton>
        </div>
      </div>

      {/* El recibo. `--rot` lo pone el JSX sobre la clase compartida .boleto,
          igual que hacen los dos boletos de la home con su propia escena. */}
      <article
        className="boleto mx-auto w-full max-w-sm lg:mx-0"
        style={{ ['--rot' as string]: 'var(--pqr-papel-rot-recibo)' } as CSSProperties}
      >
        <div
          className="boleto-superficie p-6 sm:p-7"
          style={
            notchY !== null
              ? ({ ['--boleto-notch-y' as string]: `${notchY}px` } as CSSProperties)
              : undefined
          }
        >
          <p className="text-center text-eyebrow font-semibold uppercase tracking-[0.14em] text-navy-soft">
            What you’d pay separately
          </p>
          <p className="mt-2 text-center text-xs text-navy-soft">
            Booking each thing on its own, around here
          </p>

          <ul className="mt-6 flex flex-col gap-3.5">
            {CONCEPTOS_SUELTOS.map((c) => (
              <li key={c.id} className="flex items-baseline gap-2 text-sm">
                <span className="shrink-0 text-navy">{c.nombre}</span>
                {/* Los puntitos de un recibo impreso: un filete punteado que
                    se estira hasta el precio. Es lo que hace que la línea se
                    lea como una CUENTA y no como una lista con dos columnas. */}
                <span
                  aria-hidden="true"
                  className="min-w-4 flex-1 translate-y-[-0.25rem] border-b border-dotted border-linea-fuerte"
                />
                <span className="shrink-0 font-semibold tabular-nums text-navy">
                  {formatoDinero(c.importe)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex items-baseline gap-2 border-t border-linea pt-4 text-sm">
            <span className="shrink-0 font-semibold uppercase tracking-[0.08em] text-navy-soft">
              Separate total
            </span>
            <span
              aria-hidden="true"
              className="min-w-4 flex-1 translate-y-[-0.25rem] border-b border-dotted border-linea-fuerte"
            />
            <span className="shrink-0 font-display text-xl font-semibold tabular-nums text-navy-soft line-through">
              {formatoDinero(suelto)}
            </span>
          </div>

          {/* El troquel: aquí se acaba la cuenta de fuera y empieza la nuestra. */}
          <div ref={perfRef} aria-hidden className="boleto-perforacion -mx-6 mt-6 sm:-mx-7" />

          <div className="mt-6 text-center">
            <p className="text-eyebrow font-semibold uppercase tracking-[0.14em] text-menta-texto">
              With us · all included
            </p>
            <p className="mt-2 font-display text-4xl font-bold tabular-nums text-navy">
              {formatoDinero(PRECIO_TODO_INCLUIDO)}
            </p>
            <p className="mt-1 text-xs text-navy-soft">No extras, no surprises</p>
          </div>

          <div className="mt-5 flex justify-center">
            <p className="boleto-sello inline-block px-3.5 py-1.5 text-eyebrow font-bold uppercase tracking-[0.12em] text-coral opacity-90">
              Te ahorras {formatoDinero(ahorro)}
            </p>
          </div>

          <p className="mt-6 border-t border-linea pt-4 text-center text-xs leading-relaxed text-navy-soft">
            The six figures above are reference prices for equivalent services in the area. They
            are not our rates: ours is the one below the line.
          </p>

          <div aria-hidden className="boleto-barcode mt-5 text-navy/20" />
        </div>
      </article>
    </section>
  )
}
