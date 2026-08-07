import { useCallback, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Etiqueta } from '@/components/ui/etiqueta'
import { COCINA_Y_PARADAS } from '@/data/flota'
import { COCINA_FLOTANTE } from '@/data/nosotros'
import { useTiemposCocina } from '@/components/flota/use-tiempos-cocina'
import { useDevFlag } from '@/dev/use-dev-flag'

// LA COCINA FLOTANTE, POR TIEMPOS — /flota (2026-08-07).
//
// ── DE DÓNDE SALE ────────────────────────────────────────────────────────
// Slide 69: «resaltar que es única en Punta Cana». Primera vuelta: 5
// propuestas de COLOR (banda naranja, carta, corte diagonal, foto oscura,
// bento). Samuel las descartó las cinco —«no me gusta ninguna para nada»— y
// eligió otra dirección: «un mecanismo, no una maqueta».
//
// Tenía razón, y el diagnóstico conviene dejarlo escrito porque es reutilizable:
// lo que hace que este sitio no parezca una plantilla no son sus fondos, son
// sus PIEZAS VIVAS —el catamarán que zarpa del CTA, la barra de potencia que se
// navega, el muro de caras. Cinco maquetaciones distintas del mismo bloque
// siguen siendo cinco bloques. Subir el volumen del color no sustituye a tener
// una idea.
//
// ── EL MECANISMO ─────────────────────────────────────────────────────────
// El copy aprobado YA es una secuencia: «The aroma comes first. Then the sound
// of the grill. Moments later, your meal is served». Tres momentos, en orden,
// escritos así por el cliente. La sección no le añade un gesto: hace visible la
// estructura que el texto ya tenía.
//
//   · el párrafo se parte en sus 3 tiempos (data/nosotros.ts — `texto` se
//     DERIVA de ellos, así que no hay copy duplicado ni puede divergir);
//   · al scrollear, el tiempo que toca se ENCIENDE (blanco) y los otros dos
//     quedan en el slate apagado — la misma alternancia apagado/encendido de
//     la narrativa de Experiencia en la home, aquí dirigida por el scroll;
//   · la foto, CLAVADA al lado, cambia con cada tiempo: la barcaza-cocina →
//     el chef en su encimera → el bufé servido. Es el recorrido real de la
//     comida, contado con las 3 fotos que ya estaban emparejadas a los 3
//     `puntos` (y ese emparejamiento NO se puede barajar — ver data/flota.ts).
//
// ── EL FONDO NAVY, Y LUEGO LA BANDA A SANGRE ─────────────────────────────
// [2026-08-07, 3ª vuelta, Samuel: «me gusta el orden de cosas, intenta que esa
// sección sea del color azul oscuro de fondo».] El mecanismo ya estaba
// aprobado; lo que cambia es la superficie.
//
// La 3ª vuelta lo montó como CARD REDONDEADA dentro del contenedor, y el
// razonamiento era este: en julio esta misma sección se hizo oscura y se cayó
// («quita todo ese tema oscuro… el cambio es demasiado brusco»), así que se
// evitó la banda a sangre a propósito.
//
// ⚠️ 4ª VUELTA — SE REVOCA (Samuel: «que no esté metido como en un banner,
// hagamos que sea ancho completo hasta los extremos de la pantalla, y tenga la
// transición de olas en la parte de arriba»). Y el aviso de julio no era falso:
// lo que hacía brusco aquel montaje era EL CORTE DURO papel→oscuro a mitad de
// una página clara. Ese corte es exactamente lo que el footer océano vino a
// resolver en julio, con espuma. Aquí se aplica la misma medicina: la banda
// entra por una TRANSICIÓN DE OLAS, así que el paso deja de ser un corte y pasa
// a ser el mismo umbral que la web ya usa dos veces (el «Incluye» de la home y
// el footer). Sin la espuma, esta banda sería el error de julio otra vez; con
// ella, es el idioma de la casa. Las dos cosas van juntas — si algún día se
// quita la espuma, hay que volver a la card.
//
// Y sigue siendo el NAVY DE MARCA y no el casi-negro de julio, que venía de la
// familia --color-premium-* (del paquete Premium) y por eso sonaba ajeno.
//
// ⚠️ LA BANDA NO SE SANGRA CON `100vw` + MARGEN NEGATIVO. El contenedor de
// pages/flota.tsx está PARTIDO EN DOS y esta sección va entre las dos mitades —
// misma técnica y mismo porqué que el barrido de /foundation (ver el comentario
// en pages/fundacion.tsx): el truco del 100vw mete la barra de scroll en la
// cuenta y deja la página con scroll horizontal en Windows.
//
// ── LO QUE NO LLEVA, Y POR QUÉ ───────────────────────────────────────────
// Ninguno de los 4 patrones de relleno que se retiraron en julio (rayita antes
// del eyebrow, bullets en círculo, divisoria + frase pequeña, fila de cifras
// con separadores): lo que ordena el bloque es el ritmo de los tres tiempos, no
// reglas ni cajas. Y no hay puntos ni barra de progreso — el texto encendido YA
// dice por dónde vas; añadir un indicador sería dibujar dos veces la misma
// información.
//
// ⚠️ NO SE APOYA EN FOTO DE PLATO. No existe ninguna en el repo (las que hay
// son planos de grupo y bandejas de fritura), y esa es la limitación real de
// esta sección: vende comida sin una sola foto de comida apetecible. El
// mecanismo está pensado para funcionar con lo que hay —el recorrido, no el
// plato— pero si algún día llegan fotos de plato, ESTE es el hueco donde
// entran, una por tiempo, sin tocar la estructura.
export function CocinaTiempos() {
  const raizRef = useRef<HTMLElement>(null)

  // El tiempo que manda. Arranca en 0 y no en -1: antes de scrollear la
  // sección tiene que leerse entera y con sentido —primer tiempo encendido,
  // primera foto puesta— y no como un bloque a medio cargar.
  const [activo, setActivo] = useState(0)

  // [dev-mode] ?dev-cocina=1|2|3 CONGELA un tiempo concreto y apaga el scroll:
  // ES el frame que viaja a Figma, porque a Figma no va el mecanismo, va un
  // estado suyo — un tiempo encendido, los otros dos apagados y su foto puesta.
  const [congelado, setCongelado] = useState(false)
  useDevFlag('dev-cocina', (v) => {
    // [dev-mode]
    const n = Number(v)
    if (Number.isInteger(n) && n >= 1 && n <= COCINA_FLOTANTE.tiempos.length) {
      setActivo(n - 1)
      setCongelado(true)
    }
  })

  // ⚠️ REDUCED-MOTION NO ES LO MISMO QUE EL FRAME DE FIGMA, y confundirlos deja
  // dos tercios del copy en gris para siempre: sin scroll que dispare nada, el
  // mecanismo no puede avanzar, así que aquí se encienden LOS TRES tiempos y la
  // sección se lee como el bloque editorial de toda la vida. Se mide una sola
  // vez al montar: si alguien cambia la preferencia del sistema con la página
  // abierta, recargar es lo razonable — reengancharse en caliente pediría un
  // listener y un remontaje del hook por un caso que no ocurre.
  const [reducido] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  // useCallback: el hook guarda `onActivo` en sus dependencias, y una función
  // nueva en cada render volvería a montar los 3 ScrollTrigger en cada cambio
  // de tiempo — o sea, en cada scroll.
  const alActivar = useCallback((i: number) => setActivo(i), [])
  useTiemposCocina(raizRef, {
    activo: !congelado && !reducido, // [dev-mode] gate
    total: COCINA_FLOTANTE.tiempos.length,
    onActivo: alActivar,
  })

  return (
    <section ref={raizRef}>
      {/* LA BANDA NAVY A SANGRE (2026-08-07, 4ª vuelta — ver la cabecera).
          `relative` porque la espuma se ancla a ella; sin `overflow-hidden`: la
          espuma ya se recorta con su propia máscara y un recorte aquí solo
          podría comerse el sangrado de 2px que sella el borde.

          LOS PADDINGS reservan la altura de la espuma más aire, ARRIBA Y ABAJO
          (2026-08-07, 5ª vuelta: «haz que abajo también tenga la transición de
          olas»): si el contenido empezara o acabara antes, el rótulo o el CTA se
          leerían por debajo de las olas. Van con los mismos tokens que
          dimensionan la espuma, así que si sube o baja de altura no hay que
          recordar ajustar esto aparte — misma receta que el `pt-[calc(...)]` del
          footer.

          `data-nav-oscuro`: el sentinel que observa NavFlotante para pasar sus
          tabs a blanco y su píldora a vidrio oscuro mientras se cruza este
          bloque. Va AQUÍ, en la caja que de verdad es oscura, y no en el
          <section> de fuera — ese no tiene fondo y marcarlo daría un falso
          positivo (misma trampa documentada en why-direct.tsx). */}
      <div
        data-nav-oscuro
        className="relative bg-oceano-cocina
          pb-[calc(var(--spacing-cocina-espuma-movil)+var(--spacing-cocina-aire))]
          pt-[calc(var(--spacing-cocina-espuma-movil)+var(--spacing-cocina-aire))]
          sm:pb-[calc(var(--spacing-cocina-espuma)+var(--spacing-cocina-aire))]
          sm:pt-[calc(var(--spacing-cocina-espuma)+var(--spacing-cocina-aire))]"
      >
        {/* EL AGUA (6ª vuelta, Samuel: «dale al fondo un fondo igual azul
            profundo del océano, puedes generarlo con el mcp de magnific»). La
            banda deja de ser navy plano. Asset PROPIO generado en Magnific — ni
            el del footer ni el del «Incluye», misma regla que Samuel fijó en
            julio para que cada superficie de agua tenga la suya; y aquí importa
            el doble porque la banda y el footer están en la misma página.
            `bg-oceano-cocina` en la banda es el FALLBACK, muestreado del RGB
            medio real de la foto: si no carga, la banda se ve igual.
            `lazy` porque esto vive a mitad de página, igual que el footer. */}
        <div className="cocina-oceano" aria-hidden="true">
          <img
            src="/fotos/cocina-oceano.webp"
            alt=""
            width={2304}
            height={1728}
            loading="lazy"
            className="size-full object-cover"
          />
        </div>

        <div className="cocina-espuma cocina-espuma--top" aria-hidden="true" />

        {/* La banda va a sangre pero el CONTENIDO no: sigue en la columna de la
            página (max-w-contenido + el mismo px-5/sm:px-10 que usa el resto de
            /fleet), porque lo que tenía que llegar a los cantos era el color, no
            el texto. Sin esto, el párrafo se leería de canto a canto en un
            monitor grande. */}
        <div className="relative mx-auto max-w-contenido px-5 sm:px-10">
        {/* Flex en móvil y grid en desktop, no un grid de una columna: en móvil
            la foto tiene que ir PRIMERA (`order-first`) para poder clavarse
            arriba mientras el texto pasa por detrás, y en desktop vuelve a su
            columna de la derecha. Con un grid de una columna habría que
            reordenar con `order` en los dos sitios; así solo se toca donde
            hace falta. */}
        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          {/* ── LOS TRES TIEMPOS ──────────────────────────────────────────── */}
          <div>
            <Etiqueta sobreOscuro>{COCINA_FLOTANTE.eyebrow}</Etiqueta>
            <h2 className="mt-3 max-w-xl text-balance font-display text-h2 font-semibold text-papel">
              {COCINA_FLOTANTE.titulo}
            </h2>

            {/* El párrafo se pinta como UN párrafo: los tres tiempos son
              `<span>` dentro del mismo <p>, separados por un espacio real. Si
              el mecanismo no corre —o si alguien copia el texto— lo que hay es
              el párrafo aprobado, entero y en orden, no tres frases sueltas.
              A tamaño de narrativa (28px) y no de lead: es el bloque que
              gobierna la sección, y encender palabras a 17px no se ve. */}
            <p className="mt-6 max-w-2xl text-balance font-display text-narrativa-movil font-medium sm:text-narrativa">
              {COCINA_FLOTANTE.tiempos.map((tiempo, i) => (
                <span key={tiempo.slice(0, 24)}>
                  <span
                    className="cocina-tiempo"
                    // El estado va al DOM, no a una clase condicional: el CSS
                    // describe los dos extremos y esto solo dice cuál toca.
                    // Con reduced-motion se encienden los tres — ver arriba.
                    data-activo={reducido || i === activo ? 'true' : 'false'}
                  >
                    {tiempo}
                  </span>{' '}
                </span>
              ))}
            </p>

            {/* Los dos párrafos restantes del copy aprobado. Van en cuerpo
              normal: son el pie de página del argumento, no el argumento.
              Sobre el panel navy usan el MISMO token que el estado apagado de
              los tiempos — es el escalón secundario de esta superficie, igual
              que --color-navy-sub lo es sobre papel.
              Aquí colgaba un tercer párrafo (`COCINA_Y_PARADAS.detalle`),
              retirado el 2026-08-07: repetía los siete platos y el «nada
              recalentado» que el primero de estos dos ya dice con las palabras
              aprobadas por el cliente. Ver el porqué en data/flota.ts. */}
            {COCINA_FLOTANTE.textoExtra?.map((t) => (
              <p key={t.slice(0, 30)} className="mt-4 max-w-xl text-sobre-navy-suave">
                {t}
              </p>
            ))}

            <Link
              to={COCINA_Y_PARADAS.cta.to}
              className="group mt-8 inline-flex items-center gap-2 rounded-btn bg-coral px-6 py-3.5 text-sm font-semibold text-white shadow-boton-fancy transition hover:bg-coral-dark"
            >
              {COCINA_Y_PARADAS.cta.label}
              <ArrowRight
                className="size-4 transition-transform duration-200 motion-safe:group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>

          {/* ── LA FOTO CLAVADA ───────────────────────────────────────────────
            ⚠️ ES UNA SOLA FOTO, FIJA (2026-08-07, 6ª vuelta — Samuel: «la imagen
            de la derecha que sea una imagen y ya, sin ese footer ni que pase
            tipo slider»). Antes eran las TRES `pruebas` apiladas en el mismo
            marco, fundiéndose con cada tiempo, y cada una con su pie —la
            afirmación de `puntos` sobre la foto que la sostiene—. Las dos cosas
            se retiran: la que se queda es COCINA_FLOTANTE.foto, que es la foto
            canónica de la sección en el dato.
            LO QUE ESO SE LLEVA POR DELANTE, para que quede dicho y no se
            redescubra: (a) la mitad visual del mecanismo — el texto sigue
            encendiéndose tiempo a tiempo, pero la imagen ya no acompaña; (b) el
            emparejamiento foto↔afirmación, que estaba documentado como la razón
            de ser del pie («una afirmación pegada a su prueba pesa más que la
            misma afirmación con un punto de color al lado») y que además evitaba
            un bug real, el de leer la afirmación nueva sobre la foto vieja
            durante el fundido. Sin fundido y sin pie, ese bug ya no existe.
            `.cocina-foto` y los tokens --cocina-tiempo-foto* se quedan SIN
            CONSUMIDORES: marcados en componentes.css/tokens.css, no borrados —
            criterio de la casa para no romper nada que otra rama esté montando.

            `sticky` y no un pin de GSAP: es CSS, no secuestra el scroll y no
            necesita spacer. `self-start` es obligatorio — sin él el grid
            estira la celda a la altura de la fila y un elemento de altura
            completa nunca llega a pegarse (la trampa clásica del sticky dentro
            de un grid).

            ⚠️ TAMBIÉN EN MÓVIL, y esa es la parte que hubo que rehacer. La
            primera versión la clavaba solo desde lg y en móvil la dejaba
            DEBAJO del texto: medido, la columna de texto mide 1.026px y la
            ventana 844, así que la foto no llegaba a verse nunca a la vez que
            la frase que ilustra — el mecanismo, en el dispositivo mayoritario
            de un sitio de turismo, no existía. Aquí la foto va PRIMERA y se
            clava arriba; el texto pasa por detrás (de ahí el `z-10`: los
            hermanos posteriores se pintan encima por defecto, y sin esto el
            párrafo cruzaría por encima de la foto).
            Y por eso en móvil la foto es apaisada (16/10) y no 4:5: a 4:5
            ocuparía media pantalla y no quedaría sitio para leer debajo. */}
          <div className="order-first sticky top-(--spacing-cocina-sticky-movil) z-10 self-start lg:order-none lg:top-(--spacing-cocina-sticky-top)">
            {/* Sin sombra: sobre el panel navy no se ve nada (una sombra es
              oscuridad sobre claro). Lo que despega la foto del fondo aquí es
              un canto blanco muy tenue — el mismo recurso del vidrio del nav.
              Sin él, las zonas oscuras de una foto se funden con el panel y el
              marco parece recortado. */}
            <div className="relative overflow-hidden rounded-card-grande ring-1 ring-inset ring-white/12">
              {/* ⚠️ NO ES `COCINA_FLOTANTE.foto` (2026-08-07, al volver la tira
                de pruebas): esa foto —el chef en su encimera— es la segunda de
                la tira de abajo, y la misma imagen dos veces en la misma banda
                se lee como un descuido. Aquí va la del RESULTADO: huéspedes
                comiendo a bordo, que es lo que el visitante se está imaginando
                mientras lee el párrafo. Es la que la sección original ya tenía
                elegida para este papel (`COCINA_Y_PARADAS.foto`), con su `alt`
                verificado abriendo el archivo.
                Si algún día se retira la tira, esto vuelve a
                `COCINA_FLOTANTE.foto` en una línea. */}
              <img
                src={`/fotos/${COCINA_Y_PARADAS.foto}.webp`}
                alt={COCINA_Y_PARADAS.fotoAlt}
                loading="lazy"
                className="aspect-[16/10] size-full object-cover lg:aspect-[4/5]"
              />

              {/* El badge se invierte con el fondo: era navy sobre papel y ahora
                es papel sobre navy. Un chip navy sobre un panel navy se leería
                como un agujero en la foto en vez de como una etiqueta. */}
              <span className="absolute left-4 top-4 rounded-chip bg-papel px-3 py-1.5 text-xs font-semibold text-navy shadow-sm">
                {COCINA_FLOTANTE.badge}
              </span>
            </div>
          </div>
        </div>

        {/* ── LAS 3 PRUEBAS ─────────────────────────────────────────────────
            [2026-08-07, pedido de Samuel] VUELVEN, y con los claims aprobados
            de pie. El doc del cliente (WEBSITE - NOSOTROS pág. 8) pinta esta
            misma tira y escribe «CHANGE:» sobre los pies en español → COOKED
            FRESH, SERVED FRESH · LIVE SHOW COOKING · WHERE GREAT FOOD BRINGS
            EVERYONE TOGETHER. Los tres claims ya estaban traducidos en
            `COCINA_FLOTANTE.puntos`, pero se habían quedado sin pintar en
            ninguna página al retirarse `CocinaYParadas`: el cambio estaba hecho
            en el dato y no se veía en la web.

            ⚠️ ESTO NO REABRE LA 6ª VUELTA. Lo que se quitó entonces («la
            imagen de la derecha que sea una imagen y ya, sin ese footer ni que
            pase tipo slider») fue el CARRUSEL de la columna derecha: esa foto
            sigue siendo una, quieta y sin pie. Esta tira es estática y va
            debajo del bloque, que es donde el cliente la dibuja.

            El emparejamiento foto↔claim sigue siendo por ÍNDICE y NO se puede
            barajar — el porqué (una afirmación sobre la foto que no la muestra)
            está en data/flota.ts, junto a `pruebas`.

            Anatomía: la de la tira original (foto 4:3, claim debajo, sin caja
            ni viñeta — la foto ya es el contenedor), repintada para navy: el
            claim en papel y el canto blanco tenue que usa la foto clavada de
            arriba, que es lo que despega una foto de este fondo. */}
        <ul className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3 lg:mt-20">
          {COCINA_FLOTANTE.puntos.map((punto, i) => {
            const prueba = COCINA_Y_PARADAS.pruebas[i]
            if (!prueba) return null
            return (
              <li key={punto}>
                <figure>
                  <img
                    src={`/fotos/${prueba.foto}.webp`}
                    alt={prueba.alt}
                    loading="lazy"
                    className="aspect-[4/3] w-full rounded-card object-cover ring-1 ring-inset ring-white/12"
                  />
                  <figcaption className="mt-3 font-display text-lead font-semibold text-papel">
                    {punto}
                  </figcaption>
                </figure>
              </li>
            )
          })}
        </ul>
        </div>

        {/* La espuma de SALIDA. Va al final del DOM y no junto a la de arriba
            para que el orden del documento sea el orden visual — las dos son
            `absolute`, así que da igual para el pintado, pero leer el componente
            de arriba abajo tiene que contar la sección en el orden en que se ve.
            Rotada 180°, no espejada: ver `.cocina-espuma--bottom`. */}
        <div className="cocina-espuma cocina-espuma--bottom" aria-hidden="true" />
      </div>
    </section>
  )
}
