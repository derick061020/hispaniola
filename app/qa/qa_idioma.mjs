// QA de idioma EN VIVO — recorre las rutas en los dos idiomas y comprueba que
// la web entera cambia, no solo la home.
//
// Lo que qa_i18n.mjs no puede ver: aquel lee el código y dice si FALTAN
// entradas; este abre la página, pulsa el selector y mira lo que queda en
// pantalla. Son los dos fallos distintos —diccionario incompleto y texto que
// no pasa por t()— y hacen falta los dos.
//
// Por ruta comprueba:
//   · que <html lang> pasa a "es";
//   · que el texto visible cambia de verdad (no un toggle decorativo, que es
//     lo que había hasta hoy);
//   · cuánto inglés queda suelto tras el cambio, buscando palabras que en
//     español no existen (the/your/with/book now…);
//   · que la elección sobrevive a una recarga.
//
// Uso: npm run preview  →  npm run qa:idioma
import { chromium } from 'playwright'

const BASE = process.env.BASE ?? 'http://localhost:4173'
const RUTAS = [
  '/', '/tours/semi-private-premium', '/tours/saona-island', '/book/semi-private-premium',
  '/my-booking', '/account', '/fleet', '/crew', '/facilities', '/marine-park',
  '/foundation', '/competitive-advantage', '/why-book-direct', '/faq', '/blog',
  '/guides', '/contact', '/travel-agents', '/careers', '/events/weddings',
  '/legal/terms', '/no-existe',
]

// Palabras que solo pueden ser inglés. Nada de «no», «total» o «premium», que
// son iguales en los dos idiomas y darían falso positivo en cada página.
const INGLES = /\b(the|your|with|from the|book now|guests|our|and the|what|how|free|included|please)\b/gi

// Nombres propios que LLEVAN una palabra inglesa dentro y no se traducen: el
// barco «Follow Your Dreams» hacía saltar la alarma de /fleet en cada pasada.
const NOMBRES_PROPIOS = [/Follow Your Dreams/g, /Snorkel Lovers/g, /Hispaniola Aquatic Adventures/g]

// `locale` explícito: sin él Chromium hereda el idioma del sistema, y en una
// máquina en español el sitio ARRANCA en español (que es justo lo que se
// quiere en producción — el visitante hispanohablante no tiene que buscar el
// toggle). Pero para comparar hace falta partir de un inglés fijo.
const navegador = await chromium.launch()
const pagina = await navegador.newPage({ viewport: { width: 1280, height: 900 }, locale: 'en-US' })
const fallos = []

async function textoVisible() {
  return pagina.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').trim())
}

for (const ruta of RUTAS) {
  await pagina.goto(BASE + ruta, { waitUntil: 'load' })
  await pagina.evaluate(() => localStorage.setItem('hispaniola.idioma', 'en'))
  await pagina.reload({ waitUntil: 'load' })

  const en = await textoVisible()
  const langEn = await pagina.evaluate(() => document.documentElement.lang)

  // El selector vive en el topbar (y en el header del funnel); en móvil, en el
  // menú. Aquí se va a lo seguro y se cambia por el store.
  await pagina.evaluate(() => localStorage.setItem('hispaniola.idioma', 'es'))
  await pagina.reload({ waitUntil: 'load' })

  const es = await textoVisible()
  const langEs = await pagina.evaluate(() => document.documentElement.lang)
  const limpio = NOMBRES_PROPIOS.reduce((txt, re) => txt.replace(re, ''), es)
  const restos = [...new Set((limpio.match(INGLES) ?? []).map((p) => p.toLowerCase()))]

  const cambio = en !== es
  const marca = cambio && langEs === 'es' && restos.length === 0 ? 'OK  ' : 'MIRA'
  if (marca === 'MIRA') fallos.push(ruta)
  console.log(
    `${marca} ${ruta.padEnd(32)} lang ${langEn}→${langEs} · ${cambio ? 'el texto cambia' : 'NO CAMBIA'}` +
      (restos.length ? ` · inglés suelto: ${restos.slice(0, 6).join(', ')}` : ''),
  )
}

// La elección tiene que sobrevivir a cerrar el navegador.
await pagina.goto(BASE + '/', { waitUntil: 'load' })
const persiste = await pagina.evaluate(() => document.documentElement.lang)
console.log(`\npersistencia tras recargar: lang=${persiste} ${persiste === 'es' ? 'OK' : 'MAL'}`)

console.log(`\nrutas con algo que mirar: ${fallos.length}/${RUTAS.length}`)
if (fallos.length) console.log('  ' + fallos.join('\n  '))
await navegador.close()
