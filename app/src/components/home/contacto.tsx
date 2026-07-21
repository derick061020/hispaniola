import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { Etiqueta } from '@/components/ui/etiqueta'
import { Boton } from '@/components/ui/boton'
import { Campo } from '@/components/ui/campo'
import { CONTACTO, type ContactoCard } from '@/data/home'
import { WHATSAPP_URL } from '@/data/tours'
import { EQUIPO } from '@/data/nosotros'
import { useDevFlag } from '@/dev/use-dev-flag'

// Sección «Contacto» (2026-07-17, pedido de Samuel) — mapa a la izquierda,
// formulario a la derecha, 4 cards de contacto debajo (ref. visual: sección
// de contacto de Lumoro, adaptada a tokens Hispaniola). El mapa es un iframe
// de Google Maps sin API key (coordenadas fijas de CONTACTO.mapaEmbedUrl); el
// formulario es SOLO PROTOTIPO (sin backend), mismo criterio que
// inicializarFormularioDemo del prototipo/app.js.
//
// CORRECCIONES v1 DEL CLIENTE (2026-07-20, planes/01-home.md slides 13-14 —
// «dale más cariño please»). Tres añadidos, en el orden que los pide la
// maqueta:
//   1. CARD DE PERSONA arriba del todo. El titular ya prometía «hablas con
//      nosotros, no con un call center» y debajo venía… un formulario
//      anónimo. Ahora la promesa tiene cara, chips de servicio y un CTA
//      directo a WhatsApp. La persona sale de EQUIPO (data/nosotros.ts), no
//      de un string suelto: es la misma Eva que aparece en /nosotros y en el
//      teaser de equipo de la home.
//   2. El formulario gana CANAL PREFERIDO (WhatsApp/Email/Teléfono) y un
//      selector «¿Sobre qué?» — la maqueta los pide y además hacen el
//      formulario más útil que «Nombre/Email/Mensaje» a secas.
//   3. Bloque «¿YA TIENES UNA RESERVA?» que lleva a /mi-reserva. Antes ese
//      dato vivía como microcopy gris al pie del formulario (CONTACTO.microcopy,
//      que sigue existiendo para /contacto); la maqueta lo sube a bloque
//      propio porque es una intención DISTINTA de «quiero información».
//
// El mapa deja de ser media pantalla: pasa debajo, a lo ancho. Ocupaba la
// mitad del bloque para no decir nada que el visitante necesite decidir —
// la dirección ya está en su card, y la recogida es en hotel.

const ICONOS: Record<ContactoCard['id'], typeof MessageCircle> = {
  whatsapp: MessageCircle,
  telefono: Phone,
  email: Mail,
  oficina: MapPin,
}

// Iniciales en círculo — mismo placeholder honesto que las reseñas: no
// tenemos retrato del equipo (pedido al cliente, ver EQUIPO en data/nosotros.ts).
function Retrato({ nombre, foto }: { nombre: string; foto: string | null }) {
  if (foto) {
    return (
      <img
        src={`/fotos/${foto}.webp`}
        alt={nombre}
        className="size-16 shrink-0 rounded-full object-cover"
        loading="lazy"
      />
    )
  }
  return (
    <div
      aria-hidden="true"
      className="grid size-16 shrink-0 place-items-center rounded-full bg-aqua-tint font-display text-xl font-semibold text-aqua-dark"
    >
      {nombre.slice(0, 1)}
    </div>
  )
}

