import { Check, ShieldCheck, MessageCircle } from 'lucide-react'
import { formatoDinero, type Tour } from '@/data/home'

// Columna DERECHA del funnel (Fase C, rediseño estilo Viator 2026-07-17, pedido
// de Samuel): la tarjeta «qué estás comprando», sticky, siempre visible mientras
// se rellena el formulario de la izquierda. Se basa en el checkout de Viator
// PERO sin su urgencia inventada: nada de contador «te guardamos la plaza 18
// min» ni «reservado 5+ veces» — el proyecto prohíbe la urgencia que no se
// puede sostener con un dato real (analisis/revision-wireframes.md §2.7). Lo que
// queda es honesto: producto, config, precio, depósito y política de cancelación.
export function ResumenReserva({
  tour,
  fechaTxt,
  horarioTxt,
  nombrePaquete,
  personas,
  total,
  deposito,
  saldo,
}: {
  tour: Tour
  fechaTxt: string
  horarioTxt: string
  nombrePaquete: string
  personas: number
  total: number
  deposito: number
  saldo: number
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-card-grande border border-linea bg-papel">
        <div className="flex items-center gap-3 p-4">
          <img
            src={`/fotos/${tour.foto}.webp`}
            alt=""
            aria-hidden="true"
            className="size-16 shrink-0 rounded-card object-cover"
          />
          <p className="font-display text-sm font-semibold leading-snug text-navy">{tour.nombre}</p>
        </div>

        <div className="border-t border-linea p-4 text-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="text-navy-soft">
              {personas === 1 ? '1 persona' : `${personas} personas`} · Menú {nombrePaquete}
            </span>
            <span className="font-medium text-navy">{formatoDinero(total)}</span>
          </div>
          <p className="mt-1 text-navy-soft">
            {fechaTxt} · {horarioTxt}
          </p>
          <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-menta-texto">
            <Check className="size-3.5 shrink-0" aria-hidden="true" />
            Cancela gratis hasta 7 días antes
          </p>
        </div>

        <div className="border-t border-linea bg-fondo-ficha p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-navy">Depósito hoy (25%)</span>
            <span className="font-display text-precio font-semibold text-navy">{formatoDinero(deposito)}</span>
          </div>
          <p className="mt-1 text-xs text-navy-soft">
            Total {formatoDinero(total)} · saldo de {formatoDinero(saldo)} el día del tour (−5% en efectivo).
          </p>
        </div>
      </div>

      <div className="rounded-card-grande border border-linea bg-papel p-4">
        <h2 className="font-display text-sm font-semibold text-navy">Reserva con confianza</h2>
        <ul className="mt-3 flex flex-col gap-3 text-xs text-navy-sub">
          <li className="flex gap-2.5">
            <ShieldCheck className="size-4 shrink-0 text-aqua-dark" aria-hidden="true" />
            <span>
              <strong className="font-semibold text-navy">Flexibilidad total.</strong> Cancela gratis hasta 7 días antes
              y reembolso completo por mal clima.
            </span>
          </li>
          <li className="flex gap-2.5">
            <MessageCircle className="size-4 shrink-0 text-aqua-dark" aria-hidden="true" />
            <span>
              <strong className="font-semibold text-navy">Trato directo.</strong> Hablas por WhatsApp con el equipo del
              barco, no con un call center.
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}
