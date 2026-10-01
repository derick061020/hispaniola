import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { PartyPopper, X } from 'lucide-react'
import { t } from '@/lib/i18n'

// [2026-10-01, Derick: «quiero que en la web de Hispaniola agregues una
// notificación inferior; entras a la web y entra desplazándose, para que si un
// cliente quiere un evento más de fiesta o diversión vaya ahí»]
//
// Es un PUENTE a hispaniolapartyboat.com, que es la misma casa: los mismos
// barcos, la misma tripulación y la misma cocina, vendiendo el charter privado
// de fiesta. Quien entra aquí buscando una despedida de soltera, un cumpleaños
// o un día con el grupo no tiene por qué adivinar que esa web existe.
//
// El copy sale de lo que esa web dice de sí misma, no de lo que a mí me suene
// bien: «the whole deck is yours», cocina a bordo, barra abierta, tripulación
// propia. Nada inventado — es la regla del proyecto y aquí además sería un
// problema, porque lo que se promete acaba en una reserva de verdad.

const DESTINO = 'https://hispaniolapartyboat.com/'

// Cuánto tarda en asomar. No sale de golpe: quien acaba de llegar está
// leyendo el hero, y un cartel que aparece encima a los 300 ms se cierra sin
// leerlo. Cuatro segundos es tiempo de haber mirado la portada.
const RETRASO_MS = 4000

// Una vez cerrado, no vuelve a aparecer en dos semanas. Un aviso que reaparece
// en cada visita deja de ser una invitación y pasa a ser un estorbo.
const CLAVE = 'haa_aviso_party_boat_cerrado'
const DIAS_DE_SILENCIO = 14

// Dónde NO aparece: en las páginas donde el visitante YA está mirando justo
// eso. Ofrecerle el party boat a quien tiene abierta la ficha del party boat
// es ruido, y encima tapa el botón de reservar.
const RUTAS_CALLADAS = [/^\/events/, /^\/tours\/party-boat/, /^\/book\//, /^\/my-booking/, /^\/account/]

function fueCerradoHacePoco(): boolean {
  try {
    const cuando = Number(window.localStorage.getItem(CLAVE))
    if (!cuando) return false
    return Date.now() - cuando < DIAS_DE_SILENCIO * 24 * 60 * 60 * 1000
  } catch {
    // Navegación privada o cookies bloqueadas: se trata como "nunca se cerró".
    return false
  }
}

export function AvisoPartyBoat() {
  const { pathname } = useLocation()
  const callada = RUTAS_CALLADAS.some((r) => r.test(pathname))

  const [montado, setMontado] = useState(false)
  // `visible` es lo que dispara la animación: se monta fuera de pantalla y un
  // tick después se sube. Sin ese tick el navegador pinta el estado final
  // directamente y no se ve entrar nada.
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
    // Se desmonta DESPUÉS de la transición, para que se vea bajar.
    window.setTimeout(() => setMontado(false), 400)
  }

  return (
    <div
      // `pointer-events-none` en el contenedor y `auto` en la tarjeta: la
      // franja ocupa todo el ancho para centrar, pero no debe robar clics a lo
      // que hay debajo fuera de la tarjeta.
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex justify-center p-3 sm:p-4"
      // El aviso no interrumpe: se anuncia sin robar el foco ni la lectura.
      role="complementary"
      aria-label={t('Looking for a party boat?')}
    >
      <div
        className={`pointer-events-auto w-full max-w-[42rem] rounded-2xl border border-fiesta-borde bg-fiesta-fondo
                    px-4 py-3.5 shadow-2xl backdrop-blur-sm transition-all duration-500 ease-out
                    sm:px-5 sm:py-4 ${
                      visible ? 'translate-y-0 opacity-100' : 'translate-y-[120%] opacity-0'
                    }`}
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <span
            aria-hidden="true"
            className="hidden size-11 shrink-0 place-items-center rounded-full bg-coral/15 text-coral sm:grid"
          >
            <PartyPopper className="size-5" />
          </span>

          <div className="min-w-0 flex-1">
            <p className="text-[0.9375rem] font-semibold leading-snug text-fiesta-texto">
              {t('Celebrating something? Take the whole boat.')}
            </p>
            <p className="mt-0.5 text-[0.8125rem] leading-snug text-fiesta-texto-suave">
              {t('Private party charters in Punta Cana — the deck is only yours, the kitchen cooks on board and the bar never stops.')}
            </p>
          </div>

          <a
            href={DESTINO}
            // Sale del sitio: se abre aparte para no perder la reserva que el
            // visitante pueda tener a medias. `noopener` es obligatorio con
            // `_blank` — sin él la pestaña nueva puede manipular esta.
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 whitespace-nowrap rounded-full bg-coral px-4 py-2.5 text-[0.8125rem]
                       font-semibold text-papel transition-colors hover:bg-coral-dark
                       focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral
                       sm:px-5"
          >
            {t('See party boats')}
          </a>

          <button
            type="button"
            onClick={cerrar}
            aria-label={t('Dismiss')}
            className="-mr-1 shrink-0 rounded-full p-1.5 text-fiesta-texto-suave transition-colors
                       hover:bg-papel/10 hover:text-fiesta-texto
                       focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-papel/40"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
