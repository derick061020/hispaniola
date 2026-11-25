// [2026-10-30] Prueba de las casillas de aceptación del checkout (anexo del PDF
// HAA-LEG-002, págs. 5-6; components/reservar/casillas-aceptacion.tsx).
// Recorre el funnel hasta «Payment» con la API de Odoo SIMULADA, igual que
// qa_pago.mjs, a 1440 y a 390 px, y comprueba:
//
//   · las dos casillas, sin marcar al cargar, con sus enlaces (pestaña nueva) y
//     el Relevo sin enlace;
//   · que sin la casilla 1 NO sale ninguna llamada a /pay —ni desde el botón ni
//     desde la barra móvil— y que la casilla se marca en rojo con el aviso,
//     anunciado (role=alert) y con el foco puesto en ella;
//   · que al marcarla viaja `legal_acceptance` a Odoo en un `sync` ANTES de
//     /pay, con la forma documentada en PARA-DERICK.md §4;
//   · el texto en español, literal del PDF.
//
//   npm run build && npx vite preview --port 4318
//   BASE=http://localhost:4318 node qa/qa_casillas.mjs
//
// ⚠️ Este script SÍ devuelve exit ≠ 0 cuando algo falla.
// CAPTURAS=<carpeta> guarda el paso de pago en cada ancho.
import { chromium } from 'playwright'

const BASE = process.env.BASE || 'http://localhost:4173'
const CAPTURAS = process.env.CAPTURAS

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
    // Sin Stripe: el camino que se puede pulsar sin teclear una tarjeta es PayPal.
    stripe: { enabled: false, publishable_key: '', environment: 'test' },
    paypal: { enabled: true, client_id: 'sb', environment: 'sandbox' },
  },
  discounts: [],
  discount_cap_pct: 15,
}

const ES_TERMINOS =
  'He leído y acepto los Términos y Condiciones, la Política de Cancelación y Reembolsos, la Política de Privacidad y el Relevo de Responsabilidad y Asunción de Riesgos, en nombre propio y de todas las personas de esta reserva.'
const ES_IMAGEN =
  'Autorizo a Hispaniola Aquatic Adventures y a Bávaro Reefs Group a usar en redes sociales, web y publicidad las fotos y videos de la excursión en los que aparezcamos yo y los menores de mi reserva.'

let fallos = 0
const ok = (m) => console.log(`  \x1b[32m✓\x1b[0m ${m}`)
const ko = (m) => { fallos++; console.log(`  \x1b[31m✗\x1b[0m ${m}`) }
const check = (cond, m) => (cond ? ok(m) : ko(m))

const navegador = await chromium.launch({ channel: process.env.PW_CHANNEL, executablePath: process.env.PW_CHROME })

async function abrir({ ancho, alto, idioma = 'en' }) {
  const pagina = await navegador.newPage({ locale: 'en-US', viewport: { width: ancho, height: alto } })
  await pagina.addInitScript((i) => window.localStorage.setItem('hispaniola.idioma', i), idioma)
  const llamadas = []
  pagina.on('pageerror', (e) => console.log('    [pageerror]', e.message))
  await pagina.route('**/api/web/v1/**', (ruta) => {
    const req = ruta.request()
    const url = req.url()
    let cuerpo = null
    try { cuerpo = req.postDataJSON() } catch { /* GET */ }
    llamadas.push({ url, cuerpo })
    let data = url.includes('/config') ? CONFIG : PEDIDO
    // PayPal: se queda en una página nuestra para no salir a internet.
    if (url.includes('/pay')) data = { provider: 'paypal', approve_url: `${BASE}/?paypal-simulado=1`, amount: 487.5 }
    return ruta.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ ok: true, data }),
    })
  })
  await pagina.goto(`${BASE}/book/saona-island?fecha=2026-12-20`, { waitUntil: 'networkidle' })
  return { pagina, llamadas }
}

async function hastaElPago(pagina, idioma = 'en') {
  const en = idioma === 'en'
  // Selectores sin idioma donde se puede: el mismo recorrido sirve en ES.
  await pagina.locator('input[autocomplete="name"]').fill('Ana Pérez')
  await pagina.locator('input[type="email"]').fill('ana@example.com')
  await pagina.locator('input[type="tel"]').first().fill('8090000000')
  await pagina.locator('button[aria-haspopup="listbox"]').first().click()
  await pagina.getByPlaceholder(en ? 'Search your hotel…' : 'Busca tu hotel…').fill('Melia')
  await pagina.locator('[role="listbox"] [role="option"]').first().click()
  // Contacto → (menú) → pago: los pasos que haya, hasta ver PayPal.
  const paypal = pagina.getByRole('radio', { name: /PayPal/ })
  for (let i = 0; i < 4 && !(await paypal.isVisible()); i++) {
    await pulsaContinuar(pagina, en)
    await pagina.waitForTimeout(700)
  }
  await paypal.waitFor({ timeout: 10_000 })
}

