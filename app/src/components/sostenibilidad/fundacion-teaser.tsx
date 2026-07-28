import { Boton } from '@/components/ui/boton'
import { Etiqueta } from '@/components/ui/etiqueta'
import { FundadoresFundacion } from '@/components/fundacion/fundadores-fundacion'
import { FUNDACION } from '@/data/fundacion'

// Teaser de la Fundación en /ventaja-competitiva — correcciones v2, plan 08
// §3 (slide 62), y destino del chip «La fundación» de la fila de anclas.
//
// EL LÍMITE ENTRE LAS DOS PÁGINAS. La maqueta del cliente mete la fundación
// entera dentro de esta misma página. Aquí se cuenta lo justo —nombre, los 3
// hitos y quién está detrás— y se enlaza a /fundacion para el resto. Por eso
// el copy vive en data/fundacion.ts y no aquí: si se duplica a mano en los dos
// sitios, al primer retoque dejan de decir lo mismo.
//
// ══ DISPOSICIÓN, 5ª vuelta (2026-07-28) ══
//
// La 4ª vuelta montó el slide 62 tal cual: texto + hitos + CTA a la izquierda,
// ficha de fundadores a la derecha. Samuel: «que los fundadores se vean
// reutilizando las cards de tripulación, tal vez haya que cambiar la
// disposición de la sección». Y sí, hay que cambiarla: esas cards son
// retratos 4:5 a sangre y tres de ellas no caben en una columna de 5/12 —
// piden fila propia.
//
// Así que la sección pasa de DOS COLUMNAS a DOS TIEMPOS: arriba el bloque
// institucional (nombre, párrafo, los 3 hitos y el CTA cerrando) y debajo los
// tres fundadores en fila. Se lee mejor que antes: quién ES la fundación →
// quién la SOSTIENE, en vez de las dos cosas compitiendo a izquierda y
// derecha.
//
// ⚠️ Y las cards no se calcan: se reutiliza el COMPONENTE que /fundacion ya
// monta para esto (fundacion/fundadores-fundacion.tsx, que a su vez es
// home/equipo-teaser.tsx parametrizado). Cero markup nuevo, cero copy
// duplicado, y las dos páginas enseñan exactamente los mismos tres. Si mañana
// llegan las fotos de los cofundadores, entran en los dos sitios a la vez con
// solo tocar `foto: null` en data/fundacion.ts.
export function FundacionTeaser() {
  return (
    <section id="ancla-fundacion" className="scroll-mt-sticky-top">
      {/* DOS COLUMNAS otra vez (6ª vuelta, Samuel: «deja los 3 features a la
          derecha como estaban antes, queda más equilibrado»). La 5ª vuelta los
          había bajado al pie del texto siguiendo el slide 62, pero eso fue
          cuando los fundadores vivían a la derecha; ahora que los fundadores
          se han ido a su propia fila, la derecha quedaba vacía y todo el peso
          se apilaba a la izquierda. Con los hitos ahí, las dos columnas se
          equilibran y el CTA sigue cerrando su columna. */}
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <Etiqueta className="sost-reveal">{FUNDACION.teaserEyebrow}</Etiqueta>
          <h2 className="sost-reveal mt-2 text-balance font-display text-h2 font-semibold text-navy">
            {FUNDACION.nombreLegal}
          </h2>
          <p className="sost-reveal mt-3 max-w-2xl text-lead text-navy-sub">
            {FUNDACION.teaserTexto}
          </p>

          <div className="sost-reveal mt-8">
            <Boton to="/fundacion">{FUNDACION.teaserCta}</Boton>
          </div>
        </div>

        {/* Los 3 hitos, cada uno CON SU PROPIA SUPERFICIE (3ª vuelta: «dale un
            fondo a cada uno de los puntos, no un fondo general a los 3») — un
            fondo único los leía como lista corrida, que es el mismo defecto
            que tenían con hairlines. */}
        <ul className="sost-reveal flex flex-col gap-3 lg:col-span-5">
          {FUNDACION.hitos.map((h) => (
            <li key={h.cifra} className="rounded-card bg-papel-hueso px-5 py-4">
              <p className="font-display text-h3 font-semibold text-aqua-dark">{h.cifra}</p>
              <p className="mt-1 text-sm text-navy-soft">{h.texto}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Sin `.sost-reveal`: este bloque trae su propia animación de entrada
          (el arco al scrollear de use-equipo-scroll.ts). Dos efectos de
          entrada sobre el mismo nodo se pisan — el batch lo bajaría 24px
          justo mientras el arco lo está colocando. */}
      <div className="mt-14">
        <FundadoresFundacion />
      </div>
    </section>
  )
}
