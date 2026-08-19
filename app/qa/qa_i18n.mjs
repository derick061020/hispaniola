// QA de traducción — ¿queda texto de la web que el diccionario no sepa decir
// en español?
//
// El i18n de este sitio (src/lib/i18n) no puede fallar en tiempo de
// compilación: si a `t('Book now')` le falta la entrada, devuelve el inglés y
// la página se pinta igual. Eso es deliberado —una web a medio traducir se
// sigue usando— pero significa que un texto sin traducir NO se nota hasta que
// alguien lo ve en pantalla. Este script es el que lo nota.
//
// Recorre `src/` con el AST (no con grep: hay que distinguir el texto visible
// de un className) y saca dos listas:
//
//   · FALTAN  — cadenas que la web puede pedir y no están en `es.ts`. Salen en
//     inglés dentro de la página en español.
//   · SOBRAN  — entradas del diccionario que ya nadie pide. Copy que cambió y
//     dejó su traducción huérfana; no rompen nada, pero engordan el bundle.
//
// ⚠️ Como el resto de scripts de `qa/`, SIEMPRE termina con éxito: hay que
// LEER la salida (ver CLAUDE.md, «trampas que cuestan tiempo»).
//
// Uso: npm run qa:i18n [--sobran]
import ts from 'typescript'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..', 'src')

// No son UI del sitio: el Dev Mode y la página de tokens son herramientas
// internas, y `alignui/` es vendor.
const FUERA = /^dev\/|^components\/alignui\/|^lib\/alignui\/|^lib\/i18n\/|^pages\/fundaciones/

// Claves cuyo valor es maquinaria, no texto (misma lista que el Proxy de
// nucleo.ts: si cambia una, cambia la otra).
const NO_ES_TEXTO = new Set(['id','slug','href','src','to','url','ruta','ancla','key','tipo','icono','icon','color','video','poster','imagen','foto','clase','className','variante','formato','moneda','rot','posicion','pos'])

// ── LO QUE NO ES COPY ────────────────────────────────────────────────────
// Cadenas que el recorrido encuentra pero que NO se traducen nunca, revisadas
// una a una. Sin esta lista el informe salía con ~110 «faltan» permanentes, y
// una alerta que siempre pita es una alerta que nadie lee: lo que interesa es
// que este script diga CERO cuando todo está traducido.
//
// Cuatro familias:
//   · Nombres propios — los barcos (Maite, GrandMa, Karaya), las personas de
//     las reseñas y del equipo, la fundación y la propia empresa.
//   · Marcas y plataformas — Visa, PayPal, TripAdvisor, Instagram…
//   · Códigos — divisas (USD, EUR, DOP), siglas técnicas (AIS), correos.
//   · Claves internas que viajan como texto — ids de foto y de variante
//     (`grande`, `maite`, `premium`, `verificado`); traducirlas rompería la
//     búsqueda que las usa.
const NO_ES_COPY = new Set([
  "AIS",
  "AMEX",
  "Ana Belén Rodríguez",
  "Ana P.",
  "Andrés M.",
  "Brian K.",
  "Camille D.",
  "Carlos R.",
  "Carlos Reyes",
  "DOP",
  "Daniel & Erin",
  "Diego Castillo",
  "EUR",
  "Elena F.",
  "Emily & friends",
  "English",
  "Español",
  "Eva",
  "FS",
  "Facebook",
  "Fernando Sánchez Fernández",
  "Forever Teresa",
  "Forever Teresa · 3h",
  "Forever Teresa · 4h",
  "Google",
  "GrandMa",
  "Gustavo P.",
  "HAA",
  "HSP-XXXX-NNNN",
  "#HispaniolaMoments",
  "proveedor",
  "Hispaniola Aquatic Adventures",
  "Hispaniola Aquatic Adventures.",
  "Instagram",
  "Javier Ortiz",
  "Javier S.",
  "Jessica M.",
  "Joker",
  "Karaya",
  "Karaya Punta Cana by Hispaniola",
  "Laura G.",
  "Lives in the clickable prototype (prototipo/), not part of this build",
  "Lola",
  "Luisa Fernández",
  "MR",
  "Maite",
  "Manuel Alejandro Redondo",
  "Marisol & Pedro",
  "Marta V.",
  "María Gómez",
  "Mastercard",
  "Michelle T.",
  "Nicole R.",
  "Omar",
  "Patricia N.",
  "PayPal",
  "Pedro Martín",
  "Rosanna C.",
  "Santa Maria",
  "Santa María",
  "Sarah W.",
  "Snorkel Lovers",
  "Sofía Herrera",
  "Sophie L.",
  "TikTok",
  "Tomás Aguilar",
  "TripAdvisor",
  "US$ —",
  "USD",
  "Valentina Ríos",
  "Viator",
  "Visa",
  "WhatsApp +1 829 305 2804",
  "WhatsApp +1-829-305-2804 →",
  "YouTube",
  "actividad",
  "aire",
  "always",
  "ancho",
  "audiencia",
  "canal",
  "charter",
  "completo",
  "eva",
  "evento",
  "grande",
  "grupo",
  "idiomas",
  "info@catamarantourspuntacana.com",
  "instagram",
  "langosta",
  "lola",
  "macizo",
  "maite",
  "mastercard",
  "omar",
  "paypal",
  "perfil",
  "persona",
  "plataforma",
  "premium",
  "tiktok",
  "verificado",
  "visa",
  "web",
  "you@email.com",
])

