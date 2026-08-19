import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, ChevronDown, ChevronRight, Mail, MapPin, MessageCircle, Phone, Ticket } from 'lucide-react'
import { Etiqueta } from '@/components/ui/etiqueta'
import { Boton } from '@/components/ui/boton'
import { Campo } from '@/components/ui/campo'
import { IconoWhatsApp } from '@/components/ui/iconos-redes'
import { errorEnvio, useEnvioFormulario } from '@/lib/use-envio-formulario'
import { CONTACTO, type ContactoCard } from '@/data/home'
import { WHATSAPP_URL } from '@/data/tours'
import { EQUIPO } from '@/data/nosotros'
import { useDevFlag } from '@/dev/use-dev-flag'
import { t } from '@/lib/i18n'

// Sección «Contacto» (2026-07-17, pedido de Samuel) — mapa + formulario +
// datos de contacto, con la card de persona que pidieron las correcciones v1
// del cliente (2026-07-20, planes/01-home.md slides 13-14, «dale más cariño
// please»). El formulario es SOLO PROTOTIPO (sin backend), mismo criterio que
// inicializarFormularioDemo del prototipo/app.js; el mapa es un iframe de
// Google Maps sin API key (coordenadas fijas de CONTACTO.mapaEmbedUrl).
//
// ═══ REDISEÑO 2026-07-22 (Samuel: «me parece horrible, mejorar diseño y
// estructura... haz un buen research tipo Apple, Stripe, Bolt») ═══
//
// EL DIAGNÓSTICO. Ninguna pieza estaba mal por sí sola; el problema era la
// COMPOSICIÓN. La sección eran SEIS losas apiladas — encabezado, card de
// persona, formulario, bloque de reserva, 4 cards de contacto y mapa — todas
// con el mismo `rounded-card-grande ring-1 ring-linea`, todas sobre el mismo
// papel blanco y todas separadas por el mismo `mt-6`. Sin figura/fondo y con
// seis elementos del mismo peso, no hay dónde mirar primero: el bloque más
// importante de conversión de la home se leía como un volcado de cajas. A eso
// se sumaban tres cosas concretas:
//   · Las 2 columnas (formulario alto vs. bloque de reserva bajo) no
//     cuadraban de alto — una quedaba con medio metro de aire muerto.
//   · El iframe de Google llegaba con LA PALETA DE GOOGLE (verdes de parque,
//     amarillo de carretera) — el único elemento de toda la home fuera de los
//     tokens, y lo que hacía que la sección pareciera sin terminar.
//   · Triple duplicado del mismo dato: el WhatsApp estaba en el CTA de la
//     persona Y en su card; el teléfono, en el microcopy de la persona Y en
//     su card; la dirección, en la card de Oficina Y en el mapa.
//
// LA INVESTIGACIÓN (Apple / Stripe / Bolt). Tres reglas, no tres estéticas:
//   1. STRIPE — «hairline rules between rows», nunca una card por dato. Las 4
//      cards de contacto dejan de ser cards.
//   2. STRIPE — elevación RESERVADA: un único panel recorta toda la sección,
//      no seis losas repitiendo cada una su propio rounded-card-grande+ring.
//   3. APPLE (apple.com/contact) — los canales son FILAS: icono, etiqueta en
//      caps, dato, chevron; toda la fila es el enlace. Es el patrón que más
//      información mete con menos ruido, justo lo contrario de 4 cards con
//      círculo de color.
//
// 2ª VUELTA (mismo día, Samuel tras ver el primer rediseño): «me gusta, quita
// el gris, debe ser blanco; quita la sombra del box» — el bg-fondo-ficha de
// la sección y el shadow-card del panel se revierten. El panel se recorta
// SOLO con ring-1 ring-linea sobre el papel blanco de la sección; el carril
// interior (bg-papel-hueso) sigue haciendo el trabajo real de separar
// carril/formulario.
//
// 3ª VUELTA (mismo día): «el mapa debe aparecer en grande, tal vez abajo, y
// lo de "¿ya tienes una reserva?" donde actualmente dice Oficina» — el mapa y
// el bloque de reserva se INTERCAMBIAN de sitio respecto al primer rediseño.
//
// 4ª VUELTA (mismo día): «que el mapa esté separado de este módulo de
// contacto, que abarque el 100% de la pantalla en ancho, y este embed para
// poder movernos, y la dirección de oficina y eso lo dejamos como footer del
// módulo». El mapa se independiza por completo del panel — deja de ser una
// pieza DENTRO de él (recortada por su `overflow-hidden rounded-card-
// grande`) y pasa a ser su propio bloque A SANGRE, a todo el ancho de la
// PANTALLA (no del panel), e INTERACTIVO de verdad (ya no un enlace-tarjeta
// inerte a Google Maps: se arrastra, se hace zoom). La dirección de Oficina
// se queda en el panel, pero ya solo como texto — el mapa visual vive aparte.
//
// ESTRUCTURA FINAL:
//
//   ┌─ encabezado centrado (eyebrow · H2 · lead) ──────────────────┐
//   ├─ PANEL (un solo hairline recorta TODO, sin sombra) ──────────┤
//   │ carril (gris)          │ formulario (blanco = la acción)     │
//   │  · Eva + punto vivo    │  · canal preferido (segmentado)     │
//   │  · CTA WhatsApp        │  · nombre/tel · email/asunto        │
//   │  · filas tel. y email  │  · mensaje                          │
//   │  · ¿ya tienes reserva? │  · enviar                           │
//   ├─ Oficina (texto, footer del panel) ───────────────────────────┤
//   └────────────────────────────────────────────────────────────────┘
//   ┌─ MAPA interactivo, A SANGRE (100% del ancho de la pantalla) ──┐
//   └──────────────────────────────────────────────────────────────┘
//
// Y CADA DATO VIVE EN UN SOLO SITIO, al peso que le toca:
//   · WhatsApp → CTA primario (es el canal que el cliente quiere empujar).
//   · Teléfono y Email → filas con hairline, en el carril.
//   · ¿Ya tienes una reserva? → vive en el carril, junto a Eva/WhatsApp/
//     teléfono/email: es la 5ª forma de «habla con nosotros / gestiona lo
//     tuyo» del mismo carril de acciones, no una intención tan distinta como
//     para necesitar su propia franja a lo ancho (que es donde vivía antes
//     de esta vuelta, y de donde venía además el desajuste de alturas entre
//     formulario y carril).
//   · Oficina → el texto (título + dirección + enlace externo) se queda como
//     footer del panel; el MAPA visual se separa a su propio bloque a sangre,
//     a colores nativos de Google (5ª vuelta revierte el tinte de marca de
//     la 4ª — ver el comentario de MapaInteractivo más abajo).
// No se pierde ningún elemento de los que había, que era la condición de
// Samuel: cambian de peso y de sitio, no desaparecen.

