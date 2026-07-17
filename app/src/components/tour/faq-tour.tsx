import * as Accordion from '@/components/alignui/accordion'
import { Etiqueta } from '@/components/ui/etiqueta'
import { BLOQUE_FICHA } from '@/components/tour/bloque-ficha'
import type { FichaTour } from '@/data/tours'

// FAQ del tour (wireframe A5).
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
// PLAN-INTERNAS-V2.md (§C4, pedido de Samuel): «También te puede gustar»
// sale de aquí — no le gustaba compartir columna con la FAQ («siento que
// puede estar mejor, no me gusta que esté a media columna junto con también
// te puede interesar»). Ahora es su propia sección a ancho completo, entre
// el área gris y el footer (ver internas/tambien-te-gusta.tsx), y ESTE
// bloque ocupa toda la columna con el acordeón solo.

export function FaqTour({ ficha }: { ficha: FichaTour }) {
  return (
    <section id="ancla-faq" className={`${BLOQUE_FICHA} scroll-mt-sticky-top`}>
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
    </section>
  )
}
