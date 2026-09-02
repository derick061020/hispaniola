import { traducible } from '@/lib/i18n'
// Página de Tripulación / Equipo (correcciones v2, plan 05) — 2026-07-27.
//
// [2026-08-21] LOS RETRATOS YA SON REALES. El cliente entregó la carpeta
// «FOTO PARA NUEVA WEB 2026/ABOUT US/CREW»: 55 fotos de estudio repartidas en
// seis subcarpetas. Esta página deja de ser un molde de 70 fichas inventadas y
// pasa a enseñar a las 30 personas de las que hay retrato (27 en la 1ª
// entrega del cliente + 3 en la 2ª, 2026-08-23 — de las 6 fotos que llegaron
// solo había 3 personas nuevas; el resto eran segundas tomas de las mismas).
//
// ⚠️ SIGUE SIN HABER NOMBRES, Y POR ESO LAS CARDS NO LLEVAN NINGUNO. El
// cliente no mandó la plantilla con nombre y cargo, así que la card es el
// retrato y nada más. La versión anterior rellenaba con «Name Surname 07» y un
// lorem ipsum en primera persona; poner esas frases bajo una CARA REAL sería
// mucho peor que bajo un nombre de relleno, porque sería atribuir una
// declaración a una persona identificable. Cuando llegue la plantilla, cada
// retrato gana su nombre y su cargo sin tocar el componente.
//
// LOS SEIS DEPARTAMENTOS SON LAS SEIS SUBCARPETAS (pedido de Samuel,
// 2026-08-21: «así es como quiero que estén organizadas las categorías; las
// que no tengamos ninguna foto y no aparezca ni siquiera el nombre de la
// carpeta, elimínalas»). Eso retira dos que sí existen en la empresa y tenían
// copy aprobado —Sales & Marketing y Administration— porque no hay ni una foto
// suya; vuelven en cuanto lleguen. Y parte lo que antes era un solo
// departamento, «Marine Operations», en los tres que el cliente separó al
// fotografiar: capitanes, guías y marinos.
//
// ⚠️ TRES DEPARTAMENTOS SE QUEDAN SIN PÁRRAFO. El cliente escribió seis
// descripciones, pero para SUS seis departamentos, no para estos. Cocina,
// oficina y fundación conservan la suya palabra por palabra; capitanes, guías
// y marinos no tienen ninguna y NO se les inventa: la cabecera se pinta sin
// párrafo hasta que el cliente los escriba.

// Las seis subcarpetas de CREW, en el orden en que se leen en la página.
export type DepartamentoId =
  | 'capitanes'
  | 'guias'
  | 'marinos'
  | 'cocina'
  | 'oficina'
  // [2026-09-01, 3ª entrega del cliente: «agregar las fotos de las carpetas CEO
  // y Sales and Marketing»] UN grupo nuevo. No se mete dentro de `oficina`
  // porque el cliente lo manda en carpeta separada, que es como ha venido
  // separando los departamentos de esta página desde el principio.
  //
  // ⚠️ Y NO SON DOS. En el primer pase se creó también un `direccion`
  // («Management») con la única foto de la carpeta «AGREGAR - CEO». Samuel lo
  // corrigió el mismo día: «quita el apartado management ya que ese es el ceo».
  // Esa foto no era un departamento, era el RETRATO REAL DEL CEO — que ya
  // existe en el sitio como `equipo-omar` (id 'fernando' desde el 2026-09-02,
  // «CEO» en data/nosotros.ts) y llevaba hasta hoy una foto de stock. La foto
  // pasó a sobrescribir ese hueco, y así sale en las cinco superficies donde
  // aparece el CEO sin tocar ninguna de ellas. El nombre del archivo se quedó
  // como estaba: ver la nota del renombrado en data/nosotros.ts.
  | 'ventas'
  | 'fundacion'

export type Departamento = {
  id: DepartamentoId
  nombre: string
  /** Descripción REAL — la escribió el cliente en su PowerPoint. Ausente en
   *  los tres departamentos que él no describió (ver la cabecera): la cabecera
   *  se pinta sin párrafo, no con uno inventado. */
  descripcion?: string
}

