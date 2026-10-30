import { traducible } from '@/lib/i18n'

// Páginas legales (PLAN-LANZAMIENTO.md Bloque F) — la web actual NO tiene
// ninguna (verificado en mapa-del-sitio.md: las 17 páginas inventariadas no
// incluyen privacidad/términos/cookies). UNA plantilla data-driven
// (/legal/:slug), igual que tours/eventos: en Figma, una página con frames de
// variante.
//
// ⚠️ Política de cancelación: contenido REAL, compuesto a partir de hechos ya
// usados y vetados en el resto del sitio (FAQ_CATEGORIAS, BENEFICIOS_DIRECTO,
// FAQ de cada tour) — no se inventa ningún término nuevo.
//
// ⚠️ Privacidad / Términos / Cookies: aquí NO hay contenido real que portar —
// ninguna fuente (web actual, prototipo, datos.js) tiene este texto, y
// redactar cláusulas legales completas (responsabilidad, jurisdicción, RGPD…)
// sería fabricar un documento vinculante que nadie ha revisado. Se deja la
// ESTRUCTURA real (empresa, apartados esperables) con el cuerpo marcado
// honestamente como pendiente de un abogado — mismo principio que "contenido
// jamás inventado", aplicado a la categoría de copy con más riesgo real del
// sitio. Avisar a Samuel/Derick antes de lanzar con esto tal cual.
//
// ⚠️ [2026-10-30, Marketing de Hispaniola] Cancelación, Términos y Privacidad
// YA TIENEN TEXTO OFICIAL: el documento HAA-LEG-002 «Políticas y condiciones del
// cliente» (PDF, última actualización 29-10-2026, copia en
// docs/proceso/politicas-haa-leg-002/). Lo de arriba queda como historia: la
// política de cancelación compuesta a mano y los dos placeholders se sustituyen
// enteros por el PDF, cláusula a cláusula, sin resumir ni reordenar.
//   · El ESPAÑOL es el del PDF, literal: vive en lib/i18n/es.ts (el diccionario
//     se indexa por el texto inglés, ver nucleo.ts).
//   · El INGLÉS es TRADUCCIÓN NUESTRA del PDF, PENDIENTE DE REVISIÓN por
//     Marketing. Tabla ES | EN para revisarla en
//     docs/proceso/politicas-haa-leg-002/TRADUCCION-EN-PARA-REVISAR.md.
//   · Cookies NO está en el PDF (el PDF mete las cookies dentro de Privacidad,
//     §5) y se queda como estaba hasta que Marketing diga qué hacer con ella.
//   · El Relevo de Responsabilidad HAA-LEG-001 que citan los Términos no nos ha
//     llegado: no tiene página todavía. No se inventa.
//   · El anexo del PDF (casillas de aceptación en el checkout y lo que Odoo
//     debe guardar de cada reserva) NO es texto de estas páginas: es trabajo
//     del funnel y del backend, pendiente aparte.

/** Un bloque es un párrafo (string) o una lista con viñetas (string[]): el
 *  PDF HAA-LEG-002 mezcla las dos cosas dentro de una misma cláusula. */
export type BloqueLegal = string | string[]

export type SeccionLegal = { titulo: string; bloques: BloqueLegal[] }

export type DocumentoLegal = {
  slug: string
  nombre: string
  actualizado: string
  /** Código del documento oficial del que sale el texto. Es la «versión
   *  aceptada» que el anexo del PDF pide guardar en cada reserva. */
  codigo?: string
  /** Los documentos del PDF no traen entradilla, y no se les inventa una. */
  intro?: string
  secciones: SeccionLegal[]
  /** true = el cuerpo es contenido real; false = placeholder pendiente de asesoría legal */
  contenidoReal: boolean
}

// Se envuelve el propio literal y no la constante: `traducible()` solo sabe de
// objetos, y esto es una cadena suelta que se repite en varias secciones.
const PLACEHOLDER = 'To be drafted with legal counsel.'

// Se repiten en varias cláusulas del PDF: una sola fuente.
const EMAIL = 'info@hispaniolaaquaticadventures.com'
const TELEFONO = '+1 (829) 305-2804'
const ACTUALIZADO_HAA_LEG_002 = 'October 29, 2026'

