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
  const origen = r.source.replace(/^\//, '')
  const codigo = r.permanent === false ? 302 : 301
  lineas.push(`RewriteRule "^${origen}/?$" "${r.destination}" [R=${codigo},L]`)
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
