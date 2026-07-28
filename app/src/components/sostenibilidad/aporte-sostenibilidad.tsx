import { Etiqueta } from '@/components/ui/etiqueta'
import { SOSTENIBILIDAD } from '@/data/sostenibilidad'

// «A dónde va tu aporte» — los US$ 3.50 + US$ 2.00 por huésped (slide 61).
//
// [v2 2026-07-28, 2ª vuelta, pedido de Samuel: «lo de por cada huésped e
// iniciativas a la fundación, como que no se entiende mucho el dinero que se
// da, está raro… hay que ubicarlo de mejor forma en otra parte»]
//
// Antes eran el PIE de la banda de impacto: dos cifras en una fila con un
// rótulo lateral. El defecto no era el sitio, era que faltaba la mitad de la
// información — un importe suelto no dice de dónde sale ni en qué se gasta, y
// leído así parecía un donativo simbólico. Aquí cada uno cuenta las tres
// cosas: CUÁNTO (la cifra, en aqua), POR QUIÉN (por huésped, no por reserva:
// una reserva de seis paga seis veces) y EN QUÉ (el detalle).
//
// Va justo DEBAJO de la banda de impacto y no en cualquier otro sitio: las 4
// cifras son el resultado y esto es el mecanismo que lo financia. Separarlos
// más los desconectaría; el orden resultado → mecanismo es el que ya tenía la
// página cuando esto era su pie.
//
// Dos superficies, una por importe (mismo recurso que el resto de la página:
// --color-papel-hueso plano, sin borde ni sombra). Una sola superficie con
// los dos dentro volvería a leerlos como «una cifra y otra cifra» — que es
// justo lo que no se entendía.
export function AporteSostenibilidad() {
  return (
    <section>
      <Etiqueta className="sost-reveal">{SOSTENIBILIDAD.aporteEyebrow}</Etiqueta>
      <h2 className="sost-reveal mt-2 font-display text-h2 font-semibold text-navy">
        {SOSTENIBILIDAD.aporteTitulo}
      </h2>
      <p className="sost-reveal mt-3 max-w-2xl text-lead text-navy-sub">
        {SOSTENIBILIDAD.aporteLead}
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {SOSTENIBILIDAD.aportes.map((a) => (
          <div key={a.destino} className="sost-reveal rounded-card-grande bg-papel-hueso p-6 sm:p-8">
            {/* La cifra y «por huésped» en la misma línea de base: el matiz
                es parte del dato, no una aclaración al pie. */}
            <p className="flex flex-wrap items-baseline gap-x-3">
              <span className="font-display text-sost-impacto-movil font-semibold text-aqua-dark sm:text-sost-impacto">
                {a.valor}
              </span>
              <span className="text-sm font-medium text-navy-soft">{a.unidad}</span>
            </p>
            <p className="mt-4 font-display text-base font-semibold text-navy">{a.destino}</p>
            <p className="mt-1 text-sm text-navy-sub">{a.detalle}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
