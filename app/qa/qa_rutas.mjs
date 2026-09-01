// F8 — barrido de QA de todas las rutas del sitio.
// Por cada ruta: errores de consola, peticiones 4xx/5xx, <title>, nº de <h1>,
// meta description y overflow horizontal (desktop y móvil).
import { chromium } from 'playwright'

const BASE = 'http://localhost:5173'
const RUTAS = [
  '/',
  '/tours/semi-private-premium',
  '/tours/snorkel-lovers',
  '/tours/private-charter',
  '/tours/saona-island',
  '/book/semi-private-premium?fecha=2026-08-20',
  '/my-booking?codigo=HSP-0000-0001',
  '/events/party-boat',
  '/events/weddings',
  '/events/corporate',
  '/competitive-advantage',
  '/crew',
  '/crew-boat',
  '/facilities',
  '/marine-park',
  '/fleet',
  '/foundation',
  '/guides',
  '/faq',
  '/blog',
  '/blog/cinco-cosas-antes-de-un-catamaran',
  '/travel-agents',
  '/careers',
  '/why-book-direct',
  '/contact',
  '/legal/cancellation-policy',
  '/legal/privacy',
  '/legal/terms',
  '/legal/cookies',
  '/fundaciones',
  '/ruta-que-no-existe',
  // redirecciones viejas ES → EN
  '/tours/semi-privado',
  '/eventos/bodas',
  '/reserva-directa',
  '/nosotros',
]

const VIEWPORTS = [
  { nombre: 'desktop', width: 1440, height: 900 },
  { nombre: 'movil', width: 390, height: 844 },
]

const navegador = await chromium.launch()
const filas = []

for (const vp of VIEWPORTS) {
  const ctx = await navegador.newContext({ viewport: { width: vp.width, height: vp.height } })
  const page = await ctx.newPage()
  for (const ruta of RUTAS) {
    const errores = []
    const fallos = []
    const onConsole = (m) => {
      if (m.type() === 'error') errores.push(m.text().replace(/\s+/g, ' ').slice(0, 150))
    }
    const onResponse = (r) => {
      if (r.status() >= 400) fallos.push(`${r.status()} ${r.url().replace(BASE, '').slice(0, 70)}`)
    }
    const onPageError = (e) => errores.push('PAGEERROR ' + String(e).replace(/\s+/g, ' ').slice(0, 150))
    page.on('console', onConsole)
    page.on('response', onResponse)
    page.on('pageerror', onPageError)
    try {
      await page.goto(BASE + ruta, { waitUntil: 'domcontentloaded', timeout: 20000 })
      await page.waitForTimeout(700)
    } catch (e) {
      errores.push('NAV ' + String(e).slice(0, 100))
    }
    let info = {}
    try {
      info = await page.evaluate(() => ({
        url: location.pathname,
        titulo: document.title,
        h1: [...document.querySelectorAll('h1')].map((h) => h.textContent.trim().slice(0, 50)),
        desc: document.querySelector('meta[name=description]')?.content?.length ?? 0,
        noindex: !!document.querySelector('meta[name=robots]'),
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        imgsSinAlt: [...document.images].filter((i) => !i.hasAttribute('alt')).length,
        botonesSinNombre: [...document.querySelectorAll('button')].filter(
          (b) => !b.textContent.trim() && !b.getAttribute('aria-label') && !b.getAttribute('title'),
        ).length,
      }))
    } catch (e) {
      info = { error: String(e).slice(0, 80) }
    }
    page.off('console', onConsole)
    page.off('response', onResponse)
    page.off('pageerror', onPageError)
    filas.push({ vp: vp.nombre, ruta, ...info, errores: [...new Set(errores)].slice(0, 2), fallos: [...new Set(fallos)].slice(0, 3) })
  }
  await ctx.close()
}

await navegador.close()

// Informe compacto
for (const f of filas) {
  const problemas = []
  if (f.errores?.length) problemas.push('ERR:' + f.errores.join(' | '))
  if (f.fallos?.length) problemas.push('HTTP:' + f.fallos.join(' | '))
  if (f.overflow > 0) problemas.push(`OVERFLOW:${f.overflow}px`)
  if (f.h1 && f.h1.length !== 1) problemas.push(`H1s:${f.h1.length}`)
  if (f.imgsSinAlt) problemas.push(`IMG-SIN-ALT:${f.imgsSinAlt}`)
  if (f.botonesSinNombre) problemas.push(`BTN-SIN-NOMBRE:${f.botonesSinNombre}`)
  if (!f.desc) problemas.push('SIN-META-DESC')
  if (problemas.length) console.log(`[${f.vp}] ${f.ruta}\n    ${problemas.join('\n    ')}`)
}
console.log('\n--- TITULOS ---')
for (const f of filas.filter((x) => x.vp === 'desktop')) {
  console.log(`${f.ruta.padEnd(42)} ${f.titulo ?? ''}`)
}
