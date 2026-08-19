import { traducible } from '@/lib/i18n'

// «Trabaja con nosotros» (/trabaja-con-nosotros) — correcciones v1 del
// cliente, 2026-07-22 (pedido de Samuel, con captura de referencia: el bloque
// del footer con "Como proveedor de actividades / Como creador de contenido /
// Como afiliado" y una página con formulario donde se elige cuál de los tres).
//
// ⚠️ CONTENIDO — LO QUE AQUÍ NO SE INVENTA. No existe hoy ninguna fuente del
// proyecto (ni prototipo/datos.js ni la web actual) que documente un programa
// de afiliados, de creadores ni de proveedores: no hay comisiones, ni tarifas,
// ni requisitos de audiencia, ni condiciones de contrato. Así que esta página
// es CAPTACIÓN, no un portal de programa: describe a quién buscamos y recoge
// el contacto. Todo lo que promete son cosas que el sitio ya sostiene en otra
// parte (respuesta por WhatsApp en <24 h — agentes-de-viaje; salidas reales y
// grupos pequeños — home; cocina flotante y flota propia — /nosotros).
// El día que el cliente defina condiciones, se añaden aquí y la página crece
// sin rehacerse. MISMO CRITERIO que FormularioAgentes (B2B, sin backend).

export type CampoPerfil = {
  name: string
  etiqueta: string
  /** placeholder del input — pista de formato, no dato inventado. */
  pista?: string
  requerido?: boolean
  tipo?: 'text' | 'url' | 'email'
}

export type PerfilTrabajo = {
  /** Valor de `?perfil=` en la URL — es lo que enlaza el footer. */
  id: 'proveedor' | 'creador' | 'afiliado'
  /** Etiqueta del enlace en el footer, tal cual la pidió el cliente. */
  enlace: string
  /** Título de la tarjeta dentro del selector del formulario. */
  titulo: string
  /** Una línea: a quién va dirigido. Es lo que hace que elijas bien. */
  resumen: string
  /** Qué pasa si encajas — hechos ya vetados en el resto del sitio. Es el
   *  ÚLTIMO de los 3 pasos de «qué pasa después» del carril: los dos
   *  primeros son iguales para todos y viven en el componente. */
  quePasa: string
  /** Título del 2º grupo de campos del formulario — cambia con el perfil
   *  para que se note que el formulario se adaptó a lo que elegiste. */
  grupoCampos: string
  campos: CampoPerfil[]
}

export const PERFILES_TRABAJO: PerfilTrabajo[] = traducible([
  {
    id: 'proveedor',
    enlace: 'As an activity provider',
    titulo: 'Activity provider',
    resumen:
      'You run excursions, transport, catering, music or water gear in Punta Cana and you want to join our trips.',
    quePasa:
      'If it fits, we coordinate directly, no middlemen between your team and ours.',
    grupoCampos: 'About your operation',
    campos: [
      { name: 'company', etiqueta: 'Company or operation', requerido: true },
      {
        name: 'actividad',
        etiqueta: 'What do you offer?',
        pista: 'Transport, catering, live music, diving gear…',
        requerido: true,
      },
      { name: 'web', etiqueta: 'Company website or social media', pista: 'https://', tipo: 'url' },
    ],
  },
  {
    id: 'creador',
    enlace: 'As a content creator',
    titulo: 'Content creator',
    resumen:
      'You film, photograph or write about travel and you want to come on board to tell a real day at sea.',
    quePasa:
      'If it fits what we tell, we find a date on a real trip, not a setup for the camera.',
    grupoCampos: 'About your profile',
    campos: [
      {
        name: 'perfil',
        etiqueta: 'Link to your profile or portfolio',
        pista: 'https://instagram.com/…',
        requerido: true,
        tipo: 'url',
      },
      { name: 'plataforma', etiqueta: 'Main platform', pista: 'Instagram, TikTok, YouTube, blog…' },
      { name: 'idiomas', etiqueta: 'Languages you publish in', pista: 'Spanish, English…' },
    ],
  },
  {
    id: 'afiliado',
    enlace: 'As an affiliate',
    titulo: 'Affiliate',
    resumen:
      'You have a website, blog, newsletter or a community of travelers and you want to recommend our tours.',
    quePasa:
      'We talk the terms through with you. They aren’t published today: we’d rather agree on them than give you a number that changes later.',
    grupoCampos: 'About your channel',
    campos: [
      {
        name: 'canal',
        etiqueta: 'Website, channel or community where you’d recommend us',
        pista: 'https://',
        requerido: true,
        tipo: 'url',
      },
      { name: 'audiencia', etiqueta: 'Who you reach', pista: 'U.S. families, divers, weddings…' },
    ],
  },
])

// «Con quién trabajarías» — el pie del carril del formulario. Existe por dos
// razones a la vez, y las dos importan:
//   · UX: es la pregunta que se hace cualquiera antes de dejar sus datos a
//     una empresa que no conoce, y esta página no la contestaba en ninguna
//     parte (el hero habla de perfiles, el formulario pide datos).
//   · DISEÑO: sin esto, el carril terminaba en los 3 pasos y quedaban ~250px
//     de gris muerto bajo ellos, porque la columna del formulario es más
//     alta. Es EXACTAMENTE el desajuste de alturas que Samuel señaló en el
//     rediseño de Contacto («una quedaba con medio metro de aire muerto»);
//     allí lo absorbió el textarea, aquí lo absorbe contenido útil.
//
// ⚠️ NINGÚN dato nuevo: los cuatro ya viven vetados en otra parte del sitio.
// El número de barcos NO se escribe a mano — se cuenta sobre FLOTA
// (data/nosotros.ts, los 6 catamaranes reales de about-hispaniola.php), para
// que añadir o quitar uno allí no deje esta frase mintiendo.
export const RESPALDO: string[] = traducible([
  'Our own fleet: {barcos} catamarans with names and a fixed crew.',
  'The only excursion company in the DR with a floating kitchen.',
  'Operating in Punta Cana since 2012.',
  '#1 on TripAdvisor 7 years in a row.',
])

export const PERFIL_POR_DEFECTO: PerfilTrabajo['id'] = 'proveedor'

export function esPerfilValido(valor: string | null): valor is PerfilTrabajo['id'] {
  return PERFILES_TRABAJO.some((p) => p.id === valor)
}
