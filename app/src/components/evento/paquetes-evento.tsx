import { Check } from 'lucide-react'
import { TituloSeccion } from '@/components/tour/titulo-seccion'
import { BLOQUE_FICHA } from '@/components/tour/bloque-ficha'
import { TarjetasPaquetesComida } from '@/components/comida-y-bar-v3/paquetes-comida-v3'
import { CartaCanapesV3 } from '@/components/comida-y-bar-v3/carta-canapes-v3'
import { CANAPES_TEXTOS, type FichaEvento } from '@/data/eventos'
import { formatoDinero } from '@/data/home'
import { t } from '@/lib/i18n'

// "Paquetes" de las landings de evento (PLAN-EVENTOS.md §3) — presente en
// party-boat y en bodas, que comparten el MISMO array de 4 paquetes
// (`PAQUETES_COMIDA` en data/eventos.ts: la web del cliente publica el
// tarifario idéntico en las dos). MICE no los tiene: se cotiza a medida.
// Cada paquete es INDEPENDIENTE, no un upgrade de otro.
//
// ── QUÉ CONFUNDÍA Y CÓMO SE ARREGLA (2026-07-28, 2ª vuelta) ───────────────
// Samuel: «está bastante mejor, pero aún parece que confunde un poco; debe
// ser lo más sencillo de entender». Diagnóstico de las tres cosas que
// confundían, porque el layout ya estaba bien y el problema era otro:
//
//  1) CADA CARD LISTABA COSAS DISTINTAS. #I tenía 1 línea y el Premium 7, así
//     que comparar obligaba a leer 4 listas y recordarlas. Y no hay escalera
//     que valga: #III NO es «#II y algo más» —pierde el hot dog—, así que
//     tampoco se podía resumir con un «todo lo anterior +…» sin mentir.
//     → Ahora los 4 paquetes enseñan LOS MISMOS 8 platos EN EL MISMO ORDEN,
//       con ✓ lo que entra y — lo que no. Es una tabla comparativa, pero
//       dibujada dentro de las cards: se compara moviendo el ojo en
//       horizontal, sin tabla que en móvil haya que scrollear de lado. De
//       paso desaparece el hueco raro de #I: el vacío pasa a ser información.
//       El orden de los platos NO es el del dato: es el de aparición ordenando
//       los paquetes de más barato a más caro, así que la lista se lee como
//       lo que suma cada escalón.
//  2) EL PRECIO ESTABA A MEDIAS. Se leía «US$ 660.00» grande y el «+US$ 55
//     por persona extra» abajo del todo, en gris, separado por toda la card.
//     Con grupos de 20-40 personas (el caso típico) el precio de verdad es
//     otro, así que el número grande se leía como el total.
//     → El precio ahora va con su condición pegada: «hasta 12 personas ·
//       +US$ 55 por persona extra», debajo mismo. Y el TOTAL real sigue
//       calculándose en el widget, que es donde se pone el nº de invitados.
//  3) LAS CARDS NO HACÍAN NADA. Se leían 4 paquetes y la acción estaba en
//     otro sitio (el widget), sin relación visible entre lo que se lee y lo
//     que se reserva.
//     → Cada card tiene su botón «Elegir» y queda MARCADA cuando es la
//       elegida, en sincronía con el selector del widget: se elige aquí y el
//       widget cambia (y su Total con él), o se elige allí y aquí se marca.
//       El estado vive en pages/evento.tsx, igual que `variante` en la ficha
//       de tour gobierna a la vez el widget y la tabla de precios del charter
//       — mismo patrón, misma razón: dos piezas que hablan del mismo dato no
//       pueden tener cada una el suyo.
//
// [2026-11-03, Gerencia (Blanka), con captura: «por favor quitar lo que no
// está incluido»] Se quitan las rayas: cada card enseña SOLO lo que entra,
// en el mismo orden común de siempre (el de `platos`), así que la comparación
// sigue leyéndose escalón a escalón. Lo de «— lo que no» del punto 1 queda
// derogado; para volver, el filtro está en `incluidos` de la card.
//
// ⚠️ VOLVER ATRÁS: la versión anterior (mismo layout, pero cada card con solo
// sus propios items, el extra de precio al pie y sin selección) está en el
// commit 78e9a67 — `git checkout 78e9a67 -- app/src/components/evento/paquetes-evento.tsx`.
// Lo que NO cambia en esta vuelta es el layout que Samuel aprobó: el
// destacado a fila completa en horizontal y los otros 3 al lado.
//
// Layout (2026-07-28, pedido de Samuel: «el Hispaniola Premium Package debe
// abarcar el ancho completo posible, y las otras 3 una al lado de la otra»):
//  - El paquete DESTACADO ocupa una fila entera para él, en formato
//    horizontal (foto a la izquierda, contenido a la derecha), y los
//    demás van debajo en una fila de 3.
//  - Es jerarquía, no capricho de rejilla: el 2×2 anterior daba a los 4
//    paquetes exactamente el mismo peso, y el Premium es el que la casa
//    quiere vender (y el único que el badge llama «el más completo»).
//  - Historial: 4 columnas con fotos diminutas → 2×2 desde lg (Samuel
//    2026-07-17, «estan muy apretados») → esto.
//  - En móvil, todo apilado a 1 columna (incluido el destacado, que pierde
//    el formato horizontal): a 390px una foto lateral dejaría el texto en
//    un canal de 160px.
//  - El acento aqua (ring-2) ya NO significa «premium» sino «elegido» — el
//    mismo idioma que el selector del widget. El Premium se distingue por su
//    badge y su fondo `bg-aqua-tint/40`, que no se pisan con la selección.


