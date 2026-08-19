import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'
import { Etiqueta } from '@/components/ui/etiqueta'
import { VideoLightbox } from '@/components/tour/video-lightbox'
import { useOrigenExpansion } from '@/lib/use-expansion-flip'
import { REELS, REELS_HASHTAG, type Reel } from '@/data/home'
import { t } from '@/lib/i18n'

// «Míranos en acción» — carrusel de reels de Instagram/TikTok (correcciones
// v1 del cliente, 2026-07-20). Cubre DOS peticiones con una sola pieza:
//   - planes/01-home.md slides 8-9 — «sección instagram y tiktok» en la home.
//   - planes/02-producto.md slide 6 — la fila «Video Corporativo + Reel 1/2/3
//     Clientes» de la ficha de tour.
// Por eso vive en `ui/` y no en `home/`: es un componente compartido, y en
// Figma será UN componente con dos usos, no dos parecidos que hay que
// mantener sincronizados.
//
// POR QUÉ NO ES UN EMBED EN VIVO DE INSTAGRAM/TIKTOK: los widgets oficiales
// meten un script de terceros, imponen su propio look (que se pelea con la
// dirección Charter Premium) y rompen el «cero librerías» de la home. Este es
// un carrusel CURADO: nosotros elegimos qué se enseña. Si el cliente quiere
// feed automático, es otra decisión y tiene su coste visual — está anotado en
// el plan.
//
// ⚠️ Estado de los datos (ver REELS en data/home.ts): hoy son FOTOS reales de
// las galerías del cliente haciendo de cartel, con `video: null`. No hay
// contadores de vistas (la maqueta los traía inventados) ni handles de
// terceros. Cuando lleguen los reels reales solo cambia el dato: la card ya
// sabe abrirlos (VideoLightbox), igual que el video del mosaico.
//
// ─────────────────────────────────────────────────────────────────────────
// 2ª VUELTA DE LA FICHA (Samuel, 2026-07-22): «mejora la disposición de los
// videos reels, hay espaciados, padding, alineaciones erradas y raras, darle
// más cariño a esta parte». Lo que estaba mal, medido en la ficha:
//
// 1. LA PRIMERA CARD NO SE ALINEABA CON EL TÍTULO. La pista llevaba un
//    sangrado a los bordes (`-mx-5 sm:-mx-10`) pensado para cuando la sección
//    ocupa el ancho de la ventana — en la home, donde deslizar hasta el canto
//    de la pantalla es lo correcto. Dentro de la columna de la ficha ese mismo
//    sangrado dejaba las cards 40px a la izquierda del H2. De ahí la
//    «alineación rara»: no era una sensación, eran 40px reales.
// 2. LA SECCIÓN TRAÍA SU PROPIO PADDING DE SECCIÓN (`py-seccion`) dentro de
//    una columna que YA separa sus bloques con `gap-8`. El espaciado se
//    sumaba dos veces y el bloque medía 932px de alto para 450px de reels.
// 3. NO SE VEÍA QUE HUBIERA MÁS. La 4ª card quedaba cortada por el borde sin
//    ninguna flecha ni pista de que aquello se desplazaba — parecía un
//    recorte, no un carrusel.
//
// La solución es la `variante`: la sección de la home y el bloque de la ficha
// dejan de ser el mismo layout con un fondo distinto. En Figma son 2 variantes
// del mismo componente.

