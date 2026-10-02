import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { X } from 'lucide-react'
import { t } from '@/lib/i18n'

// [2026-10-02, Derick: «aplica el estilo de notificación por el 1 o el 11 (…)
// no debe ser un enfoque general, debe estar orientado específicamente al
// concepto Party Boat (…) incluir imágenes que representen la experiencia, el
// ambiente, la diversión y el tipo de público que queremos atraer»]
//
// Segunda versión. La primera (01/10) era un aviso genérico de texto, sin foto
// y centrado abajo — tapaba las tarjetas de tours y se retiró el mismo día.
// Esta corrige las dos cosas:
//
//   · Va al RINCÓN, no en medio. Abajo a la derecha en escritorio, donde no
//     hay contenido que tapar; en móvil ocupa el ancho porque no hay rincón.
//   · Lleva la foto. Un party boat no se vende con un párrafo: se vende
//     enseñando la cubierta llena de gente pasándolo bien, que es exactamente
//     el público que se quiere atraer.
//
// La foto es `ev-partyboat-1`, la que eligió Derick («el 1 o el 11»): el grupo
// entero en las redes del catamarán. La 11 es el barco desde el aire —más
// bonita, pero no enseña a nadie—, y aquí lo que tiene que entrar por los ojos
// es el ambiente.
//
// El copy dice PARTY BOAT con todas las letras y no se anda con rodeos; lo
// único que afirma —4.9 en TripAdvisor— ya está publicado en las dos webs.
// Nada inventado: lo que se promete aquí acaba en una reserva de verdad.

const DESTINO = 'https://hispaniolapartyboat.com/'
const FOTO = '/fotos/ev-partyboat-1.webp'

// Asoma a los 5 segundos. No al entrar: quien acaba de llegar está leyendo el
// hero, y un cartel que aparece encima a los 300 ms se cierra sin mirarlo.
const RETRASO_MS = 5000

// Cerrado una vez, calla dos semanas. Un aviso que vuelve en cada visita deja
// de ser una invitación y pasa a ser un estorbo.
const CLAVE = 'haa_aviso_party_boat_cerrado'
const DIAS_DE_SILENCIO = 14

// Donde NO sale: donde el visitante ya está mirando justo esto, o donde está
// a mitad de otra cosa y cualquier interrupción cuesta dinero.
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
      // El contenedor no intercepta clics: solo la tarjeta. Si no, una franja
      // invisible se comería los clics de lo que hay debajo.
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex justify-center p-3 sm:inset-x-auto sm:right-5 sm:bottom-5 sm:p-0"
      role="complementary"
      aria-label={t('Party boat in Punta Cana')}
    >
      <div
        className={`pointer-events-auto w-full overflow-hidden rounded-2xl border border-fiesta-borde
                    bg-fiesta-fondo shadow-2xl backdrop-blur-sm transition-all duration-500 ease-out
                    sm:w-[25rem] ${
                      visible
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-[130%] opacity-0'
                    }`}
      >
        <div className="relative">
          {/* La foto a sangre, en formato ancho: se ve la cubierta llena sin
              robarle sitio al texto. `object-center` deja el grupo centrado al
              recortar. */}
          <img
            src={FOTO}
            alt={t('Guests celebrating on board a Hispaniola party boat in Punta Cana')}
            loading="lazy"
            decoding="async"
            className="h-32 w-full object-cover object-center sm:h-36"
          />
          {/* Degradado hacia el fondo de la tarjeta: la foto no termina en un
              corte seco, y el texto de debajo arranca sobre negro limpio. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-fiesta-fondo to-transparent"
          />
          <button
            type="button"
            onClick={cerrar}
            aria-label={t('Dismiss')}
            className="absolute right-2 top-2 rounded-full bg-fiesta-fondo/70 p-1.5 text-fiesta-texto
                       backdrop-blur-sm transition-colors hover:bg-fiesta-fondo
                       focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-papel/50"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="px-4 pb-4 pt-1 sm:px-5 sm:pb-5">
          <p className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-coral">
            {t('Party boat · Punta Cana')}
          </p>

          <p className="mt-1.5 font-display text-[1.0625rem] font-bold leading-snug text-fiesta-texto">
            {t('The whole boat. Your crowd. One night they’ll keep bringing up.')}
          </p>

          <p className="mt-1.5 text-[0.8125rem] leading-snug text-fiesta-texto-suave">
            {t('Private party boat charters: open bar, music, a kitchen cooking on board and a crew that runs the day. 4.9 on TripAdvisor.')}
          </p>

          <a
            href={DESTINO}
            // Sale del sitio: pestaña aparte para no tumbar una reserva que el
            // visitante pueda tener a medias. `noopener` es obligatorio con
            // `_blank` — sin él la pestaña nueva puede manipular esta.
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3.5 flex w-full items-center justify-center rounded-full bg-coral px-4 py-2.5
                       text-[0.8125rem] font-semibold text-papel transition-colors hover:bg-coral-dark
                       focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral"
          >
            {t('See our party boats')}
          </a>
        </div>
      </div>
    </div>
  )
}
