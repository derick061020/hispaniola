// [2026-08-25, pedido de Samuel] PREFIJO DE PAÍS DEL TELÉFONO.
//
// El campo era un `<input type="tel">` con `+1 809 000 0000` de placeholder, y
// medio mundo escribía su número local sin prefijo: un «612 345 678» español o
// un «07700 900123» británico no se pueden marcar desde República Dominicana,
// así que el aviso de última hora («el tiempo nos obliga a mover el tour») no
// llegaba. Con el prefijo separado, el número siempre sale marcable.
//
// La lista no pretende ser el ITU entero: son los países de donde llegan los
// huéspedes (RD y Norteamérica primero, luego Europa y Latinoamérica). Quien
// venga de un país que no esté puede pegar su número ya en internacional
// («+353 …») y `componTelefono` lo respeta tal cual en vez de anteponerle otro
// prefijo — esa es la salida de emergencia, no hace falta una opción «Other».

export type Prefijo = {
  /** ISO 3166-1 alfa-2. Solo para tener claves estables (+1 lo comparten
   *  varios países, así que el código de marcado no sirve de clave). */
  id: string
  pais: string
  codigo: string
  bandera: string
}

/** Orden deliberado: primero de donde viene la mayoría de las reservas, luego
 *  el resto por continente. No es alfabético a propósito — un desplegable
 *  alfabético obliga a bajar hasta la U para el mercado principal. */
export const PREFIJOS: Prefijo[] = [
  { id: 'US', pais: 'United States', codigo: '+1', bandera: '🇺🇸' },
  { id: 'CA', pais: 'Canada', codigo: '+1', bandera: '🇨🇦' },
  { id: 'DO', pais: 'Dominican Republic', codigo: '+1', bandera: '🇩🇴' },
  { id: 'ES', pais: 'Spain', codigo: '+34', bandera: '🇪🇸' },
  { id: 'GB', pais: 'United Kingdom', codigo: '+44', bandera: '🇬🇧' },
  { id: 'FR', pais: 'France', codigo: '+33', bandera: '🇫🇷' },
  { id: 'DE', pais: 'Germany', codigo: '+49', bandera: '🇩🇪' },
  { id: 'IT', pais: 'Italy', codigo: '+39', bandera: '🇮🇹' },
  { id: 'PT', pais: 'Portugal', codigo: '+351', bandera: '🇵🇹' },
  { id: 'NL', pais: 'Netherlands', codigo: '+31', bandera: '🇳🇱' },
  { id: 'BE', pais: 'Belgium', codigo: '+32', bandera: '🇧🇪' },
  { id: 'CH', pais: 'Switzerland', codigo: '+41', bandera: '🇨🇭' },
  { id: 'AT', pais: 'Austria', codigo: '+43', bandera: '🇦🇹' },
  { id: 'IE', pais: 'Ireland', codigo: '+353', bandera: '🇮🇪' },
  { id: 'PL', pais: 'Poland', codigo: '+48', bandera: '🇵🇱' },
  { id: 'SE', pais: 'Sweden', codigo: '+46', bandera: '🇸🇪' },
  { id: 'NO', pais: 'Norway', codigo: '+47', bandera: '🇳🇴' },
  { id: 'DK', pais: 'Denmark', codigo: '+45', bandera: '🇩🇰' },
  { id: 'FI', pais: 'Finland', codigo: '+358', bandera: '🇫🇮' },
  { id: 'CZ', pais: 'Czechia', codigo: '+420', bandera: '🇨🇿' },
  { id: 'RU', pais: 'Russia', codigo: '+7', bandera: '🇷🇺' },
  { id: 'UA', pais: 'Ukraine', codigo: '+380', bandera: '🇺🇦' },
  { id: 'RO', pais: 'Romania', codigo: '+40', bandera: '🇷🇴' },
  { id: 'MX', pais: 'Mexico', codigo: '+52', bandera: '🇲🇽' },
  { id: 'AR', pais: 'Argentina', codigo: '+54', bandera: '🇦🇷' },
  { id: 'BR', pais: 'Brazil', codigo: '+55', bandera: '🇧🇷' },
  { id: 'CL', pais: 'Chile', codigo: '+56', bandera: '🇨🇱' },
  { id: 'CO', pais: 'Colombia', codigo: '+57', bandera: '🇨🇴' },
  { id: 'PE', pais: 'Peru', codigo: '+51', bandera: '🇵🇪' },
  { id: 'VE', pais: 'Venezuela', codigo: '+58', bandera: '🇻🇪' },
  { id: 'EC', pais: 'Ecuador', codigo: '+593', bandera: '🇪🇨' },
  { id: 'UY', pais: 'Uruguay', codigo: '+598', bandera: '🇺🇾' },
  { id: 'PA', pais: 'Panama', codigo: '+507', bandera: '🇵🇦' },
  { id: 'CR', pais: 'Costa Rica', codigo: '+506', bandera: '🇨🇷' },
  { id: 'GT', pais: 'Guatemala', codigo: '+502', bandera: '🇬🇹' },
  { id: 'PR', pais: 'Puerto Rico', codigo: '+1', bandera: '🇵🇷' },
  { id: 'HT', pais: 'Haiti', codigo: '+509', bandera: '🇭🇹' },
  { id: 'IL', pais: 'Israel', codigo: '+972', bandera: '🇮🇱' },
  { id: 'AE', pais: 'United Arab Emirates', codigo: '+971', bandera: '🇦🇪' },
  { id: 'IN', pais: 'India', codigo: '+91', bandera: '🇮🇳' },
  { id: 'CN', pais: 'China', codigo: '+86', bandera: '🇨🇳' },
  { id: 'JP', pais: 'Japan', codigo: '+81', bandera: '🇯🇵' },
  { id: 'KR', pais: 'South Korea', codigo: '+82', bandera: '🇰🇷' },
  { id: 'AU', pais: 'Australia', codigo: '+61', bandera: '🇦🇺' },
  { id: 'NZ', pais: 'New Zealand', codigo: '+64', bandera: '🇳🇿' },
  { id: 'ZA', pais: 'South Africa', codigo: '+27', bandera: '🇿🇦' },
]

