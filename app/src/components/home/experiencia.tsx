import { useRef, useState } from 'react'
import { EXPERIENCIA_NARRATIVA, EXPERIENCIA_KICKER, EXPERIENCIA_VIDEO } from '@/data/home'
import { useDevFlag } from '@/dev/use-dev-flag'
import { useExperienciaScroll } from '@/components/home/use-experiencia-scroll'

// "Experiencia" (v3-F18, pedido de Samuel) — sección editorial bajo la banda
// de premios (que pierde su divider inferior para que fluyan como un bloque):
// un párrafo GRANDE alternando gris/negro (síntesis del copy real de la web,
// en data/home.ts) rematado por un CTA sutil en coral.
//
// v3-F18.2 (Samuel): media a la IZQUIERDA, texto a la DERECHA (antes al
// revés). En móvil el texto va primero (se lee antes que se ve la media), en
// desktop la media toma la columna izquierda vía `lg:order-*`.
//
// CORRECCIONES v1 DEL CLIENTE (2026-07-20, planes/01-home.md slides 5 y 7).
// Dos cambios, los dos sobre esta sección:
//
//   Slide 7 — EL COLLAGE SE VA, ENTRA EL VIDEO. Donde había 3 fotos reales
//   apiladas (con su hover de grupo en :has(), v3-F18.3) ahora va el video
//   promocional del cliente: el mismo que se auto-abría en el popup de
//   bienvenida, que el slide 2 manda eliminar («a Fernando le gusta mucho ese
//   video»). La referencia que puso el cliente es six2eight.com, que lo
//   incrusta en un mockup de portátil — eso NO se copia: es idioma de agencia
//   SaaS. El video hereda el passe-partout blanco + sombra realista + la
//   rotación irregular que ya tenían las fotos, así que el gesto de la
//   sección no cambia, solo su contenido. El collage (CSS, tokens y
//   EXPERIENCIA_FOTOS) se borró en el mismo commit — sin cadáveres.
//
//   Slide 5 — EL TEXTO SE REVELA PALABRA A PALABRA. Ya había un reveal por
//   FRASE enganchado al scroll; el cliente pide el formato de getblue.com,
//   donde el párrafo se va encendiendo conforme bajas. Por eso cada segmento
//   del copy se trocea aquí en <span> por palabra (.exp-palabra) y el hook
//   las enciende escalonadas con scrub. El troceo vive en el componente y no
//   en los datos: EXPERIENCIA_NARRATIVA sigue siendo el copy legible.

// Trocea un segmento en palabras conservando los espacios. Cada palabra es su
// propio span para que GSAP pueda encenderlas por separado; el espacio va
// DENTRO del span (con white-space normal el navegador colapsa el que
// quedaría entre spans, y el texto se leería "todojunto" al partir líneas).
function palabras(texto: string): string[] {
  return texto.split(/(\s+)/).filter((t) => t.length > 0)
}

export function Experiencia() {
  const sectionRef = useRef<HTMLElement>(null)

  // [dev-mode] ?dev-exp=estatico congela el reveal en su estado FINAL (texto y
  // video ya visibles, sin desplazamiento) → frame limpio para Figma. Ver
  // dev-registry.ts. Sin GSAP enganchado, la sección se ve directamente
  // asentada (el estado natural del JSX).
  const [estatico, setEstatico] = useState(false)
  useDevFlag('dev-exp', (v) => setEstatico(v === 'estatico')) // [dev-mode]
  useExperienciaScroll(sectionRef, { activo: !estatico }) // [dev-mode] gate

  return (
    // overflow-x-clip: el marco del video va rotado y podría asomar por el
    // borde y provocar scroll horizontal en móvil. `clip` lo evita sin crear
    // un scroll container y sin tocar el eje vertical.
    <section
      ref={sectionRef}
      className="overflow-x-clip bg-papel px-5 pb-8 pt-seccion-sm sm:px-10 sm:pt-seccion"
    >
      <div className="mx-auto grid max-w-contenido grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Video — passe-partout blanco + sombra realista, heredados del
            collage que vivía aquí. order-2 lg:order-1 → en móvil va DEBAJO
            del texto (se lee antes el mensaje); en desktop toma la columna
            IZQUIERDA. */}
        <div className="order-2 lg:order-1">
          <figure className="exp-video">
            <video
              src={EXPERIENCIA_VIDEO.src}
              poster={EXPERIENCIA_VIDEO.poster}
              aria-label={EXPERIENCIA_VIDEO.alt}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          </figure>
        </div>

        {/* Texto — párrafo grande gris/negro + CTA sutil. order-1 lg:order-2 →
            primero en móvil, columna DERECHA en desktop. */}
        <div className="order-1 lg:order-2">
          <div className="space-y-4">
            {EXPERIENCIA_NARRATIVA.map((frase, i) => (
              <p
                key={i}
                className="text-balance font-display text-narrativa-movil font-medium text-navy-sub sm:text-narrativa"
              >
                {frase.map((seg, j) => (
                  <span key={j} className={seg.fuerte ? 'font-semibold text-navy' : undefined}>
                    {palabras(seg.t).map((p, k) => (
                      <span key={k} className="exp-palabra">
                        {p}
                      </span>
                    ))}
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
