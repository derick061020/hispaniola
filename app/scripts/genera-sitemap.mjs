/** Escribe `public/sitemap.xml` a partir de las rutas y los datos reales.
 *
 *  [2026-09-01] Derick: «actualiza el sitemap, y arregla el seo para que sea
 *  limpio».
 *
 *  Estaba mantenido a mano —lo decia su propia cabecera— y ya habia derivado:
 *
 *    · Listaba las cuatro paginas legales, que son `noindex`. Un sitemap que
 *      anuncia URLs marcadas «no me indexes» es una contradiccion que Google
 *      reporta como error en Search Console.
 *    · No listaba los articulos del blog, que si son indexables y son
 *      justamente el contenido que atrae busquedas.
 *    · No traia `lastmod`, asi que ningun rastreador sabia que habia cambiado.
 *
 *  Ahora se genera: las rutas salen de esta lista y los detalles (tours,
 *  eventos, articulos) de los mismos datos que pinta la web. Añadir un tour o
 *  un articulo lo mete en el sitemap solo.
 *
 *  Corre dentro de `npm run build` (postbuild), antes del .htaccess.
 */
import { writeFileSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { build } from 'rolldown'

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = join(RAIZ, 'src')
const DOMINIO = 'https://hispaniolaaquaticadventures.com'

async function datos(fichero, nombres) {
  await build({
    input: join(SRC, 'data', fichero),
    resolve: { alias: { '@': SRC } },
    output: { file: `/tmp/sitemap-${fichero}.mjs`, format: 'esm' },
    logLevel: 'silent',
  })
  const mod = await import(`/tmp/sitemap-${fichero}.mjs?t=${Date.now()}`)
  return nombres.map((n) => mod[n])
}

// Rutas fijas indexables. NO estan aqui, a proposito:
//   · /book/*, /my-booking, /account y las de gracias — transaccionales, van
//     `indexable={false}` en su propio <Meta>.
//   · /legal/* — tambien `noindex`: son documentos de servicio, no contenido
//     que deba competir en buscadores.
//   · /fundaciones — `Disallow` en robots.txt.
//   · Los alias en espanol (/nosotros, /sostenibilidad, /reserva-directa…) —
//     son 301 hacia su ruta en ingles, y un sitemap no debe listar URLs que
//     redirigen.
const FIJAS = [
  ['/', 1.0, 'weekly'],
  ['/competitive-advantage', 0.8, 'monthly'],
  ['/foundation', 0.6, 'monthly'],
  ['/crew', 0.6, 'monthly'],
  ['/facilities', 0.6, 'monthly'],
  ['/fleet', 0.7, 'monthly'],
  ['/faq', 0.6, 'monthly'],
  ['/guides', 0.7, 'weekly'],
  ['/blog', 0.7, 'weekly'],
  ['/contact', 0.6, 'monthly'],
  ['/travel-agents', 0.5, 'monthly'],
  ['/careers', 0.4, 'monthly'],
  ['/marine-park', 0.6, 'monthly'],
]

const [TOURS] = await datos('home.ts', ['TOURS'])
// `EVENTOS` es un mapa por slug; `EVENTOS_ORDEN` es la lista, que es lo que
// se necesita aqui y ademas respeta el orden con que se publican.
const [EVENTOS] = await datos('eventos.ts', ['EVENTOS_ORDEN'])
const [ARTICULOS] = await datos('blog.ts', ['ARTICULOS'])

const urls = [
  ...FIJAS.map(([ruta, prioridad, frecuencia]) => ({ ruta, prioridad, frecuencia })),
  ...TOURS.map((t) => ({ ruta: `/tours/${t.slug}`, prioridad: 0.9, frecuencia: 'weekly' })),
  ...EVENTOS.map((e) => ({ ruta: `/events/${e.slug}`, prioridad: 0.8, frecuencia: 'monthly' })),
  ...ARTICULOS.map((a) => ({ ruta: `/blog/${a.slug}`, prioridad: 0.6, frecuencia: 'monthly' })),
]

// Una URL repetida en el sitemap es ruido; se avisa en vez de colarla.
const vistas = new Set()
for (const u of urls) {
  if (vistas.has(u.ruta)) {
    console.error(`sitemap: la ruta ${u.ruta} sale dos veces`)
    process.exit(1)
  }
  vistas.add(u.ruta)
}

const hoy = new Date().toISOString().slice(0, 10)
const cuerpo = urls
  .map(
    (u) => `  <url>
    <loc>${DOMINIO}${u.ruta}</loc>
    <lastmod>${hoy}</lastmod>
    <changefreq>${u.frecuencia}</changefreq>
    <priority>${u.prioridad.toFixed(1)}</priority>
  </url>`,
  )
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!--
  GENERADO por scripts/genera-sitemap.mjs — NO EDITAR A MANO.
  Se rehace en cada \`npm run build\` desde las rutas y los datos reales.
  Lo que NO entra y por que, en la cabecera de ese script.
-->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${cuerpo}
</urlset>
`

writeFileSync(join(RAIZ, 'public', 'sitemap.xml'), xml)
// El build ya copio `public/` a `dist/`, asi que hay que dejarlo tambien alli.
try {
  writeFileSync(join(RAIZ, 'dist', 'sitemap.xml'), xml)
} catch {
  /* sin dist (ejecucion suelta): basta con public */
}

console.log(
  `sitemap.xml: ${urls.length} URLs ` +
    `(${FIJAS.length} fijas + ${TOURS.length} tours + ${EVENTOS.length} eventos + ${ARTICULOS.length} articulos)`,
)
