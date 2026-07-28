import { useRef } from 'react'
import { Footer } from '@/components/home/footer'
import { HeroInterna } from '@/components/internas/hero-interna'
import { FlotaGrid } from '@/components/nosotros/flota-grid'
import { NuestraHistoria } from '@/components/nosotros/nuestra-historia'
import { ArrecifeTeaser } from '@/components/nosotros/arrecife-teaser'
import { useTimelineHistoria } from '@/components/nosotros/use-timeline-historia'
import { useCascadaNosotros } from '@/components/nosotros/use-cascada-nosotros'
import { Meta } from '@/components/seo/meta'

// Página Flota (/flota) — correcciones v2, plan 04. 2026-07-27.
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
// El grid se reutiliza TAL CUAL (`FlotaGrid` no sabía nada de /nosotros: solo
// consume FLOTA de data/nosotros.ts), así que montar la página es gratis. Lo
// que cuesta son los assets: el cliente quiere 12 embarcaciones con galería,
// 360° y ficha técnica, y hoy hay 6 con una foto cada una.
export function FlotaPage() {
  const contenidoRef = useRef<HTMLDivElement>(null)
  useTimelineHistoria(contenidoRef, { activo: true })
  useCascadaNosotros(contenidoRef, { activo: true })

  return (
    <div>
      <Meta
        titulo="Nuestra flota"
        descripcion="Las embarcaciones de Hispaniola Aquatic Adventures: catamaranes de vela y motor, lanchas y el catamarán de eventos, con su ficha técnica."
        ruta="/flota"
      />
      <HeroInterna ctaHref="/#tours">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-aqua">
            Nuestra flota
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-white sm:text-5xl">
            Los barcos que hacen el día
          </h1>
          <p className="mt-4 text-lg text-white/85">
            Catamaranes de vela y de motor, lanchas rápidas y nuestro catamarán de eventos. Todos
            propios, todos con cocina flotante a bordo.
          </p>
        </div>
      </HeroInterna>

      <div ref={contenidoRef} className="mx-auto max-w-contenido px-5 py-12 sm:px-10 lg:py-16">
        <div className="flex flex-col gap-16 lg:gap-24">
          <FlotaGrid />
          {/* «Nuestra historia» (la línea de tiempo 2012→hoy con la cita del
              fundador) vivía en /nosotros, que desaparece. Se reubica AQUÍ
              porque su narrativa es literalmente la de esta página — «de un
              barco a una flota» — y porque en la reunión del 07-24 (28:46) el
              cliente habló de la historia justo mientras revisaba la flota.
              ⚠️ Colocación PROVISIONAL: queda pendiente que Samuel decida si
              su sitio definitivo es este o Tripulación (plan 02 §1). Lo que no
              podía pasar es que el contenido se perdiera con la página. */}
          <NuestraHistoria />
          <ArrecifeTeaser />
        </div>
      </div>

      <Footer />
    </div>
  )
}
