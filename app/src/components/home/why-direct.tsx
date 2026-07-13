import { EnlacePrototipo } from '@/components/ui/enlace-prototipo'

// "Why book direct" — el bloque que no existe en la web actual (ver
// NOTAS['home-why-direct'] del prototipo): Viator vende el mismo tour al
// mismo precio y hoy no hay ninguna razón visible para reservar directo.
const BENEFICIOS = [
  { icono: '25%', titulo: 'Confirma con 25%', texto: 'Paga el depósito hoy y el resto en efectivo el día del tour.' },
  { icono: '-5%', titulo: 'Descuento en cash', texto: '5% extra si el saldo lo pagas en efectivo a bordo.' },
  { icono: '🍽', titulo: 'Elige tu menú', texto: 'Langosta, Angus o vegetariano: solo reservando directo eliges plato por persona.' },
  { icono: '💬', titulo: 'WhatsApp directo', texto: 'Hablas con el equipo del barco, no con un call center.' },
]

export function WhyDirect() {
  return (
    <section className="bg-papel-hueso px-5 py-seccion-sm sm:px-10 sm:py-seccion">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-aqua-dark">Reserva directa</p>
        <h2 className="mt-2 max-w-2xl font-display text-h2 font-semibold text-navy">
          ¿Por qué reservar aquí y no en un portal?
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFICIOS.map((b) => (
            <div key={b.titulo}>
              <div className="grid size-11 place-items-center rounded-full bg-aqua-tint text-sm font-bold text-aqua-dark">
                {b.icono}
              </div>
              <p className="mt-3 font-display text-base font-semibold text-navy">{b.titulo}</p>
              <p className="mt-1 text-sm text-navy-soft">{b.texto}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-sm text-navy-soft">
          + Reembolso total por mal clima o cancelando con 7 días. Mismo precio que en los portales —
          pero con todo esto incluido.{' '}
          <EnlacePrototipo className="font-semibold text-aqua-dark hover:underline">
            Ver la comparación completa →
          </EnlacePrototipo>
        </p>
      </div>
    </section>
  )
}
