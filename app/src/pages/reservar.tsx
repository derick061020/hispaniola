import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Check } from 'lucide-react'
import * as FancyButton from '@/components/alignui/fancy-button'
import { Logo } from '@/components/ui/logo'
import { Meta } from '@/components/seo/meta'
import { PasoMenu } from '@/components/reservar/paso-menu'
import { PasoRecogida } from '@/components/reservar/paso-recogida'
import { BannerPremium } from '@/components/reservar/banner-premium'
import { PasoContacto } from '@/components/reservar/paso-contacto'
import { idiomaDelNavegador } from '@/lib/idioma'
import { PasoPago, type DatosPago } from '@/components/reservar/paso-pago'
import { ResumenReserva } from '@/components/reservar/resumen-reserva'
import { BarraMovilReserva } from '@/components/reservar/barra-movil-reserva'
import { etiquetaOcasion, telefonoDe, PREFIJO_INICIAL, type DatosCelebracion, type DatosContacto, type DatosRecogida, type Paquete } from '@/components/reservar/tipos'
import { maxPersonasDe } from '@/components/tour/widget-reserva'
import { formatoDinero, TOURS, type Tour } from '@/data/home'
import { TOURS_EVENTO, FICHAS_EVENTO } from '@/lib/eventos-reservables'
import { FICHAS, type FichaTour } from '@/data/tours'
import { guardarReserva, type Reserva } from '@/lib/reservas'
import { menuDeLaReserva } from '@/lib/menu-reserva'
import { useCheckout } from '@/lib/api/use-checkout'
import type { ErrorApi } from '@/lib/api/cliente'
import { cargarStripe, mensajeDeError } from '@/lib/pagos/stripe'
import { t, tp, traducible } from '@/lib/i18n'
import { escuchaMoneda, instantaneaMoneda } from '@/lib/moneda'
import { SelectorIdioma } from '@/components/ui/selector-idioma'
import { SelectorMoneda } from '@/components/ui/selector-moneda'

// Funnel de reserva (/reservar/:slug, Fase C). El widget de la ficha es el
// CONFIGURADOR (paquete · fecha · hora · personas); «Continuar» abre aquí, con
// esa config en la URL. La FRONTERA del build es el depósito: el motor de
// reservas (xpotours) sigue pendiente de decisión del cliente, así que se
// construye como PROTOTIPO de UX y el «pagar» no cobra (lo dice el paso 4).
//
// LAYOUT estilo Viator (2026-07-17, pedido de Samuel): 2 zonas — a la IZQUIERDA
// (blanca) las secciones que se rellenan en acordeón (la activa expandida, las
// hechas colapsadas con resumen + «Editar», las pendientes en gris; SeccionPaso
// abajo), a la DERECHA la tarjeta «qué estás comprando». TODA la zona derecha es
// GRIS a sangre hasta el borde del viewport y a altura completa (no solo un box
// alrededor de la card) — ver el ::after de la celda derecha. Header MÍNIMO (solo
// logo + selector de moneda, sin Header/megamenú del sitio ni topbar de
// contacto/idioma — todo eso invita a salir a mitad de un checkout). Lo que NO se
// copia de Viator: su urgencia inventada (contador de plaza, «reservado 5+
// veces»), prohibida por revision-wireframes.md §2.7. `noindex`.

// Orden de las secciones (2026-07-17, Samuel): contacto primero, luego el menú.
//
// [2026-08-07] Las secciones dejan de ser una lista fija de 4 y el paso activo
// deja de ser un ÍNDICE: ahora es un id. El motivo es que «Your menu» ya no
// existe en todos los tours (ver lib/menu-reserva.ts — Saona sirve buffet y el
// charter pasa a buffet de pinchos a partir de 21 personas), y en el charter
// puede APARECER Y DESAPARECER sin recargar, porque el nº de personas se edita
// en la tarjeta de al lado. Con índices, subir de 20 a 21 personas movía el
// flujo al paso equivocado; con ids, la numeración se recalcula sola.
type PasoId = 'contacto' | 'menu' | 'recogida' | 'pago'
const TITULOS: Record<PasoId, string> = traducible({
  contacto: 'Contact',
  menu: 'Your menu',
  recogida: 'Pickup',
  pago: 'Payment',
})

