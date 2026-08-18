import type { Respuesta, RespuestaOk } from './tipos'

// Cliente HTTP de la API de Odoo. Un solo sitio para la base URL, los
// timeouts, los reintentos y el desempaquetado del sobre `{ok, data}`.
//
// El front no tenia NI UNA llamada de red (ver README §«La frontera con el
// backend»), asi que tampoco tenia estados de carga ni de error. Esta capa
// existe para que esos estados se anadan una vez y no componente a componente.

const BASE = (import.meta.env?.VITE_API_URL ?? 'http://localhost:8069').replace(/\/+$/, '')
const PREFIJO = '/api/web/v1'
const TIMEOUT_MS = 15000

/** Error de la API con el codigo estable del backend.
 *
 *  Ramificar SIEMPRE por `codigo`, nunca por `message`: el mensaje es copy y
 *  puede cambiar (y algun dia estara traducido). */
export class ErrorApi extends Error {
  readonly codigo: string
  readonly status: number
  readonly detalle: Record<string, unknown>

  constructor(codigo: string, mensaje: string, status: number, detalle: Record<string, unknown> = {}) {
    super(mensaje)
    this.name = 'ErrorApi'
    this.codigo = codigo
    this.status = status
    this.detalle = detalle
  }

  /** ¿Merece la pena reintentar? Un 5xx o una caida de red, si; un 422 no. */
  get esReintentable(): boolean {
    return this.status >= 500 || this.codigo === 'network_error' || this.codigo === 'timeout'
  }
}

type Opciones = {
  metodo?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  cuerpo?: unknown
  token?: string | null
  idempotencia?: string
  /** Reintentos SOLO para GET y para fallos de red. Un POST que ya llego al
   *  servidor no se repite a ciegas: para eso esta `idempotencia`. */
  reintentos?: number
  signal?: AbortSignal
}

/** Igual que `llamar`, pero devuelve el SOBRE entero en vez de solo `data`.
 *
 *  Existe porque algunos endpoints cuelgan datos fuera de `data`: `/sync`
 *  manda `capacity_ok` al lado, y `/checkout/start` manda `reused`. Con solo
 *  `data` esos campos se perdian en silencio — el aviso de «ya no quedan
 *  plazas» del funnel llevaba desde el primer dia sin poder aparecer. */
export async function llamarSobre<T>(
  ruta: string,
  opciones: Opciones = {},
): Promise<RespuestaOk<T>> {
  const {
    metodo = 'GET',
    cuerpo,
    token,
    idempotencia,
    reintentos = metodo === 'GET' ? 2 : 0,
    signal,
  } = opciones

  const cabeceras: Record<string, string> = { Accept: 'application/json' }
  if (cuerpo !== undefined) cabeceras['Content-Type'] = 'application/json'
  if (token) cabeceras['X-Booking-Token'] = token
  if (idempotencia) cabeceras['Idempotency-Key'] = idempotencia

  let ultimoError: ErrorApi | null = null

  for (let intento = 0; intento <= reintentos; intento++) {
    // AbortController propio para el timeout, encadenado al `signal` que venga
    // del componente: si React desmonta, la peticion se cancela igual.
    const abortador = new AbortController()
    const temporizador = setTimeout(() => abortador.abort(), TIMEOUT_MS)
    const alCancelar = () => abortador.abort()
    signal?.addEventListener('abort', alCancelar)

    try {
      const respuesta = await fetch(`${BASE}${PREFIJO}${ruta}`, {
        method: metodo,
        headers: cabeceras,
        body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo),
        signal: abortador.signal,
      })

      const texto = await respuesta.text()
      let json: Respuesta<T> | null = null
      try {
        json = texto ? (JSON.parse(texto) as Respuesta<T>) : null
      } catch {
        throw new ErrorApi('invalid_response', 'La respuesta no era JSON.', respuesta.status)
      }

      if (!json) {
        throw new ErrorApi('empty_response', 'Respuesta vacia del servidor.', respuesta.status)
      }
      if (!json.ok) {
        throw new ErrorApi(json.error, json.message ?? json.error, respuesta.status, json)
      }
      return json
    } catch (error) {
      if (error instanceof ErrorApi) {
        if (!error.esReintentable || intento === reintentos) throw error
        ultimoError = error
      } else if ((error as Error)?.name === 'AbortError') {
        // Cancelacion del componente: se propaga tal cual, no es un fallo.
        if (signal?.aborted) throw error
        ultimoError = new ErrorApi('timeout', 'El servidor tardo demasiado.', 408)
        if (intento === reintentos) throw ultimoError
      } else {
        ultimoError = new ErrorApi('network_error', 'No hay conexion con el servidor.', 0)
        if (intento === reintentos) throw ultimoError
      }
      // Espera exponencial corta antes de reintentar.
      await new Promise((r) => setTimeout(r, 300 * 2 ** intento))
    } finally {
      clearTimeout(temporizador)
      signal?.removeEventListener('abort', alCancelar)
    }
  }

  throw ultimoError ?? new ErrorApi('unknown', 'Error desconocido.', 0)
}

/** El caso normal: solo `data`. */
export async function llamar<T>(ruta: string, opciones: Opciones = {}): Promise<T> {
  const sobre = await llamarSobre<T>(ruta, opciones)
  return sobre.data
}

/** Envio «al cerrar la pestana». `sendBeacon` sobrevive a la navegacion, que
 *  es justo lo que hace falta para avisar de un checkout abandonado. */
export function enviarBaliza(ruta: string, cuerpo: unknown, token?: string | null): void {
  const url = `${BASE}${PREFIJO}${ruta}${token ? `?token=${encodeURIComponent(token)}` : ''}`
  const datos = JSON.stringify(cuerpo ?? {})
  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    navigator.sendBeacon(url, new Blob([datos], { type: 'application/json' }))
    return
  }
  // Sin sendBeacon (Safari viejo), fetch con keepalive.
  void fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: datos,
    keepalive: true,
  }).catch(() => {
    // Silencioso a proposito: la pestana ya se esta cerrando y no hay UI que
    // avisar. Si se pierde, el cron de Odoo marca el pedido igualmente.
  })
}

export const baseApi = BASE
