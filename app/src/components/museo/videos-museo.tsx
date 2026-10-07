import { useEffect, useRef } from 'react'
import { MUSEO } from '@/data/museo'

// EN VÍDEO — «Míralo con tus propios ojos» (V1). Tres reels verticales.
//
// El V1 los pintaba como miniaturas con un ▶ que no reproducía nada. Aquí son
// vídeo de verdad, en bucle y sin sonido, que SOLO corren mientras se ven:
// `preload="none"` + IntersectionObserver. Los tres suman ~8 MB y ninguno se
// descarga hasta que el visitante llega a esta altura.
//
// Con movimiento reducido no arrancan solos: se quedan en el póster con los
// controles nativos, y quien quiera los pone.

export function VideosMuseo() {
  const v = MUSEO.videos
  const listaRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const lista = listaRef.current
    if (!lista) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const videos = Array.from(lista.querySelectorAll('video'))
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          const el = e.target as HTMLVideoElement
          if (e.isIntersecting) el.play().catch(() => {})
          else el.pause()
        }),
      { threshold: 0.35 },
    )
    videos.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const reducido = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <section id="how-it-feels" className="museo-seccion">
      <p className="museo-eyebrow text-center" data-museo-revelar>
        {v.eyebrow}
      </p>
      <h2 className="museo-h2 mt-3 text-center" data-museo-revelar>
        {v.titulo}
      </h2>

      <ul ref={listaRef} className="museo-reels mt-12 lg:mt-14">
        {v.reels.map((r) => (
          <li key={r.video} data-museo-revelar>
            <div className="museo-reel" data-museo-flotar>
              <video
                src={`/video/museo/${r.video}.mp4`}
                poster={`/fotos/${r.video}.webp`}
                muted
                loop
                playsInline
                preload="none"
                controls={reducido}
                aria-label={r.titulo}
                className="aspect-[9/16] w-full object-cover"
              />
              <p className="museo-reel-pie">{r.titulo}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
