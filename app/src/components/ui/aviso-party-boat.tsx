import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { X } from 'lucide-react'
import { t } from '@/lib/i18n'

// [2026-10-02, Derick: «déjalo igual al diseño que tiene en la imagen, como
// está, tanto en pc como en móvil; además déjalo con una imagen más parecida»]
//
// Tercera versión, y la que queda. Historia corta, porque explica cada
// decisión:
//
//   1ª (01/10) — barra horizontal centrada abajo, con un emoji por icono. El
//      diseño gustó; lo que no, que tapaba las tarjetas de tours.
//   2ª (02/10) — tarjeta vertical en el rincón, con la foto del grupo arriba.
//      Resolvía el tapado pero cambiaba el diseño, y el diseño ya valía.
//   3ª — la barra de la 1ª, tal cual, con la foto EN LUGAR del emoji.
//
// Y la foto es `ev-partyboat-11`, el barco desde el aire sobre el agua
// turquesa: es la «vista similar» que se pidió desde el principio. La del
// grupo (`-1`) enseña al público, pero en una miniatura de 64 px se convierte
// en quince caras diminutas; el barco se reconoce al instante a ese tamaño.
//
// MISMO diseño en móvil: la foto no se esconde. Era lo que se pedía
// explícitamente, y además es lo único que distingue este aviso de un banner
// de texto cualquiera.
//
// El copy dice PARTY BOAT con todas las letras. Lo único que afirma —4.9 en
// TripAdvisor— ya está publicado en las dos webs: lo que se promete aquí
// acaba en una reserva de verdad.

const DESTINO = 'https://hispaniolapartyboat.com/'
const FOTO = '/fotos/ev-partyboat-11.webp'

// Asoma a los 5 segundos. No al entrar: quien acaba de llegar está leyendo el
// hero, y un cartel que aparece encima a los 300 ms se cierra sin mirarlo.
const RETRASO_MS = 5000

// [2026-10-02, Derick: «que aparezca y 5 segundos después desaparezca
// animada»] Y se va sola. Antes se quedaba hasta que alguien la cerraba, que
// en móvil es tapar una franja de pantalla hasta el final de la visita.
// Retirarse sola sale más barato: dice lo que tiene que decir y devuelve el
// sitio.
//
// Se va por el mismo camino por el que vino —la transición de `visible`—, así
// que la salida se ve. Desaparecer de golpe se lee como un fallo de la web.
//
// [2026-10-06, Derick: «tiene que durar 20 segundos en la web»] Cinco segundos
// daban para leer el título y poco más: quien levantaba la vista del hero ya
// no la encontraba. Veinte dan tiempo a leerla y a decidir, y el contador
// sigue parándose con el puntero encima.
const VISIBLE_MS = 20000

// Cerrado una vez, calla dos semanas. Un aviso que vuelve en cada visita deja
// de ser una invitación y pasa a ser un estorbo.
const CLAVE = 'haa_aviso_party_boat_cerrado'
const DIAS_DE_SILENCIO = 14

// Donde NO sale: donde el visitante ya está mirando justo esto, o donde está a
// mitad de otra cosa y cualquier interrupción cuesta dinero.
const RUTAS_CALLADAS = [
  /^\/events/,
  // [2026-10-02] La página combinada ya enseña el party boat en su rejilla
  // de eventos, y en móvil tiene su propia barra fija abajo: el aviso
  // saldría encima de ella.
  /^\/tours-and-events/,
  // [2026-10-07] El museo tiene su propia barra de reserva fija abajo (pedida
  // por Marketing): mismo motivo que la línea de arriba.
  /^\/underwater-museum/,
  /^\/tours\/party-boat/,
  /^\/book\//,
  /^\/my-booking/,
  /^\/account/,
]

function fueCerradoHacePoco(): boolean {
  try {
    const cuando = Number(window.localStorage.getItem(CLAVE))
    if (!cuando) return false
    return Date.now() - cuando < DIAS_DE_SILENCIO * 24 * 60 * 60 * 1000
  } catch {
    // Navegación privada o cookies bloqueadas: se trata como «nunca se cerró».
    return false
  }
}