const esSlug = (s) => /^[a-z0-9]+(-[a-z0-9]+)+$/.test(s)
const esHora = (s) => /^[~\d:\s.APM/-]+$/.test(s) && /\d/.test(s)
const traducible = (s) => /[a-zA-Z]{2}/.test(s) && !/^https?:|^\//.test(s) && !esSlug(s) && !esHora(s)

function ficheros(dir, out = []) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n)
    if (statSync(p).isDirectory()) ficheros(p, out)
    else if (/\.tsx?$/.test(p)) out.push(p)
  }
  return out
}

const pedidas = new Map()
const crudos = []
for (const f of ficheros(RAIZ)) {
  const rel = relative(RAIZ, f)
  if (FUERA.test(rel)) continue
  const codigo = readFileSync(f, 'utf8')
  const src = ts.createSourceFile(f, codigo, ts.ScriptTarget.Latest, true, f.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS)
  const esDatos = rel.startsWith('data/')
  const apunta = (txt) => {
    if (!traducible(txt)) return
    if (!pedidas.has(txt)) pedidas.set(txt, rel)
  }
  // Un bloque envuelto en traducible() pide TODAS sus cadenas al diccionario,
  // esté donde esté el fichero: `data/*.ts` es el caso normal, pero también
  // los nombres de mes y de día de `lib/fechas.ts`.
  const dentroDeTraducible = (n) => {
    if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) {
      const padre = n.parent
      const clave = ts.isPropertyAssignment(padre) ? padre.name.getText(src).replace(/['"]/g, '') : ''
      if (!NO_ES_TEXTO.has(clave)) apunta(n.text)
    }
    ts.forEachChild(n, dentroDeTraducible)
  }

  const visita = (n) => {
    if (ts.isCallExpression(n) && ts.isIdentifier(n.expression) && ['t', 'tp'].includes(n.expression.text)) {
      // El argumento puede ser un ternario —`tp(n === 1 ? '…guest' : '…guests')`,
      // que es como se resuelve el plural—, así que se miran TODAS las cadenas
      // que hay dentro, no solo el literal pelado.
      const cadenas = (nodo) => {
        if (ts.isStringLiteral(nodo) || ts.isNoSubstitutionTemplateLiteral(nodo)) apunta(nodo.text)
        ts.forEachChild(nodo, cadenas)
      }
      if (n.arguments[0]) cadenas(n.arguments[0])
    }
    if (!esDatos && ts.isCallExpression(n) && ts.isIdentifier(n.expression) && n.expression.text === 'traducible') {
      for (const a of n.arguments) dentroDeTraducible(a)
    }
    if (esDatos) {
      // Constantes de módulo con texto (`const PLACEHOLDER = '…'`): no son
      // propiedades de ningún objeto, pero acaban DENTRO de un bloque envuelto
      // en traducible(), así que el diccionario sí las recibe.
      if (
        ts.isVariableDeclaration(n) &&
        n.initializer &&
        (ts.isStringLiteral(n.initializer) || ts.isNoSubstitutionTemplateLiteral(n.initializer))
      ) {
        apunta(n.initializer.text)
      }
      if (ts.isPropertyAssignment(n)) {
        const clave = n.name.getText(src).replace(/['"]/g, '')
        const v = n.initializer
        if ((ts.isStringLiteral(v) || ts.isNoSubstitutionTemplateLiteral(v)) && !NO_ES_TEXTO.has(clave)) apunta(v.text)
      } else if (ts.isArrayLiteralExpression(n)) {
        for (const el of n.elements) if (ts.isStringLiteral(el) || ts.isNoSubstitutionTemplateLiteral(el)) apunta(el.text)
      }
    }
    ts.forEachChild(n, visita)
  }
  visita(src)

  // Texto suelto en el JSX que el codemod no pudo envolver (plantillas con
  // expresiones dentro). Se avisa aparte: no es que falte traducción, es que
  // ese texto NO PASA por el diccionario.
  if (f.endsWith('.tsx')) {
    const sueltos = (n) => {
      if (ts.isJsxText(n)) {
        const txt = n.text.trim().replace(/\s+/g, ' ')
        if (txt && /[a-zA-Z]{2}/.test(txt)) crudos.push(`${rel}: ${txt.slice(0, 60)}`)
      }
      ts.forEachChild(n, sueltos)
    }
    sueltos(src)
  }
}

// `es.ts` es TypeScript y esto corre en Node pelado, así que se lee como texto.
// El fichero lo genera un script y su cuerpo es JSON válido salvo por la coma
// final, que es la que se quita aquí.
const bruto = readFileSync(join(RAIZ, 'lib/i18n/es.ts'), 'utf8')
const ES = JSON.parse(
  bruto.slice(bruto.indexOf('{'), bruto.lastIndexOf('}') + 1).replace(/,(\s*})/g, '$1'),
)

const faltan = [...pedidas].filter(([txt]) => !(txt in ES) && !NO_ES_COPY.has(txt))
const sobran = Object.keys(ES).filter((k) => !pedidas.has(k))

console.log(`cadenas que la web puede pedir: ${pedidas.size}`)
console.log(`entradas en el diccionario:      ${Object.keys(ES).length}`)
console.log(`\nFALTAN (saldrán en inglés): ${faltan.length}`)
for (const [txt, donde] of faltan.slice(0, process.argv.includes("--todo") ? 999 : 60)) console.log(`  [${donde}] ${txt.slice(0, 90)}`)
if (faltan.length > 60 && !process.argv.includes("--todo")) console.log(`  … y ${faltan.length - 60} más`)

console.log(`\nSOBRAN (traducción huérfana): ${sobran.length}`)
if (process.argv.includes('--sobran')) for (const k of sobran) console.log('  ' + k.slice(0, 90))

// Texto que vive en el JSX sin pasar por t(): no es que le falte traducción,
// es que NO SE PUEDE traducir hasta que alguien lo envuelva.
const sinEnvolver = [...new Set(crudos)]
console.log(`\nSIN ENVOLVER EN t() (saldrán siempre en inglés): ${sinEnvolver.length}`)
for (const c of sinEnvolver.slice(0, 40)) console.log('  ' + c)
if (sinEnvolver.length > 40) console.log(`  … y ${sinEnvolver.length - 40} más`)
