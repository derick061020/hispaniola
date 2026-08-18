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
const pagina = await navegador.newPage()

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
await pagina.getByLabel('Email').fill('ana@example.com')
await pagina.getByLabel('WhatsApp / phone').fill('+1 809 000 0000')
await pagina.getByRole('button', { name: 'Continue' }).click()

await pagina.getByLabel('Hotel or pick-up point').fill('Meliá Caribe Beach')
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
await pagina.getByLabel('Email').fill('ana@example.com')
await pagina.getByLabel('WhatsApp / phone').fill('+1 809 000 0000')
await pagina.getByRole('button', { name: 'Continue' }).click()
await pagina.getByLabel('Hotel or pick-up point').fill('Meliá Caribe Beach')
await pagina.getByRole('button', { name: 'Continue' }).click()
await pagina.getByText(/Online payment is temporarily unavailable/i).waitFor({ timeout: 10_000 })
ok('sin claves en Odoo se avisa y no se pinta un método que iba a fallar')
check(await pagina.getByRole('button', { name: /Pay deposit/ }).isDisabled(), 'y el CTA queda bloqueado')

await navegador.close()
console.log(fallos === 0 ? '\n\x1b[32mTODO OK\x1b[0m' : `\n\x1b[31m${fallos} fallo(s)\x1b[0m`)
process.exit(fallos === 0 ? 0 : 1)
