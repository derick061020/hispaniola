import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CalendarDays, FileText, Ruler, Users } from 'lucide-react'
import { MEDIA_FLOTA } from '@/data/flota'
import { useDevFlag } from '@/dev/use-dev-flag'
import type { BarcoFlota } from '@/data/nosotros'
import { GaleriaBarco } from './galeria-barco'
import { FichaTecnicaModal } from './ficha-tecnica-modal'
import { Visor360 } from './visor-360'

// LA «TARJETA DE BARCO (PLANTILLA)» del slide 28, completa.
//
// Sustituye a `components/nosotros/barco-card.tsx`, que era la card de tour de
// la home con los datos de un barco: foto quieta, chip, descripción, fila de
// meta, chips y CTA. Le faltaban exactamente las tres cosas que el cliente
// dibuja en su maqueta y que la reunión del 07-24 confirmó — galería con
// vídeo, 360º y ficha técnica.
//
// El ORDEN DE LECTURA de la maqueta se respeta al pie de la letra:
//
//   media (vídeo por defecto) + chip + «Ver en 360º»
//   tira de miniaturas
//   nombre
//   descripción
//   3 chips de specs (eslora · pasaje · año)
//   chips de «ideal para»
//   ── botón secundario: «Ver ficha técnica completa»
//   ── CTA primario: «Ver tours con este barco»
//
// ⚠️ LO QUE SE PIERDE RESPECTO A LA CARD ANTERIOR, y por qué está bien: el
// STRETCHED LINK. La card vieja tenía un enlace invisible cubriéndola entera
// (herencia de la card de tour de la home), de forma que un clic en cualquier
// punto llevaba al tour. Con un vídeo, flechas, cinco miniaturas, un botón de
// 360º y otro de ficha técnica, ese enlace se tragaría todos los gestos —
// habría que sembrar la card de `stopPropagation` para desactivarlo por
// zonas, que es un parche sobre un patrón que aquí ya no aplica. La card pasa
// de ser un enlace grande a ser un panel con controles, y el destino vive
// solo en su CTA. Es la misma disyuntiva de siempre: una card se puede
// clicar entera O tener controles dentro, no las dos cosas.
//
// LAS SPECS PASAN DE FILA DE META A CHIPS (`41 pies` · `Hasta 20` · `2013`),
// que es como las dibuja la maqueta. No es cosmética: al haber ahora una
// ficha técnica de 60 datos detrás, estos tres son el RESUMEN de esa ficha, y
// un chip se lee como «dato destacado» mientras una fila de iconos se leía
// como «metadatos de la card». Cada casilla sigue pintándose solo si hay
// dato — la fuente no fecha el GrandMa, el Joker ni el Karaya, y ahí no se
// rellena el hueco (ver data/nosotros.ts).
export function BarcoCard({
  barco,
  primera = false,
}: {
  barco: BarcoFlota
  /** [dev-mode] true solo en la 1ª card: la que responde a los deep-links. */
  primera?: boolean
}) {
  const [fichaAbierta, setFichaAbierta] = useState(false)
  const [visor360Abierto, setVisor360Abierto] = useState(false)

  // [dev-mode] Deep-links del Glosario Dev sobre la 1ª card — los dos modales
  // de la card no se pueden alcanzar de otra forma en un frame estático. El
  // gate `primera` evita que un solo flag abra seis modales a la vez.
  useDevFlag('dev-ficha-tecnica', (v) => { // [dev-mode]
    if (primera && v === 'abierta') setFichaAbierta(true) // [dev-mode]
  }) // [dev-mode]
  useDevFlag('dev-360', (v) => { // [dev-mode]
    if (primera && v === 'abierto') setVisor360Abierto(true) // [dev-mode]
  }) // [dev-mode]

  const media = MEDIA_FLOTA[barco.nombre] ?? []
  const video = media.find((m) => m.tipo === 'video')
  const destino = barco.cta === 'charter' ? '/tours/private-charter' : '/events/weddings'
  const etiquetaCta = barco.cta === 'charter' ? 'Ver tours con este barco' : 'Cotizar para tu evento'

  const specs = [
    { icono: Ruler, valor: barco.eslora },
    { icono: Users, valor: barco.capacidad },
    { icono: CalendarDays, valor: barco.anio },
  ].filter((s) => s.valor)

  return (
    <article className="nosotros-cascada-diagonal group flex flex-col overflow-hidden rounded-card-grande bg-papel p-2 shadow-card ring-1 ring-linea transition motion-safe:hover:-translate-y-1 hover:shadow-card-flotante">
      <GaleriaBarco
        media={media}
        nombre={barco.nombre}
        chip={barco.chipFoto}
        // El 360º solo se ofrece si hay una pieza de vídeo que enseñar. Hoy la
        // hay en los 6 (es la misma, de ejemplo — ver data/flota.ts §2); el
        // día que un barco no la tenga, el botón desaparece solo.
        onAbrir360={video ? () => setVisor360Abierto(true) : undefined}
        primera={primera} // [dev-mode]
      />

      <div className="flex flex-1 flex-col gap-3 px-3 pb-3 pt-4">
        <div>
          <h3 className="font-display text-h3 font-semibold text-navy">{barco.nombre}</h3>
          <p className="mt-1.5 line-clamp-2 text-sm text-navy-sub">{barco.descripcionCorta}</p>
        </div>

        {specs.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {specs.map((s) => (
              <span
                key={s.valor}
                className="inline-flex items-center gap-1.5 rounded-chip bg-papel-hueso px-2.5 py-1 text-xs font-medium text-navy-sub ring-1 ring-inset ring-linea"
              >
                <s.icono className="size-3.5 text-navy-soft" aria-hidden="true" />
                {s.valor}
              </span>
            ))}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-chip bg-aqua-tint px-2.5 py-1 text-xs font-medium text-aqua-dark">
            {barco.idealPara}
          </span>
          {/* El tipo solo entra como chip si NO se está usando ya de sustituto
              de la eslora — si no, el mismo dato dos veces. */}
          {barco.eslora ? (
            <span className="rounded-chip bg-papel-hueso px-2.5 py-1 text-xs font-medium text-navy-sub ring-1 ring-inset ring-linea">
              {barco.tipo}
            </span>
          ) : null}
        </div>

        {/* Los dos botones. La maqueta del cliente ponía el secundario ARRIBA
            y el CTA debajo; Samuel lo invirtió (2026-07-28: «el botón de ficha
            técnica puedes ponerlo debajo del CTA principal»), y es la
            colocación correcta: el orden visual debe ir de mayor a menor
            intención. Con la ficha técnica primero, lo primero que se ofrece
            al terminar de leer el barco es seguir leyendo; con el CTA primero,
            es reservarlo — y quien quiera la ficha la sigue teniendo a un
            centímetro. `mt-auto` los pega al pie para que las cards rimen
            aunque las descripciones midan distinto. */}
        <div className="mt-auto flex flex-col gap-2 pt-2">
          {/* CTA — la receta del FancyButton primary de AlignUI portada a
              tokens Hispaniola, la MISMA de home/tour-card.tsx. Si esa receta
              cambia, cambia en los dos sitios: son la misma pieza. */}
          <Link
            to={destino}
            className="relative flex w-full items-center justify-center gap-2 rounded-btn bg-coral px-4 py-3 text-sm font-semibold text-white shadow-boton-fancy transition duration-200 ease-out before:pointer-events-none before:absolute before:inset-0 before:z-10 before:rounded-[inherit] before:bg-linear-to-b before:from-white/12 before:to-transparent before:p-px before:[mask-clip:content-box,border-box] before:[mask-composite:exclude] before:[mask-image:linear-gradient(#fff_0_0),linear-gradient(#fff_0_0)] after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:bg-linear-to-b after:from-white after:to-transparent after:opacity-[.16] after:transition after:duration-200 after:ease-out hover:after:opacity-[.24]"
          >
            {etiquetaCta}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>

          {/* Debajo del CTA, el secundario BAJA DE PESO: sin anillo, solo
              texto con su icono. Un botón con contorno justo debajo del coral
              lleno crea dos rectángulos apilados compitiendo; en segunda
              posición ya no necesita marco para que se encuentre. */}
          <button
            type="button"
            onClick={() => setFichaAbierta(true)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-btn px-4 py-2 text-sm font-semibold text-navy-sub transition hover:bg-papel-hueso hover:text-navy"
          >
            <FileText className="size-4 text-navy-soft" aria-hidden="true" />
            Ver ficha técnica completa
            <span className="sr-only"> del {barco.nombre}</span>
          </button>
        </div>
      </div>

      {/* Los dos modales se montan por render condicional (no `open={bool}`)
          para que su contenido —incluido el vídeo del 360º— no exista en el
          DOM mientras están cerrados. Con 6 cards en la rejilla eso son 6
          vídeos y 6 fichas de 60 filas que no se construyen. */}
      {fichaAbierta ? <FichaTecnicaModal barco={barco} onCerrar={() => setFichaAbierta(false)} /> : null}
      {visor360Abierto && video?.tipo === 'video' ? (
        <Visor360
          src={video.src}
          poster={video.poster}
          nombre={barco.nombre}
          onCerrar={() => setVisor360Abierto(false)}
        />
      ) : null}
    </article>
  )
}
