import { Boton } from '@/components/ui/boton'
import { Etiqueta } from '@/components/ui/etiqueta'
import { FUNDACION } from '@/data/fundacion'

// Teaser de la Fundación en /ventaja-competitiva — correcciones v2, plan 08
// §3 (slide 62), y destino del chip «La fundación» de la fila de anclas.
//
// EL LÍMITE ENTRE LAS DOS PÁGINAS. La maqueta del cliente mete la fundación
// entera (institucional + 5 proyectos + membresías) dentro de esta misma
// página. Aquí no, porque Samuel decidió el 2026-07-26 que la fundación tiene
// página propia (/fundacion): esta la MENCIONA con lo justo —nombre, quién
// está detrás, los 3 hitos— y enlaza. Es el mismo patrón que ArrecifeTeaser
// en /nosotros y que la flota: una página cuenta, la otra remite.
//
// Por eso también el copy vive en data/fundacion.ts y no aquí: si se duplica
// a mano en los dos sitios, al primer retoque dejan de decir lo mismo.
//
// Sin foto, a propósito: no existe NI UNA foto propia de la fundación en el
// proyecto (pendiente desde la v1). Ilustrarlo con una foto de snorkel sería
// decorar, no contar — y a esta altura de la página ya han pasado 7 videos
// reales del vivero y las tortugas.
export function FundacionTeaser() {
  return (
    <section id="ancla-fundacion" className="scroll-mt-sticky-top">
      {/* Sin hairline de separación arriba (pedido de Samuel 2026-07-28): el
          resto de la página separa sus secciones solo con blanco (el gap-16 /
          lg:gap-24 de la columna), y esta no tiene por qué ser la excepción. */}
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <Etiqueta className="sost-reveal">{FUNDACION.teaserEyebrow}</Etiqueta>
          <h2 className="sost-reveal mt-2 font-display text-h2 font-semibold text-navy">
            {FUNDACION.nombreLegal}
          </h2>
          <p className="sost-reveal mt-3 max-w-2xl text-lead text-navy-sub">
            {FUNDACION.teaserTexto}
          </p>
          <div className="sost-reveal mt-6">
            <Boton to="/fundacion">{FUNDACION.teaserCta}</Boton>
          </div>
        </div>

        {/* Los 3 hitos, en columna. Mismo idioma que la banda de impacto de
            más arriba: cifra en aqua con peso tipográfico, y el grupo lo
            sostiene una SUPERFICIE --color-papel-hueso en vez de hairlines
            (2026-07-28, Samuel: «lo que está a la derecha tampoco sea por
            líneas» y, al verlo sin nada, «se ven flotando sin más… hay que
            reemplazarlas por otra forma que cumpla ese propósito»). Plana,
            sin borde ni sombra — agrupa sin dibujar. */}
        <ul className="sost-reveal flex flex-col gap-6 rounded-card bg-papel-hueso p-6 lg:col-span-5">
          {FUNDACION.hitos.map((h) => (
            <li key={h.cifra} className="flex items-baseline gap-4">
              <span className="font-display text-h3 font-semibold text-aqua-dark">{h.cifra}</span>
              <span className="text-sm text-navy-soft">{h.texto}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
