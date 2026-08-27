import { useEffect, useState } from 'react'
import { Gauge } from 'lucide-react'
import { t } from '@/lib/i18n'

// LA POTENCIA, NAVEGADA (pedido de Samuel, 2026-07-28: «a lo de potencia dale
// un estilo divertido y creativo, como que es una barra de progreso gruesa o
// meta, y lo recorrido tiene fondo de océano y en la punta va el barco PNG que
// tenemos; si es más está más cerca del final, si es menor el recorrido es más
// corto»).
//
// ── POR QUÉ ESTO FUNCIONA Y UNA CIFRA NO ─────────────────────────────────
// «480 hp» no le dice nada a casi nadie: hace falta saber qué es mucho y qué
// es poco para que el número signifique algo, y eso solo lo tiene quien ya
// entiende de barcos — justo el visitante que NO necesita que se lo cuenten.
// Un recorrido con final visible convierte el dato en una comparación, que es
// la pregunta real de quien lo mira: ¿este barco es de los fuertes o de los
// tranquilos? El Maite (58 hp, un velero con motores auxiliares) apenas se
// separa del muelle; el Forever Teresa llega a la meta. Se entiende sin leer.
//
// ── LA ESCALA ES LA FLOTA ────────────────────────────────────────────────
// El final del recorrido son los caballos del barco más potente que tenemos
// (`potenciaDe`, data/flota.ts), no un tope redondo inventado: 480 sobre 1.000
// sería una fracción arbitraria; sobre 760 es un hecho. Y se recalibra sola en
// cuanto entre una embarcación más potente.
//
// ── DETALLES QUE HACEN QUE SE LEA COMO AGUA Y NO COMO UN GRÁFICO ─────────
//   · El relleno es una FOTO real del Caribe cenital (la misma del banner de
//     cero plástico), no un degradado aqua. Un degradado se lee como barra de
//     carga; el agua se lee como agua.
//   · El barco es el recorte real con fondo transparente que ya usa el
//     proyecto (zarpa del CTA del hero, navega el recorrido de Sostenibilidad).
//     Va con el casco DENTRO del agua, no encima de la barra: si se apoya en
//     el borde superior parece una chincheta marcando un valor.
//   · El barco vive FUERA del contenedor recortado. La pista necesita
//     `overflow-hidden` para que el agua respete el radio, y ahí dentro el
//     mástil se decapitaba — así que la estela se recorta y el barco se
//     posiciona aparte, sobre la misma coordenada.
//   · Estela y barco comparten duración y curva (componentes.css): si divergen
//     aunque sea un pelo, el barco se despega del borde del agua.
//
// Todo el bloque va `aria-hidden`: es la representación de un dato que ya está
// escrito al lado en texto («480 hp», «máximo de la flota: 760 hp»). Un lector
// de pantalla no necesita que le describan la ilustración, necesita la cifra —
// y la tiene.
export function BarraPotencia({
  hp,
  maximo,
  fraccion,
}: {
  hp: number
  maximo: number
  /** 0-1 — hasta dónde llega este barco sobre el recorrido de la flota. */
  fraccion: number
}) {
  // Arranca en el muelle y zarpa al montar. Se hace con estado y no con una
  // animación CSS de keyframes porque el destino es un valor calculado: un
  // `@keyframes` tendría que recibir el porcentaje por variable igualmente, y
  // así además el estado final es el natural del DOM (lo que ve quien tiene
  // reduced-motion, y el frame que viaja a Figma).
  const [zarpado, setZarpado] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setZarpado(true))
    return () => cancelAnimationFrame(id)
  }, [])

  // Un mínimo de recorrido para que el barco no nazca medio fuera de la pista
  // por la izquierda: con el 7,6% del Maite ya hay sitio de sobra, pero un
  // barco futuro de 20 hp lo dejaría cortado contra el borde.
  const destino = `${Math.max(fraccion * 100, 7)}%`
  const posicion = zarpado ? destino : '0%'

  // ── LA BARRA VA SOLA (Samuel, 2026-07-28) ────────────────────────────────
  // «Me gusta el banner de potencia, pero lo metiste como dentro de una caja
  // con más info que está como suelta; preferiría incluso solo la barra y ya,
  // para no tener que reordenar esa información extra».
  //
  // Se cae el panel gris que la envolvía junto a eslora/pasaje/año, y se caen
  // también las dos líneas de pie que llevaba. La de los motores («2 × Yanmar
  // 4LHA-STP…») era redundante de verdad: está entera en el bloque de
  // propulsión, tres pantallazos más abajo. Eslora, pasaje y año tampoco se
  // pierden — son las primeras filas de Identificación, Dimensiones y
  // Capacidad.
  //
  // Lo único que SÍ se queda es el máximo de la flota, y no es adorno: sin él,
  // la marca del final no significa nada y el recorrido deja de ser una
  // comparación para volver a ser una barra de progreso decorativa. Va debajo
  // de la meta, alineado con ella, porque es su etiqueta.
  return (
    <div>
      {/* SIN TÍTULO ARRIBA (Samuel, 2026-07-28: «quita el título Potencia de
          arriba, para que no haya ese espacio y de una se vea la barra; ponlo
          al lado de la potencia que tiene el barco»). La etiqueta ocupaba una
          fila entera para decir una palabra que la cifra de abajo ya
          contextualiza en cuanto van juntas — y encima retrasaba lo único que
          hay que ver al abrir la ficha.

          `pt-7` es lo ÚNICO que queda arriba, y no es aire decorativo: es el
          hueco por el que asoma el mástil. El barco mide más que la pista y
          sobresale ~25px por encima; sin esta reserva se metería debajo de lo
          que haya justo antes. */}
      <div aria-hidden="true" className="relative pt-7">
        {/* ⚠️ EL AGUA NO CRECE: LO QUE RETROCEDE ES LA MÁSCARA.
            La primera versión ponía la foto como fondo del relleno y le
            animaba el ancho. Se veía mal y el motivo es sutil: con
            `background-size: cover`, cambiar el ancho de la caja cambia QUÉ
            TROZO de la foto se ve, así que a poco recorrido —el Maite, 58 hp
            de 760— la barra enseñaba un recorte cualquiera de la imagen, con
            la esquina parda del arrecife en vez de agua turquesa. Y al animar,
            el mar se deslizaba por dentro de sí mismo.
            Ahora el océano cubre la PISTA ENTERA y siempre con el mismo
            encuadre; encima va una máscara del color del papel que se retira
            hacia la derecha. El agua queda quieta, como el mar de verdad, y lo
            que se mueve es el barco descubriéndola. La costura de la máscara
            no se ve: el barco navega justo encima de ella. */}
        <div
          className="relative overflow-hidden rounded-chip bg-cover bg-center ring-1 ring-inset ring-linea"
          style={{
            height: 'var(--spacing-flota-potencia-alto)',
            backgroundImage: 'url(/fotos/arrecife-fondo-cenital-v2.webp)',
          }}
        >
          {/* ⚠️ LA MÁSCARA NO TAPA: ATENÚA. Tercera versión de esta capa y la
              buena; las dos anteriores tenían el mismo defecto de raíz.

              Primero fue blanco sólido: el tramo por recorrer desaparecía
              contra el fondo del modal y la barra quedaba como una mancha de
              agua con unas rayas flotando a la derecha (sin pista visible no
              hay recorrido, y sin recorrido la meta no significa nada).
              Después fue gris sólido: ya se veía la pista, pero Samuel dio con
              lo que fallaba de verdad — «hay un fondo sólido blanco o gris que
              queda raro». Y es que un bloque plano CORTA el mar en dos: media
              barra es una foto y la otra media un rectángulo de color, dos
              materiales distintos pegados.

              Ahora el velo es TRANSLÚCIDO (papel al 86%): el océano cubre la
              pista entera y el tramo pendiente se ve, muy lavado, por debajo.
              Sigue siendo mar —no hay corte de material— pero se distingue sin
              dudar del agua ya navegada. Que es, además, lo que pasa de
              verdad: el mar que el barco todavía no ha cruzado sigue estando
              ahí.

              El borde izquierdo se disuelve en 28px: un canto recto detrás del
              casco se lee como el borde de una barra de progreso —lo que
              estamos evitando— y delata la capa. Disuelto, el agua se apaga
              como se apaga una estela. */}
          <div
            className="potencia-estela absolute inset-y-0 right-0"
            style={{
              width: `calc(100% - ${posicion})`,
              backgroundImage:
                'linear-gradient(to right, transparent 0, color-mix(in srgb, var(--color-papel) 86%, transparent) 1.75rem)',
            }}
          />

          {/* LA META. Franja rayada al final del recorrido — el gesto de línea
              de meta de toda la vida, dibujado con un `repeating-linear-gradient`
              (cero hex sueltos: el color sale de --color-navy rebajado con
              `color-mix`).
              ⚠️ ANTES NO SE VEÍA (Samuel: «hay como un fondo blanco que no deja
              ver las líneas rayadas»): iba en --color-linea y al 60% de
              opacidad, o sea gris clarísimo sobre la máscara BLANCA que hay
              justo detrás — dos claros superpuestos. Un rayado de meta tiene
              que contrastar con lo que tenga debajo, que aquí es papel el 90%
              de las veces. Navy al 22% se lee sin gritar. */}
          <div
            className="absolute inset-y-0 right-0 w-8"
            style={{
              background:
                'repeating-linear-gradient(45deg, color-mix(in srgb, var(--color-navy) 22%, transparent) 0 6px, transparent 6px 12px)',
            }}
          />
        </div>

        {/* El barco, fuera del recorte de la pista para que el mástil no se
            decapite. `-translate-x-1/2` lo centra sobre la marca; `bottom-2`
            le mete el casco en el agua en vez de posarlo encima del borde. */}
        <img
          src="/fotos/catamaran-recorte.webp"
          alt=""
          className="potencia-barco absolute bottom-2 w-14 -translate-x-1/2 drop-shadow-md"
          style={{ left: posicion }}
        />
      </div>

      {/* Las dos cifras EN LA MISMA FILA, cada una bajo su punto de la barra
          (Samuel, 2026-07-28: «la potencia del barco ponla igual abajo de la
          barra a la izquierda, y así queda a la derecha el máximo de la
          flota»). Es mejor de lo que estaba: antes la cifra del barco vivía
          arriba a la derecha, o sea encima del tramo que el barco NO ha
          recorrido — justo el sitio que contradice lo que dice. Abajo a la
          izquierda es de donde sale, y enfrentada al máximo la comparación se
          lee sin buscar. */}
      <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="flex items-baseline gap-2">
          <span className="flex items-center gap-1.5 text-xs text-navy-soft">
            <Gauge className="size-3.5" aria-hidden="true" />
            {t('Power')}
          </span>
          <span className="font-display text-lead font-semibold text-navy">{hp} {t('hp')}</span>
          <span className="text-xs text-navy-soft">{t('total')}</span>
        </p>
        <p className="text-xs text-navy-soft">{t('Fleet maximum:')}{' '}{maximo} {t('hp')}</p>
      </div>
    </div>
  )
}
