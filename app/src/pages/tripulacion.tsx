import { Footer } from '@/components/home/footer'
import { CabeceraInterna } from '@/components/internas/cabecera-interna'
import { HeroInterna } from '@/components/internas/hero-interna'
import { CierreEquipo } from '@/components/equipo/cierre-equipo'
import { FranjaEquipo } from '@/components/equipo/franja-equipo'
import { GridEquipo } from '@/components/equipo/grid-equipo'
import { MuroTripulacion } from '@/components/equipo/muro-tripulacion'
import { ModalVideoCrew } from '@/components/equipo/modal-video-crew'
import { Meta } from '@/components/seo/meta'
import { EQUIPO_PAGINA } from '@/data/equipo'
import { EQUIPO } from '@/data/nosotros'
import { BLOQUE_FICHA } from '@/components/tour/bloque-ficha'
import { t } from '@/lib/i18n'

// Página Tripulación / Equipo (/tripulacion) — correcciones v2, plan 05.
//
// La ruta se llama /tripulacion porque es la etiqueta que el cliente pidió en
// el menú (reunión 07-24, 26:50), aunque la página incluye contabilidad, RRHH,
// marketing y la fundación — gente que no es tripulación. El H1 dice «las
// personas detrás de cada tour», que es más honesto que «tripulación» y es lo
// que su propia maqueta titulaba.
//
// [v2 2026-07-28, pedido de Samuel] LA PÁGINA SE ALINEA CON EL PDF (slides
// 36-43), que es MÁS DIRECTA que la versión anterior. Cuatro tiempos, más un
// remate:
//   1. Hero: badge + título + descripción. Y SOLO eso — los 3 KPIs que vivían
//      dentro se bajan a la franja.
//   2. FranjaEquipo: la info compacta (cuántas personas, cuántos
//      departamentos, desde cuándo, y que el equipo es de RD + España).
//   3. Filtros por departamento + todo el equipo (GridEquipo).
//   4. Cierre «¿Quieres remar con nosotros?» (CierreEquipo).
//   5. MuroTripulacion: los dos tickers de retratos, mudos y a sangre, DESPUÉS
//      del CTA. No está en el PDF — es el «algo chulo» que pidió Samuel para
//      una sección que por naturaleza es monótona. Ver ese componente para por
//      qué va al final y sin cabecera.
//
// SALE «Bienvenido a la familia Hispaniola» (nosotros/intro-nosotros.tsx). Se
// había reubicado aquí el 07-27 al desaparecer /nosotros, como colocación
// PROVISIONAL a la espera de que Samuel confirmara el reparto — ya lo hizo: en
// el PDF no existe, y metía una bienvenida de marca de dos párrafos + foto
// apaisada entre el titular y la gente, que es justo lo que hacía la página
// menos directa. ⚠️ El bloque NO se borra: sigue en components/nosotros/ con
// su contenido real portado de about-hispaniola.php, hoy SIN COLOCAR. Si al
// final no aterriza en ninguna página, ese contenido se pierde con /nosotros —
// conviene decidirlo, no dejarlo caducar en silencio.
//
// [2026-08-21] YA NO ES UNA PÁGINA DE MOLDE. Los 27 retratos son las fotos de
// estudio que entregó el cliente, agrupadas en sus seis departamentos reales.
// Lo que sigue faltando son los NOMBRES: la card se pinta solo con la cara,
// sin nombre inventado ni frase en primera persona. El detalle completo, en la
// cabecera de data/equipo.ts.
export function TripulacionPage() {
  // El CEO: la unica ficha con historia larga (WEBSITE - NOSOTROS pag. 2). Se
  // busca por su CTA de historia, igual que hace /flota, para no atarlo a un
  // id concreto.
  const ceo = EQUIPO.find((m) => m.cta?.tipo === 'historia')

  return (
    <div>
      <Meta
        titulo={t('Crew')}
        descripcion={t('The people behind every Hispaniola Aquatic Adventures tour: captains, guides, kitchen, marine biology, office and the foundation.')}
        ruta="/crew"
      />
      <HeroInterna ctaHref="/#tours">
        <CabeceraInterna
          eyebrow={EQUIPO_PAGINA.eyebrow}
          titulo={EQUIPO_PAGINA.titulo}
          lead={EQUIPO_PAGINA.lead}
        />
      </HeroInterna>

      {/* UN SOLO contenedor para franja + rejilla + cierre, con `gap` entre
          ellos. Estuvieron partidos en dos mientras el muro se colaba en medio
          (uno con pt-, otro con pb-); al mudarse el muro al final, esa partición
          se quedó sin motivo y con un efecto feo: entre los dos bloques no había
          NINGUNA separación —el pt- del primero y el pb- del segundo son
          exteriores— y los chips de filtro salían pegados al canto de la franja
          de datos. Un contenedor y un gap: no hay dos paddings que puedan
          desincronizarse. */}
      <div className="mx-auto max-w-contenido px-5 py-12 sm:px-10 lg:py-16">
        <div className="flex flex-col gap-10 lg:gap-12">
          <FranjaEquipo />

          {/* [v3 2026-08-07, pedido de Samuel] LA FRASE VA AQUI, PEGADA A LA
              FRANJA. El doc del cliente (WEBSITE - NOSOTROS pag. 2) la escribe
              justo asi: pega el pantallazo de esta misma franja de 4 datos y
              debajo pone «DEBAJO DE ESTO → ONE COMPANY, SIX DEPARTMENTS AND
              ONE SHARED PASSION». Estaba encabezando la rejilla (que es lo que
              describe), pero leida contra la franja hace algo mejor: los
              cuatro datos son cifras sueltas —70 personas, 7 departamentos,
              2010, RD + España— y esta linea es la frase que los suma. Lo que
              viene despues (la historia del CEO y los departamentos) es
              el desarrollo de esa frase, no otra cosa. */}
          {/* ⚠️ [2026-09-01] «six» → «seven», por lo mismo que el lead de
              data/equipo.ts: la 3ª entrega añadió Sales & Marketing y este
              titular se quedó contando seis mientras la franja de datos, que
              sí lo deriva, decía siete. El número está ESCRITO A MANO en los
              dos sitios y no se actualiza solo. */}
          <p className="text-center font-display text-h3 font-semibold text-navy">
            {t('One company, seven departments and one shared passion')}
          </p>

          {/* [v3 2026-08-06, WEBSITE - NOSOTROS pag. 2] LA HISTORIA DEL CEO.
              El cliente escribe un texto largo en primera persona y no tenia
              sitio: la ficha del CEO solo daba para una frase. Va entre la
              franja de datos y la rejilla de departamentos porque es lo que
              los une — la empresa la monto el primer capitan, y los seis
              departamentos son en lo que se convirtio. */}
          {ceo?.bio ? (
            <section className={BLOQUE_FICHA}>
              <div className="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-start sm:gap-8">
                {/* [2026-09-01, pedido de Samuel: «que no sea redonda, que sea
                    cuadrada con bordes redondeados»] Deja de ser un avatar
                    circular y pasa a ser una foto con el radio de card del
                    sistema (`rounded-card`, el mismo de las cards de plato y de
                    los iconos de departamento), que además es lo que ya hacen
                    los 30 retratos del muro de aquí abajo — así la ficha del
                    CEO y su equipo hablan la misma lengua.
                    `object-top` y no el centrado por defecto: la fuente es 2:3 y
                    la caja es 1:1, así que hay que recortar alto, y con el
                    recorte centrado la cabeza se va fuera. Es el mismo criterio
                    que ya aplica el muro (grid-equipo.tsx). */}
                {ceo.foto ? (
                  <img
                    src={`/fotos/${ceo.foto}.webp`}
                    alt={`${ceo.nombre}, ${ceo.rol}`}
                    loading="lazy"
                    className="size-28 rounded-card object-cover object-top sm:size-36"
                  />
                ) : null}
                <div>
                  <p className="font-display text-lg font-semibold text-navy">{ceo.nombre}</p>
                  <p className="text-sm text-navy-soft">{ceo.rol}</p>
                  <div className="mt-4 flex flex-col gap-3">
                    {ceo.bio.map((p) => (
                      <p key={p.slice(0, 30)} className="text-navy-sub">
                        {p}
                      </p>
                    ))}
                  </div>
                  {/* SIN LA FRASE DEL CEO («I never wanted to build the
                      biggest tour company…»). El cliente la escribe en la
                      pagina 4 del doc, que es la de FLOTA, y ahi es donde se
                      pinta (flota/familia-hispaniola.tsx). Aqui sobraba: la
                      bio de la pagina 2 ya cierra con su propio credo («never
                      stop getting their feet wet»), asi que eran dos remates
                      en primera persona seguidos y el segundo le quitaba
                      fuerza al primero. Pedido de Samuel, 2026-08-07. */}
                </div>
              </div>
            </section>
          ) : null}

          <GridEquipo />
          {/* El cierre va fuera de GridEquipo (donde vivía): no depende del
              filtro ni del equipo, es el remate de la página. */}
          <div className="mt-6">
            <CierreEquipo />
          </div>
        </div>
      </div>

      {/* El muro va A SANGRE, así que vive FUERA del contenedor de contenido
          —igual que ReelsSociales en /instalaciones—, y va AL FINAL, DESPUÉS
          del banner de CTA (pedido de Samuel, 2026-07-28): la página cierra
          con su llamada a la acción y lo último que ves antes del footer son
          las caras pasando. Sin cabecera, así que no compite con nada. */}
      <MuroTripulacion />

      {/* El video del equipo. Se abre en grande al entrar y, al cerrarlo, se
          acopla abajo a la izquierda en vez de desaparecer. Va el ULTIMO del
          arbol para que su capa quede por encima de todo sin pelear z-index
          con el header pegajoso. */}
      <ModalVideoCrew
        src="/video/equipo/tripulacion.mp4"
        poster="/fotos/tripulacion-video-poster.webp"
      />

      <Footer />
    </div>
  )
}
