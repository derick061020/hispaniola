import { useRef, useState } from 'react'
import { EXPERIENCIA_NARRATIVA, EXPERIENCIA_VIDEO, type SegmentoNarrativa } from '@/data/home'
import { BotonSonido } from '@/components/ui/boton-sonido'
import { useDevFlag } from '@/dev/use-dev-flag'
import { useExperienciaScroll } from '@/components/home/use-experiencia-scroll'
import { useExperienciaVideoEtapa } from '@/components/home/use-experiencia-video-etapa'

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
//   video»). El collage (CSS, tokens y EXPERIENCIA_FOTOS) se borró en el
//   mismo commit — sin cadáveres.
//
//   Slide 5 — EL TEXTO SE REVELA PALABRA A PALABRA. Ya había un reveal por
//   FRASE enganchado al scroll; el cliente pide el formato de getblue.com,
//   donde el párrafo se va encendiendo conforme bajas. Por eso cada segmento
//   del copy se trocea aquí en <span> por palabra (.exp-palabra) y el hook
//   las enciende escalonadas con scrub. El troceo vive en el componente y no
//   en los datos: EXPERIENCIA_NARRATIVA sigue siendo el copy legible.
//
// 2ª vuelta de correcciones v1 (2026-07-22, mismo slide 7 — lo que el cliente
// señalaba de six2eight.com no era el mockup de portátil, era el RECORRIDO de
// scroll del video: crece hasta llenar la pantalla, se mantiene fijo un
// tramo, y encoge a su columna de siempre). Ese recorrido —SOLO desktop, ver
// use-experiencia-video-etapa.ts— pinea `.exp-etapa` (el grid entero) y
// transforma `.exp-video`; el texto (`.exp-texto`) espera invisible hasta que
// el video termina de encoger. El video en sí pierde el marco de la 1ª
// vuelta (passe-partout + sombra + rotación) por bordes limpios y
// redondeados (componentes.css) — así se ve el video de la propia
// referencia, sin el gesto artesanal que tenía el collage.

// Trocea un segmento en palabras CONSERVANDO los espacios como piezas
// aparte (el split captura el separador). Cada trozo se pinta en su propio
// span, pero solo las palabras llevan .exp-palabra: los espacios quedan como
// texto inline normal.
//
// Por qué separarlos (2026-07-22, ola del texto): .exp-palabra pasó a
// `display: inline-block` para poder TRASLADARSE — los inline puros ignoran
// `transform`, así que sin eso las palabras no podrían subir a su sitio. Y un
// inline-block que solo contiene un espacio lo colapsa a cero: si los espacios
// llevaran la misma clase, el párrafo se leería "todojunto". De paso el
// stagger de la ola ya no gasta pasos en huecos invisibles.
function palabras(texto: string): string[] {
  return texto.split(/(\s+)/).filter((t) => t.length > 0)
}

const esEspacio = (t: string) => /^\s+$/.test(t)

// LA COMA NUNCA ABRE RENGLÓN (2026-08-07). Varios segmentos del copy EMPIEZAN
// por signo («, exclusive access to our …», porque el signo va en gris y lo
// anterior en negrita). Como cada palabra es un inline-block, el navegador
// puede partir la línea ENTRE dos de ellos aunque no haya espacio en medio —
// y ahí salía «underwater museum» y, al renglón siguiente, «, chef-prepared
// cuisine». Se pega el signo al final del segmento anterior: hereda su estilo
// (una coma en negrita detrás de una frase en negrita es tipografía normal) y
// deja de ser un trozo suelto que puede saltar de línea.
//
// Va en el componente y no en los datos a propósito: home.ts guarda el copy
// del cliente tal cual se aprueba, y este es un problema de maquetación que
// hay que resolver una vez, no en cada frase que llegue.
function pegarPuntuacion(frase: SegmentoNarrativa[]): SegmentoNarrativa[] {
  const salida: SegmentoNarrativa[] = []
  for (const seg of frase) {
    const signo = seg.t.match(/^[,.;:!?)»…]+/)
    const previo = salida[salida.length - 1]
    // Si el anterior ya termina en espacio, pegar ahí daría «museum ,»: se deja.
    if (signo && previo && !/\s$/.test(previo.t)) {
      salida[salida.length - 1] = { ...previo, t: previo.t + signo[0] }
      salida.push({ ...seg, t: seg.t.slice(signo[0].length) })
    } else {
      salida.push({ ...seg })
    }
  }
  return salida.filter((seg) => seg.t.length > 0)
}