// El copy de cocina, oficina y fundación es CONTENIDO REAL del cliente (slides
// 37-42 del PDF v2, reconfirmado en el WEBSITE - NOSOTROS de v3). Se copia
// palabra por palabra desde la versión anterior de este archivo.
export const DEPARTAMENTOS: Departamento[] = traducible([
  // Los tres de mar. Antes eran un solo departamento, «Marine Operations», y
  // su párrafo describía a los tres juntos; al separarlos se quedan sin él.
  { id: 'capitanes', nombre: 'Captains' },
  { id: 'guias', nombre: 'Guides' },
  { id: 'marinos', nombre: 'Deckhands' },
  {
    id: 'cocina',
    nombre: 'Kitchen Operations',
    descripcion:
      'From land to our floating kitchen and then your table on board, our professional chefs prepare fresh, high-quality dishes with passion and attention to every detail, making every meal part of the experience.',
  },
  {
    id: 'oficina',
    nombre: 'Office Operations',
    descripcion:
      'From the moment you arrive, we welcome you to our facilities, guide you through check-in, introduce your adventure, and provide personalized support throughout your experience.',
  },
  // [2026-09-01, 3ª entrega] El grupo nuevo va AQUÍ, entre el equipo de tierra
  // y la fundación: la página se titula «The people behind the scenes» y abre
  // por el mar, que es lo que se compra. El orden queda mar → tierra → fundación.
  // ⚠️ SIN `descripcion`, como los tres de mar: el cliente mandó las fotos pero
  // no escribió párrafo para este grupo. La cabecera se pinta sin él, no con
  // uno inventado — misma regla que ya aplican capitanes, guías y marinos.
  {
    id: 'ventas',
    // «Sales and Marketing» es como los nombra el cliente en su carpeta. Se
    // mantiene tal cual: es su nombre, no una traducción nuestra.
    nombre: 'Sales & Marketing',
  },
  {
    id: 'fundacion',
    // ⚠️ Matiz que conviene no pisar: la fundación es una entidad SIN FINES DE
    // LUCRO separada, así que su gente no son empleados de Hispaniola. El
    // encabezado lo dice en vez de listarlos como un departamento más.
    nombre: 'Bávaro Reefs Foundation',
    descripcion:
      'Driven by a passion for the ocean, our multidisciplinary conservation team works every day to protect coral reefs, restore marine life, and preserve the Caribbean for future generations.',
  },
])

export type MiembroEquipoV2 = {
  id: string
  departamento: DepartamentoId
  /** Nombre del archivo en /public/fotos, sin extensión. */
  foto: string
  /** El cliente todavía no ha mandado la plantilla con nombre y cargo, así que
   *  la card se pinta solo con el retrato. Ver la cabecera del archivo. */
  nombre?: string
  rol?: string
}

/** Cuántos retratos hay por departamento. El número sale de contar PERSONAS
 *  distintas en cada subcarpeta, no archivos: cada una posó dos o tres veces y
 *  solo entra una foto suya. Los archivos elegidos y el porqué de cada
 *  descarte están en scripts/reemplazar-fotos.py. */
