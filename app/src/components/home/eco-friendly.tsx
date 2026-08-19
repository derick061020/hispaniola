import { useRef, useState } from 'react'
import { useDevFlag } from '@/dev/use-dev-flag'
import { useEcoFriendlyReveal } from '@/components/home/use-eco-friendly-reveal'
import { t } from '@/lib/i18n'

// Cintillo «Eco-friendly · Cero plástico a bordo» (2026-07-17, pedido de
// Samuel) — la web actual tiene esto como una banda azul sólida a sangre,
// justo debajo de los premios ("ECO FRIENDLY [ícono] NO PLASTIC"). Copiar esa
// banda tal cual violaría el guardarraíl de la dirección B (direccion-visual.md
// §6: el color vive en las fotos, nunca en un fondo grande y plano) — así que
// en vez de un azul a sangre, el mensaje vive en un CINTILLO DELGADO con un
// sello sobresaliendo por arriba y por abajo, como un sello sobre una cinta.
// El fondo no es sólido: es un linear-gradient horizontal (transparente →
// --color-menta en el tramo 15%-85% → transparente) — el color se concentra
// detrás del sello y se disuelve al blanco de la web en los extremos.
//
// CORRECCIONES v1 DEL CLIENTE (2026-07-20, planes/01-home.md slide 4:
// «rehacer con un formato más moderno y actual y mejor calidad»).
//
// Lo que se veía viejo NO era el cintillo (que ya es un rediseño nuestro):
// era la INSIGNIA. `/marca/eco-friendly-logo.png` es el sello que el cliente
// tiene en su web desde hace años — un PNG pequeño, de bordes duros, con
// degradados de 2012 y tipografía incrustada. A 112px de display se veía
// pixelado, y no hay versión en alta.
//
// Por eso el sello pasa a ser un SVG nuestro, dibujado con los tokens de la
// paleta: escala perfecta a cualquier tamaño, pesa nada, y en Figma es un
// componente vectorial de verdad en vez de una imagen incrustada. Mantiene
// la IDEA del original (una hoja dentro de un círculo, la lectura "natural")
// sin arrastrar su ejecución.
//
// ⚠️ Si el cliente quiere conservar su sello histórico por reconocimiento de
// marca, hay que pedirle el original en vectorial (.ai/.svg/.eps) — el PNG
// de la web no da. Anotado en el plan como pendiente.
//
// Copy: "Eco-friendly" se deja en inglés (ya es el término que usa el propio
// footer — "Eco-friendly · Sin plástico · Desde 2012."); "Cero plástico a
// bordo" reutiliza la frase exacta del stat del hero ("0 / plástico a
// bordo") en vez de traducir "No Plastic" suelto, para que las 3 apariciones
// del dato en la home (hero, este cintillo, footer) hablen igual.
//
// CORRECCIONES v1 DEL CLIENTE, 2ª vuelta (planes/01-home.md slide 4: "rehacer
// con un formato más moderno y actual"): layout y copy siguen igual — lo que
// se pule es la animación (use-eco-friendly-reveal.ts). Los 3 trazos de línea
// (contorno, nervadura, venillas) llevan `eco-sello-trazo` (se DIBUJAN con
// stroke-dashoffset, como un boceto completándose); el disco + anillo
// punteado + relleno de la hoja llevan `eco-sello-fondo` y entran
// DESPUÉS, con rebote — el color es el remate del dibujo, no su acompañante
// (3ª vuelta, mismo día: al ir a la vez, el relleno adelantaba la silueta y
// el trazo no se notaba) — ver el hook para el porqué completo.
//
// CORRECCIONES v3 DEL CLIENTE (2026-08-06, PowerPoint slide 66 + reunión
// 07-31 12:46–14:25): «que tenga algún efecto eco y que el diseño sea más
// moderno». En la reunión Miguel concretó las dos partes: el «efecto eco» no
// es literal («mejor hagas un efecto o algo así chulo... como has hecho con
// el tema del barquito») y lo que le molesta es que el cintillo «tiene una
// animación de entrada pero luego se queda quieto» — quiere movimiento
// CONSTANTE, «sutil, un poquito más modernito». Su motivo es de negocio, no
// de estética: «es la única empresa que se apoya en la parte sostenible, por
// aquí nadie hace nada de eso».
//
// Lo que se veía viejo esta vez tampoco era el sello (ya rediseñado en la
// v1): era el RELLENO PLANO de la cinta —una barra de menta maciza—, el
// diagnóstico literal del «IA slop» del 07-28. La cinta pasa a tener materia
// (dos caras + filo de luz + hairline) y tres bucles lentos: olas por dentro
// —el mismo mecanismo que el CTA-mar, o sea «el tema del barquito»—, la hoja
// meciéndose y el anillo punteado girando. Todo en CSS (componentes.css) con
// tokens --eco-*; el JSX solo aporta los ganchos.
//
// Copy: «Cero plástico a bordo» → «Zero plastic on board», la misma frase que
// el stat del hero ya traducido ("0 / plastic on board") — las 3 apariciones
// del dato en la home siguen hablando igual. ⚠️ La 3ª, la del footer, sigue
// en español («Eco-friendly · Sin plástico · Desde 2012.»): es chrome
// compartido por todas las páginas y además arrastra el 2012 vs 2010 sin
// resolver, así que cae en el barrido F7 (plan 01 §5), no aquí.

