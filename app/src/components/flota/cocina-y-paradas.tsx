import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Etiqueta } from '@/components/ui/etiqueta'
import { COCINA_Y_PARADAS } from '@/data/flota'
import { COCINA_FLOTANTE } from '@/data/nosotros'

// LA COCINA FLOTANTE Y LAS 3 PARADAS (slides 32-34).
//
// Slide 32, nota del cliente: «Además destacar esta sección dado que ser la
// única cocina flotante de Punta Cana hay que destacarlo».
//
// ── ESTA SECCIÓN SE MONTÓ PRIMERO EN OSCURO Y SE REHIZO ──────────────────
// El slide 33 es una maqueta en tema oscuro y el primer montaje la siguió al
// pie, con la familia --color-premium-* (fondo casi negro, acentos de oro) y
// a sangre. Samuel lo descartó al verlo en la página: «quita todo ese tema
// oscuro, sigamos con los colores y la estética clara en esas secciones, el
// cambio es demasiado brusco».
//
// El motivo no se ve mirando la slide suelta: ahí el bloque está solo. En la
// página llega DESPUÉS de la presentación, de las 6 cards y de sus fichas,
// todo sobre papel — y una banda casi negra a sangre en medio de eso no se
// lee como lujo, se lee como haber cambiado de web. Además dejaba de ser una
// sección más para convertirse en el acontecimiento de la página, cuando las
// protagonistas son las embarcaciones.
//
// ── LOS 4 PATRONES DE RELLENO QUE SE FUERON CON ÉL ───────────────────────
// (Samuel: «no uses patrones tan de IA, como los puntos de bullet points que
// estás usando, la línea antes del badge, una línea divisoria y luego un
// texto pequeño; volviste a separar contenido usando líneas y ya, muchas
// cosas se ven IA slop genérica».) Cada uno, y qué ocupa su lugar:
//
//   1. LA RAYITA antes del eyebrow (`— SOLO CON HISPANIOLA`). Fuera. El
//      eyebrow del sitio es `ui/etiqueta.tsx` y es solo texto desde v3-F17.1,
//      precisamente porque la píldora anterior sobraba. Inventarle un guion
//      aquí era volver atrás con otro adorno.
//
//   2. LOS BULLETS EN CÍRCULO de los 3 puntos. Fuera — pero los 3 puntos NO
//      se pierden: bajan a ser el PIE DE LAS 3 FOTOS que los demuestran. Es
//      el cambio que más mejora la sección: «Chef cocinando a bordo» junto a
//      la foto del chef cocinando a bordo es una prueba; la misma frase con
//      un punto de color al lado es una lista de la compra. Y de paso
//      desaparece la columna de viñetas, que era el elemento más genérico.
//
//   3. LA LÍNEA DIVISORIA + FRASE PEQUEÑA que abría la banda («Lo que vives
//      con nosotros no lo vives en cualquier excursión», centrada bajo un
//      hairline). Fuera entera: no decía nada que el titular no diga, y ese
//      combo —regla fina, texto de 14px centrado— es exactamente el gesto que
//      Samuel señala.
//
//   4. LAS 3 CIFRAS separadas por líneas verticales. Fuera la fila. «La única
//      cocina flotante» era el H2 repetido en formato de cifra —el patrón
//      literal a evitar—, y lo que sí aportaban las otras dos (0% recalentado,
//      7 platos) pasó a un párrafo redactado aquí, `COCINA_Y_PARADAS.detalle`
//      — retirado el 2026-08-07 por no ser copy aprobado: esas dos cifras ya
//      las dice `COCINA_FLOTANTE.textoExtra[0]`, que sí lo es.
//      También se retira la tira «Míralo por dentro»: con las 3 fotos-prueba y
//      las 3 paradas ya había una cuarta fila de fotos en la misma sección.
//
// Lo que ordena ahora la sección no son reglas ni cajas: es el ritmo de
// bloque grande → tres pruebas → tres paradas, y el aire entre ellos.
//
// ⚠️ DUPLICACIÓN A RESOLVER CON SAMUEL: /instalaciones monta
// `nosotros/experiencia-abordo.tsx`, que cuenta la cocina flotante y las 3
// paradas también en claro. El copy es fuente única (los dos importan de
// data/nosotros.ts), pero el visitante que pase por las dos páginas lo verá
// dos veces. Hay que decidir cuál se queda con la sección.
export function CocinaYParadas() {
  return (
    <section className="flex flex-col gap-16 lg:gap-24">
      {/* ── LA COCINA FLOTANTE ─────────────────────────────────────────── */}
      <div>
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
          <div>
            <Etiqueta>{COCINA_FLOTANTE.eyebrow}</Etiqueta>
            <h2 className="mt-3 max-w-xl text-balance font-display text-h2 font-semibold text-navy">
              {COCINA_FLOTANTE.titulo}
            </h2>
            <p className="mt-5 max-w-xl text-lead text-navy-sub">{COCINA_FLOTANTE.texto}</p>
            {/* [v3 2026-08-06] Los dos parrafos que el copy aprobado añade.
                Van en cuerpo normal, no en lead: el primero es el gancho
                sensorial y estos dos son el detalle y el remate. */}
            {COCINA_FLOTANTE.textoExtra?.map((t) => (
              <p key={t.slice(0, 30)} className="mt-3 max-w-xl text-navy-sub">
                {t}
              </p>
            ))}

            <Link
              to={COCINA_Y_PARADAS.cta.to}
              className="group mt-7 inline-flex items-center gap-2 rounded-btn bg-coral px-6 py-3.5 text-sm font-semibold text-white shadow-boton-fancy transition hover:bg-coral-dark"
            >
              {COCINA_Y_PARADAS.cta.label}
              <ArrowRight
                className="size-4 transition-transform duration-200 motion-safe:group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>

          {/* La foto del RESULTADO (gente comiendo a bordo), no de la cocina:
              la cocina va abajo, en las pruebas, y aquí lo que el visitante se
              está imaginando mientras lee es el plato delante. El badge
              «Único en Punta Cana» va sobre esta foto porque es la grande. */}
          <figure className="relative overflow-hidden rounded-card-grande">
            <img
              src={`/fotos/${COCINA_Y_PARADAS.foto}.webp`}
              alt={COCINA_Y_PARADAS.fotoAlt}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover"
            />
            <figcaption className="absolute left-4 top-4 rounded-chip bg-navy px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
              {COCINA_FLOTANTE.badge}
            </figcaption>
          </figure>
        </div>

        {/* LAS 3 PRUEBAS. Cada afirmación bajo la foto que la sostiene — ver
            el punto 2 del comentario de cabecera. Sin marco, sin caja y sin
            viñeta: la foto ya es el contenedor. */}
        <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3 lg:mt-14">
          {COCINA_FLOTANTE.puntos.map((punto, i) => {
            const prueba = COCINA_Y_PARADAS.pruebas[i]
            if (!prueba) return null
            return (
              <li key={punto} className="nosotros-cascada">
                <figure>
                  <img
                    src={`/fotos/${prueba.foto}.webp`}
                    alt={prueba.alt}
                    loading="lazy"
                    className="aspect-[4/3] w-full rounded-card object-cover"
                  />
                  <figcaption className="mt-3 font-display text-lead font-semibold text-navy">
                    {punto}
                  </figcaption>
                </figure>
              </li>
            )
          })}
        </ul>
      </div>

      {/* ── LAS 3 PARADAS (slide 34) ───────────────────────────────────── */}
      <div>
      {/* [v3 2026-08-06, PowerPoint slide 70] AQUI VIVIAN LAS 3 PARADAS («Un
          dia de mar en 3 paradas»). El cliente las tacha de /flota: esta
          pagina va de los BARCOS, y el recorrido ya se cuenta —con horas,
          fotos y detalle— en el itinerario de cada ficha de tour, que es
          donde decide quien esta comprando. Aqui repetirlo alargaba la
          pagina sin decir nada nuevo.
          EXPERIENCIA_ABORDO sigue en data/nosotros.ts: lo consume la home. */}
      </div>
    </section>
  )
}
