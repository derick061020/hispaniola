/** [2026-08-19] EL IDIOMA DE LA WEB (no el de los correos).
 *
 *  Ojo con la confusión, porque son dos cosas distintas y ambas se llaman
 *  «idioma»:
 *
 *  * `lib/idioma.ts` → en qué idioma le ESCRIBE ODOO al cliente (los doce
 *    correos). Se guarda en su ficha y viaja al backend.
 *  * esto → en qué idioma LEE la web quien está navegando ahora mismo. No sale
 *    del navegador.
 *
 *  Hasta hoy el selector del topbar era decoración: movía un thumb y no
 *  cambiaba una sola palabra (está escrito en su propio comentario, y en
 *  PLAN-LANZAMIENTO.md como pendiente). El sitio nació en español, se tradujo
 *  entero a inglés en la v3 y el español quedó congelado en el tag
 *  `v3-pre-en` justo para este momento: es de ahí de donde sale la mayor parte
 *  del diccionario, con el copy original que escribió el cliente, no una
 *  traducción inventada.
 *
 *  ── POR QUÉ EL DICCIONARIO SE INDEXA POR EL TEXTO EN INGLÉS ──────────────
 *  Lo normal en i18n es inventar claves (`home.hero.titulo`) y tener dos
 *  ficheros de mensajes. Aquí sería un error caro: hay 3.300 textos repartidos
 *  en 17 ficheros de datos y 128 componentes, y renombrarlos todos a claves
 *  significaría reescribir el sitio entero, romper cada `git blame` y dejar el
 *  código ilegible (`{t('home.hero.titulo')}` no dice qué pone en pantalla).
 *
 *  Se indexa por el inglés, que ya está escrito. Ventajas concretas:
 *
 *  * El código sigue leyéndose: `{t('Book direct')}` dice lo que dice.
 *  * **Nada se rompe si falta una traducción**: `t()` devuelve el inglés. Un
 *    texto sin traducir sale en inglés en medio del español —feo, pero la
 *    página funciona—; con claves saldría `home.hero.titulo` en pantalla.
 *  * Añadir copy nuevo en inglés no obliga a tocar el diccionario para que el
 *    sitio siga en pie.
 *
 *  El precio: dos textos ingleses idénticos en contextos distintos comparten
 *  traducción. En este sitio no ha dado ningún problema (se revisó entero); el
 *  día que lo dé, ese texto concreto se desambigua con `tc()`. */
import { ES } from './es'

export type IdiomaUI = 'en' | 'es'

const CLAVE = 'hispaniola.idioma'

/** Se lee en cada `t()`, así que vive fuera de React: hay cientos de llamadas
 *  por render y pasarlas todas por un contexto sería un hook por componente
 *  para leer un valor que cambia una vez cada varios minutos. Quien tiene que
 *  enterarse del cambio es el árbol entero, y de eso se encarga el proveedor
 *  (`proveedor.tsx`) remontándolo. */
let actual: IdiomaUI = 'en'
const oyentes = new Set<() => void>()

/** El inglés es el idioma del sitio; el español solo se propone a quien lo
 *  trae en el navegador. Una vez elige a mano, manda su elección: por eso se
 *  mira primero el almacenamiento. */
function inicial(): IdiomaUI {
  if (typeof window === 'undefined') return 'en'
  try {
    const guardado = window.localStorage.getItem(CLAVE)
    if (guardado === 'en' || guardado === 'es') return guardado
  } catch {
    // Safari en privado tira al leer localStorage. No es motivo para no pintar
    // la web: se cae al idioma del navegador.
  }
  const navegador = [...(navigator.languages ?? []), navigator.language].filter(Boolean)
  return navegador.some((c) => c.toLowerCase().startsWith('es')) ? 'es' : 'en'
}

actual = inicial()
if (typeof document !== 'undefined') document.documentElement.lang = actual

export function idiomaUI(): IdiomaUI {
  return actual
}

