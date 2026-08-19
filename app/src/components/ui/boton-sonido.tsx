import { useCallback, useEffect, useState, type RefObject } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { t } from '@/lib/i18n'

// Botón de sonido para los vídeos que se auto-reproducen en silencio
// (2026-07-22, pedido de Samuel: primero «botón de mutear/desmutear y botón
// para verlo en pantalla completa», y en la misma sesión «a los vídeos de
// testimonios les hace falta, pero solo el de mutear» y «quítale el botón de
// pantalla completa al vídeo»). Se quedó solo el sonido, así que el
// componente se llama por lo que hace: no hay nada de pantalla completa
// dormido esperando a que alguien lo despierte.
//
// NO se usan los `controls` nativos: traen su propia barra, distinta en cada
// navegador, que pelea de frente con Charter Premium — y meterían
// play/pausa/línea de tiempo en vídeos que son ambiente en bucle, donde eso
// no significa nada. Lo único que el usuario puede querer aquí es oírlos.
//
// El componente NO se posiciona a sí mismo: recibe `className` y lo coloca
// quien lo usa. Cada vídeo tiene su esquina libre distinta (el testimonio
// tiene el chip arriba a la izquierda y el texto abajo; el de Experiencia las
// tiene todas libres), y un componente que eligiera su propia esquina
// obligaría a pelearse con él en cada sitio.

type Props = {
  videoRef: RefObject<HTMLVideoElement | null>
  className?: string
}

export function BotonSonido({ videoRef, className = '' }: Props) {
  // Arranca en `true` porque estos vídeos nacen `muted` (es lo único que
  // permite el autoplay), pero no se da por sentado: el efecto de abajo lo
  // sincroniza contra el elemento real en cuanto monta.
  const [silenciado, setSilenciado] = useState(true)

  // El estado se LEE del elemento, nunca se asume: `muted` puede cambiar por
  // fuera (otro control, el propio navegador), y un botón que dijera lo
  // contrario de lo que suena sería peor que no tener botón.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const sincronizar = () => setSilenciado(video.muted)
    sincronizar()
    video.addEventListener('volumechange', sincronizar)
    return () => video.removeEventListener('volumechange', sincronizar)
  }, [videoRef])

  const alternar = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    // Solo se toca el elemento; el listener de `volumechange` actualiza el
    // estado. Una sola fuente de verdad.
    video.muted = !video.muted
    // Quitar el silencio no sirve de nada si el vídeo está parado — algunos
    // navegadores lo pausan al salir de vista y no lo reanudan solos.
    if (!video.muted && video.paused) void video.play().catch(() => {})
  }, [videoRef])

  return (
    <button
      type="button"
      onClick={alternar}
      className={`inline-flex size-9 items-center justify-center rounded-full bg-navy/50 text-white ring-1 ring-white/40 backdrop-blur-sm transition-colors hover:bg-navy/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${className}`}
      aria-label={silenciado ? t('Turn on sound') : t('Mute video')}
    >
      {silenciado ? (
        <VolumeX className="size-4" aria-hidden="true" />
      ) : (
        <Volume2 className="size-4" aria-hidden="true" />
      )}
    </button>
  )
}
