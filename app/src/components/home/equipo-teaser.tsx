import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Etiqueta } from '@/components/ui/etiqueta'
import { EQUIPO, type MiembroEquipo } from '@/data/nosotros'
import { WHATSAPP_URL } from '@/data/tours'
import { useDevFlag } from '@/dev/use-dev-flag'
import { useEquipoScroll } from '@/components/home/use-equipo-scroll'

// «Las personas detrás de tu día en el mar» — sección de equipo en la home
// (correcciones v1 del cliente, 2026-07-20, planes/01-home.md slide 15:
// «agregar sección del equipo»).
//
// Es un TEASER, no la sección completa: el equipo con nombre, la tripulación
// a bordo y la flota ya viven en /nosotros, y duplicar los 3 bloques en la
// home dejaría dos sitios que corregir cada vez que el cliente cambie un
// cargo. Aquí van las 3 personas y un CTA a la página. Misma fuente de datos
// (EQUIPO en data/nosotros.ts), que además alimenta la card de persona de
// Contacto.
//
// 2ª vuelta (2026-07-22, pedido de Samuel):
//   1. UBICACIÓN: pasa de vivir entre WhyDirect e IncluyeCrucero a vivir
//      DEBAJO de Contacto (pages/home.tsx) — Samuel la quiere en la zona de
//      cierre, no en la de "por qué nosotros" de mitad de página.
//   2. CARDS: de "avatar + texto en columna sobre card blanca" a retrato
//      grande a sangre (foto cutout, fondo GRIS CLARO —`bg-papel-hueso`— por
//      si el recorte deja aire alrededor) con rol arriba-izquierda,
//      antigüedad arriba-derecha, nombre abajo sobre un degradado (mismo
//      --color-papel-hueso de la card, sólido en la base y disolviéndose
//      hacia arriba — así el nombre SIEMPRE tiene una superficie limpia
//      detrás sea lo que sea que haya en la foto justo ahí) y, al hacer
//      hover, la frase + el CTA de la persona se revelan creciendo desde ese
//      mismo degradado. En móvil (sin hover) la frase y el CTA van SIEMPRE
//      visibles — ocultarlos sin alternativa habría sido perder contenido
//      real, no una mejora.
//   3. DINAMISMO: las 3 cards arrancan "en escalones" (un patrón de arco —
//      la del centro más alta que las de los extremos, ver la referencia
//      que pasó Samuel) y se ALINEAN al hacer scroll — use-equipo-scroll.ts.
//
// 3ª vuelta (2026-07-22, mismo día, corrección sobre la 2ª):
//   1. 5 CARDS, no 3 — para tener 3 NIVELES de altura (con 3 cards solo cabe
//      centro+extremos). Las 2 nuevas son PLACEHOLDER sin nombre propio
//      (ver el comentario largo en data/nosotros.ts) — se distinguen solas:
//      sin `foto`, caen al fallback de iniciales de `Retrato`.
//   2. Se quitan los chips (fondo + sombra + blur) de rol/antigüedad: ahora
//      es texto plano sobre un degradado CLARO (mismo --color-papel-hueso
//      de la card) en la franja superior — mismo lenguaje que el degradado
//      del nombre abajo, así el texto es legible sin importar qué haya
//      justo detrás en la foto.
//   3. "{n} años" → "Desde {año}": Samuel notó que "X años" se leía como la
//      EDAD de la persona, no su antigüedad. La fecha en vez del conteo lo
//      deja sin ambigüedad. Sin `desde` (las 2 placeholder) no se pinta nada
//      — no hay fecha que inventar para un rol genérico.
//   4. El degradado del nombre empieza en 0% (antes tenía una meseta sólida
//      hasta 42% y SOLO DESPUÉS empezaba a disolverse) y la franja es más
//      alta (`pt-12` → `pt-20`) — más aire, más contraste para el nombre y
//      la frase que aparece al hover.
//   5. El efecto de scroll empieza más tarde (`top 75%` → `top 55%`): antes
//      pasaba desapercibido porque para cuando la sección terminaba de
//      asomar en pantalla el recorrido ya casi había terminado.
//
// 4ª vuelta (2026-07-22, mismo día):
//   1. Las 5 cards llevan FOTO — las 2 de relleno también (Samuel: "poner
//      imágenes de personas también a los 2 que faltan"). Como ya no se
//      distinguen por las iniciales, el dato lleva ahora un flag explícito
//      `placeholder` (data/nosotros.ts) que es lo único que dice cuáles no
//      son personas reales.
//   2. Se quita la ANTIGÜEDAD de la card ("Desde 2012") — ver el comentario
//      sobre la franja superior, más abajo.
//   3. TODAS las cards arrancan MÁS ABAJO y suben a alinearse; antes la del
//      centro arrancaba por encima y BAJABA (Samuel: "el que está más alto en
//      vez de subir... ese baja; todos deberían estar más bajos para que
//      todos suban a acomodarse al tope"). Ver use-equipo-scroll.ts.
//
// ⚠️ FOTOS: las 5 son de STOCK con el fondo recortado (pedido explícito de
// Samuel, ver el comentario largo en data/nosotros.ts) — NO son retratos
// reales. Hay que sustituirlas antes de publicar. El componente no distingue:
// en cuanto `foto` cambie a un archivo real en data/nosotros.ts, la card pasa
// a mostrarlo sin tocar código aquí. Ojo con las 2 `placeholder`: ahí no
// basta con cambiar la foto, no hay persona detrás — o se sustituye la
// entrada entera por alguien real, o se borra.
function Retrato({ miembro }: { miembro: MiembroEquipo }) {
  if (miembro.foto) {
    return (
      <img
        src={`/fotos/${miembro.foto}.webp`}
        alt={`${miembro.nombre}, ${miembro.rol}`}
        loading="lazy"
        className="absolute inset-0 size-full object-cover object-top"
      />
    )
  }
  // Sin foto: mismo placeholder honesto que las reseñas de la home, pero a
  // tamaño de retrato (no un círculo pequeño) para que la card no se rompa
  // si algún día se añade un miembro sin foto todavía.
  //
  // `iniciales` (2026-07-28) manda sobre la inicial suelta: con nombre y
  // apellidos —o con una razón social— una sola letra no identifica a nadie.
  // Lo usan los tres de /fundacion, que van sin retrato A PROPÓSITO (no hay
  // foto de los cofundadores y las caras de /fotos/equipo-*.webp son stock:
  // ponérsela a una persona real con nombre y apellidos sería inventarle un
  // retrato). Ahí esto deja de ser un placeholder de maqueta y es el diseño
  // de la card, así que el monograma sube de tamaño.
  return (
    <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center bg-aqua-tint">
      <span className="font-display text-6xl font-semibold text-aqua-dark sm:text-7xl">
        {miembro.iniciales ?? miembro.nombre.slice(0, 1)}
      </span>
    </div>
  )
}

