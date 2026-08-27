import { Footer } from '@/components/home/footer'
import { HeroInterna } from '@/components/internas/hero-interna'
import { Etiqueta } from '@/components/ui/etiqueta'
import { Meta } from '@/components/seo/meta'
import { FrentesFundacion } from '@/components/fundacion/frentes-fundacion'
import { FundadoresFundacion } from '@/components/fundacion/fundadores-fundacion'
import { FundacionTeaser } from '@/components/sostenibilidad/fundacion-teaser'
import { CierreDoble } from '@/components/sostenibilidad/cierre-doble'
import { FUNDACION } from '@/data/fundacion'
import { t } from '@/lib/i18n'

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
// [v2 2026-07-28 · ampliado el 2026-08-12] Tres secciones llevan `id`
// (`fundacion`, `proyectos`, `membresias`): son el destino de tres de los 7
// chips de anclas de /competitive-advantage (slide 58) — ese contenido vive
// aquí, así que esos chips son enlaces con hash, no anclas locales. Si se
// renombra un id, hay que tocar ANCLAS_VENTAJA en data/sostenibilidad.ts.
// ⚠️ Y hay que tocarlo A MANO: el aviso de consola de NavAnclasChips solo
// vigila los chips SIN `to` (no puede comprobar un ancla de otra página), así
// que estos tres se rompen en silencio.
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
        titulo={t('The Foundation')}
        descripcion={t('Bávaro Reefs Foundation: coral restoration and artificial reefs since 2016, in partnership with the Ministry of the Environment.')}
        ruta="/foundation"
      />

      {/* El hero deja el video de marca (el catamarán, que es de la EMPRESA)
          por la cenital del agua de Bávaro, que es de lo que va esta página.
          [v2 2026-07-28, 5ª vuelta] FUERA LOS 3 HITOS que vivían aquí como
          credenciales a la derecha (Samuel: «quita los 3 puntos que pusimos a
          la derecha en el hero»). El hero vuelve a una sola columna —badge,
          título y descripción— y con ella se va también `anchoCompleto`, que
          existía solo para que esa banda derecha tuviera sitio.
          ⚠️ Este aviso decía que los tres datos (2016, el tercer vivero y el
          convenio con Medio Ambiente) los recogía la línea de tiempo de justo
          debajo. YA NO: esa línea sale de la página el 2026-08-07 (ver abajo).
          Hoy los cuentan los cuatro datos del teaser de
          /competitive-advantage, que es contenido aprobado v3 — salvo el
          tercer vivero, que el propio cliente retiró. */}
      {/* [2026-08-24, barrido de enlaces] `ctaHref` ERA `/competitive-advantage`.
          Ese prop no alimenta ningun boton propio del hero: HeroInterna se lo
          pasa tal cual a Header y a MenuMovil, donde es el CTA coral que dice
          literalmente «Book now». Asi que en /foundation el boton de reservar
          llevaba a la pagina de ventaja competitiva. Era la unica pagina del
          sitio que se salia de `/#tours` sin ser una ficha (las fichas y las
          landings de evento si lo cambian a proposito, a su propio widget).
          Si se quiere empujar a /competitive-advantage desde aqui, eso es un
          CTA de contenido con su texto, no el boton de reservar. */}
      <HeroInterna
        ctaHref="/#tours"
        imagen={{
          src: '/fotos/arrecife-fondo-cenital-v2.webp',
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
          {/* [v3 2026-08-07, pedido de Samuel] AQUÍ IBA LA LÍNEA DE TIEMPO
              «How it started» (Before · 2016 · Today). Sale de la página.
              El componente y su dato (`FUNDACION.cronologia`) SE CONSERVAN sin
              montar, criterio de la casa — igual que CocinaYParadas en /fleet.
              ⚠️ Con ella se va de la web el «tercer vivero más importante del
              país», que era su tercera parada. No es pérdida accidental: el
              cliente ya lo había sustituido por «one of the leading coral
              restoration programs» en los otros dos sitios donde aparecía (los
              datos de la fundación y el check de la tarjeta de reserva), así
              que este era el último rastro de ese puesto en el ranking.
              Lo que sí contaba solo ella: el ANTES —el arrecife perdiéndose y
              la operación diaria que lo vio— y sus tres fotos submarinas. Si
              ese arranque hace falta, la historia está viva en
              `SOSTENIBILIDAD.historia` (/competitive-advantage). */}
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
          {/* [2026-08-12] «OUR FOUNDATION» LLEGA DESDE /competitive-advantage
              (Samuel: «desde "our foundation" hasta las 2 cards finales las
              quitamos de competitive-advantage y las ponemos en foundation
              después de la sección de scroll horizontal»). Allí era el teaser
              que resumía la fundación y enlazaba aquí; aquí es lo contrario —
              el bloque institucional que a esta página le faltaba en el
              cuerpo: por qué nació, el credo y los 4 hitos. Llega SIN los tres
              fundadores (ya están arriba, tras el hero) y SIN el botón «Meet
              the Foundation» (sería un enlace a esta misma página). Ver la
              cabecera del componente.
              VA DESPUÉS DEL BARRIDO, no antes: el orden de la página pasa a
              ser quién trabaja → EN QUÉ trabaja → quién es y qué ha
              conseguido → cómo apoyarla. Lo que se lleva el peso visual sigue
              siendo el barrido; esto es el remate argumental antes del CTA.
              ⚠️ NO llega su compañera de tramo, la línea de tiempo de los 6
              proyectos: son los MISMOS `FUNDACION.frentes` que acaba de barrer
              FrentesFundacion aquí arriba. Se retira sin sustituto (decisión
              de Samuel el 2026-08-12) y el componente queda sin montar. */}
          <FundacionTeaser />

          {/* El cierre es el MISMO bloque de dos tarjetas que remataba
              /ventaja-competitiva (Samuel: «ese está mejor»), no una copia:
              sustituyó a la banda de membresías con foto, que se retiró.
              [2026-08-12] Y desde hoy esta página es su ÚNICO consumidor: al
              mudarse el tramo, /competitive-advantage habría enseñado las dos
              mismas tarjetas («ya que las 2 cards finales estarían duplicadas
              quita una») — así que allí deja de pintarse. */}
          <CierreDoble id="membresias" anclaClase="scroll-mt-header-alto" />
        </div>
      </div>

      <Footer />
    </div>
  )
}
