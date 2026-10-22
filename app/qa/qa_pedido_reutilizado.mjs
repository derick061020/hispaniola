// [2026-10-22, Rossanna: prueba en la web reutilizó el pedido del 23/09
// (HSP-6561-5111); su reserva 20260923-001271 siguio con fecha 30/09 aunque
// ella eligio otra cosa] QA de los arreglos del pedido reutilizado por la
// clave de idempotencia de este navegador:
//   A. pedido reutilizado con fecha/personas viejas → se corrige contra la URL;
//   B. pedido reutilizado PAGADO → pedido nuevo con clave derivada, sin el
//      falso «We can’t open your booking», y recargar no crea un tercero;
//   C. pedido guardado que da 403/404 → se olvida y se abre otro;
//   D. robot declarado → no abre pedido.
// Es un recorte de `qa_recuperacion.mjs` (rama `recuperacion`) sin lo que aun
// no puede salir (casilla de marketing, consent, system_error, K2, K13).
//
// ⚠️ NO HABLA CON NINGUN ODOO. Todas las llamadas a /api/web/v1 las contesta
// un Odoo de mentira en memoria, SEA CUAL SEA EL HOST, y todo lo que no sea
// localhost se corta. El build apunta al Odoo de PRODUCCION (.env.production):
// sin estas rutas el funnel le hablaria a el. Al final se comprueba que
// ninguna peticion salio de localhost.
//
// A diferencia del resto de `qa/`, este SI sale con codigo ≠ 0 si algo falla.
//
//   npm run build && npm run preview -- --port 5198 --strictPort
//   BASE=http://localhost:5198 node qa/qa_pedido_reutilizado.mjs
//   (CHROME=/usr/bin/chromium si los navegadores de Playwright no estan)
import { chromium } from 'playwright'

const BASE = process.env.BASE || 'http://localhost:5198'
const SLUG = 'caribbean-escape'
const ID_NAVEGADOR = 'qa-navegador-1'
const CLAVE_BASE = `${SLUG}-${ID_NAVEGADOR}`
const ERROR_BANDA = 'We can’t open your booking right now.'
const fallos = []
const ok = (cond, texto) => {
  console.log(`  ${cond ? '✓' : '✗'} ${texto}`)
  if (!cond) fallos.push(texto)
}
/** Toda peticion que intento salir de localhost (cortada o interceptada). */
const fuera = []

