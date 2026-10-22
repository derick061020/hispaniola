import { useCallback, useEffect, useRef, useState } from 'react'
import {
  abandonarCheckout, abrirCheckout, confirmarPago, crearPago, leerCheckout,
  sincronizarCheckout, type InicioCheckout,
} from './api'
import { ErrorApi } from './cliente'
import type { ParcheCheckout, Pedido } from './tipos'

// Hook del funnel. Sustituye a `guardarReserva()` de `lib/reservas.ts`
// manteniendo el mismo espiritu (la reserva se puede recuperar al recargar),
// pero con la copia buena viviendo en Odoo desde el primer paso.
//
// Lo que aporta sobre localStorage:
//  - la reserva existe en Odoo aunque el visitante no termine
//  - los importes los calcula el servidor (el front no puede equivocarse)
//  - recargar la pagina recupera el checkout, no lo pierde

const CLAVE = 'hsp:checkout:v1'

type Guardado = { codigo: string; token: string; tour: string; abierto: string }

/** Estados de un pedido que ya no se retoma. */
const CERRADOS = ['paid', 'confirmed', 'cancelled']

// [2026-10-20, proyecto «Recuperar reservas por email», diap. 4: «Una orden por
// cada carga del paso 1. Duplicados, rastreadores y reintentos inflan los
// abandonos». Portado el 2026-10-22 junto con los arreglos del pedido
// reutilizado, sin el resto de aquel carril.] LOS RASTREADORES NO ABREN PEDIDO.
//
// `/book/` esta en el Disallow de robots.txt, pero los robots que no lo leen
// —o que lo ignoran a proposito, como AdsBot de Google, que comprueba las
// paginas de destino de los anuncios aunque `User-agent: *` diga que no—
// ejecutan el JavaScript, montan este hook y abren un pedido en Odoo en cada
// visita: no guardan localStorage, asi que cada carga es un navegador nuevo y
// una clave de idempotencia nueva. Eso es el «rastreador cada dos horas» de
// la auditoria.
//
// Solo se excluye a quien SE DECLARA robot en su user-agent. Los navegadores
// automatizados que se disfrazan de Chrome no se pueden distinguir desde
// aqui —ni se intenta: un falso positivo dejaria a un cliente de verdad sin
// pedido—; esos los tiene que filtrar Odoo.
// `HeadlessChrome` NO esta en la lista a proposito: es el de los scripts de
// `qa/`, que necesitan abrir pedido contra un Odoo de pruebas.
const ROBOT = /bot\b|bot\/|crawler|spider|crawling|slurp|facebookexternalhit|lighthouse|pingdom|uptimerobot|statuscake/i
const NO_ROBOT = /cubot/i // marca de moviles: «CUBOT X30» no es un robot

export function esRobotDeclarado(ua: string = typeof navigator === 'undefined' ? '' : navigator.userAgent): boolean {
  return ROBOT.test(ua) && !NO_ROBOT.test(ua)
}

/** Clave de idempotencia de como mucho 64 caracteres (Odoo la corta ahi, y
 *  cortarla a ciegas podria hacer que dos claves distintas colisionaran: la
 *  clave derivada de un pedido pagado —la base + su codigo, ver `arrancar`—
 *  cortada se quedaria en la base y volveria a dar el pedido pagado). */
function claveCorta(clave: string): string {
  if (clave.length <= 64) return clave
  // FNV-1a de 32 bits, dos pasadas con semillas distintas: no es criptografia,
  // solo un resumen estable para que la misma entrada de la misma clave.
  const fnv = (texto: string, semilla: number) => {
    let h = semilla >>> 0
    for (let i = 0; i < texto.length; i++) {
      h ^= texto.charCodeAt(i)
      h = Math.imul(h, 16777619) >>> 0
    }
    return h.toString(36)
  }
  return `${clave.slice(0, 40)}-${fnv(clave, 2166136261)}${fnv(clave, 33554467)}`
}

/** Un identificador estable de ESTE navegador, para la clave de idempotencia.
 *  No identifica a nadie: es un numero al azar que vive en su localStorage y
 *  solo sirve para que dos visitantes no compartan pedido. */