export function ReservarPage() {
  const { slug } = useParams()
  const [params, setParams] = useSearchParams()
  // [2026-08-26] Cambiar de moneda aquí repinta ESTA página y nada más. El
  // proveedor remonta el árbol entero cuando cambia la divisa (ver
  // `lib/proveedor-moneda.tsx`) y en mitad del checkout eso borraría el
  // formulario: fecha, personas, platos y contacto. Como aquí ningún importe
  // vive dentro de un `useMemo` —se formatean en cada render—, basta con
  // suscribirse y volver a pintar.
  useSyncExternalStore(escuchaMoneda, instantaneaMoneda, () => 'USD|0')
  // [2026-08-25] Party boat y bodas también se reservan aquí. Viven en su
  // propio registro (`data/eventos-reservables.ts`) y no en `TOURS`, que es el
  // catálogo de los cuatro tours y alimenta el grid, el megamenú y el sitemap.
  const tour =
    TOURS.find((candidato) => candidato.slug === slug) ??
    TOURS_EVENTO.find((candidato) => candidato.slug === slug)
  const ficha = slug ? FICHAS[slug] ?? FICHAS_EVENTO[slug] : undefined

  // El funnel solo existe para tours 'completo' (se venden por fecha+paquete).
  // Charter cotiza y Saona consulta → de vuelta a su ficha (o a la home).
  if (!tour || !ficha || tour.booking !== 'completo' || tour.precioLight === null) {
    return <Navigate to={slug ? `/tours/${slug}` : '/'} replace />
  }

  // Config que trae el widget en la URL; defaults sensatos si se entra directo.
  // Desde 2026-08-07 fecha y personas se pueden cambiar dentro del funnel
  // (ResumenReserva), sin volver a la ficha.
  //
  // [2026-08-25] Y desde hoy la URL NO es solo el valor inicial: es la
  // configuracion viva. Lo que se cambia aqui dentro se escribe de vuelta
  // (`onConfigurar`), porque el pedido retomado de una visita anterior se
  // corrige contra ella (`use-checkout.ts`). Lo que la pantalla pinta y lo que
  // Odoo cobra tienen que salir de la misma fuente, y esa fuente es la URL.
  const paquete: Paquete = params.get('paquete') === 'premium' ? 'premium' : 'light'
  const horarioIdx = Number(params.get('horario')) || 0
  const fechaISO = params.get('fecha')
  // [2026-08-10, conexión con Odoo] El widget manda `adultos`/`ninos`/`bebes`
  // en la URL desde la v3 y este funnel los IGNORABA: solo leía `personas`.
  // Resultado documentado en el README: los bebés que la tripulación necesita
  // para los chalecos no se guardaban en ningún sitio, y en Snorkel Lovers
  // (tarifa dual adulto 114 / niño 65) se cobraba todo a precio de adulto.
  // Ahora el desglose viaja entero al CRM y es Odoo quien pone el precio.
  const adultosUrl = Number(params.get('adultos')) || 0
  const ninosUrl = Number(params.get('ninos')) || 0
  const bebesUrl = Number(params.get('bebes')) || 0
  // La SUB-VARIANTE (el bote, en Saona y en el charter). El widget la manda
  // desde siempre; hasta hoy el funnel la ignoraba. Ahora hace falta: es lo que
  // decide qué carta del charter se come (3 h, 4 h o buffet de pinchos).
  const variante = params.get('variante')
  // [2026-08-18] Extras elegidos en la ficha (álbum, langosta). Llegan como
  // lista separada por comas y viajan al pedido desde el primer momento: son
  // parte del precio, así que si no llegan, la ficha y el checkout dicen
  // números distintos. Odoo los valida contra los que ofrece ESE barco.
  const addons = (params.get('addons') ?? '').split(',').filter(Boolean)
  // Mismo tope que el stepper del widget de la ficha, con la misma fórmula
  // (maxPersonasDe): antes aquí había una copia que topaba en 6 salvo tarifa
  // dual, así que un charter de 30 personas entraba al checkout como uno de 6.
  const maxPersonas = maxPersonasDe(tour, ficha)
  const personas = Math.min(Math.max(Number(params.get('personas')) || 2, 1), maxPersonas)

  return (
    <FlujoReserva
      tour={tour}
      ficha={ficha}
      precioLight={tour.precioLight}
      paqueteInicial={paquete}
      varianteInicial={variante}
      personasIniciales={personas}
      maxPersonas={maxPersonas}
      horarioInicial={horarioIdx}
      fechaInicialISO={fechaISO}
      addonsIniciales={addons}
      // [2026-08-25] TODO lo que se cambia dentro del funnel vuelve a la URL.
      // La URL dejo de ser «el valor inicial» para ser la configuracion viva:
      // es de donde se leen paquete, fecha, horario y personas al montar, y
      // desde hoy tambien lo que corrige un pedido retomado que no coincida
      // (`use-checkout.ts`). Si no se escribiera aqui, recargar despues de
      // cambiar la fecha la devolveria a la de la ficha.
      onConfigurar={(cambios) => {
        const siguiente = new URLSearchParams(params)
        for (const [clave, valor] of Object.entries(cambios)) {
          if (valor === null) siguiente.delete(clave)
          else siguiente.set(clave, String(valor))
        }
        setParams(siguiente, { replace: true })
      }}
      // Si el widget no mandó desglose (el caso normal, tarifa única), todas
      // las personas son adultos: es lo que este funnel ha asumido siempre.
      adultosIniciales={adultosUrl || personas}
      ninosIniciales={ninosUrl}
      bebesIniciales={bebesUrl}
    />
  )
}

