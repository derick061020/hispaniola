import { Boton } from '@/components/ui/boton'
import { BoletoReserva } from '@/components/home/boleto-reserva'

// Página de soporte de conversión (NOTAS['reserva-directa'] del prototipo:
// "el argumento no es un destino [de menú] — vive como módulo en home + ficha
// + checkout, y como página de soporte solo para 'ver comparación →' y el
// footer"). Reusa el MISMO BoletoReserva del banner de la home (why-direct.tsx)
// — sin la animación de contracción por scroll ni el stack solapado (eso es
// del banner a sangre); aquí, lado a lado y estáticos, para poder mandar el
// link por WhatsApp y que se lea de un vistazo, también en móvil.
export function Comparacion() {
  return (
    <section>
      <div className="grid grid-cols-1 items-start gap-8 sm:grid-cols-2">
        <BoletoReserva variante="portal" className="mx-auto w-full max-w-boleto-ancho" />
        <BoletoReserva variante="directo" className="mx-auto w-full max-w-boleto-ancho" />
      </div>

      <div className="mt-10 flex justify-center">
        <Boton to="/#tours" tamaño="lg">
          Ver disponibilidad
        </Boton>
      </div>
    </section>
  )
}
