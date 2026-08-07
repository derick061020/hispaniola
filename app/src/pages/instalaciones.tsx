import { Footer } from '@/components/home/footer'
import { BandaInstalaciones } from '@/components/instalaciones/banda-instalaciones'
import { ZonasInstalaciones } from '@/components/instalaciones/zonas-instalaciones'
import { CabeceraInterna } from '@/components/internas/cabecera-interna'
import { HeroInterna } from '@/components/internas/hero-interna'
import { ExperienciaABordo } from '@/components/nosotros/experiencia-abordo'
import { Meta } from '@/components/seo/meta'
import { ReelsSociales } from '@/components/ui/reels-sociales'
import { INSTALACIONES, VERTICALES_INSTALACIONES } from '@/data/instalaciones'

// Página Instalaciones (/instalaciones) — correcciones v2, plan 06.
//
// Página de CREDIBILIDAD: enseña que detrás del tour hay laboratorio, museo,
// cocinas propias y oficinas. Cualquiera dice que restaura coral; tener
// laboratorio propio es verificable.
//
// ✅ El copy de las 6 zonas es REAL (lo escribió el cliente).
// ⚠️ La media es de relleno, del propio repo — ver data/instalaciones.ts.
// ⚠️ El 360° NO se falsea: sin material, no se pinta la celda. Un «Ver en 360°»
//    que abre una foto normal promete algo que no cumple.
//
// [v2 2026-07-28, pedido de Samuel] LA PÁGINA SE REESTRUCTURA PARA SEGUIR LAS
// SLIDES 44-49, que era lo que más se alejaba de la maqueta de todas las
// páginas de esta tanda. Antes: hero → aviso de «fotos de ejemplo» → 6 zonas
// con UNA foto 4:3 cada una → cierre. Ahora:
//
//   1. FUERA EL AVISO DE «FOTOS DE EJEMPLO» (y los alt que decían
//      «Placeholder — pendiente de la foto real»). Samuel: «eso se ve horrible
//      y amateur, se sobreentiende que es de ejemplo». Lo que la maqueta debe
//      enseñar es la página, no sus andamios; el estado real de los assets se
//      comunica por fuera, en el plan y en la lista de material pendiente.
//   2. CARRIL DE VERTICALES bajo el hero (slide 45, «Míralo en video ·
//      vertical»), con ReelsSociales — el carrusel arrastrable que el
//      proyecto ya tenía, ahora alimentado con los verticales de las zonas.
//   3. MINI-BENTO POR ZONA (slides 46-49): el pedido central. Ver
//      components/instalaciones/bento-zona.tsx.
//   4. CHIPS de zona (slide 46) y BANDA DE CTA INTERCALADA (slide 48). Ver
//      components/instalaciones/zonas-instalaciones.tsx.
//
// El hero NO se pasa al degradado verde plano de la maqueta: todas las
// internas comparten HeroInterna (box redondeado + media real + header
// sobreVideo dentro), que es una decisión de PLAN-INTERNAS-V2.md para las 15
// páginas. De las maquetas se toma la ESTRUCTURA, no la estética — mismo
// criterio que en la v1.
export function InstalacionesPage() {
  return (
    <div>
      <Meta
        titulo="Facilities"
        descripcion="A full complex in Punta Cana: open-air marine museum, biology lab, our own kitchens, shop and offices."
        ruta="/facilities"
      />
      <HeroInterna ctaHref="/#tours">
        <CabeceraInterna
          eyebrow={INSTALACIONES.eyebrow}
          titulo={INSTALACIONES.titulo}
          lead={INSTALACIONES.lead}
        />
      </HeroInterna>

      {/* Slide 45. Es una sección a ancho completo con su propio padding, así
          que va FUERA del contenedor de contenido de abajo — igual que en la
          home, donde el carril sangra hasta el canto de la pantalla en móvil. */}
      <ReelsSociales
        eyebrow={INSTALACIONES.videoEyebrow}
        titulo={INSTALACIONES.videoTitulo}
        lead={INSTALACIONES.videoLead}
        reels={VERTICALES_INSTALACIONES}
        // [v2 2026-07-28, 2ª vuelta] Cabecera a la izquierda y flechas en la
        // columna de la derecha, en la misma fila que el título (Samuel: «así
        // hacemos mejor integrado todo»). Ver `alineacion` en reels-sociales.
        alineacion="izquierda"
      />

      <div className="mx-auto max-w-contenido px-5 pb-12 sm:px-10 lg:pb-16">
        <ZonasInstalaciones />

        {/* [v2 2026-07-27] «Un día de mar, cuidado al detalle» se REUBICA aquí
            desde /nosotros, que desaparece. Encaja: esta página cuenta lo que
            hay EN TIERRA detrás de la experiencia, y esta franja cuenta cómo se
            traduce eso a bordo — el complejo y el día de mar son las dos
            mitades del mismo argumento. Sin esto se habría perdido con la
            página. ⚠️ Colocación provisional, pendiente del reparto final. */}
        <div className="mt-20">
          <ExperienciaABordo />
        </div>

        <div className="mt-20">
          <BandaInstalaciones
            variante="cierre"
            foto={INSTALACIONES.cierreFoto}
            eyebrow={INSTALACIONES.cierreEyebrow}
            titulo={INSTALACIONES.cierreTitulo}
            texto={INSTALACIONES.cierreTexto}
            cta={INSTALACIONES.cierreCta}
          />
        </div>
      </div>

      <Footer />
    </div>
  )
}