const ICONOS: Record<ContactoCard['id'], typeof MessageCircle> = {
  whatsapp: MessageCircle,
  telefono: Phone,
  email: Mail,
  oficina: MapPin,
}

// Los 4 canales de CONTACTO.cards siguen siendo la fuente única — lo que
// cambia es a qué pieza va cada uno. Se buscan por id (y no por posición)
// para que reordenar el array en data/home.ts no reorganice el diseño.
const CARD = Object.fromEntries(CONTACTO.cards.map((c) => [c.id, c])) as Record<
  ContactoCard['id'],
  ContactoCard
>
// Filas del carril: los canales «de texto». WhatsApp no está porque ya es el
// botón de arriba, y Oficina tampoco porque es el mapa de abajo — repetirlos
// aquí sería el duplicado que este rediseño vino a quitar.
const FILAS: ContactoCard['id'][] = ['telefono', 'email']

// Iniciales en círculo — mismo placeholder honesto que las reseñas: no
// tenemos retrato del equipo (pedido al cliente, ver EQUIPO en data/nosotros.ts).
function Retrato({ nombre, foto }: { nombre: string; foto: string | null }) {
  if (foto) {
    return (
      <img
        src={`/fotos/${foto}.webp`}
        alt={nombre}
        // ring-2 ring-papel: el retrato se recorta contra el gris del carril
        // con un canto blanco, para que el recorte transparente de la foto no
        // se funda con el fondo (mismo problema que resuelve el bg-papel-hueso
        // de las cards de EquipoTeaser).
        className="size-14 shrink-0 rounded-full bg-papel object-cover ring-2 ring-papel"
        loading="lazy"
      />
    )
  }
  return (
    <div
      aria-hidden="true"
      className="grid size-14 shrink-0 place-items-center rounded-full bg-aqua-tint font-display text-xl font-semibold text-aqua-dark ring-2 ring-papel"
    >
      {nombre.slice(0, 1)}
    </div>
  )
}

