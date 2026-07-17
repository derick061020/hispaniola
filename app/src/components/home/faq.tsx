import * as Accordion from '@/components/alignui/accordion'
import { Etiqueta } from '@/components/ui/etiqueta'
import { EnlacePrototipo } from '@/components/ui/enlace-prototipo'
import { FAQ_HOME } from '@/data/home'

// FAQ centrado (2026-07-17, pedido de Samuel) — reemplaza el layout de
// galería+FAQ en 2 columnas: sin fotos, solo el acordeón centrado (ref.
// visual: FAQ de Praxa). Primera pregunta abierta por defecto.
//
// ⚠️ DEROGA «la home no usa AlignUI» — SOLO para este Accordion (decisión de
// Samuel 2026-07-17; CLAUDE.md actualizado). Mismo uso exacto que
// tour/faq-tour.tsx: chrome vendor por defecto, sin pisar clases (el `cn`
// del accordion es clsx puro, sin tailwind-merge).
export function Faq() {
  return (
    <section id="faq" className="px-5 pb-seccion-sm sm:px-10 sm:pb-seccion">
      <div className="mx-auto max-w-3xl text-center">
        <Etiqueta>FAQ</Etiqueta>
        <h2 className="mt-3 font-display text-h2 font-semibold text-navy">Preguntas frecuentes</h2>

        <Accordion.Root type="single" collapsible defaultValue="faq-0" className="mt-8 flex flex-col gap-3 text-left">
          {FAQ_HOME.map((item, i) => (
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

        <p className="mt-4 text-sm">
          <EnlacePrototipo className="font-semibold text-aqua-dark hover:underline">
            Ver todas las preguntas →
          </EnlacePrototipo>
        </p>
      </div>
    </section>
  )
}
