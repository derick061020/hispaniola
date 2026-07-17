import { Check, Camera, Sun, Waves, Shirt, Banknote, Package } from 'lucide-react'
import { TituloSeccion } from '@/components/tour/titulo-seccion'
import { BLOQUE_FICHA } from '@/components/tour/bloque-ficha'
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
function iconoLlevar(texto: string) {
  const t = texto.toLowerCase()
  if (t.includes('traje') || t.includes('baño')) return Waves
  if (t.includes('toalla')) return Shirt
  if (t.includes('protector') || t.includes('solar')) return Sun
  if (t.includes('cámara') || t.includes('camara')) return Camera
  if (t.includes('efectivo') || t.includes('dinero') || t.includes('saldo')) return Banknote
  return Package
}

export function IncluyeTour({ ficha }: { ficha: FichaTour }) {
  // Los 4 titulares (con sub-línea) + los extras (sin ella) en una sola lista
  // uniforme icono+texto.
  const incluidos = [...ficha.incluye, ...(ficha.incluyeExtra ?? []).map((t) => ({ titulo: t, texto: '' }))]

  return (
    <>
      <section id="ancla-incluye" className={`${BLOQUE_FICHA} scroll-mt-sticky-top`}>
        <TituloSeccion>Qué incluye</TituloSeccion>

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
          <span className="font-medium text-navy-sub">No incluido:</span>{' '}
          {ficha.noIncluido.replace(/^No incluido:\s*/, '')}
        </p>
      </section>

      {/* «Qué llevar» — su propia box, grid con icono por ítem. Solo si hay
          lista (Saona no tiene datos → no se pinta). */}
      {ficha.queLlevar.length > 0 ? (
        <section className={BLOQUE_FICHA}>
          <TituloSeccion>Qué llevar</TituloSeccion>
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
