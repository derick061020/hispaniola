import { Etiqueta } from '@/components/ui/etiqueta'
import { INTRO_NOSOTROS } from '@/data/nosotros'

// «Quiénes somos» (2026-07-17, pedido de Samuel: la página tenía "puras
// cajas", sin narrativa) — bienvenida + diferenciador de grupos pequeños,
// portado y condensado de about-hispaniola.php?lang=es (ver el comentario
// de cabecera en data/nosotros.ts para el detalle de la fuente). Texto a la
// izquierda, foto real a la derecha — en móvil la foto va primero.
//
// 2026-07-22 (rediseño fiel a la maqueta del cliente): la maqueta ponía aquí
// una card ENORME de vídeo centrada («Conócenos en 60 segundos» → «Un día con
// la familia Hispaniola»). Samuel la descartó de plano — «no uses esta
// disposición» — así que el reparto texto/foto se queda. Lo que SÍ se trae de
// la maqueta es la ambición del bloque: la foto crece a formato apaisado y
// hereda el gesto de apertura que iba a llevar el vídeo (use-apertura-intro.ts
// — el marco se abre desde una rendija y la foto hace parallax por dentro).
//
// LA SOBREMEDIDA DE LA FOTO (el `top`/`bottom` negativos de la img) no es
// decorativa: es lo que impide que el parallax despegue la foto del borde del
// marco y deje una banda vacía. El primer intento fue un `scale-105`, y estaba
// MAL DIMENSIONADO — sobre un marco de ~420px, el 5% da ~10px de holgura por
// lado, la mitad de los ±28px que recorre la foto, así que al entrar la
// sección asomaba un hueco de ~13px por arriba (se leía como la foto cortada).
//
// Ahora la holgura se ATA AL MISMO TOKEN que el recorrido en vez de estimarse:
// la img desborda el marco exactamente --nosotros-apertura-parallax por arriba
// y por abajo, y el recorrido es la MITAD de ese valor en cada sentido — el
// doble del margen que hace falta, sin depender del alto que acabe teniendo el
// marco. Va en `style` y no en una clase porque es una relación con el token,
// no un valor suelto (mismo criterio que los degradados de equipo-teaser.tsx).
// El estado sin GSAP (reduced-motion, frame de Figma) queda centrado y lleno.
export function IntroNosotros() {
  return (
    <section className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
      <div className="order-2 lg:order-1">
        <Etiqueta>{INTRO_NOSOTROS.eyebrow}</Etiqueta>
        <h2 className="mt-3 max-w-xl text-balance font-display text-h2 font-semibold text-navy">
          {INTRO_NOSOTROS.titulo}
        </h2>
        <div className="mt-5 flex flex-col gap-4">
          {INTRO_NOSOTROS.parrafos.map((p) => (
            <p key={p} className="text-lead text-navy-sub">
              {p}
            </p>
          ))}
        </div>
      </div>

      <div className="nosotros-apertura relative order-1 aspect-[4/3] overflow-hidden rounded-card-grande lg:order-2 lg:aspect-[16/10]">
        <img
          src={`/fotos/${INTRO_NOSOTROS.foto}.webp`}
          alt={INTRO_NOSOTROS.fotoAlt}
          className="nosotros-apertura-medio absolute inset-x-0 w-full object-cover"
          style={{
            top: 'calc(-1 * var(--nosotros-apertura-parallax))',
            bottom: 'calc(-1 * var(--nosotros-apertura-parallax))',
          }}
        />
      </div>
    </section>
  )
}
