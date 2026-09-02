// F8 — el funnel de reserva de punta a punta, ya en inglés y con los cambios
// del 2026-08-07 (personas/fecha/horario editables, menú opcional, banner
// Premium). Comprueba el CAMINO COMPLETO, no una pantalla suelta.
//
// ⚠️ Para llegar hasta el cobro hace falta ODOO levantado con el catálogo
// sembrado: desde el 2026-08-18 el paso de pago se bloquea si no hay pedido
// abierto en el servidor. Sin Odoo el script llega igual hasta el paso 9 y
// comprueba que el bloqueo y su aviso están donde tienen que estar; el camino
// degradado completo lo cubre `npm run qa:degradado`.
//
//   BASE=http://localhost:4173 node qa/qa_funnel.mjs   (contra el build)
import { chromium } from 'playwright'

const BASE = process.env.BASE || 'http://localhost:5173'
const navegador = await chromium.launch()
// [2026-08-19] `locale: 'en-US'` obligatorio desde que el sitio es bilingüe:
// arranca en el idioma del navegador, y en una máquina con el sistema en
// español este script buscaría rótulos en inglés en una página en español y
// fallaría por un motivo que no tiene nada que ver con lo que comprueba.
const ctx = await navegador.newContext({ viewport: { width: 1440, height: 900 }, locale: 'en-US' })
const page = await ctx.newPage()
const errores = []
page.on('console', (m) => m.type() === 'error' && errores.push(m.text().slice(0, 120)))
page.on('pageerror', (e) => errores.push('PAGEERROR ' + String(e).slice(0, 120)))

const paso = (t) => console.log('  ·', t)

await page.goto(`${BASE}/book/semi-private-premium?paquete=light&personas=2`, { waitUntil: 'domcontentloaded' })
await page.waitForTimeout(600)

// 1. Sin fecha: el pago tiene que estar bloqueado al final del flujo
paso('banner Premium visible: ' + (await page.getByRole('button', { name: /Upgrade to Premium/ }).count()))
paso('aviso de menú opcional: ' + (await page.getByText(/You don’t have to decide now/).count()))

// 2. Elegir fecha desde el resumen
await page.getByRole('button', { name: /Tour date/ }).click()
await page.waitForTimeout(300)
const dias = page.locator('button[aria-label^="lun"], button[aria-label^="mar"], button[aria-label^="Mon"], button[aria-label^="Tue"], button[aria-label^="Wed"], button[aria-label^="Thu"], button[aria-label^="Fri"], button[aria-label^="Sat"], button[aria-label^="Sun"]')
const nDias = await dias.count()
let elegido = false
for (let i = 0; i < nDias; i++) {
  const d = dias.nth(i)
  if (await d.isEnabled()) {
    await d.click()
    elegido = true
    break
  }
}
paso('fecha elegida en el resumen: ' + elegido)
await page.waitForTimeout(300)

// 3. Subir a Premium desde el banner
const totalAntes = await page.getByText(/^US\$/).first().textContent()
await page.getByRole('button', { name: 'Switch to Premium' }).click()
await page.waitForTimeout(400)
paso('tras Premium, banner oculto: ' + ((await page.getByRole('button', { name: /Upgrade to Premium/ }).count()) === 0))
paso('total 228: ' + ((await page.getByText('US$ 228').count()) > 0) + ' (antes ' + totalAntes + ')')

// 4. Personas 2 -> 3 y vuelta
await page.locator('button[aria-label="Add one person"]').click()
await page.waitForTimeout(300)
paso('3 personas -> total 342: ' + ((await page.getByText('US$ 342').count()) > 0))
await page.locator('button[aria-label="Remove one person"]').click()
await page.waitForTimeout(300)

// 5. Horario
const pastillas = page.locator('button[aria-label^="Departure"]')
if ((await pastillas.count()) > 1) {
  await pastillas.nth(1).click()
  await page.waitForTimeout(250)
  paso('horario cambiado: ' + (await page.getByText(/Departure .* back at/).textContent()))
}

// 6. Contacto + celebración
await page.evaluate(() => {
  const set = (el, v) => {
    const s = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set
    s.call(el, v)
    el.dispatchEvent(new Event('input', { bubbles: true }))
  }
  const byLabel = (t) => {
    const l = [...document.querySelectorAll('label')].find((l) => l.textContent.includes(t))
    return l ? document.getElementById(l.htmlFor) : null
  }
  set(byLabel('First name') ?? byLabel('Name'), 'Ana')
  set(byLabel('Email address') ?? byLabel('Email'), 'ana@example.com')
  const conf = [...document.querySelectorAll('label')].find((l) => /Confirm/i.test(l.textContent))
  if (conf) set(document.getElementById(conf.htmlFor), 'ana@example.com')
})
await page.getByRole('button', { name: 'Birthday' }).click()
await page.waitForTimeout(200)
paso('celebración elegida + campo libre: ' + (await page.getByText(/Tell us \(optional\)/).count()))
await page.getByRole('button', { name: /^Continue/ }).click()
await page.waitForTimeout(400)

// 7. Menú: se salta sin elegir
paso('botón «Continue and pick the menu later»: ' + (await page.getByRole('button', { name: /pick the menu later/ }).count()))
await page.getByRole('button', { name: /pick the menu later/ }).click()
await page.waitForTimeout(300)

// 8. Recogida
// El punto de recogida ya no es un <input>: es un combobox con buscador
// (ui/selector-hotel.tsx), así que se elige de la lista como lo haría alguien.
await page.getByRole('button', { name: /Select your hotel|Hotel or pick-up point/ }).first().click()
await page.getByPlaceholder('Search your hotel…').fill('Melia')
await page.locator('[role="listbox"] [role="option"]').first().click()
await page.getByRole('button', { name: /^Continue/ }).click()
await page.waitForTimeout(400)

// 9. Pago
//
// [2026-08-18] Este script daba por hecho que «Pay deposit» siempre se puede
// pulsar, porque cuando se escribió el pago era simulado. Ya no: sin un pedido
// abierto en Odoo el botón queda BLOQUEADO a propósito —no hay importe que
// cobrar y la reserva no está registrada—, así que aquí se bifurca en vez de
// quedarse 30 s esperando a un botón que nunca se habilita.
//
// El camino sin backend tiene su propio script: `npm run qa:degradado`.
const botonPagar = page.getByRole('button', { name: /Pay deposit|Pagar depósito/ })
const puedePagar = await botonPagar.isEnabled()
paso('botón de pago habilitado: ' + puedePagar)

if (!puedePagar) {
  const sinBackend = await page.getByText(/can.t open your booking right now/i).count()
  paso(
    sinBackend
      ? 'CORRECTO: sin Odoo el funnel avisa y no deja pagar (ver npm run qa:degradado)'
      : '⚠️ el botón está bloqueado pero NO sale el aviso — revisar BandaEstado',
  )
} else {
  await botonPagar.click()
  await page.waitForTimeout(900)
  paso('URL final: ' + page.url())
  paso('acuse de cumpleaños: ' + (await page.getByText(/Noted: birthday/i).count()))
  paso('menú por confirmar: ' + (await page.getByText(/To be confirmed by email/).count()))
}

console.log('\nERRORES DE CONSOLA:', errores.length ? errores : 'ninguno')
await navegador.close()
