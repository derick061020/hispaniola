import { Play } from 'lucide-react'
import { Etiqueta } from '@/components/ui/etiqueta'
import { EnlacePrototipo } from '@/components/ui/enlace-prototipo'
import { IconoInstagram, IconoTikTok } from '@/components/ui/iconos-redes'
import { REELS, REELS_HASHTAG, REDES, type Reel } from '@/data/home'

// «Míranos en acción» — carrusel de reels de Instagram/TikTok (correcciones
// v1 del cliente, 2026-07-20). Cubre DOS peticiones con una sola pieza:
//   - planes/01-home.md slides 8-9 — «sección instagram y tiktok» en la home.
//   - planes/02-producto.md slide 6 — la fila «Video Corporativo + Reel 1/2/3
//     Clientes» de la ficha de tour.
// Por eso vive en `ui/` y no en `home/`: es un componente compartido, y en
// Figma será UN componente con dos usos, no dos parecidos que hay que
// mantener sincronizados.
//
// POR QUÉ NO ES UN EMBED EN VIVO DE INSTAGRAM/TIKTOK: los widgets oficiales
// meten un script de terceros, imponen su propio look (que se pelea con la
// dirección Charter Premium) y rompen el «cero librerías» de la home. Este es
// un carrusel CURADO: nosotros elegimos qué se enseña. Si el cliente quiere
// feed automático, es otra decisión y tiene su coste visual — está anotado en
// el plan.
//
// ⚠️ Estado de los datos (ver REELS en data/home.ts): hoy son FOTOS reales de
// las galerías del cliente haciendo de cartel, con `video: null`. No hay
// contadores de vistas (la maqueta los traía inventados) ni handles de
// terceros. Cuando lleguen los reels reales solo cambia el dato.

// Scroll horizontal con snap, no marquee automático: aquí el visitante ELIGE
// qué mirar (a diferencia del ticker del hero, que es ambiente). Un carrusel
// de video que se mueve solo pelea con el usuario justo cuando quiere leer.
function CardReel({ reel }: { reel: Reel }) {
  const IconoRed = reel.red === 'instagram' ? IconoInstagram : IconoTikTok
  return (
    <article className="reel-card group">
      {reel.video ? (
        <video
          src={reel.video}
          poster={`/fotos/${reel.foto}.webp`}
          muted
          loop
          playsInline
          preload="none"
          aria-label={reel.titulo}
        />
      ) : (
        <img src={`/fotos/${reel.foto}.webp`} alt={reel.fotoAlt} loading="lazy" />
      )}

      {/* Degradado de pie para que el título lea sobre cualquier foto. */}
      <div className="reel-card__velo" aria-hidden="true" />

      <span className="reel-card__red" aria-label={reel.red === 'instagram' ? 'Instagram' : 'TikTok'}>
        <IconoRed className="size-4" />
      </span>

      {/* El play es señal de "esto es un video", no un botón funcional
          mientras no haya video que reproducir. */}
      <span className="reel-card__play" aria-hidden="true">
        <Play className="size-5 fill-current" />
      </span>

      <p className="reel-card__titulo">{reel.titulo}</p>
    </article>
  )
}

type Props = {
  /** Título de sección. La ficha usa uno distinto al de la home. */
  titulo?: string
  eyebrow?: string
  lead?: string
  /** La ficha va sobre gris y no necesita fondo propio. */
  conFondo?: boolean
}

export function ReelsSociales({
  titulo = 'Míranos en acción',
  eyebrow = 'Reels · Instagram · TikTok',
  lead = 'Un día a bordo se vive mejor en video. Estos somos nosotros — y nuestros clientes disfrutando el Caribe.',
  conFondo = true,
}: Props) {
  return (
    <section
      className={`px-5 py-seccion-sm sm:px-10 sm:py-seccion ${conFondo ? 'bg-papel' : ''}`}
    >
      <div className="mx-auto max-w-contenido">
        <div>
          <Etiqueta>{eyebrow}</Etiqueta>
          <h2 className="mt-3 font-display text-h2 font-semibold text-navy">{titulo}</h2>
          <p className="mt-3 max-w-2xl text-lead text-navy-sub">{lead}</p>
        </div>

        {/* El wrapper sangra a los lados en móvil (-mx-5) para que las cards
            se deslicen hasta el borde real de la pantalla en vez de chocar
            contra el padding de la sección. El padding se devuelve por dentro
            para que la primera card no quede pegada al canto. */}
        <div className="reel-pista -mx-5 mt-8 px-5 sm:-mx-10 sm:px-10">
          {REELS.map((r) => (
            <CardReel key={r.id} reel={r} />
          ))}
        </div>

        <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <ul className="flex flex-wrap items-center gap-2">
            {REDES.filter((r) => r.id === 'instagram' || r.id === 'tiktok' || r.id === 'facebook').map(
              (red) => {
                const clases =
                  'inline-flex items-center rounded-btn px-4 py-2 text-sm font-semibold text-navy ring-1 ring-linea transition-colors hover:bg-papel-hueso'
                return (
                  <li key={red.id}>
                    {red.url ? (
                      <a href={red.url} target="_blank" rel="noopener" className={clases}>
                        {red.nombre}
                      </a>
                    ) : (
                      // Sin URL real no se inventa destino (misma regla que
                      // los premios y los perfiles de reseñas).
                      <EnlacePrototipo className={clases}>{red.nombre}</EnlacePrototipo>
                    )}
                  </li>
                )
              },
            )}
          </ul>

          <p className="text-sm text-navy-sub">
            ¿Navegaste con nosotros? Etiquétanos con{' '}
            <span className="font-semibold text-coral">{REELS_HASHTAG}</span> y sal en nuestra web.
          </p>
        </div>
      </div>
    </section>
  )
}
