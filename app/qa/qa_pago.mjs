// [2026-08-14] Prueba del paso de pago. Recorre el funnel hasta «Payment» con
// la API de Odoo SIMULADA y comprueba los dos medios que tiene Eclipse:
// tarjeta (Stripe Elements) y PayPal.
//
//   npm run build && npm run preview     # en otra terminal
//   npm run qa:pago
//
// Se corre contra el BUILD, no contra `npm run dev`: el paso de pago monta un
// iframe de js.stripe.com y queremos verlo en las mismas condiciones que
// producción. `BASE` cambia la URL (por defecto la de `vite preview`).
//
// ⚠️ Este script SÍ devuelve exit ≠ 0 cuando algo falla, al contrario que el
// resto de `qa/` (ver CLAUDE.md, «Trampas que cuestan tiempo»).
//
// Lo que NO cubre: el cobro real. Confirmar una tarjeta necesita un
// `client_secret` de verdad, o sea una clave de test de Stripe y un Odoo
// levantado — eso se prueba con `scripts/smoke_test.sh` del módulo y con la
// tarjeta 4242 4242 4242 4242.
//
// Sin los navegadores de Playwright descargados (`npx playwright install`) se
// puede usar el Chromium del sistema:  PW_CHROME=/usr/bin/chromium npm run qa:pago
import { chromium } from 'playwright'

const BASE = process.env.BASE || 'http://localhost:4173'

const PEDIDO = {
  code: 'HSP-TEST-0001',
  token: 'tok-test',
  state: 'in_progress',
  tour: 'saona-island',
  amounts: { currency: 'USD', total: 1950, deposit: 487.5, balance: 1462.5, refunded: 0 },
}

const CONFIG = {
  currency: 'USD',
  default_deposit_pct: 25,
  site_url: BASE,
  payments: {
    stripe: { enabled: true, publishable_key: 'pk_test_TYooMQauvdEDq54NiTphI7jx', environment: 'test' },
    paypal: { enabled: true, client_id: 'sb', environment: 'sandbox' },
  },
  discounts: [],
  discount_cap_pct: 15,
}

let fallos = 0
const ok = (m) => console.log(`  \x1b[32m✓\x1b[0m ${m}`)
const ko = (m) => { fallos++; console.log(`  \x1b[31m✗\x1b[0m ${m}`) }
const check = (cond, m) => (cond ? ok(m) : ko(m))

const navegador = await chromium.launch({ channel: process.env.PW_CHANNEL, executablePath: process.env.PW_CHROME })
// [2026-08-19] `locale: 'en-US'` obligatorio desde que el sitio es bilingüe:
// arranca en el idioma del navegador, y en una máquina con el sistema en
// español este script buscaría rótulos en inglés en una página en español y
// fallaría por un motivo que no tiene nada que ver con lo que comprueba.
const pagina = await navegador.newPage({ locale: 'en-US' })

pagina.on('console', (m) => { if (m.type() === 'error') console.log('    [console]', m.text()) })

await pagina.route('**/api/web/v1/**', (ruta) => {
  const url = ruta.request().url()
  const cuerpo = url.includes('/config') ? CONFIG : PEDIDO
  return ruta.fulfill({
    status: 200,
    contentType: 'application/json',
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ ok: true, data: cuerpo }),
  })
})

console.log('== Funnel hasta el paso de pago ==')
await pagina.goto(`${BASE}/book/saona-island?fecha=2026-09-20`, { waitUntil: 'networkidle' })

await pagina.getByLabel('First name').fill('Ana')
await pagina.getByLabel('Last name').fill('Pérez')
// `getByLabel('Email')` dejó de ser único cuando el paso de contacto ganó el
// selector «Language for your booking» (45d904e): el <select> responde también
// a ese nombre y Playwright aborta por ambigüedad. Se pide el campo de texto.
await pagina.getByRole('textbox', { name: 'Email' }).fill('ana@example.com')
await pagina.getByLabel('WhatsApp / phone').fill('+1 809 000 0000')
await pagina.getByRole('button', { name: 'Continue' }).click()

// El punto de recogida dejó de ser un <input> suelto: hoy es un combobox
// (ui/selector-hotel.tsx) con su propio campo de texto libre debajo, así que se
// rellena ese, no la etiqueta del grupo.
await pagina.getByRole('button', { name: /Select your hotel|Hotel or pick-up point/ }).first().click()
await pagina.getByPlaceholder('Search your hotel…').fill('Melia')
await pagina.locator('[role="listbox"] [role="option"]').first().click()
await pagina.getByRole('button', { name: 'Continue' }).click()

await pagina.getByText('Credit or debit card').waitFor({ timeout: 10_000 })
ok('se llega al paso «Payment»')

console.log('== Medios de pago ==')
check(await pagina.getByRole('radio', { name: /Credit or debit card/ }).isVisible(), 'está la opción de tarjeta')
check(await pagina.getByRole('radio', { name: /PayPal/ }).isVisible(), 'está la opción de PayPal')
check(await pagina.getByRole('radio', { name: /Credit or debit card/ }).isChecked(), 'la tarjeta viene elegida por defecto')

console.log('== Tarjeta (Stripe Elements) ==')
check(await pagina.getByLabel('Name on card').isVisible(), 'pide el nombre del titular')
const iframeStripe = pagina.locator('iframe[name^="__privateStripeFrame"]')
try {
  await iframeStripe.first().waitFor({ timeout: 15_000 })
  ok('el campo de tarjeta de Stripe se monta (iframe de js.stripe.com)')
} catch {
  const aviso = await pagina.getByText(/could not load the card form/i).isVisible().catch(() => false)
  ko(aviso ? 'Stripe.js no cargó — sale el aviso de fallback (¿sin red?)' : 'el iframe de Stripe no aparece')
}

