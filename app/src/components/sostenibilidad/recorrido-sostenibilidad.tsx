import { useRef } from 'react'
import { SOSTENIBILIDAD } from '@/data/sostenibilidad'
import { useRecorridoSostenibilidad } from './use-recorrido-sostenibilidad'

// Los 3 pilares como RECORRIDO (2026-07-22, pedido de Samuel, con referencia
// visual: "la idea es que lo transformemos como en recorrido con su progress
// bar que va avanzando, pero no lineal, sino como en la imagen que tiene un
// recorrido curvo, y en vez de la flechita verde que va siguiendo el recorrido
// que sea el barquito que usamos de hover en el botón del hero del home").
//
// Antes: lista editorial apilada (numeral fantasma + hairline). Ahora, en
// desktop, los mismos 3 bloques se reparten en ZIGZAG (izq · der · izq) y una
// curva gris punteada los enhebra mientras el catamarán real la navega según
// scrolleas. Toda la mecánica vive en use-recorrido-sostenibilidad.ts.
//
// Quién marca el PROGRESO (3ª vuelta, 2026-07-22): la FOTO de cada paso, que
// entra al llegar y se retira al pasar al siguiente — nunca hay dos a la vez.
// Antes lo marcaba una estela aqua que se dibujaba sobre el trazo, y se
// retiró por lo que pidió Samuel: "que la línea siempre esté dotted gris...
// así aseguramos que la línea no estorba al texto". Cruzando por encima del
// párrafo, una línea sólida de color competía con la lectura justo donde el
// ojo estaba leyendo; la foto cuenta el mismo progreso y encima aporta.
//
// La ficha de cada pilar no cambia de lenguaje — mismo numeral fantasma
// (.sost-numero) y misma jerarquía que tenía la lista. Lo que cambia es la
// disposición y quién la recorre.
//
// ⚠️ El zigzag es SOLO desktop. En móvil no hay pasillo lateral por donde
// serpentee nada, así que los pilares se quedan EXACTAMENTE como estaban
// (lista apilada con hairlines) y el trazo y el barco ni se pintan.

// Posición de cada pilar en la rejilla de 12. Clases LITERALES en un array y
// no interpoladas: el escáner de Tailwind lee el código fuente, una clase
// construida con plantilla (`lg:col-start-${n}`) no existiría en el CSS.
const POSICION = [
  'lg:col-start-1 lg:row-start-1',
  'lg:col-start-8 lg:row-start-2',
  'lg:col-start-1 lg:row-start-3',
]

// Por dónde pasa la curva DENTRO de cada tarjeta: a 2/3 de su ancho en los
// pilares de la izquierda y a 1/3 en el de la derecha, y a 3/4 de su alto (o
// sea, cruzando la parte baja del párrafo, como en la referencia — no por en
// medio, que es donde el texto es más denso).
//
// ⚠️ Que el punto esté DENTRO de la tarjeta y no en el pasillo es la decisión
// que lo desbloquea todo (2026-07-22, 2ª vuelta, Samuel: "no hay problema que
// la línea se ponga por encima de los textos como en la imagen de
// referencia"). La 1ª versión tenía que esquivar el texto, y esquivar salía
// carísimo: obligaba a un pasillo enorme para que la curva pudiera girar sin
// tocar nada, lo que a su vez estrechaba las tarjetas (texto compacto) y las
// separaba en X. Al permitir el cruce, la curva gira sobre el propio texto:
// las columnas vuelven a 5 de 12 y se acercan (col-start-8 en vez de 9), el
// pasillo se reduce a la mitad y AUN ASÍ el barrido horizontal casi se dobla,
// porque ahora los extremos de la curva viven dentro de las columnas en vez
// de en el hueco central.
const PUNTO = ['lg:left-2/3', 'lg:left-1/3', 'lg:left-2/3']

// Dónde cuelga la foto de apoyo de cada paso: SIEMPRE en la mitad opuesta a su
// tarjeta (`left-full` para los pilares de la izquierda, `right-full` para el
// de la derecha). El zigzag deja media rejilla vacía enfrente de cada tarjeta,
// así que la foto no tapa una sola palabra Y de paso rellena el hueco muerto
// que esa mitad vacía dejaba en la maqueta anterior. El ladeo alterna de signo
// (.recorrido-imagen--izq/--der) para que no parezcan 3 fotos clonadas.
const FOTO = [
  { pos: 'lg:left-full lg:ml-16', giro: 'recorrido-imagen--der' },
  { pos: 'lg:right-full lg:mr-16', giro: 'recorrido-imagen--izq' },
  { pos: 'lg:left-full lg:ml-16', giro: 'recorrido-imagen--der' },
]