// El estado del flujo vive aquí (no en ReservarPage) para que sus hooks nunca
// queden detrás del early-return del guard: ReservarPage garantiza tour/ficha
// válidos antes de montar este componente.
function FlujoReserva({
  tour,
  ficha,
  precioLight,
  paqueteInicial,
  varianteInicial,
  personasIniciales,
  maxPersonas,
  horarioInicial,
  fechaInicialISO,
  adultosIniciales,
  ninosIniciales,
  bebesIniciales,
  addonsIniciales,
  onConfigurar,
}: {
  tour: Tour
  ficha: FichaTour
  precioLight: number
  paqueteInicial: Paquete
  /** Escribe en la URL lo que se cambia dentro del funnel. `null` borra. */
  onConfigurar: (cambios: Record<string, string | number | null>) => void
  /** Sub-variante (bote) elegida en el widget; null en los tours sin ellas. */
  varianteInicial: string | null
  personasIniciales: number
  maxPersonas: number
  horarioInicial: number
  fechaInicialISO: string | null
  /** Desglose por rol que manda el widget. Solo Snorkel Lovers (tarifa dual)
   *  lo usa de verdad; en el resto, `adultos` es el total. */
  adultosIniciales: number
  ninosIniciales: number
  bebesIniciales: number
  /** Slugs de los extras elegidos en la ficha. */
  addonsIniciales: string[]
}) {
  const navigate = useNavigate()

  const [paso, setPaso] = useState<PasoId>('contacto')
  // El PAQUETE también es estado desde 2026-08-07: el banner de upsell lo cambia
  // sin salir del checkout (antes había que volver a la ficha).
  const [paquete, setPaquete] = useState<Paquete>(paqueteInicial)
  const [horarioIdx, setHorarioIdx] = useState(horarioInicial)
  const horario = ficha.horarios[horarioIdx] ?? ficha.horarios[0]
  // Fecha y personas son ESTADO desde 2026-08-07 (antes: props de solo lectura
  // leídas de la URL). Cambiarlas aquí evita el viaje de vuelta a la ficha —y,
  // en el caso de la fecha, cierra un agujero: entrando directo a /book/:slug
  // se podía completar el flujo entero sin haber elegido día.
  // [2026-08-25] EL GRUPO SE GUARDA POR ROL, no como un número suelto.
  // Snorkel cobra distinto al niño y los bebés no ocupan plaza, así que
  // «personas» no es un dato: es la SUMA de adultos + niños. Guardarlo al
  // revés —un total y un desglose fijo traído de la ficha— es lo que rompía
  // el stepper del resumen: bajar el total no sabía a quién quitar.
  const [adultos, setAdultos] = useState(adultosIniciales)
  const [ninos, setNinos] = useState(ninosIniciales)
  const [bebes, setBebes] = useState(bebesIniciales)
  const personas = adultos + ninos
  const [fechaISO, setFechaISO] = useState<string | null>(fechaInicialISO)
  // Empieza SIN plato elegido (2026-07-17, Samuel): cada persona lo escoge
  // activamente en su card. «Continuar» del paso 1 se habilita al elegir todos.
  const [platos, setPlatos] = useState<string[]>(() => Array.from({ length: personasIniciales }, () => ''))
  const [recogida, setRecogida] = useState<DatosRecogida>({ hotel: '', notas: '' })
  const [contacto, setContacto] = useState<DatosContacto>({
    nombre: '',
    apellidos: '',
    email: '',
    // [2026-08-25] El pais del telefono va aparte del numero: lo que se guarda
    // en la reserva es el compuesto (`telefonoDe`), nunca `contacto.telefono`.
    prefijo: PREFIJO_INICIAL,
    telefono: '',
    // Se propone el idioma del navegador; el cliente lo cambia en el paso de
    // contacto si prefiere otro. Es lo que decide en que lengua le llegan sus
    // correos, no el idioma de esta pantalla.
    idioma: idiomaDelNavegador(),
  })
  const [celebracion, setCelebracion] = useState<DatosCelebracion>({ ocasion: null, nota: '' })

  // ── EL PRECIO YA NO SE CALCULA AQUÍ (2026-08-10, conexión con Odoo) ──────
  //
  // Esta era la línea marcada en rojo en el README:
  //   const total = (precioLight + upgrade) * personas
  // Los cuatro tours son `booking: 'completo'`, así que los cuatro pasaban por
  // ahí, y `precioLight` del charter (75) y de Saona (184) son anclas «desde»,
  // NO tarifas por cabeza. Saona en catamarán con 30 pax: la ficha cobraba
  // US$ 1.950 (tramo de grupo) y este checkout US$ 5.520. El resumen imprimía
  // además la fórmula falsa, y ese número era el que iba a ir a Odoo.
  //
  // La decisión (que el CONTRIBUTING pedía tomar antes del primer endpoint):
  // **el cálculo pasa al backend**. Odoo implementa los cuatro modelos del
  // tarifario y es la única autoridad de precio; el front pinta lo que le
  // devuelve. Así el desvío no puede volver: no hay dos fórmulas que
  // desincronizar, hay una.
  const checkout = useCheckout({
    tour: tour.slug,
    variante: varianteInicial,
    paquete: paqueteInicial,
    pax: { adults: adultosIniciales, children: ninosIniciales, infants: bebesIniciales },
    fecha: fechaInicialISO,
    scheduleIndex: horarioInicial,
    addons: addonsIniciales,
  })

  const upgrade = paquete === 'premium' && ficha.upgradePremium !== null ? ficha.upgradePremium : 0
  // Mientras la primera respuesta viaja, se pinta la estimación local para que
  // el resumen no parpadee en cero. En cuanto Odoo contesta, manda Odoo.
  const estimacionLocal = (precioLight + upgrade) * personas
  const total = checkout.pedido?.amounts.total ?? estimacionLocal
  const deposito = checkout.pedido?.amounts.deposit ?? Math.round(estimacionLocal * 0.25)
  const saldo = checkout.pedido?.amounts.balance ?? total - deposito

  // QUÉ COME ESTE GRUPO. Resuelto en un solo sitio (lib/menu-reserva.ts) a
  // partir del paquete, del bote y del aforo — los tres datos que pueden
  // cambiarlo, y los tres editables sin salir de esta pantalla.
  const menu = menuDeLaReserva({ ficha, paquete, variante: varianteInicial, personas })
  // El paso «Your menu» SOLO existe si hay algo que elegir. Con buffet (Saona,
  // charter de 21+) o con una carta de un plato no se le pide una decisión a
  // quien no tiene ninguna: la comida se enseña en la tarjeta de la derecha.
  const hayPasoMenu = menu?.modo === 'eleccion'
  const pasos: PasoId[] = ['contacto', ...(hayPasoMenu ? (['menu'] as const) : []), 'recogida', 'pago']
  // Si el paso activo deja de existir —subir a 21 personas en el charter quita
  // el del menú— el flujo cae al siguiente que sí existe en vez de quedarse en
  // un acordeón sin ninguna sección abierta.
  const pasoActivo: PasoId = pasos.includes(paso) ? paso : 'recogida'
  const indiceDe = (id: PasoId) => pasos.indexOf(id)
  const siguienteDe = (id: PasoId): PasoId => pasos[indiceDe(id) + 1] ?? 'pago'
  const estadoDe = (id: PasoId): EstadoSeccion => {
    const i = indiceDe(id)
    const activo = indiceDe(pasoActivo)
    return i < activo ? 'done' : i === activo ? 'activo' : 'pendiente'
  }

  // Cambiar el nº de personas re-dimensiona la lista de platos conservando los
  // ya elegidos. Si el grupo CRECE y el paso del menú ya estaba cerrado, el
  // flujo vuelve a él: el comensal nuevo no tiene plato y salir a pagar con un
  // menú incompleto sería una reserva que la cocina no puede preparar.
  /** Cambia el grupo por rol y arrastra todo lo que depende de él. */
  const cambiarGrupo = (parcial: { adultos?: number; ninos?: number; bebes?: number }) => {
    const a = parcial.adultos ?? adultos
    const ni = parcial.ninos ?? ninos
    const be = parcial.bebes ?? bebes
    setAdultos(a)
    setNinos(ni)
    setBebes(be)
    aplicarGrupo(a, ni, be)
  }

  /** El stepper simple de los tours sin tramos de edad: todo son adultos. */
  const cambiarPersonas = (n: number) => {
    setAdultos(n)
    aplicarGrupo(n, ninos, bebes)
  }

  function aplicarGrupo(a: number, ni: number, be: number) {
    const n = a + ni
    setPlatos((prev) => Array.from({ length: n }, (_, i) => prev[i] ?? ''))
    checkout.sincronizar({ pax: { adults: a, children: ni, infants: be } })
    // El desglose entero a la URL: la pantalla lee el total y el pedido lee los
    // tres carriles, y si se separan dejan de contar lo mismo.
    onConfigurar({ personas: n, adultos: a, ninos: ni, bebes: be })
    // Se recalcula con el aforo NUEVO: en el charter, crecer hasta 21 elimina
    // el paso del menú (pasa a buffet), así que devolver el flujo ahí sería
    // mandarlo a una sección que ya no existe.
    const menuNuevo = menuDeLaReserva({ ficha, paquete, variante: varianteInicial, personas: n })
    if (n > personas && menuNuevo?.modo === 'eleccion' && indiceDe(pasoActivo) > indiceDe('menu')) {
      setPaso('menu')
    }
  }

  // Subir a Premium desde el banner. Los platos elegidos se BORRAN porque las
  // dos cartas no comparten platos: conservarlos dejaría en la reserva nombres
  // que ya no existen en el menú que se va a cocinar. No devuelve al paso del
  // menú a la fuerza —desde 2026-08-07 elegir plato es opcional— pero el
  // resumen de ese paso vuelve a decir «Por confirmar» y el aviso del correo
  // sigue en pie, así que el visitante ve que hay algo que puede reelegir.
  const subirAPremium = () => {
    setPaquete('premium')
    setPlatos((prev) => prev.map(() => ''))
    checkout.sincronizar({ package: 'premium', dishes: [] })
    // [2026-08-25] La URL tiene que reflejarlo. Es de donde sale el paquete al
    // montar y, desde hoy, tambien lo que corrige un pedido retomado que no
    // coincida (ver `use-checkout.ts`): si se queda en `light`, recargar la
    // pagina despues de subir a Premium volveria a bajar la reserva a Light.
    // `replace` para no dejar un paso intermedio en el historial.
    onConfigurar({ paquete: 'premium' })
  }

  // "Pagar" (2026-08-10: ya hay backend).
  //
  // El comentario que había aquí anticipaba exactamente esto:
  // «cuando exista backend, este handler será `await api.createReserva(...)` y
  //  la nav se hace con el código que devuelva el server». Es lo que hace.
  //
  // Con un matiz que es EL REQUISITO del proyecto: la reserva no se crea aquí.
  // Ya existe en Odoo desde que se abrió esta pantalla, en estado *Pending*, y
  // este handler solo la cierra. Por eso una reserva que no se termina, o un
  // pago que se rechaza, no desaparecen: quedan registrados como pendientes y
  // el equipo los ve en «Web Orders → Unpaid / abandoned».
  /** Disparador del cobro que publica `PasoPago`. Lo usa la barra móvil. */
  const lanzarPago = useRef<(() => void) | null>(null)
  // [2026-08-31] EL 5% POR PAGAR EN EFECTIVO, ELEGIBLE EN EL CHECKOUT.
  //
  // Derick: «el cash discount tambien en el proceso de checkout... y que se
  // aplique de la misma forma que en odoo». Existia como promesa —el chip de
  // «ahorra hasta 15%» y el bloque «Como pagar menos»— pero no habia forma de
  // elegirlo: `descuentos` era un parametro del cliente de API que nadie
  // rellenaba nunca.
  //
  // El importe NO se calcula aqui: se manda la eleccion al servidor y el se
  // encarga, con la misma cuenta que el CRM (5% sobre el SALDO, no sobre el
  // total, porque el deposito ya entro por tarjeta).
  const [pagaEnEfectivo, setPagaEnEfectivo] = useState(false)
  const [pagando, setPagando] = useState(false)
  const [errorPago, setErrorPago] = useState<string | null>(null)

  // [2026-08-14] AQUÍ SE COBRA DE VERDAD. Lo que había antes creaba el intento
  // de cobro en Stripe y navegaba a «Gracias» sin confirmarlo nunca: el
  // PaymentIntent se quedaba en `requires_payment_method`, o sea que la pantalla
  // decía «reserva confirmada» y no se había movido un dólar. Ahora se replican
  // los dos caminos del checkout de Eclipse (form_checkout.html):
  //
  //   TARJETA → crear intento · confirmarlo con Stripe.js · avisar a Odoo.
  //   PAYPAL  → crear la orden · irse a PayPal. La captura ocurre al volver, en
  //             «Gracias», porque el navegador se va de esta página.
  //
  // El importe no viaja en ningún caso: lo pone el servidor.
  const handlePagar = async (datos: DatosPago) => {
    if (pagando) return
    setPagando(true)
    setErrorPago(null)

    const codigo = checkout.codigo ?? ''
    try {
      // Se ESPERA de verdad: `sincronizar` devuelve promesa desde el 2026-08-18
      // (antes era void y este `await` no esperaba a nada, así que el guardado
      // y el cobro salían a la vez). Odoo cobra con lo que tenga guardado.
      await checkout.sincronizar(datosDelFormulario(), true)

      if (datos.metodo === 'paypal') {
        const intento = await checkout.pagar({ proveedor: 'paypal' })
        if (!intento.approve_url) throw new Error(t('PayPal did not return an approval link.'))
        // La copia local se guarda ANTES de salir del sitio: al volver, la
        // pantalla de gracias pinta al instante mientras se captura el cobro.
        guardarReserva(reservaLocal(codigo))
        window.location.assign(intento.approve_url)
        return
      }

      const intento = await checkout.pagar({ proveedor: 'stripe' })
      if (!intento.client_secret) throw new Error(t('Stripe did not return a payment secret.'))
      if (!datos.tarjeta) throw new Error(t('The card form is not ready. Reload the page and try again.'))

      const stripe = await cargarStripe(intento.publishable_key || datos.clavePublicable)
      const { error, paymentIntent } = await stripe.confirmCardPayment(intento.client_secret, {
        payment_method: {
          card: datos.tarjeta,
          billing_details: {
            name: datos.titular,
            email: contacto.email.trim() || undefined,
            phone: telefonoDe(contacto) || undefined,
          },
        },
      })
      // Tarjeta rechazada: NO es un error de la aplicación. El pedido queda en
      // Odoo como «Payment failed» con el motivo real (lo escribe el webhook) y
      // el visitante puede reintentar con otra tarjeta sin perder nada.
      if (error) throw new Error(mensajeDeError(error))

      // Odoo vuelve a preguntarle a Stripe: no se fía de lo que diga el
      // navegador. Si esto falla, el pago está hecho igual y el webhook lo
      // cerrará — por eso no se trata como un fallo de cobro.
      try {
        await checkout.confirmar({ paymentIntentId: paymentIntent?.id })
      } catch {
        // Sin ruido: el estado real llega por webhook.
      }
    } catch (error) {
      // Falta configurar la pasarela en Odoo (503), el cobro no se pudo iniciar
      // o la tarjeta se rechazó. La reserva SIGUE registrada como pendiente, así
      // que se avisa sin perderla y el equipo puede rematarla por teléfono.
      setErrorPago(error instanceof Error ? error.message : t('Payment could not be started.'))
      setPagando(false)
      return
    }

    guardarReserva(reservaLocal(codigo))
    navigate(`/book/${tour.slug}/thank-you?codigo=${codigo}`)
  }

  /** Todo lo que el visitante ha rellenado, en el formato de la API. */
  const datosDelFormulario = () => ({
    step: 'payment' as const,
    date: fechaISO,
    schedule_index: horarioIdx,
    package: paquete,
    contact: {
      first_name: contacto.nombre.trim(),
      last_name: contacto.apellidos.trim(),
      email: contacto.email.trim(),
      phone: telefonoDe(contacto),
      language: contacto.idioma,
    },
    pickup: { hotel: recogida.hotel.trim(), notes: recogida.notas.trim() },
    dishes: hayPasoMenu ? platos : [],
    addons: addonsIniciales,
    // Lo decide el servidor: aqui solo se dice que el cliente lo eligio.
    discounts: pagaEnEfectivo ? ['efectivo'] : [],
    ...(celebracion.ocasion && celebracion.ocasion !== 'ninguna'
      ? { occasion: celebracion.ocasion, occasion_note: celebracion.nota.trim() }
      : {}),
  })

  // Copia local de la reserva. Ya NO es el almacén —la buena está en Odoo— pero
  // se conserva como caché para que «Gracias» pinte al instante, sin esperar a
  // la red, con el menú y los horarios que solo existen en `data/tours.ts`.
  const reservaLocal = (codigo: string): Reserva => {
    const reserva: Reserva = {
      codigo,
      slug: tour.slug,
      tour: {
        nombre: tour.nombre,
        audienciaChip: tour.audienciaChip,
        duracionCorta: tour.duracionCorta,
        maxPax: tour.maxPax,
        precioLight: tour.precioLight,
      },
      ficha: {
        menuLight: ficha.menuLight,
        menuPremium: ficha.menuPremium,
        // [2026-08-07] Los 3 campos nuevos son lo que necesita el resolutor de
        // menú (lib/menu-reserva.ts) para contestar lo MISMO en «Gracias» y en
        // «Mi reserva» que aquí: sin ellos, esas pantallas volvían a caer en
        // menuLight/menuPremium —vacíos en Saona y en el charter— y pintaban un
        // menú inexistente que además se podía «editar».
        menuBuffet: ficha.menuBuffet,
        menuCharter: ficha.menuCharter,
        subVariantes: ficha.subVariantes,
        horarios: ficha.horarios,
        upgradePremium: ficha.upgradePremium,
      },
      paquete,
      variante: varianteInicial ?? undefined,
      personas,
      horarioIdx,
      fechaISO: fechaISO ?? new Date().toISOString().slice(0, 10),
      // Sin elección de plato (buffet), la lista va VACÍA en vez de con N
      // huecos: no hay nada pendiente de confirmar y las pantallas de después
      // no deben pedirlo.
      platos: hayPasoMenu ? platos : [],
      recogida: { hotel: recogida.hotel.trim(), notas: recogida.notas.trim() },
      contacto: {
        nombre: contacto.nombre.trim(),
        apellidos: contacto.apellidos.trim(),
        email: contacto.email.trim(),
        telefono: telefonoDe(contacto),
        idioma: contacto.idioma,
      },
      // Solo viaja si hay algo que celebrar: `ninguna` es una respuesta válida
      // en pantalla, pero guardarla no aporta nada a la tripulación.
      ...(celebracion.ocasion && celebracion.ocasion !== 'ninguna'
        ? { celebracion: { ocasion: celebracion.ocasion, nota: celebracion.nota.trim() } }
        : {}),
      total,
      deposito,
      saldo,
      fechaCreacionISO: new Date().toISOString(),
    }
    return reserva
  }

  // [2026-08-21, auditoría móvil] LA ACCIÓN DEL PASO ACTIVO, EN UN SOLO SITIO.
  // Hasta hoy cada sección se traía su propio botón dentro del acordeón, y en
  // móvil eso significaba que el botón se iba de pantalla en cuanto la sección
  // crecía (el paso de contacto mide ~1.100px con las píldoras de celebración
  // abiertas). Describir aquí el CTA —texto, si está habilitado y qué hace—
  // permite que la barra fija de abajo lo lleve sin duplicar ninguna regla:
  // los botones de dentro y el de la barra leen EXACTAMENTE lo mismo, así que
  // no pueden desincronizarse.
  const ctaPaso: { texto: string; habilitado: boolean; accion: () => void; cargando?: boolean } =
    pasoActivo === 'contacto'
      ? {
          texto: 'Continue',
          habilitado: contacto.nombre.trim() !== '' && contacto.email.trim() !== '',
          accion: () => setPaso(siguienteDe('contacto')),
        }
      : pasoActivo === 'menu'
        ? {
            // Mismo copy que el botón de dentro: el menú dejó de ser obligatorio
            // (2026-08-07), pero el texto tiene que decir que se avanza sin
            // haber elegido — si no, se avanza creyendo que ya está hecho.
            texto: platos.every((p) => p) ? 'Continue' : 'Continue and pick the menu later',
            habilitado: true,
            accion: () => setPaso(siguienteDe('menu')),
          }
        : pasoActivo === 'recogida'
          ? {
              texto: 'Continue',
              habilitado: recogida.hotel.trim() !== '',
              accion: () => setPaso(siguienteDe('recogida')),
            }
          : {
              texto: `Pay deposit · ${formatoDinero(deposito)}`,
              habilitado: fechaISO !== null && !pagando,
              // El cobro tarda: crear el intento en Odoo, confirmarlo con
              // Stripe y avisar de vuelta. La barra lo enseña girando.
              cargando: pagando,
              // [2026-08-25] NO es `handlePagar`: ese pide los datos de la
              // tarjeta y la barra no los tiene (vive fuera del paso de pago).
              // Se dispara el mismo `lanzar` que el botón de dentro, que sí
              // los reúne. Ver `registraLanzar` en paso-pago.tsx.
              accion: () => lanzarPago.current?.(),
            }

  // [2026-08-21, auditoría móvil] AL AVANZAR, LLEVAR AL PASO NUEVO. Pulsar
  // «Continuar» abría la sección siguiente pero dejaba el scroll donde estaba:
  // en móvil el acordeón recién abierto nacía por debajo del borde inferior de
  // la pantalla, así que la respuesta visible al clic era que la sección de
  // arriba se plegaba y no pasaba nada más. Ahora el paso nuevo sube al borde
  // superior.
  //
  // ⚠️ Se guarda EL PASO ANTERIOR, no un booleano de «primer render». Con un
  // booleano esto se rompe en desarrollo: `StrictMode` (main.tsx) monta y
  // ejecuta los efectos DOS VECES, así que la primera pasada gastaba el flag y
  // la segunda scrolleaba — al abrir el checkout la página aparecía ya bajada
  // al paso 1, tapando justo la tarjeta del resumen que en móvil se pone la
  // primera a propósito. Comparando el valor no hay nada que gastar: si el
  // paso no ha cambiado, no se scrollea, se ejecute el efecto las veces que se
  // ejecute.
  const pasoPrevio = useRef(pasoActivo)
  useEffect(() => {
    if (pasoPrevio.current === pasoActivo) return
    pasoPrevio.current = pasoActivo
    document.getElementById(`paso-${pasoActivo}`)?.scrollIntoView({
      block: 'start',
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    })
  }, [pasoActivo])

  // La FECHA ya la pinta el propio campo de calendario del resumen (con su hora
  // de salida), así que esta línea solo añade lo que allí no cabe: el regreso.
  const horarioTxt = horario
    ? horario.regreso
      ? tp('Departure {salida} · back at {vuelta}', { salida: horario.hora, vuelta: horario.regreso })
      : tp('Departure {salida}', { salida: horario.hora })
    : t('Schedule to be confirmed')

  // Igual que la fecha y el horario: se guarda al momento. Si esperara al
  // volcado final, el resumen enseñaria el total sin descuento hasta el segundo
  // antes de cobrar, que es justo cuando nadie quiere sorpresas.
  const cambiarEfectivo = (activo: boolean) => {
    setPagaEnEfectivo(activo)
    checkout.sincronizar({ discounts: activo ? ['efectivo'] : [] })
  }

  const cambiarPlato = (persona: number, plato: string) =>
    setPlatos((prev) => prev.map((p, i) => (i === persona ? plato : p)))

  // [2026-08-18] La fecha y el horario también se guardan al cambiarlos. Antes
  // solo viajaban en el volcado final del pago, así que el total de la tarjeta
  // se quedaba con el de la fecha vieja (los descuentos por anticipación
  // dependen del día) y el aviso de aforo no se enteraba de nada hasta pagar.
  const cambiarFecha = (iso: string | null) => {
    setFechaISO(iso)
    checkout.sincronizar({ date: iso })
    onConfigurar({ fecha: iso })
  }

  const cambiarHorario = (idx: number) => {
    setHorarioIdx(idx)
    checkout.sincronizar({ schedule_index: idx })
    onConfigurar({ horario: idx })
  }

  return (
    // overflow-x-clip: recorta el ::after w-screen de la zona gris sin volverse
    // contenedor de scroll (a diferencia de overflow-hidden), así el sticky de
    // la derecha sigue funcionando.
    // [2026-08-21, auditoría móvil] pb reservado para BarraMovilReserva, con
    // la misma fórmula que el resto del sitio: el hueco crece con la zona
    // segura del iPhone, o el pie del checkout queda debajo de la barra.
    <div className="flex min-h-screen flex-col overflow-x-clip bg-papel pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-0">
      <Meta
        titulo={`Book · ${tour.nombre}`}
        descripcion={`Set up your ${tour.nombre}: pick each guest’s dish, the pickup and confirm with just a 25% deposit.`}
        ruta={`/book/${tour.slug}`}
        indexable={false}
      />

      {/* Header MÍNIMO estilo Viator: logo (a la home) + selector de moneda. */}
      <header className="border-b border-linea">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
          <Link to="/" aria-label={t('Hispaniola Aquatic Adventures home')}>
            <Logo compacto />
          </Link>
          <div className="flex items-center gap-3">
          {/* [2026-08-19] El idioma SÍ entra en el funnel. El Topbar no se
              pinta aquí a propósito (nada de distracciones mientras se paga),
              pero el idioma no es una distracción: quien no entiende «Pick-up
              point» abandona el pago, no lo pospone.

              [2026-08-26] Y la moneda tampoco. Hasta hoy esto era un <button>
              con la palabra «USD» que no abría nada, mientras el selector real
              vivía en el pie —que aquí no se pinta—: de ahí el «el cambio de
              monedas en el checkout no funciona». El resumen sigue diciendo el
              importe exacto en dólares que se va a cobrar. */}
          <SelectorIdioma />
          <SelectorMoneda />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Grid de 2 zonas. Sin `items-start`: las celdas se ESTIRAN a la misma
            altura (la del formulario, más largo), así el gris de la derecha
            llega hasta abajo. La celda derecha lleva bg gris + un ::after que lo
            extiende w-screen hasta el borde del viewport (recortado por el
            overflow-x-clip de arriba) — «todo el lado derecho gris», no un box. */}
        <div className="mx-auto grid max-w-6xl grid-cols-1 lg:grid-cols-[minmax(0,1fr)_var(--spacing-ficha-widget)]">
          {/* IZQUIERDA (blanca): cabecera + secciones */}
          <div className="px-5 py-8 sm:px-8 sm:py-10">
            <h1 className="sr-only">{t('Complete your booking:')}{' '}{tour.nombre}</h1>

            {/* [2026-08-18] ESTADO DE LA CONEXIÓN CON ODOO. Hasta hoy el funnel
                solo leía `checkout.pedido` y se pintaba idéntico con el backend
                caído: se rellenaba todo, se veía un precio estimado y el fallo
                aparecía al pulsar «Pay deposit», con un mensaje genérico. Peor
                aún, sin pedido en Odoo la reserva NO queda registrada, que es
                justo lo que el proyecto promete que no puede pasar. Ahora se
                dice arriba del todo, antes de escribir el primer campo. */}
            <BandaEstado
              cargando={checkout.cargando}
              error={checkout.error}
              aforoOk={checkout.aforoOk}
            />

            <div className="flex flex-col gap-4">
              <SeccionPaso
                id="contacto"
                numero={indiceDe('contacto') + 1}
                titulo={TITULOS.contacto}
                estado={estadoDe('contacto')}
                onEditar={() => setPaso('contacto')}
                resumen={
                  <>
                    <p>
                      <span className="font-medium text-navy">
                        {[contacto.nombre, contacto.apellidos].filter(Boolean).join(' ') || '—'}
                      </span>
                      {contacto.email ? ` · ${contacto.email}` : ''}
                      {contacto.telefono ? ` · ${telefonoDe(contacto)}` : ''}
                    </p>
                    {etiquetaOcasion(celebracion.ocasion) ? (
                      <p className="mt-0.5 text-coral">
                        {etiquetaOcasion(celebracion.ocasion)}
                        {celebracion.nota.trim() ? ` · ${celebracion.nota.trim()}` : ''}
                      </p>
                    ) : null}
                  </>
                }
              >
                <PasoContacto
                  datos={contacto}
                  onCambio={(parcial) => setContacto((c) => ({ ...c, ...parcial }))}
                  celebracion={celebracion}
                  onCambioCelebracion={(parcial) => setCelebracion((c) => ({ ...c, ...parcial }))}
                />
                <Continuar
                  habilitado={contacto.nombre.trim() !== '' && contacto.email.trim() !== ''}
                  onClick={() => {
                    checkout.sincronizar({
                      step: 'contact',
                      contact: {
                        first_name: contacto.nombre.trim(),
                        last_name: contacto.apellidos.trim(),
                        email: contacto.email.trim(),
                        phone: telefonoDe(contacto),
                        language: contacto.idioma,
                      },
                      ...(celebracion.ocasion && celebracion.ocasion !== 'ninguna'
                        ? { occasion: celebracion.ocasion, occasion_note: celebracion.nota.trim() }
                        : {}),
                    })
                    setPaso(siguienteDe('contacto'))
                  }}
                />
              </SeccionPaso>

              {/* El paso del menú SOLO se monta si hay platos que elegir. Sin
                  él la numeración se recorre sola (los índices salen de
                  `pasos`), que es justo lo que arregla el bug de Saona: antes
                  aparecía un paso 2 con la rejilla vacía. */}
              {hayPasoMenu && menu ? (
                <SeccionPaso
                  id="menu"
                  numero={indiceDe('menu') + 1}
                  titulo={TITULOS.menu}
                  estado={estadoDe('menu')}
                  onEditar={() => setPaso('menu')}
                  resumen={
                    <ul className="flex flex-col gap-0.5">
                      {platos.map((p, i) => (
                        <li key={i}>
                          <span className="text-navy-soft">{t('Guest')}{' '}{i + 1}:</span>{' '}
                          {p ? (
                            <span className="font-medium text-navy">{p}</span>
                          ) : (
                            <span className="text-navy-soft">{t('to be confirmed by email')}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  }
                >
                  <PasoMenu menu={menu} seleccion={platos} onCambio={cambiarPlato} />
                  {/* Siempre habilitado (2026-08-07): el menú dejó de ser un
                      requisito para reservar. El botón cambia de texto para que
                      nadie avance creyendo que ya eligió. */}
                  <Continuar
                    habilitado
                    texto={platos.every((p) => p) ? t('Continue') : t('Continue and pick the menu later')}
                    onClick={() => {
                      // Los platos van POR COMENSAL, no agregados: la cocina no
                      // necesita «3 mariscos», necesita saber que el invitado 2
                      // come marisco.
                      checkout.sincronizar({ step: 'menu', dishes: platos })
                      setPaso(siguienteDe('menu'))
                    }}
                  />
                </SeccionPaso>
              ) : null}

              <SeccionPaso
                id="recogida"
                numero={indiceDe('recogida') + 1}
                titulo={TITULOS.recogida}
                estado={estadoDe('recogida')}
                onEditar={() => setPaso('recogida')}
                resumen={
                  <p>
                    <span className="font-medium text-navy">{recogida.hotel || '—'}</span>
                  </p>
                }
              >
                <PasoRecogida
                  datos={recogida}
                  onCambio={(parcial) => setRecogida((r) => ({ ...r, ...parcial }))}
                  horaSalida={horario?.hora ?? null}
                />
                <Continuar
                  habilitado={recogida.hotel.trim() !== ''}
                  onClick={() => {
                    checkout.sincronizar({
                      step: 'pickup',
                      pickup: { hotel: recogida.hotel.trim(), notes: recogida.notas.trim() },
                    })
                    setPaso(siguienteDe('recogida'))
                  }}
                />
              </SeccionPaso>

              <SeccionPaso id="pago" numero={indiceDe('pago') + 1} titulo={TITULOS.pago} estado={estadoDe('pago')}>
                <PasoPago
                  deposito={deposito}
                  saldo={saldo}
                  pedidoListo={checkout.pedido !== null}
                  fechaElegida={fechaISO !== null}
                  onPagar={handlePagar}
                  registraLanzar={(fn) => { lanzarPago.current = fn }}
                  procesando={pagando}
                  error={errorPago}
                  pagaEnEfectivo={pagaEnEfectivo}
                  onEfectivoChange={cambiarEfectivo}
                />
              </SeccionPaso>
            </div>
          </div>

          {/* DERECHA: zona GRIS a sangre (bg + ::after w-screen), altura completa.
              En MÓVIL va PRIMERA (order-first): ahí no hay dos columnas, y con la
              tarjeta al final el visitante rellenaba el formulario entero sin ver
              qué compra, cuánto paga hoy ni el stepper de personas que ahora vive
              dentro. En desktop no cambia nada (lg:order-none). */}
          <div className="relative order-first bg-fondo-ficha px-5 py-8 sm:px-8 sm:py-10 lg:order-none lg:after:absolute lg:after:inset-y-0 lg:after:left-full lg:after:w-screen lg:after:bg-fondo-ficha lg:after:content-['']">
            {/* [2026-08-21, auditoría móvil] `flex flex-col` + `order` para poder
                INVERTIR el orden en móvil sin tocar el desktop. En desktop el
                banner va arriba de la tarjeta, como pidió Samuel el 2026-08-07.
                En móvil esa misma pila hacía que lo PRIMERO de todo el checkout
                fuese un upsell negro a pantalla completa (medido: 550px, más de
                media pantalla de un iPhone) — se pedía subir de plan antes de
                haber visto qué se compra ni cuánto vale. Con el orden invertido
                se lee en el orden natural: esto es lo que llevas, esto cuesta,
                ¿lo quieres mejor? El banner sigue estando por encima del
                formulario, que es lo que importa para que se vea. */}
            <div className="flex flex-col lg:sticky lg:top-6">
              {/* Banner de upgrade ARRIBA de la tarjeta (2026-08-07, pedido de
                  Samuel). Solo con Light elegido y solo si el tour publica
                  upgrade y ventajas — en Premium desaparece porque ya no hay
                  nada que ofrecer, igual que la caja del widget de la ficha. */}
              {paquete === 'light' && ficha.upgradePremium !== null && ficha.ventajasPremium?.length ? (
                <BannerPremium
                  className="order-2 mt-4 lg:order-none lg:mt-0"
                  upgrade={ficha.upgradePremium}
                  personas={personas}
                  totalActual={total}
                  ventajas={ficha.ventajasPremium}
                  onCambiar={subirAPremium}
                />
              ) : null}
              <ResumenReserva
                className="order-1 lg:order-none"
                tour={tour}
                fechaISO={fechaISO}
                onFecha={cambiarFecha}
                horarios={ficha.horarios}
                horarioIdx={horarioIdx}
                onHorario={cambiarHorario}
                horarioTxt={horarioTxt}
                horaSalida={horario?.hora ?? null}
                menu={menu}
                personas={personas}
                minPersonas={1}
                maxPersonas={maxPersonas}
                onPersonas={cambiarPersonas}
                conceptoBase={
                  ficha.upgradePremium !== null
                    ? `${upgrade > 0 ? 'Light' : paquete === 'premium' ? 'Premium' : 'Light'} menu`
                    : t('Tour fare')
                }
                precioBase={precioLight}
                upgrade={upgrade}
                lineas={checkout.pedido?.quote?.lines}
                lineasAddOns={checkout.pedido?.quote?.addons}
                desglose={
                  tour.precioNino != null || ninos > 0 || bebes > 0
                    ? { adultos, ninos, bebes }
                    : null
                }
                onDesglose={cambiarGrupo}
                total={total}
                deposito={deposito}
                saldo={saldo}
                precioProvisional={checkout.pedido === null}
                variante={varianteInicial}
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-linea py-6 text-center text-xs text-navy-soft">
        {t('Hispaniola Aquatic Adventures · Secure direct booking · Free cancellation up to 7 days before')}
      </footer>

      {/* Precio + acción del paso activo, siempre a la vista en móvil. */}
      <BarraMovilReserva
        deposito={deposito}
        total={total}
        texto={ctaPaso.texto}
        habilitado={ctaPaso.habilitado}
        cargando={ctaPaso.cargando}
        onAccion={ctaPaso.accion}
      />
    </div>
  )
}

/** El estado de la conexión con Odoo, en una línea, arriba del formulario.
 *
 *  Tres casos y ninguno miente: abriendo la reserva · no se pudo abrir · el día
 *  se ha quedado sin plazas mientras se rellenaba (aviso, no bloqueo — el corte
 *  de verdad lo hace `/pay` con un 409). */
function BandaEstado({
  cargando,
  error,
  aforoOk,
}: {
  cargando: boolean
  error: ErrorApi | null
  aforoOk: boolean
}) {
  if (cargando) {
    return (
      <p role="status" className="rounded-card border border-linea bg-papel-hueso px-4 py-3 text-sm text-navy-sub">
        {t('Opening your booking…')}
      </p>
    )
  }

  if (error) {
    // `tour_not_found` es el síntoma de un catálogo sin publicar en Odoo, y
    // `network_error` el de CORS o el servidor caído. Al visitante le da igual
    // cuál: lo que necesita saber es que puede terminar por WhatsApp.
    return (
      <p role="alert" className="rounded-card border border-coral/40 bg-coral/5 px-4 py-3 text-sm leading-relaxed text-navy-sub">
        <strong className="text-navy">{t('We can’t open your booking right now.')}</strong> {t('Our booking system is not answering, so we can’t confirm prices or take the payment. You can fill this in and try again in a moment, or')}{' '}
        <a className="font-semibold text-aqua-dark underline" href="https://wa.me/18293052804" target="_blank" rel="noopener">
          {t('book it with us on WhatsApp')}
        </a>{' '}
        {t('and we’ll do it for you.')}
      </p>
    )
  }

  if (!aforoOk) {
    return (
      <p role="status" className="rounded-card border border-coral/40 bg-coral/5 px-4 py-3 text-sm leading-relaxed text-navy-sub">
        <strong className="text-navy">{t('That day just filled up for this group size.')}</strong> {t('Pick another date or fewer guests on the right — otherwise the payment will be declined at the last step.')}
      </p>
    )
  }

  return null
}

type EstadoSeccion = 'done' | 'activo' | 'pendiente'

// Una sección del acordeón (columna izquierda). Activa = formulario expandido;
// hecha = colapsada con su resumen + «Editar»; pendiente = cabecera en gris.
function SeccionPaso({
  id,
  numero,
  titulo,
  estado,
  onEditar,
  resumen,
  children,
}: {
  /** Ancla del paso — el auto-scroll al avanzar la busca por `paso-${id}`. */
  id: PasoId
  numero: number
  titulo: string
  estado: EstadoSeccion
  onEditar?: () => void
  resumen?: ReactNode
  children?: ReactNode
}) {
  return (
    <section
      id={`paso-${id}`}
      // scroll-mt-4: el auto-scroll deja el paso pegado al borde superior; sin
      // este respiro la card se lee como si estuviera cortada por arriba.
      className={`scroll-mt-4 overflow-hidden rounded-card-grande border bg-papel ${
        estado === 'activo' ? 'border-linea-fuerte' : 'border-linea'
      }`}
    >
      <header className="flex items-center justify-between gap-3 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span
            className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-semibold ${
              estado === 'pendiente' ? 'bg-papel-hueso text-navy-soft ring-1 ring-linea' : 'bg-navy text-white'
            }`}
          >
            {estado === 'done' ? <Check className="size-4" aria-hidden="true" /> : numero}
          </span>
          <h2
            className={`font-display text-lg font-semibold ${estado === 'pendiente' ? 'text-navy-soft' : 'text-navy'}`}
          >
            {titulo}
          </h2>
        </div>
        {estado === 'done' && onEditar ? (
          <button
            type="button"
            onClick={onEditar}
            className="shrink-0 text-sm font-medium text-aqua-dark transition-colors hover:text-aqua"
          >
            {t('Edit')}
          </button>
        ) : null}
      </header>

      {estado === 'activo' ? <div className="border-t border-linea px-5 py-5 sm:px-6">{children}</div> : null}
      {estado === 'done' && resumen ? (
        <div className="border-t border-linea px-5 py-4 text-sm text-navy-sub sm:px-6">{resumen}</div>
      ) : null}
    </section>
  )
}

function Continuar({
  habilitado,
  texto = t('Continue'),
  onClick,
}: {
  habilitado: boolean
  /** Texto del botón; el paso del menú lo cambia cuando se avanza sin elegir. */
  texto?: string
  onClick: () => void
}) {
  return (
    // [2026-08-21, auditoría móvil] `max-lg:hidden`: por debajo de lg este
    // botón NO se pinta — la acción del paso activo la lleva
    // BarraMovilReserva, fija abajo. Con los dos a la vez habría dos
    // «Continuar» idénticos en la misma pantalla, y este se va de vista en
    // cuanto la sección crece. Los dos leen el MISMO descriptor (`ctaPaso`),
    // así que no pueden decir cosas distintas.
    <div className="mt-5 max-lg:hidden">
      <FancyButton.Root variant="primary" disabled={!habilitado} onClick={onClick}>
        {texto}
      </FancyButton.Root>
    </div>
  )
}
