import { useId } from 'react'
import { t } from '@/lib/i18n'

// SELLO «SUSTAINABLE VESSEL» — el distintivo eco de las cards de flota.
//
// v3 2026-08-07, PowerPoint slide 68 («efecto/más moderno» sobre el grid de
// barcos) + 📞 reunión 07-31 (15:40–16:17): «estos logos que tengamos en la
// ficha: embarcación sostenible» → Samuel: «como un sello, una estampa ahí de
// eco… más llamativos, claro, que resalte». Aclarado el 2026-08-06: el diseño
// de las cards NO se modifica, solo se le agrega el badge.
//
// ── POR QUÉ ESTE SELLO EXISTE APARTE DEL DE LA CINTA ─────────────────────
// Ya hay un sello eco en el proyecto: `SelloEco`, PRIVADO dentro de
// home/eco-friendly.tsx. No se reutiliza, y no es por descuido:
//
// Aquel es un DISCO PLANO y debe seguir siéndolo — vive sobre la cinta de
// menta, que es una superficie plana. Este vive sobre FOTO Y VÍDEO. Y el disco
// plano sobre foto YA SE PROBÓ Y SE DESCARTÓ: el 2026-07-28, en el banner de
// cero plástico de esta misma página, con este veredicto anotado en el registro
// («por eso `SelloEco` vuelve a NO exportarse»):
//
//   «un disco plano sobre una foto se lee como pegatina por bien dibujado que
//    esté, y eso no se arregla con tamaño ni con sombra»
//
// Lo que SÍ aguanta sobre foto en esta web es ui/sello-tripadvisor.tsx, y
// aguanta por un motivo que también está escrito: se lee como UN objeto de
// metal con volumen y no como tres capas apiladas. Esta pieza copia ESA receta,
// no la del disco:
//
//   · La cara tiene arriba y abajo (degradado vertical), filo especular blanco
//     en el canto de arriba y canto en sombra abajo. Es el mismo diagnóstico
//     que arregló la cinta en la v3: «lo que hace que un material se lea como
//     caro es que RESPONDA A LA LUZ».
//   · Sombra proyectada corta: el sello está APOYADO en la escena, no flotando.
//   · Un destello que cruza la pieza ENTERA —anillo incluido— enmascarado por
//     la UNIÓN de las dos formas. Es el detalle que hace que se lea como un
//     objeto y no como un disco con un aro detrás, y es exactamente donde la
//     versión CSS del sello de TripAdvisor se rompía.
//
// ⚠️ LA HOJA ES LA MISMA MARCA que la del sello de la cinta, y su geometría
// está duplicada en los dos archivos. Si algún día cambia el dibujo de la hoja,
// hay que cambiarlo AQUÍ Y en home/eco-friendly.tsx. Unificarlas pide sacar
// `SelloEco` a esta carpeta con una variante plano/volumen, y eso toca
// use-eco-friendly-reveal.ts, que anima esa estructura nodo a nodo (los trazos
// que se dibujan, el pop del relleno, el `.eco-vivo` que arranca los bucles al
// terminar) — o sea, rehacer una pieza aprobada de la home para no repetir un
// path. No se hace en la pasada del slide 68; queda anotado.
//
// ── LA CARA ES CLARA, NO AQUA ────────────────────────────────────────────
// Contraintuitivo para un sello eco, y deliberado: el fondo de estas cards es
// mar del Caribe. Un disco aqua sobre agua turquesa desaparece. Blanco
// esmaltado con canto y hoja de marca destaca sobre agua, sobre arena y sobre
// el velo navy del pie de la media, que es donde se monta — y de paso rima con
// las otras píldoras de la card, que son papel al 90% y no color de marca.
//
// ── EL MOVIMIENTO ES CONSTANTE, NO AL HOVER ──────────────────────────────
// El sello de TripAdvisor destella solo al pasar el ratón. Aquí no vale: la
// queja del cliente sobre la pieza eco de la home fue literalmente que «tiene
// una animación de entrada pero luego se queda quieto», y pidió movimiento
// CONSTANTE y sutil. Un brillo que solo existe al hover no lo tiene, y en
// táctil no existiría nunca. Los tres bucles (anillo, hoja, destello) corren
// solos, desincronizados y lentos, y se detienen con `prefers-reduced-motion`:
// el sello se lee igual de bien quieto —el movimiento es materia, no
// información— y ese estado quieto es además el frame que viaja a Figma.
//
// ── SIN TEXTO VISIBLE ────────────────────────────────────────────────────
// A 56px, un rótulo curvado en el canto («SUSTAINABLE VESSEL ·») sería
// tipografía de 5px: ilegible, y encima ensuciaría la única cosa que tiene que
// leerse, la hoja. El reclamo va a `sr-only`, mismo criterio que la variante
// `sinTexto` del sello de TripAdvisor: sin él, quien navega con lector de
// pantalla vería un adorno donde el resto ve el distintivo.
//
// ⚠️ EL COPY NO DICE «CERTIFIED». El plan 02 dejaba abierto «Sustainable
// vessel» / «Eco certified» y lo segundo NO se puede escribir: en data/flota.ts
// no hay ninguna certificación por barco. Lo que sí está marcado
// `origen: 'verificado'` —de las políticas ya publicadas del cliente— es el
// cero plástico y la aportación a la fundación, y eso es lo que dice el
// reclamo. «Embarcación sostenible» son palabras del propio cliente en la
// reunión; una certificación que no consta sería inventarle un sello.
// EL RÓTULO DE LA ORLA. Sale del copy de la cinta eco de la home, como pidió
// Samuel («puede ser el mismo texto del home»), y son SUS DOS FRASES juntas y no
// una duplicada. Él planteó duplicar «y ponerle un punto entre las frases
// repetidas» con una condición —«si es muy poco texto, para que no se haga tan
// grande»— y el objetivo de esa condición era que la tipografía no creciera:
// juntando las dos frases reales de la home ya son 39 caracteres, que llenan la
// circunferencia con letra del mismo tamaño que daría duplicar una sola (48), y
// además dicen dos cosas en vez de la misma dos veces. Los puntos separadores sí
// son los suyos, y van al final de las dos para que la vuelta cierre.
const ORLA_TEXTO = 'ECO-FRIENDLY · ZERO PLASTIC ON BOARD · '

