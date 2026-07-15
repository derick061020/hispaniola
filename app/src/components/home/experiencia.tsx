import { useRef, useState } from 'react'
import { EXPERIENCIA_NARRATIVA, EXPERIENCIA_KICKER, EXPERIENCIA_FOTOS } from '@/data/home'
import { useDevFlag } from '@/dev/use-dev-flag'
import { useExperienciaScroll } from '@/components/home/use-experiencia-scroll'

// "Experiencia" (v3-F18, pedido de Samuel) — sección editorial bajo la banda
// de premios (que pierde su divider inferior para que fluyan como un bloque):
// un collage de 3 fotos reales (borde blanco fino + sombra realista,
// componentes.css) y un párrafo GRANDE alternando gris/negro (síntesis del
// copy real de la web, en data/home.ts) rematado por un CTA sutil en coral.
//
// v3-F18.2 (Samuel): fotos a la IZQUIERDA, texto a la DERECHA (antes al revés).
// En móvil el texto va primero (se lee antes que se ven las fotos), en desktop
// las fotos toman la columna izquierda vía `lg:order-*`.
//
// El reveal al hacer scroll (texto y fotos entran escalonados, enganchados al
// scroll — NO sticky) lo maneja GSAP en use-experiencia-scroll.ts.

// Posición de cada foto en el collage (index = orden en EXPERIENCIA_FOTOS).
// Cascada diagonal: coral arriba-izq (fondo) → cocina der → catamarán
// abajo-izq (frente). Las rotaciones son IRREGULARES a propósito (si fueran
// iguales se leería como un error de alineación, no como un gesto).
// v3-F18.1 (Samuel): más STACKEADAS que antes — fotos más grandes (62-63% vs
// 54-58%) y con la cascada comprimida (top 3→49% en vez de 0→56%), así se
// solapan más y se leen como un montón, no como 3 fotos sueltas.
const POSICIONES: Array<{ top: string; left?: string; right?: string; width: string; rot: number; z: number }> = [
  { top: '3%', left: '5%', width: '63%', rot: -5, z: 1 },
  { top: '25%', right: '3%', width: '61%', rot: 4.5, z: 2 },
  { top: '49%', left: '13%', width: '63%', rot: -2.5, z: 3 },
]

export function Experiencia() {
  const sectionRef = useRef<HTMLElement>(null)

  // [dev-mode] ?dev-exp=estatico congela el reveal en su estado FINAL (texto y
  // fotos ya visibles, sin desplazamiento) → frame limpio para Figma. Ver
  // dev-registry.ts. Sin GSAP enganchado, la sección se ve directamente
  // asentada (el estado natural del JSX).
  const [estatico, setEstatico] = useState(false)
  useDevFlag('dev-exp', (v) => setEstatico(v === 'estatico')) // [dev-mode]
  useExperienciaScroll(sectionRef, { activo: !estatico }) // [dev-mode] gate

  return (
    // overflow-x-clip: al arrancar, las fotos se separan hacia afuera (radial)
    // y podrían asomar por el borde y provocar scroll horizontal en móvil.
    // `clip` lo evita sin crear un scroll container (no afecta el sticky de
    // nada) y sin tocar el eje vertical.
    // v3-F18.2: padding INFERIOR recortado a 2rem (pb-8) — Samuel quiere menos
    // aire con el grid de tours de abajo, al que el CTA "Ver disponibilidad →"
    // ya apunta. El TOP mantiene el ritmo de sección (pt-seccion) porque arriba
    // viene de los premios; abajo la sección "se pega" a los tours a propósito
    // (el hueco real lo pone ya el pt-seccion de ToursGrid, 7rem).
    <section
      ref={sectionRef}
      className="overflow-x-clip bg-papel px-5 pb-8 pt-seccion-sm sm:px-10 sm:pt-seccion"
    >
      <div className="mx-auto grid max-w-contenido grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Collage — 3 fotos reales, borde blanco fino + sombra realista.
            order-2 lg:order-1 → en móvil va DEBAJO del texto (se lee antes el
            mensaje); en desktop toma la columna IZQUIERDA. */}
        <div className="collage order-2 lg:order-1">
          {EXPERIENCIA_FOTOS.map((f, i) => {
            const p = POSICIONES[i]
            return (
              <figure
                key={f.foto}
                className="collage-foto"
                style={{
                  top: p.top,
                  left: p.left,
                  right: p.right,
                  width: p.width,
                  zIndex: p.z,
                  ['--rot' as string]: `${p.rot}deg`,
                }}
              >
                <img src={`/fotos/${f.foto}.webp`} alt={f.alt} loading="lazy" />
              </figure>
            )
          })}
        </div>

        {/* Texto — párrafo grande gris/negro + CTA sutil. order-1 lg:order-2 →
            primero en móvil, columna DERECHA en desktop. */}
        <div className="order-1 lg:order-2">
          <div className="space-y-4">
            {EXPERIENCIA_NARRATIVA.map((frase, i) => (
              <p
                key={i}
                className="exp-linea text-balance font-display text-narrativa-movil font-medium text-navy-sub sm:text-narrativa"
              >
                {frase.map((seg, j) => (
                  <span key={j} className={seg.fuerte ? 'font-semibold text-navy' : undefined}>
                    {seg.t}
                  </span>
                ))}
              </p>
            ))}
          </div>

          <p className="exp-linea mt-7 text-lead font-semibold text-navy">{EXPERIENCIA_KICKER}</p>

          {/* CTA sutil en coral (el color de "Ver disponibilidad"): estilo
              enlace, no botón sólido — no compite con los CTA sólidos del hero
              y el cierre. Lleva al grid de tours (#tours), justo debajo. */}
          <a
            href="#tours"
            className="exp-linea group mt-8 inline-flex items-center gap-1.5 text-lead font-semibold text-coral transition-colors hover:text-coral-dark"
          >
            Ver disponibilidad
            <span aria-hidden className="transition-transform duration-200 motion-safe:group-hover:translate-x-1">
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
