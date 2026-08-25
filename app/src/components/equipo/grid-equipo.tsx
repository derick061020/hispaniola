import { useState } from 'react'
import { Anchor, ChefHat, Compass, Headset, Ship, Waves } from 'lucide-react'
import {
  DEPARTAMENTOS,
  EQUIPO_COMPLETO,
  TOTAL_EQUIPO,
  type Departamento,
  type DepartamentoId,
  type MiembroEquipoV2,
} from '@/data/equipo'

// Grid del equipo con filtros por departamento (correcciones v2, plan 05).
//
// Los filtros reutilizan el lenguaje visual que el proyecto ya fijó en
// `components/faq/categorias-faq.tsx` (chips con contador, «Todos» primero) —
// no se inventa otro. Los CONTADORES SE DERIVAN del array, nunca se escriben a
// mano: el cliente aún no ha confirmado si son 37 o 70 empleados, así que el
// número tiene que seguir al dato y no al revés.
//
// [v2 2026-07-28, 2ª vuelta, pedido de Samuel: «hazla sentir más trabajada,
// las cards me parecen muy simples»] Tres cambios:
//
//  1. FUERA EL AVISO de «Contenido de ejemplo» que se pintaba encima de los
//     chips. Samuel: «se ve cutre, se sobreentiende». Es el MISMO criterio que
//     ya se aplicó a /instalaciones el 28: la maqueta enseña la página, no sus
//     andamios, y el estado real de los datos se comunica por fuera (el plan,
//     el Dev Mode y las cabeceras de data/equipo.ts, que siguen intactas).
//     ⚠️ Esto NO relaja el motivo por el que los datos son de molde: los
//     nombres siguen siendo genéricos y las frases lorem ipsum a propósito.
//  2. EL EQUIPO SE AGRUPA POR DEPARTAMENTO, con su cabecera (icono, nombre,
//     contador y la descripción real del cliente) delante de cada rejilla. Es
//     lo que hacen las slides 37-42, una por departamento, y de paso arregla
//     el problema real de la versión anterior: en «Todos» eran 70 retratos
//     seguidos sin una sola parada, imposibles de leer como una organización.
//     La descripción del departamento deja de estar suelta bajo los chips
//     (donde solo se veía al filtrar) y pasa a la cabecera, donde se ve
//     siempre.
//  3. LA CARD ES EDITORIAL, no una foto con tres líneas debajo: retrato a
//     sangre, degradado navy y el nombre montado encima — el mismo anatómico
//     que las cards de equipo de la home (home/equipo-teaser.tsx), que ya es
//     el idioma de la casa para «persona». La antigüedad se revela al hover en
//     desktop y va siempre visible en móvil, igual que allí.
//
// ⚠️ Todo el contenido de personas es PLACEHOLDER — ver la cabecera larga de
// data/equipo.ts para por qué los nombres son genéricos y las frases lorem
// ipsum en vez de los nombres de la maqueta del cliente.

export const TODOS = 'todos' as const
export type Filtro = DepartamentoId | typeof TODOS

/** Icono de cada departamento. Se exporta porque el plano del barco
 *  (equipo/plano-barco.tsx) tiene que pintar EXACTAMENTE los mismos: si un
 *  departamento se dibuja con un ancla en el plano y con otra cosa en su
 *  cabecera, deja de leerse como el mismo sitio. */
export function iconoDepartamento(id: DepartamentoId) {
  return ICONOS[id]
}

// Un icono por departamento. Viven aquí y no en data/equipo.ts porque son
// presentación: el dato es el departamento, no su dibujo.
const ICONOS: Record<DepartamentoId, typeof Anchor> = {
  capitanes: Ship,
  guias: Compass,
  marinos: Anchor,
  cocina: ChefHat,
  oficina: Headset,
  fundacion: Waves,
}

