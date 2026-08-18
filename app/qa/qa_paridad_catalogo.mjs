// QA: compara, tour por tour, lo que dice Odoo con lo que dice data/tours.ts.
//
// Desde el 2026-08-18 la ficha pinta los numeros de Odoo (ver
// `lib/api/fusion-catalogo.ts`), asi que una diferencia aqui NO es un bug de
// la web: es que el dato estatico se ha quedado viejo. Sirve para dos cosas —
// avisar de esa deriva, y comprobar que el catalogo sembrado en Odoo sigue
// cuadrando con el tarifario aprobado.
//
//   node qa/qa_paridad_catalogo.mjs
import { build } from 'rolldown'

const API = 'https://sistemashispaniola.com/api/web/v1'
const raiz = '/home/kira/Escritorio/projects/eclipse/hispaniola/app/src'

// Rolldown es el bundler que ya usa Vite en este proyecto: se reutiliza para
// leer el TypeScript de `data/tours.ts` sin depender de nada nuevo.
const paquete = await build({
  input: `${raiz}/data/tours.ts`,
  resolve: { alias: { '@': raiz } },
  output: { file: '/tmp/tours-bundle.mjs', format: 'esm' },
  logLevel: 'silent',
})
const { FICHAS } = await import(`/tmp/tours-bundle.mjs?t=${Date.now()}`)

const slugs = ['saona-island', 'private-charter', 'snorkel-lovers', 'semi-private-premium']
let dif = 0
for (const slug of slugs) {
  const r = await fetch(`${API}/tours/${slug}`)
  const odoo = (await r.json()).data
  const ficha = FICHAS[slug]
  if (!ficha) { console.log(`${slug}: sin ficha estatica`); continue }

  const lineas = []
  // upgrade de menu
  if ((odoo.premium_upgrade ?? null) !== (ficha.upgradePremium ?? null))
    lineas.push(`  upgrade premium: front ${ficha.upgradePremium} vs odoo ${odoo.premium_upgrade}`)
  // horarios
  const hOdoo = odoo.schedules.map((h) => `${h.departure}→${h.back}`).join(' | ')
  const hFront = (ficha.horarios ?? []).map((h) => `${h.hora}→${h.regreso}`).join(' | ')
  if (hOdoo && hFront && hOdoo !== hFront) lineas.push(`  horarios: front [${hFront}] vs odoo [${hOdoo}]`)
  // add-ons
  for (const a of odoo.addons) {
    const e = (ficha.addOns ?? []).find((x) => x.id === a.slug)
    if (!e) { lineas.push(`  add-on ${a.slug} solo en odoo`); continue }
    if (e.precio !== a.price) lineas.push(`  add-on ${a.slug}: front ${e.precio} vs odoo ${a.price}`)
  }
  // variantes y tramos
  for (const v of odoo.variants) {
    const e = (ficha.subVariantes ?? []).find((x) => x.id === v.slug)
    if (!e) { lineas.push(`  barco ${v.slug} solo en odoo`); continue }
    const tOdoo = v.tiers.map((t) => `${t.from}-${t.to ?? '+'}:${t.price}${t.kind[0]}`).join(' ')
    const tFront = (e.tabla ?? []).map((t) => `${t.desde}-${t.hasta ?? '+'}:${t.precio}${t.tipo === 'grupo' ? 'g' : 'p'}`).join(' ')
    if (tOdoo !== tFront) lineas.push(`  tramos ${v.slug}:\n     front ${tFront}\n     odoo  ${tOdoo}`)
    if (v.capacity_label && e.capacidad && v.capacity_label !== e.capacidad)
      lineas.push(`  aforo ${v.slug}: front "${e.capacidad}" vs odoo "${v.capacity_label}"`)
  }
  for (const e of ficha.subVariantes ?? [])
    if (!odoo.variants.find((v) => v.slug === e.id)) lineas.push(`  barco ${e.id} solo en el front (se perderia)`)

  console.log(`${slug}: ${lineas.length ? 'DIFERENCIAS' : 'coincide'}`)
  lineas.forEach((l) => console.log(l))
  dif += lineas.length
}
console.log(`\ntotal de diferencias: ${dif}`)
