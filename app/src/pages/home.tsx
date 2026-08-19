import { Hero } from '@/components/home/hero'
import { Premios } from '@/components/home/premios'
import { EcoFriendly } from '@/components/home/eco-friendly'
import { Experiencia } from '@/components/home/experiencia'
import { ToursGrid } from '@/components/home/tours-grid'
import { WhyDirect } from '@/components/home/why-direct'
import { IncluyeCrucero } from '@/components/home/incluye-crucero'
import { Reviews } from '@/components/home/reviews'
import { Contacto } from '@/components/home/contacto'
import { EquipoTeaser } from '@/components/home/equipo-teaser'
import { ReelsSociales } from '@/components/ui/reels-sociales'
import { PruebaSocial } from '@/components/home/prueba-social'
import { Footer } from '@/components/home/footer'
import { Meta } from '@/components/seo/meta'
import { SchemaJsonLd } from '@/components/seo/schema-json-ld'
import { schemaOrganizacion } from '@/lib/seo/schema'
import { t } from '@/lib/i18n'

// Home completa (F0-F6) — ver app/PLAN.md. v3: el Header vive DENTRO del
// Hero (app/PLAN-v3.md §4), ya no se monta aquí como hermano.
//
// v3-F21 (Samuel, 2026-07-16): se elimina «Diferenciadores», que iba entre
// IncluyeCrucero y Reviews — sus 4 verdades ya se decían todas antes (dos de
// ellas, ≤35% de aforo y 0 plástico, son literalmente stats del hero) y su
// número editorial gigante repetía el de IncluyeCrucero justo encima. El único
// dato que solo vivía allí (el top-3 de restauración de coral) se rescató en la
// narrativa de Experiencia — el porqué completo, en data/home.ts.
//
// Cierre v2 (Samuel, 2026-07-17): GaleriaFaqCierre (galería photo-stack +
// FAQ 2 columnas + CTA) se reemplaza por Contacto (mapa + formulario +
// cards) y Faq (acordeón centrado, AlignUI) — el CTA de cierre se funde en
// el Footer, que pasa a ser el océano.
//
// 2026-07-17 (misma sesión, pedido de Samuel): EventosEspeciales — la vitrina
// de 4 boxes (Cumpleaños/Bodas/Aniversarios/Despedidas) que la home actual
// tiene al final de la página. 2ª vuelta (Samuel): pasa de ir justo antes del
// Footer a vivir entre Reviews y Contacto — separa mejor el bloque de
// confianza (reseñas) del bloque de conversión/cierre (contacto + FAQ +
// footer).
//
// CORRECCIONES v1 DEL CLIENTE (2026-07-20, docs/proceso/correcciones-v1-cliente/planes/
// 01-home.md): el ModalBienvenida (popup de video al entrar) se ELIMINA —
// slide 2, «Eliminar popup». El video NO se tira: es el mismo asset que ya
// usa el hero de fondo, y ahora protagoniza también la sección Experiencia
// (slide 7, «poner el video del popup inicial aquí... a Fernando le gusta
// mucho ese video»). Un asset, dos usos, cero popups.
//
// EcoFriendly (misma sesión, pedido de Samuel sobre el cintillo "ECO FRIENDLY
// · NO PLASTIC" de la web actual): entre Premios y Experiencia, la misma
// posición relativa que en la web vieja (justo bajo los premios). Antes
// Premios y Experiencia se leían como "un bloque" sin borde entre ellas
// (mismo papel blanco, ver el comentario de premios.tsx) — ahora ese bloque
// queda partido por esta franja, con su propio fondo (--color-menta) a
// propósito: es la línea divisoria, no hace falta un border-b.
//
// EquipoTeaser se MUEVE de entre WhyDirect e IncluyeCrucero a debajo de
// Contacto (2026-07-22, pedido de Samuel): antes vivía en la zona de "por
// qué nosotros" de mitad de página; ahora cierra junto con Contacto y Faq —
// zona de cierre/confianza, justo antes del Footer. El rediseño de las cards
// (retrato + rol/antigüedad + hover) va en equipo-teaser.tsx.
export function HomePage() {
  return (
    // pb-[calc(4rem+env(safe-area-inset-bottom))] (auditoría móvil 2026-07-17):
    // el CTA sticky de hero.tsx ahora crece con la zona segura del iPhone —
    // el padding reservado aquí tiene que crecer exactamente lo mismo o el
    // final de la página queda tapado en un iPhone con home indicator.
    <div className="pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">
      <Meta
        titulo={t('Original catamaran tours in Punta Cana')}
        descripcion={t('Snorkeling in a real coral nursery, a secluded beach and food cooked on board. Small groups, 4.9★ from 1,782 reviews and #1 on TripAdvisor 7 years running. Book direct, no middleman fees.')}
        ruta="/"
      />
      <SchemaJsonLd datos={schemaOrganizacion()} />
      {/* [v2 2026-07-27] El schema de FAQ SALE de la home junto con la sección
          (slide 22: «quitar preguntas de la home»). Los datos estructurados
          tienen que reflejar contenido VISIBLE — publicar un FAQ schema de algo
          que ya no está en la página va contra las directrices de Google. Se
          pierde el rich snippet de FAQ de la home; la mitigación es que /faq
          (que sí lo tiene) gana peso en el menú nuevo, donde sube a la primera
          posición de «Ayuda». */}
      <Hero />
      <Premios />
      <EcoFriendly />
      <Experiencia />
      <ToursGrid />
      <WhyDirect />
      <IncluyeCrucero />
      {/* [v3 2026-08-06, WEBSITE - INICIO pág. 5: «REMOVE:» sobre la captura
          de la sección] «Cada ocasión merece su propio catamarán»
          (EventosEspeciales, la vitrina de 4 boxes Cumpleaños/Bodas/
          Aniversarios/Despedidas) SALE de la home. Vivía aquí desde la v2,
          que la había subido por encima de las reseñas.

          ⚠️ Con ella se pierde el único puente home → eventos que había en el
          cuerpo de la página. Siguen existiendo dos caminos: el mega-menú de
          Eventos (siempre visible) y el footer.

          El componente (eventos-especiales.tsx) y su fuente
          (EVENTOS_ESPECIALES) se BORRAN, no se comentan: eran sus únicos
          consumidores y este proyecto no deja cadáveres. Si el cliente los
          quiere de vuelta, viven completos en el tag `v3-pre-en`. */}
      <Reviews />
      <ReelsSociales />
      <Contacto />
      <EquipoTeaser />
      <Footer />
      {/* Fijo, fuera del flujo (como lo era ModalBienvenida). Vive aquí y no
          en el shell porque es un comportamiento de LA HOME. Ver el aviso de
          honestidad del componente: hoy muestra datos de EJEMPLO marcados. */}
      <PruebaSocial />
    </div>
  )
}