// ── [2026-11-13] LA SECCIÓN APROBADA DE /food-and-bar, AQUÍ ────────────────
// Fernando aprobó en /food-and-bar los paquetes con su «Or bites» y la carta
// de los 28 canapés, y pidió llevarlos a las 3 páginas de evento (party boat,
// bodas y corporativo) en lugar de este bloque. Se pinta EL MISMO componente
// (comida-y-bar-v3/paquetes-comida-v3.tsx y carta-canapes-v3.tsx) con LOS
// MISMOS datos (PAQUETES_COMIDA): ni código ni precios duplicados.
// Lo que se conserva de lo de arriba:
//   · El punto 3: cada tarjeta tiene su «Choose this package», marcado cuando
//     es el elegido y en sincronía con el formulario de la derecha (el estado
//     sigue en pages/evento.tsx).
//   · El punto 2: el precio sale de `precioBase` con `formatoDinero` (sigue al
//     selector de moneda) y el extra por invitado va pegado.
//   · Título e intro de cada evento (copy aprobado, literal) + una frase común
//     sobre los canapés (CANAPES_TEXTOS.evento).
// Lo que cambia: la comparación «mismos platos en el mismo orden» del punto 1
// la hacen ahora las tarjetas de /food-and-bar (mismas zonas alineadas) y su
// caja «Or bites». Con el formulario a la derecha la columna mide ~760 px: las
// tarjetas van en 2×2 y las dos cajas de canapés, apiladas (`columna`).
// ⚠️ VOLVER ATRÁS: la versión anterior de este archivo está en el commit
// 8dd86e9 — `git checkout 8dd86e9 -- app/src/components/evento/paquetes-evento.tsx`.

export function PaquetesEvento({
  evento,
  elegido,
  onElegir,
}: {
  evento: FichaEvento
  /** id del paquete activo en el widget de reserva (pages/evento.tsx) */
  elegido: string | null
  onElegir: (id: string) => void
}) {
  const paquetes = evento.paquetes
  if (!paquetes || paquetes.items.length === 0) return null

  return (
    <section id="ancla-paquetes" className={`${BLOQUE_FICHA} scroll-mt-sticky-top`}>
      <TituloSeccion>{paquetes.titulo}</TituloSeccion>
      <p className="mt-2 text-sm text-navy-sub">{paquetes.intro}</p>
      <p className="mt-2 text-sm font-medium text-navy">{t(CANAPES_TEXTOS.evento.intro)}</p>

      <div className="mt-8">
        <TarjetasPaquetesComida
          etiqueta={paquetes.titulo}
          columna
          precio={(p) => (p.precioBase != null ? formatoDinero(p.precioBase) : p.precio)}
          extra={(p) =>
            p.porPersonaExtra ? <>+{formatoDinero(p.porPersonaExtra)} {t('per extra guest')}</> : t(p.extraPrecio ?? '')
          }
          acciones={(p, premium) => {
            const activo = p.id === elegido
            // LA CARD HACE ALGO (punto 3 de arriba): elige el paquete en el
            // formulario; si ya es el elegido, lo dice y deja de ser pulsable.
            // `aria-pressed` para que el estado no sea solo color.
            return (
              <button
                type="button"
                onClick={() => onElegir(p.id)}
                aria-pressed={activo}
                className={`mt-4 inline-flex min-h-12 w-full items-center justify-center gap-1.5 rounded-chip px-4 text-sm font-semibold transition ${
                  activo
                    ? 'cursor-default bg-aqua-tint text-aqua-dark'
                    : premium
                      ? 'text-premium-oro ring-1 ring-premium-oro hover:bg-premium-oro-suave'
                      : 'bg-papel text-navy ring-1 ring-linea-fuerte hover:bg-papel-hueso'
                }`}
              >
                {activo ? (
                  <>
                    <Check className="size-4" aria-hidden="true" />
                    {t('Selected')}
                  </>
                ) : (
                  t('Choose this package')
                )}
              </button>
            )
          }}
        />
      </div>

      {paquetes.nota ? <p className="mt-6 text-xs leading-relaxed text-navy-soft">{t(paquetes.nota)}</p> : null}

      <CartaCanapesV3 columna />
    </section>
  )
}
