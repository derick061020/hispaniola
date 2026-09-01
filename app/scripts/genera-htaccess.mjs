/** Genera `dist/.htaccess` (a partir de `vercel.json`) y `dist/404.html`. Se
 *  ejecuta solo, como `postbuild`, en cada `npm run build`.
 *
 *  [2026-08-18] Existe porque el sitio se sirve en DOS sitios: Vercel, que lee
 *  `vercel.json`, y un hosting compartido (hispaniola.botizate.com), que no lo
 *  lee y necesita un `.htaccess`. La primera version se escribio a mano y el
 *  siguiente `npm run build` la borro: `/my-booking` —el enlace de todos los
 *  correos de Odoo— volvio a dar 404 sin que nadie lo tocara. Generarlo aqui
 *  es lo que garantiza que las dos configuraciones no se separen nunca: si se
 *  añade un redirect en `vercel.json`, aparece solo en el `.htaccess`.
 */
import { copyFileSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..')
const vercel = JSON.parse(readFileSync(join(raiz, 'vercel.json'), 'utf8'))

const lineas = [
  '# GENERADO por scripts/genera-htaccess.mjs a partir de vercel.json.',
  '# No editar a mano: el siguiente `npm run build` lo sobrescribe.',
  '',
  'Options -MultiViews',
  'RewriteEngine On',
  '',
  `# --- ${vercel.redirects.length} redirecciones de las URLs viejas en espanol ---`,
]

for (const r of vercel.redirects) {
  // El punto se escapa: sin esto, `/index.php` seria una regex donde el punto
  // vale por cualquier caracter. Da igual en la practica, pero una regla de
  // redireccion que dice algo distinto de lo que parece es una trampa futura.
  const origen = r.source.replace(/^\//, '').replace(/\./g, '\\.')
  const codigo = r.permanent === false ? 302 : 301
  // QSD (Query String Discard) tira la query de origen. Hace falta para las
  // URLs del sitio viejo: eran `/index.php?lang=en&hotel_id=100&tour=...` —
  // miles de combinaciones de hotel y palabra clave sobre seis paginas reales—
  // y arrastrar esos parametros a la web nueva no sirve de nada: no los lee
  // nadie y ensucian la analitica. La ruta limpia es la que hereda el SEO.
  const flags = r.source.includes('.php') ? `R=${codigo},L,QSD` : `R=${codigo},L`
  lineas.push(`RewriteRule "^${origen}/?$" "${r.destination}" [${flags}]`)
}

lineas.push(
  '',
  '# --- SPA: toda ruta que no sea un fichero real la pinta React ---',
  'RewriteCond %{REQUEST_FILENAME} !-f',
  'RewriteCond %{REQUEST_FILENAME} !-d',
  'RewriteRule "^" "/index.html" [L]',
  '',
  '# --- Cache ---',
  '# Los ficheros de /assets llevan hash en el nombre: cachearlos un ano es',
  '# seguro, y es lo que hace Vercel. index.html NUNCA se cachea, o el',
  '# navegador seguiria pidiendo el JS viejo despues de cada despliegue.',
  '<IfModule mod_expires.c>',
  '  ExpiresActive On',
  '  <FilesMatch "\\.(js|css|woff2?|jpg|jpeg|png|webp|svg|mp4)$">',
  '    ExpiresDefault "access plus 1 year"',
  '  </FilesMatch>',
  '</IfModule>',
  '<FilesMatch "^index\\.html$">',
  '  <IfModule mod_headers.c>',
  '    Header set Cache-Control "no-cache, must-revalidate"',
  '  </IfModule>',
  '</FilesMatch>',
  '',
  'ErrorDocument 404 /index.html',
  '',
)

writeFileSync(join(raiz, 'dist', '.htaccess'), lineas.join('\n'))

// [2026-08-19] 404.html sale de aqui por la MISMA razon que el .htaccess: es
// un fichero que solo existe en el hosting compartido, no lo genera Vite, y
// vivia en la rama `build` copiado a mano. Un `rsync --delete` lo borraba y el
// 404 del host se quedaba sin pagina — que es exactamente el susto que ya dio
// el .htaccess. Es una copia literal del index (la SPA resuelve la ruta en el
// navegador), asi que tiene que regenerarse en CADA build o serviria el JS
// viejo a quien caiga en una URL inexistente.
copyFileSync(join(raiz, 'dist', 'index.html'), join(raiz, 'dist', '404.html'))

console.log(`.htaccess + 404.html generados: ${vercel.redirects.length} redirecciones + SPA + cache`)
