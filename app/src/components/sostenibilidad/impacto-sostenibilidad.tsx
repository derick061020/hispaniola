import { Etiqueta } from '@/components/ui/etiqueta'
import { SOSTENIBILIDAD } from '@/data/sostenibilidad'

// Banda de impacto (2026-07-22, pedido de Samuel: "además de eso debemos
// agregar estos datos... no me gusta mucho la idea de meter un box y dentro
// más boxes, vamos a intentar hacerlo más estético, más minimalista, pero hay
// que meter todos esos datos").
//
// El mockup que aportó traía las 6 cifras dentro de un rectángulo verde y, a
// su vez, los 2 importes por huésped en DOS cajas dentro de esa caja. Aquí se
// resuelve quitando los boxes en vez de anidarlos mejor: sin fondo, sin radio
// y sin sombra — las cifras se sostienen con peso tipográfico y se separan con
// los mismos hairlines (--color-linea) que ya estructuran toda la página. Es
// también lo coherente con la dirección visual B "Charter Premium": el aqua es
// acento con cuentagotas, nunca un fondo grande de sección (y un box verde de
// lado a lado era exactamente eso).
//
// La jerarquía sustituye a las cajas: las 4 cifras de impacto arriba y en
// aqua (el RESULTADO), los 2 importes por huésped debajo, más pequeños y en
// navy (el MECANISMO — de dónde sale ese resultado). El copy y la procedencia
// de los números, en data/sostenibilidad.ts §impacto.
export function ImpactoSostenibilidad() {
  return (
    <section>
      <Etiqueta className="sost-reveal">{SOSTENIBILIDAD.impactoEyebrow}</Etiqueta>
      <h2 className="sost-reveal mt-2 font-display text-h2 font-semibold text-navy">
        {SOSTENIBILIDAD.impactoTitulo}
      </h2>

      {/* border-y + divide-x: toda la "caja" del mockup reducida a 4 hairlines.
          En móvil se apila en 2×2 sin divisorias verticales (a esa anchura
          serían 4 columnas de ~80px, ilegibles). */}
      <div className="sost-reveal mt-8 grid grid-cols-2 gap-y-8 border-y border-linea py-8 lg:grid-cols-4 lg:gap-y-0 lg:divide-x lg:divide-linea">
        {SOSTENIBILIDAD.impacto.map((s) => (
          <div key={s.label} className="lg:px-8 lg:first:pl-0 lg:last:pr-0">
            <p className="font-display text-sost-impacto-movil font-semibold text-aqua-dark sm:text-sost-impacto">
              {s.valor}
            </p>
            <p className="mt-2 text-sm text-navy-soft">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Los 2 importes por huésped: misma fila, sin caja propia. Bajan de
          tamaño y cambian a navy para leerse como nota al pie de las cifras de
          arriba y no como una segunda tanda de titulares compitiendo. */}
      <div className="sost-reveal mt-6 flex flex-col gap-4 sm:flex-row sm:items-baseline sm:gap-10">
        <p className="shrink-0 text-eyebrow font-semibold uppercase tracking-[0.12em] text-navy-soft">
          {SOSTENIBILIDAD.aportesTitulo}
        </p>
        <div className="flex flex-col gap-x-12 gap-y-3 sm:flex-row sm:flex-wrap">
          {SOSTENIBILIDAD.aportes.map((a) => (
            <p key={a.label} className="flex flex-wrap items-baseline gap-x-2">
              <span className="font-display text-sost-aporte font-semibold text-navy">{a.valor}</span>
              <span className="text-sm text-navy-soft">{a.label}</span>
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
