import { Lock } from 'lucide-react'
import * as FancyButton from '@/components/alignui/fancy-button'
import { formatoDinero } from '@/data/home'
import type { DatosContacto, DatosRecogida } from '@/components/reservar/tipos'

// Paso 4 del funnel: revisar todo y pagar el DEPÓSITO del 25% — la FRONTERA del
// build. El botón se pinta con su importe real, pero no cobra: aquí conectaría
// la pasarela del motor xpotours (pendiente de decisión del cliente). Se dice
// con todas las letras en vez de fingir un cobro o un «¡reserva confirmada!»
// que no ha ocurrido (misma honestidad que EnlacePrototipo y el resto del build).

function FilaResumen({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-linea py-1.5 last:border-0">
      <dt className="shrink-0 text-navy-soft">{etiqueta}</dt>
      <dd className="text-right font-medium text-navy">{valor}</dd>
    </div>
  )
}

function Apartado({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-2 text-eyebrow font-semibold uppercase tracking-[0.12em] text-navy-soft">{titulo}</h3>
      {children}
    </section>
  )
}

export function PasoResumen({
  tituloTour,
  fechaTxt,
  horarioTxt,
  nombrePaquete,
  personas,
  seleccion,
  recogida,
  contacto,
  precioPersona,
  total,
  deposito,
  saldo,
  frontera,
  onPagar,
}: {
  tituloTour: string
  fechaTxt: string
  horarioTxt: string
  nombrePaquete: string
  personas: number
  seleccion: string[]
  recogida: DatosRecogida
  contacto: DatosContacto
  precioPersona: number
  total: number
  deposito: number
  saldo: number
  frontera: boolean
  onPagar: () => void
}) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-display text-h3 font-semibold text-navy">Revisa y confirma</h2>
        <p className="mt-1 text-sm text-navy-sub">Confirma con el 25% hoy; el resto lo pagas el día del tour.</p>
      </div>

      <dl className="rounded-card bg-fondo-ficha p-4 text-sm">
        <FilaResumen etiqueta="Tour" valor={tituloTour} />
        <FilaResumen etiqueta="Fecha" valor={fechaTxt} />
        <FilaResumen etiqueta="Horario" valor={horarioTxt} />
        <FilaResumen etiqueta="Paquete" valor={`Menú ${nombrePaquete}`} />
        <FilaResumen etiqueta="Personas" valor={String(personas)} />
      </dl>

      <Apartado titulo="Menú elegido">
        <ul className="text-sm">
          {seleccion.map((plato, i) => (
            <li key={i} className="flex justify-between gap-3 border-b border-linea py-1.5 last:border-0">
              <span className="shrink-0 text-navy-soft">Persona {i + 1}</span>
              <span className="text-right font-medium text-navy">{plato || '—'}</span>
            </li>
          ))}
        </ul>
      </Apartado>

      <div className="grid gap-4 sm:grid-cols-2">
        <Apartado titulo="Recogida">
          <p className="text-sm font-medium text-navy">
            {recogida.hotel || '— por indicar'}
            {recogida.habitacion ? ` · Hab. ${recogida.habitacion}` : ''}
          </p>
          {recogida.notas ? <p className="mt-1 text-xs text-navy-soft">{recogida.notas}</p> : null}
        </Apartado>
        <Apartado titulo="Contacto">
          <p className="text-sm font-medium text-navy">{contacto.nombre || '— por indicar'}</p>
          {contacto.email || contacto.telefono ? (
            <p className="mt-0.5 text-xs text-navy-soft">
              {contacto.email}
              {contacto.email && contacto.telefono ? ' · ' : ''}
              {contacto.telefono}
            </p>
          ) : null}
        </Apartado>
      </div>

      <div className="rounded-card bg-fondo-ficha p-4">
        <div className="flex justify-between text-sm text-navy-sub">
          <span>
            {formatoDinero(precioPersona)} × {personas}
          </span>
          <span className="font-medium text-navy">{formatoDinero(total)}</span>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-linea pt-3">
          <span className="text-sm font-semibold text-navy">Depósito hoy (25%)</span>
          <span className="font-display text-precio font-semibold text-navy">{formatoDinero(deposito)}</span>
        </div>
        <p className="mt-1 text-xs text-navy-soft">
          Saldo de {formatoDinero(saldo)} el día del tour (−5% si lo pagas en efectivo a bordo).
        </p>
      </div>

      {frontera ? (
        <div className="flex items-start gap-3 rounded-card bg-menta p-4 text-sm text-menta-texto">
          <Lock className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <p>
            Hasta aquí llega el prototipo. Aquí se conectaría la pasarela para cobrar el depósito de{' '}
            <strong className="font-semibold">{formatoDinero(deposito)}</strong> — el motor de reservas (xpotours) está
            pendiente de decisión del cliente, así que no se procesa ningún cobro real.
          </p>
        </div>
      ) : (
        <FancyButton.Root variant="primary" className="w-full" onClick={onPagar}>
          Pagar depósito — {formatoDinero(deposito)}
        </FancyButton.Root>
      )}

      <p className="flex items-center justify-center gap-1.5 text-xs text-navy-soft">
        <Lock className="size-3.5" aria-hidden="true" /> Pago seguro · Cancela gratis hasta 7 días antes
      </p>
    </div>
  )
}
