import { Clock3, CarFront, Smartphone, Languages } from 'lucide-react'
import type { Tour } from '@/data/home'
import type { FichaTour } from '@/data/tours'

// Ficha técnica del tour, debajo del mosaico — el patrón «trip facts» de
// Viator (Samuel, 2026-07-22, con captura de una ficha de Viator: duración,
// recogida, entrada móvil, idiomas).
//
// SUSTITUYE A LOS KPIs DE EMPRESA que vivían aquí (kpis-tour.tsx: «Aforo
// limitado · 4.460 días navegados · 91.733 clientes felices», pedido de
// Samuel 2026-07-17 con referencia a hellocaribetours). El cambio es de
// SUJETO, no de estilo: aquellos tres números hablaban de la EMPRESA y eran
// idénticos en las cuatro fichas; a esta altura de la página —justo después
// de ver las fotos y justo antes de leer la descripción— el visitante está
// evaluando ESTE producto, y lo que necesita es cuánto dura, si lo recogen y
// en qué idioma le van a hablar. Los KPIs de empresa no se pierden: siguen
// donde pertenecen (la banda de PREMIOS y el footer, que hablan de marca).
//
// TODO EL CONTENIDO SALE DE DATOS QUE YA EXISTÍAN, ninguno es nuevo:
//  - duración: `ficha.duracion` (la misma que el chip del hero).
//  - recogida: `tour.booking === 'completo'`, EXACTAMENTE la misma regla con
//    la que cabecera-ficha decide su chip «Recogida en hotel» — una sola
//    condición para un solo hecho, o acabarían discrepando.
//  - idiomas: tripulación bilingüe ES/EN, el dato que la FAQ de eventos ya
//    publica («tripulación bilingüe (ES/EN)», data/eventos.ts). NO se copia
//    el «y 2 más» de la captura de Viator: son SUS idiomas, no los nuestros,
//    y un idioma de más es una promesa que alguien tendría que cumplir a
//    bordo.
//  - entrada móvil: la reserva se confirma por email y se recupera en
//    /mi-reserva con código o email, sin papel. Es lo que ya hace el
//    prototipo, no una promesa nueva.
//
// El «(aprox.)» de la duración también viene de la captura y es honesto: el
// itinerario de la ficha ya marca sus horas con «~» porque dependen del mar.

export function DatosTour({ tour, ficha }: { tour: Tour; ficha: FichaTour }) {
  // Cada dato se parte en ETIQUETA (de qué se habla) y VALOR (qué dice de
  // este tour) — el contenido es exactamente el mismo de antes, escrito en
  // una sola frase corrida: «Idiomas disponibles: español e inglés» ya traía
  // los dos campos dentro, separados por dos puntos. Sacarlos permite que
  // las cuatro columnas rimen: cuatro etiquetas cortas en la misma línea y
  // cuatro valores en la de abajo, en vez de cuatro frases de longitudes
  // dispares. Nada nuevo se promete.
  const datos = [
    { icono: Clock3, etiqueta: 'Duración', valor: `${ficha.duracion} (aprox.)` },
    ...(tour.booking === 'completo'
      ? [{ icono: CarFront, etiqueta: 'Recogida', valor: 'Se ofrece recogida' }]
      : []),
    { icono: Smartphone, etiqueta: 'Entrada', valor: 'Para dispositivos móviles' },
    { icono: Languages, etiqueta: 'Idiomas', valor: 'Español e inglés' },
  ]

  // Nº de columnas = nº de datos, para que la fila no deje un hueco suelto
  // (los tours sin recogida traen 3, no 4). Las clases van literales y no
  // interpoladas porque Tailwind escanea el código como texto: un
  // `lg:grid-cols-${n}` no llegaría a generarse nunca.
  const columnas = datos.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'

  return (
    // Rejilla de columnas iguales con hairline entre ellas, no la fila que
    // fluía antes (2026-07-22, Samuel: «parece que están puestos sin más,
    // sin orden ni coherencia»). El flex-wrap era el problema: al depender
    // del ancho de cada frase, tres datos se apretaban en la primera línea y
    // el cuarto caía solo debajo, con los iconos en posiciones que no rimaban
    // entre filas — se leía como cuatro apuntes sueltos, no como una ficha
    // técnica. En columnas, los iconos se alinean en una retícula y las
    // separaciones verticales dicen «esto son campos de una misma tabla».
    // Las dos hairlines de fuera (border-y) se conservan: es info de apoyo
    // enmarcada, no una card más — con ring y fondo competiría con el
    // mosaico que tiene justo encima.
    // [v2 2026-07-27] FUERA LAS RAYITAS (slide 8: «muchas rayitas separadoras,
    // eliminarlas o con algún fondo tipo glassmorphism»). El cliente tiene
    // razón: eran 5 líneas —2 horizontales del border-y + 3 verticales entre
    // columnas— dentro de una franja de ~60px, y se leía rayado.
    //
    // Se sustituyen por un FONDO SÓLIDO SUAVE con radio, no por glass. El
    // glass tiene historial en esta base de código: el commit 29cebf4 arregló
    // que un minificador se comía `backdrop-filter` y el bug SOLO se veía en
    // producción. Meter glass nuevo reabre esa puerta a cambio de nada — el
    // problema del cliente son las líneas, no la falta de transparencia.
    <ul className={`grid grid-cols-1 gap-y-5 rounded-2xl bg-papel-hueso px-5 py-5 gap-x-8 sm:grid-cols-2 ${columnas}`}>
      {datos.map((d) => (
        <li
          key={d.etiqueta}
          // El separador solo existe en lg:, que es donde está garantizado
          // que las columnas van todas en UNA fila. En sm: (dos columnas y
          // dos filas) una línea vertical cortaría por la mitad y parecería
          // un error de tabla.
          // items-start, no items-center: «Para dispositivos móviles» ocupa
          // dos líneas y el resto una, y centrando cada celda los cuatro
          // iconos acababan a alturas distintas — exactamente el desorden
          // que este bloque venía a arreglar. Anclados arriba, la fila de
          // iconos y la de etiquetas quedan a la misma altura pase lo que
          // pase con el largo del valor.
          // [v2] Sin `border-l`: las 3 líneas verticales entre columnas eran la
          // mitad del «rayado» que el cliente señaló. El fondo común del <ul>
          // ya dice que los cuatro campos son una misma tabla; la retícula
          // sigue alineando los iconos sin necesidad de dibujar la separación.
          className="flex items-start gap-3"
        >
          <span
            aria-hidden="true"
            className="grid size-9 shrink-0 place-items-center rounded-full bg-aqua-tint text-aqua-dark"
          >
            <d.icono className="size-4" />
          </span>
          <span className="min-w-0">
            <span className="block text-eyebrow font-semibold tracking-wide text-navy-soft uppercase">
              {d.etiqueta}
            </span>
            <span className="block text-sm font-medium text-navy">{d.valor}</span>
          </span>
        </li>
      ))}
    </ul>
  )
}