// [2026-08-21] LA CARD ES EL RETRATO Y NADA MÁS.
//
// Antes llevaba degradado navy, cargo en aqua, nombre grande y la antigüedad
// al hover. Todo eso describía a una persona que no existía («Name Surname
// 07»). Ahora las caras son REALES y el cliente no ha mandado la plantilla con
// nombres, así que no hay nada cierto que escribir encima: se retiran el
// degradado (estaba solo para que ese texto leyera) y el bloque de texto
// entero. Cuando lleguen los nombres, `nombre` y `rol` ya existen en el tipo y
// vuelve el degradado con ellos.
//
// `alt=""` a propósito: sin nombre, 28 alt distintos serían 28 veces la misma
// frase genérica. Quien lleva la información es el encabezado del
// departamento, que sí dice qué se está viendo.
function CardMiembro({ miembro }: { miembro: MiembroEquipoV2 }) {
  return (
    <article className="group relative aspect-[4/5] overflow-hidden rounded-card-grande bg-papel-hueso">
      <img
        src={`/fotos/${miembro.foto}.webp`}
        alt=""
        loading="lazy"
        // object-top: los retratos vienen recortados a distintas alturas y
        // anclando arriba ninguna cara queda cortada por la barbilla.
        className="absolute inset-0 size-full object-cover object-top transition-transform duration-500 motion-safe:group-hover:scale-105"
      />
    </article>
  )
}

function SeccionDepartamento({ departamento }: { departamento: Departamento }) {
  const gente = EQUIPO_COMPLETO.filter((m) => m.departamento === departamento.id)
  const Icono = ICONOS[departamento.id]

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-start gap-4">
        <span
          aria-hidden="true"
          className="grid size-11 shrink-0 place-items-center rounded-card bg-aqua-tint text-aqua-dark"
        >
          <Icono className="size-5" />
        </span>
        <div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h2 className="font-display text-h3 font-semibold text-navy">{departamento.nombre}</h2>
            {/* Singular de verdad: marinos es 1 sola persona y «1 people» se
                lee como un bug. */}
            <span className="rounded-chip bg-aqua-tint px-2.5 py-0.5 text-xs font-semibold text-aqua-dark">
              {gente.length} {gente.length === 1 ? 'person' : 'people'}
            </span>
          </div>
          {/* Este copy SÍ es real: lo escribió el cliente en su PowerPoint.
              Tres departamentos no tienen ninguno (capitanes, guías y marinos:
              el cliente los describió juntos, como «Marine Operations», y al
              separarlos en tres se quedaron sin párrafo). Ahí no se pinta nada
              en vez de inventarlo — ver la cabecera de data/equipo.ts. */}
          {departamento.descripcion ? (
            <p className="mt-1 max-w-2xl text-navy-sub">{departamento.descripcion}</p>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {gente.map((m) => (
          <CardMiembro key={m.id} miembro={m} />
        ))}
      </div>
    </section>
  )
}

/** Los chips y el filtro son OPCIONALMENTE CONTROLADOS. Sin props, la rejilla
 *  se gobierna sola con sus chips, que es como funciona /tripulacion. La
 *  variante del plano del barco (/tripulacion-barco) le pasa el filtro desde
 *  fuera y apaga los chips, porque allí quien filtra es el plano. Es la misma
 *  rejilla en los dos sitios — no una copia. */
export function GridEquipo({
  filtro: filtroExterno,
  onFiltro,
  conChips = true,
}: {
  filtro?: Filtro
  onFiltro?: (f: Filtro) => void
  conChips?: boolean
} = {}) {
  const [filtroInterno, setFiltroInterno] = useState<Filtro>(TODOS)
  const filtro = filtroExterno ?? filtroInterno
  const setFiltro = onFiltro ?? setFiltroInterno

  const visibles = filtro === TODOS ? DEPARTAMENTOS : DEPARTAMENTOS.filter((d) => d.id === filtro)

  return (
    <div className="flex flex-col gap-10">
      {conChips ? (
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFiltro(TODOS)}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
            filtro === TODOS
              ? 'border-navy bg-navy text-white'
              : 'border-linea text-navy hover:bg-papel-hueso'
          }`}
        >
          All <span className="opacity-60">{TOTAL_EQUIPO}</span>
        </button>
        {DEPARTAMENTOS.map((d) => {
          const n = EQUIPO_COMPLETO.filter((m) => m.departamento === d.id).length
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => setFiltro(d.id)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                filtro === d.id
                  ? 'border-navy bg-navy text-white'
                  : 'border-linea text-navy hover:bg-papel-hueso'
              }`}
            >
              {d.nombre} <span className="opacity-60">{n}</span>
            </button>
          )
        })}
      </div>
      ) : null}

      {/* gap-16 entre departamentos: con menos, las cabeceras se leían como
          parte de la rejilla de arriba en vez de abrir la de abajo. */}
      <div className="flex flex-col gap-16">
        {visibles.map((d) => (
          <SeccionDepartamento key={d.id} departamento={d} />
        ))}
      </div>
    </div>
  )
}
