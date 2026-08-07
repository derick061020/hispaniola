import { useState } from 'react'
import { Anchor, Calculator, ChefHat, Headset, Megaphone, Waves } from 'lucide-react'
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
  oficina: Headset,
  playa: Anchor,
  marketing: Megaphone,
  administracion: Calculator,
  cocina: ChefHat,
  fundacion: Waves,
}

function Retrato({ miembro, Icono }: { miembro: MiembroEquipoV2; Icono: typeof Anchor }) {
  if (miembro.foto) {
    return (
      <img
        src={`/fotos/${miembro.foto}.webp`}
        alt=""
        loading="lazy"
        // object-top: los retratos vienen recortados a distintas alturas y
        // anclando arriba ninguna cara queda cortada por la barbilla.
        className="absolute inset-0 size-full object-cover object-top transition-transform duration-500 motion-safe:group-hover:scale-105"
      />
    )
  }
  // Sin foto: el ICONO DEL DEPARTAMENTO sobre un degradado de marca. Dos
  // decisiones, las dos por lo mismo:
  //  - Oscuro y no el aqua-tint claro de antes: la card lleva ahora el nombre
  //    en blanco montado sobre el degradado navy, y sobre un fondo casi blanco
  //    ese texto desaparecía. El hueco tiene que ser oscuro para que la card
  //    sin retrato se lea igual que las demás.
  //  - Icono y no iniciales: mientras la plantilla sea de molde TODOS se
  //    llaman «Nombre Apellido NN», así que las iniciales daban 23 tarjetas
  //    con el mismo «NA» y eso se leía como un error, no como un hueco. El
  //    icono además dice algo cierto (de qué departamento es) sin inventar
  //    nada de la persona.
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 grid place-items-center bg-linear-to-br from-navy to-aqua-dark"
    >
      <Icono className="size-10 text-white/25" strokeWidth={1.5} />
    </div>
  )
}

function CardMiembro({ miembro, Icono }: { miembro: MiembroEquipoV2; Icono: typeof Anchor }) {
  return (
    <article className="group relative aspect-[4/5] overflow-hidden rounded-card-grande bg-papel-hueso">
      <Retrato miembro={miembro} Icono={Icono} />

      {/* Degradado propio de la card: denso abajo (donde va el texto) y
          transparente arriba, para no apagar la cara.
          Las paradas están AJUSTADAS AL MÓVIL (2026-07-28): con la curva por
          defecto, a 175px de ancho el rol ocupa dos líneas y su primera línea
          caía en la zona del 25% de navy — sobre un retrato de fondo claro,
          ilegible. Ahora el 55% llega hasta el 40% de la altura, que es donde
          empieza el bloque de texto en el caso más largo, y a partir de ahí se
          desvanece hasta desaparecer en el 80%. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-t from-navy/95 via-navy/55 via-40% to-transparent to-80%"
      />

      {miembro.responsable ? (
        <span className="absolute left-3 top-3 rounded-chip bg-coral px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
          Team lead
        </span>
      ) : null}

      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
        <p className="text-[0.625rem] font-semibold uppercase leading-tight tracking-[0.12em] text-aqua-claro sm:text-eyebrow">
          {miembro.rol}
        </p>
        <p className="mt-1 font-display text-base font-semibold leading-tight text-white sm:text-lg">
          {miembro.nombre}
        </p>
        {/* Antigüedad: SOLO EN DESKTOP, revelada al pasar el ratón — mismo
            mecanismo que la frase y el CTA de las cards de equipo de la home.
            En móvil no se pinta: a dos columnas, el rol ya ocupa dos líneas y
            el nombre otras dos, y añadir esta tercera frase empujaba el bloque
            de texto hasta la cara del retrato. El cargo y el nombre son lo que
            hay que leer de un vistazo; la antigüedad es dato de apoyo. */}
        <p className="hidden overflow-hidden text-xs text-white/70 transition-all duration-300 sm:block sm:max-h-0 sm:opacity-0 sm:group-hover:mt-1 sm:group-hover:max-h-8 sm:group-hover:opacity-100">
          {miembro.experiencia} years of experience · since {miembro.desde}
        </p>
      </div>
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
            <span className="rounded-chip bg-aqua-tint px-2.5 py-0.5 text-xs font-semibold text-aqua-dark">
              {gente.length} people
            </span>
          </div>
          {/* Este copy SÍ es real: lo escribió el cliente en su PowerPoint. */}
          <p className="mt-1 max-w-2xl text-navy-sub">{departamento.descripcion}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {gente.map((m) => (
          <CardMiembro key={m.id} miembro={m} Icono={Icono} />
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
