import { useRef } from 'react'
import { Etiqueta } from '@/components/ui/etiqueta'
import { FUNDACION } from '@/data/fundacion'
import { useProgresoProyectos } from './use-progreso-proyectos'

// Los 5 frentes de la fundación en /ventaja-competitiva (slide 63) —
// 2026-07-28, pedido de Samuel: «la info del slide 63 parece que no está,
// agrégalo pero no así con box, puede ser con una barra de progreso vertical
// y van apareciendo los puntos».
//
// ⚠️ ESTE CONTENIDO TAMBIÉN VIVE EN /fundacion (fundacion/frentes-fundacion.tsx,
// allí en rejilla de fichas). No es un descuido: la maqueta del cliente mete
// la fundación entera dentro de esta página y Samuel pidió traerlo. El copy NO
// se duplica —los dos componentes leen el MISMO FUNDACION.frentes de
// data/fundacion.ts—, pero el TEXTO sí se ve en dos sitios: si eso acaba
// molestando, lo que hay que decidir es cuál de las dos páginas lo cuenta, no
// retocar uno de los dos textos.
//
// POR QUÉ BARRA Y NO FICHAS AQUÍ. En /fundacion los 5 frentes son el cuerpo de
// la página y se escanean en rejilla. Aquí son el penúltimo bloque de una
// página larga, y lo que se necesita es que se lean de corrido sin sumar cinco
// cajas más a una página que ya tiene varias superficies. La barra hace
// exactamente eso: convierte los cinco en un recorrido con principio y final,
// que además rima con el recorrido del catamarán de los 3 pilares de más
// arriba — misma página, misma idea de avance.
//
// La barra vertical NO contradice el «no me gusta tanta línea» del mismo día:
// aquello iba de divisorias que separan datos; ésta es el propio efecto que
// Samuel pidió, y su trabajo es unir, no separar.
export function ProyectosSostenibilidad({ activo }: { activo: boolean }) {
  const raizRef = useRef<HTMLElement>(null)
  useProgresoProyectos(raizRef, { activo }) // [dev-mode] gate

  return (
    <section id="ancla-proyectos" ref={raizRef} className="scroll-mt-sticky-top">
      {/* Cabecera CENTRADA (2026-07-28, 5ª vuelta, Samuel: «que esté centrada,
          que la barra no esté alineada a la izquierda»). Es la única sección
          centrada de la página y tiene sentido que lo sea: cuando el recorrido
          baja por el eje, un encabezado pegado a la izquierda deja el bloque
          descuadrado respecto a su propio eje. */}
      <div className="mx-auto max-w-2xl text-center">
        <Etiqueta className="sost-reveal">{FUNDACION.proyectosEyebrow}</Etiqueta>
        <h2 className="sost-reveal mt-2 text-balance font-display text-h2 font-semibold text-navy">
          {FUNDACION.proyectosTitulo}
        </h2>
        <p className="sost-reveal mt-3 text-lead text-navy-sub">{FUNDACION.proyectosLead}</p>
      </div>

      {/* La lista lleva el `data-progreso-lista` porque es ELLA la que define
          el rango de scroll — no la sección, que incluiría el encabezado y la
          barra empezaría a llenarse antes de que se vea el primer frente.
          El eje de la barra y el centro de los marcadores se derivan del mismo
          sitio en cada breakpoint (ver EJE, abajo), no de dos valores que haya
          que mantener a mano. */}
      <div data-progreso-lista className="relative mt-12">
        {/* EJE. En móvil vive a la izquierda (12px, el ancho de la primera
            columna de la rejilla de cada fila) porque no hay sitio para un
            zigzag: a 390px, dos columnas de texto serían dos columnas de tres
            palabras. Desde lg pasa al CENTRO (2026-07-28, 5ª vuelta, Samuel:
            «que la barra no esté alineada a la izquierda, y los elementos se
            alternen entre izquierda y derecha»).
            Pista gris de punta a punta y, encima, la barra aqua que crece con
            el scroll (scaleY desde el borde superior): mismo sitio y mismo
            grosor, así que se lee como UNA barra que se colorea, no como dos
            elementos. */}
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-1.5 w-0.5 -translate-x-1/2 bg-linea lg:left-1/2"
        />
        <span
          aria-hidden="true"
          data-progreso-barra
          className="absolute inset-y-0 left-1.5 w-0.5 -translate-x-1/2 bg-aqua-dark lg:left-1/2"
        />

        <ol>
          {FUNDACION.frentes.map((frente, i) => {
            const derecha = i % 2 === 1

            return (
              <li
                key={frente.titulo}
                className="relative grid grid-cols-[0.75rem_1fr] gap-x-5 pb-10 last:pb-0 sm:gap-x-8 lg:grid-cols-2 lg:gap-x-24 lg:pb-14"
              >
                {/* El marcador vive FUERA de `.sost-reveal` a propósito: el
                    reveal desplaza su bloque 24px en Y y el punto se mediría
                    contra una posición en movimiento, así que se encendería
                    desincronizado de la punta de la barra.
                    ring-papel: el aro blanco es lo que «tapa» la pista bajo el
                    punto, para que la barra pase por detrás y no lo cruce.
                    En lg sale del flujo de la rejilla y se ancla al eje
                    central; en móvil es la primera celda de la fila.
                    data-activo arranca en "true" en el JSX: ese es el estado
                    natural (sin JS, con reduced-motion o con ?dev-sost=estatico
                    se ve el recorrido entero hecho) y el hook lo apaga al
                    montarse. Ver use-progreso-proyectos.ts. */}
                <span
                  aria-hidden="true"
                  data-progreso-punto
                  data-activo="true"
                  className="mt-1 size-3 rounded-full bg-linea ring-4 ring-papel transition-colors duration-300 data-[activo=true]:bg-aqua-dark lg:absolute lg:left-1/2 lg:top-0 lg:-translate-x-1/2"
                />

                {/* Alternan lado por índice. Los de la IZQUIERDA van alineados
                    a la derecha (y su numeral, al final de la línea): así los
                    dos lados «miran» al eje en vez de dejar un río irregular
                    contra la barra. */}
                <div
                  className={`sost-reveal ${
                    derecha ? 'lg:col-start-2' : 'lg:col-start-1 lg:text-right'
                  }`}
                >
                  <p
                    className={`flex items-baseline gap-2.5 text-eyebrow font-semibold uppercase tracking-[0.14em] ${
                      derecha ? '' : 'lg:justify-end'
                    }`}
                  >
                    <span className="text-aqua-dark">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-navy-soft">{frente.clave}</span>
                  </p>
                  <h3 className="mt-2 font-display text-h3 font-semibold text-navy">
                    {frente.titulo}
                  </h3>
                  <p className={`mt-2 max-w-2xl text-navy-sub ${derecha ? '' : 'lg:ml-auto'}`}>
                    {frente.texto}
                  </p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
