import { useState } from 'react'
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { Etiqueta } from '@/components/ui/etiqueta'
import { Boton } from '@/components/ui/boton'
import { Campo } from '@/components/ui/campo'
import { CONTACTO, type ContactoCard } from '@/data/home'
import { useDevFlag } from '@/dev/use-dev-flag'

// Sección «Contacto» (2026-07-17, pedido de Samuel) — tras Reviews: mapa a
// la izquierda, formulario a la derecha, 4 cards de contacto debajo (ref.
// visual: sección de contacto de Lumoro, adaptada a tokens Hispaniola). El
// mapa es un iframe de Google Maps sin API key (coordenadas fijas de
// CONTACTO.mapaEmbedUrl); el formulario es SOLO PROTOTIPO (sin backend),
// mismo criterio que inicializarFormularioDemo del prototipo/app.js.

const ICONOS: Record<ContactoCard['id'], typeof MessageCircle> = {
  whatsapp: MessageCircle,
  telefono: Phone,
  email: Mail,
  oficina: MapPin,
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

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="h-contacto-mapa-movil overflow-hidden rounded-card-grande ring-1 ring-linea lg:h-auto">
            <iframe
              src={CONTACTO.mapaEmbedUrl}
              title="Mapa — Oficina Hispaniola Aquatic Adventures, Punta Cana"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full border-0"
            />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              setEnviado(true)
            }}
            className="rounded-card-grande p-6 ring-1 ring-linea sm:p-8"
          >
            <div className="flex flex-col gap-4">
              <Campo etiqueta="Nombre" name="nombre" required />
              <Campo etiqueta="Email" name="email" type="email" required />
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
            <p className="mt-3 text-xs text-navy-soft">{CONTACTO.microcopy}</p>
          </form>
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
      </div>
    </section>
  )
}
