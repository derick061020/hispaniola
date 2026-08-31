// [2026-08-18] Prueba del CAMINO DEGRADADO: qué hace el sitio cuando Odoo no
// contesta o no tiene el catálogo publicado.
//
// Existe porque ese era, literalmente, el estado de producción el día que se
// escribió: el módulo respondía pero servía cero tours, y el funnel se pintaba
// exactamente igual que si todo fuera bien — se rellenaba entero, se veía un
// precio estimado y el fallo solo aparecía al pulsar «Pay deposit». Con eso, la
// reserva no quedaba registrada en Odoo, que es lo único que el proyecto
// promete que no puede pasar.
//
// Lo que comprueba, con la API SIMULADA fallando:
//   1. el funnel avisa arriba de que no se puede abrir la reserva
//   2. el paso de pago NO pinta un formulario de tarjeta que iba a fallar
//   3. el CTA queda bloqueado
//   4. el total se marca como estimación, no como el precio final
//   5. el calendario de la ficha no bloquea ningún día si no pudo consultar
//   6. los formularios enseñan el error en vez de «te contestamos en 24 h»
//
//   npm run build && npm run preview     # en otra terminal
//   npm run qa:degradado
//
// ⚠️ Este script SÍ devuelve exit ≠ 0 cuando algo falla.
// Sin los navegadores de Playwright:  PW_CHROME=/usr/bin/chromium npm run qa:degradado
import { chromium } from 'playwright'

const BASE = process.env.BASE || 'http://localhost:4173'

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

// Odoo instalado pero con el catálogo sin sembrar: es el 404 que devolvía
// producción, no una caída de red.
await pagina.route('**/api/web/v1/**', (ruta) =>
  ruta.fulfill({
    status: 404,
    contentType: 'application/json',
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ ok: false, error: 'tour_not_found', message: 'Ese tour no existe o no esta publicado.' }),
  }),
)

console.log('== Funnel con Odoo sin catálogo ==')
await pagina.goto(`${BASE}/book/saona-island?fecha=2026-09-20`, { waitUntil: 'networkidle' })

check(
  await pagina.getByText(/can.t open your booking right now/i).isVisible().catch(() => false),
  'el funnel avisa arriba de que la reserva no se pudo abrir',
)
check(
  await pagina.getByText(/Estimated price/i).isVisible().catch(() => false),
  'el total se marca como estimación, no como precio final',
)

await pagina.getByLabel('First name').fill('Ana')
// `getByLabel('Email')` dejó de ser único cuando el paso de contacto ganó el
// selector «Language for your booking» (45d904e): el <select> responde también
// a ese nombre y Playwright aborta por ambigüedad. Se pide el campo de texto.
await pagina.getByRole('textbox', { name: 'Email' }).fill('ana@example.com')
await pagina.getByRole('button', { name: 'Continue' }).click()
// El punto de recogida dejó de ser un <input> suelto: hoy es un combobox
// (ui/selector-hotel.tsx) con su propio campo de texto libre debajo, así que se
// rellena ese, no la etiqueta del grupo.
await pagina.getByRole('button', { name: /Select your hotel|Hotel or pick-up point/ }).first().click()
await pagina.getByPlaceholder('Search your hotel…').fill('Melia')
await pagina.locator('[role="listbox"] [role="option"]').first().click()
await pagina.getByRole('button', { name: 'Continue' }).click()

console.log('== Paso de pago ==')
check(
  await pagina.getByText(/can.t take the payment right now/i).isVisible().catch(() => false),
  'el paso de pago explica que no se puede cobrar',
)
check(
  (await pagina.locator('iframe[name^="__privateStripeFrame"]').count()) === 0,
  'no se pinta el campo de tarjeta para un cobro que no puede salir',
)
const cta = pagina.getByRole('button', { name: /Pay deposit/ })
check(await cta.isDisabled().catch(() => false), 'el CTA queda bloqueado')

console.log('== Calendario de la ficha ==')
await pagina.goto(`${BASE}/tours/semi-private-premium`, { waitUntil: 'networkidle' })
await pagina.getByRole('button', { name: /date|fecha|Choose/i }).first().click().catch(() => {})
const diasBloqueados = await pagina.locator('button.dia-cal[disabled]').count()
const diasTotales = await pagina.locator('button.dia-cal').count()
// Sin poder consultar, NO se bloquea nada por «agotado». Los únicos días
// deshabilitados que puede haber son los ya pasados de este mes.
check(
  diasTotales === 0 || diasBloqueados < diasTotales,
  'sin disponibilidad consultada el calendario no bloquea el mes entero',
)

console.log('== Formularios ==')
await pagina.goto(`${BASE}/travel-agents`, { waitUntil: 'networkidle' })
await pagina.getByLabel('Agency / DMC name').fill('Test DMC')
await pagina.getByLabel('Contact person').fill('Ana Pérez')
await pagina.getByRole('textbox', { name: 'Email' }).fill('ana@example.com')
await pagina.getByLabel('Phone / WhatsApp').fill('+1 809 000 0000')
await pagina.getByRole('button', { name: /Send registration/i }).click()
check(
  await pagina.getByText(/could not send that/i).isVisible({ timeout: 10_000 }).catch(() => false),
  'el formulario dice que no se envió, en vez de prometer respuesta en 24 h',
)
check(
  !(await pagina.getByText(/We got your registration/i).isVisible().catch(() => false)),
  'y NO enseña el acuse de recibo',
)

await navegador.close()

console.log(fallos === 0 ? '\n\x1b[32mTODO OK\x1b[0m' : `\n\x1b[31m${fallos} FALLO(S)\x1b[0m`)
process.exit(fallos === 0 ? 0 : 1)