// Cabeza del carril: la persona. Antes era una losa propia a lo ancho de toda
// la sección; ahora es lo primero que se lee DENTRO del panel — que es
// exactamente lo que promete el titular («hablas con nosotros, no con un call
// center»), así que va donde empieza la lectura y no en una caja aparte.
function Persona() {
  const persona = EQUIPO.find((m) => m.id === CONTACTO.persona.idEquipo)
  if (!persona) return null

  // chips[0] («Fast response») es el estado, no una etiqueta: sube a la
  // píldora con el punto que late. El resto queda como meta en una línea.
  // [v3 2026-08-06] Desde las correcciones v3 solo hay UN chip y `texto` es
  // null (WEBSITE - INICIO pág. 6: «quitar la parte debajo de Eva, solo
  // poner Fast Response»), así que `resto` viene vacío y el párrafo no se
  // pinta — las dos ramas condicionales de abajo ya lo contemplaban.
  const [estado, ...resto] = CONTACTO.persona.chips

  return (
    <div className="p-6 sm:p-7">
      <div className="flex items-center gap-4">
        <Retrato nombre={persona.nombre} foto={persona.foto} />
        <div className="min-w-0">
          <p className="font-display text-h3 font-semibold leading-tight text-navy">{persona.nombre}</p>
          {/* Solo el rol: el «· Punta Cana» que llevaba antes no cabía en el
              ancho del carril (se cortaba en «Punta C…») y además ya lo dice
              la dirección de la oficina, al pie de este mismo carril. */}
          <p className="mt-0.5 text-sm leading-snug text-navy-soft">{persona.rol}</p>
        </div>
      </div>

      {estado ? (
        <p className="mt-4 inline-flex items-center gap-2 rounded-chip bg-menta px-3 py-1.5 text-xs font-semibold text-menta-texto">
          <span aria-hidden="true" className="contacto-pulso" />
          {estado}
        </p>
      ) : null}

      {CONTACTO.persona.texto ? (
        <p className="mt-4 text-sm leading-relaxed text-navy-sub">{CONTACTO.persona.texto}</p>
      ) : null}

      {resto.length ? (
        <p className="mt-3 text-xs text-navy-soft">{resto.join(' · ')}</p>
      ) : null}

      {/* El canal que el cliente quiere empujar: único botón lleno del carril.
          El icono es la marca real (ui/iconos-redes.tsx), no el bocadillo
          genérico de lucide que usa la fila de la lista — a tamaño de CTA la
          diferencia se nota.
          [v3 2026-08-07, pedido de Samuel] `tono="whatsapp"` (ui/boton.tsx):
          deja de ser coral y pasa al verde de marca. Es el ÚNICO botón del
          sitio que no es coral, y a propósito — el coral dice «reserva» en
          toda la home, así que un CTA coral aquí competía con esa promesa
          además de no parecerse a lo que abre. El verde + el icono + el
          nombre del canal en el texto lo identifican sin leerlo. */}
      <Boton href={CARD.whatsapp.href ?? WHATSAPP_URL} tono="whatsapp" className="mt-5 w-full">
        <IconoWhatsApp className="size-4" />
        {CARD.whatsapp.cta ?? t('Chat now on WhatsApp')}
      </Boton>
    </div>
  )
}