// ⚠️ TRADUCCIÓN NUESTRA (2026-10-30): todo el inglés de los tres documentos
// siguientes, pendiente de revisión por Marketing. El español es el del PDF.
export const LEGAL: Record<string, DocumentoLegal> = traducible({
  'cancellation-policy': {
    slug: 'cancellation-policy',
    nombre: 'Cancellation and Refund Policy',
    actualizado: ACTUALIZADO_HAA_LEG_002,
    codigo: 'HAA-LEG-002',
    contenidoReal: true,
    secciones: [
      {
        titulo: '1. Cancellation by the client',
        bloques: [[
          '7 or more days in advance: the amount paid is refunded.',
          'Less than 7 days in advance: the amount paid is non-refundable.',
        ]],
      },
      {
        titulo: '2. No-show',
        bloques: [
          'If you do not show up for the tour, or arrive after the waiting time stated in the Punctuality and transportation section, the Operator keeps the deposit. If you provide a medical certificate or another document that justifies your absence, the deposit is returned to you.',
        ],
      },
      {
        titulo: '3. Bad weather or cancellation by us',
        bloques: [
          'If the tour is canceled due to weather or sea conditions, by order of the authorities or for any other reason on the Operator’s side, we will try to reschedule it. If that is not possible, we will refund the full price of the tour.',
        ],
      },
      {
        titulo: '4. Bookings made through agencies or platforms',
        bloques: [
          'Bookings made through agencies or platforms such as Viator are governed by that third party’s cancellation and refund conditions. To cancel, please contact whoever sold you the tour.',
        ],
      },
      {
        titulo: '5. How to cancel',
        bloques: [
          `Write to us at ${EMAIL} or on WhatsApp at ${TELEFONO} with your name, the date of the tour and your booking number.`,
        ],
      },
      {
        titulo: '6. Bookings and payments',
        bloques: [[
          'To confirm your booking, you pay a deposit of between 20% and 25% of the total, as indicated when you book.',
          'You can also pay the full amount through our web portal or via a payment link.',
          'The outstanding balance is paid before the tour starts, by the means indicated by the Operator.',
          // ⚠️ «(the Dominican VAT)» es una glosa nuestra para el lector
          // extranjero: el PDF dice solo «ITBIS». Que Marketing decida si queda.
          'Published prices include ITBIS (the Dominican VAT).',
          'Children pay from the age of 4. Children under 4 do not pay a fare.',
          'Your booking is confirmed once you receive our written confirmation.',
        ]],
      },
      {
        titulo: '7. Punctuality and transportation',
        bloques: [
          'Please be ready at the pick-up point at the stated time. On shared tours we wait a maximum of 5 minutes, and on private tours, a maximum of 15 minutes. After that time, the transport continues its route so as not to affect the other passengers, and it is considered a no-show, under the conditions of the No-show section.',
        ],
      },
      {
        titulo: '8. Ages and conditions of participants',
        bloques: [[
          // ⚠️ «mayores de 15 años» se traduce «aged 15 and over», que es lo
          // que la ficha ya publica («Ages 15+»). Si el cliente quiere decir
          // 16+, cambian las dos.
          'Caribbean Escape is the only tour with a minimum age: it is only for guests aged 15 and over. All other tours are open to all ages.',
          'Pregnant women: they are welcome, provided their doctor agrees. They take part at their own risk.',
          'People with reduced mobility: they are welcome. Please contact us before booking so we can understand your situation and assess together how you can take part safely.',
          'Any relevant medical condition must be reported to the crew before boarding.',
        ]],
      },
      {
        titulo: '9. Photos and video',
        bloques: [
          'When the tour includes photos or video, the material will be available between 5 and 7 days after the tour, through the channel we indicate.',
        ],
      },
      {
        titulo: '10. Tips',
        bloques: ['Tips are not included in the price. They are at each guest’s discretion.'],
      },
    ],
  },
  privacy: {
    slug: 'privacy',
    nombre: 'Privacy Policy',
    actualizado: ACTUALIZADO_HAA_LEG_002,
    codigo: 'HAA-LEG-002',
    contenidoReal: true,
    secciones: [
      {
        titulo: '1. Data controller',
        bloques: [
          `The controller of your data is Hispaniola Aquatic Adventures, RNC 130878161, Playa Bibijagua, Bávaro, Punta Cana, Dominican Republic. Contact: ${EMAIL} · ${TELEFONO}.`,
        ],
      },
      {
        titulo: '2. What data we collect',
        bloques: [[
          'Identification and contact: name, nationality, identity document, phone, email, hotel and room.',
          'Booking and payment: tour, date, number of people and ages, amounts and payment status.',
          'Health: only the information you give us so you can take part safely.',
          'Image: photos and videos taken during the tour.',
          'Browsing: data collected through cookies and the Meta pixel (see below).',
        ]],
      },
      {
        titulo: '3. What we use it for',
        bloques: [[
          'To manage your booking, transportation, payments and communication with you.',
          'To ensure the safety of the activity and respond to emergencies.',
          'To deliver the photos and videos of your tour.',
          'To publish your image, only if you have authorized us to.',
          'To measure and improve our website and our advertising, through cookies and the Meta pixel.',
          'To comply with legal, tax and accounting obligations.',
        ]],
      },
      {
        titulo: '4. Where it is stored and who can access it',
        bloques: [
          'Your data is stored in our Odoo management system. Only authorized staff who need it for their work can access it. We share it only with the providers needed to deliver the service, such as the payment processor or, in the case of the pixel, the advertising platforms, and with the authorities when the law requires it. We do not sell your data.',
        ],
      },
      {
        titulo: '5. Cookies and the Meta pixel',
        bloques: [
          'Our website uses cookies and the Meta pixel to work properly, understand how it is used and measure our advertising on Facebook and Instagram. You can delete or block them in your browser settings.',
        ],
      },
      {
        titulo: '6. How long we keep it',
        bloques: [
          'We keep your data for as long as it is needed for your booking and to meet our legal obligations. Authorized images may remain in posts already published, although you can ask us not to use them in future posts.',
        ],
      },
      {
        titulo: '7. Your rights',
        bloques: [
          `Under Law 172-13 on the protection of personal data, you can request access to your data, correct it, request its deletion or object to its use by writing to us at ${EMAIL}.`,
        ],
      },
      {
        titulo: '8. Minors and changes',
        bloques: [
          'The data of minors is provided by their parent or guardian when booking. We may update this policy; the version in force is always the one published on our website.',
        ],
      },
    ],
  },
  terms: {
    slug: 'terms',
    nombre: 'Terms and Conditions',
    actualizado: ACTUALIZADO_HAA_LEG_002,
    codigo: 'HAA-LEG-002',
    contenidoReal: true,
    secciones: [
      {
        titulo: '1. Who we are',
        bloques: [
          'These Terms and Conditions govern the tours of Hispaniola Aquatic Adventures, a Bávaro Reefs Group company, RNC 130878161, with its registered address at Playa Bibijagua, Bávaro, Punta Cana, Dominican Republic (“Hispaniola” or “the Operator”).',
          `Contact and complaints: ${EMAIL} · Phone and WhatsApp: ${TELEFONO}.`,
          'They apply to bookings made on our website, through a payment link or directly with our team.',
        ],
      },
      {
        titulo: '2. Acceptance',
        bloques: [
          // ⚠️ «acepta ambos, la Política de Privacidad y el Relevo…»: en el PDF
          // «ambos» (los Términos y la Política de Cancelación) va seguido de
          // otros dos documentos sin conjunción. Se traduce «both, together
          // with…»; Marketing tiene que confirmar que es eso lo que quiere decir.
          'These Terms and Conditions include, as part of them, the Cancellation and Refund Policy, which also sets out the booking and payment conditions and the important information for your tour. By booking and ticking the acceptance box, you declare that you have read and accept both, together with the Privacy Policy and the Release of Liability and Assumption of Risk (document HAA-LEG-001), on your own behalf and on behalf of all the people included in your booking. If you book for other people, you declare that you have their authorization and that you will make these conditions known to them.',
          'We keep the date, time and version of the accepted documents as a record of your acceptance, in accordance with Law 126-02 on Electronic Commerce, Documents and Digital Signatures. Before boarding, the crew may ask you to sign the release on paper or in digital format.',
        ],
      },
      {
        titulo: '3. Safety on board',
        bloques: [
          [
            'Always follow the instructions of the captain and the crew. The captain’s decision on safety is final.',
            'Wear a life jacket if you are not a confident swimmer. It is mandatory for minors in the water.',
            'Enter and leave the water only where and when the crew indicates.',
            'Alcohol is served only to guests over 18. The crew may refuse service or entry into the water to anyone showing signs of intoxication.',
          ],
          'Anyone who breaks these rules may be removed from the activity without the right to a refund.',
        ],
      },
      {
        titulo: '4. Protection of the marine environment',
        bloques: [
          'The tours take place in the Bávaro Reef Lagoon Ecological Recovery Area (Área de Recuperación Ecológica Laguna Arrecifal de Bávaro), created by Resolution 0008-2024 of the Ministry of Environment and Natural Resources, which prohibits fishing in the area and protects sea turtles. During the tour it is forbidden to throw litter into the sea or onto the beach; to fish, hunt, injure or kill fish, turtles or other animals; to touch, step on, pull off or take away coral, starfish, shells or other organisms; to take animals out of the water or chase them to take photos; and to stand on the reef. We recommend using biodegradable (“reef safe”) sunscreen.',
          'Violations may result in removal from the activity without a refund and may be sanctioned by the authorities under the environmental legislation in force, including Law 64-00.',
        ],
      },
      {
        titulo: '5. Minors',
        bloques: [
          'Parents or guardians are solely responsible for supervising and caring for the minors in their charge throughout the tour: during transportation, on board, when boarding and disembarking, and in the water. The crew looks after the general safety of the group, but does not provide individual care or supervision of minors. The Operator is not liable for falls, injuries or accidents involving minors that are caused or aggravated by a lack of supervision.',
        ],
      },
      {
        titulo: '6. Assumption of risk and release of liability',
        bloques: [
          'Activities at sea involve risks that cannot be completely eliminated, such as waves, currents, slips and falls, coral cuts, stings, sunburn, seasickness and the worsening of pre-existing health conditions. By accepting these terms, you take part voluntarily and assume those risks for yourself and for the minors in your booking.',
          'To the extent permitted by Dominican law, you release the Operator from liability for damage or injury arising from the risks inherent in the activity, from failure to follow the rules or instructions, from lack of supervision of minors, from undisclosed health conditions, from the consumption of alcohol or medication, from the acts of other passengers, and from natural events or force majeure. This release does not exempt the Operator from its liability for willful misconduct or gross negligence, nor does it limit your non-waivable rights as a consumer (Law 358-05). The full text is in the Release of Liability HAA-LEG-001, which forms part of these terms.',
        ],
      },
      {
        titulo: '7. Use of image',
        bloques: [
          'Photos and videos in which you may appear are taken during the tour. We will only use your image, or that of the minors in your booking, on social media, on our website or in advertising if you give us your express authorization by ticking the corresponding box, which is optional and separate from accepting these terms. Saying no does not prevent you from taking part.',
        ],
      },
      {
        titulo: '8. Personal belongings and emergencies',
        bloques: [
          'The Operator is not liable for the loss, theft or damage of personal belongings, nor for objects that fall into the water. In an emergency, you authorize the crew to provide first aid and to coordinate the transfer to the nearest medical center. Medical expenses are borne by you or your travel insurance.',
        ],
      },
      {
        titulo: '9. Complaints',
        bloques: [
          `You can send us any complaint or claim at ${EMAIL} or ${TELEFONO}. You also have the right to go to the National Institute for the Protection of Consumer Rights (Pro Consumidor).`,
        ],
      },
      {
        titulo: '10. Governing law and changes',
        bloques: [
          'These terms are governed by the laws of the Dominican Republic, and the parties submit to the courts of the province of La Altagracia. The Operator may update these terms; each booking is governed by the version in force at the time of booking.',
        ],
      },
    ],
  },
  cookies: {
    slug: 'cookies',
    nombre: 'Cookie Policy',
    actualizado: 'August 23, 2026',
    contenidoReal: false,
    // ⚠️ [2026-08-23] Esta intro DECÍA que el sitio no usaba cookies de
    // analítica. Dejó de ser cierto el día que entró Microsoft Clarity en
    // app/index.html (pedido de Samuel): Clarity pone `_clck` y `_clsk` y graba
    // sesiones. Una política de cookies que afirma lo contrario de lo que hace
    // la web no es un texto pendiente, es un texto FALSO — y esta página es
    // precisamente donde alguien va a comprobarlo.
    // Sigue siendo placeholder (`contenidoReal: false`): las tres secciones de
    // abajo esperan el texto legal de verdad (PLAN-LANZAMIENTO.md Bloque G).
    intro:
      'This site uses Microsoft Clarity to understand how visitors use these pages, through heatmaps and session recordings. Clarity sets its own cookies. We use no advertising cookies. The full policy is still being drafted.',
    secciones: [
      { titulo: 'What cookies are', bloques: [PLACEHOLDER] },
      { titulo: 'Cookies we use', bloques: [PLACEHOLDER] },
      { titulo: 'How to disable them', bloques: [PLACEHOLDER] },
    ],
  },
})
