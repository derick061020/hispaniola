import { useState } from 'react'
import { TituloSeccion } from '@/components/tour/titulo-seccion'
import { Estrellas } from '@/components/ui/estrellas'
import { BLOQUE_FICHA } from '@/components/tour/bloque-ficha'
import { useDevFlag } from '@/dev/use-dev-flag'
import { QUOTES, type Review, type Tour } from '@/data/home'

// Opiniones (wireframe A5 · fix 1.2 de analisis/revision-wireframes.md).
//
// FORMATO: DOS TICKERS EN DIRECCIONES OPUESTAS (Samuel, 2026-07-22: «las
// reseñas que sean solo 2 filas, una ticker infinita hacia la izquierda y
// otra infinita a la derecha»).
//
// Es la tercera forma que toma esta sección, así que conviene dejar el hilo:
// una quote fija → marquee de una fila (Samuel, PLAN-INTERNAS-V2 §C3) →
// rejilla 2×2 (correcciones v1 del cliente, «mejorar formato de reseñas») →
// dos tickers opuestos. La rejilla resolvía un problema real (una fila que
// se desplaza obliga a leer al ritmo de la animación) pero costaba mucho
// alto: cinco reseñas en rejilla son tres filas de card, en mitad de la
// página donde el visitante ya lleva leyendo itinerario, menú y precios.
// Las dos filas cruzadas devuelven el alto y arreglan lo que sí fallaba del
// marquee original: se pausa al hover, así que quien quiera leer una reseña
// la para; y con dos direcciones el ojo no persigue nada — hay movimiento
// permanente en pantalla sin que ninguna fila «se escape».
//
// ⚠️ LAS DOS FILAS LLEVAN LAS MISMAS 5 RESEÑAS, no 10. La segunda va
// ROTADA (empieza por la 3ª) para que las columnas no queden emparejadas y
// no se lea como una fila duplicada. No es un truco de relleno, es todo el
// material que hay: el pool es QUOTES (data/home.ts), las mismas 5 reales
// que usa la home. No existen reseñas por-tour en ninguna fuente del
// proyecto (prototipo/datos.js tampoco las tiene) e inventarlas sería peor
// que reusarlas. Si el loop se siente corto, hacen falta más reseñas
// REALES — pedirlas, no escribirlas.
//
// ⚠️ SIGUE SIN BARRAS DE DISTRIBUCIÓN (92% 5★, 6% 4★…). El wireframe las
// dibujó como placeholder y las correcciones v1 del cliente las volvieron a
// pedir con una maqueta que muestra 5★ 92% · 4★ 6% · 3★ 1% · 2★ 1% · 1★ 0%.
// Esos porcentajes se los inventó la IA con la que el cliente hizo la
// maqueta: no tenemos el desglose por estrellas de Google, TripAdvisor ni
// Viator. Una distribución inventada es peor que no tenerla — es una
// estadística falsa sobre la satisfacción de clientes reales, y encima
// cuadraría sospechosamente bien con el 4.9 que ya mostramos. El hueco
// sigue reservado y PEDIDO al cliente, no rellenado.
//
// CERO ENLACES DE SALIDA, como siempre (Samuel: «no quiero que lleven a
// TripAdvisor»): nada que distraiga de la decisión en el momento exacto en
// que se está tomando.
//
// Mecánica: pista duplicada 2× y loop invisible con `translate: -50% 0`,
// igual que el ticker del hero — ver .opiniones-marquee-* en componentes.css
// para el porqué de cada pieza. La fila que va a la derecha es la MISMA
// animación con `animation-direction: reverse`, no un segundo keyframe.

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex h-full flex-col justify-between gap-4 rounded-card bg-papel-hueso p-5">
      <p className="text-sm text-navy">«{review.texto}»</p>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-navy">{review.autor}</p>
          <p className="truncate text-xs text-navy-soft">
            {review.plataforma} · {review.fecha}
          </p>
        </div>
        <Estrellas calificacion={review.estrellas} />
      </div>
    </div>
  )
}