// Canales «de texto» como FILAS con hairline (patrón de apple.com/contact),
// no como cards: icono, etiqueta en caps, dato, chevron, y toda la fila es el
// enlace. Cuatro cards con círculo de color pesaban más que el formulario al
// que tenían que ceder el paso.
function FilaContacto({ card }: { card: ContactoCard }) {
  const Icono = ICONOS[card.id]
  return (
    <a
      href={card.href}
      className="group flex items-center gap-3.5 px-6 py-3.5 transition-colors hover:bg-papel sm:px-7"
    >
      <Icono className="size-4 shrink-0 text-aqua-dark" strokeWidth={2} aria-hidden="true" />
      <span className="min-w-0 flex-1">
        <span className="block text-eyebrow font-semibold uppercase tracking-[0.08em] text-navy-soft">
          {card.titulo}
        </span>
        {/* break-words y no truncate: el email del cliente mide 32 caracteres
            y en el ancho del carril se cortaba en «info@catamarantourspuntac…»
            — un dato de contacto truncado no sirve para nada. Prefiere partir
            en dos líneas antes que esconder la mitad. */}
        <span className="mt-0.5 block break-words text-sm font-medium leading-snug text-navy">
          {card.dato}
        </span>
      </span>
      {/* El verbo de la acción (correcciones v1, slide 14) sigue estando: ya
          no como línea coral propia sino como el título accesible de la fila
          — el chevron dice «lleva a algún sitio» sin gastar una línea. */}
      <span className="sr-only">{card.cta}</span>
      <ChevronRight
        aria-hidden="true"
        className="size-4 shrink-0 text-navy-soft transition group-hover:translate-x-0.5 group-hover:text-aqua-dark"
      />
    </a>
  )
}

// «¿Ya tienes una reserva?» — vive en el carril (3ª vuelta del rediseño,
// pedido de Samuel: el mapa se va grande al pie del panel y este bloque
// ocupa el hueco que deja, junto a Eva/WhatsApp/teléfono/email). Es la 5ª
// forma de «habla con nosotros / gestiona lo tuyo» del mismo carril de
// acciones — no necesita su propia franja a lo ancho, esa es la intención
// que sí tiene el formulario (pedir info), esta es «ya soy cliente». No
// valida el código aquí (no hay backend): manda a /mi-reserva, que es donde
// vive ese flujo completo, con el código ya escrito en la URL.
//
// [v3 2026-08-06, PowerPoint slide 67 + reunión 07-31 14:31: «que el cliente
// pueda buscar por reserva, por email y por teléfono»] El campo deja de ser
// SOLO el código. Sigue habiendo UN input —al ancho del carril no caben tres
// controles— y es la página de destino quien resuelve qué se escribió:
// con «@» es un email, solo dígitos/+/espacios/guiones es un teléfono, y
// cualquier otra cosa es el código. El upper-case automático se retira: era
// correcto para HSP-XXXX pero destroza un email al escribirlo.
function BloqueReserva() {
  const [valor, setValor] = useState('')

  const buscado = valor.trim()
  const modo = buscado.includes('@')
    ? 'email'
    : /^[\d+\s().-]+$/.test(buscado) && /\d/.test(buscado)
      ? 'telefono'
      : 'codigo'
  // El código viaja en mayúsculas (así se emite); email y teléfono, tal cual.
  const consulta = modo === 'codigo' ? buscado.toUpperCase() : buscado
  const destino = buscado
    ? `/my-booking?modo=${modo}&q=${encodeURIComponent(consulta)}`
    : '/my-booking'

  // Sin `border-t` propio: la línea que lo separa de la lista de canales la
  // pinta ESA lista, por abajo (ver el comentario del carril en Contacto). Con
  // las dos, cuando no sobra alto quedaban dos hairlines pegados — una raya de
  // 2px, más gruesa que el resto de la retícula.
  return (
    <div className="mt-auto p-6 sm:p-7">
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="grid size-9 shrink-0 place-items-center rounded-btn bg-aqua-tint text-aqua-dark"
        >
          <Ticket className="size-4" strokeWidth={2} />
        </span>
        <div>
          <p className="text-sm font-semibold text-navy">{t('Already have a booking?')}</p>
          <p className="mt-1 text-sm leading-snug text-navy-sub">
            {t('Manage it yourself: change the menu, the pick-up or pay the balance.')}
          </p>
        </div>
      </div>

      {/* Campo y botón UNIDOS en una sola pieza, LADO A LADO (el anillo vive en
          el contenedor y se activa con focus-within) — decisión de Samuel,
          reafirmada el 2026-08-07 sobre una versión apilada: «me gusta que esté
          al lado del input».
          [v3 2026-08-07, pedido de Samuel: «hay que mencionar y explicar mejor
          que puede poner el código de booking, el mail o el teléfono»]. Las tres
          opciones ya se aceptaban desde el 08-06 (ver el comentario de arriba),
          pero el único sitio que lo contaba era el placeholder — y NO CABÍA:
          medido, al campo le quedaban 132px de hueco de texto y «Booking code,
          email or phone» mide 208px, así que se leía «Booking code, ema…» y la
          mitad del mensaje (email Y teléfono, justo lo que había que anunciar)
          no llegaba nunca.
          Con los dos controles en la misma fila, esos 208px NO se pueden
          recuperar: el carril da 288px y el botón se lleva su parte pase lo que
          pase. Así que el mensaje se reparte en vez de forzarlo en el hueco
          equivocado — el placeholder se queda con una versión corta que sí entra
          entera (medida abajo), y la explicación completa, con el formato del
          código (HSP-XXXX-XXXX, el dato que nadie recuerda de memoria), baja a
          una línea de ayuda propia. La línea, además, hace algo que un
          placeholder no puede: NO desaparece al empezar a escribir.
          Lo que compra el ancho del placeholder corto, todo en la misma fila:
          el botón pierde la flecha (~20px — el chevron de las filas de arriba ya
          no está aquí para justificarla, y «Manage» solo ya dice que es una
          acción) y se recortan tres paddings mínimos (campo px-2, botón px-3,
          gap-1.5). Con eso el hueco pasa de 132px a 162px y «Code, email or
          phone» (151px) entra con 11px de margen — medido en el navegador, no a
          ojo: es el tipo de ajuste que se rompe solo si alguien lo devuelve a
          los valores «redondos» sin volver a medir. */}
      <div className="mt-4 flex items-center gap-1.5 rounded-btn bg-papel p-1.5 ring-1 ring-linea focus-within:ring-2 focus-within:ring-aqua">
        <input
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          placeholder={t('Code, email or phone')}
          aria-label={t('Booking code, email or phone number')}
          aria-describedby="reserva-ayuda"
          className="min-w-0 flex-1 bg-transparent px-2 py-1.5 text-sm text-navy placeholder:text-navy-soft focus:outline-none"
        />
        <Link
          to={destino}
          className="shrink-0 rounded-btn bg-navy px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-aqua-dark"
        >
          {t('Manage')}
        </Link>
      </div>
      <p id="reserva-ayuda" className="mt-2 text-xs leading-snug text-navy-soft">
        {t('Any of the three works: your booking code (HSP-XXXX-XXXX), the email or the phone number you booked with.')}
      </p>
    </div>
  )
}

