import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import * as Modal from '@/components/alignui/modal'
import { fichaTecnicaDe, titularesTecnicos } from '@/data/flota'
import type { BarcoFlota } from '@/data/nosotros'

// LA FICHA TÉCNICA COMPLETA — el modal del botón secundario de la card
// (slide 28: «Ver ficha técnica completa»).
//
// Pedido de Samuel: «que abra un modal con toda la info técnica que puede
// tener un bote […] investiga qué tipo de información puede ir aquí realista
// y diagrámala y jerarquízala como si fuera la info final, que esté bien
// explicada, bien técnica, para alguien que le interesa este tipo de cosas».
//
// ── CÓMO SE JERARQUIZA (que es el encargo de verdad, no la lista) ────────
//
// Una ficha técnica de verdad tiene 60-80 datos. Volcarlos en una tabla larga
// es tenerlos, no comunicarlos. Aquí van en TRES NIVELES de lectura, y cada
// visitante para donde le interesa:
//
//   NIVEL 1 · Los 4 titulares (eslora · pasaje · año · potencia). Se leen sin
//     scroll y contestan «¿es el barco que me imaginaba?».
//   NIVEL 2 · Los 9 bloques temáticos, con su ÍNDICE lateral fijo. Quien
//     viene a mirar seguridad va directo a seguridad sin leer propulsión.
//   NIVEL 3 · Cada fila lleva su `nota`: qué significa el dato para quien va
//     a bordo. Un calado de 0,95 m no le dice nada a nadie; «poco calado =
//     puede acercarse a la playa» sí. Es lo que separa una ficha técnica
//     ÚTIL de un volcado de la documentación del armador.
//
// El orden de los bloques no es alfabético ni caprichoso: es el orden en que
// un armador describe un barco (identidad → medidas → capacidad → motor →
// sistemas → electrónica → seguridad → confort → sostenibilidad). Ver el
// comentario largo de data/flota.ts §3.
//
// ── SIN CARTEL DE «DATOS DE EJEMPLO» ─────────────────────────────────────
// (Samuel, 2026-07-28: «quita de la ficha lo que dice que son datos de
// ejemplo» — mismo criterio con el que se quitó el aviso del visor de 360º.)
// El modal llevaba un banner arriba explicando la procedencia y un punto aqua
// por fila; los dos se retiran: la maqueta enseña la página, no sus andamios.
//
// ⚠️ La REGLA sigue intacta donde importa: las filas sin fuente siguen
// diciendo «Pendiente — sin dato documentado» en vez de un número verosímil, y
// la marca de qué está verificado vive en el dato (`origen`, data/flota.ts).
// Se quitó el cartel, no la criba.
export function FichaTecnicaModal({ barco, onCerrar }: { barco: BarcoFlota; onCerrar: () => void }) {
  const grupos = fichaTecnicaDe(barco)
  const titulares = titularesTecnicos(barco).filter((t) => t.valor)
  const [activo, setActivo] = useState(grupos[0]?.id ?? '')

  // ⚠️ EL CONTENEDOR DE SCROLL SE GUARDA EN ESTADO, NO EN UNA `useRef`.
  //
  // Este fue el motivo REAL de que el resaltado no se moviera (Samuel: «no
  // está funcionando que se marca activo el punto donde voy»), y no salta a la
  // vista: con `useRef`, el efecto que engancha el listener corría con
  // `cuerpoRef.current === null` —comprobado en navegador— porque el contenido
  // de un diálogo de Radix vive en un PORTAL y se commitea después de que
  // corran los efectos de este componente. El efecto se iba por el `if
  // (!cuerpo) return` y, como nada volvía a renderizar, no se reintentaba
  // jamás: cero listeners, activo congelado en el primer bloque.
  //
  // Con una ref de ESTADO (`ref={setCuerpo}`), montar el nodo provoca un
  // render, y en ese render el efecto ya encuentra el elemento. Es el patrón
  // estándar para «necesito el nodo, no solo guardarlo».
  const [cuerpo, setCuerpo] = useState<HTMLDivElement | null>(null)

  // Devolver el foco al disparador al cerrar. Misma trampa (y mismo arreglo)
  // que en galeria-lightbox.tsx: el Root se desmonta por render condicional
  // del padre, así que Radix no llega a restaurarlo y el foco cae a BODY.
  useEffect(() => {
    const disparador = document.activeElement as HTMLElement | null
    return () => disparador?.focus()
  }, [])

  // ⚠️ EL RESALTADO ESTABA ROTO Y ESTE ES EL PORQUÉ (Samuel, 2026-07-28: «no
  // está funcionando que se marca activo el punto donde voy»).
  //
  // La versión anterior comparaba `el.offsetTop` contra `cuerpo.scrollTop`, y
  // esas dos medidas NO están en el mismo sistema de referencia: `offsetTop`
  // se mide desde el `offsetParent`, que es el ancestro POSICIONADO más
  // cercano — y el contenedor de scroll no lleva `position`, así que el
  // offsetParent acababa siendo el panel del diálogo (que sí está
  // posicionado). Resultado: a las medidas les sobraba la altura de la
  // cabecera, la comparación nunca cuadraba y el activo se quedaba clavado.
  //
  // Se mide con `getBoundingClientRect()` de la sección MENOS el del
  // contenedor, más el scroll actual. Eso da la posición real dentro del
  // scroller sea cual sea el offsetParent, y sirve igual para el salto.
  //
  // No se puede reutilizar `ui/use-anclas-activa.ts` (el scroll-spy de la
  // ficha de tour y de /ventaja-competitiva): ese escucha el scroll de
  // `window` y mide contra el viewport, y aquí quien scrollea es un div. Es
  // la misma idea con otro sistema de coordenadas.
  const topEnScroller = (cuerpo: HTMLElement, el: HTMLElement) =>
    el.getBoundingClientRect().top - cuerpo.getBoundingClientRect().top + cuerpo.scrollTop

  useEffect(() => {
    if (!cuerpo) return

    let raf = 0
    const recalcular = () => {
      raf = 0
      let visible = grupos[0]?.id ?? ''
      for (const g of grupos) {
        const el = cuerpo.querySelector<HTMLElement>(`#spec-${g.id}`)
        // +24 de holgura: el mismo margen con el que aterriza un salto, para
        // que la sección recién clicada cuente ya como cruzada (si la línea
        // quedara por encima del aterrizaje, se activaría la de arriba).
        if (el && topEnScroller(cuerpo, el) <= cuerpo.scrollTop + 24) visible = g.id
      }
      // Al fondo gana la última aunque su tope no haya cruzado: los bloques
      // cortos del final no se alcanzarían nunca. Mismo criterio que el
      // scroll-spy de la ficha de tour.
      if (cuerpo.scrollTop + cuerpo.clientHeight >= cuerpo.scrollHeight - 2) {
        visible = grupos[grupos.length - 1]?.id ?? visible
      }
      setActivo(visible)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(recalcular)
    }

    recalcular()
    cuerpo.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cuerpo.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [cuerpo, grupos])

  // Salto desde el índice. `scrollTop` a mano y no `scrollIntoView`: ese
  // método hace scroll de TODOS los ancestros scrolleables y acabaría
  // moviendo también la página de detrás (misma razón que la tira de
  // miniaturas del lightbox de la ficha de tour).
  const irA = (id: string) => {
    const el = cuerpo?.querySelector<HTMLElement>(`#spec-${id}`)
    if (!cuerpo || !el) return
    cuerpo.scrollTo({
      top: topEnScroller(cuerpo, el) - 16,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    })
  }

  const destino = barco.cta === 'charter' ? '/tours/charter-privado' : '/eventos/bodas'
  const etiquetaCta = barco.cta === 'charter' ? 'Ver tours con este barco' : 'Cotizar para tu evento'

  return (
    <Modal.Root open onOpenChange={(abierto) => (abierto ? undefined : onCerrar())}>
      <Modal.Content
        overlayClassName="bg-navy/55 p-4 backdrop-blur-md"
        // De la card de 400px del vendor a un panel ancho: la ficha es una
        // tabla de dos columnas con índice al lado, y a 400px el índice no
        // cabe.
        className="flex max-h-[92dvh] w-full max-w-4xl flex-col overflow-hidden rounded-card-grande"
        aria-describedby={undefined}
      >
        {/* ── UNA SOLA BARRA FIJA ────────────────────────────────────────────
            Samuel, 2026-07-28: «el hero del modal tiene demasiada altura, se
            desaprovechan 3 líneas para badge, nombre y "catamarán"… hero fijo
            arriba, menú fijo a la izquierda, footer fijo abajo: lo que queda
            para leer la ficha es una parte pequeña del modal, cuando es lo
            que la gente realmente quiere leer».

            Tenía razón en lo que importa: el cromo fijo era ~230px de un
            panel de ~880px, o sea una cuarta parte del modal gastada en
            marco. Tres cambios, todos en la misma dirección:

              · La cabecera baja de 4 alturas (eyebrow + nombre + tipo + la
                rejilla de titulares) a UNA FILA. El eyebrow «Ficha técnica
                completa» se cae entero: el botón que abre este modal se llama
                así, no hace falta repetirlo dentro. Y el tipo deja de ser un
                párrafo propio para ir en la misma línea que el nombre, que es
                donde se lee igual de bien ocupando cero altura extra.
              · Los 4 titulares BAJAN al contenido scrolleable. Son una
                entrada, no un panel de control: se leen al abrir y a partir
                de ahí estorban. Ahí sí pueden crecer y quedar cómodos.
              · EL FOOTER FIJO DESAPARECE y el CTA sube AQUÍ, a la derecha de
                la misma barra. Se cumple lo que pidió («que el botón esté
                siempre presente en algún lado, pero no como footer fijo»)
                sin gastar ni un píxel de altura nuevo: la barra ya existía.

            Resultado: ~60px de cromo fijo en vez de ~230.

            `pr-14` reserva la esquina del botón de cerrar del vendor, que va
            absoluto — sin él, el CTA se le mete debajo. */}
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-linea py-3 pl-5 pr-14 sm:pl-7">
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-2.5">
            <Modal.Title className="font-display text-h3 font-semibold text-navy">
              {barco.nombre}
            </Modal.Title>
            <span className="text-sm text-navy-soft">{barco.tipo}</span>
          </div>

          <Link
            to={destino}
            className="group hidden shrink-0 items-center gap-2 rounded-btn bg-coral px-4 py-2 text-sm font-semibold text-white shadow-boton-fancy transition hover:bg-coral-dark sm:inline-flex"
          >
            {etiquetaCta}
            <ArrowRight
              className="size-4 transition-transform duration-200 motion-safe:group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>

        {/* ── CUERPO (niveles 2 y 3) ─────────────────────────────────────── */}
        <div className="flex min-h-0 flex-1">
          {/* ÍNDICE LATERAL, SIMPLIFICADO (Samuel, 2026-07-28: «me parece un
              poco confuso el menú lateral, vamos a intentar simplificarlo»).
              Dos cosas fuera y una más estrecha:

                · TÍTULOS CORTOS (`tituloCorto`): con los largos, 6 de los 9
                  ítems partían en DOS líneas. Un índice que envuelve deja de
                  leerse como una lista de saltos y empieza a leerse como un
                  segundo párrafo — que es exactamente la confusión reportada.
                · SIN ICONOS: eran los mismos 9 iconos que ya encabezan cada
                  bloque a la derecha, así que no añadían información, solo una
                  columna más que escanear. Se quedan donde sí orientan.
                · 12rem en vez de 14: con una palabra por ítem sobra, y el
                  contenido —que es lo que se viene a leer— gana ese ancho.

              Solo desde lg: en móvil ocuparía media pantalla para navegar 9
              anclas que se recorren con el pulgar igual de rápido. */}
          <nav aria-label="Secciones de la ficha técnica" className="hidden w-44 shrink-0 border-r border-linea p-3 lg:block">
            <ul className="flex flex-col gap-0.5">
              {grupos.map((g) => (
                <li key={g.id}>
                  <button
                    type="button"
                    onClick={() => irA(g.id)}
                    aria-current={activo === g.id}
                    // El activo se marca con SUPERFICIE, no con una barrita de
                    // 2px: la barra pedía además negrita para notarse, y
                    // cambiar el peso de la fuente movía el texto de sitio al
                    // scrollear. Una píldora de aqua-tint se ve de un vistazo
                    // y no reflowea nada.
                    className={`w-full rounded-btn px-3 py-2 text-left text-sm transition ${
                      activo === g.id
                        ? 'bg-aqua-tint font-medium text-aqua-dark'
                        : 'text-navy-soft hover:bg-papel-hueso hover:text-navy-sub'
                    }`}
                  >
                    {g.tituloCorto}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div ref={setCuerpo} className="scroll-sutil min-w-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7">
            {/* Los 4 titulares, ahora DENTRO del scroll (ver la barra de
                arriba). Al no competir por el cromo fijo pueden respirar: la
                cifra manda y la etiqueta va debajo, en vez de apretarse al
                lado de un icono. */}
            {titulares.length > 0 ? (
              <dl className="mb-9 grid grid-cols-2 gap-x-6 gap-y-6 rounded-card bg-papel-hueso px-6 py-5 sm:grid-cols-4">
                {titulares.map((t) => (
                  <div key={t.label} className="min-w-0">
                    <dt className="text-xs text-navy-soft">{t.label}</dt>
                    <dd className="mt-0.5 font-display text-lead font-semibold text-navy">{t.valor}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            <div className="flex flex-col gap-9">
              {grupos.map((g) => (
                <section key={g.id} id={`spec-${g.id}`}>
                  <h3 className="flex items-center gap-2.5 font-display text-h3 font-semibold text-navy">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-aqua-tint text-aqua-dark">
                      <g.icono className="size-4" aria-hidden="true" />
                    </span>
                    {g.titulo}
                  </h3>
                  <p className="mt-2 text-sm text-navy-sub">{g.intro}</p>

                  {/* La tabla. `divide-y` en vez de bordes por fila: una sola
                      línea entre filas, sin doblar el hairline arriba y abajo. */}
                  <dl className="mt-4 divide-y divide-linea border-y border-linea">
                    {g.filas.map((fila) => (
                      <div key={fila.label} className="grid grid-cols-1 gap-x-6 gap-y-1 py-3 sm:grid-cols-[13rem_1fr]">
                        {/* Sin el punto de «dato verificado»: se retira con el
                            cartel que lo explicaba (ver la cabecera). Un punto
                            de color sin leyenda no dice nada — sería ruido. */}
                        <dt className="text-sm text-navy-soft">{fila.label}</dt>
                        <dd className="min-w-0">
                          {fila.valor ? (
                            <span className="text-sm font-medium text-navy">{fila.valor}</span>
                          ) : (
                            <span className="text-sm italic text-navy-soft">
                              Pendiente — sin dato documentado
                            </span>
                          )}
                          {fila.nota ? <p className="mt-1 text-xs text-navy-soft">{fila.nota}</p> : null}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </section>
              ))}
            </div>

            {/* Cierre de la ficha, DENTRO del scroll. Era el texto del pie
                fijo; aquí funciona mejor porque llega cuando de verdad aplica
                —al terminar de leerlo todo— y no ocupa sitio mientras tanto.
                El CTA en móvil también vive aquí: arriba se oculta por debajo
                de sm, donde la barra no da para nombre + botón. */}
            <div className="mt-10 border-t border-linea pt-6">
              <p className="text-sm text-navy-sub">
                ¿Necesitas un dato que no está aquí? Escríbenos y te lo confirmamos antes de reservar.
              </p>
              <Link
                to={destino}
                className="group mt-4 inline-flex items-center gap-2 rounded-btn bg-coral px-5 py-2.5 text-sm font-semibold text-white shadow-boton-fancy transition hover:bg-coral-dark sm:hidden"
              >
                {etiquetaCta}
                <ArrowRight
                  className="size-4 transition-transform duration-200 motion-safe:group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </div>
      </Modal.Content>
    </Modal.Root>
  )
}
