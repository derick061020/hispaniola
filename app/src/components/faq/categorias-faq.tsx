import * as Accordion from '@/components/alignui/accordion'
import { Etiqueta } from '@/components/ui/etiqueta'
import { FAQ_CATEGORIAS } from '@/data/faq'

// 6 categorías, cada una su propio Accordion (AlignUI) independiente — mismo
// vendor/chrome que home/faq.tsx y tour/faq-tour.tsx, aquí con las 14
// preguntas completas agrupadas por categoría en vez de una curaduría plana.
export function CategoriasFaq() {
  return (
    <div className="flex flex-col gap-10">
      {FAQ_CATEGORIAS.map((cat) => (
        <section key={cat.id} id={cat.id} className="scroll-mt-header-alto">
          <Etiqueta>{cat.nombre}</Etiqueta>
          <Accordion.Root type="single" collapsible className="mt-4 flex flex-col gap-3">
            {cat.preguntas.map((item, i) => (
              <Accordion.Item key={item.p} value={`${cat.id}-${i}`}>
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
      ))}
    </div>
  )
}
