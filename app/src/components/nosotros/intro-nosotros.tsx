import { Etiqueta } from '@/components/ui/etiqueta'
import { INTRO_NOSOTROS } from '@/data/nosotros'

// «Quiénes somos» (2026-07-17, pedido de Samuel: la página tenía "puras
// cajas", sin narrativa) — bienvenida + diferenciador de grupos pequeños,
// portado y condensado de about-hispaniola.php?lang=es (ver el comentario
// de cabecera en data/nosotros.ts para el detalle de la fuente). Texto a la
// izquierda, foto real a la derecha — en móvil la foto va primero.
export function IntroNosotros() {
  return (
    <section className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
      <div className="order-2 lg:order-1">
        <Etiqueta>{INTRO_NOSOTROS.eyebrow}</Etiqueta>
        <h2 className="mt-3 font-display text-h2 font-semibold text-navy">{INTRO_NOSOTROS.titulo}</h2>
        <div className="mt-4 flex flex-col gap-4">
          {INTRO_NOSOTROS.parrafos.map((p) => (
            <p key={p} className="text-lead text-navy-sub">
              {p}
            </p>
          ))}
        </div>
      </div>
      <div className="order-1 overflow-hidden rounded-card-grande lg:order-2">
        <img
          src={`/fotos/${INTRO_NOSOTROS.foto}.webp`}
          alt={INTRO_NOSOTROS.fotoAlt}
          className="aspect-[4/3] w-full object-cover"
        />
      </div>
    </section>
  )
}
