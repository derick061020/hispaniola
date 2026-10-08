import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { X } from 'lucide-react'
import { t } from '@/lib/i18n'

// EL OJO DE BUEY — el aviso del Museo Subacuático.
//
// [2026-10-08, Derick, sobre el ejemplo interactivo que mandó Marketing: «la
// opción es la B» y «la duración del ícono debe ser de 30 segundos, no más».]
//
// Portado del entregable `Museo-Popup.zip` (HTML + CSS + JS planos) a React,
// con el mismo diseño: tarjeta blanca con borde cian arriba a la derecha, la
// foto en círculo como un ojo de buey, y una barra de progreso que, al
// acabarse, encoge la tarjeta hasta convertirla en el ojo de buey pequeño con
// su etiqueta «NEW».
//
// DE LAS DOS VARIANTES DE TEXTO SE QUEDA LA B. La A era descriptiva («A reef
// that began as a sculpture») y la B es la cuenta atrás, corta: «Opens in N
// days». Gana la que da una razón para volver — una frase bonita no tiene
// fecha, y un número que baja, sí.
//
// LAS REGLAS DE GOOGLE, QUE SON LAS QUE DICTAN EL DISEÑO: sin velo, sin
// bloquear el scroll, nunca al cargar, una vez por visita y en posición fija
// para no mover el contenido (cero CLS). En móvil ocupa cerca del 10 % de la
// pantalla, por debajo del 15 % que Google tolera en un intersticial.

const DESTINO = '/underwater-museum'
const FOTO = '/fotos/museo-figura-superficie.webp'

// ⚠️ LA FECHA DE APERTURA, PENDIENTE DE CONFIRMAR.
//
// Es la única cosa que el entregable dejó abierta («Pendiente: confirmar la
// fecha real de apertura», LEEME.txt) y es de la que sale el texto entero del
// aviso. Con una fecha equivocada el aviso miente con una precisión
// incómoda: dice «Opens in 9 days» y la gente lo apunta.
//
// Cuando la fecha pase, el aviso deja de salir solo (`dias <= 0`): no hay que
// acordarse de quitarlo, pero sí de cambiarlo por otro si el museo ya abrió.
const APERTURA = new Date('2026-10-31T00:00:00-04:00')

// Asoma a los 6 segundos, o en cuanto se lleva un 35 % de la página — lo que
// pase antes. Quien acaba de llegar está leyendo el hero.
const RETRASO_MS = 6000
const SCROLL_MINIMO = 0.35

// La tarjeta se lee en tres segundos: son cuatro líneas y un enlace.
const TARJETA_MS = 3000

// [2026-10-08, Derick: «la duración del ícono debe ser de 30 segundos, no
// más»] El ojo de buey pequeño se quedaba para siempre una vez encogido. Un
// icono fijo en la esquina durante toda la visita deja de ser un aviso y pasa
// a ser parte del decorado — y encima tapa esquina en móvil. Treinta segundos
// dan de sobra para volver a él si la tarjeta se leyó de refilón.
const ICONO_MS = 30000

// Una vez por visita, como el ejemplo. `sessionStorage` y no `localStorage` a
// propósito: esto es una apertura con cuenta atrás, así que mañana SÍ quiere
// volver a verse.
const CLAVE = 'haa_aviso_museo'

// Donde NO sale: donde ya está mirando el museo, o donde está pagando.
const RUTAS_CALLADAS = [
  /^\/underwater-museum/,
  /^\/book\//,
  /^\/my-booking/,
  /^\/account/,
]

function yaSeVioEstaVisita(): boolean {
  try {
    return Boolean(window.sessionStorage.getItem(CLAVE))
  } catch {
    // Navegación privada o almacenamiento bloqueado: se trata como «no visto».
    return false
  }
}

function diasParaAbrir(): number {
  return Math.ceil((APERTURA.getTime() - Date.now()) / 86_400_000)
}