export function fijaIdiomaUI(idioma: IdiomaUI) {
  if (idioma === actual) return
  actual = idioma
  try {
    window.localStorage.setItem(CLAVE, idioma)
  } catch {
    // Sin persistencia se pierde la elección al recargar; el cambio de ahora
    // sí se aplica, que es lo que el visitante acaba de pedir.
  }
  // `lang` no es cosmética: de ella dependen el corrector del navegador, los
  // lectores de pantalla (pronuncian «Saona» distinto en EN y ES) y el guionado
  // de los textos largos.
  document.documentElement.lang = idioma
  oyentes.forEach((f) => f())
}

export function escuchaIdioma(f: () => void) {
  oyentes.add(f)
  return () => oyentes.delete(f)
}

/** Traduce un texto de la interfaz. Si no está en el diccionario devuelve el
 *  inglés tal cual — deliberadamente, ver la cabecera. */
export function t(texto: string): string {
  if (actual === 'en') return texto
  return ES[texto] ?? texto
}

/** Igual que `t()` pero rellenando huecos: `tp('{n} guests', { n: 4 })`.
 *  Existe porque hay copy con números dentro y partir la frase en trozos
 *  («guests» suelto) es la forma clásica de que una traducción quede
 *  imposible: en español el orden de las palabras no es el mismo. */
export function tp(plantilla: string, valores: Record<string, string | number>): string {
  return t(plantilla).replace(/\{(\w+)\}/g, (crudo, clave) =>
    clave in valores ? String(valores[clave]) : crudo,
  )
}

/** Un número con el separador de miles del idioma que se está leyendo.
 *
 *  No es cosmético: `1,782` en una página en español se lee como «uno coma
 *  setecientos ochenta y dos», que en un dato de confianza («1.782 reseñas»)
 *  es justo lo contrario de lo que se quiere transmitir. El sitio en español
 *  original usaba el punto (`1.782`, `91.607`) y el diccionario lo mantiene,
 *  así que aquí se usa `es-ES` y no `es-DO`, que formatea a la americana. */
export function numero(n: number, opciones?: Intl.NumberFormatOptions): string {
  return n.toLocaleString(actual === 'es' ? 'es-ES' : 'en-US', opciones)
}

// ── Los datos (data/*.ts) ────────────────────────────────────────────────
// Dos tercios del texto del sitio no están en los componentes: están en los 17
// ficheros de `data/`, en objetos anidados que se consumen desde más de cien
// sitios (`{HOME.hero.titulo}`, `TOURS.map(...)`, spreads, `fusionarLista`…).
//
// Envolver cada consumo en `t()` significaría tocar esos cien sitios y, peor,
// olvidarse de alguno para siempre. En vez de eso el fichero de datos se
// exporta envuelto: se traduce SOLA la cadena que alguien pide, en el momento
// en que la pide.
//
// En inglés el envoltorio no existe (se devuelve el objeto original, coste
// cero); solo en español se interpone el Proxy. Y los objetos ya envueltos se
// guardan en un WeakMap para que dos accesos al mismo sitio devuelvan el mismo
// objeto: si no, `TOURS[0] !== TOURS[0]` y cualquier `useMemo` o `key` que
// dependa de esa identidad se recalcularía en cada render.
const ENVUELTOS = new WeakMap<object, object>()

/** Marca interna del Proxy: `objeto[CRUDO]` devuelve el objeto original. */
const CRUDO = Symbol('crudo')

// Claves cuyo valor NO es texto de pantalla aunque sea una cadena: slugs que
// van en la URL, rutas de imagen, nombres de icono, colores. Traducirlas
// rompería enlaces. El diccionario tampoco las contiene, así que esto es un
// cinturón sobre el tirante — pero un slug traducido es un 404, y eso merece
// las dos cosas.
const NO_ES_TEXTO = new Set([
  'id', 'slug', 'href', 'src', 'to', 'url', 'ruta', 'ancla', 'key', 'tipo',
  'icono', 'icon', 'color', 'video', 'poster', 'imagen', 'foto', 'clase',
  'className', 'variante', 'formato', 'moneda', 'rot', 'posicion', 'pos',
])

