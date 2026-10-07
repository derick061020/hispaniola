import * as Accordion from '@/components/alignui/accordion'
import { MUSEO } from '@/data/museo'

// PREGUNTAS — las seis del V1 con SUS respuestas (el V2 contestaba distinto a
// dos). Acordeón de AlignUI como el resto de internas; el vendor no se toca,
// se viste por className.
//
// [2ª vuelta, Samuel: «no me gusta que tengan ese borde tan duro, se ve un poco
// sucio»] Fuera el anillo de 1px del vendor: cada pregunta es una pieza de
// vidrio con el radio grande de las tarjetas de esta página, separada de la
// siguiente por aire y no por una línea. La abierta se aclara un punto y su
// icono se enciende (museo.css, `.museo-faq-icono`) — el estado se ve por la
// luz, no por un borde.
//
// ⚠️ Las clases van con `!`: tailwind-merge no reconoce `text-museo-*`,
// `bg-museo-*` ni `rounded-card-grande` como de la misma familia que las del
// vendor y no las deja ganar (las preguntas llegaron a salir en navy).

const ITEM =
  'rounded-card-grande! bg-museo-vidrio! p-5! ring-0! backdrop-blur-md transition-colors duration-300 ' +
  'hover:bg-museo-vidrio-fuerte! has-[:focus-visible]:bg-museo-vidrio-fuerte! data-[state=open]:bg-museo-vidrio-fuerte! sm:p-6!'

export function FaqMuseo() {
  const f = MUSEO.faq
  return (
    <section id="faq" className="museo-seccion">
      <div className="mx-auto max-w-3xl">
        <p className="museo-eyebrow text-center" data-museo-revelar>
          {f.eyebrow}
        </p>
        <h2 className="museo-h2 mt-3 text-center" data-museo-revelar>
          {f.titulo}
        </h2>
        <Accordion.Root type="single" collapsible defaultValue="faq-0" className="mt-10 flex flex-col gap-3">
          {f.preguntas.map((item, i) => (
            <Accordion.Item key={item.p} value={`faq-${i}`} data-museo-revelar className={ITEM}>
              <Accordion.Header>
                <Accordion.Trigger className="text-lg! font-medium! text-museo-texto!">
                  {item.p}
                  <Accordion.Arrow className="museo-faq-icono justify-self-end" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="pt-3! text-base! leading-relaxed text-museo-texto-suave!">
                {item.r}
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  )
}