const CLAVE_NAVEGADOR = 'haa.checkout.navegador'

function idDeEsteNavegador(): string {
  if (typeof window === 'undefined') return Math.random().toString(36).slice(2)
  try {
    let id = window.localStorage.getItem(CLAVE_NAVEGADOR)
    if (!id) {
      id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
      window.localStorage.setItem(CLAVE_NAVEGADOR, id)
    }
    return id
  } catch {
    // Sin almacenamiento (modo privado): una clave nueva por carga. Peor para
    // la idempotencia, pero nunca compartida con otro visitante.
    return Math.random().toString(36).slice(2)
  }
}

function leerGuardado(): Guardado | null {
  if (typeof window === 'undefined') return null
  try {
    const bruto = window.localStorage.getItem(CLAVE)
    if (!bruto) return null
    const dato = JSON.parse(bruto) as Guardado
    // Un checkout de hace dias ya no sirve: en Odoo estara abandonado.
    const horas = (Date.now() - new Date(dato.abierto).getTime()) / 3_600_000
    return horas < 12 ? dato : null
  } catch {
    return null
  }
}

/** La sesión de checkout de esta pestaña, para las pantallas que NO montan el
 *  hook. La usa «Gracias» al volver de PayPal: la captura necesita el código y
 *  el token, y esa página no abre ningún checkout. */
export function sesionCheckoutGuardada(): { codigo: string; token: string; tour: string } | null {
  const dato = leerGuardado()
  return dato ? { codigo: dato.codigo, token: dato.token, tour: dato.tour } : null
}

/** Cierra la sesión: el pedido ya está pagado o cancelado y no se retoma. */
export function olvidarSesionCheckout(): void {
  escribirGuardado(null)
}

function escribirGuardado(dato: Guardado | null): void {
  if (typeof window === 'undefined') return
  try {
    if (dato) window.localStorage.setItem(CLAVE, JSON.stringify(dato))
    else window.localStorage.removeItem(CLAVE)
  } catch {
    // localStorage lleno o deshabilitado. No se rompe nada: el pedido ya vive
    // en Odoo; lo unico que se pierde es poder retomarlo tras recargar.
  }
}

export type EstadoCheckout = {
  pedido: Pedido | null
  cargando: boolean
  guardando: boolean
  error: ErrorApi | null
  /** false = ese dia se ha quedado sin plazas mientras rellenaba. Es un AVISO;
   *  el bloqueo real ocurre al pagar. */
  aforoOk: boolean
}