// Sello eco: círculo con anillo + hoja + gota. Todo con currentColor y los
// tokens de la paleta (cero hex sueltos, regla de CLAUDE.md).
//
// [v2 2026-07-28] SIGUE SIN EXPORTAR, y ahora se sabe por qué. Se probó a
// reutilizarlo en el banner de cero plástico de /flota y Samuel lo descartó:
// «el icono a la derecha queda raro, no se ve integrado». El sello funciona
// en ESTE cintillo —fondo claro, franja de menta, nada detrás compitiendo—
// pero encima de una foto se lee como una pegatina, porque es un disco plano
// sobre una imagen con profundidad. Aquel banner lleva ahora el recorte real
// del catamarán. Si algún día hace falta el sello fuera de aquí, que sea con
// ese antecedente delante.
function SelloEco({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 96 96"
      className={className}
      role="img"
      aria-label={t('Eco-friendly seal, zero plastic on board')}
    >
      {/* Disco de fondo y anillo: el aqua de marca, con cuentagotas — es una
          pieza pequeña, no un fondo de sección. */}
      <circle className="eco-sello-fondo" cx="48" cy="48" r="46" fill="var(--color-menta)" />
      {/* [v3] El anillo va en su propio <g> porque el grupo es lo que GIRA en
          bucle (.eco-anillo, componentes.css): GSAP escribe transform inline
          en el <circle> para el pop de entrada, y una animación CSS sobre ESE
          mismo elemento le ganaría al inline y se comería el pop. */}
      {/* ⚠️ [v3] Ni el anillo ni el relleno de la hoja llevan ya `opacity` de
          atributo (tenían 0.55 y 0.18). No es un cambio de diseño: era un
          atributo MUERTO en producción y una trampa para el traspaso. GSAP
          los revela con autoAlpha, que al terminar deja `opacity: 1` INLINE y
          se come cualquier opacidad declarada — o sea que la web lleva desde
          la v1 enseñando el sello a plena fuerza, que es lo que Samuel vio y
          aprobó el 07-22 (y explica su queja de aquel día, «el stroke se
          parece al color de la hoja»: aqua-dark sobre aqua PLENO se parecen;
          sobre un 18% no). Lo único que hacían esos atributos era que
          ?dev-eco=estatico —el frame que viaja a Figma— saliera más pálido
          que la web real. Se quitan para que los dos estados coincidan. */}
      <g className="eco-anillo">
        <circle
          className="eco-sello-fondo"
          cx="48"
          cy="48"
          r="41"
          fill="none"
          stroke="var(--color-aqua)"
          strokeWidth="1.5"
          strokeDasharray="4 5"
          strokeLinecap="round"
        />
      </g>
      {/* [v3] Mismo motivo para la hoja entera (relleno + los 3 trazos): el
          grupo .eco-hoja se mece desde la base, los paths de dentro siguen
          siendo los que GSAP dibuja y rellena. */}
      <g className="eco-hoja">
        {/* Hoja: dos arcos que se cierran en punta arriba y abajo. */}
        <path
          className="eco-sello-fondo"
          d="M48 24c13 7 20 17 20 27 0 11-9 21-20 21s-20-10-20-21c0-10 7-20 20-27z"
          fill="var(--color-aqua)"
        />
        <path
          className="eco-sello-trazo"
          d="M48 24c13 7 20 17 20 27 0 11-9 21-20 21s-20-10-20-21c0-10 7-20 20-27z"
          fill="none"
          stroke="var(--color-aqua-dark)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Nervadura: la línea que hace que la forma se lea como hoja y no como
            gota. Llega hasta la punta inferior. */}
        <path
          className="eco-sello-trazo"
          d="M48 30v40"
          stroke="var(--color-aqua-dark)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          className="eco-sello-trazo"
          d="M48 44c-5 2-8 5-10 9M48 56c4 1.5 7 4 9 7"
          fill="none"
          stroke="var(--color-aqua-dark)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.7"
        />
      </g>
    </svg>
  )
}