/** El mercado principal. Quien llegue de otro sitio lo cambia en un clic. */
export const PREFIJO_POR_DEFECTO = 'US'

export function prefijoPorId(id: string): Prefijo | undefined {
  return PREFIJOS.find((p) => p.id === id)
}

/** Prefijo sugerido por el idioma del navegador. Es una suposición y solo se
 *  usa para PRERRELLENAR: nunca sustituye a lo que el visitante elija. */
export function prefijoDelNavegador(): string {
  if (typeof navigator === 'undefined') return PREFIJO_POR_DEFECTO
  const idiomas = [...(navigator.languages ?? []), navigator.language].filter(Boolean)
  for (const etiqueta of idiomas) {
    const region = etiqueta.split('-')[1]?.toUpperCase()
    if (region && PREFIJOS.some((p) => p.id === region)) return region
  }
  return PREFIJO_POR_DEFECTO
}

/** Lo que viaja a Odoo: «+34 612345678». Un solo espacio entre prefijo y
 *  número para que el back-office lo pueda partir si algún día hace falta. */
export function componTelefono(prefijoId: string, numero: string): string {
  const limpio = numero.trim()
  if (!limpio) return ''
  // Si alguien pega su número ya con prefijo internacional, mandarlo tal cual:
  // anteponerle otro daría «+34 +44 7700…».
  if (limpio.startsWith('+')) return limpio.replace(/\s+/g, ' ')
  const codigo = prefijoPorId(prefijoId)?.codigo ?? ''
  return `${codigo} ${limpio}`.trim().replace(/\s+/g, ' ')
}

/** Camino inverso: parte un teléfono guardado (una reserva que se reanuda) en
 *  prefijo + número. Se queda con el código más largo que case, para que
 *  «+1809…» no se lea como «+1» a secas cuando exista un país con +180x. */
export function parteTelefono(telefono: string): { prefijo: string; numero: string } {
  const valor = (telefono ?? '').trim()
  if (!valor.startsWith('+')) return { prefijo: PREFIJO_POR_DEFECTO, numero: valor }
  const sinEspacios = valor.replace(/\s+/g, '')
  const candidatos = [...PREFIJOS]
    .filter((p) => sinEspacios.startsWith(p.codigo))
    .sort((a, b) => b.codigo.length - a.codigo.length)
  const elegido = candidatos[0]
  if (!elegido) return { prefijo: PREFIJO_POR_DEFECTO, numero: valor }
  return { prefijo: elegido.id, numero: sinEspacios.slice(elegido.codigo.length) }
}
