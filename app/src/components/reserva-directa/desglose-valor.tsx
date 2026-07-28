import { Link } from 'react-router-dom'
import { formatoDinero } from '@/data/home'

// «Lo que pagarías suelto» (correcciones v2, plan 07 §2 — slide 53).
//
// Es la mejor idea del PowerPoint del cliente, y cierra un hueco que la
// auditoría detectó el PRIMER día del proyecto (2026-07-11): «Viator vende el
// mismo tour al mismo precio (US$ 114) → falta bloque why book direct». El
// sitio lleva desde entonces diciendo «reserva directo» sin demostrar NUNCA en
// dinero por qué. Esta tarjeta lo demuestra.
//
// Y encaja con el posicionamiento «Charter Premium»: el titular es «no somos
// los más baratos» — se compite por valor, no por precio.
//
// ⚠️ LOS IMPORTES SON PRECIOS DE REFERENCIA, NO FACTURAS. Por eso la letra
// pequeña lo dice explícitamente: si alguien audita el «almuerzo de mariscos
// US$ 50» y le parece generoso, el argumento entero se vuelve en contra. Una
// cifra con su origen declarado es más creíble que una cifra desnuda.
// Pendiente de que Fernando confirme que cada importe es defendible.
//
// La suma se CALCULA, no se escribe: si mañana cambia un concepto, el total y
// el ahorro se recalculan solos y no pueden contradecir a la lista.

type Concepto = { nombre: string; importe: number }

const CONCEPTOS: Concepto[] = [
  { nombre: 'Charter de 4 h (bebidas y picadera)', importe: 75 },
  { nombre: 'Salida de snorkel semi-privada', importe: 30 },
  { nombre: 'Almuerzo de mariscos', importe: 50 },
  { nombre: 'Bebidas de marca', importe: 10 },
  { nombre: 'Coco Loco', importe: 5 },
  { nombre: 'Fotos del tour', importe: 20 },
]

const NUESTRO_PRECIO = 114

export function DesgloseValor() {
  const suelto = CONCEPTOS.reduce((s, c) => s + c.importe, 0)
  const ahorro = suelto - NUESTRO_PRECIO

  return (
    <section className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
      <div>
        <p className="text-eyebrow font-semibold uppercase tracking-[0.14em] text-aqua">
          Lo que cuesta de verdad
        </p>
        <h2 className="mt-3 font-display text-h2 font-semibold text-navy">
          No somos los más baratos. Pero recibes exactamente lo que pagas.
        </h2>
        <p className="mt-4 max-w-lg text-lg text-navy-sub">
          Contratar por separado cada cosa que incluye tu día en el mar cuesta bastante más que
          venirte con nosotros. Esta es la cuenta.
        </p>
        <Link
          to="/#tours"
          className="mt-6 inline-flex rounded-full bg-coral px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
        >
          Ver los tours
        </Link>
      </div>

      <div className="rounded-card-grande bg-papel p-6 ring-1 ring-linea sm:p-8">
        <ul className="flex flex-col gap-3">
          {CONCEPTOS.map((c) => (
            <li key={c.nombre} className="flex items-baseline justify-between gap-4 text-sm">
              <span className="text-navy-sub">{c.nombre}</span>
              <span className="shrink-0 tabular-nums text-navy">{formatoDinero(c.importe)}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-linea pt-4">
          <span className="text-sm font-medium text-navy-sub">Precio suelto</span>
          <span className="font-display text-xl font-semibold tabular-nums text-navy-soft line-through">
            {formatoDinero(suelto)}
          </span>
        </div>

        <div className="mt-3 flex items-baseline justify-between gap-4">
          <span className="text-sm font-semibold text-navy">Nuestro precio · todo incluido</span>
          <span className="font-display text-3xl font-semibold tabular-nums text-navy">
            {formatoDinero(NUESTRO_PRECIO)}
          </span>
        </div>

        <p className="mt-4 rounded-btn bg-menta px-3 py-2 text-center text-sm font-semibold text-menta-texto">
          Reservando directo te ahorras {formatoDinero(ahorro)}
        </p>

        <p className="mt-4 text-xs leading-relaxed text-navy-soft">
          Precios de referencia de servicios equivalentes en la zona, para dar una idea de lo que
          cuesta cada pieza por separado. No son tarifas nuestras.
        </p>
      </div>
    </section>
  )
}