export function AvisoPartyBoat() {
  const { pathname } = useLocation()
  const callada = RUTAS_CALLADAS.some((r) => r.test(pathname))

  const [montado, setMontado] = useState(false)
  // `visible` dispara la animación: se monta fuera de pantalla y un tick
  // después entra. Sin ese tick el navegador pinta el estado final de una vez
  // y no se ve nada moverse.
  const [visible, setVisible] = useState(false)
  // Puntero encima o foco dentro: el contador de salida se para.
  const [retenido, setRetenido] = useState(false)
  // Sale UNA vez por visita. Sin esto, pasar por /events —donde calla— y
  // volver la haría reaparecer, y un aviso que vuelve es un aviso que molesta.
  const yaSalio = useRef(false)

  useEffect(() => {
    if (callada || yaSalio.current || fueCerradoHacePoco()) return
    const aparece = window.setTimeout(() => {
      yaSalio.current = true
      setMontado(true)
      window.requestAnimationFrame(() => setVisible(true))
    }, RETRASO_MS)
    return () => window.clearTimeout(aparece)
  }, [callada])

  // Se retira sola a los VISIBLE_MS. `retenido` congela la cuenta: si alguien
  // está leyéndola o llevando el ratón hacia el botón, quitársela de debajo es
  // lo peor que puede hacer un aviso — y encima se lleva por delante el clic.
  // Al soltar vuelve a contar de cero: acaban de terminar de leer.
  //
  // NO escribe la marca de «cerrado»: irse sola no es que la hayan cerrado.
  // Los catorce días de silencio se los gana solo la ✕, que sí es una
  // respuesta de la persona.
  useEffect(() => {
    if (!visible || retenido) return
    const seVa = window.setTimeout(() => {
      setVisible(false)
      window.setTimeout(() => setMontado(false), 450)
    }, VISIBLE_MS)
    return () => window.clearTimeout(seVa)
  }, [visible, retenido])

  if (!montado || callada) return null

  const cerrar = () => {
    setVisible(false)
    try {
      window.localStorage.setItem(CLAVE, String(Date.now()))
    } catch {
      /* sin almacenamiento, se cierra solo para esta visita */
    }
    // Se desmonta DESPUÉS de la transición, para que se vea salir.
    window.setTimeout(() => setMontado(false), 450)
  }

  return (
    <div
      // El contenedor no intercepta clics: solo la barra. Si no, una franja
      // invisible se comería los clics de lo que hay debajo.
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex justify-center p-3 sm:p-4"
      role="complementary"
      aria-label={t('Party boat in Punta Cana')}
    >
      <div
        // El contador se para con el puntero encima y con el foco dentro: a
        // teclado se llega por tabulación, y que se esfume justo al llegar al
        // enlace lo dejaría inalcanzable.
        onPointerEnter={() => setRetenido(true)}
        onPointerLeave={() => setRetenido(false)}
        onFocusCapture={() => setRetenido(true)}
        onBlurCapture={() => setRetenido(false)}
        className={`pointer-events-auto w-full max-w-[40rem] overflow-hidden rounded-2xl
                    border border-fiesta-borde bg-fiesta-fondo shadow-2xl backdrop-blur-sm
                    transition-all duration-500 ease-out ${
                      visible
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-[130%] opacity-0'
                    }`}
      >
        {/* `items-stretch`: es lo que hace que la foto llegue de borde a borde
            por arriba y por abajo. Con `items-center` se quedaria flotando en
            medio con aire alrededor, que es justo lo que no se queria. */}
        <div className="relative flex items-stretch">
          {/* La foto A SANGRE: sin bordes propios ni margen. Las esquinas
              redondas se las da el `overflow-hidden` de la tarjeta, asi que
              encaja con ella en vez de ser un cuadrito pegado encima.
              35 % del ancho, con tope para que en pantallas anchas no se coma
              el espacio del texto. */}
          {/* La foto va DENTRO de un hueco sin alto propio, y ella se
              posiciona absoluta. Si estuviera suelta en la fila, su proporcion
              natural mandaria: a 208 px de ancho pedia 141 de alto y estiraba
              la tarjeta muy por encima del texto. Asi el alto lo pone el texto
              —como en el diseno— y la foto recorta para llenarlo. */}
          <div className="relative w-[35%] max-w-[13rem] shrink-0">
            <img
              src={FOTO}
              alt={t('A Hispaniola party boat anchored over turquoise water in Punta Cana')}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full object-cover"
            />
          </div>

          {/* [2026-10-02] En movil NO cabe todo en una fila: con la foto
              ocupando el 35 %, al texto le quedan ~200 px y el titulo partia en
              tres lineas con el subtitulo cortado a «Musica, barra…». Asi que
              en movil se apila (titulo, linea, boton) y la fila del diseno
              original vuelve desde `sm`, que es donde hay sitio de sobra. */}
          <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 py-2.5 pl-3 pr-8
                          sm:flex-row sm:items-center sm:gap-3 sm:py-3 sm:pl-4 sm:pr-9">
            <div className="min-w-0 flex-1">
              <p className="font-display text-[0.875rem] font-bold leading-tight text-fiesta-texto sm:text-[0.9375rem]">
                {t('Party Boat in Punta Cana')}
              </p>
              {/* UNA linea, y corta. Es un aviso, no un folleto: si hay que
                  leerlo dos veces, se cierra sin leerlo ninguna. */}
              <p className="mt-0.5 line-clamp-2 text-[0.75rem] leading-snug text-fiesta-texto-suave sm:text-[0.8125rem]">
                {t('Music, open bar and the whole boat for you.')}
              </p>
            </div>

            <a
              href={DESTINO}
              // Sale del sitio: pestana aparte para no tumbar una reserva que
              // el visitante pueda tener a medias. `noopener` es obligatorio
              // con `_blank` — sin el la pestana nueva puede manipular esta.
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 self-start whitespace-nowrap rounded-full bg-coral px-3 py-1.5 text-[0.75rem]
                         font-semibold text-papel transition-colors hover:bg-coral-dark
                         focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral
                         sm:self-auto sm:px-4 sm:py-2.5 sm:text-[0.8125rem]"
            >
              {t('See the experience')}
            </a>
          </div>

          {/* La ✕ sale del flujo y se ancla a la esquina: en la fila de `sm`
              ocupaba sitio del texto, y apilada en movil no tenia donde ir. El
              `pr-8`/`pr-9` del bloque de texto le reserva el hueco. */}
          <button
            type="button"
            onClick={cerrar}
            aria-label={t('Dismiss')}
            className="absolute right-1.5 top-1.5 rounded-full p-1 text-fiesta-texto-suave transition-colors
                       hover:bg-papel/10 hover:text-fiesta-texto
                       focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-papel/40
                       sm:right-2 sm:top-2"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
