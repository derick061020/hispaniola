import { BadgeCheck, Check, ShieldCheck } from 'lucide-react'
import { SelloTripAdvisor } from '@/components/ui/sello-tripadvisor'
import * as StatusBadge from '@/components/alignui/status-badge'
import { Estrellas } from '@/components/ui/estrellas'
import { InsigniaTooltip } from '@/components/ui/insignia-tooltip'
import type { Tour } from '@/data/home'
import type { FichaTour } from '@/data/tours'

// Above the fold de la ficha (wireframe A1): rating con nº de reseñas,
// cancelación gratis, audiencia y duración como chips junto al H1 — el patrón
// Civitatis/Viator. La prueba social y la tranquilidad ANTES de que el visitante
// tenga que scrollear ni una vez.
//
// Etapa A (PLAN-ALIGNUI.md): los chips son StatusBadge del sistema. La antigua
// distinción tono ok/neutro se traduce a su lenguaje: la cancelación es un
// ESTADO positivo (completed + light = el par menta de siempre, via el slot
// success), los metadatos (audiencia, duración, recogida) van en stroke.
//
// PLAN-INTERNAS-V2.md (§C1): deja de ser una sección propia sobre blanco — se
// disuelve en el `children` de HeroInterna, sobre la foto del tour. Pierde su
// contenedor (lo pone el hero) y sus colores pasan a blanco: el H1 y el
// contador de reseñas por clase directa; la migaja AlignUI por el wrapper
// `.migaja-sobre-foto` (componentes.css — re-tema sus slots de color sin
// tocar el vendor). Los StatusBadge NO cambian: sus 3 variantes (stroke,
// completed+light, completed+stroke) ya pintan un fondo OPACO (blanco o
// verde claro — nunca transparente), así que ya leen bien sobre cualquier
// foto, igual que el chip de audiencia de la TourCard.

type Props = { tour: Tour; ficha: FichaTour }