// ── Odoo de mentira (mismo comportamiento que el real en lo que importa) ────
// `/start` con una clave conocida devuelve el pedido TAL CUAL, sea cual sea su
// estado y sin aplicarle el cuerpo (controllers/checkout.py, rama `reused`).
function crearOdoo() {
  const pedidos = new Map()
  const porClave = new Map()
  const llamadas = []
  let n = 0

  function nuevoPedido(cuerpo = {}, extra = {}) {
    n += 1
    const code = `HSP-TEST-${1000 + n}`
    const pax = cuerpo.pax ?? { adults: 2 }
    return {
      code, reference: `WEB/${n}`, state: 'draft', step: cuerpo.step ?? 'start',
      tour: cuerpo.tour ?? SLUG, tour_name: 'Caribbean Escape', variant: cuerpo.variant ?? null,
      variant_name: null, package: cuerpo.package ?? 'light', children_premium: !!cuerpo.children_premium,
      date: cuerpo.date ?? null, schedule_index: cuerpo.schedule_index ?? 0, departure: null, back: null,
      pax: { adults: pax.adults ?? 2, children: pax.children ?? 0, infants: pax.infants ?? 0,
        total: (pax.adults ?? 2) + (pax.children ?? 0) + (pax.infants ?? 0) },
      contact: { first_name: '', last_name: '', email: '', phone: '', country: '' },
      pickup: { hotel: '', room: '', notes: '', time: '' },
      occasion: null, occasion_note: null, how_found: null, dishes: [], addons: cuerpo.addons ?? [],
      amounts: { currency: 'USD', base: 198, addons: 0, discount: 0, total: 198, deposit: 49.5, balance: 148.5, paid: 0 },
      quote: { deposit_pct: 25, lines: [], discounts: [] },
      payment_status: null, reservation_status: null, created_at: new Date().toISOString(),
      token: `tok-${code}`,
      ...extra,
    }
  }

  function sembrar(clave, cuerpo, extra) {
    const p = nuevoPedido(cuerpo, extra)
    pedidos.set(p.code, p)
    if (clave) porClave.set(clave, p.code)
    return p
  }

  function aplicar(p, c) {
    if (c.step) p.step = c.step
    if (c.date !== undefined && c.date !== null) p.date = c.date
    if (c.schedule_index !== undefined) p.schedule_index = c.schedule_index
    if (c.package) p.package = c.package
    if (c.variant !== undefined) p.variant = c.variant
    if (c.addons) p.addons = c.addons
    if (c.pax) {
      Object.assign(p.pax, c.pax)
      p.pax.total = p.pax.adults + p.pax.children + p.pax.infants
    }
    if (c.contact) Object.assign(p.contact, c.contact)
    if (c.pickup) Object.assign(p.pickup, c.pickup)
  }

  const responder = (route, status, cuerpo) =>
    route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(cuerpo) })
  const sinToken = ({ token: _t, ...resto }) => resto

  async function manejar(route) {
    const req = route.request()
    const url = new URL(req.url())
    if (url.hostname !== 'localhost') fuera.push(`(interceptada) ${req.method()} ${url.href}`)
    const ruta = url.pathname.replace('/api/web/v1', '')
    const metodo = req.method()
    if (metodo === 'OPTIONS') return route.fulfill({ status: 204 })
    let cuerpo = null
    try { cuerpo = req.postDataJSON() } catch { cuerpo = null }
    const cabeceras = await req.allHeaders()
    llamadas.push({ metodo, ruta, cuerpo, cabeceras })

    if (ruta === '/checkout/start' && metodo === 'POST') {
      const clave = cabeceras['idempotency-key']
      if (clave && porClave.has(clave)) {
        return responder(route, 200, { ok: true, data: pedidos.get(porClave.get(clave)), reused: true })
      }
      const p = sembrar(clave, cuerpo)
      return responder(route, 200, { ok: true, data: p })
    }
    const m = ruta.match(/^\/checkout\/([^/]+)(\/(sync|abandon))?$/)
    if (m) {
      const p = pedidos.get(decodeURIComponent(m[1]))
      if (!p) return responder(route, 404, { ok: false, error: 'order_not_found' })
      const token = cabeceras['x-booking-token'] || url.searchParams.get('token')
      if (token !== p.token) return responder(route, 403, { ok: false, error: 'invalid_token' })
      if (!m[2] && metodo === 'GET') return responder(route, 200, { ok: true, data: sinToken(p) })
      if (m[3] === 'sync') {
        if (['paid', 'confirmed', 'cancelled'].includes(p.state)) {
          return responder(route, 409, { ok: false, error: 'order_closed' })
        }
        aplicar(p, cuerpo ?? {})
        return responder(route, 200, { ok: true, data: sinToken(p), capacity_ok: true })
      }
      if (m[3] === 'abandon') return responder(route, 200, { ok: true, data: { code: p.code, state: 'abandoned' } })
    }
    // Hoteles, disponibilidad, config…: sin datos; el front degrada.
    return responder(route, 404, { ok: false, error: 'not_mocked' })
  }

  return { pedidos, porClave, llamadas, manejar, sembrar }
}

const navegador = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {})

async function contexto(odoo, opciones = {}) {
  const ctx = await navegador.newContext({ viewport: { width: 1440, height: 900 }, locale: 'en-US', ...opciones })
  // El ORDEN importa: en Playwright gana la ULTIMA ruta registrada.
  //  1) todo lo que no sea localhost se corta;
  //  2) encima, /api/web/v1 la contesta el Odoo de mentira, sea cual sea el host.
  await ctx.route(/^https?:\/\/(?!localhost[:/])/, (r) => {
    fuera.push(`(cortada) ${r.request().method()} ${r.request().url()}`)
    return r.abort()
  })
  await ctx.route('**/api/web/v1/**', (r) => odoo.manejar(r))
  // Este navegador ya tiene su identificador (como quien vuelve a la web).
  await ctx.addInitScript((id) => {
    try { if (!localStorage.getItem('haa.checkout.navegador')) localStorage.setItem('haa.checkout.navegador', id) } catch {}
  }, ID_NAVEGADOR)
  return ctx
}

async function ir(page, url) {
  for (let intento = 0; intento < 2; intento++) {
    await page.goto(url, { waitUntil: 'domcontentloaded' })
    const montado = await page.locator('#root > *').first().waitFor({ timeout: 20000 }).then(() => true, () => false)
    if (montado) return
  }
}
const espera = (ms) => new Promise((r) => setTimeout(r, ms))
const syncs = (odoo) => odoo.llamadas.filter((l) => l.ruta.endsWith('/sync'))
const starts = (odoo) => odoo.llamadas.filter((l) => l.ruta === '/checkout/start')
const listo = (page) => page.getByRole('textbox', { name: 'Email', exact: true }).waitFor({ timeout: 60000 })
const guardado = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('hsp:checkout:v1') || 'null'))

