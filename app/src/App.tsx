import { Routes, Route, Navigate, useParams } from 'react-router-dom'
import { HomePage } from '@/pages/home'
import { TourPage } from '@/pages/tour'
import { ReservarPage } from '@/pages/reservar'
import { GraciasPage } from '@/pages/gracias'
import { CuentaPage } from '@/pages/cuenta'
import { MiReservaPage } from '@/pages/mi-reserva'
import { EventoPage } from '@/pages/evento'
import { GraciasEventoPage } from '@/pages/gracias-evento'
import { VentajaCompetitivaPage } from '@/pages/ventaja-competitiva'
import { FlotaPage } from '@/pages/flota'
import { TripulacionPage } from '@/pages/tripulacion'
import { TripulacionBarcoPage } from '@/pages/tripulacion-barco'
import { InstalacionesPage } from '@/pages/instalaciones'
import { MarineParkPage } from '@/pages/marine-park'
import { FundacionPage } from '@/pages/fundacion'
import { GuiasPage } from '@/pages/guias'
import { FaqPage } from '@/pages/faq'
import { BlogPage } from '@/pages/blog'
import { ArticuloPage } from '@/pages/articulo'
import { AgentesPage } from '@/pages/agentes'
import { TrabajaConNosotrosPage } from '@/pages/trabaja-con-nosotros'
import { PorQueReservarPage } from '@/pages/por-que-reservar'
import { ContactoPage } from '@/pages/contacto'
import { LegalPage } from '@/pages/legal'
import { FundacionesPage } from '@/pages/fundaciones'
import { NoEncontradoPage } from '@/pages/no-encontrado'
import { ScrollAlNavegar } from '@/lib/scroll-al-navegar'
import { NavFlotante } from '@/components/home/nav-flotante'
import { Topbar } from '@/components/home/topbar'
import { DevMode } from '@/dev/dev-mode'

// ── UNA FICHA, UN COMPONENTE ─────────────────────────────────────────────
// [v2 2026-07-28, reportado por Samuel: «Maite en el widget está seleccionado
// por defecto, pero en la tabla hay que volver a darle click para que se ponga
// como activa»]
//
// La causa no estaba en la tabla ni en el widget, sino aquí. React Router
// REUTILIZA el mismo componente cuando solo cambia el parámetro de la ruta
// (/tours/semi-private-premium → /tours/private-charter es la misma <Route>), y los
// inicializadores de `useState` solo corren al MONTAR. Resultado: se llegaba a
// la ficha del charter con el `variante` de la ficha anterior — `null` viniendo
// del semi-privado (que no tiene botes), o `'speedboat'` viniendo de Saona, que
// no existe en el charter. El widget pintaba su bote por defecto y la tabla no
// resaltaba ninguno, hasta que un clic los volvía a poner de acuerdo.
//
// `key={slug}` fuerza a React a DESMONTAR y montar de nuevo al cambiar de
// ficha, que es la forma idiomática de decir «esto ya no es la misma página».
// Se arregla de una vez para todo el estado de la página —bote, paquete,
// personas, acordeones— y no solo para el síntoma reportado; con un
// `useEffect` de reseteo habría que acordarse de añadir cada estado futuro.
//
// Reproducido y verificado en el navegador: antes, semi-privado → charter
// dejaba la tabla sin ningún barco activo; ahora entra con Maite marcado, igual
// que entrando por URL directa.
function TourPorSlug() {
  const { slug } = useParams()
  // [v3] `/tours/:slug` no cambia de prefijo, pero SÍ cambiaron los slugs de
  // los tours — una URL vieja compartida por WhatsApp caería en una ficha
  // inexistente. Se redirige antes de montar la página.
  if (slug && slug in SLUGS_VIEJOS) {
    return <Navigate to={`/tours/${SLUGS_VIEJOS[slug]}`} replace />
  }
  return <TourPage key={slug} />
}

// [2026-08-10] Mismo tratamiento que TourPorSlug y LegalPorSlug — le FALTABA, y
// ese hueco mandaba a la HOME dos rutas del cliente. La traza: el 301 del host
// convierte `/eventos/bodas` en `/events/bodas`; aquí no se consultaba
// SLUGS_VIEJOS, así que `evento.tsx` no encontraba la clave (las reales son
// party-boat/weddings/corporate) y remataba con un <Navigate to="/">. No se
// veía en `npm run dev` porque ahí gana la ruta de la SPA: solo se reproduce
// en el deploy o con `npm run preview`.
function EventoPorSlug() {
  const { slug } = useParams()
  if (slug && slug in SLUGS_VIEJOS) {
    return <Navigate to={`/events/${SLUGS_VIEJOS[slug]}`} replace />
  }
  return <EventoPage key={slug} />
}

