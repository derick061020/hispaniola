import { useRef } from 'react'
import { Etiqueta } from '@/components/ui/etiqueta'
import { FAMILIA_FLOTA, RECORRIDO_FLOTA } from '@/data/flota'
import { useTimelineHistoria } from '@/components/nosotros/use-timeline-historia'

// EL RECORRIDO DE AÑOS de /flota (slide 27) — barrido HORIZONTAL con el bloque
// pinchado y la pista sangrando hasta el borde de la pantalla.
//
// ── DE DÓNDE SALE, EN CUATRO VUELTAS DEL MISMO DÍA (2026-08-07) ──────────
// Punto de partida, Samuel: «hay muchos más años pero solo hay una línea
// progresiva de 3 puntos, debería pasar por todos los años». Era un bug de
// arrastre: la timeline pasó de 5 hitos en UNA fila a 9 en TRES (rejilla de 3
// columnas) y el riel siguió siendo una única línea absoluta pegada arriba —
// medido, cruzaba solo la primera fila (2010-2015) y encima la sobrepasaba
// 166px, porque su `w-4/5` estaba calibrado para cuando el 5º punto caía justo
// al 80%. Las filas 2 y 3 quedaban con puntos sueltos: viñetas, no historia.
// ⚠️ La lección: un riel dibujado con una fracción fija solo vale mientras
// nadie cambie el número de columnas. Aquí ya no hay ninguna — el riel se
// compone de un tramo POR HITO, así que se ajusta solo a 9, 12 o 15.
//
//   1ª — carril horizontal + panel del año activo. DESCARTADA: «no me gusta
//        que solo se vea una a la vez».
//   2ª — timeline vertical con los 9 textos a la vez. DESCARTADA: «no lo
//        quiero vertical».
//   3ª — barrido horizontal pinchado, pedido por él: «puede ser scroll fijo con
//        gsap pero vayan pasando en horizontal el scroll». Cumple las tres
//        condiciones que ninguna otra cumplía a la vez: la línea pasa por los 9
//        años, se ven ~4 a la vez y no es vertical.
//   4ª — ESTA: «que el scroll fijo no se corte con el contenedor interno, sino
//        que se corte con los extremos de la pantalla, da mayor inmersión».
//
// ── POR QUÉ ES UN COMPONENTE APARTE ──────────────────────────────────────
// Vivía dentro de `FamiliaHispaniola`, que es lo que lo metía en la columna de
// la página. Para sangrar hasta el borde tiene que colgar FUERA del contenedor
// (pages/flota.tsx), y eso solo se puede hacer si es su propia pieza. La
// alternativa —sangrarlo desde dentro con `100vw` + margen negativo— está
// descartada en esta casa dos veces por escrito (la banda de la cocina y el
// barrido de /foundation): ese truco mete la barra de scroll en la cuenta y
// deja la página con scroll horizontal en Windows.
//
// ── CÓMO SANGRA: UNA REJILLA, NO UNIDADES DE VIEWPORT ────────────────────
// `.escena-sangrada` (componentes.css) reparte el ancho en tres columnas —
// margen | contenido | margen — con la del medio del tamaño del contenedor de
// la página. El titular vive en la del medio, así que sigue alineado con el
// resto de /flota; la pista ocupa «del contenido hasta el final», así que
// ARRANCA en el margen de la página y SE CORTA en el borde de la pantalla.
// Ese desajuste es justo lo que da la inmersión: el texto sigue en su sitio y
// la línea se escapa del cuadro.
//
// ⚠️ POR DEBAJO DE lg NO HAY NADA DE ESTO: sin barrido, sin sangrado y sin
// pin — la pista vuelve a la columna y es la lista vertical de siempre con los
// 9 hitos. No es una variante aparte, es el MISMO JSX sin las utilidades
// `lg:`, y es también el frame que viaja a Figma. Un pinchado horizontal en un
// móvil secuestra el único gesto que tiene el usuario.
export function RecorridoFlota({ estatico = false }: { estatico?: boolean }) {
  const seccionRef = useRef<HTMLElement>(null)
  useTimelineHistoria(seccionRef, { activo: !estatico }) // [dev-mode] gate

  return (
    <section ref={seccionRef} id="historia" className="scroll-mt-24">
      <div className="nosotros-timeline relative">
        {/* EL VIEWPORT es lo que se queda pinchado; el ESCENARIO de arriba es
            quien pone la duración con su alto (lo escribe el hook).

            ⚠️ EL TITULAR VA DENTRO, y fue lo primero que hubo que corregir del
            montaje: con solo la pista pinchada, el bloque medía 179px de alto
            (medido) y al fijarse dejaba media pantalla en blanco durante todo
            el barrido. Pinchado tiene que quedar una ESCENA COMPLETA, no una
            tira. De ahí el alto de ventana y el contenido centrado: mientras
            dura el recorrido, la pantalla es esta sección y nada más.
            `h-svh` y no `vh`/`dvh`: es la medida garantizada (no cambia con la
            barra de URL), mismo criterio que --spacing-hero-alto. */}
        <div
          data-timeline-viewport
          className="escena-sangrada lg:sticky lg:top-0 lg:h-svh lg:content-center"
        >
          <div>
            <Etiqueta>{FAMILIA_FLOTA.recorridoEyebrow}</Etiqueta>
            <h2 className="mt-3 max-w-2xl text-balance font-display text-h2 font-semibold text-navy">
              {FAMILIA_FLOTA.recorridoTitulo}
            </h2>
            <p className="mt-4 max-w-2xl text-lead text-navy-sub">{FAMILIA_FLOTA.recorridoTexto}</p>
          </div>

          {/* EL RECORTE va aquí y no en la escena: el titular no debe
              recortarse ni difuminarse. `sangra-pantalla` es lo que lleva esta
              columna a los DOS bordes de la ventana (ver la rejilla en
              componentes.css, que además es quien mantiene 2010 alineado con el
              titular al arrancar), y `min-w-0` es obligatorio — sin él, un item
              de grid se estira a lo que mida su contenido (la pista entera) en
              vez de recortarlo, y no habría barrido que valga.
              `.timeline-desvanecido` disuelve el borde derecho: cortada a
              cuchillo, la pista se leía como un fallo de maquetación a media
              palabra; el difuminado dice «esto sigue». Solo el derecho — por la
              izquierda no hay nada que anunciar (2010 arranca ahí).
              `lg:pt-2` va emparejado con el `lg:overflow-hidden` (2026-08-07,
              Samuel: «se corta un poco el borde del círculo»): el punto abre la
              pista pegado al canto de arriba y su `ring-4` sobresale 4px por
              fuera de la caja, justo donde el recorte pasa la cuchilla — se veía
              un halo con la coronilla plana. El recorte muerde el borde del
              PADDING, así que el aire deja el anillo entero dentro. Va con el
              `lg:` del recorte porque por debajo no hay overflow que recorte. */}
          <div
            data-timeline-clip
            className="timeline-desvanecido sangra-pantalla mt-12 min-w-0 lg:overflow-hidden lg:pt-2"
          >
            <ol data-timeline-pista className="flex flex-col gap-8 lg:w-max lg:flex-row lg:gap-0">
              {RECORRIDO_FLOTA.map((hito, i) => (
                <li
                  key={hito.anio}
                  className="timeline-hito relative flex gap-4 lg:block lg:w-timeline-hito lg:shrink-0 lg:pr-10"
                >
                  <div className="flex flex-col items-center lg:block">
                    {/* `block` no es decorativo: desde lg el envoltorio deja de
                        ser flex y un <span> vuelve a ser inline — ahí `size-3`
                        no aplica y el punto se queda en una caja de 0. */}
                    <span
                      aria-hidden="true"
                      className="timeline-punto block size-3 shrink-0 rounded-full bg-coral ring-4 ring-coral/15"
                    />
                    {/* Conector VERTICAL, solo por debajo de lg (la lista). */}
                    {i < RECORRIDO_FLOTA.length - 1 ? (
                      <span aria-hidden="true" className="w-px grow bg-linea lg:hidden" />
                    ) : null}
                  </div>

                  {/* Conector HORIZONTAL: gris siempre y coral encima, que es lo
                      que el barrido va dibujando. Va de este punto al siguiente
                      SIN cuentas: arranca en el borde derecho del punto
                      (`left-3` = su tamaño) y llega al borde del hito, que es
                      exactamente donde empieza el siguiente porque la
                      separación la pone el `pr-10` de dentro y no un `gap` de
                      la pista. Con `gap` habría que compensarlo con un valor
                      negativo — otra fracción a ojo de las que ya fallaron. */}
                  {i < RECORRIDO_FLOTA.length - 1 ? (
                    <>
                      <span
                        aria-hidden="true"
                        className="absolute left-3 right-0 top-1.5 hidden h-px bg-linea lg:block"
                      />
                      <span
                        aria-hidden="true"
                        className="timeline-tramo absolute left-3 right-0 top-1.5 hidden h-px origin-left bg-coral lg:block"
                      />
                    </>
                  ) : null}

                  <div className="pb-2 lg:mt-5">
                    <p className="font-display text-lead font-semibold text-coral">{hito.anio}</p>
                    <p className="mt-1 font-display text-base font-semibold text-navy">{hito.titulo}</p>
                    {/* [v3] El hito trae su parrafo: el cliente no da solo el
                        titular de cada anio, da lo que paso — que barco llego y
                        por que importo. */}
                    {hito.texto ? <p className="mt-1 text-sm text-navy-sub">{hito.texto}</p> : null}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
