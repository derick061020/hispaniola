import { Ship } from 'lucide-react'
import { formatoDinero } from '@/data/home'
import { aforoDe, precioDesde } from '@/lib/tarifas'
import type { SubVarianteTour } from '@/data/tours'

// Selector de sub-variantes del widget (v3 2026-07-17).
// Reutilizable para Saona (3 botes: speedboat/fishing/catamarán) y para
// Charter (5 tarifarios: Maite, GrandMa, Santa Maria y el Forever Teresa en
// sus dos duraciones).
//
// [v2 2026-07-28] DE SEGMENTED CONTROL A LISTA. Samuel: «se ve muy apretado
// por los nombres, que son largos».
//
// El diagnóstico exacto: un segmented control reparte el ancho a partes
// iguales y el widget mide 384 px. Con 5 opciones tocaban ~72 px por pestaña
// para rótulos como «Forever Teresa · 4h» — se partían en tres líneas, la
// pastilla crecía a 90 px de alto y los nombres quedaban ilegibles. Ese patrón
// sirve para 2 o 3 etiquetas cortas (Light/Premium), no para nombres propios.
//
// En lista cabe además lo que antes no cabía: la FOTO de los cinco a la vez
// (antes solo se veía la del activo, en una card de preview debajo — comparar
// exigía ir pinchando uno por uno) y el «desde US$ X» de cada uno, que es el
// dato que decide y que solo existía en la tabla de precios, a media página de
// distancia. Se DERIVA de la tabla de tramos del propio bote (`precioDesde`),
// nunca se escribe a mano. La card de preview desaparece: era el parche que
// compensaba que el selector no dijera nada.
//
// ── ALTURA: FILAS DE UNA LÍNEA, NO PLEGADO ────────────────────────────────
// La primera lista medía 324 px, un 36% del widget (912 px de contenido), y
// dejaba 101 px de scroll interno nada más entrar en un portátil de 900.
//
// El primer intento fue PLEGARLA —solo el barco elegido, con un «Ver los 5
// barcos»— y Samuel lo rechazó con razón: «hay que hacer 2 clicks para cambiar
// de barco… deben estar siempre clickeables». Elegir barco no es un detalle
// escondido de este widget, es LA decisión del charter: el precio, el aforo y
// la duración salen de ahí. Meterla detrás de un despliegue es cobrar un clic
// por la acción principal de la pantalla.
//
// La altura se recorta donde no costaba nada: cada fila pasa de DOS líneas de
// texto (nombre arriba, meta debajo) a UNA sola, con la miniatura a 32 px en
// vez de 44. La fila baja de ~60 px a 40 y la lista entera de 324 a ~216, que
// es lo que hace falta para que no haya scroll inicial. No se pierde ni una
// opción ni un dato: siguen los cinco barcos, su foto, su duración, su aforo y
// su precio — solo que en una línea en vez de dos.

