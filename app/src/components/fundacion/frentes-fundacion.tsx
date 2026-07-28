import { useRef, useState } from 'react'
import { FUNDACION } from '@/data/fundacion'
import { useDevFlag } from '@/dev/use-dev-flag'
import { useFrentesHorizontal } from './use-frentes-horizontal'

// LOS 5 FRENTES DE TRABAJO (slide 63) — 3ª versión, 2026-07-28.
//
// (1) Lista editorial: cinco párrafos apilados con numeral fantasma gigante
//     en una sola columna y 700px de blanco a la derecha. Era la 4ª aparición
//     seguida del patrón en el proyecto y con cinco items cortos sonaba a
//     plantilla.
// (2) Rejilla de dos con una palabra clave por frente. Escaneable, pero
//     Samuel: «hay que hacer más llamativa esta sección, puede ser que cada
//     cosa en la que trabaje la fundación sea una card grande y que se
//     desplacen horizontalmente con GSAP, que tenga su texto a la izquierda,
//     imagen a la derecha, y luego el scroll vuelve a la normalidad vertical».
// (3) Esto: cinco CARDS GRANDES que se barren en horizontal mientras el
//     bloque se queda pinchado, y al terminar el scroll sigue bajando como si
//     nada.
//
// Es el bloque con más peso de la página y se lo ha ganado: son cinco
// programas concretos y verificables («peces loro, langostas, capitanes,
// pargos» no lo escribe una IA genérica). A card grande, cada uno tiene sitio
// para su foto y para leerse sin competir con los otros cuatro.
//
// LA PALABRA CLAVE (Coral · Especies · Limpieza · Pesca · Educación) se
// mantiene de la versión anterior: es el asa por la que se agarra cada card
// de un vistazo, y en un barrido horizontal —donde no se ven las cinco a la
// vez— importa todavía más saber en cuál estás.
//
// LA MECÁNICA vive entera en use-frentes-horizontal.ts. Aquí solo hay dos
// cosas que mirar: el `sticky` y el `overflow` son utilidades `lg:`, así que
// SIN hook (móvil, reduced-motion, ?dev-frentes=estatico, Figma) esto es una
// lista vertical normal de cinco cards; y los `data-frentes-*` son los
// ganchos que busca el hook — no llevan estilo.
//
// ⚠️ Dos de las cinco fotos son del ÁREA, no del programa (`contexto: true`
// en data/fundacion.ts): no existe ninguna foto de las jornadas de limpieza
// ni del trabajo con pescadores. Sus textos alternativos dicen exactamente
// lo que se ve y ningún pie da por hecho lo que la foto no enseña.
//
// (4) Y desde el 2026-07-28 son SEIS, no cinco: el proyecto insignia entró
//     como primera card del barrido. Ver CARDS, más abajo.

// LA CAJA DE CADA CARD. En lg mide --spacing-fund-frente (= 100vw) y se
// recorta contra los cantos de la pantalla, que es lo que hace que entre y
// salga de cuadro; en móvil es un bloque más de la lista vertical.
//
// SIN FONDO EN EL BARRIDO (2026-07-28, 2ª vuelta — Samuel: «que las cards de
// scroll horizontal no tengan fondo, se vea blanco»). Desde lg desaparecen el
// --color-papel-hueso y el navy de la primera: lo que separa una card de la
// siguiente ya no es un color, es que entran y salen de cuadro y que su
// contenido se retira y aparece (ver use-frentes-horizontal.ts).
//
// ⚠️ EN MÓVIL EL FONDO SE QUEDA. Ahí no hay barrido —es una lista vertical— y
// sin superficie las seis se funden en un solo muro de texto sin principio ni
// final. El pedido era para «las cards de scroll horizontal», y en móvil no
// las hay.
const CARD =
  'rounded-card-grande bg-papel-hueso py-6 sm:py-8 lg:flex lg:min-h-fund-frente-alto lg:w-fund-frente lg:flex-col lg:justify-center lg:rounded-none lg:bg-transparent lg:py-12'

// EL CONTENIDO NO CRECE CON LA CARD. Con la card a 100vw, estirar el interior
// deja la columna de texto en ~950px de vuelta de lectura y un desierto entre
// el párrafo y la foto — medido, no supuesto: la primera versión usaba
// max-w-contenido (1400px) y el título se iba a una sola línea de lado a lado.
// 64rem es lo que suman una columna de texto cómoda (~570px), el hueco y los
// 384px de la foto, que no puede crecer más sin verse blanda (los originales
// miden 368 de ancho). La card es protagonista por TAMAÑO; lo que lleva
// dentro sigue leyéndose como siempre.
const CONTENIDO = 'mx-auto w-full max-w-5xl px-6 sm:px-10'