// Scroll horizontal con snap, no marquee automático: aquí el visitante ELIGE
// qué mirar (a diferencia del ticker del hero, que es ambiente). Un carrusel
// de video que se mueve solo pelea con el usuario justo cuando quiere leer.
function CardReel({ reel, onAbrir }: { reel: Reel; onAbrir: (r: Reel, el: HTMLElement) => void }) {

  // Sin video real, la card no es pulsable: un botón que no hace nada es peor
  // que una imagen. El play se queda igualmente porque describe el FORMATO
  // (esto es un reel vertical), que es información verdadera aunque el clip
  // todavía no exista.
  const Envoltorio = reel.video ? 'button' : 'article'

  return (
    <Envoltorio
      className="reel-card group"
      {...(reel.video
        ? {
        type: 'button' as const,
        // [v2 2026-07-28] Entrega su propio nodo para que el visor EXPANDA
        // desde esta card en vez de aparecer en el centro.
        onClick: (e: React.MouseEvent<HTMLElement>) => onAbrir(reel, e.currentTarget),
        'aria-label': `Watch the reel: ${reel.titulo}`,
      }
        : {})}
    >
      {reel.video ? (
        <video
          src={reel.video}
          poster={`/fotos/${reel.foto}.webp`}
          muted
          loop
          playsInline
          preload="none"
          aria-label={reel.titulo}
        />
      ) : (
        <img src={`/fotos/${reel.foto}.webp`} alt={reel.fotoAlt} loading="lazy" />
      )}

      {/* Degradado de pie para que el título lea sobre cualquier foto. */}
      <div className="reel-card__velo" aria-hidden="true" />

      {/* [v2 2026-07-27] FUERA el badge de red social (slide 21: «serán 5
          videos fijos, no serán dinámicos»). El cliente no pedía un número —ya
          eran 5— sino que esto DEJE DE PARECER un feed de Instagram/TikTok en
          vivo. El badge de red comunicaba «feed conectado», que es una promesa
          que nadie va a cumplir: no hay integración con la API de Instagram ni
          la habrá (sería backend, bloqueado por Derick/Odoo). El campo `red` de
          REELS queda sin consumidores. */}

      <span className="reel-card__play" aria-hidden="true">
        <Play className="size-5 translate-x-px fill-current" />
      </span>

      <p className="reel-card__titulo">{reel.titulo}</p>
    </Envoltorio>
  )
}

type Props = {
  /** Título de sección. La ficha usa uno distinto al de la home. */
  titulo?: string
  eyebrow?: string
  lead?: string
  /**
   * `seccion` (home): franja a ancho completo, con su propio fondo y su
   * padding de sección; la pista sangra hasta el borde de la pantalla en
   * móvil.
   * `bloque` (ficha): una card más de la columna — sin padding ni fondo
   * propios (los pone el envoltorio BLOQUE_FICHA del padre) y con la pista
   * sangrando solo lo que mide ese padding, para que las cards lleguen al
   * canto de la card sin desalinearse del título.
   */
  variante?: 'seccion' | 'bloque'
  /**
   * El «¿Navegaste con nosotros? Etiquétanos con #…».
   * `false` en la ficha (Samuel, 2026-07-22): ahí el visitante está a media
   * decisión de compra y una invitación a irse a Instagram es una salida más.
   * En la home sí tiene sentido: allí la sección ES la invitación.
   *
   * Antes se llamaba `conRedes` y encendía también una fila de botones
   * Instagram/Facebook/TikTok. Esos botones se retiraron (Samuel, misma
   * fecha): las tres redes ya viven como iconos en el footer, a un scroll de
   * distancia, así que aquí solo repetían enlaces de salida y le robaban el
   * cierre a la sección, que es el hashtag.
   */
  conHashtag?: boolean
  /**
   * Qué carril se pinta. Por defecto los REELS de la home/ficha.
   * [v2 2026-07-28] /instalaciones pasa los suyos (los verticales de las 6
   * zonas del complejo, slide 45): mismo carril arrastrable, mismas cards y
   * mismo visor, otros datos. Era lo que el plan 06 §1 daba por hecho —
   * «se reutiliza con otros datos y ya está»— y resultó que el componente
   * leía REELS directamente del módulo, así que no se podía.
   */
  reels?: Reel[]
  /**
   * Cómo se compone la cabecera en la variante `seccion`.
   * `centro` (home): eyebrow/título/lead centrados y las flechas debajo, también
   * centradas — es una franja de marca y abre igual que el resto de secciones
   * de la home.
   * `izquierda` ([v2 2026-07-28, pedido de Samuel para /instalaciones): «que el
   * título y descripción estén alineados a la izquierda y que haya 2 columnas, y
   * que en la columna derecha estén las flechas en vez de que estén abajo, así
   * hacemos mejor integrado todo». Es exactamente la composición que la variante
   * `bloque` ya usaba en la ficha de tour (texto a la izquierda, flechas a la
   * derecha, misma fila) — aquí se hace disponible también a ancho de sección,
   * conservando el tamaño de título de sección. Sin flechas duplicadas abajo.
   */
  alineacion?: 'centro' | 'izquierda'
}

