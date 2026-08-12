import { Etiqueta } from '@/components/ui/etiqueta'
import { FUNDACION } from '@/data/fundacion'

// EL BLOQUE INSTITUCIONAL DE LA FUNDACIÓN — «Our foundation»: quién es, por
// qué nació, el credo y los 4 hitos. Copy del cliente (slide 62 + v3
// 2026-08-06), en data/fundacion.ts.
//
// ⚠️⚠️ EL NOMBRE MIENTE Y LA CARPETA TAMBIÉN: hoy NO es un teaser y NO vive en
// /competitive-advantage. Desde el 2026-08-12 su único consumidor es
// pages/fundacion.tsx, donde va DETRÁS del barrido horizontal de los frentes
// (Samuel: «desde "our foundation" hasta las 2 cards finales las quitamos de
// competitive-advantage y las ponemos en foundation después de la sección de
// scroll horizontal»). El fichero se queda donde está —renombrar y mover con
// otra rama montando encima cuesta más de lo que aclara, y `cierre-doble.tsx`
// arrastra exactamente el mismo desajuste desde julio—, pero conviene
// arreglarlo en la próxima limpieza: `fundacion/bloque-institucional.tsx`.
//
// ══ QUÉ ERA ANTES (2026-07-28 → 2026-08-12) ══
//
// El teaser del slide 62 en /ventaja-competitiva: contaba lo justo —nombre,
// los hitos y quién estaba detrás— y enlazaba a /fundacion para el resto. Por
// eso su copy vivía (y sigue viviendo) en data/fundacion.ts y no aquí: se
// pintaba en dos páginas y duplicarlo a mano garantizaba que dejaran de decir
// lo mismo al primer retoque. Hoy solo se pinta en una, pero el dato se queda
// en su sitio — es contenido de la fundación, no de este componente.
//
// ══ LO QUE SE VA AL MUDARSE (2026-08-12) ══
//
//  · LOS TRES FUNDADORES. El bloque iba debajo del texto reutilizando
//    fundacion/fundadores-fundacion.tsx… que es justo lo que /foundation ya
//    monta arriba, nada más pasar el hero. Ahí se quedan: son las CARAS de la
//    fundación y llegar a ellas al final de la página es peor que abrir con
//    ellas. (Decisión de Samuel el 2026-08-12, opción «quitar los dos».)
//  · EL BOTÓN «Meet the Foundation» → /foundation. En /foundation es un enlace
//    a sí misma. Con él se va el último resto del papel de teaser.
//  · LAS CLASES `.sost-reveal`. Las pintaba use-sostenibilidad-reveal.ts, que
//    solo se llama desde pages/ventaja-competitiva.tsx: aquí no había hook que
//    las mirara, así que eran marcadores muertos. Sin ellas el bloque entra
//    como el resto de /foundation, que no tiene reveal de página.
//
// ⚠️ SOLAPE CONOCIDO CON EL HERO DE /foundation, y no es un descuido. El h2 de
// aquí es `nombreLegal` y el hero lo lleva de badge; el primer párrafo repite
// el «2016» y el Ministerio que ya dice `heroTexto`. data/fundacion.ts lo
// avisaba desde el 2026-08-07 («cuando /foundation adopte su hero v3, los dos
// bloques se van a mirar de frente»), y hoy se miran de frente en la MISMA
// página. La salida no es reescribir uno de los dos textos —el copy es del
// cliente— sino decidir cuál abre la página cuando llegue el hero v3.
//
// ══ DISPOSICIÓN ══
//
// Dos columnas 7/5: el texto a la izquierda y los hitos a la derecha (6ª
// vuelta, 2026-07-28 — Samuel: «deja los 3 features a la derecha como estaban
// antes, queda más equilibrado»). Sin el bloque de fundadores debajo, las dos
// columnas vuelven a ser toda la sección, que es la forma en la que se
// equilibraban.
export function FundacionTeaser() {
  return (
    <section id="fundacion" className="scroll-mt-header-alto">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <Etiqueta>{FUNDACION.teaserEyebrow}</Etiqueta>
          <h2 className="mt-2 text-balance font-display text-h2 font-semibold text-navy">
            {FUNDACION.nombreLegal}
          </h2>
          {/* [v3 2026-08-07] El claim del cliente bajo el nombre, en aqua:
              mismo papel y mismo trato que el de las zonas de /facilities y el
              de los pilares de /competitive-advantage. */}
          <p className="mt-2 font-display text-lg font-semibold text-aqua-dark">
            {FUNDACION.teaserClaim}
          </p>

          {/* Los dos párrafos aprobados, con EL CREDO EN MEDIO — ese es su
              orden en el documento y es el que hace que funcione: primero por
              qué nació, luego el giro («no creamos una fundación para sostener
              el negocio; montamos un negocio que pudiera sostener la
              conservación»), y solo entonces lo conseguido. */}
          <p className="mt-3 max-w-2xl text-lead text-navy-sub">{FUNDACION.teaserTexto[0]}</p>
          <ul className="mt-5 flex max-w-2xl flex-col gap-1.5">
            {FUNDACION.teaserCredo.map((linea) => (
              <li key={linea} className="font-display text-lg font-medium text-navy">
                {linea}
              </li>
            ))}
          </ul>
          <p className="mt-5 max-w-2xl text-lead text-navy-sub">{FUNDACION.teaserTexto[1]}</p>
        </div>

        {/* Los hitos, cada uno CON SU PROPIA SUPERFICIE (3ª vuelta: «dale un
            fondo a cada uno de los puntos, no un fondo general a los 3») — un
            fondo único los leía como lista corrida, que es el mismo defecto
            que tenían con hairlines. */}
        <ul className="flex flex-col gap-3 lg:col-span-5">
          {FUNDACION.hitos.map((h) => (
            <li key={h.cifra} className="rounded-card bg-papel-hueso px-5 py-4">
              <p className="font-display text-h3 font-semibold text-aqua-dark">{h.cifra}</p>
              <p className="mt-1 text-sm text-navy-soft">{h.texto}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
