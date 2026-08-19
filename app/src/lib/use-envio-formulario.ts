import { t } from '@/lib/i18n'
import { useState, type FormEvent } from 'react'
import { enviarFormulario, type TipoFormulario } from '@/lib/api/api'

// [2026-08-18] EL ENVÍO DE LOS FORMULARIOS DEL SITIO.
//
// Los cuatro formularios sueltos —contacto, agentes de viaje, empleo y los
// comentarios del blog— hacían todos lo mismo: `preventDefault()`, marcar
// «enviado» y prometer respuesta en 24 h. El mensaje no salía del navegador.
// El backend (`POST /leads`) llevaba los siete tipos listos desde el
// 2026-08-10 y `enviarFormulario()` escrita sin que nadie la llamara.
//
// Este hook es el único sitio donde se hace el envío, para que los cuatro
// formularios se comporten igual en los tres estados que importan: enviando
// (el botón se bloquea, o se mandan dos leads), enviado (acuse de recibo) y
// fallido — que es el que faltaba en todos y el más importante: decirle a
// alguien «te contestamos en 24 h» cuando su mensaje no ha salido del
// navegador es la peor versión posible de esta pantalla.
//
// Los campos se leen del propio `<form>` con FormData, así que el formulario
// no necesita estado por campo: basta con que cada control tenga `name`. Los
// nombres van en INGLÉS y son los que espera `haa.web.lead.submit`
// (`name`, `email`, `phone`, `company`, `subject`, `message`); lo que no
// reconozca se guarda igual en el payload íntegro del lead.

export type EstadoEnvio = 'inicial' | 'enviando' | 'enviado' | 'error'

export function useEnvioFormulario(tipo: TipoFormulario) {
  const [estado, setEstado] = useState<EstadoEnvio>('inicial')

  /** Envía el formulario del evento. `extra` añade lo que no es un campo del
   *  DOM (el perfil elegido en Empleo, el artículo en un comentario…). */
  const enviar = async (
    evento: FormEvent<HTMLFormElement>,
    extra: Record<string, unknown> = {},
  ) => {
    evento.preventDefault()
    if (estado === 'enviando') return false
    const formulario = evento.currentTarget
    const datos = Object.fromEntries(new FormData(formulario).entries())
    setEstado('enviando')
    try {
      await enviarFormulario(tipo, { ...datos, ...extra })
      setEstado('enviado')
      formulario.reset()
      return true
    } catch {
      setEstado('error')
      return false
    }
  }

  return { estado, enviar, enviando: estado === 'enviando' }
}

/** El mensaje de error, igual en los cuatro formularios: qué pasó y qué hacer
 *  ahora — nunca un «inténtalo más tarde» a secas cuando hay un WhatsApp que
 *  contesta en minutos.
 *
 *  [2026-08-19] Es una FUNCIÓN, no una constante: como constante se resolvería
 *  al importar el módulo, o sea una sola vez y antes de que nadie pueda tocar
 *  el selector, y quedaría clavada en el idioma con el que se abrió la web. */
export function errorEnvio(): string {
  return t(
    'We could not send that — check your connection and try again, or write to us on WhatsApp +1-829-305-2804.',
  )
}
