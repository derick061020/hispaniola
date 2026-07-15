import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { BENEFICIOS_DIRECTO, BOLETO_TOUR, formatoDinero } from '@/data/home'

// Boleto de la comparación «aquí vs. un portal» (why-direct) — UN componente,
// DOS variantes (→ variantes del futuro componente Figma):
//   · «portal»  — el encabezado (mismo tour, mismo precio) y nada más: las
//     líneas del cuerpo son ranuras vacías que se van desvaneciendo.
//   · «directo» — el mismo encabezado, y el cuerpo sigue: los 5 beneficios
//     "impresos" + el sello «Reserva directa».
//
// El ENCABEZADO es idéntico en las dos A PROPÓSITO (mismos nodos, mismos
// tamaños, centrado): en el toggle móvil de why-direct.tsx el precio no se
// mueve un píxel al cambiar de variante — solo cambia lo que viene después.
// La anatomía del objeto (borde, corte real de la perforación, sello, código
// de barras) vive en componentes.css (.boleto-*).
//
// El boleto es DOS capas (v3.1, Samuel 2026-07-15): `.boleto` (exterior, solo
// rotate + box-shadow, sin recortar) y `.boleto-superficie` (interior, fondo +
// borde + el CORTE real de la perforación vía mask-image). Se miden aquí, con
// JS, dónde cae `.boleto-perforacion` (offsetTop respecto a la superficie —
// que ya es el sitio CORRECTO por flujo normal, sin cálculo a mano) y se
// escribe como `--boleto-notch-y` para que el mask corte justo ahí. Mismo
// reparto "JS mide, CSS pinta" que el dock del ticker (use-ticker-dock.ts) y
// el notch dinámico del header (notch-menu.tsx).
//
// ⚠️ Microcopy nuevo, pendiente de reconciliar con datos.js (fuente canónica
// del copy): «En un portal», «Reservando directo» y «El mismo tour. Nada
// más.» — el resto (beneficios, «Desde», «máx. N», el sello = el eyebrow de
// la sección) ya existía.

export type VarianteBoleto = 'portal' | 'directo'

// Las 4 ranuras vacías del boleto del portal: ancho y opacidad decrecientes —
// el recibo "se queda sin tinta". aria-hidden: lo que dicen ya lo dice el
// texto «El mismo tour. Nada más.» de arriba.
const RANURAS = ['w-full opacity-70', 'w-11/12 opacity-50', 'w-3/4 opacity-35', 'w-2/3 opacity-20']

export function BoletoReserva({
  variante,
  cuerpoAnimado = false,
  className = '',
  style,
}: {
  variante: VarianteBoleto
  /** true solo en el boleto del toggle móvil: el cuerpo entra en fade al remontar. */
  cuerpoAnimado?: boolean
  className?: string
  /** Para el offset del stack en desktop (why-direct.tsx): margin-top/-left del <article> exterior. */
  style?: CSSProperties
}) {
  const directo = variante === 'directo'

  const perfRef = useRef<HTMLDivElement>(null)
  const [notchY, setNotchY] = useState<number | null>(null)

  // Mide dónde cae la perforación DENTRO de la superficie (su offsetParent,
  // gracias a `.boleto-superficie { position: relative }`) y lo escribe como
  // custom property que consume el mask-image en CSS. Se re-mide en resize
  // (el ancho del boleto cambia entre variantes responsive/breakpoints y
  // puede reflowar el nombre del tour a 1 o 2 líneas, moviendo la línea).
  useLayoutEffect(() => {
    const medir = () => {
      if (perfRef.current) setNotchY(perfRef.current.offsetTop)
    }
    medir()
    window.addEventListener('resize', medir)
    return () => window.removeEventListener('resize', medir)
  }, [])

  return (
    <article className={`boleto wd-boleto ${className}`} style={style}>
      <div
        className="boleto-superficie p-6"
        style={notchY !== null ? ({ ['--boleto-notch-y' as string]: `${notchY}px` } as CSSProperties) : undefined}
      >
        {/* Encabezado — idéntico y centrado en ambas variantes salvo el label */}
        <div className="text-center">
          <p
            className={`text-eyebrow font-semibold uppercase tracking-[0.12em] ${directo ? 'text-aqua-dark' : 'text-navy-soft'}`}
          >
            {directo ? 'Reservando directo' : 'En un portal'}
          </p>
          <p className="mt-3 font-display text-h3 font-semibold text-navy">{BOLETO_TOUR.nombre}</p>
          <p className="mt-1 text-sm text-navy-soft">
            {BOLETO_TOUR.duracionCorta} · máx. {BOLETO_TOUR.maxPax} personas
          </p>
          <p className="mt-3 flex items-baseline justify-center gap-2">
            <span className="text-eyebrow uppercase tracking-[0.12em] text-navy-soft">Desde</span>
            <span className="text-precio font-bold text-navy">{formatoDinero(BOLETO_TOUR.precioLight)}</span>
          </p>
        </div>

        {/* Perforación — el -mx-6 la lleva de borde a borde (deshace el p-6);
            este DOM es la fuente de verdad de dónde cae el corte (medido arriba). */}
        <div ref={perfRef} aria-hidden className="boleto-perforacion -mx-6 mt-5" />

        {/* Cuerpo — lo ÚNICO que cambia entre variantes */}
        <div className={`mt-5 ${cuerpoAnimado ? 'boleto-cuerpo' : ''}`}>
          {directo ? (
            <>
              <ul className="space-y-3.5 text-left">
                {BENEFICIOS_DIRECTO.map((b) => (
                  <li key={b.id} className="flex gap-2.5 text-sm">
                    <span aria-hidden className="font-bold text-aqua-dark">
                      +
                    </span>
                    <p className="text-navy-soft">
                      <span className="font-semibold text-navy">{b.titulo}.</span> {b.texto}
                    </p>
                  </li>
                ))}
              </ul>
              {/* El -mt-2 lo mete en el hueco del space-y de la lista (14px),
                  sin tocar el texto: el sello pisa el papel, no las líneas. */}
              <div className="-mt-2 flex justify-end pr-2">
                <p className="boleto-sello inline-block px-3.5 py-1.5 text-eyebrow font-bold uppercase tracking-[0.12em] text-aqua-dark opacity-85">
                  Reserva directa
                </p>
              </div>
            </>
          ) : (
            <>
              <p className="text-center text-sm text-navy-soft">El mismo tour. Nada más.</p>
              <div aria-hidden className="mx-auto mt-5 max-w-[13rem] space-y-4">
                {RANURAS.map((r) => (
                  <div key={r} className={`mx-auto h-3 border-b-2 border-dashed border-linea-fuerte ${r}`} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Código de barras — el MISMO en las dos variantes: es el mismo producto. */}
        <div aria-hidden className="boleto-barcode mt-6 text-navy/20" />
      </div>
    </article>
  )
}
