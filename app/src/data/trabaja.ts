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

export const PERFILES_TRABAJO: PerfilTrabajo[] = [
  {
    id: 'proveedor',
    enlace: 'Como proveedor de actividades',
    titulo: 'Proveedor de actividades',
    resumen:
      'Operas excursiones, transporte, catering, música o equipo náutico en Punta Cana y quieres sumarte a nuestras salidas.',
    quePasa:
      'Si encaja, coordinamos directo — sin intermediarios entre tu equipo y el nuestro.',
    grupoCampos: 'Sobre tu operación',
    campos: [
      { name: 'empresa', etiqueta: 'Empresa u operación', requerido: true },
      {
        name: 'actividad',
        etiqueta: '¿Qué ofreces?',
        pista: 'Transporte, catering, música en vivo, equipo de buceo…',
        requerido: true,
      },
      { name: 'web', etiqueta: 'Web o redes de la empresa', pista: 'https://', tipo: 'url' },
    ],
  },
  {
    id: 'creador',
    enlace: 'Como creador de contenido',
    titulo: 'Creador de contenido',
    resumen:
      'Grabas, fotografías o escribes sobre viajes y quieres subir a bordo a contar un día de mar de verdad.',
    quePasa:
      'Si encaja con lo que contamos, buscamos fecha en una salida real — no un montaje para la cámara.',
    grupoCampos: 'Sobre tu perfil',
    campos: [
      {
        name: 'perfil',
        etiqueta: 'Enlace a tu perfil o portafolio',
        pista: 'https://instagram.com/…',
        requerido: true,
        tipo: 'url',
      },
      { name: 'plataforma', etiqueta: 'Plataforma principal', pista: 'Instagram, TikTok, YouTube, blog…' },
      { name: 'idiomas', etiqueta: 'Idiomas en los que publicas', pista: 'Español, inglés…' },
    ],
  },
  {
    id: 'afiliado',
    enlace: 'Como afiliado',
    titulo: 'Afiliado',
    resumen:
      'Tienes web, blog, newsletter o una comunidad de viajeros y quieres recomendar nuestros tours.',
    quePasa:
      'Hablamos las condiciones contigo. Hoy no están publicadas: preferimos acordarlas antes que ponerte un número que luego cambie.',
    grupoCampos: 'Sobre tu canal',
    campos: [
      {
        name: 'canal',
        etiqueta: 'Web, canal o comunidad donde nos recomendarías',
        pista: 'https://',
        requerido: true,
        tipo: 'url',
      },
      { name: 'audiencia', etiqueta: 'A quién llegas', pista: 'Familias de EE. UU., buceadores, bodas…' },
    ],
  },
]

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
export const RESPALDO: string[] = [
  'Flota propia — {barcos} catamaranes con nombre y tripulación fija.',
  'La única empresa de excursiones de RD con cocina flotante.',
  'Operando en Punta Cana desde 2012.',
  '#1 en TripAdvisor 7 años seguidos.',
]

export const PERFIL_POR_DEFECTO: PerfilTrabajo['id'] = 'proveedor'

export function esPerfilValido(valor: string | null): valor is PerfilTrabajo['id'] {
  return PERFILES_TRABAJO.some((p) => p.id === valor)
}
