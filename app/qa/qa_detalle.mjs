// F8 — detalle de los dos hallazgos del barrido: botones sin nombre accesible
// y el desbordamiento horizontal de 5px en la home móvil.
import { chromium } from 'playwright'

const BASE = 'http://localhost:5173'
const navegador = await chromium.launch()

// 1. Botones sin nombre accesible
// [2026-08-19] `locale: 'en-US'` obligatorio desde que el sitio es bilingüe:
// arranca en el idioma del navegador, y en una máquina con el sistema en
// español este script buscaría rótulos en inglés en una página en español y
// fallaría por un motivo que no tiene nada que ver con lo que comprueba.
const ctx = await navegador.newContext({ viewport: { width: 1440, height: 900 }, locale: 'en-US' })
const page = await ctx.newPage()
for (const ruta of ['/tours/semi-private-premium', '/facilities', '/tours/saona-island']) {
  await page.goto(BASE + ruta, { waitUntil: 'load' })
  await page.waitForTimeout(600)
  const botones = await page.evaluate(() =>
    [...document.querySelectorAll('button')]
      .filter((b) => !b.textContent.trim() && !b.getAttribute('aria-label') && !b.getAttribute('title'))
      .map((b) => ({
        clases: b.className.slice(0, 90),
        padre: b.parentElement?.className?.slice?.(0, 60) ?? '',
        seccion: b.closest('section')?.id || b.closest('[id]')?.id || '',
        html: b.outerHTML.replace(/\s+/g, ' ').slice(0, 120),
      })),
  )
  console.log('###', ruta)
  for (const b of botones) console.log('   ', b.seccion, '|', b.html)
}

// 2. Overflow horizontal en móvil
const ctxM = await navegador.newContext({ viewport: { width: 390, height: 844 }, locale: 'en-US' })
const pageM = await ctxM.newPage()
await pageM.goto(BASE + '/', { waitUntil: 'load' })
await pageM.waitForTimeout(1200)
const culpables = await pageM.evaluate(() => {
  const limite = document.documentElement.clientWidth
  const out = []
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) continue
    if (r.right > limite + 0.5) {
      out.push({
        tag: el.tagName.toLowerCase(),
        clases: String(el.className).slice(0, 80),
        right: Math.round(r.right),
        limite,
      })
    }
  }
  return out.slice(0, 12)
})
console.log('\n### OVERFLOW HOME MOVIL (limite', culpables[0]?.limite, ')')
for (const c of culpables) console.log('   ', c.tag, c.right, '|', c.clases)

await navegador.close()
