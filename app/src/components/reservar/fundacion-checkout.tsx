import { useEffect, useState } from 'react'
import { ChevronDown, Minus, Plus, Sprout, X } from 'lucide-react'
import { obtenerProductosFundacion, type ProductoFundacion } from '@/lib/api/api'
import { formatoDinero } from '@/data/home'
import { t } from '@/lib/i18n'

// Productos de la Fundación en el checkout.
//
// [2026-10-17, Sr. Fernando vía Miguel: «aprovechar el momento en que el
// cliente está realizando el checkout de su reserva para ofrecerle la
// posibilidad de adquirir productos de la Fundación, cuyos ingresos estarán
// destinados al programa de restauración de arrecifes de coral… atractiva,
// pero sin que resulte invasiva ni interfiera con el proceso de compra… que se
// pueda cerrar o ignorar rápidamente… medir cuántos clientes adquieren estos
// productos y qué ingresos generan»]
//
// Cómo cumple cada cosa:
//   · NO INVASIVO: una tarjeta plegada dentro del paso de pago, no un pop-up.
//     Se abre si el cliente quiere y «No thanks» la quita del todo.
//   · SIN COMPLICAR LA RESERVA: los productos viajan con el pedido como un
//     extra más (Odoo `haa.addon` de tipo «fundacion`); el precio lo pone el
//     servidor y se paga igual que el resto (depósito hoy, saldo después).
//   · MEDIBLE: cada unidad queda en el pedido y en la reserva, y en Odoo hay
//     «Website › Fundación · ventas en el checkout» (unidades e ingresos por
//     producto y mes). Además se empuja un evento al dataLayer.
//
// Los productos, nombres y precios son los de la tienda de la Fundación
// (bavaroreefs.org/shop). ⚠️ QA: solo se monta con VITE_FUNDACION_CHECKOUT=1
// hasta que el cliente lo apruebe.

export const FUNDACION_ACTIVA = import.meta.env?.VITE_FUNDACION_CHECKOUT === '1'

const VISIBLES = 4

function evento(nombre: string, datos: Record<string, unknown>) {
  try {
    const w = window as unknown as { dataLayer?: unknown[] }
    w.dataLayer = w.dataLayer || []
    w.dataLayer.push({ event: nombre, ...datos })
  } catch {
    /* sin analítica no pasa nada */
  }
}

export function FundacionCheckout({
  cantidades,
  onCambio,
  deshabilitado = false,
}: {
  cantidades: Record<string, number>
  onCambio: (cantidades: Record<string, number>) => void
  deshabilitado?: boolean
}) {
  const [productos, setProductos] = useState<ProductoFundacion[]>([])
  const [abierto, setAbierto] = useState(false)
  const [descartado, setDescartado] = useState(false)
  const [todos, setTodos] = useState(false)

  useEffect(() => {
    const ctrl = new AbortController()
    obtenerProductosFundacion(ctrl.signal)
      .then((r) => setProductos(r.products ?? []))
      .catch(() => setProductos([]))
    return () => ctrl.abort()
  }, [])

  const unidades = Object.values(cantidades).reduce((n, q) => n + q, 0)
  const importe = productos.reduce((s, p) => s + (cantidades[p.slug] ?? 0) * p.price, 0)

  if (!productos.length || (descartado && unidades === 0)) return null

  const cambiar = (p: ProductoFundacion, delta: number) => {
    const q = Math.max(0, Math.min(20, (cantidades[p.slug] ?? 0) + delta))
    const nuevas = { ...cantidades, [p.slug]: q }
    if (!q) delete nuevas[p.slug]
    onCambio(nuevas)
    evento(delta > 0 ? 'foundation_add' : 'foundation_remove', {
      item_id: p.slug, item_name: p.label, price: p.price, quantity: q,
    })
  }

  const lista = todos ? productos : productos.slice(0, VISIBLES)

  return (
    <section
      aria-labelledby="fundacion-titulo"
      className="mb-5 rounded-card border border-linea bg-papel"
    >
      <div className="flex items-start gap-3 p-4">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-menta text-menta-texto">
          <Sprout className="size-4" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 id="fundacion-titulo" className="text-sm font-semibold text-navy">
            {t('Support coral reef restoration')}
          </h3>
          <p className="mt-0.5 text-xs leading-relaxed text-navy-sub">
            {t('Add a product from the Bávaro Reefs Foundation. All proceeds go to its coral reef restoration program.')}
          </p>
          {unidades > 0 ? (
            <p className="mt-1 text-xs font-semibold text-menta-texto">
              {unidades} {unidades === 1 ? t('item added') : t('items added')} · {formatoDinero(importe)}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => setAbierto((a) => !a)}
          aria-expanded={abierto}
          className="inline-flex shrink-0 items-center gap-1 rounded-full border border-linea px-3 py-1.5 text-xs font-semibold text-navy hover:bg-papel-hueso"
        >
          {abierto ? t('Hide') : t('See products')}
          <ChevronDown className={`size-3.5 transition ${abierto ? 'rotate-180' : ''}`} aria-hidden="true" />
        </button>
        {unidades === 0 ? (
          <button
            type="button"
            onClick={() => { setDescartado(true); evento('foundation_dismiss', {}) }}
            aria-label={t('No thanks')}
            title={t('No thanks')}
            className="grid size-8 shrink-0 place-items-center rounded-full text-navy-soft hover:bg-papel-hueso"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      {abierto ? (
        <div className="border-t border-linea p-4">
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {lista.map((p) => {
              const q = cantidades[p.slug] ?? 0
              return (
                <li key={p.slug} className={`flex flex-col overflow-hidden rounded-card ring-1 ${q ? 'ring-aqua' : 'ring-linea'}`}>
                  {p.image ? (
                    <img src={p.image} alt={t(p.label)} loading="lazy" decoding="async"
                         className="aspect-square w-full bg-papel-hueso object-cover" />
                  ) : null}
                  <div className="flex flex-1 flex-col p-2.5">
                    <p className="line-clamp-2 text-xs font-medium text-navy">{t(p.label)}</p>
                    <p className="mt-1 text-sm font-semibold text-navy">{formatoDinero(p.price)}</p>
                    <div className="mt-auto flex items-center justify-between gap-1 pt-2">
                      <button type="button" disabled={deshabilitado || q === 0} onClick={() => cambiar(p, -1)}
                              aria-label={t('Remove one')}
                              className="grid size-8 place-items-center rounded-full border border-linea text-navy disabled:opacity-30">
                        <Minus className="size-3.5" aria-hidden="true" />
                      </button>
                      <span className="min-w-6 text-center text-sm font-semibold text-navy" aria-live="polite">{q}</span>
                      <button type="button" disabled={deshabilitado || q >= 20} onClick={() => cambiar(p, 1)}
                              aria-label={t('Add one')}
                              className="grid size-8 place-items-center rounded-full bg-navy text-white disabled:opacity-30">
                        <Plus className="size-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-navy-sub">
            {productos.length > VISIBLES ? (
              <button type="button" onClick={() => setTodos((v) => !v)} className="font-semibold text-aqua-dark hover:underline">
                {todos ? t('Show fewer') : `${t('See all products')} (${productos.length})`}
              </button>
            ) : <span />}
            <span>{t('Added to your booking total.')}</span>
          </div>
        </div>
      ) : null}
    </section>
  )
}