const RETRATOS_POR_DEPARTAMENTO: Record<DepartamentoId, number> = {
  capitanes: 4,
  // [2026-08-23, 2ª entrega del cliente] guías 4 → 5 y cocina 8 → 10.
  // ⚠️ La carpeta `GUÍAS/AGREGAR` traía DOS archivos (IMG_8924 e IMG_8926) y
  // aquí solo entra UNO: son la misma persona, con la toma de brazos caídos y
  // la de brazos cruzados. Manda la regla de Samuel del 21 —una persona, un
  // retrato, y de los dos el de brazos cruzados—, así que se publica 8926.
  // Contarlos como dos habría repetido una cara en el muro, que es el bug que
  // se arregló en el commit 308114d.
  guias: 5,
  marinos: 1,
  // De `COCINA/AGREGAR` entran DOS, no cuatro. [2026-08-24, Samuel sobre el
  // muro ya montado] los cuatro archivos son solo DOS personas, cada una con
  // su toma de brazos caídos y su toma de brazos cruzados: 8927/8929 son el
  // mismo hombre y 8931/8935 el mismo chico. Manda la regla del 21 —una
  // persona, un retrato— así que se publican 8929 y 8931 y los otros dos se
  // borraron. Ninguno de los dos estaba ya en el muro (comparados contra los
  // 8 retratos publicados).
  cocina: 10,
  oficina: 8,
  // [2026-09-01, 3ª entrega] El grupo nuevo. Es la PRIMERA entrega de retratos
  // en la que el nº de archivos coincide con el de personas: las dos fotos son
  // dos personas distintas, comprobado abriéndolas. En las dos anteriores no
  // pasaba —una misma persona posaba con los brazos caídos y con los cruzados,
  // y solo entraba una toma—, que es el bug que se arregló en el commit 308114d.
  // La tercera foto de la entrega (la del CEO) NO está aquí: es el retrato de
  // Fernando y vive en `equipo-omar`. Ver la nota de `DepartamentoId`.
  ventas: 2,
  fundacion: 2,
}

export const EQUIPO_COMPLETO: MiembroEquipoV2[] = DEPARTAMENTOS.flatMap((d) =>
  Array.from({ length: RETRATOS_POR_DEPARTAMENTO[d.id] }, (_, i) => ({
    id: `${d.id}-${i + 1}`,
    departamento: d.id,
    foto: `crew-${d.id}-${i + 1}`,
  })),
)

/** Cuántos RETRATOS hay, que ya no es lo mismo que cuánta gente trabaja en la
 *  empresa: son 30 fotos de una plantilla que el cliente cifra en más de 70.
 *  Se deriva del array, como todos los contadores de esta página. */
export const TOTAL_EQUIPO = EQUIPO_COMPLETO.length

export function contarPorDepartamento(id: DepartamentoId): number {
  return EQUIPO_COMPLETO.filter((m) => m.departamento === id).length
}