function CardMiembro({ miembro, hrefHistoria }: { miembro: MiembroEquipo; hrefHistoria: string }) {
  const esWhatsapp = miembro.cta?.tipo === 'whatsapp'

  // Sin `cta` no se pinta la fila del hover (los tres de /fundacion no tienen
  // adónde mandar a nadie — ver el tipo en data/nosotros.ts).
  const cta = !miembro.cta ? null : esWhatsapp ? (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener"
      className="group inline-flex items-center gap-1 text-xs font-semibold text-coral"
    >
      {miembro.cta.label}
      <ArrowRight
        className="size-3.5 transition-transform duration-200 motion-safe:group-hover:translate-x-1"
        aria-hidden="true"
      />
    </a>
  ) : (
    // El CTA del fundador es «Nuestra historia»: desde la home eso es
    // /nosotros; DENTRO de /nosotros sería un enlace a sí misma, así que esa
    // página pasa el ancla al bloque de historia, que está unos scrolls arriba.
    <Link to={hrefHistoria} className="group inline-flex items-center gap-1 text-xs font-semibold text-coral">
      {miembro.cta.label}
      <ArrowRight
        className="size-3.5 transition-transform duration-200 motion-safe:group-hover:translate-x-1"
        aria-hidden="true"
      />
    </Link>
  )

  return (
    // .equipo-card: selector que lee use-equipo-scroll.ts — la clase es
    // puramente un gancho para GSAP, no lleva estilos propios.
    <div className="equipo-card group relative aspect-[3/4] overflow-hidden rounded-card-grande bg-papel-hueso ring-1 ring-linea">
      <Retrato miembro={miembro} />

      {/* Solo el ROL — texto plano (sin chip, sin sombra) sobre un degradado
          CLARO propio (mismo --color-papel-hueso de la card): así se lee
          igual sin importar qué haya detrás en la foto, sin necesitar una
          píldora de fondo. La antigüedad («Desde 2012») se retiró en la 4ª
          vuelta: primero fue un chip con «13 años», que se leía como la EDAD
          de la persona; se cambió a la fecha y aun así Samuel la quitó del
          todo — en un teaser el cargo basta, y el dato sigue vivo en
          /nosotros, que es donde se cuenta la historia. `desde` NO se borra
          del dato por eso: allí sí se pinta. */}
      <div
        className="absolute inset-x-0 top-0 z-10 p-4 pb-10"
        style={{
          background: 'linear-gradient(to bottom, var(--color-papel-hueso) 0%, transparent 100%)',
        }}
      >
        <span className="text-xs font-semibold uppercase tracking-wide text-navy">{miembro.rol}</span>
      </div>

      {/* Nombre siempre visible sobre el degradado; frase + CTA se revelan
          al hover (desktop) o van siempre abiertos (móvil, sin hover) — ver
          el comentario largo arriba del componente. Degradado desde 0% (sin
          meseta sólida) y franja más alta (pt-20): más contraste y más aire
          para el nombre y la frase. `quote` es opcional — las cards
          placeholder no tienen frase personal que mostrar. */}
      <div
        className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-2 p-5 pt-20"
        style={{
          background: 'linear-gradient(to top, var(--color-papel-hueso) 0%, transparent 100%)',
        }}
      >
        {miembro.quote ? (
          <p className="overflow-hidden text-sm italic text-navy-sub transition-all duration-300 sm:max-h-0 sm:opacity-0 sm:group-hover:max-h-20 sm:group-hover:opacity-100">
            «{miembro.quote}»
          </p>
        ) : null}
        <p className="font-display text-h3 font-semibold text-navy">{miembro.nombre}</p>
        {cta ? (
          <div className="overflow-hidden transition-all duration-300 sm:max-h-0 sm:opacity-0 sm:group-hover:max-h-8 sm:group-hover:opacity-100">
            {cta}
          </div>
        ) : null}
      </div>
    </div>
  )
}

