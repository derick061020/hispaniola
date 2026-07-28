import { useState } from 'react'
import { useFilaArrastrable } from '@/components/home/use-fila-arrastrable'
import { Etiqueta } from '@/components/ui/etiqueta'
import { useDevFlag } from '@/dev/use-dev-flag'
import { EQUIPO_COMPLETO, EQUIPO_PAGINA, TOTAL_EQUIPO, type MiembroEquipoV2 } from '@/data/equipo'

// «Somos 70» — el muro de tripulación ([v2 2026-07-28, pedido de Samuel:
// «entiendo que es una sección monótona, y eso está bien, pero me gustaría
// darle algo chulo»).
//
// QUÉ ES: las ~70 personas pasando en dos filas cruzadas, a sangre, entre la
// franja de datos y la rejilla por departamento. Es la foto de familia — el
// «≈ 70» de la franja deja de ser un número y se ve.
//
// POR QUÉ VA ANTES Y NO EN LUGAR DE LA REJILLA: la rejilla es la parte ÚTIL
// (buscar a alguien, filtrar por departamento) y este muro está diseñado para
// NO poder usarse — desfila solo, no se puede pinchar, no lleva nombres. Son
// dos trabajos distintos y por eso son dos bloques, no uno.
//
// SIN NOMBRES NI CARGOS a propósito, y no por ahorrar: a esta escala la cara
// mide 136px y cualquier rótulo sería ilegible; además, el mensaje del bloque
// es la CANTIDAD, no quién es cada uno — eso lo cuenta la rejilla de abajo con
// sitio para hacerlo bien. Un rótulo aquí competiría con el titular y no se
// leería en ninguno de los dos sitios.
//
// La mecánica (dos capas, marquee CSS + arrastre JS, 3 copias, fundido
// lateral, pausa al hover, una sola copia con reduced-motion) es la del muro
// de reseñas de la home, heredada tal cual: mismo hook y mismo patrón de CSS.
// Ver el bloque .muro-equipo-* de componentes.css.
//
// ⚠️ Mientras la plantilla sea de molde, los retratos son 5 fotos rotando: el
// muro enseña la MISMA cara cada pocas posiciones. Es intencional (ver la
// cabecera de data/equipo.ts) pero aquí se nota más que en la rejilla, porque
// pasan muchas seguidas. Con los 70 retratos reales desaparece solo.

/** Copias del grupo dentro de cada pista. 3 y no 2: el marquee recorre 1
 *  copia y el arrastre puede llevarse otra — con 2 se vería el hueco. El
 *  porqué largo está en componentes.css (muro de reseñas). */
const COPIAS_EN_PISTA = 3
const FILAS = 2

function CaraMuro({ miembro, oculto }: { miembro: MiembroEquipoV2; oculto: boolean }) {
  return (
    <div className="muro-equipo-card" aria-hidden={oculto || undefined}>
      <div className="relative aspect-[3/4] overflow-hidden rounded-card bg-papel-hueso">
        {miembro.foto ? (
          <img
            src={`/fotos/${miembro.foto}.webp`}
            alt=""
            loading="lazy"
            // draggable={false}: sin esto, el navegador se queda el gesto para
            // arrastrar la IMAGEN y la fila no se mueve.
            draggable={false}
            className="absolute inset-0 size-full object-cover object-top"
          />
        ) : (
          // El hueco es un bloque de marca, no una card vacía: en un muro que
          // se lee de un vistazo, un rectángulo claro se leería como una foto
          // que no cargó.
          <div className="absolute inset-0 bg-linear-to-br from-navy to-aqua-dark" />
        )}
      </div>
    </div>
  )
}

function FilaMuro({
  gente,
  indice,
  pausado,
  reducirMovimiento,
}: {
  gente: MiembroEquipoV2[]
  indice: number
  pausado: boolean
  reducirMovimiento: boolean
}) {
  const copias = reducirMovimiento ? 1 : COPIAS_EN_PISTA
  const { arrastreRef, arrastrando, manejadores } = useFilaArrastrable({
    copias,
    activo: !reducirMovimiento,
    variable: '--muro-equipo-arrastre',
  })

  return (
    <div
      className="muro-equipo-fila"
      style={{
        // pan-y: el gesto vertical sigue siendo scroll de la página. Sin esto
        // el navegador se queda el arrastre horizontal en móvil.
        touchAction: 'pan-y',
        cursor: reducirMovimiento ? undefined : arrastrando ? 'grabbing' : 'grab',
        userSelect: arrastrando ? 'none' : undefined,
      }}
      {...manejadores}
      role="group"
      aria-label={`Retratos del equipo, fila ${indice + 1}`}
    >
      <div ref={arrastreRef} className="muro-equipo-arrastre">
        <div
          className={[
            'muro-equipo-pista',
            `muro-equipo-pista--fila-${indice + 1}`,
            indice === 1 ? 'muro-equipo-pista--derecha' : '',
            pausado || arrastrando ? 'muro-equipo-pista--pausada' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {Array.from({ length: copias }).flatMap((_, copia) =>
            gente.map((m) => <CaraMuro key={`${copia}-${m.id}`} miembro={m} oculto={copia > 0} />),
          )}
        </div>
      </div>
    </div>
  )
}

export function MuroTripulacion() {
  const [pausado, setPausado] = useState(false)

  // [dev-mode] ?dev-muro-equipo=pausado congela las dos filas → frame limpio
  // para Figma. Misma mecánica que ?dev-reviews=pausado.
  useDevFlag('dev-muro-equipo', (v) => setPausado(v === 'pausado')) // [dev-mode]

  const reducirMovimiento =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Reparto alternando (par arriba, impar abajo) y no en dos mitades: los
  // departamentos vienen agrupados en el array, así que partirlo por la mitad
  // dejaría la fila de arriba con oficina y playa y la de abajo con cocina y
  // fundación. Alternando, cada fila mezcla toda la empresa, que es lo que el
  // bloque quiere decir.
  const filas = Array.from({ length: FILAS }, (_, i) =>
    EQUIPO_COMPLETO.filter((_, n) => n % FILAS === i),
  )

  return (
    <section className="py-seccion-sm sm:py-seccion">
      <div className="mx-auto max-w-contenido px-5 text-center sm:px-10">
        <Etiqueta>{EQUIPO_PAGINA.muroEyebrow}</Etiqueta>
        <h2 className="mt-3 font-display text-h2 font-semibold text-navy">
          Somos {TOTAL_EQUIPO}
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-lead text-navy-sub">
          {EQUIPO_PAGINA.muroLead}
        </p>
      </div>

      {/* Las filas van A SANGRE, fuera del max-w-contenido: el muro tiene que
          entrar y salir de campo por el canto de la ventana. Dentro del
          contenedor se leería como un carrusel dentro de una caja, que es
          justo lo contrario de lo que hace este bloque. */}
      <div className="mt-8 flex flex-col gap-muro-equipo-fila">
        {filas.map((gente, i) => (
          <FilaMuro
            key={i}
            gente={gente}
            indice={i}
            pausado={pausado}
            reducirMovimiento={reducirMovimiento}
          />
        ))}
      </div>
    </section>
  )
}
