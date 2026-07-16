import { Link } from 'react-router-dom'
import * as Accordion from '@/components/alignui/accordion'
import { Etiqueta } from '@/components/ui/etiqueta'
import { TOURS, bookingCta, formatoDinero } from '@/data/home'
import { FICHAS, type FichaTour } from '@/data/tours'

// FAQ del tour + «También te puede gustar» (wireframe A5).
//
// La FAQ es la de ESTE tour (`faqTour`), no la genérica de la home: contesta lo
// que frena a quien está mirando este producto (Saona: «¿cuál es el precio?» →
// «aún no está definido»; charter: «¿cuál es el mínimo de personas?» → «dato
// pendiente»). Que la respuesta honesta sea «no lo sabemos todavía» es
// preferible a inventarla — y deja la pregunta pendiente a la vista.
//
// Etapa A (PLAN-ALIGNUI.md): el acordeón es el Accordion del sistema (Radix,
// portado de las docs públicas — los templates Pro no lo traen). La HOME
// conserva ui/acordeon intacto: AlignUI vive de la ficha hacia dentro. Misma
// conducta que antes: primera pregunta abierta, solo una a la vez (single +
// collapsible), + / − como indicador (el default del sistema).
//
// «También te puede gustar» son los PRIMEROS enlaces internos reales del
// sitio (<Link> a otra ficha): hasta aquí todo lo que no era la home iba por
// EnlacePrototipo. Es también la prueba viva de ScrollAlNavegar — sin él, ir
// de una ficha a otra aterrizaría a media página.

export function FaqTour({ ficha }: { ficha: FichaTour }) {
  const relacionados = ficha.tambienTeGusta
    .map((slug) => ({ tour: TOURS.find((t) => t.slug === slug)!, ficha: FICHAS[slug] }))
    .filter((r) => r.tour && r.ficha)

  return (
    <section id="ancla-faq" className="scroll-mt-sticky-top">
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <Etiqueta>FAQ de este tour</Etiqueta>
          <Accordion.Root type="single" collapsible defaultValue="faq-0" className="mt-4 flex flex-col gap-3">
            {ficha.faqTour.map((item, i) => (
              <Accordion.Item key={item.p} value={`faq-${i}`}>
                <Accordion.Header>
                  <Accordion.Trigger>
                    {item.p}
                    <Accordion.Arrow className="justify-self-end" />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content>{item.r}</Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </div>

        <div>
          <Etiqueta>También te puede gustar</Etiqueta>
          <div className="mt-4 flex flex-col gap-3">
            {relacionados.map(({ tour: t, ficha: f }) => (
              <Link
                key={t.slug}
                to={`/tours/${t.slug}`}
                className="group flex items-center gap-4 rounded-card bg-papel p-3 ring-1 ring-linea transition-colors hover:bg-papel-hueso"
              >
                <img
                  src={`/fotos/${t.foto}.webp`}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="size-16 shrink-0 rounded-lg object-cover"
                />
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-sm font-semibold text-navy group-hover:text-aqua-dark">
                    {t.nombre}
                  </span>
                  <span className="mt-0.5 block text-xs text-navy-soft">
                    {f.audiencia} ·{' '}
                    {t.precioLight !== null ? `desde ${formatoDinero(t.precioLight)} /pers` : bookingCta[t.booking]}
                  </span>
                </span>
                <span aria-hidden="true" className="shrink-0 text-navy-soft transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
