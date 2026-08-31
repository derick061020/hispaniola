import { useRef, useState } from 'react'
import { BadgeCheck } from 'lucide-react'
import { Etiqueta } from '@/components/ui/etiqueta'
import { Estrellas } from '@/components/ui/estrellas'
import { BotonSonido } from '@/components/ui/boton-sonido'
import { useFilaArrastrable } from '@/components/home/use-fila-arrastrable'
import {
  RESENAS_MURO,
  VIDEO_TESTIMONIOS,
  PLATAFORMAS_RESENAS,
  URL_RESENA_GOOGLE,
  URL_RESENAS_GOOGLE,
  RESENAS_AGREGADO,
  type Review,
  type VideoTestimonio,
} from '@/data/home'
import { useDevFlag } from '@/dev/use-dev-flag'
import { numero, t } from '@/lib/i18n'

// «Reseñas verificadas» — v7 (Samuel, 2026-07-22, sobre la maqueta de las
// correcciones v1 del cliente). Estructura:
//
//   [Eyebrow + h2 + lead, centrados]
//   [Barra de confianza: agregado + las 3 plataformas con su nota]
//   ┌───────────────────────┬───────────────────────┐
//   │ video-testimonio 1    │ video-testimonio 2    │
//   │ (estrellas · quote ·  │                       │
//   │  quiénes son y de     │                       │
//   │  dónde nos visitaron) │                       │
//   └───────────────────────┴───────────────────────┘
//   ┌───────────────────────────────────────────────┐
//   │ ←←← fila 1 de cards                           │
//   │ fila 2 de cards →→→                           │
//   │ ←←← fila 3 de cards                           │
//   └───────────────────────────────────────────────┘
//   [Ver las N reseñas]  [Déjanos tu reseña]
//
// QUÉ CAMBIA RESPECTO A LA v6 y por qué. La v6 era «1 video a la izquierda +
// slider vertical de 2 quotes a la derecha». Tenía dos problemas que el
// cliente señaló en su PDF y Samuel confirmó: (a) el slider enseñaba 2
// reseñas de 5 y obligaba a esperar a que rotara para ver el resto —
// exactamente lo contrario de lo que hace la prueba social, que funciona por
// VOLUMEN; y (b) el único video era un mensaje de la marca (los
// cofundadores), no un cliente. Ahora el volumen se ve de un golpe (3 filas
// desfilando) y los dos videos son testimonios de gente que vino.
//
// El desfile no es decorativo: al pausarse en hover y poder arrastrarse, la
// sección deja de ser un carrusel que manda y pasa a ser un muro que se
// puede recorrer. Mecánica en use-fila-arrastrable.ts + el bloque
// .reviews-muro-* de componentes.css.

/** Cuántas veces se repite el grupo de cards dentro de cada pista. El porqué
 *  de que sean 3 y no 2 está en componentes.css (.reviews-muro-*): el
 *  desfile puede llegar a -1 copia y el arrastre a otra, y hace falta una
 *  tercera para que la ventana nunca se quede vacía. */
const COPIAS_EN_PISTA = 3

/** En cuántas filas se reparte el muro. */
// [v2 2026-07-27] De 3 filas a 2 (slide 3: «Dejar en 2 filas»). Con menos
// filas cada una lleva MAS cards, asi que la pista es mas larga: las
// duraciones de .reviews-muro-* en componentes.css se reajustan a la par o el
// muro se ve lento.
const FILAS = 2