export function SubVariantePicker({
  subVariantes,
  activa,
  onChange,
}: {
  subVariantes: SubVarianteTour[]
  activa: string
  onChange: (id: string) => void
}) {
  return (
    // radiogroup y no tablist: esto elige un valor de una reserva, no cambia
    // de panel. Antes era `tablist` porque parecía un toggle; en lista, la
    // semántica correcta también es la que mejor navega con teclado.
    <div role="radiogroup" aria-label="Elige tu barco" className="flex flex-col gap-1">
      {subVariantes.map((s) => {
        const activo = s.id === activa
        const desde = s.tabla.length > 0 ? precioDesde(s.tabla) : null
        // «4 horas» → «4h», que en una fila de una línea vale lo mismo y ocupa
        // un tercio. Y si el NOMBRE ya lleva la duración —los dos Forever
        // Teresa se llaman «· 3h» y «· 4h» justo para distinguirse— no se
        // repite: decirla dos veces en la misma línea era lo que empujaba la
        // meta fuera del ancho y la dejaba en un «3h…» que parecía un error.
        // [v3] Acepta las dos lenguas: las sub-variantes pasan a ingles ficha a
        // ficha y sin esto «4 hours» dejaria de abreviarse a «4h», que es lo
        // que hace que la meta quepa en la fila.
        const duracion = s.duracion?.replace(/ (horas?|hours?)/, 'h') ?? null
        // Con un nombre largo no hay ancho para las tres cosas (nombre, meta y
        // precio) en una línea de 384 px, y la meta acababa recortada en un
        // «12…» que parece un fallo. Cuando pasa, se retira ENTERA: el aforo
        // sigue publicado en la tabla de precios, y los nombres largos de esta
        // lista son justo los que ya se explican solos («Forever Teresa · 3h»
        // lleva su duración dentro). Umbral por longitud y no por medición en
        // vivo: es un ancho fijo y conocido, no hace falta un ResizeObserver
        // para saber que 19 caracteres no caben.
        const meta = [
          duracion && !s.nombre.includes(duracion) ? duracion : null,
          `${aforoDe(s.tabla)} pax`,
        ]
          .filter(Boolean)
          .join(' · ')
        const cabeMeta = s.nombre.length <= 14
        return (
          <button
            key={s.id}
            type="button"
            role="radio"
            aria-checked={activo}
            onClick={() => onChange(s.id)}
            // [2026-07-28, 3ª vuelta] PADDING PAREJO Y RADIOS CONCÉNTRICOS.
            // Samuel: «ajusta el padding izquierdo y el border radius de la
            // imagen, está disparejo». Las dos cosas eran ciertas:
            //  · `px-2 py-1` daba 8 px a los lados y 4 arriba y abajo, así que
            //    la miniatura tenía el doble de aire a la izquierda que por
            //    encima. Ahora es `p-1.5`: 6 px por los cuatro costados.
            //  · El radio interior no seguía al exterior. La regla de los
            //    radios concéntricos dice interior = exterior − padding: con
            //    `rounded-btn` (10 px) y 6 px de padding, la foto pide 4 px
            //    (`rounded`). Antes eran 4 px con 8 de padding, y por eso la
            //    curva de la foto y la de la card no acompañaban.
            // La miniatura baja de 32 a 28 px para que la fila siga midiendo
            // 40 px: sin eso, los 2 px de padding extra por lado devolvían el
            // scroll inicial al widget que acabamos de quitar.
            className={`flex items-center gap-2.5 rounded-btn p-1.5 text-left transition-colors ${
              activo
                ? 'bg-aqua-tint ring-2 ring-aqua-dark'
                : 'bg-papel-hueso ring-1 ring-linea hover:bg-aqua-tint/50'
            }`}
          >
            {/* Saona no trae `foto` en sus sub-variantes (se diferencian por
                nombre y capacidad): en su lugar va el icono, para que las
                filas rimen igual y no se descuadre la lista. */}
            {s.foto ? (
              <img
                src={`/fotos/${s.foto}.webp`}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="size-7 shrink-0 rounded object-cover"
              />
            ) : (
              <span
                aria-hidden="true"
                className="grid size-7 shrink-0 place-items-center rounded bg-aqua-tint text-aqua-dark"
              >
                <Ship className="size-4" />
              </span>
            )}

            {/* Nombre y meta EN LA MISMA LÍNEA. `truncate` sobre el contenedor
                y no sobre cada trozo: así, cuando falta ancho, lo que se
                recorta es la cola de la meta (el dato menos decisivo) y nunca
                el nombre del barco. */}
            <span className="min-w-0 flex-1 truncate">
              <span
                className={`font-display text-sm font-semibold ${
                  activo ? 'text-navy' : 'text-navy-sub'
                }`}
              >
                {s.nombre}
              </span>
              {/* El aforo se DERIVA de la tabla de tramos en vez de usar
                  `capacidad`: ese campo lleva paréntesis largos («Hasta 45
                  personas (plated hasta 20, skewers desde 21)») que en 384 px
                  se cortaban a mitad de frase y no decían nada. El matiz sigue
                  publicado donde hay sitio para leerlo — la tabla de precios. */}
              {cabeMeta ? <span className="ml-1.5 text-xs text-navy-soft">{meta}</span> : null}
            </span>

            {desde !== null ? (
              <span
                className={`shrink-0 font-display text-sm font-semibold ${
                  activo ? 'text-aqua-dark' : 'text-navy-sub'
                }`}
              >
                <span className="mr-1 font-sans text-xs font-normal text-navy-soft">desde</span>
                {formatoDinero(desde)}
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
