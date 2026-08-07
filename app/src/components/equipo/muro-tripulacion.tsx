import { useState } from 'react'
import { useFilaArrastrable } from '@/components/home/use-fila-arrastrable'
import { useDevFlag } from '@/dev/use-dev-flag'
import { EQUIPO_COMPLETO, type MiembroEquipoV2 } from '@/data/equipo'

// El muro de tripulación ([v2 2026-07-28, pedido de Samuel: «entiendo que es
// una sección monótona, y eso está bien, pero me gustaría darle algo chulo»).
//
// QUÉ ES: las caras del equipo pasando en dos filas cruzadas, a sangre. Nada
// más — ni eyebrow, ni titular, ni descripción, ni un solo nombre.
//
// 2ª VUELTA (mismo día, Samuel): la 1ª versión llevaba cabecera («LA FOTO DE
// FAMILIA / Somos 70 / …») y vivía ENTRE la franja de datos y la rejilla.
// Ahora es SOLO LOS DOS TICKERS y va AL FINAL, después del banner de CTA. Los
// dos cambios van juntos y se explican igual: con cabecera, esto era una
// sección más que había que leer, y colocada en medio partía en dos el
// recorrido útil de la página (datos → filtros → gente). Al final y mudo, es
// un remate: la página termina de contar lo suyo, cierra con el CTA, y lo
// último que ves antes del footer son las caras pasando. No pide nada.
//
// POR QUÉ NO SUSTITUYE A LA REJILLA: la rejilla es la parte ÚTIL (buscar a
// alguien, filtrar por departamento) y este muro está diseñado para NO poder
// usarse — desfila solo, no se puede pinchar, no lleva nombres. Son dos
// trabajos distintos y por eso son dos bloques.
//
// SIN NOMBRES NI CARGOS a propósito, y no por ahorrar: a esta escala la cara
// mide 136px (96px en móvil) y cualquier rótulo sería ilegible. El mensaje del
// bloque es la CANTIDAD, no quién es cada uno — eso lo cuenta la rejilla, que
// tiene sitio para hacerlo bien.
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
      aria-label={`Team portraits, row ${indice + 1}`}
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

  // SOLO QUIEN TIENE RETRATO. Este bloque es un muro de CARAS: un hueco de
  // marca cada tres posiciones —que en la rejilla es correcto, porque allí la
  // card lleva nombre y cargo aunque no haya foto— aquí sería una baldosa
  // oscura sin ninguna información, y salen tantas que el muro se lee a
  // cuadros. La rejilla de abajo sigue enseñando a todo el mundo, así que
  // nadie desaparece de la página: lo que se filtra es el escaparate, no el
  // censo. Por eso tampoco se toca el «Somos {TOTAL_EQUIPO}» del titular, que
  // sigue contando a la plantilla entera.
  const conRetrato = EQUIPO_COMPLETO.filter((m) => m.foto)

  // Reparto alternando (par arriba, impar abajo) y no en dos mitades: los
  // departamentos vienen agrupados en el array, así que partirlo por la mitad
  // dejaría la fila de arriba con oficina y playa y la de abajo con cocina y
  // fundación. Alternando, cada fila mezcla toda la empresa, que es lo que el
  // bloque quiere decir.
  const filas = Array.from({ length: FILAS }, (_, i) =>
    conRetrato.filter((_, n) => n % FILAS === i),
  )

  return (
    // Las filas van A SANGRE y SIN CONTENEDOR: el muro tiene que entrar y
    // salir de campo por el canto de la ventana. Dentro del max-w-contenido se
    // leería como un carrusel dentro de una caja, que es lo contrario de lo
    // que hace este bloque.
    <section className="pb-seccion-sm sm:pb-seccion" aria-label="Team portraits">
      <div className="flex flex-col gap-muro-equipo-fila">
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