function CardPersona() {
  const persona = EQUIPO.find((m) => m.id === CONTACTO.persona.idEquipo)
  if (!persona) return null
  return (
    <div className="rounded-card-grande p-6 ring-1 ring-linea sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <Retrato nombre={persona.nombre} foto={persona.foto} />
          <div>
            <p className="font-display text-h3 font-semibold text-navy">{persona.nombre}</p>
            <p className="text-sm text-navy-soft">
              {persona.rol} · Punta Cana
            </p>
            <p className="mt-3 max-w-prose text-sm text-navy-sub">{CONTACTO.persona.texto}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {CONTACTO.persona.chips.map((chip) => (
                <li
                  key={chip}
                  className="rounded-chip bg-papel-hueso px-3 py-1 text-xs font-medium text-navy-sub"
                >
                  {chip}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="shrink-0 lg:text-center">
          <Boton href={WHATSAPP_URL}>Chatea con nosotros ahora</Boton>
          <p className="mt-2 text-xs text-navy-soft">
            o llámanos:{' '}
            <a href="tel:+18006570016" className="font-semibold text-navy hover:underline">
              1-800-657-0016
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

// «¿Ya tienes una reserva?» — la segunda intención de esta sección. No
// valida el código aquí (no hay backend): manda a /mi-reserva, que es donde
// vive ese flujo completo, con el código ya escrito en la URL.
function BloqueReserva() {
  const [codigo, setCodigo] = useState('')
  const destino = codigo.trim()
    ? `/mi-reserva?codigo=${encodeURIComponent(codigo.trim().toUpperCase())}`
    : '/mi-reserva'
  return (
    <div className="flex flex-col rounded-card-grande bg-papel-hueso p-6 sm:p-8">
      <h3 className="font-display text-h3 font-semibold text-navy">¿Ya tienes una reserva?</h3>
      <p className="mt-2 text-sm text-navy-sub">
        Ten a mano tu código y te ayudamos más rápido — o gestiónala tú mismo: cambia el menú, la
        recogida o paga el saldo.
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input
          value={codigo}
          onChange={(e) => setCodigo(e.target.value.toUpperCase())}
          placeholder="HSP-XXXX-XXXX"
          aria-label="Código de reserva"
          className="min-w-0 flex-1 rounded-btn border border-linea bg-papel px-4 py-3 text-sm text-navy placeholder:text-navy-soft/70 focus:border-aqua focus:outline-none focus:ring-2 focus:ring-aqua/20"
        />
        <Link
          to={destino}
          className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-btn bg-navy px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy/90"
        >
          Gestionar
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
      <p className="mt-3 text-xs text-navy-soft">
        Lo encuentras en el email de confirmación — empieza por HSP.
      </p>
    </div>
  )
}

// mostrarEncabezado: false en /contacto (pages/contacto.tsx) — la cabecera
// del HeroInterna ya muestra eyebrow+H1 con este mismo CONTACTO.titulo;
// repetirlo aquí sería el mismo titular dos veces en la misma página. La
// home (donde este bloque no vive bajo ningún hero) lo deja en su default.
export function Contacto({ mostrarEncabezado = true }: { mostrarEncabezado?: boolean }) {
  const [enviado, setEnviado] = useState(false)

  // [dev-mode] ?dev-contacto=enviado congela la confirmación del formulario
  // sin tener que enviarlo a mano → frame limpio para Figma.
  useDevFlag('dev-contacto', (v) => {
    if (v === 'enviado') setEnviado(true)
  }) // [dev-mode]

  return (
    <section id="contacto" className="px-5 py-seccion-sm sm:px-10 sm:py-seccion">
      <div className="mx-auto max-w-contenido">
        {mostrarEncabezado ? (
          <div className="text-center">
            <Etiqueta>Contacto</Etiqueta>
            <h2 className="mt-3 font-display text-h2 font-semibold text-navy">{CONTACTO.titulo}</h2>
          </div>
        ) : null}

        <div className="mt-10">
          <CardPersona />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setEnviado(true)
            }}
            className="rounded-card-grande p-6 ring-1 ring-linea sm:p-8"
          >
            <h3 className="font-display text-h3 font-semibold text-navy">
              ¿Prefieres que te escribamos?
            </h3>
            <p className="mt-2 text-sm text-navy-sub">
              Déjanos tus datos y te contactamos por tu canal preferido.
            </p>

            <div className="mt-5 flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Campo etiqueta="Nombre" name="nombre" required />
                <Campo etiqueta="WhatsApp / Teléfono" name="telefono" type="tel" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Campo etiqueta="Email" name="email" type="email" required />
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="contacto-asunto"
                    className="text-xs font-medium text-navy-sub"
                  >
                    ¿Sobre qué?
                  </label>
                  <select
                    id="contacto-asunto"
                    name="asunto"
                    className="rounded-btn border border-linea bg-papel px-3 py-2.5 text-sm text-navy focus:border-aqua focus:outline-none focus:ring-2 focus:ring-aqua/20"
                  >
                    {CONTACTO.asuntos.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <Campo etiqueta="Mensaje" name="mensaje" textarea required />
            </div>

            <Boton type="submit" className="mt-5 w-full">
              Enviar mensaje
            </Boton>
            {enviado ? (
              <p role="status" className="mt-3 text-sm font-medium text-menta-texto">
                {CONTACTO.confirmacion}
              </p>
            ) : null}
          </form>

          <BloqueReserva />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CONTACTO.cards.map((card) => {
            const Icono = ICONOS[card.id]
            const contenido = (
              <>
                <div aria-hidden="true" className="grid size-10 place-items-center rounded-full bg-aqua-tint text-aqua-dark">
                  <Icono className="size-5" strokeWidth={2} />
                </div>
                <h3 className="mt-3 text-xs font-semibold uppercase tracking-wide text-navy-soft">{card.titulo}</h3>
                <p className="mt-1 text-sm font-semibold text-navy">{card.dato}</p>
                {/* El verbo de la acción (correcciones v1, slide 14). Solo en
                    las cards que llevan a algún sitio. */}
                {card.href && card.cta ? (
                  <p className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-coral">
                    {card.cta}
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </p>
                ) : null}
              </>
            )
            if (!card.href) {
              return (
                <div key={card.id} className="rounded-card p-5 ring-1 ring-linea">
                  {contenido}
                </div>
              )
            }
            return (
              <a
                key={card.id}
                href={card.href}
                target="_blank"
                rel="noopener"
                className="block rounded-card p-5 ring-1 ring-linea transition-colors hover:bg-aqua-tint/40"
              >
                {contenido}
              </a>
            )
          })}
        </div>

        {/* El mapa cierra la sección, a lo ancho. Antes ocupaba media pantalla
            arriba: mucho peso visual para un dato que ya está en la card de
            Oficina y que casi nadie necesita (la recogida es en hotel). */}
        <div className="mt-6 h-contacto-mapa-movil overflow-hidden rounded-card-grande ring-1 ring-linea lg:h-80">
          <iframe
            src={CONTACTO.mapaEmbedUrl}
            title="Mapa — Oficina Hispaniola Aquatic Adventures, Punta Cana"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full w-full border-0"
          />
        </div>
      </div>
    </section>
  )
}