// [v3 2026-08-06] Aquí vivía `CanalPreferido` (el segmentado «¿Cómo prefieres
// que te contactemos?»). El cliente pidió QUITARLO (WEBSITE - INICIO pág. 6);
// era su único consumidor, así que se borra en vez de dejarlo sin montar.
// Sigue en el tag `v3-pre-en` si hiciera falta recuperarlo.

// El envío ya no es una línea verde debajo del botón (se quedaba a media
// altura de un formulario que seguía ahí, invitando a reenviarlo): ahora
// SUSTITUYE al formulario. El estado terminal ocupa el mismo hueco, así el
// panel no cambia de alto al enviar.
function Confirmacion({ onReset }: { onReset: () => void }) {
  return (
    <div role="status" className="flex h-full flex-col items-center justify-center py-10 text-center">
      <div aria-hidden="true" className="grid size-12 place-items-center rounded-full bg-menta text-menta-texto">
        <Check className="size-6" strokeWidth={2.5} />
      </div>
      <p className="mt-4 font-display text-h3 font-semibold text-navy">{t('Message sent')}</p>
      <p className="mt-2 max-w-prose text-sm leading-relaxed text-navy-sub">{CONTACTO.confirmacion}</p>
      <button
        type="button"
        onClick={onReset}
        className="mt-5 text-sm font-semibold text-aqua-dark hover:underline"
      >
        {t('Send another message')}
      </button>
    </div>
  )
}

