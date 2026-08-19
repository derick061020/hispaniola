import { chromium } from 'playwright'

const navegador = await chromium.launch()
// [2026-08-19] `locale: 'en-US'` obligatorio desde que el sitio es bilingüe:
// arranca en el idioma del navegador, y en una máquina con el sistema en
// español este script buscaría rótulos en inglés en una página en español y
// fallaría por un motivo que no tiene nada que ver con lo que comprueba.
const ctx = await navegador.newContext({ viewport: { width: 390, height: 844 }, locale: 'en-US' })
const page = await ctx.newPage()
await page.goto('http://localhost:5173/', { waitUntil: 'load' })
await page.waitForTimeout(1500)

const r = await page.evaluate(() => {
  const limite = document.documentElement.clientWidth
  // Solo elementos que NO estén dentro de un ancestro que recorte el overflow
  const recorta = (el) => {
    let p = el.parentElement
    while (p && p !== document.body) {
      const o = getComputedStyle(p)
      if (/(hidden|clip|auto|scroll)/.test(o.overflowX)) return true
      p = p.parentElement
    }
    return false
  }
  const out = []
  for (const el of document.querySelectorAll('body *')) {
    const b = el.getBoundingClientRect()
    if (b.width === 0 || b.height === 0) continue
    if (b.right > limite + 0.5 && !recorta(el)) {
      out.push({
        tag: el.tagName.toLowerCase(),
        clases: String(el.className).slice(0, 90),
        right: Math.round(b.right),
        ancho: Math.round(b.width),
      })
    }
  }
  return { limite, scrollWidth: document.documentElement.scrollWidth, culpables: out.slice(0, 10) }
})

console.log('limite', r.limite, 'scrollWidth', r.scrollWidth)
for (const c of r.culpables) console.log('  ', c.tag, 'right', c.right, 'ancho', c.ancho, '|', c.clases)
await navegador.close()
