import { useEffect } from 'react'
import { refrescaScrollTriggerAlCrecer } from '@/lib/refresca-scrolltrigger'
import { Hero } from '@/components/home/hero'
import { Premios } from '@/components/home/premios'
import { EcoFriendly } from '@/components/home/eco-friendly'
import { Experiencia } from '@/components/home/experiencia'
import { ToursGrid } from '@/components/home/tours-grid'
import { WhyDirect } from '@/components/home/why-direct'
import { IncluyeCrucero } from '@/components/home/incluye-crucero'
import { Reviews } from '@/components/home/reviews'
import { Contacto } from '@/components/home/contacto'
import { ReelsSociales } from '@/components/ui/reels-sociales'
import { PruebaSocial } from '@/components/home/prueba-social'
import { Footer } from '@/components/home/footer'
import { Meta } from '@/components/seo/meta'
import { SchemaJsonLd } from '@/components/seo/schema-json-ld'
import { schemaOrganizacion } from '@/lib/seo/schema'

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
// EquipoTeaser vivió aquí entre el 2026-07-22 y el 2026-08-24: nació de una
// petición del propio cliente en las correcciones v1 («agregar sección del
// equipo»), pasó por cinco vueltas de diseño y acabó cerrando la página junto
// a Contacto.
//
// ⚠️ [2026-08-24, UPDATES 08/22 del cliente, pág. 3] SALE DE LA HOME. El
// cliente tacha la sección entera con una X y escribe «QUITAR ESO DE HOME
// PORFA». Es un DESMONTAJE, no un borrado: `components/home/equipo-teaser.tsx`
// y su hook siguen vivos porque /foundation los reutiliza
// (components/fundacion/fundadores-fundacion.tsx) para presentar a los tres
// cofundadores. Por eso el archivo se queda donde está aunque su única
// consumidora pase a ser otra página — moverlo a otra carpeta es un refactor
// aparte, no parte de este encargo.
//
// Lo que la home pierde con la sección, y que NO es cosmético: era el único
// sitio de esta página que llamaba a `refrescaScrollTriggerAlCrecer()`. Ver el
// useEffect de abajo.
export function HomePage() {
  // ⚠️ ESTO NO ES DEL EQUIPO, ES DE LA HOME ENTERA. `refrescaScrollTriggerAlCrecer()`
  // es un refresco GLOBAL: recalcula TODOS los ScrollTrigger de la página
  // cuando el documento crece porque han entrado imágenes `loading="lazy"`
  // (el porqué completo, con los dos bugs que lo causaron, está en
  // lib/refresca-scrolltrigger.ts).
  //
  // En la home lo pedía un solo sitio —el hook del teaser de equipo— y de ahí
  // se beneficiaban todos los demás bloques enganchados al scroll: Experiencia,
  // WhyDirect, IncluyeCrucero, EcoFriendly. Al quitar el teaser (2026-08-24) se
  // quedaba sin ningún llamador y esos cuatro volverían a disparar con las
  // posiciones viejas, que es exactamente el bug que costó dos vueltas de
  // Samuel. No lo arregla `invalidateOnRefresh`: sin nadie que pida el refresh,
  // no hay nada que invalidar.
  //
  // Sube AQUÍ, a la página, y no a otra sección: atado a una sección vuelve a
  // irse el día que esa sección se quite. Es el tercer caso que el propio
  // lib/refresca-scrolltrigger.ts anticipaba.
  useEffect(() => refrescaScrollTriggerAlCrecer(), [])

  return (
    // pb-[calc(4rem+env(safe-area-inset-bottom))] (auditoría móvil 2026-07-17):
    // el CTA sticky de hero.tsx ahora crece con la zona segura del iPhone —
    // el padding reservado aquí tiene que crecer exactamente lo mismo o el
    // final de la página queda tapado en un iPhone con home indicator.
    <div className="pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">
      <Meta
        titulo="Original catamaran tours in Punta Cana"
        descripcion="Snorkeling in a real coral nursery, a secluded beach and food cooked on board. Small groups, 4.9★ from 1,782 reviews and #1 on TripAdvisor 7 years running. Book direct, no middleman fees."
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
      <Footer />
      {/* Fijo, fuera del flujo (como lo era ModalBienvenida). Vive aquí y no
          en el shell porque es un comportamiento de LA HOME. Ver el aviso de
          honestidad del componente: hoy muestra datos de EJEMPLO marcados. */}
      <PruebaSocial />
    </div>
  )
}