// Pie del panel: SOLO la dirección de Oficina, como texto (4ª vuelta del
// rediseño, pedido de Samuel: «que el mapa esté separado de este módulo de
// contacto... y la dirección de oficina y eso lo dejamos como footer del
// módulo»). El mapa en sí se separa por completo — ver MapaInteractivo más
// abajo, que ya no vive dentro de este panel.
function PieOficina() {
  const oficina = CARD.oficina
  return (
    <div className="flex flex-col gap-3 border-t border-linea p-6 sm:flex-row sm:items-center sm:justify-between sm:px-7 lg:px-10">
      <div>
        <p className="text-eyebrow font-semibold uppercase tracking-[0.08em] text-navy-soft">
          {oficina.titulo}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-navy-sub">{oficina.dato}</p>
      </div>
      {/* Mismo idioma de enlace que el resto de la home («Ver todas las
          preguntas →» de la FAQ) — abre el sitio real de Google Maps; el
          embed interactivo de abajo es para explorar, este es para llegar. */}
      <a
        href={oficina.href}
        target="_blank"
        rel="noopener"
        className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-aqua-dark hover:underline"
      >
        {oficina.cta}
        <ArrowRight className="size-3.5" aria-hidden="true" />
      </a>
    </div>
  )
}

// El mapa, SEPARADO del módulo de Contacto y A SANGRE — 100% del ancho de la
// pantalla (4ª vuelta del rediseño, pedido de Samuel: «que el mapa esté
// separado de este módulo... que abarque el 100% de la pantalla en ancho, y
// este embed para poder movernos»).
//
// `-mx-5 sm:-mx-10` cancela EXACTO el padding lateral que la propia
// <section> se puso (mismo principio que el ticker del hero, hero.tsx): con
// margin negativo y width:auto, el navegador resuelve el ancho para llenar
// justo lo que el margen negativo abre — más simple que 100vw/50vw, que ese
// mismo componente ya descartó por arrastrar el ancho de la scrollbar y
// desbordar la página. Aquí no hace falta escapar de ningún centrado (el
// mapa vive FUERA del `mx-auto max-w-5xl` del módulo, directo bajo la
// <section>), así que cancelar el padding basta.
//
// El iframe deja de ir INERTE: sin pointer-events-none/tabIndex/aria-hidden,
// es un Google Maps de verdad — se arrastra, se hace zoom, se tocan sus
// propios controles. Por eso también deja de ir envuelto en un <a>: un mapa
// que se puede arrastrar no puede ser a la vez un enlace de página completa
// (el gesto de arrastrar y el de navegar competirían).
//
// 5ª VUELTA (mismo día, Samuel: «que el mapa sea un poco más alto y no se
// vea gris, que se vea normal a colores») — REVIERTE el tinte de marca
// (desaturado + overlay navy) de la vuelta anterior: sin filtro ni overlay,
// la paleta es la nativa de Google. Tenía sentido cuando el mapa vivía
// encajado DENTRO del panel (un recuadro gris de marca al lado de un
// formulario blanco); separado y a sangre como quedó en la 4ª vuelta, ya no
// compite con nada — y a colores se navega mejor (es un embed que ahora se
// arrastra y se hace zoom de verdad, no solo una miniatura decorativa).
// --contacto-mapa-filtro y --color-overlay-mapa se retiran de tokens.css:
// un token que ya nadie usa es una variable de Figma que miente.
//
// Sin radio propio: a sangre, tocando el borde real de la pantalla, una
// esquina redondeada ahí se leería como que el mapa NO llega hasta el borde.
function MapaInteractivo() {
  return (
    <div className="relative mt-10 h-contacto-mapa-movil -mx-5 sm:-mx-10 lg:h-contacto-mapa">
      <iframe
        src={CONTACTO.mapaEmbedUrl}
        title={t('Map: Hispaniola Aquatic Adventures office, Punta Cana')}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="size-full border-0"
      />
    </div>
  )
}

