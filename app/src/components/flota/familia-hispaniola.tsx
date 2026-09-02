import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Etiqueta } from '@/components/ui/etiqueta'
import { SelloTripAdvisor } from '@/components/ui/sello-tripadvisor'
import { FAMILIA_FLOTA } from '@/data/flota'
import { EQUIPO } from '@/data/nosotros'
import { t } from '@/lib/i18n'

// LA PRESENTACIÓN DE /flota — «Bienvenido a la familia Hispaniola», el dueño
// y el recorrido de años (slides 26 y 27 del PDF v2).
//
// Pedido de Samuel: «hay que poner la presentación de la familia Hispaniola,
// con una estructura similar al segundo slide que se plantea cuando se habla
// de esta página (la página 26 del PDF); agregar aquí el tema del dueño y el
// recorrido de años de Hispaniola, luego las cards de los botes».
//
// El slide 26 es una captura de la vieja /nosotros que el cliente usa de
// modelo. Su anatomía, respetada aquí:
//
//   ┌ texto ──────────────────┐ ┌ media ─────────────┐
//   │ eyebrow                 │ │ foto grande        │
//   │ titular                 │ │  · sello flotando  │
//   │ párrafo                 │ │  · card anidada    │
//   │ (caja de destacado:     │ │    abajo-derecha   │
//   │  retirada, ver abajo)   │ │                    │
//   │ cita del fundador       │ └────────────────────┘
//   │ CTA                     │
//   └─────────────────────────┘
//   ┌ banda de 4 KPIs ─────────────────────────────────┐
//
// TRES DECISIONES QUE NO SALEN DE LA CAPTURA:
//
// 1. LA CITA DEL DUEÑO VIVE AQUÍ, NO EN SU PROPIO PANEL. `NuestraHistoria`
//    (nosotros/nuestra-historia.tsx) abría con un panel gris enorme con el
//    retrato vertical y la cita a 32px. Tener ESE panel más esta presentación
//    en la misma página era decir dos veces lo mismo con dos pesos distintos
//    en pantalla y media de distancia. El slide 26 ya la trae, pequeña y
//    dentro del texto, que es donde funciona: es el remate del párrafo de
//    bienvenida, no una sección.
//
// 2. EL RECORRIDO DE AÑOS SE QUEDA PEGADO A LA PRESENTACIÓN. «De un barco a
//    una flota» es literalmente el relato de esta página, y entre la
//    bienvenida y las cards es el único sitio donde se lee como explicación
//    de lo que viene después (los barcos). Detrás de las cards habría sido un
//    epílogo.
//    ⚠️ SIGUE SIENDO CIERTO, pero el recorrido YA NO VIVE EN ESTE ARCHIVO
//    (2026-08-07): se fue a flota/recorrido-flota.tsx para poder sangrar hasta
//    el borde de la pantalla, lo que exige colgar fuera del contenedor de la
//    página. El ORDEN no cambia — pages/flota.tsx lo monta justo detrás de
//    esta sección, que es lo que decía esta nota.
//
// 3. LA CIFRA DE LA FLOTA SE LEE DE UN SOLO SITIO, NO SE ESCRIBE EN LA VISTA:
//    el KPI sale de `BARCOS_FLOTA` (data/flota.ts). Hasta el 2026-08-07 salía
//    de `FLOTA.length`, y eso hacía que la banda dijera «Fleet of 6» — la
//    cuenta de los barcos con ficha completa, no la flota. El cliente dice 12
//    y su timeline los nombra; ver el porqué de la constante.
export function FamiliaHispaniola() {
  // `cta?.` — el campo es opcional desde el 2026-07-28 (las cards de
  // /fundacion no llevan CTA). Aquí no cambia nada: los miembros de EQUIPO lo
  // siguen teniendo todos.
  const fundador = EQUIPO.find((m) => m.cta?.tipo === 'historia')

  return (
    <section className="flex flex-col gap-14 lg:gap-20">
      {/* ── BIENVENIDA (slide 26) ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
        <div className="order-2 lg:order-1">
          <Etiqueta>{FAMILIA_FLOTA.eyebrow}</Etiqueta>
          <h2 className="mt-3 max-w-xl text-balance font-display text-h2 font-semibold text-navy">
            {FAMILIA_FLOTA.titulo}
          </h2>
          <div className="mt-5 flex flex-col gap-4">
            {FAMILIA_FLOTA.parrafos.map((p) => (
              <p key={p} className="text-lead text-navy-sub">
                {p}
              </p>
            ))}
          </div>

          {/* [2026-08-07, pedido de Samuel] AQUÍ NO VA CAJA DE DESTACADO. La
              del slide (primero «Grupos pequeños», luego «Since 2010, a fleet
              of 12») se retira: sus dos datos son ya dos de los cuatro KPIs de
              la banda de abajo, y su párrafo es el que presenta el recorrido de
              años. La anatomía del slide 26 se respeta en todo lo demás; esta
              ranura se queda vacía a propósito, no por olvido.
              Con ella se va el único `bg-papel-hueso` de esta mitad: la banda
              de KPIs pasa a ser la única superficie gris de la sección, que es
              lo que la hace destacar. */}

          {/* EL DUEÑO. Sale de EQUIPO para que su frase no viva en dos sitios
              (la home ya la usa en su card de equipo).
              ⚠️ [desfasado] El retrato del CEO ya es el suyo real (3ª entrega,
              09/01). El resto de las caras del equipo sí siguen siendo stock — ver el aviso
              largo en data/nosotros.ts. Sustituir antes de publicar. */}
          {fundador ? (
            <figure className="mt-6 flex items-center gap-4">
              {fundador.foto ? (
                <img
                  src={`/fotos/${fundador.foto}.webp`}
                  alt={`${fundador.nombre}, ${fundador.rol}`}
                  loading="lazy"
                  className="size-14 shrink-0 rounded-full bg-aqua-tint object-cover object-top"
                />
              ) : null}
              <div>
                <blockquote className="text-sm font-medium italic text-navy-sub">«{fundador.quote}»</blockquote>
                <figcaption className="mt-1 text-xs text-navy-soft">
                  <span className="font-semibold text-navy">— {fundador.nombre}</span>,{' '}
                  {/* «since», no «desde»: se quedó en español en el barrido de
                      F7 porque es texto suelto en el JSX y no en data/. */}
                  {FAMILIA_FLOTA.duenoRolLargo} {t('· since')}{' '}{fundador.desde}
                </figcaption>
              </div>
            </figure>
          ) : null}

          <Link
            to={FAMILIA_FLOTA.cta.to}
            className="group mt-7 inline-flex items-center gap-2 rounded-btn bg-coral px-5 py-3 text-sm font-semibold text-white shadow-boton-fancy transition hover:bg-coral-dark"
          >
            {FAMILIA_FLOTA.cta.label}
            <ArrowRight
              className="size-4 transition-transform duration-200 motion-safe:group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>

        {/* MEDIA. El slide pone el sello de TripAdvisor flotando sobre la foto
            grande y una card anidada abajo a la derecha.
            `pb-16 pr-0 sm:pb-0 sm:pr-16`: la card anidada SOBRESALE del marco
            de la foto, así que el contenedor reserva ese vuelo — si no, se
            comería el hueco de la fila siguiente. */}
        <div className="relative order-1 pb-20 sm:pb-16 lg:order-2">
          <div className="overflow-hidden rounded-card-grande">
            <img
              src={`/fotos/${FAMILIA_FLOTA.foto}.webp`}
              alt={FAMILIA_FLOTA.fotoAlt}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>

          {/* EL SELLO, SOLO (Samuel, 2026-07-28: «deja solo el badge con su
              animación infinita, quita el background que tiene y el texto»).

              El panel existía POR EL TEXTO, no por el sello: el copy del
              componente va en blanco fijo y necesitaba una superficie oscura
              detrás para tener contraste sobre la foto. Sin texto, el motivo
              desaparece — y el sello se defiende solo, porque es un objeto de
              metal con volumen y no un icono plano. El reclamo no se pierde:
              baja a `sr-only` dentro del componente. La corona de picos sigue
              girando, que es lo que se pidió conservar.

              `drop-shadow-lg` es lo ÚNICO que sustituye al panel: un objeto
              sin sombra sobre una foto flota; con ella se apoya. */}
          <SelloTripAdvisor sinTexto className="absolute left-4 top-4 drop-shadow-lg" />

          {/* Card anidada — «Nuestros huéspedes». Con marco blanco para que se
              lea como una foto POR ENCIMA de la otra y no como un recorte. */}
          <figure className="absolute bottom-0 right-4 w-40 rounded-card bg-papel p-1.5 shadow-card-flotante sm:w-52">
            <img
              src={`/fotos/${FAMILIA_FLOTA.fotoAnidada}.webp`}
              alt={FAMILIA_FLOTA.fotoAnidadaAlt}
              loading="lazy"
              className="aspect-[4/3] w-full rounded-btn object-cover"
            />
            <figcaption className="px-1.5 py-1.5 text-xs font-medium text-navy-sub">
              {FAMILIA_FLOTA.fotoAnidadaPie}
            </figcaption>
          </figure>
        </div>
      </div>

      {/* ── BANDA DE KPIs (pie del slide 26) ───────────────────────────────
          SIN LÍNEAS PERO CON SUELO. Dos pasadas sobre el mismo bloque:
          1ª (Samuel): «que no esté separado así por líneas, al cliente no le
          gusta tanta línea» → fuera el marco y los separadores verticales.
          2ª (Samuel, al verlo): «ahora parece que están flotando».

          Las dos cosas son ciertas y no se contradicen: los hairlines hacían
          DOS trabajos a la vez —separar unas cifras de otras y apoyarlas
          contra el papel— y quitarlos se llevó también el segundo. El aire
          solo resuelve el primero.

          La solución es UNA superficie, no cuatro. Un `bg-papel-hueso` a lo
          ancho de la fila da el suelo que faltaba sin dibujar ni una línea, y
          —esto es lo que evita el «puras cajas» que Samuel ha señalado tres
          veces— las 4 cifras siguen siendo UN objeto: no hay cuatro tarjetas
          con su borde cada una. De paso rima con la caja de destacado de
          arriba, que ya usa ese mismo gris: la sección se lee con dos
          superficies del mismo material, no con cuatro invenciones.

          La separación entre columnas la sigue poniendo el `gap`, no un
          borde. */}
      <dl className="grid grid-cols-2 gap-x-8 gap-y-8 rounded-card-grande bg-papel-hueso px-6 py-8 sm:grid-cols-4 sm:gap-x-10 sm:px-10">
        {FAMILIA_FLOTA.kpis.map((kpi) => (
          <div key={kpi.cifra}>
            <dt className="font-display text-stat font-semibold text-navy">{kpi.cifra}</dt>
            <dd className="mt-1 text-sm text-navy-sub">{kpi.label}</dd>
          </div>
        ))}
      </dl>


    </section>
  )
}
