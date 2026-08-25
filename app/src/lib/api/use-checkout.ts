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

    async function arrancar() {
      const guardado = leerGuardado()
      try {
        if (guardado && guardado.tour === inicio.tour) {
          const pedido = await leerCheckout(guardado.codigo, guardado.token, abortador.signal)
          if (cancelado) return
          // Un pedido ya cerrado no se retoma: se abre uno nuevo.
          if (!['paid', 'confirmed', 'cancelled'].includes(pedido.state)) {
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
            // El paquete y la variante son la eleccion de la FICHA y viajan en
            // la URL: si el pedido retomado no coincide, manda la URL. Fecha,
            // personas y horario NO se reponen aqui a proposito — esos si se
            // cambian dentro del funnel y no vuelven a la URL, asi que
            // repescarlos borraria lo que el visitante acaba de elegir.
            const desajuste: ParcheCheckout = {}
            if (inicio.paquete && pedido.package !== inicio.paquete) {
              desajuste.package = inicio.paquete
            }
            const varianteUrl = inicio.variante ?? null
            if (varianteUrl !== null && pedido.variant !== varianteUrl) {
              desajuste.variant = varianteUrl
            }
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
            return
          }
          escribirGuardado(null)
        }
        // Clave de idempotencia por pestana: recargar no crea un pedido nuevo.
        const clave = `${inicio.tour}-${guardado?.abierto ?? new Date().toISOString().slice(0, 13)}`
        const pedido = await abrirCheckout(inicio, clave)
        if (cancelado) return
        const nuevo: Guardado = {
          codigo: pedido.code,
          token: pedido.token ?? '',
          tour: inicio.tour,
          abierto: new Date().toISOString(),
        }
        sesion.current = nuevo
        escribirGuardado(nuevo)
        setEstado((s) => ({ ...s, pedido, cargando: false }))
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
      if (['paid', 'confirmed', 'cancelled'].includes(pedido.state)) return
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
