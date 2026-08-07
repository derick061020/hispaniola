import { Footer } from '@/components/home/footer'
import { HeroInterna } from '@/components/internas/hero-interna'
import { Etiqueta } from '@/components/ui/etiqueta'
import { Meta } from '@/components/seo/meta'
import { CronologiaFundacion } from '@/components/fundacion/cronologia-fundacion'
import { FrentesFundacion } from '@/components/fundacion/frentes-fundacion'
import { FundadoresFundacion } from '@/components/fundacion/fundadores-fundacion'
import { CierreDoble } from '@/components/sostenibilidad/cierre-doble'
import { FUNDACION } from '@/data/fundacion'

// Página de la Fundación (/fundacion) — correcciones v2, plan 08 §3-§5
// (slides 62-64). El copy y las notas de procedencia viven en
// data/fundacion.ts.
//
// ⚠️⚠️ RUTA EN SINGULAR, A PROPÓSITO. `/fundaciones` (PLURAL) es OTRA COSA: la
// página interna de tokens del proyecto (pages/fundaciones.tsx), la que
// documenta la paleta para el traspaso a Figma. Se diferencian en UNA letra —
// decisión de Samuel del 2026-07-26 para no perder esa herramienta. Ver el
// aviso cruzado en App.tsx.
//
// [v2 2026-07-28] Las secciones estrenan `id` (`proyectos`, `membresias`):
// son el destino de dos de los 7 chips de anclas de /ventaja-competitiva
// (slide 58) — ese contenido vive aquí, así que esos chips son enlaces con
// hash, no anclas locales. Si se renombra un id, hay que tocar
// ANCLAS_VENTAJA en data/sostenibilidad.ts.
//
// ══ REDISEÑO 2026-07-28, 2ª vuelta (Samuel: «a la página de /fundacion hay
// que darle un rediseño al contenido urgente, me parece aburrido, genérico,
// IA slop, debe ser más atractivo, creativo, que sea digerible y fácil a la
// vista») ══
//
// La versión anterior tenía TODO el contenido correcto y CERO forma: hero
// genérico, dos párrafos de 60 palabras, una caja gris de fundadores, un
// rectángulo navy con un párrafo dentro, cinco bloques de texto idénticos con
// numeral gigante, y un recuadro blanco con borde al final. 3.900px de alto y
// ni una sola imagen. Ese es el diagnóstico exacto de «IA slop»: contenido
// real presentado como relleno.
//
// Lo que lo arregla no es más copy —el copy es del cliente y es bueno— sino
// (a) DARLE FORMA al que hay: la historia pasa a línea de tiempo de 3 paradas
// y los 5 proyectos a rejilla escaneable con una palabra clave cada uno; y
// (b) ENSEÑAR EL TRABAJO: las fotos del vivero de coral, de los arrecifes
// artificiales y de las jornadas con niños llevaban meses en el proyecto (las
// usa data/instalaciones.ts) y esta página, la que HABLA de todo eso, era la
// única sin una imagen. Ver el ✅ RESUELTO en la cabecera de data/fundacion.ts.
//
// El orden narrativo también cambia: los 3 hitos (2016 · 3er vivero ·
// Ministerio) suben AL HERO como credenciales. Son las tres razones por las
// que merece la pena seguir leyendo — enterrados a media página no servían de
// nada, y de paso liberan la primera sección para que la historia respire.
export function FundacionPage() {
  return (
    <div>
      <Meta
        titulo="The Foundation"
        descripcion="Fundación Ecológica Arrecifes de Bávaro: coral restoration and artificial reefs since 2016, in partnership with the Ministry of the Environment."
        ruta="/foundation"
      />

      {/* El hero deja el video de marca (el catamarán, que es de la EMPRESA)
          por la cenital del agua de Bávaro, que es de lo que va esta página.
          [v2 2026-07-28, 5ª vuelta] FUERA LOS 3 HITOS que vivían aquí como
          credenciales a la derecha (Samuel: «quita los 3 puntos que pusimos a
          la derecha en el hero»). El hero vuelve a una sola columna —badge,
          título y descripción— y con ella se va también `anchoCompleto`, que
          existía solo para que esa banda derecha tuviera sitio.
          ⚠️ No se pierde ningún dato: 2016, el tercer vivero del país y el
          convenio con Medio Ambiente los cuenta la línea de tiempo de justo
          debajo (CronologiaFundacion), que es de donde salieron. Y siguen
          visibles como los 3 features del teaser de /ventaja-competitiva. */}
      <HeroInterna
        ctaHref="/competitive-advantage"
        imagen={{
          src: '/fotos/arrecife-fondo-cenital.webp',
          alt: 'Overhead view of the turquoise water at Playa Bávaro',
        }}
      >
        <div className="max-w-3xl">
          <Etiqueta sobreOscuro>{FUNDACION.nombreLegal}</Etiqueta>
          <h1 className="mt-3 text-balance font-display text-4xl font-semibold text-white sm:text-5xl">
            {FUNDACION.lema}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/85">{FUNDACION.heroTexto}</p>
        </div>
      </HeroInterna>

      {/* ⚠️ EL CONTENEDOR ESTÁ PARTIDO EN DOS, y no es un descuido: entre los
          dos va el barrido de los frentes A SANGRE (2026-07-28, 4ª vuelta —
          Samuel: «que no se vea el desborde del overflow hidden, la idea es
          que las cards desaparezcan con los extremos de la pantalla»). Para
          que el recorte caiga en los cantos de la VENTANA y no en los del
          contenedor, ese bloque no puede vivir dentro de `max-w-contenido`.
          Se saca de la columna en vez de sangrarlo con `100vw` + margen
          negativo: ese truco mete la barra de scroll en la cuenta y deja la
          página con scroll horizontal en Windows. */}
      <div className="mx-auto max-w-contenido px-5 pt-12 sm:px-10 lg:pt-16">
        <div className="flex flex-col gap-16 lg:gap-24">
          <CronologiaFundacion />

          <FundadoresFundacion />

          <section id="proyectos" className="scroll-mt-header-alto">
            <Etiqueta>{FUNDACION.proyectosEyebrow}</Etiqueta>
            <h2 className="mt-2 font-display text-h2 font-semibold text-navy">
              {FUNDACION.proyectosTitulo}
            </h2>
            <p className="mt-3 max-w-2xl text-lead text-navy-sub">{FUNDACION.proyectosLead}</p>
          </section>
        </div>
      </div>

      {/* El barrido, fuera de la columna. «Arrecifes artificiales» ya no va
          suelto encima: es la PRIMERA de las seis cards. */}
      <FrentesFundacion />

      {/* pt- propio: el barrido de arriba termina pegado a su última card, así
          que la separación con el cierre la pone este contenedor. */}
      <div className="mx-auto max-w-contenido px-5 pb-12 pt-16 sm:px-10 lg:pb-16 lg:pt-24">
        <div className="flex flex-col gap-16 lg:gap-24">
          {/* El cierre es el MISMO bloque de dos tarjetas que remata
              /ventaja-competitiva (Samuel: «ese está mejor»), no una copia:
              sustituye a la banda de membresías con foto, que se retira. */}
          <CierreDoble id="membresias" anclaClase="scroll-mt-header-alto" />
        </div>
      </div>

      <Footer />
    </div>
  )
}
