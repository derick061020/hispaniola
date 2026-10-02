import { useEffect, useState } from 'react'
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

// Cerrado una vez, calla dos semanas. Un aviso que vuelve en cada visita deja
// de ser una invitación y pasa a ser un estorbo.
const CLAVE = 'haa_aviso_party_boat_cerrado'
const DIAS_DE_SILENCIO = 14

// Donde NO sale: donde el visitante ya está mirando justo esto, o donde está a
// mitad de otra cosa y cualquier interrupción cuesta dinero.
const RUTAS_CALLADAS = [
  /^\/events/,
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

  useEffect(() => {
    if (callada || fueCerradoHacePoco()) return
    const aparece = window.setTimeout(() => {
      setMontado(true)
      window.requestAnimationFrame(() => setVisible(true))
    }, RETRASO_MS)
    return () => window.clearTimeout(aparece)
  }, [callada])

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
        className={`pointer-events-auto w-full max-w-[46rem] rounded-2xl border border-fiesta-borde
                    bg-fiesta-fondo p-3 shadow-2xl backdrop-blur-sm transition-all duration-500
                    ease-out sm:p-3.5 ${
                      visible
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-[130%] opacity-0'
                    }`}
      >
        <div className="flex items-center gap-3 sm:gap-4">
          {/* La foto ocupa el sitio del icono de la 1ª versión: mismo hueco,
              mismo eje. En móvil NO se esconde — se pidió el mismo diseño en
              los dos, y es lo único que distingue esto de un banner de texto. */}
          <img
            src={FOTO}
            alt={t('A Hispaniola party boat anchored over turquoise water in Punta Cana')}
            loading="lazy"
            decoding="async"
            className="size-14 shrink-0 rounded-xl object-cover sm:size-16"
          />

          <div className="min-w-0 flex-1">
            <p className="text-[0.625rem] font-bold uppercase tracking-[0.12em] text-coral sm:text-[0.6875rem]">
              {t('Party boat · Punta Cana')}
            </p>
            <p className="mt-0.5 font-display text-[0.9375rem] font-bold leading-snug text-fiesta-texto sm:text-base">
              {t('The whole boat. Your crowd. One night they’ll keep bringing up.')}
            </p>
            <p className="mt-0.5 hidden text-[0.8125rem] leading-snug text-fiesta-texto-suave sm:block">
              {t('Private party boat charters: open bar, music, a kitchen cooking on board and a crew that runs the day. 4.9 on TripAdvisor.')}
            </p>
          </div>

          <a
            href={DESTINO}
            // Sale del sitio: pestaña aparte para no tumbar una reserva que el
            // visitante pueda tener a medias. `noopener` es obligatorio con
            // `_blank` — sin él la pestaña nueva puede manipular esta.
            target="_blank"
            rel="noopener noreferrer"
            className="hidden shrink-0 whitespace-nowrap rounded-full bg-coral px-5 py-2.5 text-[0.8125rem]
                       font-semibold text-papel transition-colors hover:bg-coral-dark
                       focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral
                       sm:block"
          >
            {t('See party boats')}
          </a>

          <button
            type="button"
            onClick={cerrar}
            aria-label={t('Dismiss')}
            className="-mr-0.5 shrink-0 self-start rounded-full p-1.5 text-fiesta-texto-suave
                       transition-colors hover:bg-papel/10 hover:text-fiesta-texto
                       focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-papel/40
                       sm:self-center"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* En móvil el botón no cabe en la fila: baja entero debajo, a lo
            ancho, que además es donde el pulgar llega sin estirarse. */}
        <a
          href={DESTINO}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center justify-center rounded-full bg-coral px-4 py-2.5
                     text-[0.8125rem] font-semibold text-papel transition-colors hover:bg-coral-dark
                     focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral
                     sm:hidden"
        >
          {t('See party boats')}
        </a>
      </div>
    </div>
  )
}
