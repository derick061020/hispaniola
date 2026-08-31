/** Baja el catálogo de Odoo y lo deja escrito como respaldo del front.
 *
 *  [2026-08-31] Derick: «no quiero lo actualices, quiero esté realmente
 *  conectado».
 *
 *  Y tiene razón. Lo que se ve en el sitio SÍ sale de Odoo desde el 2026-08-18
 *  (lib/api/fusion-catalogo.ts): precios, tramos, aforos, horarios y add-ons.
 *  Pero quedaba un segundo sitio con los mismos números escritos a mano —las
 *  tablas de `data/tours.ts`— que es lo que se pinta cuando el backend no
 *  contesta. Cada vez que alguien tocaba una tarifa en Odoo había que venir a
 *  copiarla aquí, y eso no es estar conectado: es estar sincronizado a mano
 *  hasta que a alguien se le olvide.
 *
 *  Este script cierra ese hueco: pregunta a Odoo y ESCRIBE el respaldo. Nadie
 *  vuelve a teclear un precio.
 *
 *      npm run sync:tarifas
 *
 *  Lo que genera (`src/data/catalogo-odoo.generado.ts`) NO se edita a mano —
 *  se regenera. Y no sustituye a `data/tours.ts`: ahí siguen las fotos, el copy,
 *  el itinerario y las cartas, que no existen en Odoo y no tienen por qué.
 */
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..')
const API = process.env.API || 'https://sistemashispaniola.com/api/web/v1'
const SALIDA = join(RAIZ, 'src/data/catalogo-odoo.generado.ts')

async function pide(ruta) {
  const r = await fetch(`${API}${ruta}`)
  if (!r.ok) throw new Error(`${ruta} -> HTTP ${r.status}`)
  const j = await r.json()
  if (j.ok === false) throw new Error(`${ruta} -> ${JSON.stringify(j.error)}`)
  return j.data ?? j
}

const catalogo = await pide('/catalog')
const lista = catalogo.tours ?? catalogo
const tours = []
for (const t of lista) {
  try {
    tours.push(await pide(`/tours/${t.slug}`))
    process.stdout.write(`  ${t.slug}\n`)
  } catch (e) {
    process.stdout.write(`  ${t.slug}: ${e.message} (se omite)\n`)
  }
}

if (!tours.length) {
  console.error('Odoo no devolvió ningún tour: no se toca el respaldo.')
  process.exit(1)
}

const cabecera = `// GENERADO POR scripts/sincroniza-tarifas.mjs — NO EDITAR A MANO.
//
// Es la foto del catálogo de Odoo que el front pinta cuando el backend no
// contesta. Para actualizarla: \`npm run sync:tarifas\`.
//
// Última sincronía: ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC
import type { Tour } from '@/lib/api/tipos'

export const CATALOGO_ODOO: Tour[] = ${JSON.stringify(tours, null, 2)}

/** El tour de la foto, por slug. \`null\` si no estaba cuando se sincronizó. */
export function respaldoDeOdoo(slug: string): Tour | null {
  return CATALOGO_ODOO.find((t) => t.slug === slug) ?? null
}
`
writeFileSync(SALIDA, cabecera)
console.log(`\n${tours.length} tours escritos en src/data/catalogo-odoo.generado.ts`)
