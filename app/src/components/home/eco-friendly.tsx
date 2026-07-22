import { useRef, useState } from 'react'
import { useDevFlag } from '@/dev/use-dev-flag'
import { useEcoFriendlyReveal } from '@/components/home/use-eco-friendly-reveal'

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
// punteado + relleno translúcido de la hoja llevan `eco-sello-fondo` y entran
// DESPUÉS, con rebote — el color es el remate del dibujo, no su acompañante
// (3ª vuelta, mismo día: al ir a la vez, el relleno adelantaba la silueta y
// el trazo no se notaba) — ver el hook para el porqué completo.

// Sello eco: círculo con anillo + hoja + gota. Todo con currentColor y los
// tokens de la paleta (cero hex sueltos, regla de CLAUDE.md).
function SelloEco({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 96 96"
      className={className}
      role="img"
      aria-label="Sello eco-friendly — cero plástico a bordo"
    >
      {/* Disco de fondo y anillo: el aqua de marca, con cuentagotas — es una
          pieza pequeña, no un fondo de sección. */}
      <circle className="eco-sello-fondo" cx="48" cy="48" r="46" fill="var(--color-menta)" />
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
        opacity="0.55"
      />
      {/* Hoja: dos arcos que se cierran en punta arriba y abajo. */}
      <path
        className="eco-sello-fondo"
        d="M48 24c13 7 20 17 20 27 0 11-9 21-20 21s-20-10-20-21c0-10 7-20 20-27z"
        fill="var(--color-aqua)"
        opacity="0.18"
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
    <section ref={sectionRef} className="flex justify-center px-5 py-3 sm:px-10 sm:py-4">
      <div className="relative flex h-20 w-full max-w-contenido items-center justify-center sm:h-28">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-1/2 h-9 -translate-y-1/2 sm:h-12"
          style={{
            background:
              'linear-gradient(to right, transparent 0%, var(--color-menta) 15%, var(--color-menta) 85%, transparent 100%)',
          }}
        />
        {/* grid-cols-[1fr_auto_1fr], NO flex (2026-07-22, Samuel: «el sello
            no está centrado con respecto a la pantalla… quiero que el sello,
            sin importar eso, esté centrado»). Con `flex justify-center` los
            3 hijos se centran COMO GRUPO: el sello acaba donde lo dejen los
            textos, y como «Cero plástico a bordo» es bastante más ancho que
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
            Eco-friendly
          </span>
          <SelloEco className="h-20 w-20 shrink-0 sm:h-28 sm:w-28" />
          <span className="eco-reveal justify-self-start text-left text-sm font-semibold uppercase tracking-[0.2em] text-navy sm:text-base">
            Cero plástico a bordo
          </span>
        </div>
      </div>
    </section>
  )
}
