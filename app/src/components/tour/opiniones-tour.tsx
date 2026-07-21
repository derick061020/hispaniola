import { TituloSeccion } from '@/components/tour/titulo-seccion'
import { Estrellas } from '@/components/ui/estrellas'
import { BLOQUE_FICHA } from '@/components/tour/bloque-ficha'
import { QUOTES, type Review, type Tour } from '@/data/home'

// Opiniones (wireframe A5 · fix 1.2 de analisis/revision-wireframes.md).
//
// PLAN-INTERNAS-V2.md (§C3, pedido de Samuel): fuera el link de salida —
// «no quiero que lleven a TripAdvisor» — y el resumen (rating + reseñas
// verificadas) pasa a preceder un MARQUEE horizontal infinito de reseñas, en
// vez de una sola quote fija. El ⚠️ anti-Viator de siempre sigue vigente en
// otro sentido: CERO enlaces de salida en esta sección, ni a Viator ni ya a
// TripAdvisor — nada que distraiga de la decisión en el momento exacto en
// que se está tomando.
//
// El pool de reseñas es QUOTES (data/home.ts) — las mismas 5 reales que usa
// la home, no un texto redactado para la ficha: no hay reseñas por-tour en
// ninguna fuente del proyecto (prototipo/datos.js tampoco las tiene), y
// inventarlas sería peor que reusar las genéricas. Si el loop se siente
// corto, hacen falta más reseñas REALES (pedirlas, no inventarlas — ver
// PLAN-INTERNAS-V2.md §Decisiones abiertas). La quote destacada de ESTE tour
// (`ficha.quoteDestacada`) sigue haciendo su trabajo donde ya vivía — flotando
// sobre la 1ª foto del mosaico, ahora incrustado en el propio hero
// (internas/galeria-hero.tsx) — así que no se pierde, solo deja de
// repetirse aquí.
//
// Mecánica: pista duplicada 2x, igual que el ticker del hero — ver el
// bloque .opiniones-marquee-* en componentes.css para el porqué de cada
// pieza. Pausa al hover (CSS) y con prefers-reduced-motion no avanza sola
// (WCAG 2.2.2): una sola copia, scrollable a mano.
//
// ⚠️ SIGUE SIN BARRAS DE DISTRIBUCIÓN (92% 5★, 6% 4★…), y ahora hay que
// explicarlo dos veces. El wireframe las dibujó como placeholder y se
// descartaron porque el dato no existe en ninguna fuente del proyecto
// (decisión abierta §13.5). Las CORRECCIONES v1 DEL CLIENTE (2026-07-20,
// planes/02-producto.md slide 5: «mejorar formato de reseñas») vuelven a
// pedirlas, con una maqueta que muestra 5★ 92% · 4★ 6% · 3★ 1% · 2★ 1% ·
// 1★ 0%.
//
// Esos porcentajes se los inventó la IA con la que el cliente hizo la
// maqueta: no tenemos el desglose por estrellas de Google, TripAdvisor ni
// Viator. Una distribución inventada es peor que no tenerla — es una
// estadística falsa sobre la satisfacción de clientes reales, y además
// cuadraría sospechosamente bien con el 4.9 que ya mostramos. Así que el
// hueco sigue reservado y PEDIDO al cliente (ver el plan), no rellenado.
//
// Lo que SÍ se ejecuta del slide 5: el formato pasa de marquee a GRID (era
// la otra mitad de la petición, y es la que sí se puede hacer con datos
// reales) — ver abajo.

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

// Sin estado: al pasar de marquee a grid desaparecieron el `pausado` (que
// solo servía para congelar la animación) y el chequeo de reduced-motion (una
// rejilla estática ya respeta esa preferencia por definición). El deep-link
// ?dev-opiniones=pausado se retiró del registry en el mismo commit — no
// quedaba nada que pausar.
export function OpinionesTour({ tour }: { tour: Tour }) {
  return (
    <section id="ancla-opiniones" className={`${BLOQUE_FICHA} scroll-mt-sticky-top`}>
      <TituloSeccion>Opiniones</TituloSeccion>

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

      {/* GRID, no marquee (correcciones v1 del cliente, slide 5: «mejorar
          formato de reseñas» — su maqueta las pone en rejilla 2×2).

          El marquee horizontal fue decisión de Samuel (PLAN-INTERNAS-V2.md
          §C3) y tenía su lógica: llenaba el ancho con 5 reseñas sin ocupar
          alto. Pero el cliente tiene razón en que se lee peor — una reseña
          que se desplaza obliga a leer al ritmo de la animación, y aquí el
          visitante está evaluando si compra. En rejilla se leen todas de un
          vistazo y se pueden comparar.

          ⚠️ REVIERTE UNA DECISIÓN DE SAMUEL a petición del cliente. El CSS
          .opiniones-marquee-* sigue existiendo (lo usa el marquee de la home)
          por si se quiere volver. */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {QUOTES.map((q) => (
          <ReviewCard key={q.id} review={q} />
        ))}
      </div>
    </section>
  )
}
