import { useRef, useState } from 'react'
import { Footer } from '@/components/home/footer'
import { HeroInterna } from '@/components/internas/hero-interna'
import { CabeceraInterna } from '@/components/internas/cabecera-interna'
import { FamiliaHispaniola } from '@/components/flota/familia-hispaniola'
import { FlotaGrid } from '@/components/flota/flota-grid'
import { RecorridoFlota } from '@/components/flota/recorrido-flota'
import { CocinaTiempos } from '@/components/flota/cocina-tiempos'

import { useCascadaNosotros } from '@/components/nosotros/use-cascada-nosotros'
import { useDevFlag } from '@/dev/use-dev-flag'
import { Meta } from '@/components/seo/meta'
import { t } from '@/lib/i18n'

// Página Flota (/flota) — correcciones v2, plan 04.
//
// La flota deja de ser una sección de /nosotros y pasa a página propia, porque
// el menú nuevo la pone como destino («Nosotros → Tripulación · Instalaciones ·
// Flota», reunión del 07-24).
//
// ⚠️ NO hay teaser en /nosotros: esa página DESAPARECE. El cliente lo confirmó
// en la reunión (29:02): «no va a haber una página única de nosotros, sino
// estas tres cosas». `/nosotros` redirige aquí desde App.tsx — la ruta vieja no
// devuelve 404 porque está indexada.
//
// ── ITERACIÓN v2 (2026-07-28) ────────────────────────────────────────────
//
// La primera versión de esta página era el grid heredado + la línea de tiempo
// + el banner de arrecife: de las 10 slides que el PDF dedica a /flota solo
// estaba aplicado el «sale a página propia». Samuel pidió aplicar el resto.
// El ORDEN de arriba abajo lo dictó él («la presentación de la familia […]
// agregar aquí el tema del dueño y el recorrido de años, luego las cards de
// los botes […] luego el resto de card y el banner»):
//
//   1. FamiliaHispaniola   — presentación + dueño + recorrido de años (slides
//                            26-27). Reemplaza a `NuestraHistoria`, cuyo panel
//                            de la cita se absorbe aquí (ver ese componente).
//   2. FlotaGrid           — las cards nuevas: vídeo por defecto, mini-galería,
//                            360º y ficha técnica en modal (slide 28).
//   3. CocinaYParadas      — la cocina flotante y las 3 paradas (slides 32-34).
//   4. BannerCeroPlastico  — el banner de cierre, reenfocado (slide 30).
//                            Sustituye a `ArrecifeTeaser`: el CTA sigue
//                            llevando a Sostenibilidad, así que el enlace
//                            interno no se pierde, solo deja de ser el titular.
//
// ⚠️ LA COCINA SE MONTÓ EN OSCURO Y A SANGRE, Y SE REHIZO (2026-07-28). Seguía
// la maqueta del slide 33, que va en tema oscuro, y por eso vivía FUERA de
// este contenedor. Samuel lo descartó al verlo en la página («el cambio es
// demasiado brusco»): en la slide ese bloque está solo, pero aquí llega
// después de la presentación y de 6 cards sobre papel, y una banda casi negra
// en medio se lee como otra web. Vuelve a ser una sección normal dentro del
// contenedor común — ver el comentario largo de cocina-y-paradas.tsx.
//
// Con ella dentro, el ORDEN cambia: la cocina pasa a ir ANTES del banner. Ya
// no hay motivo para dejar el banner en medio (era el respiro claro antes de
// la banda oscura), y un banner con CTA es un cierre mejor que un remate.
export function FlotaPage() {
  const contenidoRef = useRef<HTMLDivElement>(null)

  // [dev-mode] ?dev-flota=estatico congela los efectos de scroll en su estado
  // FINAL (línea de tiempo trazada, cards ya asentadas) → frame limpio para
  // Figma. Coincide con lo que ve quien tiene prefers-reduced-motion. Antes
  // este flag era `?dev-nosotros=estatico`, heredado de la página de la que
  // salió esta; se renombra porque /nosotros ya no existe y el nombre viejo
  // mandaba a leer una página retirada. Ver dev-registry.ts.
  const [estatico, setEstatico] = useState(false)
  useDevFlag('dev-flota', (v) => setEstatico(v === 'estatico')) // [dev-mode]
  useCascadaNosotros(contenidoRef, { activo: !estatico }) // [dev-mode] gate
  // ⚠️ `useTimelineHistoria` YA NO SE LLAMA AQUÍ (2026-08-07): con el carril
  // nuevo, el año activo es estado de la propia timeline, así que el hook vive
  // dentro de FamiliaHispaniola y esta página solo le pasa el flag. La cascada
  // sí se queda: no tiene estado, y sus dos grupos de elementos viven en
  // componentes distintos bajo este mismo contenedor.

  return (
    <div>
      <Meta
        titulo={t('Our fleet')}
        descripcion={t('The Hispaniola Aquatic Adventures fleet: sailing and power catamarans, speedboats and the event catamaran, each with video, gallery and a full spec sheet.')}
        ruta="/fleet"
      />
      <HeroInterna ctaHref="/#tours">
        {/* [v3 2026-08-06, WEBSITE - NOSOTROS pag. 3] Titular APROBADO. El
            cliente escribe «QUITAR LA FRASE DEBAJO Y PONER…», asi que el lead
            tambien es suyo, literal. */}
        <CabeceraInterna
          eyebrow={t('Our fleet')}
          titulo={t('The fleet that brings every adventure to life')}
          lead={t('Every boat has a purpose. Each vessel in our fleet has been carefully selected and customized for the experience.')}
        />
      </HeroInterna>

      {/* ⚠️ EL CONTENEDOR ESTÁ PARTIDO EN DOS (2026-08-07, 4ª vuelta de la
          cocina — Samuel: «que no esté metido como en un banner, hagamos que sea
          ancho completo hasta los extremos de la pantalla»). Entre las dos
          mitades va la banda de la cocina A SANGRE. Se saca de la columna en vez
          de sangrarla con `100vw` + margen negativo: ese truco mete la barra de
          scroll en la cuenta y deja la página con scroll horizontal en Windows —
          misma decisión, y mismo porqué, que el barrido de /foundation (ver
          pages/fundacion.tsx).
          Este primer contenedor pierde su `py` simétrico: mantiene el de arriba
          y deja el de abajo a 0, porque lo que sigue es la espuma de la banda y
          cualquier aire extra ahí abriría una franja de papel muerta entre la
          rejilla y las olas. */}
      <div className="mx-auto max-w-contenido px-5 pt-12 sm:px-10 lg:pt-16">
        <FamiliaHispaniola />
      </div>

      {/* EL RECORRIDO DE AÑOS, FUERA DE LA COLUMNA (2026-08-07, Samuel: «que el
          scroll fijo no se corte con el contenedor interno, sino con los
          extremos de la pantalla, da mayor inmersión»). Es la MISMA razón, y la
          misma técnica, que la banda de la cocina de más abajo: se saca de la
          columna en vez de sangrarlo con `100vw` + margen negativo, porque ese
          truco mete la barra de scroll en la cuenta y deja la página con scroll
          horizontal en Windows.
          El titular NO se sangra con él: la sección trae su propia rejilla de
          tres columnas (`.escena-sangrada`) que deja el texto alineado con el
          resto de /flota y manda solo la pista hasta el borde. */}
      <RecorridoFlota estatico={estatico} /> {/* [dev-mode] gate */}

      {/* El `pb` NO es aire decorativo (2026-08-07, Samuel: «con la sección de
          abajo se corta el borde de la card y la sombra»): la rejilla terminaba
          a ras del contenedor y la espuma de la banda de la cocina arrancaba
          justo ahí, comiéndose el borde inferior y el `--shadow-card` (16px de
          difuminado) de la última fila. La sombra necesita papel POR DEBAJO de
          la card para existir. Se queda por debajo del `pt` a propósito: la
          banda tiene que seguir leyéndose como continuación de la rejilla, no
          como una sección suelta con una franja muerta delante. */}
      <div ref={contenidoRef} className="mx-auto max-w-contenido px-5 pb-12 pt-16 sm:px-10 lg:pb-16 lg:pt-24">
        <FlotaGrid />
      </div>

      {/* [2026-08-07, slide 69: «resaltar que es única en Punta Cana»] La cocina
          flotante pasa a contarse POR TIEMPOS — el párrafo aprobado se enciende
          al scrollear y la foto clavada cambia con él (ver
          flota/cocina-tiempos.tsx). Sustituye a `CocinaYParadas`, que se conserva
          sin montar por si hay que volver, igual que el banner de cero plástico.
          ⚠️ Antes de esto hubo una tanda de 5 propuestas de COLOR (banda naranja
          a sangre, carta, corte diagonal, foto oscura, bento): descartadas las
          cinco por Samuel. Si la sección vuelve a mover, que no sea por ahí.
          ⚠️ VA FUERA DE LA COLUMNA a propósito — es la banda a sangre. No
          devolverla dentro sin quitarle antes su propio max-w interno.
          ⚠️ Y ES LA ÚLTIMA SECCIÓN ANTES DEL FOOTER, que es lo que decide el
          contenedor vacío de abajo. La banda sale por su propia espuma (5ª
          vuelta: olas también en el pie) y el footer entra con LA SUYA, así que
          entre las dos hace falta papel de verdad: las dos espumas son bloques
          del color del papel, y pegadas se leería una franja clara continua
          entre dos superficies oscuras en vez de dos umbrales. Ese tramo es lo
          que las separa. */}
      <CocinaTiempos />

      {/* [v3 2026-08-06, PowerPoint slide 70] El banner de cero plastico sale de
          /flota junto con las 3 paradas: el cliente tacha las dos. El mensaje no
          se pierde — vive en el cintillo eco de la home y en /sostenibilidad, que
          es su sitio. El componente se conserva por si vuelve a hacer falta.
          Este contenedor se queda VACÍO de contenido a propósito: su trabajo hoy
          es el tramo de papel que separa la banda del footer (ver arriba). El día
          que entre una sección nueva, va aquí dentro. */}
      <div className="mx-auto max-w-contenido px-5 pb-12 pt-12 sm:px-10 lg:pb-16 lg:pt-16" />

      <Footer />
    </div>
  )
}