export function useCheckout(inicio: InicioCheckout) {
  const [estado, setEstado] = useState<EstadoCheckout>({
    pedido: null, cargando: true, guardando: false, error: null, aforoOk: true,
  })
  const sesion = useRef<Guardado | null>(null)
  const pendiente = useRef<ParcheCheckout | null>(null)
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null)
  /** El `sync` que esta ahora mismo en vuelo, si lo hay. `pagar` lo espera. */
  const envio = useRef<Promise<void> | null>(null)

  // ---- Apertura ----
  useEffect(() => {
    let cancelado = false
    const abortador = new AbortController()

    /** Lo que la URL dice y el pedido no. Ver el porque abajo, en `arrancar`. */
    function desajusteContraUrl(pedido: Pedido): ParcheCheckout {
      const desajuste: ParcheCheckout = {}
      if (inicio.paquete && pedido.package !== inicio.paquete) {
        desajuste.package = inicio.paquete
      }
      const varianteUrl = inicio.variante ?? null
      if (varianteUrl !== null && pedido.variant !== varianteUrl) {
        desajuste.variant = varianteUrl
      }
      if (inicio.fecha && pedido.date !== inicio.fecha) {
        desajuste.date = inicio.fecha
      }
      if (inicio.scheduleIndex !== undefined
          && pedido.schedule_index !== inicio.scheduleIndex) {
        desajuste.schedule_index = inicio.scheduleIndex
      }
      if (inicio.pax) {
        const { adults, children, infants } = inicio.pax
        if (pedido.pax.adults !== adults || pedido.pax.children !== children
            || pedido.pax.infants !== infants) {
          desajuste.pax = { adults, children, infants }
        }
      }
      // Los extras se eligen en la ficha y no se tocan dentro del
      // funnel, asi que la lista de la URL es siempre la buena.
      const extras = inicio.addons ?? []
      if ([...extras].sort().join(',') !== [...pedido.addons].sort().join(',')) {
        desajuste.addons = extras
      }
      return desajuste
    }

    /** Corrige el pedido contra la URL y lo publica. */
    async function publicarCorregido(pedido: Pedido, guardado: Guardado) {
      const desajuste = desajusteContraUrl(pedido)
      if (Object.keys(desajuste).length) {
        try {
          const { pedido: corregido } = await sincronizarCheckout(
            guardado.codigo, guardado.token, desajuste,
          )
          if (cancelado) return
          setEstado((s) => ({ ...s, pedido: corregido, cargando: false }))
          return
        } catch {
          // Si la correccion falla, se sigue con el pedido tal cual: es
          // mejor un precio a corregir que un funnel que no abre.
        }
        if (cancelado) return
      }
      setEstado((s) => ({ ...s, pedido, cargando: false }))
    }

    async function arrancar() {
      // [2026-10-20, portado el 2026-10-22] Un robot declarado no abre pedido.
      // El funnel se pinta igual (con el precio estimado y sin poder pagar),
      // sin banda de error.
      if (esRobotDeclarado()) {
        setEstado((s) => ({ ...s, cargando: false }))
        return
      }
      const guardado = leerGuardado()
      try {
        if (guardado && guardado.tour === inicio.tour) {
          let pedido: Pedido | null = null
          try {
            pedido = await leerCheckout(guardado.codigo, guardado.token, abortador.signal)
          } catch (error) {
            // [2026-10-20, portado el 2026-10-22] Un pedido guardado que ya no
            // existe o cuyo token no vale (404/403) no es una caida del
            // sistema: se olvida y se abre uno nuevo. Antes caia al `catch` de
            // abajo y el visitante se quedaba mirando «We can’t open your
            // booking» para siempre en ese navegador. Lo demas (red, 5xx) si
            // es un error de verdad.
            if (!(error instanceof ErrorApi) || ![403, 404].includes(error.status)) throw error
          }
          if (cancelado) return
          // Un pedido ya cerrado no se retoma: se abre uno nuevo.
          if (pedido && !CERRADOS.includes(pedido.state)) {
            sesion.current = guardado
            // [2026-08-25, Samuel: «cuando voy al semiprivado light, en
            // checkout muestra el premium»] El pedido guardado se buscaba SOLO
            // por tour, asi que quien configuraba Premium, volvia a la ficha,
            // elegia Light y entraba otra vez, retomaba su pedido Premium tal
            // cual: la URL decia `light`, el pedido en Odoo seguia en
            // `premium` y el resumen pintaba el precio Premium (228 en vez de
            // 198). De paso parecia que el boton «Switch to Premium» estaba
            // roto — pulsarlo mandaba a premium algo que ya era premium, o sea
            // que no cambiaba nada en pantalla.
            //
            // La URL es la configuracion que el visitante acaba de elegir; el
            // pedido retomado es solo el envase. Donde no coincidan, manda la
            // URL — y se comprueba TODO lo que decide el precio, no solo el
            // paquete: en el charter y en Saona lo que cambia es el BARCO
            // (`variante`) y el tamano del grupo, y un pedido viejo de 20
            // personas retomado por uno de 6 cobraria las 20.
            //
            // Esto solo es seguro porque el funnel escribe en la URL lo que se
            // cambia dentro de el (fecha, horario, personas y la subida a
            // Premium). Si dejara de hacerlo, recargar volveria a la
            // configuracion de la ficha y borraria lo que se acaba de elegir.
            //
            // [2026-10-22, Rossanna: prueba en la web reutilizó el pedido del
            // 23/09 y su reserva siguio con la fecha del 30/09] La comparacion
            // vive en `desajusteContraUrl` porque ahora hace falta en DOS
            // sitios: aqui y al abrir (ver abajo).
            await publicarCorregido(pedido, guardado)
            return
          }
          escribirGuardado(null)
        }
        // Clave de idempotencia por NAVEGADOR, no por hora.
        //
        // [2026-09-01, Derick: «el contador de personas no actualiza el precio
        // en el checkout, solo en eventos»] La clave era
        // `tour + fecha-y-hora`, o sea la MISMA para todo el que entrara al
        // mismo tour dentro de la misma hora. El segundo visitante no creaba su
        // pedido: el servidor reconocia la clave y le devolvia el del primero,
        // con su paquete, su fecha y su numero de personas. En eventos se veia
        // a simple vista —pedias Tide para 15 y salia Starfish para 12— porque
        // ahi cada paquete tiene un precio muy distinto; en el resto de tours
        // pasaba igual de callado.
        //
        // Ahora la clave lleva un identificador aleatorio propio de este
        // navegador. Sigue cumpliendo lo que buscaba —recargar la pagina no
        // crea un pedido nuevo— sin mezclar a dos personas distintas.
        const base = `${inicio.tour}-${idDeEsteNavegador()}`
        let pedido = await abrirCheckout(inicio, claveCorta(base))
        // [2026-10-22, Rossanna: prueba en la web reutilizó el pedido del
        // 23/09 (HSP-6561-5111), que ya estaba PAGADO] Odoo devuelve el pedido
        // de una clave conocida SEA CUAL SEA SU ESTADO (`/checkout/start`,
        // rama `reused`), y la clave de este navegador para este tour no
        // cambia nunca. Resultado: quien ya habia pagado este tour en este
        // navegador y volvia a reservarlo recibia SU PEDIDO PAGADO; el primer
        // guardado contestaba 409 `order_closed` y la pantalla decia «We
        // can’t open your booking» —un error del sistema que no lo era— sin
        // forma de salir.
        //
        // Ahora, si lo que vuelve esta cerrado, se pide otro con una clave
        // derivada del pedido cerrado. Es determinista a proposito: recargar
        // recorre la misma cadena y llega al mismo pedido nuevo, sin crear
        // otro por cada carga. (Arreglo del carril «Recuperar reservas por
        // email», 2026-10-20.)
        for (let i = 0; i < 3 && CERRADOS.includes(pedido.state); i++) {
          pedido = await abrirCheckout(inicio, claveCorta(`${base}-${pedido.code}`))
        }
        if (cancelado) return
        const nuevo: Guardado = {
          codigo: pedido.code,
          token: pedido.token ?? '',
          tour: inicio.tour,
          abierto: new Date().toISOString(),
        }
        sesion.current = nuevo
        escribirGuardado(nuevo)
        // [2026-10-22, Rossanna: prueba en la web reutilizó el pedido del
        // 23/09; su reserva 20260923-001271 siguio con fecha 30/09 aunque ella
        // eligio otra cosa] Un pedido REUTILIZADO (la clave ya existia: este
        // navegador ya habia abierto este tour, hace mas de 12 h o antes de
        // pasar por otro) vuelve tal cual estaba —Odoo no le aplica lo que
        // manda `/start`—, con la fecha y las personas de entonces. Se
        // corrige contra la URL igual que el pedido guardado; con un pedido
        // recien creado no hay desajuste y no sale ninguna llamada.
        await publicarCorregido(pedido, nuevo)
      } catch (error) {
        if (cancelado) return
        setEstado((s) => ({
          ...s, cargando: false,
          error: error instanceof ErrorApi ? error : new ErrorApi('unknown', String(error), 0),
        }))
      }
    }

    void arrancar()
    return () => {
      cancelado = true
      abortador.abort()
    }
    // Solo al montar: el resto de cambios van por `sincronizar`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inicio.tour])

  // ---- Guardado con debounce ----
  //
  // [2026-08-18] `enviar` publica su promesa en `envio` y `sincronizar` la
  // DEVUELVE. Antes no: `sincronizar` era `void`, asi que el `await` del
  // handler de pago no esperaba a nada, y `pagar` miraba `pendiente.current`
  // —que `enviar` ya habia vaciado de forma sincrona— y salia disparado. El
  // guardado y el cobro volaban a la vez: si `/pay` llegaba primero, Odoo
  // cobraba con los datos de ANTES del ultimo cambio, o contestaba
  // `missing_date` con una fecha que el visitante acababa de elegir.
  const enviar = useCallback(async () => {
    const sesionActual = sesion.current
    const parche = pendiente.current
    if (!sesionActual || !parche) return
    pendiente.current = null
    setEstado((s) => ({ ...s, guardando: true }))
    try {
      const { pedido, aforoOk } = await sincronizarCheckout(
        sesionActual.codigo, sesionActual.token, parche,
      )
      setEstado((s) => ({ ...s, pedido, aforoOk, guardando: false, error: null }))
    } catch (error) {
      setEstado((s) => ({
        ...s, guardando: false,
        error: error instanceof ErrorApi ? error : new ErrorApi('unknown', String(error), 0),
      }))
    }
  }, [])

  /** Arranca un envio y deja su promesa a la vista de `pagar`. */
  const arrancarEnvio = useCallback(() => {
    const promesa = enviar().finally(() => {
      if (envio.current === promesa) envio.current = null
    })
    envio.current = promesa
    return promesa
  }, [enviar])

  const sincronizar = useCallback((parche: ParcheCheckout, inmediato = false): Promise<void> => {
    // Los parches se ACUMULAN: escribir el email mientras aun no ha salido el
    // del nombre no puede perder el nombre.
    pendiente.current = { ...(pendiente.current ?? {}), ...parche }
    if (temporizador.current) clearTimeout(temporizador.current)
    if (inmediato) return arrancarEnvio()
    temporizador.current = setTimeout(() => void arrancarEnvio(), 600)
    return Promise.resolve()
  }, [arrancarEnvio])

  // ---- Abandono ----
  useEffect(() => {
    function alSalir() {
      const sesionActual = sesion.current
      const pedido = estado.pedido
      if (!sesionActual || !pedido) return
      if (CERRADOS.includes(pedido.state)) return
      abandonarCheckout(sesionActual.codigo, sesionActual.token, 'closed the tab')
    }
    // `pagehide` y no `beforeunload`: en movil el navegador puede matar la
    // pestana sin disparar nunca el segundo.
    window.addEventListener('pagehide', alSalir)
    return () => window.removeEventListener('pagehide', alSalir)
  }, [estado.pedido])

  // ---- Pago ----
  const pagar = useCallback(async (
    opciones: { proveedor?: 'stripe' | 'paypal'; tipo?: 'deposit' | 'full' } = {},
  ) => {
    const sesionActual = sesion.current
    if (!sesionActual) throw new ErrorApi('no_session', 'El checkout no esta abierto.', 0)
    // Antes de cobrar, el servidor tiene que tener TODO lo que se ha
    // rellenado: primero se espera al `sync` que pueda estar en vuelo y
    // despues se manda lo que aun no ha salido. El importe lo pone Odoo con lo
    // que tenga guardado, asi que adelantarse aqui es cobrar de menos o de mas.
    if (temporizador.current) {
      clearTimeout(temporizador.current)
      temporizador.current = null
    }
    if (envio.current) await envio.current
    if (pendiente.current) await arrancarEnvio()
    return crearPago(sesionActual.codigo, sesionActual.token, opciones)
  }, [arrancarEnvio])

  const confirmar = useCallback(async (ids: { paymentIntentId?: string; paypalOrderId?: string }) => {
    const sesionActual = sesion.current
    if (!sesionActual) throw new ErrorApi('no_session', 'El checkout no esta abierto.', 0)
    const resultado = await confirmarPago(sesionActual.codigo, sesionActual.token, ids)
    escribirGuardado(null)
    return resultado
  }, [])

  return {
    ...estado,
    codigo: sesion.current?.codigo ?? null,
    token: sesion.current?.token ?? null,
    sincronizar,
    pagar,
    confirmar,
  }
}
