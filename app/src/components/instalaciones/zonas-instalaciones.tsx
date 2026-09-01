import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Building2,
  Check,
  ChefHat,
  Fish,
  Handshake,
  Microscope,
  ShoppingBag,
  type LucideIcon,
} from 'lucide-react'
import { Etiqueta } from '@/components/ui/etiqueta'
import { irAlAncla, useAnclasActiva } from '@/components/ui/use-anclas-activa'
import { BentoZona } from '@/components/instalaciones/bento-zona'
import { INSTALACIONES, ZONAS, type IconoZona } from '@/data/instalaciones'

// «Todo lo que hay detrás de tu experiencia» — las 6 zonas del complejo
// (correcciones v2, slides 46-49).
//
// [v2 2026-07-28, pedido de Samuel: «la estructura es distinta la nuestra, hay
// que hacerla más similar al pdf»] Lo que cambia respecto a la 1ª versión de
// la página:
//
//   1. LA FILA DE CHIPS del slide 46 (`Zona · Museo · Departamento · Cocinas ·
//      Tienda · Oficinas`), que no existía.
//   2. CADA ZONA PASA DE UNA FOTO A UN MINI-BENTO de video + 2 celdas
//      (BentoZona) — el cambio principal del pedido.
//   3. UNA BANDA DE CTA INTERCALADA a mitad de recorrido, como en la maqueta
//      (que pone tres; ver el porqué de dos en data/instalaciones.ts).
//
// LOS CHIPS NAVEGAN, NO FILTRAN — y es la única desviación deliberada respecto
// a la maqueta. El plan 06 §2 proponía el patrón de filtro de
// faq/categorias-faq.tsx, pero esto no es un FAQ: las 6 zonas son 6 argumentos
// de credibilidad y el trabajo de la página es que se lean los 6 seguidos
// («recórrelo zona por zona»). Un filtro que esconde 5 de 6 juega en contra
// del único objetivo que tiene la página. Visualmente son los mismos chips;
// lo que cambia es que llevan a la zona en vez de ocultar las otras, y el chip
// activo lo marca el scroll.
//
// El zigzag alternando lado es el lenguaje que el proyecto ya resolvió en
// sostenibilidad/recorrido-sostenibilidad.tsx — no se inventa otro layout.

const ICONOS: Record<IconoZona, LucideIcon> = {
  recibimiento: Handshake,
  museo: Fish,
  biologia: Microscope,
  cocinas: ChefHat,
  tienda: ShoppingBag,
  oficinas: Building2,
}