export const EQUIPO_PAGINA = traducible({
  // [v3 2026-08-06, WEBSITE - NOSOTROS pags. 1-2] Copy APROBADO. El cliente
  // escribe el titular en dos pisos («THE PEOPLE BEHIND THE SCENES» / «MORE
  // THAN A CREW, A TEAM DEDICATED TO YOU»): el primero es el H1 y el segundo
  // la bajada, que es como los presenta.
  eyebrow: 'Our team',
  titulo: 'The people behind the scenes',
  // El lead de la maqueta del cliente decía «Gerencia española afincada en
  // Punta Cana desde 2012 y un gran equipo dominicano que vive el mar
  // contigo». El dato RD + España SÍ se publica ahora (ver `datos`, pedido de
  // Samuel 2026-07-28), pero como dato de la franja, no como frase del hero:
  // aquí sigue el lead que dice solo lo que describe la página.
  // ⚠️ [2026-09-01] «six» → «seven». El copy es del cliente y va literal salvo
  // este número, que su propio encargo dejó desfasado: al entrar Sales &
  // Marketing con la 3ª entrega, la página pasó a enseñar SIETE cabeceras de
  // departamento mientras esta frase seguía diciendo seis, con la franja de
  // datos —que sí deriva el número de `DEPARTAMENTOS`— desmintiéndola tres
  // líneas más abajo. No es reescribir su texto: es que siga siendo verdad.
  // ⚠️ Va ESCRITO A MANO y en letra, así que no se actualiza solo. Si mañana
  // entra otro departamento, hay que tocar esta línea Y el titular de
  // pages/tripulacion.tsx, que dice el mismo número.
  lead: 'More than a crew, a team dedicated to you. More than 70 passionate professionals across seven specialized departments work together every day to make your Caribbean adventure unforgettable.',
  // Franja compacta bajo el hero (slide 37 del PDF v2 — los cuatro datos y su
  // redacción son del cliente). Los dos primeros valores se DERIVAN del array,
  // como todos los contadores de esta página; los dos últimos son texto fijo.
  //
  // ⚠️ EL «70+» NO SE DERIVA DE `TOTAL_EQUIPO`, y es a propósito: son dos
  // números de cosas distintas. 70+ es la plantilla que el cliente afirma en su
  // copy aprobado («more than 70 passionate professionals», el lead de aquí
  // arriba), y TOTAL_EQUIPO son los 28 de los que hay retrato. Derivarlo del
  // array pondría «≈ 28 people on the team» tres líneas debajo de un lead que
  // dice más de 70.
  datos: [
    { id: 'personas', valor: '70+', etiqueta: 'people on the team' },
    { id: 'departamentos', valor: `${DEPARTAMENTOS.length} departments`, etiqueta: 'from the office to the sea' },
    // [v3 2026-08-06] «Desde 2012» -> 2010: la timeline aprobada de /flota
    // fecha el primer barco en 2010 y el copy de la home dice «since 2010».
    { id: 'desde', valor: 'Since 2010', etiqueta: 'growing together' },
    // ⚠️ Este es el único dato de la franja que afirma algo sobre la EMPRESA y
    // no sobre esta página. Nació de la maqueta del cliente (slide 37) y de un
    // pedido explícito de Samuel (2026-07-28: «que el equipo es de RD y
    // España»), y su propio comentario ya avisaba de que «si el cliente lo
    // desmiente, es lo primero que cae».
    //
    // [2026-08-24, UPDATES 08/22 del cliente, pág. 3] Cayó. El cliente rodea
    // esta celda y da el texto nuevo, literal: «Multicultural team» /
    // «different backgrounds, one passion». No está desmintiendo el dato —
    // sigue habiendo gente de RD y de España—: está cambiando el EJE, de origen
    // geográfico a diversidad. Por eso el dato no se borra, se reescribe.
    //
    // El icono se queda en Globe2 (franja-equipo.tsx): sirve igual para
    // «multicultural» y cambiarlo no lo pidió nadie.
    { id: 'origen', valor: 'Multicultural team', etiqueta: 'different backgrounds, one passion' },
  ],
  // El muro de retratos (equipo/muro-tripulacion.tsx) NO tiene copy: es solo
  // los dos tickers, sin eyebrow ni titular ni descripción (2ª vuelta del
  // 2026-07-28, pedido de Samuel). Aquí vivían `muroEyebrow` y `muroLead`, y
  // se retiran con la cabecera en vez de quedarse huérfanos.
  cierreEyebrow: 'Work with us',
  cierreTitulo: 'Want to row with us?',
  // Foto de fondo del banner de cierre (equipo/cierre-equipo.tsx). Mar abierto
  // y vela: es la toma más UNIFORME de las disponibles, y en un banner con el
  // texto centrado eso es lo que decide. Se probaron 6 candidatas; las de
  // grupo (hero-catamaran-1, galeria-semi-privado-6) traen un cielo muy claro
  // justo en la banda donde cae el eyebrow —la parte del degradado que solo
  // tapa un 35%— y ahí el texto se despega. Y footer-oceano queda descartada
  // por vecindad: es el fondo del Footer, tres centímetros más abajo.
  //
  // La comparte con el cierre de /por-que-reservar, y está bien que así sea:
  // es el mismo componente cerrando dos páginas, no un descuido.
  cierreFoto: 'hero-catamaran-2',
  cierreTexto:
    'We’re always looking for people who love the sea and genuinely enjoy taking care of others. If that’s you, tell us who you are.',
  // El botón de la maqueta decía «Ver vacantes», pero /trabaja-con-nosotros no
  // lista vacantes — es un formulario abierto. Un botón que promete vacantes y
  // no las da es la clase de promesa pequeña que este proyecto evita, así que
  // se usa la frase que el propio cliente escribió debajo.
  cierreCta: 'Tell us who you are',
} as const)