// Mismo caso que los tours: el prefijo `/legal/` se queda, los slugs no.
function LegalPorSlug() {
  const { slug } = useParams()
  if (slug && slug in SLUGS_VIEJOS) {
    return <Navigate to={`/legal/${SLUGS_VIEJOS[slug]}`} replace />
  }
  return <LegalPage />
}

// ── CORRECCIONES v3 (2026-08-06, plan 01 §4): RUTAS EN INGLÉS ────────────
//
// El idioma principal del sitio pasa a inglés, así que los slugs también:
// un sitio EN con rutas en español pierde la palabra clave en la URL, que es
// justo donde más barato es tenerla. Se hace AHORA porque el dominio final
// aún se estaba conectando (reunión del 07-31) — no hay indexación que
// romper, y después del lanzamiento el cambio costaría el doble.
//
// TODAS las rutas viejas siguen respondiendo con <Navigate replace>: estaban
// enlazadas desde el footer, compartidas por WhatsApp y (varias) indexadas.
// ⚠️ El <Navigate> SOLO cubre la navegación dentro de la SPA — el 301 real
// vive en netlify.toml + app/vercel.json. Sin él, entrar directo por la URL
// vieja devuelve un 200 al index y Google sigue viendo la página antigua
// como propia (misma lección que /sostenibilidad → /ventaja-competitiva).
//
// Las que NO cambian: `/tours/:slug` (ya era inglés), `/faq`, `/blog` y
// `/legal/:slug` como prefijo (sus slugs internos sí se traducen).
const REDIRECCIONES_ES_EN: [string, string][] = [
  ['/reservar/:slug', '/book/:slug'],
  ['/reservar/:slug/gracias', '/book/:slug/thank-you'],
  ['/mi-reserva', '/my-booking'],
  ['/mi-cuenta', '/account'],
  ['/eventos/:slug', '/events/:slug'],
  ['/eventos/:slug/gracias', '/events/:slug/thank-you'],
  ['/ventaja-competitiva', '/competitive-advantage'],
  ['/tripulacion', '/crew'],
  ['/instalaciones', '/facilities'],
  ['/flota', '/fleet'],
  ['/fundacion', '/foundation'],
  ['/guias', '/guides'],
  ['/agentes-de-viaje', '/travel-agents'],
  ['/trabaja-con-nosotros', '/careers'],
  ['/por-que-reservar', '/why-book-direct'],
  ['/contacto', '/contact'],
]

// Redirección que CONSERVA el parámetro dinámico: `/eventos/bodas` tiene que
// llegar a `/events/weddings`, no a `/events/:slug` literal. Los slugs de
// contenido también se tradujeron (data/*.ts), así que además hay que
// mapearlos — si no, `/eventos/bodas` aterrizaría en `/events/bodas`, que ya
// no existe y daría 404.
const SLUGS_VIEJOS: Record<string, string> = {
  'semi-privado': 'semi-private-premium',
  'charter-privado': 'private-charter',
  'isla-saona': 'saona-island',
  bodas: 'weddings',
  empresas: 'corporate',
  'politica-de-cancelacion': 'cancellation-policy',
  privacidad: 'privacy',
  terminos: 'terms',
}

function RedirigeConSlug({ destino }: { destino: string }) {
  const { slug = '' } = useParams()
  const slugNuevo = SLUGS_VIEJOS[slug] ?? slug
  return <Navigate to={destino.replace(':slug', slugNuevo)} replace />
}