// Barra de confianza multi-plataforma (correcciones v1, slides 11-12). El
// agregado grande a la izquierda; las 3 plataformas a la derecha, cada una
// con SU nota, sus estrellas y su distinción.
//
// Los nombres van como texto y no como logo de marca: no tenemos los SVG
// oficiales en el repo y un logo mal reproducido se ve peor que el nombre
// bien compuesto — cuando el cliente mande los assets (y las URLs de sus
// perfiles) esto pasa a ser una fila de logos enlazados.
//
// ⚠️ Las notas por plataforma vienen del PDF del cliente y están marcadas
// como `porConfirmar` en data/home.ts — hay que pedírselas por escrito antes
// de publicar. Ahí está el razonamiento completo.
function BarraPlataformas() {
  return (
    <div className="mt-8 flex flex-col gap-6 rounded-card-grande bg-papel-hueso px-6 py-6 lg:flex-row lg:items-center lg:gap-10 lg:px-8">
      {/* Agregado real — el mismo número que el hero y el footer */}
      <div className="flex shrink-0 items-center gap-4">
        <p className="font-display text-hero-movil font-semibold leading-none text-navy">
          {RESENAS_AGREGADO.rating}
        </p>
        <div>
          <Estrellas calificacion={5} />
          <p className="mt-1 text-sm text-navy-soft">
            {numero(RESENAS_AGREGADO.total)} {t('verified reviews')}
          </p>
        </div>
      </div>

      <div aria-hidden="true" className="hidden h-12 w-px shrink-0 bg-linea lg:block" />

      <ul className="grid flex-1 gap-5 sm:grid-cols-3 sm:gap-6">
        {PLATAFORMAS_RESENAS.map((p) => (
          <li key={p.id}>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-navy">{p.nombre}</p>
              <p className="text-sm font-semibold text-navy">{p.rating}</p>
              <Estrellas calificacion={p.ratingNumero} />
            </div>
            <p className="mt-1 text-xs text-navy-soft">{p.distincion}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Iniciales({ nombre }: { nombre: string }) {
  // No tenemos fotos de clientes (privacidad) — iniciales en círculo
  // aqua-tint como placeholder honesto, no inventado.
  const iniciales = nombre
    .split(/\s+/)
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
  return (
    <div
      aria-hidden="true"
      className="grid size-10 shrink-0 place-items-center rounded-full bg-aqua-tint text-sm font-semibold text-aqua-dark"
    >
      {iniciales}
    </div>
  )
}

// Video-testimonio. Es la MISMA caja de la v6 (video a sangre + degradado
// navy + texto blanco abajo), con tres cambios pedidos por Samuel:
//   - encima de la frase, la prueba de que es una reseña: estrellas + dónde
//     la dejó,
//   - la frase, que es lo que ya teníamos, y
//   - debajo, una línea más pequeña y sutil con quiénes son y de dónde nos
//     visitaron (lo que en las cards del muro es el `lugar`).
// El chip «Video testimonio» arriba a la izquierda es de la maqueta del
// cliente: sin él, un video que arranca solo y sin sonido se lee como
// ambiente de marca, no como alguien contando su día.
function VideoTestimonioBox({ testimonio }: { testimonio: VideoTestimonio }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  return (
    <figure className="relative aspect-[4/3] overflow-hidden rounded-card-grande bg-navy shadow-card sm:aspect-[16/10]">
      <video
        ref={videoRef}
        className="absolute inset-0 size-full object-cover"
        src={testimonio.videoSrc}
        poster={testimonio.videoPoster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={`Video review from ${testimonio.quienes}`}
      />
      {/* Degradado para legibilidad: denso abajo (donde va el texto), se
          desvanece hacia arriba. Solo tokens — sin valores sueltos. */}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/40 to-transparent" />

      <span className="absolute left-5 top-5 rounded-chip bg-white/15 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/25 backdrop-blur-sm">
        {t('Video review')}
      </span>

      {/* Arriba a la DERECHA: es la única esquina libre — el chip ocupa la
          izquierda y el figcaption toma toda la banda de abajo. */}
      <BotonSonido videoRef={videoRef} className="absolute right-5 top-5 z-10" />

      <figcaption className="absolute inset-x-0 bottom-0 p-6 text-white lg:p-8">
        <div className="flex items-center gap-2">
          <Estrellas calificacion={5} sobreOscuro />
          <span className="text-xs text-white/80">{t('Review on')}{' '}{testimonio.plataforma}</span>
        </div>
        <blockquote className="mt-3 font-display text-h3 font-semibold">
          {t('“')}{testimonio.frase}{t('”')}
        </blockquote>
        {/* La línea sutil: quiénes son y de dónde nos visitaron. Deliberadamente
            más pequeña y más apagada que la frase — es el pie de la cita, no
            compite con ella. */}
        <p className="mt-2 text-sm text-white/70">
          {testimonio.quienes} · {testimonio.procedencia}
        </p>
      </figcaption>
    </figure>
  )
}

// Card del muro — formato convencional de reseña (pedido de Samuel: «cards
// de testimonios más convencionales»), leído de un vistazo mientras pasa:
// quién · dónde la dejó · nota · texto · verificada. Adiós a la comilla
// decorativa gigante de la v6: a este tamaño se comía la mitad de la card.
function CardResena({ review, oculto }: { review: Review; oculto: boolean }) {
  return (
    <article
      // aria-hidden en las copias del loop: el lector de pantalla oiría la
      // misma reseña 3 veces (mismo trato que el ticker del hero).
      aria-hidden={oculto || undefined}
      // `border` y NO `ring`: Tailwind pinta el ring como box-shadow POR FUERA
      // de la caja, y la fila lleva overflow-hidden al ras del alto de la card
      // — el hairline de arriba y el de abajo caían justo en el corte y no se
      // veían (la card parecía abierta por los dos lados). El border va dentro
      // del border-box, así que sobrevive al recorte.
      className="reviews-muro-card flex flex-col gap-3 rounded-card border border-linea bg-papel p-5"
    >
      <header className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Iniciales nombre={review.autor} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-navy">{review.autor}</p>
            <p className="truncate text-xs text-navy-soft">{review.lugar}</p>
          </div>
        </div>
        <span className="shrink-0 rounded-chip bg-papel-hueso px-2.5 py-1 text-xs text-navy-soft">
          {review.plataforma}
        </span>
      </header>

      <div className="flex items-center gap-2">
        <Estrellas calificacion={review.estrellas} />
        <span className="text-xs text-navy-soft">{review.fecha}</span>
      </div>

      {/* line-clamp: las reseñas no miden lo mismo y sin tope una card el
          doble de alta desalinea la fila entera (todas estiran al alto de la
          más alta). 4 líneas es lo que se alcanza a leer mientras pasa. */}
      <p className="line-clamp-4 text-sm text-navy">{t('“')}{review.texto}{t('”')}</p>

      <p className="mt-auto flex items-center gap-1.5 text-xs font-medium text-menta-texto">
        <BadgeCheck className="size-4 shrink-0" aria-hidden="true" />
        {t('Verified review')}
      </p>
    </article>
  )
}

function FilaMuro({
  resenas,
  indice,
  pausado,
  reducirMovimiento,
}: {
  resenas: Review[]
  /** 0, 1, 2 — decide duración y sentido. La del medio va al revés. */
  indice: number
  pausado: boolean
  reducirMovimiento: boolean
}) {
  const copias = reducirMovimiento ? 1 : COPIAS_EN_PISTA
  const { arrastreRef, arrastrando, manejadores } = useFilaArrastrable({
    copias,
    activo: !reducirMovimiento,
  })

  return (
    <div
      className="reviews-muro-fila"
      style={{
        // pan-y: el gesto vertical sigue siendo scroll de la página. Sin esto
        // el navegador se queda el arrastre horizontal y el dedo no mueve la
        // fila en móvil.
        touchAction: 'pan-y',
        cursor: reducirMovimiento ? undefined : arrastrando ? 'grabbing' : 'grab',
        userSelect: arrastrando ? 'none' : undefined,
      }}
      {...manejadores}
      role="group"
      aria-label={`Customer reviews, row ${indice + 1}`}
    >
      <div ref={arrastreRef} className="reviews-muro-arrastre">
        <div
          className={[
            'reviews-muro-pista',
            // Cada fila lee SU token de duración vía su clase (descoordinadas,
            // el muro respira). La clase y no un style inline: ver el porqué
            // en componentes.css — con el nombre de la variable armado en
            // runtime, Tailwind no la emite y la fila se queda quieta.
            `reviews-muro-pista--fila-${indice + 1}`,
            indice === 1 ? 'reviews-muro-pista--derecha' : '',
            pausado || arrastrando ? 'reviews-muro-pista--pausada' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {Array.from({ length: copias }).flatMap((_, copia) =>
            resenas.map((r) => (
              <CardResena key={`${copia}-${r.id}`} review={r} oculto={copia > 0} />
            )),
          )}
        </div>
      </div>
    </div>
  )
}

export function Reviews() {
  const [pausado, setPausado] = useState(false)

  // [dev-mode] ?dev-reviews=pausado congela las 3 filas → frame limpio
  // para Figma. Misma mecánica que ?dev-ticker=pausado.
  useDevFlag('dev-reviews', (v) => setPausado(v === 'pausado')) // [dev-mode]

  const reducirMovimiento =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Reparto en 3 filas alternando (0,1,2,0,1,2…) y no en 3 bloques seguidos:
  // así las 5 reseñas REALES —que en RESENAS_MURO van una de cada cuatro—
  // caen repartidas entre las tres filas en vez de amontonarse en la primera.
  const filas = Array.from({ length: FILAS }, (_, f) =>
    RESENAS_MURO.filter((_, i) => i % FILAS === f),
  )

  return (
    <section className="px-5 py-seccion-sm sm:px-10 sm:py-seccion">
      <div className="mx-auto max-w-contenido">
        <div className="text-center">
          <Etiqueta>{t('Verified reviews')}</Etiqueta>
          <h2 className="mt-3 font-display text-h2 font-semibold text-navy">
            {t('What our travelers say')}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-lead text-navy-sub">
            {t('Thousands of families, couples and groups of friends have already had their Caribbean day with us.')}
          </p>
        </div>

        <BarraPlataformas />

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {VIDEO_TESTIMONIOS.map((video) => (
            <VideoTestimonioBox key={video.id} testimonio={video} />
          ))}
        </div>

        {/* Las 3 filas, directamente sobre el papel: el muro nació dentro de un
            panel gris (bg-papel-hueso) y Samuel lo quitó — con la barra de
            plataformas ya en gris justo encima, el segundo bloque gris partía
            la sección en dos cajas y las cards perdían el protagonismo. Sobre
            blanco, lo único que define cada card es su hairline, y por eso ese
            borde tiene que verse entero (ver el comentario de CardResena).

            Va acotado al ancho de contenido (no a sangre) por una razón
            mecánica además de estética: una copia de fila mide ~6 cards ≈
            2100px, y el loop solo se ve continuo mientras la ventana visible
            sea más estrecha que una copia. A ancho de contenido (1400px) eso
            se cumple siempre; a sangre, en un monitor ultra-ancho podría
            asomar el hueco. */}
        <div className="mt-8 flex flex-col gap-reviews-fila">
          {filas.map((resenas, i) => (
            <FilaMuro
              key={i}
              resenas={resenas}
              indice={i}
              pausado={pausado}
              reducirMovimiento={reducirMovimiento}
            />
          ))}
        </div>

        {/* Cierre: ver todas + dejar la tuya (correcciones v1, slide 11:
            «botón agregar reseña»).

            [2026-08-31] LOS DOS YA TIENEN DESTINO, y los dos son Google:
            «Leave us a review» abre el formulario de reseña directamente
            (URL_RESENA_GOOGLE) y «See all …» la ficha de Maps, que es donde
            están publicadas (URL_RESENAS_GOOGLE) — las dos en data/home.ts.
            Dejan de ser EnlacePrototipo: ya no hay ninguno en esta sección. */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={URL_RESENAS_GOOGLE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-btn px-5 py-3 text-sm font-semibold text-navy ring-1 ring-linea transition-colors hover:bg-papel-hueso"
          >
            {t('See all')}{' '}{numero(RESENAS_AGREGADO.total)} {t('reviews')}
          </a>
          <a
            href={URL_RESENA_GOOGLE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-btn bg-coral px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-coral-dark"
          >
            {t('Leave us a review')}
          </a>
        </div>
      </div>
    </section>
  )
}