const cta = pagina.getByRole('button', { name: /Pay deposit/ })
check(await cta.isVisible(), 'el CTA dice «Pay deposit»')
check(await cta.isDisabled(), 'el CTA está bloqueado sin tarjeta rellenada')

console.log('== PayPal ==')
await pagina.getByRole('radio', { name: /PayPal/ }).check()
const ctaPaypal = pagina.getByRole('button', { name: /Continue with PayPal/ })
check(await ctaPaypal.isVisible(), 'el CTA cambia a «Continue with PayPal»')
check(await ctaPaypal.isEnabled(), 'con PayPal el CTA se habilita sin datos de tarjeta')
check(
  (await pagina.locator('iframe[name^="__privateStripeFrame"]').count()) === 0,
  'al cambiar a PayPal se destruye el iframe de Stripe',
)

console.log('== Sin pasarelas configuradas ==')
await pagina.route('**/api/web/v1/config', (ruta) =>
  ruta.fulfill({
    status: 200,
    contentType: 'application/json',
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({
      ok: true,
      data: { ...CONFIG, payments: { stripe: { enabled: false, publishable_key: '', environment: 'test' }, paypal: { enabled: false, client_id: '', environment: 'sandbox' } } },
    }),
  }),
)
await pagina.goto(`${BASE}/book/saona-island?fecha=2026-09-20`, { waitUntil: 'networkidle' })
await pagina.getByLabel('First name').fill('Ana')
await pagina.getByLabel('Last name').fill('Pérez')
await pagina.getByRole('textbox', { name: 'Email' }).fill('ana@example.com')
await pagina.getByLabel('WhatsApp / phone').fill('+1 809 000 0000')
await pagina.getByRole('button', { name: 'Continue' }).click()
// El punto de recogida dejó de ser un <input> suelto: hoy es un combobox
// (ui/selector-hotel.tsx) con su propio campo de texto libre debajo, así que se
// rellena ese, no la etiqueta del grupo.
await pagina.getByRole('button', { name: /Select your hotel|Hotel or pick-up point/ }).first().click()
await pagina.getByPlaceholder('Search your hotel…').fill('Melia')
await pagina.locator('[role="listbox"] [role="option"]').first().click()
await pagina.getByRole('button', { name: 'Continue' }).click()
await pagina.getByText(/Online payment is temporarily unavailable/i).waitFor({ timeout: 10_000 })
ok('sin claves en Odoo se avisa y no se pinta un método que iba a fallar')
check(await pagina.getByRole('button', { name: /Pay deposit/ }).isDisabled(), 'y el CTA queda bloqueado')

// ── RUEDA DE CARGA AL PAGAR ──────────────────────────────────────────────
// [2026-08-31] Derick: «cuando le doy a pagar, que haya una animación de carga
// en lo que se procesa el pago». Confirmar un cobro son dos o tres segundos, y
// hasta hoy el único aviso era que el texto del botón cambiaba: en un móvil eso
// se lee tarde y se vuelve a pulsar. Se comprueba con la llamada de cobro
// COLGADA a propósito —nunca contesta—, que es exactamente el rato en el que el
// visitante se queda mirando el botón.
console.log('== Rueda de carga al pagar ==')
const pestana = await navegador.newPage({ locale: 'en-US' })
await pestana.route('**/api/web/v1/**', (ruta) => {
  const url = ruta.request().url()
  if (url.includes('/pay')) return              // colgada: se queda «procesando»
  const cuerpo = url.includes('/config') ? CONFIG : PEDIDO
  return ruta.fulfill({
    status: 200,
    contentType: 'application/json',
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ ok: true, data: cuerpo }),
  })
})
await pestana.goto(`${BASE}/book/saona-island?fecha=2026-09-20`, { waitUntil: 'networkidle' })
await pestana.getByLabel('First name').fill('Ana')
await pestana.getByLabel('Last name').fill('Pérez')
await pestana.getByRole('textbox', { name: 'Email' }).fill('ana@example.com')
await pestana.getByLabel('WhatsApp / phone').fill('+1 809 000 0000')
await pestana.getByRole('button', { name: 'Continue' }).click()
await pestana.getByRole('button', { name: /Select your hotel|Hotel or pick-up point/ }).first().click()
await pestana.getByPlaceholder('Search your hotel…').fill('Melia')
await pestana.locator('[role="listbox"] [role="option"]').first().click()
await pestana.getByRole('button', { name: 'Continue' }).click()
// PayPal: es el camino que se habilita sin rellenar la tarjeta de Stripe.
await pestana.getByRole('radio', { name: /PayPal/ }).check()
const ctaCobro = pestana.getByRole('button', { name: /Continue with PayPal/ })
check((await pestana.locator('svg.animate-spin').count()) === 0, 'antes de pulsar no hay ninguna rueda')
await ctaCobro.click()
await pestana.locator('svg.animate-spin').first().waitFor({ timeout: 8_000 })
ok('al pulsar aparece la rueda girando')
check(await pestana.getByText('Processing…').first().isVisible(), 'y el botón dice «Processing…»')
check(
  await pestana.getByRole('button', { name: /Processing/ }).first().isDisabled(),
  'con el botón bloqueado, para que no se cobre dos veces',
)

await navegador.close()
console.log(fallos === 0 ? '\n\x1b[32mTODO OK\x1b[0m' : `\n\x1b[31m${fallos} fallo(s)\x1b[0m`)
process.exit(fallos === 0 ? 0 : 1)
