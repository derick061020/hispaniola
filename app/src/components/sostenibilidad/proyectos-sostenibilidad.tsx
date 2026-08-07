import { useRef } from 'react'
import { Etiqueta } from '@/components/ui/etiqueta'
import { FUNDACION } from '@/data/fundacion'
import { useEntradaProyectos } from './use-entrada-proyectos'
import { useProgresoProyectos } from './use-progreso-proyectos'

// Los 6 frentes de la fundación en /ventaja-competitiva (slide 63) —
// 2026-07-28, pedido de Samuel: «la info del slide 63 parece que no está,
// agrégalo pero no así con box, puede ser con una barra de progreso vertical
// y van apareciendo los puntos».
//
// [v3 2026-08-07, PowerPoint SLIDE 81 — «esta sección hacerla más dinámica,
// mucho texto y no tiene imágenes ni efectos»; 📞 reunión 07-31 (30:16):
// «hacerla con fotos y algún efecto… una foto de un coral, una tortuga».
// Samuel: «mantengo la línea de tiempo, solo agregarle imágenes» → aceptado,
// y es la opción que se implementa (opción A del plan 07 §3).]
//
// La captura del slide es ESTA vista, no el barrido horizontal de /fundacion.
// De las dos cosas que pedía —imágenes y efecto—, el EFECTO ya estaba desde la
// v2: la barra que se llena con el scroll, los puntos que se encienden al
// alcanzarlos y el fundido de entrada de cada bloque. Lo que faltaba eran las
// FOTOS, que además ya vivían en el dato (`frentes[].foto`, elegidas una a una
// en la v2) y solo las consumía /fundacion — o sea que la sección que el
// cliente señaló por «no tener imágenes» era justo la que tenía las imágenes
// a mano sin usarlas.
//
// LA FOTO VA ENFRENTE DEL TEXTO, AL OTRO LADO DEL EJE, y no debajo de él: en
// una timeline a dos lados la media rejilla de enfrente ya estaba vacía en
// cada fila, así que la foto ocupa el hueco que había en vez de alargar la
// sección con un bloque nuevo por proyecto. Es el mismo reparto que el
// recorrido de los 3 pilares más arriba en esta misma página (la foto en la
// mitad libre del zigzag) — misma página, mismo lenguaje.
//
// Y CADA PROYECTO GANA SU CLAIM (v3, copy aprobado): la línea corta que
// explica por qué importa. En el barrido de /fundacion va a --text-lg bajo un
// título de --text-h2; aquí el título es --text-h3 (22px), así que el claim
// baja a --text-lead — a 18px quedaría casi del tamaño del título y aplanaría
// la jerarquía. Mismo rol, misma marca (display + aqua), escala de esta vista.
//
// ⚠️ DOS DE LAS SEIS FOTOS SON DEL ÁREA, no del programa (`contexto: true` en
// data/fundacion.ts): no existe ni una foto de las jornadas de limpieza ni del
// trabajo con pescadores, ni del área protegida a pie de agua. El flag no
// pinta nada —el `alt` dice exactamente lo que se ve y no hay ningún pie que
// dé por hecho lo que la foto no enseña—, está para localizarlas de un vistazo
// cuando el cliente mande material real de esos programas.
//
// Y LA ENTRADA DE LOS 6 ÍTEMS SE VA DEL `.sost-reveal` DE LA PÁGINA (v3
// 2026-08-07, Samuel: «que las animaciones de aparición de los textos e
// imágenes sea más creativo, y además que vaya con el scroll, es decir, si me
// vuelvo para atrás se vuelvan a ocultar»). El reveal de la página es de un
// disparo por diseño (`once: true`), así que estos 12 bloques pasan a
// use-entrada-proyectos.ts: timeline con scrub por fila —reversible al subir—
// que los abre DESDE EL EJE, descubre el texto línea a línea y la foto con un
// barrido. La CABECERA de la sección se queda con `.sost-reveal`: es el rótulo
// de la sección, no uno de los ítems que el recorrido va destapando.
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
  useEntradaProyectos(raizRef, { activo }) // [dev-mode] gate

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

        {/* EL AIRE ENTRE FILAS VA EN EL `gap` DE LA LISTA, no en un `pb` de cada
            fila (v3 2026-08-07). No es cosmético: con el padding dentro, el alto
            del `li` incluía esos 56px, así que el `top-1/2` del marcador caía 28px
            por debajo del centro real del contenido — y el punto tiene que quedar
            EXACTAMENTE a la altura del centro de la foto y del texto (ver abajo).
            Sacándolo al gap, el `li` mide lo que mide su contenido y el centro es
            el centro, sin restar un número a mano. El `gap` sustituye también al
            `last:pb-0` que evitaba el aire de sobra en la última fila. */}
        <ol className="flex flex-col gap-10 lg:gap-14">
          {FUNDACION.frentes.map((frente, i) => {
            const derecha = i % 2 === 1

            return (
              <li
                key={frente.titulo}
                data-proyecto-fila
                data-lado={derecha ? 'derecha' : 'izquierda'}
                className="relative grid grid-cols-[0.75rem_1fr] gap-x-5 sm:gap-x-8 lg:grid-cols-2 lg:gap-x-24"
              >
                {/* El marcador vive FUERA de los bloques que animan, y es
                    HERMANO suyo y no hijo, a propósito: la entrada los desplaza
                    en X y en Y, así que dentro de uno el punto se mediría contra
                    una posición en movimiento y se encendería desincronizado de
                    la punta de la barra. Con la entrada scrubbed de la v3 —que
                    los mueve durante todo el recorrido, no solo al aparecer—
                    esto pasa de ser un detalle a ser la condición para que la
                    barra y los puntos sigan cuadrando.
                    ring-papel: el aro blanco es lo que «tapa» la pista bajo el
                    punto, para que la barra pase por detrás y no lo cruce.
                    En lg sale del flujo de la rejilla y se ancla al eje
                    central; en móvil es la primera celda de la fila.
                    data-activo arranca en "true" en el JSX: ese es el estado
                    natural (sin JS, con reduced-motion o con ?dev-sost=estatico
                    se ve el recorrido entero hecho) y el hook lo apaga al
                    montarse. Ver use-progreso-proyectos.ts.
                    [v3 2026-08-07] En lg baja al CENTRO de la fila (antes
                    `top-0`, a la altura del rótulo). Desde que la fila tiene
                    foto, su alto lo manda la foto y no el texto: un punto
                    clavado arriba se leía como parte del canto superior de la
                    imagen en vez de marcar el proyecto. Centrado, el punto, el
                    medio de la foto y el medio del texto caen en la MISMA línea
                    y los tres se leen como un solo ítem. `lg:mt-0` retira el
                    nudge de 4px que en móvil alinea el punto con la altura de
                    mayúscula del rótulo: centrado ya no hay nada que nivelar y
                    esos 4px descuadrarían el centro. */}
                <span
                  aria-hidden="true"
                  data-progreso-punto
                  data-activo="true"
                  className="mt-1 size-3 rounded-full bg-linea ring-4 ring-papel transition-colors duration-300 data-[activo=true]:bg-aqua-dark lg:absolute lg:left-1/2 lg:top-1/2 lg:mt-0 lg:-translate-x-1/2 lg:-translate-y-1/2"
                />

                {/* Alternan lado por índice. Los de la IZQUIERDA van alineados
                    a la derecha (y su numeral, al final de la línea): así los
                    dos lados «miran» al eje en vez de dejar un río irregular
                    contra la barra.
                    La celda es EXPLÍCITA en móvil (`col-start-2 row-start-1`) y
                    no auto-colocada como antes: desde que la fila tiene un
                    segundo hijo (la foto), dejarlo al reparto automático la
                    metía en la columna de 0.75rem del marcador.
                    [v3 2026-08-07, Samuel: «las imágenes no están alineadas con
                    respecto a su texto, es como que el texto está alineado a la
                    parte superior»] `lg:self-center`. El texto ocupa ~150px y la
                    foto 288: pegados los dos arriba, el texto acababa 110px antes
                    y la fila se leía descuadrada aunque ambos empezaran en la
                    misma línea. Centrado contra la foto, el aire sobrante se
                    reparte arriba y abajo y la pareja se lee como una unidad. */}
                <div
                  data-proyecto-texto
                  className={`col-start-2 row-start-1 lg:self-center ${
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
                  <p className="mt-2 font-display text-lead font-semibold text-aqua-dark">
                    {frente.claim}
                  </p>
                  <p className={`mt-2 max-w-2xl text-navy-sub ${derecha ? '' : 'lg:ml-auto'}`}>
                    {frente.texto}
                  </p>
                </div>

                {/* LA FOTO (v3, slide 81). En lg ocupa la media rejilla de
                    ENFRENTE del texto —que ya estaba vacía— en la MISMA fila; en
                    móvil no hay dos lados, así que cae debajo del texto en la
                    columna ancha (`row-start-2`).
                    Pegada al eje como el texto de enfrente: la de la derecha se
                    alinea sola (es un bloque de 384px al inicio de su columna) y
                    la de la izquierda necesita `lg:ml-auto` para empujarse hacia
                    el centro. El aire sobrante queda en los cantos, no en el
                    pasillo de la barra.
                    `self-start`: sin él, el `stretch` de la rejilla le daría el
                    alto de la fila y se comería el aspect-ratio. En lg pasa a
                    `self-center`, igual que el texto: hoy la foto es la más alta
                    de las dos y da lo mismo, pero si un copy crece por encima de
                    sus 288px (o el breakpoint estrecha la columna) los dos siguen
                    centrados uno contra el otro en vez de descuadrarse al revés.
                    ⚠️ EL ASPECTO ES FIJO A PROPÓSITO (no alto natural): así la
                    fila mide lo mismo antes y después de que cargue el `lazy`.
                    Con alto dependiente de la imagen, cada foto que aterriza
                    cambia el `offsetHeight` de la lista y la barra de progreso
                    —que mide ese alto en cada frame— se desincroniza de los
                    puntos hasta el siguiente refresh de ScrollTrigger. */}
                <div
                  data-proyecto-foto
                  className={`col-start-2 row-start-2 mt-5 aspect-[4/3] w-full self-start overflow-hidden rounded-card lg:row-start-1 lg:mt-0 lg:w-sost-proyecto-foto lg:self-center ${
                    derecha ? 'lg:col-start-1 lg:ml-auto' : 'lg:col-start-2'
                  }`}
                >
                  <img
                    src={`/fotos/${frente.foto}.webp`}
                    alt={frente.fotoAlt}
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover"
                  />
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
