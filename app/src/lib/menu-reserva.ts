import type { CartaCharter, FichaTour, PlatoMenu } from '@/data/tours'
import type { Paquete } from '@/components/reservar/tipos'

// QUÉ SE COME EN ESTA RESERVA — resolutor único del menú de un tour.
//
// [2026-08-07, pedido de Samuel: «en Saona y creo que en otros eventos el tema
// de los menús no se ve… si solo hay 1 menú no debe haber paso de menú, y si
// hay otras opciones esas opciones deben aparecer»]
//
// El diagnóstico: el funnel estaba escrito para UN solo modelo de menú, el del
// semi-privado (Light/Premium, N platos, uno por persona), y leía siempre
// `ficha.menuLight`/`ficha.menuPremium`. Los otros dos tours con booking
// 'completo' llevan esos dos campos VACÍOS a propósito —Saona sirve buffet
// (`menuBuffet`) y el charter tiene cartas por duración de barco
// (`menuCharter`)— así que el paso 2 se pintaba con la rejilla de platos
// literalmente vacía: un acordeón por persona que se abría y no ofrecía nada.
//
// Aquí se resuelve UNA vez qué come el grupo, y de ahí salen las dos ramas:
//   · `eleccion` → hay varios platos y cada persona escoge → el funnel pinta
//     el paso «Your menu» (y «Mi reserva» deja cambiarlo después).
//   · `fijo` → todos comen lo mismo (buffet, o una carta de un solo plato) →
//     NO hay paso: no se le pide una decisión a quien no tiene ninguna que
//     tomar. Lo que sí se hace es SEGUIR ENSEÑANDO la comida — pasa a la
//     tarjeta «qué estás comprando», que es donde vive lo que va incluido.
//
// El resolutor vive en lib/ y no en el funnel porque lo consultan cuatro
// pantallas (funnel, resumen, gracias, mi reserva) y todas tienen que
// contestar lo mismo. Trabaja sobre un subconjunto de FichaTour para poder
// correr también sobre `Reserva.ficha`, la copia recortada que se guarda al
// pagar.

/** Los campos de menú que necesita el resolutor. Subconjunto de `FichaTour`
 *  para que valga igual sobre la ficha completa y sobre `Reserva.ficha`. */
export type FichaConMenu = Pick<FichaTour, 'menuLight' | 'menuPremium'> &
  Partial<Pick<FichaTour, 'menuBuffet' | 'menuCharter' | 'subVariantes'>>

export type MenuReserva = {
  /** 'eleccion' = cada persona escoge plato; 'fijo' = todos comen lo mismo. */
  modo: 'eleccion' | 'fijo'
  /** Nombre corto, para la línea de producto y el desglose («Premium»,
   *  «4-hour menu», «Island buffet»). */
  etiqueta: string
  titulo: string
  texto?: string
  /** Regla que puede CAMBIAR este menú sin salir del funnel (el aforo del
   *  charter). Se dice aquí porque las personas se editan en la propia
   *  pantalla: pasar de 20 a 21 cambia lo que se come. */
  nota?: string
  /** En modo 'eleccion', las opciones. En modo 'fijo', lo que se sirve. */
  platos: PlatoMenu[]
}

/** Qué carta del charter le toca a este visitante. Dos datos del widget
 *  mandan, y en este orden: el AFORO gana a la duración, porque de 21 personas
 *  en adelante el buffet de pinchos aplica navegues 3 o 4 horas. Solo después
 *  decide el barco. Sin barco elegido (entrada directa a /book/:slug), la
 *  primera carta.
 *
 *  Es la regla del cliente (slides 73-74 + reunión 07-31) y vive aquí, en un
 *  solo sitio, porque la aplican la ficha (pestaña activa de las cartas) y el
 *  funnel (qué platos se pueden elegir): si se separan, un visitante puede ver
 *  una carta en la ficha y otra en el checkout. */