export function CabeceraFicha({ tour, ficha }: Props) {
  return (
    <div>
      {/* EL PREMIO ENCABEZA LA FICHA. Historia de la decisión, porque son
          tres vueltas sobre el mismo elemento:
            · 2026-07-22 (Samuel) — «lo de #1 en TripAdvisor ponlo arriba del
              título, no al final del hero, y ponle en blanco». Antes cerraba
              la fila de chips, el peor sitio posible para el argumento más
              fuerte del producto: el visitante ya había pasado por encima de
              otros 4 chips cuando llegaba a él. Arriba del H1 funciona como
              el eyebrow de una portada — se lee ANTES que el nombre del tour.
            · 2026-07-27 (cliente, slide 8) — «destacar mucho más ese mensaje,
              es un logro que hay que destacar». Pasó a insignia con caja
              propia (fondo translúcido y borde).
            · 2026-07-28 (Samuel) — esa caja se retira y el protagonista pasa a
              ser el SELLO REAL de TripAdvisor. Ver ui/sello-tripadvisor.tsx.
          Lo que NO ha cambiado en las tres vueltas: aquí crece esto y no se
          añade nada más a su lado — hay diagnóstico documentado de «hero
          cargado» en el cerebro. */}
      <SelloTripAdvisor />

      {/* --text-h2 (32px), no un tamaño nuevo: en Figma es el mismo text style
          que el título de sección. El H1 de la ficha manda por jerarquía
          (es el <h1> de la página), no por tamaño — el hero de la home es el
          único sitio con --text-hero. Sin migaja (retirada de todos los
          heros de internas, 2026-07-22, pedido de Samuel — este archivo la
          traía vía Breadcrumb de AlignUI, .migaja-sobre-foto en
          componentes.css). */}
      <h1 className="mt-3 text-balance font-display text-h2 font-semibold text-white">{ficha.tituloLargo}</h1>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="flex items-center gap-2">
          <Estrellas calificacion={tour.rating} sobreOscuro />
          <span className="text-sm text-white/80">
            <strong className="font-semibold text-white">{tour.rating}</strong> ·{' '}
            {tour.resenas.toLocaleString('en-US')} reseñas
          </span>
        </span>

        {/* Los chips siguen a renderFicha() del prototipo, no al wireframe: la
            cancelación gratis no se promete en 'consulta' (Isla Saona no tiene
            ni precio confirmado). El chip "WiFi a bordo" del wireframe no está:
            el WiFi se cuenta en la sección Incluye de la home, no aquí.

            2026-07-22: se retiran los chips «{duración}» y «Recogida en
            hotel». No es una poda por gusto — esos dos hechos ahora se
            publican, con su icono y su contexto, en la ficha técnica que
            hay bajo el mosaico (tour/datos-tour.tsx). Repetirlos aquí
            dejaba la fila en 7 elementos y, peor, gastaba el sitio más
            valioso de la página en metadatos que el visitante no necesita
            hasta más abajo. Lo que se queda en el hero son los ARGUMENTOS
            (rating, cancelación, las dos insignias) y el único metadato que
            sí filtra público desde el primer segundo: la audiencia — a quien
            viaja con niños le importa leer «Solo adultos» antes de nada. */}
        {/* [v3 2026-08-06, WEBSITE-TOURS pág. 1 + slide 71] Cuando la ficha
            trae `chipsHero`, esa lista APROBADA sustituye a la fila entera.
            No es que se «añadan» a lo que había: el cliente tachó
            «Cancelación gratis» y escribió una lista cerrada de 4 (+ el «Ages
            15+» de la reunión), sin el distintivo de excelencia ni la
            garantía del mejor precio. Los dos tooltips que Samuel redactó el
            07-22 salen de esa ficha con él — están abajo, condicionados, y
            siguen intactos en las 3 que aún no tienen lista propia.
            Todos en `stroke`: son ARGUMENTOS del producto (qué te llevas), no
            un estado positivo como era la cancelación, que sí pedía el par
            menta. Uniformarlos evita que uno cante más que los otros cuando
            el cliente los dio como una lista de iguales. */}
        {ficha.chipsHero ? (
          ficha.chipsHero.map((chip) => (
            <StatusBadge.Root key={chip} status="disabled" variant="stroke">
              {chip}
            </StatusBadge.Root>
          ))
        ) : (
          <>
            {tour.booking !== 'consulta' ? (
              <StatusBadge.Root status="completed" variant="light">
                <StatusBadge.Icon as={Check} />
                Cancelación gratis
              </StatusBadge.Root>
            ) : null}
            <StatusBadge.Root status="disabled" variant="stroke">
              {tour.audienciaChip}
            </StatusBadge.Root>
          </>
        )}

        {/* Distintivo de excelencia + Garantía del mejor precio (Samuel,
            2026-07-22, con el texto del tooltip escrito por él). El #1 en
            TripAdvisor que ocupaba este sitio SUBE al eyebrow (arriba).

            ⚠️ POR QUÉ AHORA SÍ SE PINTA EL «DISTINTIVO DE EXCELENCIA». En la
            v1 de correcciones se descartó a propósito: la maqueta del cliente
            lo copiaba de Viator, donde es un premio DE VIATOR con su año y su
            criterio — y nosotros no podemos otorgarnos un premio ajeno. Lo
            que cambia es el TEXTO que Samuel eligió para el tooltip: «cumple
            NUESTROS estándares de calidad más altos». Eso ya no es un premio
            de un tercero sin verificar, es un criterio propio de Hispaniola
            sobre su propio catálogo — el mismo tipo de afirmación que la web
            ya hace («no más del 35% de capacidad», «grupo pequeño»). Por eso
            el tooltip es obligatorio y no decorativo: es lo que separa una
            insignia honesta de una medalla inventada.

            ⚠️ PENDIENTE DEL CLIENTE: el criterio EXACTO por el que un tour
            gana esta insignia (¿rating mínimo? ¿nº de reseñas? ¿todos los
            tours la llevan?). Hoy la llevan todos, que es tanto como no
            llevarla. En cuanto haya criterio, se condiciona aquí.

            «Garantía del mejor precio» sí tiene respaldo desde el día uno: es
            la tesis entera de la sección Reserva Directa de la home (los dos
            boletos al mismo precio, BENEFICIOS_DIRECTO en data/home.ts) y del
            «ahorras hasta 15%» del widget. No es una promesa nueva. */}
        {ficha.chipsHero ? null : (
          <>
            <InsigniaTooltip
              icono={BadgeCheck}
              titulo="Insignia de excelencia"
              texto="Esta experiencia está muy bien valorada por los viajeros y cumple nuestros estándares de calidad más altos."
            >
              Distintivo de excelencia
            </InsigniaTooltip>

            <InsigniaTooltip
              icono={ShieldCheck}
              titulo="Garantía del mejor precio"
              texto="Reservando aquí pagas lo mismo o menos que en cualquier portal — y encima eliges menú, confirmas con el 25% y hablas directo con el equipo del barco."
            >
              Garantía del mejor precio
            </InsigniaTooltip>
          </>
        )}
      </div>
    </div>
  )
}