export function ReelsSociales({
  titulo = t('This is what a day with us looks like'),
  // [v2 2026-07-27] El eyebrow deja de nombrar las redes («Reels · Instagram ·
  // TikTok») por lo mismo que se fue el badge de red: no es un feed conectado,
  // son videos nuestros. Se reutiliza el tono que la ficha de tour ya usaba y
  // que era el correcto desde el principio.
  eyebrow = t('On video'),
  lead = t('A day on board comes across better on video. This is us, and our guests enjoying the Caribbean.'),
  variante = 'seccion',
  // [v2] El hashtag también sugería feed en vivo → apagado por defecto. La
  // ficha ya lo pasaba en false; ahora ese es el comportamiento normal.
  conHashtag = false,
  reels = REELS,
  alineacion = 'centro',
}: Props) {
  const pista = useRef<HTMLDivElement>(null)
  const [alInicio, setAlInicio] = useState(true)
  const [alFinal, setAlFinal] = useState(false)
  const [hayScroll, setHayScroll] = useState(false)
  const [reelAbierto, setReelAbierto] = useState<Reel | null>(null)
  const expansion = useOrigenExpansion()

  const esBloque = variante === 'bloque'
  // Quién manda en la composición de la cabecera: `bloque` va SIEMPRE a la
  // izquierda (es un bloque más de la columna de la ficha) y `seccion` lo
  // decide `alineacion`. Se resuelve en una sola variable para que la fila del
  // título y las flechas de abajo no puedan contradecirse.
  const centrado = !esBloque && alineacion === 'centro'

  // Estado de las flechas. El margen de 2px absorbe los redondeos
  // sub-píxel del scroll (a 1440px, scrollLeft acaba en 1673.6 contra un
  // máximo de 1673.59…, y sin margen la flecha derecha nunca se apagaba).
  //
  // `hayScroll` decide si las flechas EXISTEN. Desde que la card crece para
  // llenar la fila (.reel-card en componentes.css), en la home de escritorio
  // los 5 reels caben enteros y no hay nada que desplazar: dos flechas
  // apagadas ahí no informan de nada, solo parecen un control roto. Donde sí
  // sobra contenido —la columna estrecha de la ficha, o un escritorio
  // pequeño— reaparecen solas.
  const medir = useCallback(() => {
    const el = pista.current
    if (!el) return
    setAlInicio(el.scrollLeft <= 2)
    setAlFinal(el.scrollLeft >= el.scrollWidth - el.clientWidth - 2)
    setHayScroll(el.scrollWidth > el.clientWidth + 2)
  }, [])

  useEffect(() => {
    medir()
    // También al redimensionar: al pasar de móvil a escritorio cabe otro
    // número de cards y las flechas tienen que recalcularse.
    window.addEventListener('resize', medir)
    return () => window.removeEventListener('resize', medir)
  }, [medir])

  // Un paso = el ancho visible menos una card, para que quede siempre una
  // card de solape. Sin ese solape el usuario pierde el hilo de dónde estaba
  // (es el mismo criterio del «page down» de un documento, que nunca salta
  // una pantalla exacta).
  const mover = (direccion: 1 | -1) => {
    const el = pista.current
    if (!el) return
    const card = el.firstElementChild as HTMLElement | null
    const paso = card ? el.clientWidth - card.offsetWidth : el.clientWidth * 0.8
    el.scrollBy({ left: direccion * paso, behavior: 'smooth' })
  }

  const flechas = (
    // Solo en escritorio: en táctil se desliza con el dedo y dos botones
    // ahí solo quitarían sitio a las cards.
    <div className="hidden items-center gap-2 sm:flex">
      {(
        [
          { dir: -1 as const, Icono: ChevronLeft, etiqueta: t('Previous reels'), apagada: alInicio },
          { dir: 1 as const, Icono: ChevronRight, etiqueta: t('More reels'), apagada: alFinal },
        ]
      ).map(({ dir, Icono, etiqueta, apagada }) => (
        <button
          key={dir}
          type="button"
          onClick={() => mover(dir)}
          disabled={apagada}
          aria-label={etiqueta}
          className="grid size-10 place-items-center rounded-full text-navy ring-1 ring-linea transition-colors hover:bg-papel-hueso disabled:pointer-events-none disabled:opacity-35"
        >
          <Icono className="size-5" />
        </button>
      ))}
    </div>
  )

  const cabecera = (
    <>
      <Etiqueta>{eyebrow}</Etiqueta>
      {/* En la ficha el título baja a --text-h3: ahí es el título de UN
          bloque de la columna y tiene que pesar lo mismo que «Itinerario» o
          «Opiniones» (TituloSeccion), no más. En la home sigue siendo un H2
          de sección a ancho completo. */}
      <h2 className={`mt-3 font-display font-semibold text-navy ${esBloque ? 'text-h3' : 'text-h2'}`}>
        {titulo}
      </h2>
      <p
        className={`mt-2 max-w-2xl text-navy-sub ${esBloque ? '' : 'text-lead'} ${
          centrado ? 'mx-auto' : ''
        }`}
      >
        {lead}
      </p>
    </>
  )

  const contenido = (
    <>
      {/* La cabecera se compone distinto en cada variante, y no es capricho:
          en la HOME va CENTRADA (Samuel, 2026-07-22) porque es una sección a
          ancho completo y el resto de secciones de la home abren igual —
          eyebrow, título y lead centrados. En la FICHA —y en /instalaciones,
          que pide la misma composición ([v2 2026-07-28], ver `alineacion`)—
          va alineada a la izquierda y comparte fila con las flechas: allí es
          un bloque más de una columna de bloques, todos alineados a la
          izquierda, y centrarlo lo sacaría del ritmo de la página.
          `items-end` en la fila de la ficha alinea por la línea base del lead,
          no por el centro de un bloque de 3 líneas contra un botón de 40px. */}
      {centrado ? (
        <div className="text-center">{cabecera}</div>
      ) : (
        <div className="flex items-end justify-between gap-6">
          <div>{cabecera}</div>
          {hayScroll ? flechas : null}
        </div>
      )}

      {/* El sangrado (salir del contenedor y devolver el padding por dentro)
          vive en CSS y no en utilidades, porque además del margin y el
          padding necesita un tercer valor que Tailwind no expresa bien aquí
          —scroll-padding-inline— y los tres tienen que moverse juntos o la
          alineación se rompe sin avisar. Ver .reel-pista--sangrada en
          componentes.css: ahí está el bug que esto arregla. */}
      <div
        ref={pista}
        onScroll={medir}
        className={`reel-pista reel-pista--sangrada mt-6 ${
          esBloque ? 'reel-pista--en-bloque' : 'reel-pista--en-seccion'
        }`}
      >
        {reels.map((r) => (
          <CardReel
            key={r.id}
            reel={r}
            onAbrir={(reel, el) => {
              expansion.abrirDesde(el)
              setReelAbierto(reel)
            }}
          />
        ))}
      </div>

      {/* Las flechas de la home van DEBAJO y centradas, no en la fila del
          título: con la cabecera centrada, colgarlas a la derecha dejaba el
          bloque descompensado. Y solo aparecen si sobra contenido — ver
          `hayScroll`. */}
      {centrado && hayScroll ? <div className="mt-6 flex justify-center">{flechas}</div> : null}

      {conHashtag ? (
        <p className="mt-8 text-center text-sm text-navy-sub">
          {t('Sailed with us? Tag us with')}{' '}
          <span className="font-semibold text-coral">{REELS_HASHTAG}</span> {t('and get featured on our website.')}
        </p>
      ) : null}

      {reelAbierto?.video ? (
        <VideoLightbox
          src={reelAbierto.video}
          poster={`/fotos/${reelAbierto.foto}.webp`}
          etiqueta={reelAbierto.titulo}
          origen={expansion.origen}
          onCerrar={() => setReelAbierto(null)}
        />
      ) : null}
    </>
  )

  // En `bloque` no hay <section> ni max-w propios: el componente ES el
  // contenido de la card que le pone el padre, y la anchura la manda la
  // columna. Envolverlo aquí en otro contenedor centrado volvería a meter el
  // desalineado que este cambio quita.
  if (esBloque) return contenido

  return (
    <section className="bg-papel px-5 py-seccion-sm sm:px-10 sm:py-seccion">
      <div className="mx-auto max-w-contenido">{contenido}</div>
    </section>
  )
}