// En móvil el «Continue» de cada paso vive en la barra fija de abajo.
async function pulsaContinuar(pagina, en) {
  const nombre = en ? /^Continue/ : /^Continuar/
  const visibles = pagina.getByRole('button', { name: nombre })
  const n = await visibles.count()
  for (let i = 0; i < n; i++) {
    if (await visibles.nth(i).isVisible()) return visibles.nth(i).click()
  }
  throw new Error('no hay botón Continue visible')
}

const pagos = (llamadas) => llamadas.filter((l) => /\/checkout\/[^/]+\/pay$/.test(new URL(l.url).pathname))

for (const { ancho, alto, movil } of [
  { ancho: 1440, alto: 900, movil: false },
  { ancho: 390, alto: 844, movil: true },
]) {
  console.log(`== ${ancho} px ==`)
  const { pagina, llamadas } = await abrir({ ancho, alto })
  await hastaElPago(pagina)
  await pagina.getByRole('radio', { name: /PayPal/ }).check()

  const terminos = pagina.getByRole('checkbox', { name: /I have read and accept/ })
  const imagen = pagina.getByRole('checkbox', { name: /I authorize Hispaniola/ })
  check(await terminos.isVisible(), 'está la casilla de Términos')
  check(await imagen.isVisible(), 'está la casilla de imagen')
  check(!(await terminos.isChecked()) && !(await imagen.isChecked()), 'las dos empiezan sin marcar')

  const etiquetaTerminos = pagina.locator('label', { has: terminos })
  const enlaces = await etiquetaTerminos.locator('a').evaluateAll((as) =>
    as.map((a) => ({ href: a.getAttribute('href'), target: a.target, texto: a.textContent })),
  )
  check(
    JSON.stringify(enlaces.map((e) => e.href)) === JSON.stringify(['/legal/terms', '/legal/cancellation-policy', '/legal/privacy']),
    `enlaces de la casilla 1: ${enlaces.map((e) => e.href).join(', ')}`,
  )
  check(enlaces.every((e) => e.target === '_blank'), 'los tres abren en pestaña nueva')
  check(!enlaces.some((e) => /Release/.test(e.texto)), 'el Relevo va sin enlace (HAA-LEG-001 no ha llegado)')
  check((await pagina.locator('label', { has: imagen }).locator('a').count()) === 0, 'la casilla de imagen no lleva enlaces')
  check((await etiquetaTerminos.locator('.text-coral-texto', { hasText: '*' }).count()) === 1, 'asterisco rojo en la casilla 1')
  check((await pagina.locator('label', { has: imagen }).getByText('*').count()) === 0, 'sin asterisco en la casilla 2')
  const textoPaso = await pagina.locator('#pago').innerText().catch(() => '')
  check(!/\b(required|optional|obligatori|opcional)\b/i.test(textoPaso), 'no pone «obligatorio» ni «opcional»')

  // Mismo aspecto: tamaño de la casilla y de la letra.
  const estilos = await pagina.evaluate(() =>
    [...document.querySelectorAll('input[type=checkbox]')].slice(-2).map((c) => {
      const r = c.getBoundingClientRect()
      const s = getComputedStyle(c.parentElement.querySelector('span'))
      return `${r.width}x${r.height} ${s.fontSize} ${s.color}`
    }),
  )
  check(estilos.length === 2 && estilos[0] === estilos[1], `las dos casillas se ven iguales (${estilos.join(' | ')})`)

  // Sin marcar: intentar pagar.
  const boton = movil
    ? pagina.locator('div.fixed').getByRole('button', { name: /Pay deposit/ })
    : pagina.getByRole('button', { name: /Continue with PayPal/ })
  check(await boton.isEnabled(), `el botón de pagar ${movil ? '(barra móvil) ' : ''}se puede pulsar sin la casilla`)
  await boton.click()
  const aviso = pagina.getByRole('alert').filter({ hasText: 'You must accept the Terms and Conditions to continue.' })
  await aviso.waitFor({ timeout: 3_000 }).then(() => ok('sale el aviso, anunciado (role=alert)'), () => ko('no sale el aviso'))
  check((await terminos.getAttribute('aria-invalid')) === 'true', 'la casilla queda aria-invalid')
  check(await terminos.evaluate((c) => document.activeElement === c), 'el foco va a la casilla')
  const enPantalla = await terminos.evaluate((c) => {
    const r = c.getBoundingClientRect()
    return r.top >= 0 && r.bottom <= window.innerHeight
  })
  check(enPantalla, 'la casilla queda a la vista')
  check((await etiquetaTerminos.getAttribute('class')).includes('border-coral'), 'la casilla se resalta en rojo')
  await pagina.waitForTimeout(500)
  check(pagos(llamadas).length === 0, 'sin la casilla no sale ninguna llamada a /pay')
  if (CAPTURAS) await pagina.screenshot({ path: `${CAPTURAS}/casillas-${ancho}-aviso.png` })

  // Clic en el TEXTO (no en el cuadrado): la etiqueta entera marca la casilla.
  await etiquetaTerminos.getByText(/on my own behalf/).click()
  check(await terminos.isChecked(), 'pulsar el texto marca la casilla')
  await aviso.waitFor({ state: 'detached', timeout: 2_000 }).then(() => ok('al marcarla, el aviso desaparece'), () => ko('el aviso sigue tras marcarla'))
  if (CAPTURAS) await pagina.screenshot({ path: `${CAPTURAS}/casillas-${ancho}-marcada.png` })
  if (movil) await imagen.check()

  const antes = llamadas.length
  await Promise.all([pagina.waitForURL(/paypal-simulado/, { timeout: 8_000 }).catch(() => {}), boton.click()])
  const despues = llamadas.slice(antes)
  const iSync = despues.findIndex((l) => l.cuerpo && 'legal_acceptance' in l.cuerpo)
  const iPay = despues.findIndex((l) => /\/pay$/.test(new URL(l.url).pathname))
  check(iSync >= 0, 'viaja `legal_acceptance` a Odoo')
  check(iPay > iSync && iSync >= 0, 'y sale ANTES de /pay')
  const la = iSync >= 0 ? despues[iSync].cuerpo.legal_acceptance : {}
  console.log('    legal_acceptance =', JSON.stringify(la))
  check(la.version === 'HAA-LEG-002 · 29 de octubre de 2026', 'versión «HAA-LEG-002 · 29 de octubre de 2026»')
  check(la.channel === 'web', 'canal «web»')
  check(la.image_consent === movil, `autoriza imagen = ${movil}`)
  check(!Number.isNaN(Date.parse(la.accepted_at)) && /Z$/.test(la.accepted_at), 'accepted_at es ISO en UTC')
  check(/\/sync$/.test(new URL(despues[iSync]?.url ?? BASE).pathname), 'va por /checkout/:code/sync')
  check(!despues.some((l) => l.cuerpo?.contact && 'legal_acceptance' in l.cuerpo), 'en un sync propio, separado del formulario')
  await pagina.close()
}