// ── A. Pedido reutilizado con fecha y personas viejas ───────────────────────
console.log('\nA. Pedido reutilizado con fecha y personas viejas')
{
  const odoo = crearOdoo()
  const viejo = odoo.sembrar(CLAVE_BASE, { date: '2026-09-30', pax: { adults: 4, children: 1, infants: 0 } })
  const ctx = await contexto(odoo)
  const page = await ctx.newPage()
  await ir(page, `${BASE}/book/${SLUG}?fecha=2026-12-01&personas=3&adultos=3&horario=0`)
  await listo(page)
  await espera(1000)
  ok(starts(odoo).length === 1 && starts(odoo)[0].cabeceras['idempotency-key'] === CLAVE_BASE,
    'un /start con la clave de este navegador')
  ok(odoo.pedidos.size === 1, 'se reutiliza el pedido (no se crea otro)')
  const corr = syncs(odoo).find((l) => l.ruta === `/checkout/${viejo.code}/sync`)
  ok(corr?.cuerpo?.date === '2026-12-01', `el sync corrige la fecha a la de la URL (${corr?.cuerpo?.date})`)
  ok(corr?.cuerpo?.pax?.adults === 3 && corr?.cuerpo?.pax?.children === 0,
    `… y las personas (${JSON.stringify(corr?.cuerpo?.pax)})`)
  ok(viejo.date === '2026-12-01' && viejo.pax.total === 3, `el pedido en Odoo queda con 01/12 y 3 pax (${viejo.date}, ${viejo.pax.total})`)
  ok((await guardado(page))?.codigo === viejo.code, 'la sesion local apunta al pedido corregido')
  ok(await page.getByText(ERROR_BANDA).count() === 0, 'sin banda de error')

  // Recargar con el pedido ya corregido: no sale ningun sync de correccion.
  const antes = syncs(odoo).length
  await ir(page, page.url())
  await listo(page)
  await espera(800)
  ok(syncs(odoo).length === antes && odoo.pedidos.size === 1, 'recargar: sin desajuste, ni sync ni pedido nuevo')
  await ctx.close()
}

// ── B. Pedido reutilizado PAGADO ────────────────────────────────────────────
console.log('\nB. Pedido reutilizado ya pagado')
{
  const odoo = crearOdoo()
  const pagado = odoo.sembrar(CLAVE_BASE, { date: '2026-09-30', pax: { adults: 2 } }, { state: 'paid' })
  const ctx = await contexto(odoo)
  const page = await ctx.newPage()
  await ir(page, `${BASE}/book/${SLUG}?fecha=2026-12-01&personas=3&adultos=3`)
  await listo(page)
  await espera(1000)
  ok(odoo.pedidos.size === 2, `se abre un pedido NUEVO (pedidos: ${odoo.pedidos.size})`)
  const claves = starts(odoo).map((l) => l.cabeceras['idempotency-key'])
  ok(claves[1] === `${CLAVE_BASE}-${pagado.code}`, `con clave derivada del pagado (${claves[1]})`)
  const sesion = await guardado(page)
  const nuevo = odoo.pedidos.get(sesion?.codigo)
  ok(!!nuevo && nuevo.code !== pagado.code, `la sesion es la del pedido nuevo (${sesion?.codigo})`)
  ok(nuevo?.date === '2026-12-01' && nuevo?.pax?.adults === 3, 'el nuevo nace con la fecha y personas de la URL')
  ok(!syncs(odoo).some((l) => l.ruta.includes(pagado.code)), 'nunca se intenta guardar en el pagado (sin 409)')
  ok(await page.getByText(ERROR_BANDA).count() === 0, 'sin el falso «We can’t open your booking»')
  // Escribir un campo: el guardado va al pedido nuevo y contesta 200.
  await page.getByRole('textbox', { name: 'Email', exact: true }).fill('ana@gmail.com')
  await page.getByLabel('Full name').click()
  await espera(1000)
  const ultimo = syncs(odoo).at(-1)
  ok(ultimo?.ruta === `/checkout/${nuevo?.code}/sync` && nuevo?.contact?.email === 'ana@gmail.com',
    'el primer guardado del visitante llega al pedido nuevo')
  ok(await page.getByText(ERROR_BANDA).count() === 0, '… y sigue sin banda de error')

  // Tras «Gracias» la sesion se borra; volver a reservar recorre la misma cadena.
  await page.evaluate(() => localStorage.removeItem('hsp:checkout:v1'))
  await ir(page, page.url())
  await listo(page)
  await espera(800)
  ok(odoo.pedidos.size === 2, `recargar sin sesion: misma cadena de claves, no hay tercer pedido (${odoo.pedidos.size})`)
  await ctx.close()
}