function App() {
  return (
    <>
      {/* React Router no resetea el scroll al navegar — sin esto, entrar a una
          ficha desde el footer de la home aterriza con el scroll al fondo. */}
      <ScrollAlNavegar />
      {/* Fuera de <Routes>: en flujo normal (no fixed, a diferencia de
          NavFlotante), así queda ANTES del hero de cada página con su propio
          fondo blanco — nunca dentro de la caja del hero. */}
      <Topbar />
      <NavFlotante />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tours/:slug" element={<TourPorSlug />} />
        <Route path="/book/:slug" element={<ReservarPage />} />
        <Route path="/book/:slug/thank-you" element={<GraciasPage />} />
        <Route path="/my-booking" element={<MiReservaPage />} />
        {/* [2026-08-18] El área privada. `/mi-cuenta` queda como alias en
            español, igual que /mi-reserva → /my-booking. */}
        <Route path="/account" element={<CuentaPage />} />
        <Route path="/events/:slug" element={<EventoPorSlug />} />
        <Route path="/events/:slug/thank-you" element={<GraciasEventoPage />} />
        {/* [v2 2026-07-28] `/sostenibilidad` → `/competitive-advantage`: el
            cliente encuadra esta página como su VENTAJA COMPETITIVA (slides
            57-64) y el slug sigue al encuadre. La vieja es URL indexada y
            enlazada desde fuera, así que redirige, NO devuelve 404 — y en
            producción con un 301 REAL (netlify.toml), que este <Navigate> no
            puede dar: aquí solo cubre la navegación dentro de la SPA. */}
        <Route path="/competitive-advantage" element={<VentajaCompetitivaPage />} />
        <Route path="/sostenibilidad" element={<Navigate to="/competitive-advantage" replace />} />
        {/* [v2 2026-07-27] Las 3 páginas en que se parte «Nosotros», según el
            menú nuevo que el cliente dictó en la reunión del 07-24. */}
        <Route path="/crew" element={<TripulacionPage />} />
        {/* ⚠️ TEMPORAL — variante de /tripulacion para comparar dos ideas de
            diseño (el muro de caras contra el plano del barco), pedida por
            Samuel el 2026-07-28. No está en el menú ni en el sitemap: se llega
            desde el Dev Mode. SE BORRA en cuanto se decida cuál gana; ver la
            cabecera de pages/tripulacion-barco.tsx. */}
        <Route path="/crew-boat" element={<TripulacionBarcoPage />} />
        <Route path="/facilities" element={<InstalacionesPage />} />
        {/* [v3 2026-08-06, plan 05 §6] Pagina NUEVA: el parque marino.
            Solo en ingles — nace despues de la decision de slugs EN, asi que
            no tiene ruta vieja en español de la que redirigir. */}
        <Route path="/marine-park" element={<MarineParkPage />} />
        <Route path="/fleet" element={<FlotaPage />} />
        {/* ⚠️ SINGULAR. Es la fundación del cliente. NO confundir con
            `/fundaciones` (plural, abajo), que es la página interna de tokens. */}
        <Route path="/foundation" element={<FundacionPage />} />
        {/* `/nosotros` DESAPARECE como página (reunión 07-24, 29:02: «no va a
            haber una página única de nosotros, sino estas tres cosas»). Pero es
            una URL indexada y enlazada desde fuera: redirige, NO devuelve 404.
            `replace` para no dejar basura en el historial del navegador. */}
        <Route path="/nosotros" element={<Navigate to="/crew" replace />} />
        <Route path="/guides" element={<GuiasPage />} />
        <Route path="/faq" element={<FaqPage />} />
        {/* Blog (correcciones v1 del cliente, planes/06-blog.md). El artículo
            va DESPUÉS del índice: React Router v6 no lo necesita (no hay
            ambigüedad entre /blog y /blog/:slug) pero se lee mejor. */}
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<ArticuloPage />} />
        <Route path="/travel-agents" element={<AgentesPage />} />
        {/* Correcciones v1 del cliente (2026-07-22): página nueva. Los tres
            enlaces del footer ("Como proveedor…", "…creador…", "…afiliado")
            traen aquí con `?perfil=`, no a tres rutas gemelas. */}
        <Route path="/careers" element={<TrabajaConNosotrosPage />} />
        {/* [v2 2026-07-28, plan 07 — slides 50-56] La página que el cliente
            pide detrás de su insignia amarilla «¿POR QUÉ RESERVAR CON
            NOSOTROS?». Reemplaza a `/reserva-directa` (retirada entera). */}
        <Route path="/why-book-direct" element={<PorQueReservarPage />} />
        {/* La URL vieja NO devuelve 404: estaba enlazada desde el footer y
            desde «Ver comparación →» de la ficha, y se ha compartido por
            WhatsApp. `replace` para no dejar basura en el historial. */}
        <Route path="/reserva-directa" element={<Navigate to="/why-book-direct" replace />} />
        <Route path="/contact" element={<ContactoPage />} />
        <Route path="/legal/:slug" element={<LegalPorSlug />} />
        {/* `/fundaciones` (PLURAL) es la página INTERNA de tokens del
            proyecto, la que documenta la paleta para el traspaso a Figma.
            Hasta la v3 se diferenciaba en UNA letra de `/fundacion` (la
            fundación del cliente) y hacía falta este aviso a gritos; ahora la
            pública es `/foundation` y la colisión desaparece. Se mantiene el
            slug español a propósito: es herramienta interna, no va a Figma ni
            al sitemap, y renombrarla rompería enlaces del Dev Mode. */}
        <Route path="/fundaciones" element={<FundacionesPage />} />

        {/* ── Rutas viejas en español → 301 (ver el bloque de arriba) ────── */}
        {REDIRECCIONES_ES_EN.map(([viejo, nuevo]) =>
          viejo.includes(':slug') ? (
            <Route key={viejo} path={viejo} element={<RedirigeConSlug destino={nuevo} />} />
          ) : (
            <Route key={viejo} path={viejo} element={<Navigate to={nuevo} replace />} />
          ),
        )}

        <Route path="*" element={<NoEncontradoPage />} />
      </Routes>
      {import.meta.env.DEV ? <DevMode /> : null}
    </>
  )
}

export default App
