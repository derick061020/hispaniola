import { useLayoutEffect, useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import gsap from 'gsap'
import { TOURS } from '@/data/home'
import { useDevFlag } from '@/dev/use-dev-flag'
import { t } from '@/lib/i18n'

// «Pruebas de compra» — avisos de reservas recientes (correcciones v1 del
// cliente, 2026-07-20 — planes/01-home.md slide 19: «agregar pruebas de
// compra», con la captura de un badge tipo "Last reservation: 50 minutes ago").
//
// LOS DATOS SIGUEN SIENDO DE EJEMPLO POR DENTRO (xpotours, el motor de
// reservas, sigue pendiente del cliente) — pero el aviso YA NO LO DICE EN
// PANTALLA (2026-07-22, decisión de Samuel: "que no diga que es información
// de ejemplo" — revierte la marca «Dato de ejemplo» visible de la vuelta
// anterior, ahora que el rediseño en ticket con foto real se aleja del
// look de placeholder que tenía el aviso con icono). Cuando el motor esté
// conectado, se sustituye EJEMPLOS por el feed real y el componente no
// cambia — sigue siendo la MISMA decisión de fondo (c) que ya se tomó una
// vez: construir con datos de ejemplo en vez de esperar al backend.
//
// TICKET, no icono (mismo pedido: "que en vez de icono tenga la imagen del
// producto... que se parezca a un ticket con los recortes semicirculares
// que aprendimos a hacer en reserva directa"). Misma TÉCNICA que .boleto-
// superficie (why-direct.tsx: mask-image con dos radial-gradient que
// cortan círculos en el borde), reproduciendo su geometría exacta (corte a
// una posición intermedia de un borde, no en una esquina — ver "LA
// POSICIÓN DEL CORTE" más abajo) para que el corte se vea igual de bien en
// cualquier navegador que ya sabemos que muestra bien el del boleto.
//
// DOS BALDOSAS, NO TRES CAPAS (9ª vuelta — Samuel: "cuando se separan se va
// el border radius y los agujeros"). Hasta acá la FORMA del ticket (radio +
// corte) vivía en UNA superficie aparte (`superficieRef`) que se desvanecía
// rápido al desgarrar, mientras las 2 mitades que caían eran rectángulos
// pelados con solo un fondo gris inyectado por JS: al separarse perdían el
// radio y los agujeros, justo lo que Samuel vio. Ahora no hay superficie
// suelta — cada mitad lleva la SUYA, y cae con su forma entera.
//
// El truco está en cómo se parte, porque partir la superficie en dos de
// verdad habría dejado el corte en una ESQUINA de cada trozo — la geometría
// que NO se renderiza bien (ver "LA POSICIÓN DEL CORTE" más abajo; es el bug
// que costó 3 vueltas). En vez de eso, cada mitad lleva una superficie del
// ANCHO COMPLETO del ticket (w-72, con el corte en su posición intermedia de
// siempre) y la recorta con `overflow-hidden` a su propia columna: la
// izquierda ancla su superficie a `left-0` y enseña el tramo [0, 80px]; la
// derecha la ancla a `right-0` y enseña el [80px, 288px]. Las 2 baldosas
// embaldosan el ticket completo sin solape ni costura (cada media luna del
// corte se junta con la otra formando el agujero entero), pero al desgarrarse
// cada una se va con su radio exterior y su media luna en el canto del
// desgarro. Ningún corte vive nunca en una esquina.
//
// De paso, esto elimina el problema que motivó las 3 capas de la 5ª vuelta:
// ya no hay nada que se quede quieto y haya que desvanecer (`fichaRef` es
// transparente, las 2 baldosas se van), así que el desgarro no toca opacity
// en ningún sitio — ni la de las mitades (que caerían desvaneciéndose antes
// de cruzar la pantalla) ni la de un fondo fantasma que ya no existe.
//
// LA POSICIÓN DEL CORTE, NO EL COMPOSITE, ERA EL BUG (4ª vuelta — Samuel
// probó 2 recetas de mask-composite distintas —`intersect` y `exclude`— y
// ninguna mostraba el corte en su navegador, pero confirmó que ESE MISMO
// navegador sí muestra bien los cortes de .boleto-superficie, que usa
// `intersect` sin prefijos). Esa pista descartó la teoría de soporte de
// `mask-composite`: la diferencia real era que el corte vivía en cada
// mitad, en una posición de ESQUINA matemática (`at 100% 0`, extremo en
// los DOS ejes a la vez) — el boleto corta a una ALTURA intermedia de un
// borde lateral (extremo en un eje, punto medio en el otro), y un
// radial-gradient centrado justo en una esquina se comporta distinto en
// algunos motores. La superficie única reproduce la geometría del boleto
// con los ejes intercambiados: corte a lo ALTO completo, a un ANCHO
// intermedio FIJO (el ancho de la columna de la foto,
// --spacing-alerta-imagen-ancho — fijo, así que a diferencia de --bn del
// boleto no hace falta medirlo con JS) — mismo `mask-composite: intersect`
// sin prefijos que ya funciona en .boleto-superficie. Ver componentes.css.
//
// FOTO CON AIRE, NO A SANGRE (2ª vuelta — Samuel: "quiero que la imagen no
// esté a sangre, sino que tenga su aire por todos los lados"). El div de
// la foto es el MARCO (con su propio padding, `p-1.5`) y la `<img>` es una
// pieza más chica adentro, con su propio `rounded-foto` — mismo patrón
// "passe-partout" que ya existe en el proyecto (--radius-foto, tokens.css:
// "foto dentro del passe-partout del photo-stack"; ver también
// fundaciones.tsx). El corte semicircular sigue viviendo en el borde de la
// SUPERFICIE (no en este marco) — el aire alrededor de la foto no cambia
// dónde cae la perforación, solo cómo se ve la foto DENTRO de su columna.
//
// EL DESGARRO NO PODÍA DEJAR NADA QUIETO (5ª vuelta — Samuel: "al caer los
// tickets, desaparecen no con el extremo de la pantalla sino antes").
// Diagnóstico con Playwright: la caída (antes 56px) SÍ alcanzaba a cruzar
// el borde inferior real de la pantalla (el aviso vive a `bottom-5`, a
// solo ~20px de ese borde) — pero como la opacity se apagaba EN PARALELO
// con la caída (mismo tween), para cuando la pieza apenas empezaba a
// asomarse fuera de la pantalla ya estaba casi transparente: se leía como
// "se desvanece en el aire", no como "se cae y la pantalla la recorta". La
// 4ª vuelta además fadeaba TODO `fichaRef` (wrapper exterior) para tapar
// el fantasma del contorno — pero `fichaRef` era ancestro de las 2
// mitades, así que ese fade se combinaba con el de las mitades y agravaba
// el problema. Solución: la caída ahora es mucho más larga
// (--DESGARRO_CAIDA, bastante más que los ~20px que hacen falta para
// cruzar el borde) y las 2 mitades YA NO desvanecen su propia opacity —
// caen sólidas hasta que la propia pantalla las recorta, un efecto que
// ningún fade puede imitar. (En su momento el fondo sólido de las mitades
// se inyectaba por JS al empezar la caída y `superficieRef` se desvanecía
// aparte; desde la 9ª vuelta nada de eso hace falta — cada mitad ya trae su
// propia superficie con fondo y forma, ver "DOS BALDOSAS" arriba — pero el
// diagnóstico de por qué la opacity no puede acompañar a la caída sigue
// siendo la razón de que el desgarro no toque opacity en ningún sitio.)
//
// DESGARRO DE SALIDA (pedido original: "con gsap podrías hacer que la
// animación de salida es que se 'rasga' el ticket desde la separación de
// los dots y se caen hacia abajo"). GSAP, no CSS — un mount/unmount de
// React no lo anima un @keyframes (mismo motivo de siempre en este
// proyecto) y además acá las DOS mitades se mueven en direcciones
// DISTINTAS (una cae girando a la izquierda, la otra a la derecha).
// `desgarrar()` corre un timeline de gsap y llama a su callback en el
// `onComplete` — el ciclo de auto-rotación (cada ~15s) y el botón de
// cerrar comparten la MISMA función: los dos son "este aviso se va", solo
// cambia qué pasa DESPUÉS (el ciclo sigue con el próximo tour; cerrar apaga
// el aviso el resto de la sesión).
//
// TODO EL CICLO ES MONTAJE/DESMONTAJE, NO UN RESET A MANO. La ficha entera
// (superficie + foto + texto) se MONTA/DESMONTA con React (`mostrado`,
// useState) y gsap solo pone la entrada (fade + ascenso, useLayoutEffect)
// — el desgarro, en su onComplete, llama a `listo()` sin resetear nada:
// quien llama pone `visible`/`cerrado` en false y React desmonta la ficha
// directo. El próximo ciclo MONTA nodos frescos (sin rastro de transform/
// opacity/background inline de la vez anterior), así que no hay nada que
// "reaparezca" ni fondo alguno que pueda quedar flotando de recuerdo.
//
// DECISIÓN ABIERTA PARA SAMUEL: este patrón (urgencia social) es de manual
// de growth, y la dirección del proyecto es «Charter Premium». Un hotel de
// lujo no te dice «¡3 personas están viendo esto!». Si el tono no encaja,
// se borra el componente y su línea en home.tsx — no tiene más dependencias.
//
// Comportamiento: aparece abajo-izquierda tras una espera, se queda unos
// segundos, se va, y rota al siguiente tour. Cerrable (y al cerrar no vuelve
// en toda la sesión). Respeta prefers-reduced-motion (sin animación, entra y
// sale directo) y no se monta en móvil, donde taparía el CTA sticky de reserva.

// Minutos «desde la última reserva» de cada aviso. Son de ejemplo, y por eso
// están aquí y no en data/ — el día que haya motor, este array desaparece
// entero en vez de quedar como un dato del proyecto que alguien pueda creerse.
const EJEMPLOS = [
  { minutos: 12 },
  { minutos: 47 },
  { minutos: 5 },
  { minutos: 23 },
]

const ENTRADA_DURACION = 0.32
const ENTRADA_EASE = 'back.out(1.4)'
const ENTRADA_Y_INICIAL = 14 // px

// La caída tiene que ser mucho mayor que los ~20px que separan el aviso
// (bottom-5) del borde real de la pantalla — así la pieza sale del
// viewport con margen de sobra, sin depender de un fade para "ayudar" a
// que desaparezca (ver "EL DESGARRO NO PODÍA DEJAR NADA QUIETO" arriba).
const DESGARRO_DURACION = 0.6
const DESGARRO_EASE = 'power1.in' // acelera al caer, como gravedad
const DESGARRO_CAIDA = 150 // px
const DESGARRO_ROTACION = 12 // deg — cada mitad gira para SU lado (signos opuestos): en paralelo no se leería como 2 piezas separándose
const DESGARRO_DERIVA = 12 // px — separación horizontal sutil, refuerza el "se apartan" además de "se caen"
const DESGARRO_RETRASO_INFO = 0.04 // la mitad del texto arranca una fracción después — desgarro, no caída sincronizada

export function PruebaSocial() {
  const [indice, setIndice] = useState(0)
  const [visible, setVisible] = useState(false)
  const [cerrado, setCerrado] = useState(false)
  // [dev-mode] ?dev-prueba=visible fuerza el aviso ya montado, sin esperar el
  // ciclo → frame limpio para Figma. Ver dev-registry.ts.
  const [forzado, setForzado] = useState(false)
  useDevFlag('dev-prueba', (v) => setForzado(v === 'visible')) // [dev-mode]

  const fichaRef = useRef<HTMLDivElement>(null)
  const imagenRef = useRef<HTMLDivElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)

  const mostrado = forzado || visible

  // Entrada — fade + un pequeño ascenso, cada vez que la ficha se MONTA (la
  // primera vez y cada ciclo posterior: al desmontarse del todo tras el
  // desgarro, ver abajo, la siguiente entrada es un montaje fresco, así que
  // este efecto corre de nuevo sin necesitar resetear nada a mano). Anima
  // `fichaRef` completo — a diferencia del desgarro, acá SÍ queremos que
  // superficie y contenido aparezcan juntos, como una sola pieza.
  useLayoutEffect(() => {
    if (!mostrado) return
    const el = fichaRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const tween = gsap.fromTo(
      el,
      { opacity: 0, y: ENTRADA_Y_INICIAL },
      { opacity: 1, y: 0, duration: ENTRADA_DURACION, ease: ENTRADA_EASE },
    )
    return () => {
      tween.kill()
    }
  }, [mostrado])

  // Desgarra las 2 mitades de contenido (o lo salta sin movimiento) y llama
  // a `listo` cuando ya cayeron — quien llama decide qué pasa DESPUÉS
  // (seguir el ciclo al próximo tour, o cerrar del todo). Sin reset manual:
  // la ficha se DESMONTA justo después (`listo` pone `visible`/`cerrado`
  // en false), así que el próximo montaje crea nodos nuevos sin rastro de
  // esta animación.
  const desgarrar = (listo: () => void) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      listo()
      return
    }
    const imagen = imagenRef.current
    const info = infoRef.current
    if (!imagen || !info) {
      listo()
      return
    }
    // Nada que apagar ni que pintar aquí: cada mitad YA lleva su propia
    // superficie de ticket (fondo + radio + agujeros), así que cae con su
    // forma entera y no queda ningún fantasma detrás — ver "DOS BALDOSAS,
    // NO TRES CAPAS" en la cabecera.
    const tl = gsap.timeline({ onComplete: listo })
    tl.to(
      imagen,
      {
        y: DESGARRO_CAIDA,
        x: -DESGARRO_DERIVA,
        rotation: -DESGARRO_ROTACION,
        duration: DESGARRO_DURACION,
        ease: DESGARRO_EASE,
      },
      0,
    ).to(
      info,
      {
        y: DESGARRO_CAIDA * 1.15,
        x: DESGARRO_DERIVA,
        rotation: DESGARRO_ROTACION,
        duration: DESGARRO_DURACION,
        ease: DESGARRO_EASE,
      },
      DESGARRO_RETRASO_INFO,
    )
  }

  useEffect(() => {
    if (cerrado || forzado) return
    if (typeof window === 'undefined') return
    // No en móvil: taparía el CTA sticky de reserva del hero.
    if (!window.matchMedia('(min-width: 768px)').matches) return

    let cancelado = false
    const timers: number[] = []

    const ciclo = () => {
      if (cancelado) return
      setVisible(true)
      timers.push(
        window.setTimeout(() => {
          if (cancelado) return
          desgarrar(() => {
            if (cancelado) return
            setVisible(false)
            timers.push(
              window.setTimeout(() => {
                if (cancelado) return
                setIndice((i) => (i + 1) % EJEMPLOS.length)
                ciclo()
              }, 9000),
            )
          })
        }, 6000),
      )
    }

    // La primera espera es larga a propósito: saltar encima del visitante
    // apenas carga la página es exactamente lo que hacía el popup que este
    // mismo lote de correcciones manda eliminar.
    timers.push(window.setTimeout(ciclo, 8000))

    return () => {
      cancelado = true
      for (const temporizador of timers) window.clearTimeout(temporizador)
    }
  }, [cerrado, forzado])

  if (cerrado || !mostrado) return null
  const ejemplo = EJEMPLOS[indice]
  const tour = TOURS[indice % TOURS.length]

  return (
    <div aria-live="polite" className="pointer-events-none fixed bottom-5 left-5 z-30 hidden md:block">
      {/* fichaRef: solo posición/tamaño — sin fondo, sombra ni mask propios,
          así no queda NADA suyo detrás cuando las 2 mitades se van (ver el
          comentario de cabecera, "DOS BALDOSAS, NO TRES CAPAS"). Fila flex:
          las mitades se colocan lado a lado y juntas forman el ticket. */}
      <div ref={fichaRef} className="pointer-events-auto relative flex w-alerta-ancho">
        {/* Mitad IZQUIERDA (la foto). Lleva su PROPIA superficie de ticket
            (fondo + radio + corte semicircular), del ANCHO COMPLETO del
            ticket (w-72) pero recortada por el `overflow-hidden` de esta
            columna a solo su tramo. Por eso el corte puede seguir viviendo a
            una posición INTERMEDIA del ancho de la superficie (robusta, ver
            "LA POSICIÓN DEL CORTE" arriba) aunque cada mitad enseñe solo su
            pedazo — partir la superficie en dos de verdad habría puesto el
            corte justo en una ESQUINA de cada trozo, que es exactamente la
            geometría que no se renderiza bien.

            Foto: reemplaza el icono genérico (Clock) de una vuelta anterior —
            el producto real que "se compró". Con su propio "aire" (p-1.5): la
            <img> es más chica que su marco, no a sangre. */}
        <div ref={imagenRef} className="relative min-h-alerta-alto w-alerta-imagen-ancho shrink-0 overflow-hidden">
          <div aria-hidden className="alerta-venta-superficie absolute inset-y-0 left-0 w-alerta-ancho rounded-card" />
          <div className="relative h-full p-1.5">
            <img
              src={`/fotos/${tour.foto}.webp`}
              alt=""
              aria-hidden="true"
              className="size-full rounded-foto bg-papel-hueso object-cover"
            />
          </div>
        </div>
        {/* Mitad DERECHA (el texto). La MISMA superficie del ancho completo,
            pero anclada a la DERECHA (right-0) — así su tramo visible embaldosa
            con el de la izquierda sin costura ni solape, y las 2 medias lunas
            del corte se juntan formando el agujero entero al reposar.

            La línea punteada de la perforación vive AQUÍ DENTRO, en la
            superficie (el elemento que tiene el mask): así el propio corte la
            recorta en los agujeros, en vez de sobresalir por ellos (pedido de
            Samuel: "que la línea dotted no sobresalga por los agujeros"). */}
        <div ref={infoRef} className="relative flex min-w-0 flex-1 overflow-hidden">
          <div aria-hidden className="alerta-venta-superficie absolute inset-y-0 right-0 w-alerta-ancho rounded-card">
            <div className="absolute inset-y-0 left-alerta-imagen-ancho border-l-2 border-dashed border-linea-fuerte" />
          </div>
          {/* Texto — título de lo que se "compró" (nombre del tour) y cuándo
              (hace cuántos minutos), sin la marca «Dato de ejemplo» de antes. */}
          <div className="relative flex min-w-0 flex-1 items-center gap-1 py-2.5 pl-3.5 pr-1.5">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-navy">{tour.nombre}</p>
              <p className="mt-0.5 text-xs text-navy-soft">{t('Booked')}{' '}{ejemplo.minutos} {t('min ago')}</p>
            </div>
            <button
              type="button"
              onClick={() => desgarrar(() => setCerrado(true))}
              aria-label={t('Dismiss notice')}
              className="shrink-0 rounded-full p-1.5 text-navy-soft transition-colors hover:bg-papel-hueso hover:text-navy"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
