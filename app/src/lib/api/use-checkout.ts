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
  const enviar = useCallback(async () => {
    const sesionActual = sesion.current
    const parche = pendiente.current
    if (!sesionActual || !parche) return
    pendiente.current = null
    setEstado((s) => ({ ...s, guardando: true }))
    try {
      const respuesta = await sincronizarCheckout(sesionActual.codigo, sesionActual.token, parche)
      setEstado((s) => ({ ...s, pedido: respuesta, guardando: false, error: null }))
    } catch (error) {
      setEstado((s) => ({
        ...s, guardando: false,
        error: error instanceof ErrorApi ? error : new ErrorApi('unknown', String(error), 0),
      }))
    }
  }, [])

  const sincronizar = useCallback((parche: ParcheCheckout, inmediato = false) => {
    // Los parches se ACUMULAN: escribir el email mientras aun no ha salido el
    // del nombre no puede perder el nombre.
    pendiente.current = { ...(pendiente.current ?? {}), ...parche }
    if (temporizador.current) clearTimeout(temporizador.current)
    if (inmediato) {
      void enviar()
      return
    }
    temporizador.current = setTimeout(() => void enviar(), 600)
  }, [enviar])

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
    // Antes de cobrar se fuerza el guardado de lo que quede pendiente.
    if (pendiente.current) await enviar()
    return crearPago(sesionActual.codigo, sesionActual.token, opciones)
  }, [enviar])

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
