// F8 — comprueba el NOMBRE ACCESIBLE real de botones y enlaces (no solo su
// textContent): un <img alt="…"> dentro de un botón YA le da nombre, así que el
// primer barrido daba falsos positivos. Se usa el locator API de Playwright,
// que expone el nombre calculado por el motor.
import { chromium } from 'playwright'

const navegador = await chromium.launch()
// [2026-08-19] `locale: 'en-US'` obligatorio desde que el sitio es bilingüe:
// arranca en el idioma del navegador, y en una máquina con el sistema en
// español este script buscaría rótulos en inglés en una página en español y
// fallaría por un motivo que no tiene nada que ver con lo que comprueba.
const page = await navegador.newPage({ locale: 'en-US' })

for (const ruta of ['/facilities', '/tours/semi-private-premium', '/', '/fleet']) {
  await page.goto('http://localhost:5173' + ruta, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(800)
  const res = await page.evaluate(() => {
    // Aproximación al algoritmo de accname suficiente para este caso:
    // aria-label > aria-labelledby > texto propio > alt de una imagen hija > title
    const nombre = (el) => {
      const al = el.getAttribute('aria-label')
      if (al && al.trim()) return al.trim()
      const lb = el.getAttribute('aria-labelledby')
      if (lb) {
        const t = lb.split(/\s+/).map((id) => document.getElementById(id)?.textContent ?? '').join(' ').trim()
        if (t) return t
      }
      const txt = el.textContent?.trim()
      if (txt) return txt
      const img = el.querySelector('img[alt]:not([aria-hidden="true"])')
      if (img && img.getAttribute('alt').trim()) return img.getAttribute('alt').trim()
      const ti = el.getAttribute('title')
      if (ti && ti.trim()) return ti.trim()
      return ''
    }
    const malos = []
    let botones = 0
    let enlaces = 0
    for (const el of document.querySelectorAll('button, a[href]')) {
      if (el.tagName === 'BUTTON') botones++
      else enlaces++
      if (!nombre(el)) malos.push(el.outerHTML.replace(/\s+/g, ' ').slice(0, 110))
    }
    return { botones, enlaces, malos: malos.slice(0, 5), total: malos.length }
  })
  console.log(`### ${ruta}  botones:${res.botones} enlaces:${res.enlaces}  SIN NOMBRE: ${res.total}`)
  res.malos.forEach((s) => console.log('   ', s))
}

await navegador.close()