export function RecorridoSostenibilidad({ activo }: { activo: boolean }) {
  const recorridoRef = useRef<HTMLDivElement>(null)
  useRecorridoSostenibilidad(recorridoRef, { activo }) // [dev-mode] gate

  return (
    <section>
      <p className="sost-reveal text-eyebrow font-semibold uppercase tracking-[0.12em] text-navy-soft">
        {SOSTENIBILIDAD.pilaresTitulo}
      </p>

      <div ref={recorridoRef} className="relative mt-6 lg:mt-12">
        {/* El viewBox lo escribe el hook (se sincroniza 1:1 con el alto real
            del bloque), y el `d` de los dos paths también — por eso salen
            vacíos del JSX. overflow-visible: el trazo asoma por arriba y por
            abajo (--spacing-recorrido-margen) para que el barco entre y salga
            de cuadro navegando.

            z-10 (2026-07-22, 2ª vuelta): ruta y barco pintan POR ENCIMA de los
            pilares. Las tarjetas son `relative`, o sea elementos posicionados
            con z-index auto, así que sin esto ganaban por orden de DOM (van
            después) y la ruta quedaba escondida detrás del texto en los
            cruces. Ambos son pointer-events-none, así que estar por encima no
            roba ni un clic ni una selección de texto. */}
        <svg className="recorrido-trazo z-10 hidden lg:block" aria-hidden="true" focusable="false">
          <path className="recorrido-ruta" />
        </svg>

        {/* El catamarán REAL del cliente — el mismo recorte que zarpa del CTA
            del hero de la home (hero.tsx), no un icono de barco. */}
        {/* z-30: el barco navega por encima de TODO — ruta (z-10), texto y
            fotos (z-20). Es el cursor del recorrido; pasar por detrás de una
            foto lo haría desaparecer justo en el momento en que esa foto es la
            protagonista. */}
        <div className="recorrido-barco z-30 hidden lg:block" aria-hidden="true">
          <img src="/fotos/catamaran-recorte.webp" alt="" width={276} height={360} />
        </div>

        {/* Móvil: lista apilada con hairlines, tal cual estaba. lg: rejilla de
            12 en zigzag, sin divisorias (las separa el propio recorrido). */}
        <div className="divide-y divide-linea border-t border-linea lg:grid lg:grid-cols-12 lg:gap-y-recorrido-fila lg:divide-y-0 lg:border-t-0">
          {SOSTENIBILIDAD.pilares.map((p, i) => (
            <article
              key={p.id}
              id={p.id}
              // SIN `.sost-reveal` a propósito (ver use-recorrido-sostenibilidad.ts):
              // el batch de reveal desplaza el bloque 24px en Y, y el trazado se
              // mide con getBoundingClientRect — mediría contra una posición que
              // todavía se está animando y la curva quedaría despegada de las
              // tarjetas. Aquí la entrada YA la pone el recorrido: el barco que
              // llega y la foto del paso que se destapa.
              // scroll-mt-sticky-top (antes header-alto): desde el 2026-07-28
              // el chrome que hay que despejar al saltar a un ancla es la
              // fila de chips (ui/nav-anclas-chips.tsx), cuyo alto ES
              // --spacing-anclas-alto. Ese token tiene que ser el mismo en
              // TODAS las secciones ancladas de la página: el scroll-spy
              // deriva de él su línea de disparo (use-anclas-activa.ts).
              className={`relative scroll-mt-sticky-top py-10 lg:col-span-5 lg:py-0 ${POSICION[i]}`}
            >
              <p className="sost-numero" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="sost-item-titulo font-display text-h3 font-semibold text-navy">{p.titulo}</h3>
              <p className="mt-3 text-lead text-navy-sub">{p.texto}</p>

              {/* [v2 2026-07-28, slide 60] «Hitos ambientales reales»: los 3
                  logros de conservación, con nombre propio. Su maqueta los
                  pinta como 3 cards con ring dentro de una banda verde; aquí
                  van como hairlines dentro del paso que ya los cuenta — ni
                  cajas ni sección nueva, que sería contar dos veces lo mismo.
                  Tipografía por debajo del párrafo del pilar (text-sm): son
                  el detalle del paso, no un segundo titular compitiendo.
                  Solo el pilar de conservación los trae (ver PilarSost).
                  Sin hairlines desde el 2026-07-28 (Samuel: «al cliente no le
                  gusta tanta línea»), pero TAMPOCO sueltos —en cuanto se
                  quitaron se veían flotando—: los agrupa una superficie
                  --color-papel-hueso, plana y sin borde. Es la única caja en
                  todo el paso (el pilar es texto sobre papel con su numeral
                  fantasma, no una card), así que no anida nada. Mismo recurso
                  que la banda de impacto y que el teaser de la fundación: un
                  solo device para todos los grupos de esta página. */}
              {p.hitos ? (
                <ul className="mt-6 flex flex-col gap-5 rounded-card bg-papel-hueso p-5">
                  {p.hitos.map((h) => (
                    <li key={h.titulo}>
                      <p className="text-sm font-semibold text-navy">{h.titulo}</p>
                      <p className="mt-1 text-sm text-navy-soft">{h.texto}</p>
                    </li>
                  ))}
                </ul>
              ) : null}

              {/* Foto de apoyo del paso. En MÓVIL va en el flujo, debajo del
                  texto y siempre visible (no hay recorrido que la dispare). En
                  lg+ salta a la mitad vacía de la fila y el hook la funde al
                  entrar y salir del paso. `lazy` porque las 3 viven bien por
                  debajo del pliegue. */}
              <img
                src={`/fotos/${p.foto}.webp`}
                alt={p.fotoAlt}
                loading="lazy"
                decoding="async"
                className={`recorrido-imagen ${FOTO[i]!.giro} mt-6 lg:absolute lg:top-0 lg:z-20 lg:mt-0 ${FOTO[i]!.pos}`}
              />

              {/* La escala del recorrido: solo una MARCA de medición, sin
                  pintura (size-0). Se probó con un punto aqua visible y no
                  funciona: al quedar a 4rem de la tarjeta, en mitad del
                  pasillo, no se lee como "la parada de este pilar" sino como
                  una viñeta suelta que no pertenece a nada. La referencia que
                  pasó Samuel tampoco los tiene — el trazo y el numeral ya
                  dicen dónde está cada hito. */}
              <span
                data-recorrido-punto
                aria-hidden="true"
                className={`absolute top-3/4 hidden size-0 lg:block ${PUNTO[i]}`}
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