function envuelve<T extends object>(datos: T): T {
  const guardado = ENVUELTOS.get(datos)
  if (guardado) return guardado as T

  const proxy = new Proxy(datos, {
    get(objetivo, propiedad, receptor) {
      if (propiedad === CRUDO) return objetivo
      const valor = Reflect.get(objetivo, propiedad, receptor)
      if (typeof valor === 'string') {
        if (actual === 'en') return valor
        return typeof propiedad === 'string' && NO_ES_TEXTO.has(propiedad) ? valor : t(valor)
      }
      if (valor && typeof valor === 'object') return envuelve(valor)
      return valor
    },
  })
  ENVUELTOS.set(datos, proxy)
  return proxy as T
}

/** Envuelve un bloque de `data/*.ts` para que su texto salga traducido.
 *
 *  Uso: `export const HOME = traducible(HOME_EN)`, con el objeto original
 *  intacto justo encima. El fichero se sigue leyendo igual y `git diff` contra
 *  el tag `v3-pre-en` sigue siendo limpio, que era la condición del plan 01.
 *
 *  ⚠️ El envoltorio se pone SIEMPRE, también en inglés, y es la decisión de
 *  `t()` —dentro del `get`— la que devuelve una cosa u otra. Tentador era
 *  ahorrarse el Proxy cuando el idioma es inglés, pero esto corre al IMPORTAR
 *  el fichero de datos, una sola vez y antes de que nadie toque el selector:
 *  quien entrara en inglés se quedaría con los datos crudos para siempre y
 *  cambiar a español no haría nada. */
export function traducible<T>(datos: T): T {
  if (!datos || typeof datos !== 'object') return datos
  return envuelve(datos as object) as T
}

/** El objeto SIN traducir, tal como está escrito en `data/*.ts`.
 *
 *  ── CUÁNDO HACE FALTA ────────────────────────────────────────────────────
 *  Cuando el texto deja de ser texto y pasa a ser un DATO que viaja: el plato
 *  que elige cada pasajero se guarda en Odoo y se manda en el correo del
 *  menú, donde `mail_sender.py` lo empareja con su foto por el nombre. Si
 *  quien reserva está leyendo la web en español, `plato.nombre` vale
 *  «Marisco» y en Odoo quedaría escrito eso: la tripulación vería un plato
 *  distinto del catálogo y el correo saldría sin foto.
 *
 *  Regla: lo que se PINTA sale del objeto traducido; lo que se GUARDA o se
 *  ENVÍA sale de `crudo()`. Es la misma frontera que ya separa el slug del
 *  nombre del tour. */
export function crudo<T>(datos: T): T {
  if (!datos || typeof datos !== 'object') return datos
  const objetivo = (datos as Record<symbol, unknown>)[CRUDO]
  if (objetivo) return objetivo as T

  // No es un envoltorio, pero puede LLEVAR envoltorios dentro: la reserva que
  // se guarda en el navegador es un objeto plano armado a mano cuyo `ficha`
  // apunta a los menús del catálogo, que sí están envueltos. Sin esta rama,
  // `JSON.stringify` los recorrería como cualquier otro objeto y escribiría
  // los platos traducidos.
  //
  // Solo se clona si algo cambia: así, para la inmensa mayoría de las llamadas
  // —que no llevan nada envuelto— se devuelve el mismo objeto y no se rompe
  // ninguna comparación por identidad.
  if (Array.isArray(datos)) {
    const limpio = datos.map((v) => crudo(v))
    return (limpio.some((v, i) => v !== datos[i]) ? limpio : datos) as T
  }
  if (Object.getPrototypeOf(datos) !== Object.prototype) return datos
  let cambio = false
  const limpio: Record<string, unknown> = {}
  for (const [clave, valor] of Object.entries(datos)) {
    const v = crudo(valor)
    if (v !== valor) cambio = true
    limpio[clave] = v
  }
  return (cambio ? limpio : datos) as T
}
