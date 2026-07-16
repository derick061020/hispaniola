import { useState } from 'react'

// Acordeón de preguntas — extraído de `home/galeria-faq-cierre.tsx` al
// construir la FAQ de la ficha de tour, que es visualmente el MISMO objeto
// (mismas medidas, mismo radio, mismo signo +/−). Un componente React = un
// componente de Figma: dos copias del mismo acordeón serían dos componentes
// que hay que mantener parejos a mano.
//
// La forma `{ p, r }` es la de prototipo/datos.js (fuente canónica: FAQ_CATEGORIAS
// y el `faqTour` de cada tour) — se conserva para que ambos consumidores pasen
// sus datos sin mapear.
//
// `aria-expanded` es nuevo: la versión de la home no lo tenía. Es la clase de
// arreglo que se cobra gratis al unificar — el lector de pantalla ahora sabe
// si la respuesta está abierta.

export type PreguntaAcordeon = { p: string; r: string }

export function Acordeon({
  items,
  /** Índice abierto al montar. 0 = la primera abierta (así el patrón se
   *  entiende de un vistazo y hay un frame de Figma sin tener que interactuar);
   *  null = todas cerradas. */
  abiertaInicial = 0,
  className = '',
}: {
  items: PreguntaAcordeon[]
  abiertaInicial?: number | null
  className?: string
}) {
  const [abierta, setAbierta] = useState<number | null>(abiertaInicial)

  return (
    <div className={`flex flex-col divide-y divide-linea rounded-card bg-papel ring-1 ring-linea ${className}`}>
      {items.map((f, i) => (
        <div key={f.p}>
          <button
            type="button"
            onClick={() => setAbierta((a) => (a === i ? null : i))}
            aria-expanded={abierta === i}
            className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-medium text-navy"
          >
            {f.p}
            <span aria-hidden="true" className="shrink-0 text-navy-soft">
              {abierta === i ? '−' : '+'}
            </span>
          </button>
          {abierta === i ? <p className="px-4 pb-3.5 text-sm text-navy-soft">{f.r}</p> : null}
        </div>
      ))}
    </div>
  )
}