// El radio del rótulo y su circunferencia exacta. La circunferencia se pasa a
// `textLength` para que el texto ocupe la vuelta COMPLETA: sin eso, el rótulo
// acaba donde acabe —dejando un hueco o solapando el inicio— y el interletraje
// depende de la fuente que haya cargado. Con `textLength`, los dos puntos caen
// siempre enfrentados y la orla se lee como el canto grabado de un sello.
const ORLA_RADIO = 62
const ORLA_VUELTA = +(2 * Math.PI * ORLA_RADIO).toFixed(2)

export function SelloEco({ className = '' }: { className?: string }) {
  // Los `id` de SVG son GLOBALES del documento: seis cards en la misma página
  // compartirían máscara y degradados, y las cinco últimas pintarían con las
  // formas de la primera. `useId` les da sufijo único por instancia — misma
  // trampa y misma solución que en ui/sello-tripadvisor.tsx.
  const uid = useId().replace(/:/g, '')
  const idCara = `sello-eco-cara-${uid}`
  const idLuz = `sello-eco-luz-${uid}`
  const idMascara = `sello-eco-mascara-${uid}`
  const idOrla = `sello-eco-orla-${uid}`

  return (
    <span className={`sello-eco-marco ${className}`}>
      {/* ── LA ORLA ────────────────────────────────────────────────────────
          VA PRIMERA EN EL DOM, o sea DEBAJO del sello, y eso es lo que hace que
          «salga de detrás»: a su escala de arranque cabe entera tras el disco
          opaco, así que lo que se ve al hover es cómo asoma por el canto del
          sello, no cómo aparece encima de él.
          El lienzo mide 160 unidades para un tamaño del 160%, así que una unidad
          de la orla mide lo mismo que una del sello (100 unidades al 100%): los
          radios de las dos piezas se comparan directamente, sin conversiones —
          el disco está en r=40 y el rótulo en r=62, por fuera.
          `overflow-visible` porque el rebote del final de la salida se pasa un
          pelo del 100% y el lienzo lo recortaría justo en el fotograma que se
          nota. */}
      <svg
        viewBox="0 0 160 160"
        aria-hidden="true"
        className="sello-eco-orla overflow-visible"
      >
        <defs>
          {/* El círculo del rótulo, dibujado en sentido horario desde su punto
              más a la izquierda: así el texto se lee del tirón por arriba, con
              las letras de pie y mirando hacia fuera. En sentido contrario
              saldría boca abajo. */}
          <path
            id={idOrla}
            fill="none"
            d={`M ${80 - ORLA_RADIO} 80 a ${ORLA_RADIO} ${ORLA_RADIO} 0 1 1 ${ORLA_RADIO * 2} 0 a ${ORLA_RADIO} ${ORLA_RADIO} 0 1 1 ${-ORLA_RADIO * 2} 0`}
          />
        </defs>
        {/* ⚠️ AQUÍ NO VA NINGUNA SUPERFICIE, y es una decisión, no un olvido.
            Una versión anterior puso un ala de vidrio navy con filo especular
            detrás del rótulo, para que la letra no dependiera de lo que le tocara
            detrás. Samuel lo descartó al verlo: «le pusiste al texto un fondo
            azul, ponlo de color azul el texto y ya, sin fondo». El rótulo se
            defiende solo en navy — que además es lo que hace un sello grabado:
            relieve, no etiqueta. Ver el token --color-sello-eco-orla para la
            consecuencia anotada (la mitad de abajo cae sobre el cielo/mar oscuro
            del techo de la foto y ahí pierde contraste). */}
        <g className="sello-eco-orla-giro">
          <text
            className="font-display"
            fill="var(--color-sello-eco-orla)"
            fontSize="15"
            fontWeight="600"
          >
            <textPath href={`#${idOrla}`} textLength={ORLA_VUELTA} lengthAdjust="spacing">
              {ORLA_TEXTO}
            </textPath>
          </text>
        </g>
      </svg>

      {/* ── EL SELLO ───────────────────────────────────────────────────────
          `relative` para quedar por encima de la orla sin inventar un z-index:
          entre un hermano posicionado y uno estático, gana el posicionado. */}
      <span className="sello-eco relative block size-full">
      <svg viewBox="0 0 100 100" aria-hidden="true" className="size-full">
        <defs>
          {/* La cara esmaltada: alto con luz, bajo girado hacia la sombra. Un
              relleno plano es lo que hacía «pegatina» al disco de la cinta
              cuando se probó sobre foto. */}
          <linearGradient id={idCara} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--color-sello-eco-cara-luz)" />
            <stop offset="1" stopColor="var(--color-sello-eco-cara-sombra)" />
          </linearGradient>

          {/* Banda de luz estrecha e inclinada. Ancha sería un velo blanco
              encima que apagaría la pieza en vez de recorrerla. */}
          <linearGradient id={idLuz} x1="0" y1="0" x2="1" y2="0" gradientTransform="rotate(12 0.5 0.5)">
            <stop offset="0.35" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0.66" />
            <stop offset="0.65" stopColor="#fff" stopOpacity="0" />
          </linearGradient>

          {/* LA UNIÓN: el anillo (girando) + el disco. El destello solo existe
              donde hay sello, así que no se ve la banda cruzando el aire de
              alrededor — y cruza el anillo Y la cara con la MISMA luz, que es
              lo que las hace una sola superficie. El anillo va aquí con su
              propia clase de giro: al compartir animación con el de fuera y
              arrancar en el mismo frame, van sincronizados. */}
          <mask id={idMascara}>
            <circle
              className="sello-eco-anillo"
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#fff"
              strokeWidth="4"
              strokeDasharray="0.5 8"
              strokeLinecap="round"
            />
            <circle cx="50" cy="50" r="40" fill="#fff" />
          </mask>
        </defs>

        {/* ── EL ANILLO DE PUNTOS, girando ──────────────────────────────────
            PUNTOS, no rayas. El primer montaje usaba `4 5` con 2,5 de grosor y
            a este tamaño eso es un aro casi continuo: girando se veía QUIETO,
            porque un anillo sin huecos claros no tiene nada que delate el giro.
            Con `0.5 8` y remate redondo son ~33 puntos separados y la vuelta se
            percibe. Es el mismo problema que ya obligó a limitar la duración
            del anillo de la cinta (--eco-anillo-giro-duracion, «a menos de 30s
            parece un spinner»), visto por el otro lado. */}
        <circle
          className="sello-eco-anillo"
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="var(--color-sello-eco-anillo)"
          strokeWidth="3"
          strokeDasharray="0.5 8"
          strokeLinecap="round"
        />

        {/* ── EL DISCO: canto, cara y los dos filos ─────────────────────── */}
        {/* El canto es un círculo lleno DEBAJO de la cara, no un `stroke` sobre
            ella: un contorno se lee como línea dibujada, un canto asomando se
            lee como el grosor de una pieza física. 2 unidades de canto y no 3
            (primer montaje): con el anillo de puntos también en aqua, 3 unidades
            sumaban demasiado teal alrededor de una cara que es lo que tiene que
            destacar sobre el agua. */}
        <circle cx="50" cy="50" r="40" fill="var(--color-sello-eco-canto)" />
        <circle cx="50" cy="50" r="38" fill={`url(#${idCara})`} />
        {/* Filo especular arriba y canto en sombra abajo: dos arcos, no un
            anillo entero. La luz viene de arriba, así que solo el hombro
            superior brilla — un aro completo de blanco sería un halo.
            ⚠️ VAN A r=37, PEGADOS AL BORDE DE LA CARA (que es r=38). El primer
            montaje los puso a r=34 y se leían como dos curvas dibujadas FLOTANDO
            dentro del disco —una ceja y una sonrisa— en vez de como el canto de
            la pieza: un filo especular es el borde recibiendo luz, así que si no
            está EN el borde no es un filo, es un adorno. Los extremos caen a 30°
            de la horizontal para que cada arco cubra el hombro y no el costado,
            que es por donde la luz resbala. */}
        <path
          d="M18 31.5A37 37 0 0 1 82 31.5"
          fill="none"
          stroke="var(--color-sello-eco-filo)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M18 68.5A37 37 0 0 0 82 68.5"
          fill="none"
          stroke="var(--color-sello-eco-canto-sombra)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />

        {/* ── LA HOJA, meciéndose desde su base ─────────────────────────────
            ⚠️ NO ES LA HOJA DE LA CINTA REESCALADA, y el primer montaje sí lo
            intentó: aquel dibujo es una forma SIMÉTRICA (dos arcos que cierran
            en punta arriba y abajo) con nervadura vertical y dos venillas, y a
            80-112px en la cinta funciona. Puesto a 56px se leía como UNA GOTA
            CON UNA RAYA — o peor, como un botón de encendido: las venillas
            desaparecían, la nervadura vertical no daba dirección y la forma
            llenaba la cara de lado a lado sin dejar respirar al esmalte.
            Verificado en pantalla antes de cambiarlo.

            Esta hoja está dibujada PARA este tamaño, con tres decisiones:
              · ES ASIMÉTRICA Y VA LADEADA (base abajo-izquierda, punta
                arriba-derecha). Una hoja simétrica y vertical es una gota; en
                diagonal, con la punta a un lado, se lee como hoja al instante.
              · TIENE TALLO. Es lo que la ancla como cosa que creció y no como
                mancha, y son 7 unidades de trazo.
              · LA NERVADURA VA EN NEGATIVO, en el color claro de la cara, no en
                aqua-dark sobre aqua. Ese fue el diagnóstico literal de Samuel
                sobre la hoja de la cinta el 2026-07-22 —«el stroke se parece al
                color de la hoja»— y a este tamaño no hay margen para
                resolverlo con tiempos de animación como se hizo allí: la línea
                tiene que verse en el frame 1.
              · Sin venillas. A 44px en móvil solo ensucian la única cosa que
                tiene que leerse. */}
        <g className="sello-eco-hoja">
          {/* El tallo va PRIMERO para que el cuerpo de la hoja lo tape donde se
              juntan: un tallo que asoma por encima del relleno se ve como una
              línea pegada, no como la rama de la que sale. */}
          <path
            d="M38.5 65.5 31 73"
            fill="none"
            stroke="var(--color-aqua-dark)"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <path
            d="M38 66C38 44 50 32 69 31 68 50 56 66 38 66Z"
            fill="var(--color-aqua)"
            stroke="var(--color-aqua-dark)"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M39.5 64.5C46 55 54 45.5 66.5 34"
            fill="none"
            stroke="var(--color-sello-eco-cara-luz)"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </g>

        {/* ── EL DESTELLO ──────────────────────────────────────────────────
            La máscara va en el <g> y el movimiento en el <rect> de dentro: si
            se animara el elemento enmascarado, la máscara viajaría con él y la
            luz se quedaría quieta respecto al sello — o sea, no habría
            barrido. Misma lección que el sello de TripAdvisor. */}
        <g mask={`url(#${idMascara})`}>
          <rect
            className="sello-eco-destello"
            x="0"
            y="0"
            width="100"
            height="100"
            fill={`url(#${idLuz})`}
          />
        </g>
        </svg>
      </span>

      {/* El reclamo accesible. NO se duplica con el rótulo de la orla: ese svg va
          `aria-hidden`, porque un lector de pantalla leyendo un texto circular
          repetido —y que además solo existe al hover, un gesto que no tiene—
          sería ruido. Aquí se dice una vez y en orden. */}
      <span className="sr-only">{t('Sustainable vessel, zero plastic on board')}</span>
    </span>
  )
}
