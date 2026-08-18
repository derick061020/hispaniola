/** [2026-08-18] EN QUÉ IDIOMA LE ESCRIBE ODOO AL CLIENTE.
 *
 *  El sitio es monolingüe en inglés — eso no cambia aquí—, pero los once
 *  correos de la reserva (confirmación, menú, recogida, cancelación…) existen
 *  en español y en inglés, y Odoo elige según el idioma guardado en la ficha
 *  del cliente.
 *
 *  Hasta hoy el front mandaba `language: "en"`, que era el `lang` del <html>,
 *  fijo. Así que TODOS los clientes quedaban como ingleses y las plantillas en
 *  español no se usaban jamás — en Punta Cana, donde media clientela habla
 *  español. Esto es lo que arregla eso: se propone el idioma del navegador y
 *  el cliente puede cambiarlo en el paso de contacto.
 *
 *  Los ids son los que entiende Odoo (`haa.client.language`), no códigos ISO:
 *  el backend normaliza `es-DO` igualmente, pero mandar el valor bueno de
 *  origen evita depender de esa red. */
export const IDIOMAS = [
  { id: 'english', etiqueta: 'English' },
  { id: 'spanish', etiqueta: 'Español' },
  { id: 'french', etiqueta: 'Français' },
  { id: 'german', etiqueta: 'Deutsch' },
  { id: 'portuguese', etiqueta: 'Português' },
  { id: 'italian', etiqueta: 'Italiano' },
  { id: 'russian', etiqueta: 'Русский' },
] as const

export type IdiomaCliente = (typeof IDIOMAS)[number]['id']

const POR_CODIGO: Record<string, IdiomaCliente> = {
  en: 'english',
  es: 'spanish',
  fr: 'french',
  de: 'german',
  pt: 'portuguese',
  it: 'italian',
  ru: 'russian',
}

/** El idioma que trae el navegador, mapeado a lo que entiende Odoo.
 *  `es-DO`, `es-419` y `es` son todos español. Lo que no se reconozca cae en
 *  inglés, que es el idioma del sitio. */
export function idiomaDelNavegador(): IdiomaCliente {
  if (typeof navigator === 'undefined') return 'english'
  const candidatos = [...(navigator.languages ?? []), navigator.language].filter(Boolean)
  for (const codigo of candidatos) {
    const base = codigo.toLowerCase().split('-')[0]
    if (POR_CODIGO[base]) return POR_CODIGO[base]
  }
  return 'english'
}

export function etiquetaIdioma(id: IdiomaCliente): string {
  return IDIOMAS.find((i) => i.id === id)?.etiqueta ?? id
}
