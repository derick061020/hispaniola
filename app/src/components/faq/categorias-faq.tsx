import { useState } from 'react'
import * as Accordion from '@/components/alignui/accordion'
import { Etiqueta } from '@/components/ui/etiqueta'
import { FAQ_CATEGORIAS } from '@/data/faq'

// 6 categorías, cada una su propio Accordion (AlignUI) independiente — mismo
// vendor/chrome que home/faq.tsx y tour/faq-tour.tsx, aquí con las 14
// preguntas completas agrupadas por categoría en vez de una curaduría plana.
//
// CORRECCIONES v1 DEL CLIENTE (2026-07-20, planes/08-faq.md): la maqueta
// muestra CHIPS DE FILTRO sobre las categorías (Todos · Reservas y pagos ·
// Antes del tour · A bordo · Comida · Clima y cancelaciones · Niños y
// accesibilidad). El contenido ya coincidía con lo que hay — lo único que
// faltaba era poder filtrar.
//
// El filtro es client-side y NO oculta contenido de forma destructiva: con
// «Todos» (por defecto) se ven las 6 categorías como siempre, así que quien
// llegue con un enlace directo a #comida sigue encontrando su ancla. Al
// elegir una categoría concreta se muestra solo esa.
export function CategoriasFaq() {
  const [activa, setActiva] = useState<string | null>(null)

  const visibles = activa ? FAQ_CATEGORIAS.filter((c) => c.id === activa) : FAQ_CATEGORIAS

  return (
    <div>
      {/* Chips de filtro. `null` = «Todos». Son botones y no enlaces: no
          cambian la URL ni la posición del scroll, solo lo que se pinta. */}
      <div
        role="group"
        aria-label="Filtrar preguntas por categoría"
        className="flex flex-wrap justify-center gap-2"
      >
        {[{ id: null, nombre: 'Todos' }, ...FAQ_CATEGORIAS.map((c) => ({ id: c.id, nombre: c.nombre }))].map(
          (chip) => {
            const seleccionado = activa === chip.id
            return (
              <button
                key={chip.id ?? 'todos'}
                type="button"
                onClick={() => setActiva(chip.id)}
                aria-pressed={seleccionado}
                className={`rounded-chip px-4 py-2 text-sm font-medium transition-colors ${
                  seleccionado
                    ? 'bg-navy text-white'
                    : 'bg-papel text-navy-sub ring-1 ring-linea hover:bg-papel-hueso'
                }`}
              >
                {chip.nombre}
              </button>
            )
          },
        )}
      </div>

      <div className="mt-10 flex flex-col gap-10">
        {visibles.map((cat) => (
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
    </div>
  )
}