// mostrarEncabezado: false en /contacto (pages/contacto.tsx) — la cabecera
// del HeroInterna ya muestra eyebrow+H1+lead con este mismo CONTACTO.titulo;
// repetirlo aquí sería el mismo titular dos veces en la misma página. La
// home (donde este bloque no vive bajo ningún hero) lo deja en su default.
export function Contacto({ mostrarEncabezado = true }: { mostrarEncabezado?: boolean }) {
  // [2026-08-18] YA ENVÍA. Este formulario hacía `preventDefault()` y pintaba
  // «Mensaje enviado»: el mensaje no salía del navegador y nadie lo leía nunca.
  // Ahora entra en Odoo como `haa.web.lead` de tipo `contact`.
  const { estado, enviar, enviando } = useEnvioFormulario('contact')
  const [forzado, setForzado] = useState(false)
  const enviado = estado === 'enviado' || forzado

  // [dev-mode] ?dev-contacto=enviado congela la confirmación del formulario
  // sin tener que enviarlo a mano → frame limpio para Figma.
  useDevFlag('dev-contacto', (v) => {
    if (v === 'enviado') setForzado(true)
  }) // [dev-mode]

  return (
    // Pedido de Samuel (2026-07-22, tras ver el primer rediseño): "quita el
    // gris, debe ser blanco; quita la sombra del box" — revierte el bg-
    // fondo-ficha de la sección Y el shadow-card del panel. El panel se
    // recorta ahora SOLO con el ring-1 ring-linea (hairline), sin superficie
    // ni elevación de por medio — el carril interior (bg-papel-hueso) sigue
    // siendo el que separa visualmente carril/formulario.
    <section id="contacto" className="px-5 py-seccion-sm sm:px-10 sm:py-seccion">
      {/* max-w-5xl y no max-w-contenido (1400px): a lo ancho de la home, el
          formulario quedaría con campos de 500px por campo. Stripe capa su
          contenido editorial en ~1080px por lo mismo, y la FAQ de esta misma
          home ya usa un ancho propio (max-w-3xl) — el ancho lo pide el
          contenido, no la rejilla. */}
      <div className="mx-auto max-w-5xl">
        {mostrarEncabezado ? (
          <div className="mx-auto max-w-2xl text-center">
            <Etiqueta>{CONTACTO.eyebrow}</Etiqueta>
            <h2 className="mt-3 text-balance font-display text-h2 font-semibold text-navy">
              {CONTACTO.titulo}
            </h2>
            {/* El lead ya existía en los datos pero solo lo usaba /contacto:
                aquí el H2 iba solo y la sección arrancaba en seco. */}
            <p className="mt-4 text-lead text-navy-sub">{CONTACTO.lead}</p>
          </div>
        ) : null}

        {/* EL PANEL — plano, sin sombra: solo el hairline (ring-1 ring-linea)
            lo recorta contra el papel blanco de la sección. Todo lo de
            dentro se separa con más hairlines (regla 2 de la investigación:
            "hairline rules", nunca elevación de por medio). */}
        <div
          className={`overflow-hidden rounded-card-grande bg-papel ring-1 ring-linea ${
            mostrarEncabezado ? 'mt-10' : ''
          }`}
        >
          <div className="lg:flex">
            {/* CARRIL — gris dentro del panel blanco: el contraste manda la
                mirada al formulario, que es la acción. En móvil el carril se
                apila encima y el borde derecho pasa a ser el de abajo. */}
            <aside className="flex flex-col border-b border-linea bg-papel-hueso lg:w-contacto-rail lg:shrink-0 lg:border-b-0 lg:border-r">
              <Persona />
              {/* border-b, no solo border-t (v3 2026-08-07, bug visual que
                  reportó Samuel: «el bloque de mail está muy alto, se ve raro»).
                  El carril es un flex-col que se ESTIRA al alto del formulario
                  —siempre más alto— y BloqueReserva lleva `mt-auto` para
                  quedarse pegado al pie. Consecuencia: TODO el sobrante de alto
                  del carril se acumulaba justo aquí, entre la última fila y ese
                  bloque. Como la lista no se cerraba por abajo, esos ~70px de
                  gris colgaban DENTRO de la fila de email (que además ya es la
                  más alta, porque la dirección parte en dos líneas) y la hacían
                  parecer el doble de alta que la de teléfono — el hairline
                  siguiente estaba tan lejos que no leía como su borde.
                  Cerrando la lista, el sobrante pasa a ser un respiro
                  declarado ENTRE dos grupos (canales / «¿ya tienes reserva?»),
                  que es lo que de verdad es. */}
              <div className="border-y border-linea">
                {FILAS.map((id, i) => (
                  <div key={id} className={i > 0 ? 'border-t border-linea' : ''}>
                    <FilaContacto card={CARD[id]} />
                  </div>
                ))}
              </div>
              <BloqueReserva />
            </aside>

            {/* FORMULARIO — blanco, el único sitio de la sección donde se
                escribe. min-w-0 obligatorio: sin él, los campos del grid
                desbordan el flex en vez de encogerse. */}
            <div className="p-6 sm:p-8 lg:min-w-0 lg:flex-1 lg:p-10">
              {enviado ? (
                <Confirmacion onReset={() => setForzado(false)} />
              ) : (
                // h-full + flex-col: el carril de al lado (persona + filas +
                // mapa) es más alto que el formulario, así que sin esto el
                // formulario terminaba a media columna y dejaba ~200px de
                // blanco muerto bajo el botón. En vez de rellenar con aire, el
                // hueco se lo queda el TEXTAREA (ver `claseContenedor` abajo):
                // el campo más útil del formulario es el que crece.
                <form
                  onSubmit={(e) => void enviar(e)}
                  className="flex h-full flex-col"
                >
                  {/* [v3 2026-08-06, WEBSITE - INICIO pág. 6] Título y bajada
                      APROBADOS: «¿Prefieres que te escribamos?» → «How can we
                      help you?» + «We don't just answer questions, we help
                      you choose the right experience for your group, budget,
                      and travel style.» */}
                  <h3 className="font-display text-h3 font-semibold text-navy">{t('How can we help you?')}</h3>
                  <p className="mt-2 text-sm text-navy-sub">
                    {t('We don’t just answer questions, we help you choose the right experience for your group, budget, and travel style.')}
                  </p>

                  <div className="mt-6 flex flex-1 flex-col gap-5">
                    {/* [v3 2026-08-06] «QUITAR: ¿Cómo prefieres que te
                        contactemos?» — aquí iba <CanalPreferido />. El dato no
                        se pierde: el visitante deja teléfono y/o email, y el
                        carril de al lado sigue ofreciendo los 3 canales
                        directos. El componente se borra con el selector. */}

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Campo etiqueta={t('Name')} name="name" required />
                      <Campo etiqueta={t('WhatsApp / Phone')} name="phone" type="tel" />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Campo etiqueta={t('Email')} name="email" type="email" required />
                      <div>
                        <label htmlFor="contacto-asunto" className="text-sm font-medium text-navy">
                          {t('What about?')}
                        </label>
                        {/* appearance-none + chevron propio: la flecha nativa
                            del select es la del sistema operativo y era el
                            único control de la home con chrome ajeno a los
                            tokens. El pr-10 reserva su hueco. */}
                        <div className="relative mt-1.5">
                          <select
                            id="contacto-asunto"
                            name="subject"
                            className="w-full appearance-none rounded-btn bg-papel py-3 pl-4 pr-10 text-sm text-navy ring-1 ring-linea focus:outline-none focus:ring-2 focus:ring-aqua"
                          >
                            {CONTACTO.asuntos.map((a) => (
                              <option key={a} value={a}>
                                {a}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            aria-hidden="true"
                            className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-navy-soft"
                          />
                        </div>
                      </div>
                    </div>

                    {/* El campo que absorbe el alto sobrante de la columna.
                        min-h-0 es obligatorio: sin él, `rows={5}` actúa como
                        alto MÍNIMO del flex item y el textarea no puede
                        encogerse por debajo de esas 5 líneas — en un viewport
                        corto desbordaría el panel en vez de adaptarse. */}
                    <Campo
                      etiqueta={t('Message')}
                      name="message"
                      textarea
                      required
                      claseContenedor="flex min-h-0 flex-1 flex-col"
                      className="min-h-0 flex-1"
                    />
                  </div>

                  <Boton
                    type="submit"
                    className="mt-6 w-full disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={enviando}
                  >
                    {enviando ? 'Sending…' : t('Send message')}
                  </Boton>
                  {estado === 'error' ? (
                    <p role="alert" className="mt-3 rounded-btn border border-coral/40 bg-coral/5 p-3 text-xs leading-relaxed text-navy-sub">
                      {errorEnvio()}
                    </p>
                  ) : (
                    <p className="mt-3 text-center text-xs text-navy-soft">
                      {t('We reply within 24 hours. No mailing lists, no sales calls.')}
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>

          <PieOficina />
        </div>
      </div>

      {/* A SANGRE — fuera del `mx-auto max-w-5xl` de arriba a propósito, ver
          el comentario de MapaInteractivo. */}
      <MapaInteractivo />
    </section>
  )
}