export function Experiencia() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // [dev-mode] ?dev-exp=estatico congela el reveal en su estado FINAL (texto y
  // video ya visibles, sin desplazamiento) → frame limpio para Figma. Ver
  // dev-registry.ts. Sin GSAP enganchado, la sección se ve directamente
  // asentada (el estado natural del JSX).
  const [estatico, setEstatico] = useState(false)
  useDevFlag('dev-exp', (v) => setEstatico(v === 'estatico')) // [dev-mode]
  useExperienciaScroll(sectionRef, { activo: !estatico }) // [dev-mode] gate
  useExperienciaVideoEtapa(sectionRef, { activo: !estatico }) // [dev-mode] gate — recorrido del video (solo desktop)

  return (
    // Aire recortado (2026-07-22, Samuel: «esta sección tiene mucho aire con
    // la de arriba y mucho más aún con la de abajo», y luego «reducir el
    // gap entre el cintillo eco-friendly y la sección del video»). Arriba
    // pasa de pt-seccion (7rem) a pt-8 (2rem): encima solo va el cintillo
    // eco-friendly, que es una franja fina, no una sección con su propio
    // aire. Abajo queda en 0 — ToursGrid ya trae su pt-seccion (7rem), que
    // es la separación estándar entre secciones; el pb-8 de antes se sumaba
    // a eso y por eso el hueco de abajo cantaba más que el de arriba.
    //
    // OJO: en desktop este padding NO es el grueso del hueco que se ve bajo
    // el cintillo — ese lo manda --exp-etapa-inicio-top-vh (cuán abajo
    // arranca el video para asomarse). Ver el comentario del token.
    // [v3 F8 · QA 2026-08-07] `max-lg:overflow-x-clip`: en móvil el reveal
    // arranca el vídeo a escala 1.14 (--exp-video-movil-escala) y esos ~50px
    // de más asomaban por la derecha — la home se podía arrastrar 5px en
    // horizontal a 390px de ancho. Se recorta SOLO por debajo de lg: en
    // desktop el recorrido pineado agranda el vídeo hasta ~1.8x a propósito y
    // recortarlo ahí mataría el efecto. `clip` y no `hidden`: no crea
    // contenedor de scroll, así el pin de GSAP sigue funcionando.
    <section ref={sectionRef} className="bg-papel px-5 pb-0 pt-8 max-lg:overflow-x-clip sm:px-10">
      {/* .exp-etapa: el grid entero es lo que use-experiencia-video-etapa.ts
          PINEA en desktop mientras dura el recorrido del video — el video y
          el texto siguen siendo hijos normales de este mismo grid, nunca se
          reparentan (ver el hook para el porqué). */}
      <div className="exp-etapa mx-auto grid max-w-contenido grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Video — bordes limpios y redondeados (componentes.css, 2ª vuelta
            de correcciones v1: la referencia six2eight.com no llevaba marco).
            order-2 lg:order-1 → en móvil va DEBAJO del texto (se lee antes el
            mensaje); en desktop toma la columna IZQUIERDA — su posición aquí
            ES el estado "final" al que el recorrido pineado vuelve al
            encoger. */}
        <div className="order-2 lg:order-1">
          <figure className="exp-video">
            <video
              ref={videoRef}
              src={EXPERIENCIA_VIDEO.src}
              poster={EXPERIENCIA_VIDEO.poster}
              aria-label={EXPERIENCIA_VIDEO.alt}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
            {/* Va DENTRO del figure a propósito: así sigue al vídeo durante
                todo el recorrido pineado, que lo mueve y lo escala.
                .exp-video-controles deshace esa escala — si no, el botón
                crecería con el vídeo; el porqué, en componentes.css. */}
            <BotonSonido
              videoRef={videoRef}
              className="exp-video-controles absolute bottom-4 right-4 z-10"
            />
          </figure>
        </div>

        {/* Texto — párrafo grande gris/negro + CTA sutil. order-1 lg:order-2 →
            primero en móvil, columna DERECHA en desktop. .exp-texto: en
            desktop el hook lo mantiene invisible mientras el video crece y se
            mantiene grande, y lo enciende recién cuando el video encoge a su
            columna (ver use-experiencia-video-etapa.ts). */}
        <div className="exp-texto order-1 lg:order-2">
          <div className="space-y-4">
            {EXPERIENCIA_NARRATIVA.map((frase, i) => (
              <p
                key={i}
                className="text-balance font-display text-narrativa-movil font-medium text-navy-sub sm:text-narrativa"
              >
                {pegarPuntuacion(frase).map((seg, j) => (
                  <span key={j} className={seg.fuerte ? 'font-semibold text-navy' : undefined}>
                    {palabras(seg.t).map((p, k) => (
                      <span key={k} className={esEspacio(p) ? undefined : 'exp-palabra'}>
                        {p}
                      </span>
                    ))}
                  </span>
                ))}
              </p>
            ))}
          </div>

          {/* [v3 2026-08-06, WEBSITE - INICIO pág. 1: «REMOVE: sin costos
              ocultos…»] Aquí vivía EXPERIENCIA_KICKER («Sin costes ocultos.
              Sin barcos abarrotados.»). Se retira la línea Y la constante —
              el argumento anti-comisión no se pierde: es el tema entero de
              la sección Book Direct, justo debajo. */}

          {/* CTA sutil en coral (el color de "Ver disponibilidad"): estilo
              enlace, no botón sólido — no compite con los CTA sólidos del hero
              y el cierre. Lleva al grid de tours (#tours), justo debajo. */}
          <a
            href="#tours"
            className="exp-linea group mt-8 inline-flex items-center gap-1.5 text-lead font-semibold text-coral transition-colors hover:text-coral-dark"
          >
            See availability
            <span aria-hidden className="transition-transform duration-200 motion-safe:group-hover:translate-x-1">
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