console.log('== Español (literal del PDF) ==')
{
  const { pagina } = await abrir({ ancho: 1440, alto: 900, idioma: 'es' })
  try {
    await hastaElPago(pagina, 'es')
    const textos = await pagina.evaluate(() =>
      [...document.querySelectorAll('input[type=checkbox]')].slice(-2).map((c) =>
        c.closest('label').innerText.replace(/\s+/g, ' ').trim(),
      ),
    )
    check(textos[0] === `${ES_TERMINOS} *`, 'casilla 1 en español, literal (+ asterisco)')
    check(textos[1] === ES_IMAGEN, 'casilla 2 en español, literal')
    if (textos[0] !== `${ES_TERMINOS} *`) console.log('    ', textos[0])
    await pagina.getByRole('radio', { name: /PayPal/ }).check()
    await pagina.getByRole('button', { name: /PayPal/ }).last().click()
    check(await pagina.getByText('Debe aceptar los Términos y Condiciones para continuar.').isVisible(), 'aviso en español, literal')
  } catch (e) {
    ko(`no se pudo recorrer el funnel en español: ${e.message.split('\n')[0]}`)
  }
  await pagina.close()
}

await navegador.close()
console.log(fallos === 0 ? '\n\x1b[32mTODO OK\x1b[0m' : `\n\x1b[31m${fallos} fallo(s)\x1b[0m`)
process.exit(fallos === 0 ? 0 : 1)