export function AvisoMuseo() {
  const { pathname } = useLocation()
  const callada = RUTAS_CALLADAS.some((r) => r.test(pathname))
  const dias = diasParaAbrir()

  const [fase, setFase] = useState<'fuera' | 'tarjeta' | 'icono' | 'ido'>('fuera')
  // Puntero encima: la barra se para. Si alguien está leyendo, encogerle la
  // tarjeta es quitarle el enlace de debajo del ratón.
  const [retenido, setRetenido] = useState(false)
  const yaSalio = useRef(false)

  // ---- Aparecer: a los 6 s o al 35 % de scroll, lo que llegue antes -------
  useEffect(() => {
    if (callada || dias <= 0 || yaSalio.current || yaSeVioEstaVisita()) return

    const salir = () => {
      if (yaSalio.current) return
      yaSalio.current = true
      try {
        window.sessionStorage.setItem(CLAVE, '1')
      } catch {
        /* sin almacenamiento, solo se controla dentro de esta carga */
      }
      setFase('tarjeta')
    }

    const reloj = window.setTimeout(salir, RETRASO_MS)
    const alHacerScroll = () => {
      const alto = document.documentElement.scrollHeight
      if (alto && (window.scrollY + window.innerHeight) / alto > SCROLL_MINIMO) salir()
    }
    window.addEventListener('scroll', alHacerScroll, { passive: true })
    return () => {
      window.clearTimeout(reloj)
      window.removeEventListener('scroll', alHacerScroll)
    }
  }, [callada, dias])

  // ---- Encogerse a ojo de buey, y después irse del todo ------------------
  useEffect(() => {
    if (fase !== 'tarjeta' || retenido) return
    const encoge = window.setTimeout(() => setFase('icono'), TARJETA_MS)
    return () => window.clearTimeout(encoge)
  }, [fase, retenido])

  useEffect(() => {
    if (fase !== 'icono') return
    const sale = window.setTimeout(() => setFase('ido'), ICONO_MS)
    return () => window.clearTimeout(sale)
  }, [fase])

  if (fase === 'fuera' || fase === 'ido' || callada || dias <= 0) return null

  const esTarjeta = fase === 'tarjeta'
  const cuentaAtras =
    dias === 1 ? t('Opens tomorrow') : `${t('Opens in')} ${dias} ${t('days')}`

  return (
    <div
      role="complementary"
      aria-label={t('Underwater Museum')}
      className="fixed right-4 top-[78px] z-[55] w-auto sm:right-11 sm:top-28 sm:w-[350px]"
      style={{ left: undefined }}
    >
      {/* LA TARJETA. Se hunde hacia su propia esquina al encogerse
          (`transform-origin` arriba a la derecha), que es de donde sale el ojo
          de buey: así el movimiento cuenta que una cosa se convierte en la
          otra, en vez de que una desaparezca y otra aparezca. */}
      <div
        onMouseEnter={() => setRetenido(true)}
        onMouseLeave={() => setRetenido(false)}
        onFocusCapture={() => setRetenido(true)}
        onBlurCapture={() => setRetenido(false)}
        className={[
          'relative flex items-center gap-3.5 overflow-hidden rounded-[22px] bg-white p-3.5 pb-[18px] pr-9',
          'origin-top-right shadow-[0_18px_40px_-12px_rgba(11,37,69,.45)]',
          'transition-[transform,opacity] duration-700 ease-[cubic-bezier(.2,.9,.25,1.1)]',
          'motion-reduce:transition-none',
          esTarjeta
            ? 'translate-x-0 scale-100 opacity-100'
            : 'pointer-events-none scale-[.15] opacity-0',
        ].join(' ')}
      >
        <div
          aria-hidden="true"
          className="size-[86px] flex-none rounded-full border-[3px] border-[var(--color-aqua-claro)] bg-[#12507a] bg-cover shadow-[0_0_0_3px_#fff_inset]"
          style={{ backgroundImage: `url(${FOTO})`, backgroundPosition: '42% 50%' }}
        />

        <div>
          <p className="mb-0.5 text-[10.5px] font-semibold uppercase tracking-[.09em] text-coral">
            {t('New')}
          </p>
          <p className="font-display text-[17px] font-bold leading-tight text-navy">
            {t('Underwater Museum')}
          </p>
          <p className="mb-2 mt-[3px] text-[12.5px] text-navy-sub">{cuentaAtras}</p>
          <Link
            to={DESTINO}
            className="border-b-[1.5px] border-[var(--color-aqua-claro)] text-[12.5px] font-semibold text-navy"
          >
            {t('See it')} &rarr;
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setFase('icono')}
          aria-label={t('Dismiss')}
          className="absolute right-2.5 top-2 rounded-full p-1 text-navy-soft transition-colors hover:text-navy"
        >
          <X className="size-3.5" aria-hidden="true" />
        </button>

        {/* La barra dice cuánto queda. Es lo que convierte el encogimiento en
            algo anunciado y no en un salto. Se para con el puntero encima. */}
        <div className="absolute inset-x-0 bottom-0 h-1 bg-[var(--color-aqua-claro)]/45">
          <i
            className="block h-full bg-navy"
            style={{
              width: esTarjeta && !retenido ? '100%' : '0%',
              transition: retenido
                ? 'none'
                : `width ${TARJETA_MS}ms linear`,
            }}
          />
        </div>
      </div>

      {/* EL OJO DE BUEY. Vive 30 segundos y se va. */}
      <Link
        to={DESTINO}
        aria-label={t('Underwater Museum')}
        aria-hidden={esTarjeta}
        tabIndex={esTarjeta ? -1 : 0}
        className={[
          'absolute right-0 top-0 size-[62px] rounded-full border-[3px] border-[var(--color-aqua-claro)] bg-[#12507a] bg-cover',
          'shadow-[0_8px_20px_-6px_rgba(11,37,69,.6),0_0_0_3px_#fff_inset]',
          'transition-[transform,opacity] duration-500 ease-[cubic-bezier(.2,.9,.25,1.3)]',
          'motion-reduce:transition-none',
          esTarjeta ? 'pointer-events-none scale-[.4] opacity-0' : 'scale-100 opacity-100',
        ].join(' ')}
        style={{ backgroundImage: `url(${FOTO})`, backgroundPosition: '42% 50%' }}
      >
        <em className="absolute -left-2 -top-1.5 rounded-full bg-coral px-[7px] py-0.5 text-[10px] font-bold not-italic text-white">
          {t('NEW')}
        </em>
      </Link>
    </div>
  )
}
