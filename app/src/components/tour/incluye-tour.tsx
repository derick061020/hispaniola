import { Check, Camera, Sun, Waves, Shirt, Banknote, Package, Info } from 'lucide-react'
import { TituloSeccion } from '@/components/tour/titulo-seccion'
import { BLOQUE_FICHA } from '@/components/tour/bloque-ficha'
import * as Modal from '@/components/alignui/modal'
import type { FichaTour } from '@/data/tours'

// Qué incluye + Qué llevar (wireframe A4).
//
// 2026-07-17 (feedback de Samuel: "muchos tipos de elementos, rarísimo"): antes
// la sección mezclaba 4 cards con borde + chips + texto plano + más texto plano
// para «qué llevar». Ahora:
//  - «Qué incluye» = UNA sola rejilla consistente de ítems icono+texto (los 4
//    titulares con sub-línea + los extras sin ella), no boxes-luego-chips. El
//    icono es un check uniforme: honesto para una lista de «incluye» y evita
//    forzar una metáfora por ítem (el problema que la v1 evitaba con «sin
//    iconos»). «No incluido» queda como una nota clara al pie, su propia
//    categoría.
//  - «Qué llevar» sale a SU PROPIA box (pedido de Samuel), como un grid de
//    ítems, cada uno con su icono.

// Icono por ítem de «qué llevar» — por palabra clave, no por dato: la lista es
// corta y estable; si un ítem no matchea, cae en un icono genérico.
// [v3 2026-08-06] La lista «qué llevar» pasa a inglés ficha a ficha, así que
// el emparejador acepta las dos lenguas a la vez: mientras dure F3 conviven
// fichas traducidas y sin traducir, y un icono `Package` genérico en todas
// las traducidas sería una regresión visible.
function iconoLlevar(texto: string) {
  const t = texto.toLowerCase()
  if (t.includes('traje') || t.includes('baño') || t.includes('swimsuit')) return Waves
  if (t.includes('toalla') || t.includes('towel')) return Shirt
  if (t.includes('protector') || t.includes('solar') || t.includes('sunscreen')) return Sun
  if (t.includes('cámara') || t.includes('camara') || t.includes('camera')) return Camera
  if (t.includes('efectivo') || t.includes('dinero') || t.includes('saldo') || t.includes('cash')) return Banknote
  return Package
}

// [v3 2026-08-06, PowerPoint slide 72 + reunión 07-31 18:47] «Agregar botón
// con popup o similar que diga "Recomendaciones adicionales"» sobre la card
// de qué llevar. En la reunión: «un botoncito ahí o algo sutil... un texto...
// donde se recomienda llevar crema para la piel..., mejor [llevar dólares]».
//
// Va en Modal de AlignUI (no hay Popover en el copy-in del vendor, y un
// tooltip no vale: esto es texto que se lee, no una aclaración de un
// término). Modal pequeño, sin CTA — se abre, se lee y se cierra.
//
// ⚠️ Los dos consejos son [placeholder-v3]: son la transcripción de los dos
// ejemplos que dio Miguel, no una lista redactada. La definitiva está pedida
// (índice de planes, petición 2) y NO se completa a ojo con recomendaciones
// médicas o de seguridad inventadas.
function BotonRecomendaciones({ items }: { items: string[] }) {
  return (
    <Modal.Root>
      <Modal.Trigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-aqua-dark transition-colors hover:text-aqua"
        >
          <Info className="size-4" aria-hidden="true" />
          Additional recommendations
        </button>
      </Modal.Trigger>
      <Modal.Content
        overlayClassName="bg-navy/55 p-4 backdrop-blur-md"
        className="w-full max-w-md rounded-card-grande"
        aria-describedby={undefined}
      >
        <div className="p-6 pr-14">
          <Modal.Title className="font-display text-h3 font-semibold text-navy">
            Additional recommendations
          </Modal.Title>
          <ul className="mt-4 flex flex-col gap-3">
            {items.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-relaxed text-navy-sub">
                <span
                  aria-hidden="true"
                  className="mt-1.5 size-1.5 shrink-0 rounded-chip bg-aqua"
                />
                {item.replace(' [placeholder-v3]', '')}
              </li>
            ))}
          </ul>
        </div>
      </Modal.Content>
    </Modal.Root>
  )
}

export function IncluyeTour({ ficha }: { ficha: FichaTour }) {
  // Los 4 titulares (con sub-línea) + los extras (sin ella) en una sola lista
  // uniforme icono+texto.
  const incluidos = [...ficha.incluye, ...(ficha.incluyeExtra ?? []).map((t) => ({ titulo: t, texto: '' }))]

  return (
    <>
      <section id="ancla-incluye" className={`${BLOQUE_FICHA} scroll-mt-sticky-top`}>
        {/* [v3 2026-08-06, WEBSITE-TOURS pág. 9] «What´s Included» tal como lo
            escribe el cliente — con el apóstrofo tipográfico correcto, que su
            documento tiene invertido (´ en vez de ’). Es una errata evidente,
            de las que el plan 03 §7 dice que se corrigen al portar. */}
        <TituloSeccion>What’s Included</TituloSeccion>

        <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
          {incluidos.map((b) => (
            <div key={b.titulo} className="flex gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-aqua-tint text-aqua-dark">
                <Check className="size-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-navy">{b.titulo}</p>
                {b.texto ? <p className="mt-0.5 text-xs text-navy-soft">{b.texto}</p> : null}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-5 border-t border-linea pt-4 text-xs text-navy-soft">
          {/* [v3] El prefijo se recorta en las dos lenguas: `noIncluido` viaja
              con él dentro (así el dato es legible en crudo, en data y en el
              traspaso) y aquí se pinta como etiqueta aparte. Mientras dure F3
              conviven fichas en inglés y en español. */}
          <span className="font-medium text-navy-sub">Not included:</span>{' '}
          {ficha.noIncluido.replace(/^(No incluido|Not included):\s*/, '')}
        </p>
      </section>

      {/* «Qué llevar» — su propia box, grid con icono por ítem. Solo si hay
          lista (Saona no tiene datos → no se pinta). */}
      {ficha.queLlevar.length > 0 ? (
        <section className={BLOQUE_FICHA}>
          {/* [v3 2026-08-06, slide 72] El título convive con el botón de
              recomendaciones, así que la fila pasa a ser título + acción. El
              botón va a la derecha y en `ghost`: el cliente pidió «un botoncito
              ahí o algo sutil», no una segunda llamada a la acción compitiendo
              con el widget. */}
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
            <TituloSeccion>What to Bring</TituloSeccion>
            {ficha.recomendaciones?.length ? <BotonRecomendaciones items={ficha.recomendaciones} /> : null}
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {ficha.queLlevar.map((item) => {
              const Icono = iconoLlevar(item)
              return (
                <div
                  key={item}
                  className="flex flex-col items-center gap-2 rounded-card bg-papel-hueso p-3 text-center"
                >
                  <span className="grid size-10 place-items-center rounded-full bg-papel text-aqua-dark ring-1 ring-linea">
                    <Icono className="size-5" aria-hidden="true" />
                  </span>
                  <span className="text-xs font-medium text-navy-sub">{item}</span>
                </div>
              )
            })}
          </div>
        </section>
      ) : null}
    </>
  )
}