export function ZonasInstalaciones() {
  // El resaltado y el salto suave salen del scroll-spy COMPARTIDO
  // (ui/use-anclas-activa.ts), el mismo que usan la barra de pestañas de la
  // ficha de tour y los chips de /ventaja-competitiva. Lo que cambia aquí es
  // solo la piel: estos chips no son una barra sticky de página, van dentro de
  // la sección y bajo su lead, como en el slide 46.
  const [activa] = useAnclasActiva(ZONAS.map((z) => z.id))

  return (
    <section>
      <div className="text-center">
        <Etiqueta>{INSTALACIONES.seccionEyebrow}</Etiqueta>
        <h2 className="mx-auto mt-3 max-w-2xl text-balance font-display text-h2 font-semibold text-navy">
          {INSTALACIONES.seccionTitulo}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lead text-navy-sub">
          {INSTALACIONES.seccionLead}
        </p>
      </div>

      <nav
        aria-label="Zones of the complex"
        className="mt-8 flex flex-wrap justify-center gap-2"
      >
        {ZONAS.map((z) => (
          <a
            key={z.id}
            href={`#${z.id}`}
            onClick={(e) => irAlAncla(e, z.id)}
            aria-current={activa === z.id ? 'true' : undefined}
            className={`rounded-chip px-4 py-2 text-sm font-medium transition-colors ${
              activa === z.id
                ? 'bg-navy text-white'
                : 'bg-papel text-navy-sub ring-1 ring-linea hover:bg-papel-hueso'
            }`}
          >
            {z.chip}
          </a>
        ))}
      </nav>

      {/* [v2 2026-07-28, 3ª vuelta, Samuel: «hay líneas divisorias entre
          secciones que se alternan, es innecesario, se sobreentiende
          visualmente que son secciones distintas — quita esa línea»] FUERA el
          hairline entre zonas.
          Tenía razón: con el bento a un lado, el numeral y el zigzag
          alternando, la separación ya está contada tres veces; la línea era una
          cuarta que no aportaba. Mismo criterio que en la banda de KPIs y en el
          banner de /flota («al cliente no le gusta tanta línea»).
          El AIRE sube a lo que valía antes la suma de gap + padding de la línea
          (7rem / 10rem), no se recorta: al quitar el único separador dibujado,
          el blanco pasa a ser el que separa — dejarlo en el gap anterior habría
          juntado las zonas justo al quedarse sin línea. */}
      <div className="mt-12 flex flex-col gap-28 lg:mt-16 lg:gap-40">
        {ZONAS.map((z, i) => {
          const Icono = ICONOS[z.icono]
          // El bento va a la IZQUIERDA en las zonas pares y a la derecha en
          // las impares — el mismo alternado de la maqueta. En móvil no hay
          // dos columnas: el bento va siempre primero (order-first del grid
          // natural) porque es lo que identifica la zona de un vistazo.
          const bentoIzquierda = i % 2 === 0
          return (
            <Fragment key={z.id}>
              <article id={z.id} className="scroll-mt-header-alto">
                <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
                  <div className={bentoIzquierda ? 'lg:order-1' : 'lg:order-2'}>
                    {/* El bento se espeja con el zigzag: el vertical siempre al
                        margen exterior. Ver bento-zona.tsx. */}
                    <BentoZona zona={z} espejo={!bentoIzquierda} />
                  </div>

                  <div className={bentoIzquierda ? 'lg:order-2' : 'lg:order-1'}>
                    {/* NUMERAL FANTASMA + icono, y el título montándose encima
                        ([v2 2026-07-28], Samuel: «algo más creativo, que se vea
                        que no está 100 por 100 copiada del pdf»).

                        Lo que había aquí era el cuadrado pálido de la maqueta —
                        que en la maqueta no es un elemento de diseño, es el
                        HUECO donde su IA iba a poner un icono. Copiarlo tal cual
                        era copiar un andamio.

                        En su lugar entra un idioma que el proyecto ya tiene y
                        que esta página puede usar por el mismo motivo que
                        Sostenibilidad: son 6 paradas de un recorrido numerado
                        («recórrelo zona por zona»). Se reutilizan `.sost-numero`
                        y `.sost-item-titulo` de componentes.css — mismas clases,
                        no una copia con otros tokens, para que en Figma sean UN
                        estilo y no dos parecidos.

                        El icono se queda, pero alineado ARRIBA (`items-start`) y
                        no al pie del numeral: `.sost-item-titulo` sube 16px para
                        montarse sobre el número, y con el icono abajo el título
                        le pasaría por encima en cuanto ocupara dos líneas —que
                        es lo normal aquí («Zona de recibimiento y presentación
                        del tour»).

                        El icono ENCOGE en móvil, y no es estética: el numeral
                        mide 48px ahí (72px en sm+), así que el título aterriza
                        a 32px del tope de la fila y un chip de 44px le pasaba
                        por debajo — medido, se solapaban las seis zonas. A
                        28px queda holgado. */}
                    <div className="flex items-start justify-between gap-4">
                      <p className="sost-numero" aria-hidden="true">
                        {String(i + 1).padStart(2, '0')}
                      </p>
                      <span
                        aria-hidden="true"
                        className="grid size-7 shrink-0 place-items-center rounded-card bg-aqua-tint text-aqua-dark sm:size-11"
                      >
                        <Icono className="size-4 sm:size-5" />
                      </span>
                    </div>
                    <h3 className="sost-item-titulo text-balance font-display text-h3 font-semibold text-navy">
                      {z.nombre}
                    </h3>
                    {/* [v3 2026-08-06] El claim del cliente, entre el nombre
                        de la zona y su parrafo. Es la linea que vende («Your
                        Vacation Starts Before You Board»): sin ella, la zona
                        se presenta con una etiqueta administrativa y un
                        parrafo largo. */}
                    {/* [2026-09-01, UPDATES 09/01] El aviso de que la zona
                        todavía no abre. Va ANTES del claim y en coral, igual
                        que en /marine-park (pages/marine-park.tsx): son el
                        mismo aviso y tienen que leerse igual en las dos
                        páginas. El coral es lo que este sitio usa para «atención
                        a esto», y contra el aqua del claim se distingue solo. */}
                    {z.lanzamiento ? (
                      <p className="mt-1 text-sm font-semibold text-coral">({z.lanzamiento})</p>
                    ) : null}
                    {z.claim ? (
                      <p className="mt-1 font-display text-lg font-semibold text-aqua-dark">
                        {z.claim}
                      </p>
                    ) : null}
                    <p className="mt-3 text-navy-sub">{z.descripcion}</p>
                    <ul className="mt-6 flex flex-col gap-2.5 border-t border-linea pt-6">
                      {z.bullets.map((b) => (
                        <li key={b} className="flex gap-2.5 text-sm text-navy">
                          <Check
                            className="mt-0.5 size-4 shrink-0 text-aqua-dark"
                            aria-hidden="true"
                          />
                          {b}
                        </li>
                      ))}
                    </ul>
                    {/* La frase de cierre, cuando la zona la trae. Va DESPUES
                        de los checks porque es el remate del argumento, no su
                        entrada. */}
                    {z.cierre ? (
                      <p className="mt-4 font-medium text-navy">{z.cierre}</p>
                    ) : null}
                    <Link
                      to="/#tours"
                      className="group mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-coral transition-colors hover:text-coral-dark"
                    >
                      {INSTALACIONES.zonaCta}
                      <ArrowRight
                        className="size-4 transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </Link>
                  </div>
                </div>
              </article>

              {/* [v3 2026-08-06, WEBSITE - NOSOTROS pag. 15] Aqui se
                  intercalaba la banda «La cocina, el mar y la ciencia, en un
                  solo dia». El cliente la TACHA EN ROJO, asi que sale — con
                  ella y con el museo (que se muda a /marine-park), la pagina
                  pierde dos interrupciones y las 5 zonas se leen seguidas. */}
            </Fragment>
          )
        })}
      </div>
    </section>
  )
}
