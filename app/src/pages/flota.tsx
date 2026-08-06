import { useRef, useState } from 'react'
import { Footer } from '@/components/home/footer'
import { HeroInterna } from '@/components/internas/hero-interna'
import { CabeceraInterna } from '@/components/internas/cabecera-interna'
import { FamiliaHispaniola } from '@/components/flota/familia-hispaniola'
import { FlotaGrid } from '@/components/flota/flota-grid'
import { CocinaYParadas } from '@/components/flota/cocina-y-paradas'
import { useTimelineHistoria } from '@/components/nosotros/use-timeline-historia'
import { useCascadaNosotros } from '@/components/nosotros/use-cascada-nosotros'
import { useDevFlag } from '@/dev/use-dev-flag'
import { Meta } from '@/components/seo/meta'

// Página Flota (/flota) — correcciones v2, plan 04.
//
// La flota deja de ser una sección de /nosotros y pasa a página propia, porque
// el menú nuevo la pone como destino («Nosotros → Tripulación · Instalaciones ·
// Flota», reunión del 07-24).
//
// ⚠️ NO hay teaser en /nosotros: esa página DESAPARECE. El cliente lo confirmó
// en la reunión (29:02): «no va a haber una página única de nosotros, sino
// estas tres cosas». `/nosotros` redirige aquí desde App.tsx — la ruta vieja no
// devuelve 404 porque está indexada.
//
// ── ITERACIÓN v2 (2026-07-28) ────────────────────────────────────────────
//
// La primera versión de esta página era el grid heredado + la línea de tiempo
// + el banner de arrecife: de las 10 slides que el PDF dedica a /flota solo
// estaba aplicado el «sale a página propia». Samuel pidió aplicar el resto.
// El ORDEN de arriba abajo lo dictó él («la presentación de la familia […]
// agregar aquí el tema del dueño y el recorrido de años, luego las cards de
// los botes […] luego el resto de card y el banner»):
//
//   1. FamiliaHispaniola   — presentación + dueño + recorrido de años (slides
//                            26-27). Reemplaza a `NuestraHistoria`, cuyo panel
//                            de la cita se absorbe aquí (ver ese componente).
//   2. FlotaGrid           — las cards nuevas: vídeo por defecto, mini-galería,
//                            360º y ficha técnica en modal (slide 28).
//   3. CocinaYParadas      — la cocina flotante y las 3 paradas (slides 32-34).
//   4. BannerCeroPlastico  — el banner de cierre, reenfocado (slide 30).
//                            Sustituye a `ArrecifeTeaser`: el CTA sigue
//                            llevando a Sostenibilidad, así que el enlace
//                            interno no se pierde, solo deja de ser el titular.
//
// ⚠️ LA COCINA SE MONTÓ EN OSCURO Y A SANGRE, Y SE REHIZO (2026-07-28). Seguía
// la maqueta del slide 33, que va en tema oscuro, y por eso vivía FUERA de
// este contenedor. Samuel lo descartó al verlo en la página («el cambio es
// demasiado brusco»): en la slide ese bloque está solo, pero aquí llega
// después de la presentación y de 6 cards sobre papel, y una banda casi negra
// en medio se lee como otra web. Vuelve a ser una sección normal dentro del
// contenedor común — ver el comentario largo de cocina-y-paradas.tsx.
//
// Con ella dentro, el ORDEN cambia: la cocina pasa a ir ANTES del banner. Ya
// no hay motivo para dejar el banner en medio (era el respiro claro antes de
// la banda oscura), y un banner con CTA es un cierre mejor que un remate.
export function FlotaPage() {
  const contenidoRef = useRef<HTMLDivElement>(null)

  // [dev-mode] ?dev-flota=estatico congela los efectos de scroll en su estado
  // FINAL (línea de tiempo trazada, cards ya asentadas) → frame limpio para
  // Figma. Coincide con lo que ve quien tiene prefers-reduced-motion. Antes
  // este flag era `?dev-nosotros=estatico`, heredado de la página de la que
  // salió esta; se renombra porque /nosotros ya no existe y el nombre viejo
  // mandaba a leer una página retirada. Ver dev-registry.ts.
  const [estatico, setEstatico] = useState(false)
  useDevFlag('dev-flota', (v) => setEstatico(v === 'estatico')) // [dev-mode]
  useTimelineHistoria(contenidoRef, { activo: !estatico }) // [dev-mode] gate
  useCascadaNosotros(contenidoRef, { activo: !estatico }) // [dev-mode] gate

  return (
    <div>
      <Meta
        titulo="Our fleet"
        descripcion="Las embarcaciones de Hispaniola Aquatic Adventures: catamaranes de vela y motor, lanchas y el catamarán de eventos, con vídeo, galería y ficha técnica completa de cada una."
        ruta="/fleet"
      />
      <HeroInterna ctaHref="/#tours">
        {/* [v3 2026-08-06, WEBSITE - NOSOTROS pag. 3] Titular APROBADO. El
            cliente escribe «QUITAR LA FRASE DEBAJO Y PONER…», asi que el lead
            tambien es suyo, literal. */}
        <CabeceraInterna
          eyebrow="Our fleet"
          titulo="The fleet that brings every adventure to life"
          lead="Every boat has a purpose. Each vessel in our fleet has been carefully selected and customized for the experience."
        />
      </HeroInterna>

      <div ref={contenidoRef} className="mx-auto max-w-contenido px-5 py-12 sm:px-10 lg:py-16">
        <div className="flex flex-col gap-16 lg:gap-24">
          <FamiliaHispaniola />
          <FlotaGrid />
          <CocinaYParadas />
          {/* [v3 2026-08-06, PowerPoint slide 70] El banner de cero plastico
              sale de /flota junto con las 3 paradas: el cliente tacha las dos.
              El mensaje no se pierde — vive en el cintillo eco de la home y en
              /sostenibilidad, que es su sitio. El componente se conserva por
              si vuelve a hacer falta. */}
        </div>
      </div>

      <Footer />
    </div>
  )
}