// 5ª vuelta (2026-07-22, rediseño de /nosotros): esta sección SE REUTILIZA tal
// cual en la página Nosotros (pedido de Samuel: «en la sección de equipo
// reutiliza la que ya tenemos en el home»). No se clona ni se hace una
// variante paralela — se parametriza lo poco que cambia entre los dos sitios,
// que es el copy de cabecera, qué miembros entran y qué la cierra:
//
//   - `miembros`: en /nosotros se filtran los 2 PLACEHOLDER (Capitán /
//     Bióloga marina). No es un capricho de longitud — esos dos roles tienen
//     su propio bloque en esa misma página (TripulacionAbordo), y repetirlos
//     como card de persona sería el mismo dato dos veces a dos alturas.
//   - `cierre`: en la home es el enlace «Conoce también a la tripulación»
//     (que lleva justo a /nosotros); ahí sería un enlace a sí misma, así que
//     esa página pasa en su lugar el bloque de tripulación de verdad.
//   - `enmarcada`: la home la coloca como sección suelta con su propio ancho y
//     padding; /nosotros ya vive dentro de un contenedor con ambos, y
//     duplicarlos metía el doble de aire y estrechaba la rejilla.
//
// Que el patrón de escalones del scroll (use-equipo-scroll.ts) siga leyéndose
// como un ARCO con 3 cards y no solo con 5 se resolvió allí, calculando el
// nivel por distancia al centro en vez de con una lista fija.
export function EquipoTeaser({
  miembros = EQUIPO,
  // [v3 2026-08-06, WEBSITE - INICIO pág. 6] Copy APROBADO: «MEET THE [TEAM]
  // BEHIND YOUR CARIBBEAN ADVENTURE: Based in Punta Cana since 2010, we're
  // the local team behind every tour, dedicated to creating unforgettable
  // Caribbean experiences.»
  //
  // Dos correcciones al portarlo, ambas de forma, no de fondo:
  //  · El titular del cliente dice «MEET THE BEHIND YOUR CARRIBEAN
  //    ADVENTURE» — le falta el sujeto y «Caribbean» va con una R. Se corrige
  //    a «Meet the team behind your Caribbean adventure».
  //  · «since 2010» sustituye al «desde 2012» que tenía el sitio (auditado de
  //    la web del cliente). Gana el copy aprobado; queda en la lista de
  //    peticiones porque su propia web decía otra cosa.
  etiqueta = 'Meet us',
  titulo = 'Meet the team behind your Caribbean adventure',
  texto = "Based in Punta Cana since 2010, we're the local team behind every tour, dedicated to creating unforgettable Caribbean experiences.",
  cierre,
  enmarcada = true,
  hrefHistoria = '/crew',
}: {
  miembros?: MiembroEquipo[]
  etiqueta?: string
  titulo?: string
  texto?: string
  /** Qué va bajo la rejilla. `undefined` = el enlace a /nosotros de la home; pásale otra cosa (o `null`) para sustituirlo. */
  cierre?: React.ReactNode
  /** false = sin ancho máximo ni padding propios (la página que la usa ya los pone). */
  enmarcada?: boolean
  /** Destino del CTA «Nuestra historia» del fundador. En /nosotros, un ancla en vez de un enlace a sí misma. */
  hrefHistoria?: string
} = {}) {
  const sectionRef = useRef<HTMLElement>(null)

  // [dev-mode] ?dev-equipo=estatico congela el scroll de alineado en su
  // estado FINAL (las 5 cards ya alineadas) → frame limpio para Figma. Ver
  // dev-registry.ts. Sin GSAP enganchado, la sección se ve directamente
  // asentada (el estado natural del JSX).
  const [estatico, setEstatico] = useState(false)
  useDevFlag('dev-equipo', (v) => setEstatico(v === 'estatico')) // [dev-mode]
  useEquipoScroll(sectionRef, { activo: !estatico }) // [dev-mode] gate

  // Las columnas siguen al número de cards: con 5 hacen falta las 5 de `lg`
  // para que el arco de 3 niveles se lea de una fila; con 3 (la variante de
  // /nosotros) `lg:grid-cols-5` dejaría dos huecos y el arco descentrado.
  const columnas = miembros.length >= 5 ? 'sm:grid-cols-3 lg:grid-cols-5' : 'sm:grid-cols-3'

  return (
    <section
      ref={sectionRef}
      className={enmarcada ? 'px-5 py-seccion-sm sm:px-10 sm:py-seccion' : undefined}
    >
      <div className={enmarcada ? 'mx-auto max-w-contenido' : undefined}>
        <div className="text-center">
          <Etiqueta>{etiqueta}</Etiqueta>
          <h2 className="mx-auto mt-3 max-w-2xl text-balance font-display text-h2 font-semibold text-navy">
            {titulo}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lead text-navy-sub">{texto}</p>
        </div>

        {/* mt-12: desde la 3ª vuelta NINGUNA card arranca por encima de su
            fila (todas salen de más abajo y suben — use-equipo-scroll.ts),
            así que ya no hace falta el mt-16 extra que reservaba aire arriba
            para que la central no pisara el párrafo. grid-cols-1 en móvil
            (evita la huérfana de "5 en columnas de 2"), sm:grid-cols-3 (3+2)
            y recién en lg:grid-cols-5 las 5 quedan en una sola fila — el
            arco de 3 niveles solo se lee completo ahí. */}
        <div className={`mt-12 grid grid-cols-1 gap-6 ${columnas}`}>
          {miembros.map((m) => (
            <CardMiembro key={m.id} miembro={m} hrefHistoria={hrefHistoria} />
          ))}
        </div>

        {/* Cierre: la tripulación a bordo (capitán, bióloga, chef, guía) NO se
            lista aquí — vive en /nosotros. Esta línea la menciona y lleva
            allí, que es el trabajo de un teaser.

            mt-20, no mt-8: las cards de los extremos arrancan 3 escalones
            (~120px) por debajo de su sitio, así que con la holgura de antes
            se sentaban ENCIMA de este enlace hasta que el scroll las subía —
            tienen fondo sólido y lo tapaban. Con 20 (80px) solo podrían
            solapar los extremos, que quedan a los lados de este texto
            centrado; la card del centro baja 1 escalón (40px) y no llega. */}
        {cierre === undefined ? (
          <div className="mt-20 flex justify-center">
            <Link
              to="/crew"
              className="group inline-flex items-center gap-1.5 text-lead font-semibold text-coral transition-colors hover:text-coral-dark"
            >
              Meet the crew on board too
              <ArrowRight
                className="size-4 transition-transform duration-200 motion-safe:group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>
        ) : (
          cierre && <div className="mt-20">{cierre}</div>
        )}
      </div>
    </section>
  )
}