// LAS SEIS CARDS, en un solo molde (2026-07-28, 3ª vuelta — Samuel: «que la
// primera card de arrecifes artificiales sea igual que las demás, que tenga
// una sola imagen a la derecha, no 2»).
//
// El proyecto insignia entró al barrido conservando su forma anterior: fondo
// navy y dos fotos clavadas en ángulo. Dentro de un carrusel eso no se leía
// como «la primera de seis» sino como otra cosa que se ha colado. Ahora usa el
// MISMO molde y se distingue por lo único que debe distinguirlo: su rótulo
// («El proyecto insignia» en vez de un numeral) y el sitio, que es el primero.
//
// De sus dos fotos se queda la PRIMERA — los bloques sumergidos tapados de
// peces, que es lo que un arrecife artificial ES. La segunda era la tortuga:
// bonita, pero ilustra el mar, no el proyecto.
//
// ⚠️ Esto dejó `fundacion/arrecife-artificial.tsx` sin consumidores y se ha
// borrado. `.fund-foto` (componentes.css) y los tokens --fund-foto-rot-* eran
// suyos y quedan SIN USAR — no se retiran aquí a propósito: una clase CSS que
// desaparece no da error, solo deja de aplicarse, así que borrarlas mientras
// otra rama pueda estar montando algo encima es la clase de limpieza que se
// paga cara. Están marcadas para la próxima pasada de limpieza.
const CARDS = [
  {
    numeral: null,
    clave: FUNDACION.destacado.eyebrow,
    titulo: FUNDACION.destacado.titulo,
    texto: FUNDACION.destacado.texto,
    foto: FUNDACION.destacado.fotos[0].src,
    fotoAlt: FUNDACION.destacado.fotos[0].alt,
  },
  ...FUNDACION.frentes.map((frente, i) => ({
    numeral: String(i + 1).padStart(2, '0'),
    clave: frente.clave,
    titulo: frente.titulo,
    texto: frente.texto,
    foto: frente.foto,
    fotoAlt: frente.fotoAlt,
  })),
]

export function FrentesFundacion() {
  const escenarioRef = useRef<HTMLDivElement>(null)

  // [dev-mode] ?dev-frentes=estatico desengancha el barrido y deja las cinco
  // cards apiladas en vertical — el frame limpio que viaja a Figma (a Figma
  // no va un pin de scroll, va la lista). Ver dev-registry.ts.
  const [estatico, setEstatico] = useState(false)
  useDevFlag('dev-frentes', (v) => setEstatico(v === 'estatico')) // [dev-mode]
  useFrentesHorizontal(escenarioRef, { activo: !estatico }) // [dev-mode] gate

  return (
    // El alto lo escribe el hook (es la duración del barrido). Sin hook, el
    // alto es el del contenido y el bloque se comporta como cualquier otro.
    <div ref={escenarioRef} className="relative mt-10">
      <div
        data-frentes-viewport
        className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:overflow-hidden"
      >
        {/* En móvil la pista es una lista vertical dentro del contenedor de la
            página; en lg el escenario va A SANGRE (ver pages/fundacion.tsx) y
            las cards miden 100vw, así que el padding lateral lo pone cada card
            por dentro y aquí no hay ninguno. */}
        <div
          data-frentes-pista
          className="fund-pista flex flex-col gap-5 px-5 sm:px-10 lg:w-max lg:flex-row lg:items-stretch lg:gap-8 lg:px-0"
        >
          {CARDS.map((tarjeta) => (
            <article key={tarjeta.titulo} data-frente-card className={CARD}>
              {/* `lg:flex-1` + `lg:items-stretch`: la cadena que hace que el
                  panel de la foto llegue de arriba abajo de la card. Sin ella,
                  un `h-full` sobre un hijo de un flex centrado no resuelve
                  contra nada y la foto se queda a su alto natural. */}
              <div
                className={`flex flex-col gap-6 lg:flex-1 lg:flex-row lg:items-stretch lg:gap-12 ${CONTENIDO}`}
              >
                {/* `data-frente-anim`: los nodos que entran y se retiran con
                    el paso del barrido. El orden del DOM es el del stagger —
                    rótulo, título, texto y la foto al final. */}
                <div className="lg:flex lg:flex-1 lg:flex-col lg:justify-center">
                  <p
                    data-frente-anim
                    className="flex items-baseline gap-2.5 text-eyebrow font-semibold uppercase tracking-[0.14em]"
                  >
                    {tarjeta.numeral ? (
                      <span className="text-aqua-dark">{tarjeta.numeral}</span>
                    ) : null}
                    <span className={tarjeta.numeral ? 'text-navy-soft' : 'text-aqua-dark'}>
                      {tarjeta.clave}
                    </span>
                  </p>

                  <h3
                    data-frente-anim
                    className="mt-4 text-balance font-display text-h2 font-semibold text-navy"
                  >
                    {tarjeta.titulo}
                  </h3>
                  <p data-frente-anim className="mt-4 text-lead text-navy-sub">
                    {tarjeta.texto}
                  </p>
                </div>

                {/* La foto es un PANEL a todo el alto de la card, no una
                    miniatura al lado del texto: es lo que hace que esto se lea
                    como card grande y no como una fila de lista con imagen.
                    El ANCHO sí está topado en --spacing-fund-frente-foto
                    (384px, un pelo por encima de los 368 del original): a lo
                    ancho no se estira, así que el desenfoque queda acotado al
                    alto y en una foto —no en texto— no se nota. Por eso el
                    contenido de la card NO crece con ella (ver CONTENIDO). */}
                <div
                  data-frente-anim
                  className="aspect-[4/3] overflow-hidden rounded-card lg:aspect-auto lg:w-fund-frente-foto lg:shrink-0"
                >
                  <img
                    src={`/fotos/${tarjeta.foto}.webp`}
                    alt={tarjeta.fotoAlt}
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* La barra de progreso: dice que esto se barre y cuánto queda. Solo
            en lg — por debajo no hay barrido que medir, la lista baja sola. */}
        <div aria-hidden="true" className="mt-10 hidden justify-center lg:flex">
          <div className="h-0.5 w-40 overflow-hidden rounded-full bg-linea">
            <div data-frentes-barra className="h-full origin-left scale-x-0 bg-aqua" />
          </div>
        </div>
      </div>
    </div>
  )
}
