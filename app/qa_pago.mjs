import { chromium } from 'playwright'
const BASE = 'https://sistemashispaniola.com'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1500, height: 950 } })
const errs = []
p.on('pageerror', e => errs.push(String(e).slice(0, 180)))
await p.goto(`${BASE}/web/login`, { waitUntil: 'domcontentloaded' })
await p.fill('input[name="login"]', '_qa_scroll')
await p.fill('input[name="password"]', 'Qa-scroll-2026-temporal')
await p.click('button[type="submit"]')
await p.waitForURL(/\/web|\/odoo/, { timeout: 60000 })
await p.waitForTimeout(7000)
// La reserva 276858, ya guardada y confirmada
await p.goto(`${BASE}/web#id=276858&model=haa.reservation&view_type=form`, { waitUntil: 'domcontentloaded' })
await p.waitForTimeout(7000)
const info = await p.evaluate(() => {
  const campos = [...document.querySelectorAll('[name="payment_status"]')]
  return campos.map(c => {
    const sel = c.querySelector('select')
    const inp = c.querySelector('input')
    return {
      clases: (c.className || '').slice(0, 70),
      tieneSelect: !!sel, selectDeshabilitado: sel ? sel.disabled : null,
      opciones: sel ? sel.options.length : 0,
      readonlyCSS: (c.className || '').includes('o_readonly_modifier'),
      texto: (c.innerText || '').trim().slice(0, 40),
    }
  })
})
console.log('campos payment_status en la pantalla:')
for (const i of info) console.log('  ', JSON.stringify(i))
console.log('errores js:', errs.length, errs.slice(0, 2))
await p.screenshot({ path: process.argv[2] })
await b.close()
