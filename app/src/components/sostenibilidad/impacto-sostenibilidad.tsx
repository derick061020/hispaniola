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
    // id/scroll-mt: destino del chip «Impacto por huésped» (slide 58).
    <section id="ancla-impacto" className="scroll-mt-sticky-top">
      <Etiqueta className="sost-reveal">{SOSTENIBILIDAD.impactoEyebrow}</Etiqueta>
      <h2 className="sost-reveal mt-2 font-display text-h2 font-semibold text-navy">
        {SOSTENIBILIDAD.impactoTitulo}
      </h2>

      {/* [v2 2026-07-28, dos pedidos seguidos de Samuel] Primero: «no uses
          tantas líneas divisorias, al cliente no le gusta tanta línea» — las
          4 cifras iban entre 2 hairlines horizontales y separadas por 3
          verticales, 5 líneas para 4 datos. Y acto seguido, al verlo sin
          ellas: «se ven flotando sin más, las líneas tenían su propósito, hay
          que reemplazarlas por otra forma que cumpla ese propósito pero que
          no sea líneas».
          El propósito era AGRUPAR (decir «estos 6 datos son un bloque»), y
          quien lo hace sin dibujar ni una línea es una SUPERFICIE: el mismo
          --color-papel-hueso, sin borde ni sombra ni ring, que ya usa
          equipo/franja-equipo.tsx para exactamente esto.
          ⚠️ Esto NO reabre lo que Samuel rechazó del mockup original («no me
          gusta meter un box y dentro más boxes»): aquello era un box VERDE
          con dos boxes anidados dentro. Esto es una sola superficie neutra,
          plana, sin nada anidado — y el aqua sigue siendo solo el acento de
          las cifras, nunca el fondo (dirección visual B). */}
      <div className="sost-reveal mt-8 rounded-card-grande bg-papel-hueso px-6 py-8 sm:px-10 sm:py-10">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4 lg:gap-x-12">
          {SOSTENIBILIDAD.impacto.map((s) => (
            <div key={s.label}>
              <p className="font-display text-sost-impacto-movil font-semibold text-aqua-dark sm:text-sost-impacto">
                {s.valor}
              </p>
              <p className="mt-2 text-sm text-navy-soft">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Los 2 importes por huésped: dentro de la MISMA superficie, que es
            lo que ahora dice «esto explica las cifras de arriba» — antes lo
            decía el hairline que las separaba. Bajan de tamaño y van en navy
            para leerse como nota al pie y no como una segunda tanda de
            titulares compitiendo. */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-baseline sm:gap-10">
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
      </div>
    </section>
  )
}
