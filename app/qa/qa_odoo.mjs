// QA de la conexión con Odoo. Navegador real recorriendo el funnel y
// comprobando, contra la API, que lo que se pinta es lo que se guardó.
//
// No es una prueba de la API (para eso está `smoke_test.sh` del módulo): es la
// prueba de que el FRONT habla con ella. Lo que verifica, en este orden:
//
//   1. abrir /book/:slug crea la reserva en Odoo — antes de tocar nada
//   2. el precio que se pinta es el del servidor, no la fórmula vieja
//   3. cada paso del acordeón persiste
//   4. cerrar la pestaña deja la reserva PENDIENTE, no la pierde
//
// Requiere: `npm run dev` en el 5173 y Odoo con el módulo en VITE_API_URL.
//
//   node qa/qa_odoo.mjs [URL_FRONT] [URL_ODOO]
//
// ⚠️ Como el resto de `qa/`, este script NO devuelve exit ≠ 0 en los avisos —
// pero sí en los fallos duros. Hay que leer la salida igualmente.

import { chromium } from 'playwright'

const FRONT = process.argv[2] ?? 'http://localhost:5173'
const ODOO = process.argv[3] ?? 'http://localhost:8069'
const API = `${ODOO}/api/web/v1`

let ok = 0
let fallos = 0
const check = (desc, cond, extra = '') => {
  if (cond) {
    console.log(`  ✓ ${desc}`)
    ok++
  } else {
    console.log(`  ✗ ${desc}${extra ? ` — ${extra}` : ''}`)
    fallos++
  }
}

const navegador = await chromium.launch()
// [2026-08-19] `locale: 'en-US'` obligatorio desde que el sitio es bilingüe:
// arranca en el idioma del navegador, y en una máquina con el sistema en
// español este script buscaría rótulos en inglés en una página en español y
// fallaría por un motivo que no tiene nada que ver con lo que comprueba.
const contexto = await navegador.newContext({ locale: 'en-US' })
const pagina = await contexto.newPage()

// Se capturan las llamadas a la API para poder afirmar que existieron. Sin
// esto, un front que pinte bien pero no hable con nadie pasaría la prueba.
const llamadas = []
pagina.on('request', (r) => {
  if (r.url().includes('/api/web/v1/')) llamadas.push(`${r.method()} ${new URL(r.url()).pathname}`)
})
const erroresConsola = []
pagina.on('console', (m) => {
  if (m.type() === 'error') erroresConsola.push(m.text())
})

console.log(`== Funnel de reserva (${FRONT}) ==`)

// Saona en catamarán con 30 personas: EL caso del bug de precio. La ficha
// cobraba 1.950 (tramo de grupo) y el checkout 5.520 (184 × 30).
await pagina.goto(
  `${FRONT}/book/saona-island?variante=catamaran&personas=30&fecha=2026-12-15&horario=0`,
  { waitUntil: 'networkidle' },
)

check('el checkout llamó a /checkout/start', llamadas.some((l) => l.includes('/checkout/start')))

const codigo = await pagina.evaluate(() => {
  const bruto = localStorage.getItem('hsp:checkout:v1')
  return bruto ? JSON.parse(bruto).codigo : null
})
check('guardó el código de la reserva', Boolean(codigo), String(codigo))

if (!codigo) {
  console.log('\nSin código no se puede seguir. ¿Está Odoo levantado en ' + ODOO + '?')
  await navegador.close()
  process.exit(1)
}

// La reserva ya existe en Odoo SIN haber rellenado ni pagado nada.
const leer = async () => {
  const token = await pagina.evaluate(() => JSON.parse(localStorage.getItem('hsp:checkout:v1')).token)
  const res = await fetch(`${API}/checkout/${codigo}`, { headers: { 'X-Booking-Token': token } })
  return (await res.json()).data
}

let pedido = await leer()
check('la reserva existe en Odoo nada más abrir el checkout', pedido?.reservation_status === 'pending')
check('nace pendiente de pago', pedido?.payment_status === 'pending_payment')
check(
  'el total es el del TRAMO (1950), no la fórmula vieja (5520)',
  pedido?.amounts.total === 1950,
  `total = ${pedido?.amounts.total}`,
)

const pintado = await pagina.textContent('body')
check('la pantalla pinta 1,950 y no 5,520', pintado.includes('1,950') && !pintado.includes('5,520'))

console.log('== Pasos del acordeón ==')

// Los campos de nombre no declaran `type`, así que se localizan por etiqueta
// (que es como los encuentra también un lector de pantalla).
await pagina.getByLabel('First name').fill('QA')
await pagina.getByLabel('Last name').fill('Tester')
// `getByLabel('Email')` dejó de ser único cuando el paso de contacto ganó el
// selector «Language for your booking» (45d904e): el <select> responde también
// a ese nombre y Playwright aborta por ambigüedad. Se pide el campo de texto.
await pagina.getByRole('textbox', { name: 'Email' }).fill('qa@example.com')
await pagina.getByRole('button', { name: /continue/i }).first().click()
await pagina.waitForTimeout(1200)

pedido = await leer()
check('el contacto llegó a Odoo', pedido?.contact.email === 'qa@example.com')
check('hubo un POST de sincronización', llamadas.some((l) => l.includes('/sync')))

console.log('== Abandono ==')

// Cerrar la pestaña dispara el `pagehide` -> sendBeacon.
await pagina.close()
await new Promise((r) => setTimeout(r, 1500))

const token = 'x' // ya no hay página; se consulta por lookup con el email
const res = await fetch(`${API}/bookings/lookup`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ code: codigo, email: 'qa@example.com' }),
})
const encontrada = (await res.json())?.data?.booking
void token
check('LA RESERVA SIGUE EN ODOO tras cerrar la pestaña', Boolean(encontrada))
check('y sigue en estado pendiente', encontrada?.status === 'pending')

console.log('== Consola ==')
const ruido = erroresConsola.filter((e) => !e.includes('favicon'))
check('sin errores de consola', ruido.length === 0, ruido.slice(0, 2).join(' | '))

await navegador.close()

console.log('\n----------------------------------------')
console.log(fallos === 0 ? `TODO OK — ${ok} comprobaciones` : `${fallos} fallos de ${ok + fallos}`)
process.exit(fallos === 0 ? 0 : 1)