// ── C. Pedido guardado que da 403 / 404 ────────────────────────────────────
console.log('\nC. Pedido guardado que ya no vale (403 / 404)')
for (const [caso, preparar] of [
  ['403 (token malo)', (odoo) => {
    const p = odoo.sembrar(null, { date: '2026-12-01' })
    return { codigo: p.code, token: 'token-malo' }
  }],
  ['404 (pedido inexistente)', () => ({ codigo: 'HSP-NO-EXISTE', token: 'tok-x' })],
]) {
  const odoo = crearOdoo()
  const { codigo, token } = preparar(odoo)
  const ctx = await contexto(odoo)
  await ctx.addInitScript((s) => {
    try {
      if (!sessionStorage.getItem('qa-sembrado')) {
        localStorage.setItem('hsp:checkout:v1', JSON.stringify(s))
        sessionStorage.setItem('qa-sembrado', '1')
      }
    } catch {}
  }, { codigo, token, tour: SLUG, abierto: new Date().toISOString() })
  const page = await ctx.newPage()
  const antes = odoo.pedidos.size
  await ir(page, `${BASE}/book/${SLUG}?fecha=2026-12-01&personas=2`)
  await listo(page)
  await espera(1000)
  ok(odoo.llamadas.some((l) => l.metodo === 'GET' && l.ruta === `/checkout/${codigo}`), `${caso}: se intenta leer el guardado`)
  ok(starts(odoo).length === 1 && odoo.pedidos.size === antes + 1, `${caso}: se abre un pedido nuevo`)
  const s = await guardado(page)
  ok(s && s.codigo !== codigo, `${caso}: la sesion local olvida el pedido malo (${s?.codigo})`)
  ok(await page.getByText(ERROR_BANDA).count() === 0, `${caso}: sin banda de error`)
  await ctx.close()
}

// ── C2. Un 5xx al leer el guardado SI es un error de verdad ────────────────
console.log('\nC2. 5xx al leer el pedido guardado (debe seguir avisando)')
{
  const odoo = crearOdoo()
  const p = odoo.sembrar(null, { date: '2026-12-01' })
  const manejarOriginal = odoo.manejar
  odoo.manejar = async (route) => {
    const url = new URL(route.request().url())
    if (route.request().method() === 'GET' && url.pathname.endsWith(`/checkout/${p.code}`)) {
      odoo.llamadas.push({ metodo: 'GET', ruta: `/checkout/${p.code}`, cuerpo: null, cabeceras: {} })
      return route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ ok: false, error: 'internal_error' }) })
    }
    return manejarOriginal(route)
  }
  const ctx = await contexto(odoo)
  await ctx.addInitScript((s) => {
    try { localStorage.setItem('hsp:checkout:v1', JSON.stringify(s)) } catch {}
  }, { codigo: p.code, token: p.token, tour: SLUG, abierto: new Date().toISOString() })
  const page = await ctx.newPage()
  await ir(page, `${BASE}/book/${SLUG}?fecha=2026-12-01&personas=2`)
  await page.getByText(ERROR_BANDA).waitFor({ timeout: 60000 }).catch(() => {})
  ok(await page.getByText(ERROR_BANDA).count() === 1 && starts(odoo).length === 0,
    '500 al leer → banda de error y NO se abre otro pedido (como antes)')
  await ctx.close()
}

// ── D. Robot declarado ──────────────────────────────────────────────────────
console.log('\nD. Robot declarado')
for (const ua of [
  'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  'AdsBot-Google (+http://www.google.com/adsbot.html)',
]) {
  const odoo = crearOdoo()
  const ctx = await contexto(odoo, { userAgent: ua })
  const page = await ctx.newPage()
  await ir(page, `${BASE}/book/${SLUG}`)
  await listo(page)
  await espera(800)
  ok(starts(odoo).length === 0, `${ua.slice(0, 30)}… no abre pedido`)
  ok(await page.getByText(ERROR_BANDA).count() === 0, '… y no ve la banda de error')
  await ctx.close()
}
{
  const odoo = crearOdoo()
  const ctx = await contexto(odoo, {
    userAgent: 'Mozilla/5.0 (Linux; Android 10; CUBOT X30) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36',
  })
  const page = await ctx.newPage()
  await ir(page, `${BASE}/book/${SLUG}`)
  await listo(page)
  await espera(800)
  ok(starts(odoo).length === 1, 'un movil CUBOT (no es robot) SI abre pedido')
  await ctx.close()
}

await navegador.close()

// ── Nada salio de localhost ─────────────────────────────────────────────────
console.log('\nZ. Aislamiento')
const aOdooReal = fuera.filter((f) => f.includes('/api/web/v1') && f.startsWith('(cortada)'))
ok(aOdooReal.length === 0, 'ninguna llamada a /api/web/v1 escapo al mock')
console.log(`  (peticiones fuera de localhost: ${fuera.length}, todas cortadas o contestadas por el mock)`)
for (const f of [...new Set(fuera.map((x) => x.replace(/\?.*$/, '')))].slice(0, 12)) console.log(`    ${f}`)

console.log(fallos.length ? `\n✗ ${fallos.length} fallos:\n  - ${fallos.join('\n  - ')}` : '\n✓ Todo en verde')
process.exit(fallos.length ? 1 : 0)
