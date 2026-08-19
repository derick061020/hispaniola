// QA: que CADA tour sepa que se come, en los dos paquetes.
//
// [2026-08-18] El menu tiene tres formas distintas en este catalogo y todas
// tienen que contestar: el semi-privado vende Light/Premium (cada comensal
// elige plato), Saona sirve buffet (nadie elige) y el charter tiene una carta
// POR DURACION de barco. Un fallo aqui no se ve en pantalla como un error:
// se ve como un acordeon vacio, o como un cliente al que nunca se le pregunto
// que queria comer.
//
//   node qa/qa_menus.mjs
import { build } from 'rolldown'

const raiz = new URL('../src', import.meta.url).pathname
await build({
  input: `${raiz}/lib/menu-reserva.ts`,
  resolve: { alias: { '@': raiz } },
  output: { file: '/tmp/menu-bundle.mjs', format: 'esm' },
  logLevel: 'silent',
})
await build({
  input: `${raiz}/data/tours.ts`,
  resolve: { alias: { '@': raiz } },
  output: { file: '/tmp/tours-menus.mjs', format: 'esm' },
  logLevel: 'silent',
})
const { menuDeLaReserva } = await import(`/tmp/menu-bundle.mjs?t=${Date.now()}`)
const { FICHAS } = await import(`/tmp/tours-menus.mjs?t=${Date.now()}`)

let fallos = 0
for (const slug of Object.keys(FICHAS)) {
  for (const paquete of ['light', 'premium']) {
    // El charter cambia de carta segun el barco: se prueba con el primero.
    const subVariante = FICHAS[slug].subVariantes?.[0]?.id ?? null
    const m = menuDeLaReserva({ ficha: FICHAS[slug], paquete, subVariante, personas: 2 })
    if (!m) {
      console.log(`  ${slug} · ${paquete}: SIN MENU (el paso no se pintaria)`)
      fallos++
      continue
    }
    const platos = m.platos?.length ?? 0
    const problema = m.modo === 'eleccion' && platos === 0
    if (problema) fallos++
    console.log(
      `  ${slug.padEnd(22)} ${paquete.padEnd(8)} modo=${m.modo.padEnd(9)}` +
      ` platos=${String(platos).padStart(2)}  ${m.etiqueta}${problema ? '   <-- ELIGE PERO NO OFRECE NADA' : ''}`,
    )
  }
}
console.log(`\nfallos: ${fallos}`)
process.exit(fallos ? 1 : 0)