function Fila({
  reviews,
  derecha = false,
  pausado,
  estatico,
}: {
  reviews: Review[]
  derecha?: boolean
  pausado: boolean
  estatico: boolean
}) {
  const card = (r: Review, key: string, oculto: boolean) => (
    // items-stretch es el default del flex de la pista, así que las cards de
    // una misma fila se igualan solas a la más alta — no hace falta fijarles
    // un alto (que se rompería con la reseña más larga o dejaría hueco con
    // la más corta). Y como las dos filas llevan las mismas 5 reseñas, las
    // dos acaban con el mismo alto sin coordinarse.
    <div key={key} aria-hidden={oculto || undefined} className="opiniones-marquee-card">
      <ReviewCard review={r} />
    </div>
  )

  return (
    <div className={`opiniones-marquee-wrapper ${estatico ? 'opiniones-marquee-wrapper--estatico' : ''}`}>
      <div
        className={`opiniones-marquee-pista ${derecha ? 'opiniones-marquee-pista--derecha' : ''} ${
          pausado ? 'opiniones-marquee-pista--pausada' : ''
        }`}
      >
        {reviews.map((r) => card(r, r.id, false))}
        {/* 2ª copia para el loop del -50%, oculta a lectores de pantalla —
            mismo trato que el ticker del hero. Sin animación no hace falta:
            la fila se recorre a mano. */}
        {!estatico ? reviews.map((r) => card(r, `dup-${r.id}`, true)) : null}
      </div>
    </div>
  )
}

export function OpinionesTour({ tour }: { tour: Tour }) {
  const [pausado, setPausado] = useState(false)
  // [dev-mode] ?dev-opiniones=pausado congela las dos filas en su posición
  // actual — el frame que viaja a Figma (a Figma no va animación). Vuelve al
  // registry: se había retirado cuando la sección pasó a rejilla y no
  // quedaba nada que pausar.
  useDevFlag('dev-opiniones', (v) => {
    if (v === 'pausado') setPausado(true)
  })

  // WCAG 2.2.2: sin movimiento automático, una sola copia y scroll a mano.
  // Se lee en runtime porque la @media de CSS no es consultable desde JS sin
  // matchMedia — mismo patrón que ChecksTicker.
  const estatico =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // La 2ª fila arranca por la 3ª reseña. Con 5 cards, rotar 2 deja las dos
  // filas desfasadas de forma que ninguna columna repite autor a la vista.
  const rotadas = [...QUOTES.slice(2), ...QUOTES.slice(0, 2)]

  return (
    <section id="ancla-opiniones" className={`${BLOQUE_FICHA} scroll-mt-sticky-top`}>
      <TituloSeccion>Reviews</TituloSeccion>

      <div className="mt-5 flex items-center gap-4">
        <p className="font-display text-h2 font-semibold text-navy">
          {tour.rating}
          <span className="text-lead font-normal text-navy-soft"> / 5</span>
        </p>
        <div>
          <Estrellas calificacion={tour.rating} />
          <p className="mt-1 text-sm text-navy-soft">{tour.resenas.toLocaleString('en-US')} reseñas verificadas</p>
        </div>
      </div>

      {/* Las filas SANGRAN hasta el borde del bloque (-mx-6 / -mx-8 = el
          padding de BLOQUE_FICHA, en negativo). Un marquee que empieza y
          acaba dentro del padding se lee como una lista recortada; llegando
          al canto se lee como algo que sigue más allá — que es la idea. El
          difuminado de los extremos (mask en el wrapper) hace el resto:
          las cards se desvanecen en vez de aparecer y desaparecer de golpe
          contra el borde de la card. */}
      <div className="-mx-6 mt-6 flex flex-col gap-4 sm:-mx-8">
        <Fila reviews={QUOTES} pausado={pausado} estatico={estatico} />
        <Fila reviews={rotadas} derecha pausado={pausado} estatico={estatico} />
      </div>
    </section>
  )
}
