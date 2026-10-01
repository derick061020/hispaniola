import { chromium } from 'playwright'
const BASE = 'https://sistemashispaniola.com'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1500, height: 950 } })
const errs = [], malas = []
p.on('pageerror', e => errs.push(String(e).slice(0, 200)))
p.on('response', r => { if (r.status() >= 400 && !r.url().includes('favicon')) malas.push(r.status()+' '+r.url().slice(0,80)) })
await p.goto(`${BASE}/web/login`, { waitUntil: 'domcontentloaded' })
await p.fill('input[name="login"]', '_qa_scroll')
await p.fill('input[name="password"]', 'Qa-scroll-2026-temporal')
await p.click('button[type="submit"]')
await p.waitForURL(/\/web|\/odoo/, { timeout: 60000 })
await p.waitForTimeout(7000)
await p.goto(`${BASE}/web#id=276858&model=haa.reservation&view_type=form`, { waitUntil: 'domcontentloaded' })
await p.waitForTimeout(7000)

const leer = () => p.evaluate(() => {
  const s = document.querySelector('[name="payment_status"] select')
  return s ? s.options[s.selectedIndex].text.trim() : null
})
console.log('antes        :', await leer())

// Cambiar con el select, como una persona
const sel = p.locator('[name="payment_status"] select').first()
await sel.selectOption({ label: 'Full Payment Received' })
await p.waitForTimeout(2500)
console.log('tras elegir  :', await leer())

// Guardar (la nube del breadcrumb)
const guardar = p.locator('button.o_form_button_save, .o_form_button_save').first()
if (await guardar.count()) { await guardar.click(); await p.waitForTimeout(4000) }
else console.log('   no encontre el boton de guardar')

const aviso = await p.evaluate(() => {
  const d = document.querySelector('.o_notification, .o_dialog')
  return d ? d.innerText.slice(0, 200).replace(/\n/g, ' | ') : ''
})
if (aviso) console.log('aviso        :', aviso)

// Recargar la pagina entera y ver si aguanto
await p.reload({ waitUntil: 'domcontentloaded' })
await p.waitForTimeout(7000)
console.log('tras recargar:', await leer())
console.log('errores js:', errs.length, errs.slice(0,2))
console.log('respuestas 4xx/5xx:', malas.length, malas.slice(0,3))
await p.screenshot({ path: process.argv[2] })
await b.close()