export function EcoFriendly() {
  const sectionRef = useRef<HTMLElement>(null)

  // [dev-mode] ?dev-eco=estatico congela el reveal en su estado FINAL (texto
  // visible, sello ya dibujado del todo) → frame limpio para Figma. Ver
  // dev-registry.ts. Sin GSAP enganchado, el cintillo se ve directamente
  // asentado (el estado natural del JSX).
  const [estatico, setEstatico] = useState(false)
  useDevFlag('dev-eco', (v) => setEstatico(v === 'estatico')) // [dev-mode]
  useEcoFriendlyReveal(sectionRef, { activo: !estatico }) // [dev-mode] gate

  return (
    <section
      ref={sectionRef}
      // [dev-mode] `eco-estatico` congela también los bucles CSS que corren
      // sin esperar al reveal (las olas de la cinta) — los del sello no hacen
      // falta congelarlos porque cuelgan de `.eco-vivo`, que sin reveal no
      // llega nunca. Ver dev-registry.ts.
      className={`flex justify-center px-5 py-3 sm:px-10 sm:py-4${estatico ? ' eco-estatico' : ''}`} // [dev-mode]
    >
      <div className="relative flex h-20 w-full max-w-contenido items-center justify-center sm:h-28">
        {/* [v3] La cinta ya no es un div con un `background` plano: toda su
            materia (dos caras, filo de luz, hairline, máscara del fundido a
            los extremos) vive en `.eco-cinta`, y dentro derivan las 2 capas
            de olas. Las alturas siguen en utilidades (36px/48px, decisión de
            Samuel del 07-17) porque son layout, no material. */}
        <div aria-hidden="true" className="eco-cinta absolute inset-x-0 top-1/2 h-9 -translate-y-1/2 sm:h-12">
          <span className="eco-ola eco-ola--fondo" />
          <span className="eco-ola" />
        </div>
        {/* grid-cols-[1fr_auto_1fr], NO flex (2026-07-22, Samuel: «el sello
            no está centrado con respecto a la pantalla… quiero que el sello,
            sin importar eso, esté centrado»). Con `flex justify-center` los
            3 hijos se centran COMO GRUPO: el sello acaba donde lo dejen los
            textos, y como «Zero plastic on board» es bastante más ancho que
            «Eco-friendly», el grupo entero se corre y el sello queda a la
            izquierda del eje. Con dos columnas laterales de 1fr —que por
            definición miden lo mismo— la columna `auto` del centro cae
            SIEMPRE en el eje del contenedor, que a su vez está centrado en
            pantalla; el texto ya no puede desplazarlo, solo repartirse el
            hueco que le toca a cada lado.
            Cada texto se arrima a su lado del sello (justify-self + text-*)
            para que al envolver en pantallas estrechas crezca hacia afuera y
            no se despegue del sello. */}
        <div className="relative z-10 grid w-full grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-6">
          <span className="eco-reveal justify-self-end text-right text-sm font-semibold uppercase tracking-[0.2em] text-navy sm:text-base">
            {t('Eco-friendly')}
          </span>
          <SelloEco className="h-20 w-20 shrink-0 sm:h-28 sm:w-28" />
          <span className="eco-reveal justify-self-start text-left text-sm font-semibold uppercase tracking-[0.2em] text-navy sm:text-base">
            {t('Zero plastic on board')}
          </span>
        </div>
      </div>
    </section>
  )
}