export function cartaCharterDe(
  menu: NonNullable<FichaTour['menuCharter']>,
  subVariantes: FichaTour['subVariantes'],
  variante?: string | null,
  personas?: number | null,
): CartaCharter {
  const barco = subVariantes?.find((sv) => sv.id === variante)
  // [2026-08-18] Las horas salen de `duracionHoras`, un NÚMERO del dato, y ya
  // no de leer el texto que se pinta (`duracion.startsWith('3')`). Aquello se
  // rompía con «3.5 hours» y bloqueaba el multi-idioma: en cuanto la etiqueta
  // se tradujera, ningún barco empezaría por «3» y todos los grupos comerían la
  // carta de 4 h. El texto se sigue mirando como último recurso, para que un
  // barco al que todavía no se le haya puesto el número no se quede sin carta.
  const horas = barco?.duracionHoras ?? (barco?.duracion?.startsWith('3') ? 3 : undefined)
  const id: CartaCharter['id'] | null =
    personas != null && personas >= 21
      ? '21+'
      : horas === 3
        ? '3h'
        : barco
          ? '4h'
          : null
  return menu.cartas.find((c) => c.id === id) ?? menu.cartas[0]
}

export function menuDeLaReserva({
  ficha,
  paquete,
  variante,
  personas,
}: {
  ficha: FichaConMenu
  paquete: Paquete
  /** Sub-variante elegida en el widget (el BARCO, en el charter). */
  variante?: string | null
  personas?: number | null
}): MenuReserva | null {
  // 1. CHARTER — la carta la deciden el barco y el aforo, no un paquete.
  if (ficha.menuCharter) {
    const carta = cartaCharterDe(ficha.menuCharter, ficha.subVariantes, variante, personas)
    const hayBuffet = ficha.menuCharter.cartas.some((c) => c.id === '21+')
    return {
      // El buffet de pinchos (21+) no tiene platos que listar: en un buffet no
      // se elige plato por persona. Una carta de un solo plato tampoco es una
      // elección, así que también entra por 'fijo'.
      modo: carta.platos.length > 1 ? 'eleccion' : 'fijo',
      // Las pestañas de 3 h y 4 h nombran QUÉ menú es; la de 21+ nombra la
      // REGLA de quién lo come («Groups of 21+»), y en la línea de producto
      // hace falta el nombre de la comida — ahí sí vale su título.
      etiqueta: carta.id === '21+' ? carta.titulo : carta.pestana,
      titulo: carta.titulo,
      texto: carta.texto,
      // La nota NO se copia de `carta.nota`: la de la ficha remite a otra
      // pestaña («See the skewer buffet») y aquí no hay pestañas. Lo que sí
      // hace falta decir es que el número de personas —editable en esta misma
      // pantalla— es lo que cambia el menú.
      nota: !hayBuffet
        ? undefined
        : carta.id === '21+'
          ? 'Your group is 21 or more, so the menu is served as a buffet for everyone — there is no dish to pick per guest.'
          : 'From 21 guests the menu changes: it is served as a skewer buffet for the whole group.',
      platos: carta.platos,
    }
  }

  // 2. SAONA — buffet en la isla, el mismo para todo el grupo.
  if (ficha.menuBuffet) {
    return {
      modo: 'fijo',
      etiqueta: 'Island buffet',
      titulo: 'Island buffet',
      texto: 'Served on the beach for the whole group. There is no dish to pick per guest.',
      platos: ficha.menuBuffet.platos,
    }
  }

  // 3. LIGHT / PREMIUM — el modelo clásico (semi-privado, Snorkel Lovers).
  const platos = paquete === 'premium' ? ficha.menuPremium : ficha.menuLight
  if (platos.length === 0) return null
  const etiqueta = paquete === 'premium' ? 'Premium' : 'Light'
  return {
    modo: platos.length > 1 ? 'eleccion' : 'fijo',
    etiqueta,
    titulo: `${etiqueta} menu`,
    texto: 'Cooked fresh on board in the floating kitchen. You can change it up to 48 h before the tour.',
    platos,
  }
}
