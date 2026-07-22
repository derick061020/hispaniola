import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import * as Accordion from '@/components/alignui/accordion'
import { Etiqueta } from '@/components/ui/etiqueta'
import { IconoWhatsApp } from '@/components/ui/iconos-redes'
import { FAQ_HOME } from '@/data/home'
import { WHATSAPP_URL } from '@/data/tours'

// FAQ de la home.
//
// ⚠️ DEROGA «la home no usa AlignUI» — SOLO para este Accordion (decisión de
// Samuel 2026-07-17; CLAUDE.md actualizado). Mismo uso exacto que
// tour/faq-tour.tsx: chrome vendor por defecto, sin pisar clases (el `cn`
// del accordion es clsx puro, sin tailwind-merge).
//
// ═══ 2 COLUMNAS (2026-07-22, pedido de Samuel con maqueta) ═══
//
// Cierra la corrección v1 del cliente slide 16 (correcciones-v1-cliente/
// planes/01-home.md: «mira este efecto de mostrar las preguntas» → ref.
// six2eight.com, acordeón a la derecha e intro fija a la izquierda). Era la
// duda abierta de ese plan («¿cambiamos a 2 columnas o mantenemos centrado?
// La ref es 2 col.») — respuesta: 2 columnas.
//
// Deroga el layout centrado de 2026-07-17 (eyebrow + H2 + acordeón a
// max-w-3xl, ref. FAQ de Praxa). El centrado funcionaba con 6 preguntas;
// con las 12 de ahora (ver FAQ_HOME) era una columna de 12 cajas idénticas
// apiladas bajo un titular que se perdía al primer scroll.
//
// POR QUÉ STICKY. El acordeón es la columna alta y la que se recorre; la
// izquierda es corta. Sin sticky, el visitante llega a la pregunta 9 con
// media pantalla de blanco al lado y sin el CTA de WhatsApp a la vista —
// justo cuando la duda que NO está en la lista es lo que le queda por
// resolver. Pegada, la salida (WhatsApp) y el «ver todas» viajan con él.
// `items-start` en el grid es obligatorio: con el `stretch` por defecto la
// celda mide lo mismo que el acordeón y el sticky no tiene recorrido.
//
// EL `contents` DEL WRAPPER IZQUIERDO. En lg la columna izquierda es UN
// bloque (intro + CTA juntos, para que el sticky los arrastre a los dos —
// era el pedido: el botón de WhatsApp también viaja). Pero en móvil, apilado,
// ese mismo bloque deja el «¿tu duda no está aquí?» ANTES de las preguntas,
// que es al revés de como se lee. Con `display: contents` (mobile) el wrapper
// desaparece de la caja y sus dos hijos pasan a ser items del grid, así que
// `order` los coloca sueltos: intro (1) → acordeón (2) → CTA (3). En lg el
// wrapper vuelve a ser `block` y recupera el sticky; ahí los `order` de sus
// hijos ya no aplican (dejan de ser items del grid) y no estorban.
export function Faq() {
  return (
    <section id="faq" className="px-5 pb-seccion-sm sm:px-10 sm:pb-seccion">
      <div className="mx-auto grid max-w-contenido grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start lg:gap-16">
        <div className="contents lg:sticky lg:top-faq-sticky-top lg:block">
          <div className="order-1">
            <Etiqueta>FAQ</Etiqueta>
            <h2 className="mt-3 text-balance font-display text-h2 font-semibold text-navy">Preguntas frecuentes</h2>
            <p className="mt-4 max-w-md text-lead text-navy-sub">
              Lo que más nos preguntan antes de reservar: clima, pagos, recogida, comida y quién puede subir a bordo.
            </p>

            <Link
              to="/faq"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-aqua-dark hover:underline"
            >
              Ver todas las preguntas
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>

          {/* Salida para la duda que no está en la lista.
              REBAJADO (2026-07-22, 2ª vuelta — Samuel: «hazlo más simple»).
              Nació como card RELLENA de --color-oceano-footer y era la pieza
              equivocada por dos motivos:
                · Jerarquía — era el único bloque con fondo de la sección, así
                  que el ojo aterrizaba ahí antes que en las preguntas. En una
                  FAQ el contenido son las preguntas.
                · Repetición — el orden de la home es Contacto (rail de Eva,
                  CTA de WhatsApp) → Faq → Footer (océano turquesa a sangre con
                  su CTA). Un panel turquesa aquí era el segundo WhatsApp y el
                  segundo turquesa en pantalla y media. El turquesa fuerte se
                  reserva para el footer, que es donde cierra la página.
              Y de paso el relleno saturado contradecía la regla de la
              dirección B (CLAUDE.md): el aqua es acento con cuentagotas, nunca
              fondo grande. Ahora lo único saturado de la columna es el glifo.
              El hairline hace el trabajo de separar que hacía el color.
              Los dos secundarios apilados se distinguen por PESO, no por
              color: «ver todas» es link de texto, WhatsApp es botón bordeado. */}
          <div className="order-3 border-t border-linea pt-6 lg:mt-8">
            <p className="font-semibold text-navy">¿No ves tu pregunta?</p>
            <p className="mt-1 text-sm text-navy-sub">
              Te responde una persona real, no un robot ni un call center.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener"
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-btn px-5 py-3 text-sm font-semibold text-navy ring-1 ring-linea transition hover:bg-aqua-tint hover:ring-aqua"
            >
              <IconoWhatsApp className="h-4 w-4 text-aqua-dark" />
              Pregúntanos por WhatsApp
            </a>
            <p className="mt-3 text-xs text-navy-soft">Respondemos en minutos · español e inglés</p>
          </div>
        </div>

        <Accordion.Root type="single" collapsible defaultValue="faq-0" className="order-2 flex flex-col gap-3 text-left">
          {FAQ_HOME.map((item, i) => (
            <Accordion.Item key={item.p} value={`faq-${i}`}>
              <Accordion.Header>
                {/* grid-cols invertido respecto al del vendor
                    (`auto_minmax(0,1fr)`: texto que NO encoge + arrow que sí).
                    Con las preguntas cortas de antes daba igual; con las de
                    ahora («¿Aceptan tarjeta? ¿Puedo pagar en el hotel?») el
                    texto se come la columna del + en móvil y el icono queda
                    encima de la última palabra. Invertido, el que cede es el
                    texto (que envuelve) y el + conserva su ancho. */}
                <Accordion.Trigger className="grid-cols-[minmax(0,1fr)_auto]">
                  {item.p}
                  <Accordion.Arrow className="justify-self-end" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content>{item.r}</Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  )
}
