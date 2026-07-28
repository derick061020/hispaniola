import { Routes, Route, Navigate, useParams } from 'react-router-dom'
import { HomePage } from '@/pages/home'
import { TourPage } from '@/pages/tour'
import { ReservarPage } from '@/pages/reservar'
import { GraciasPage } from '@/pages/gracias'
import { MiReservaPage } from '@/pages/mi-reserva'
import { EventoPage } from '@/pages/evento'
import { GraciasEventoPage } from '@/pages/gracias-evento'
import { VentajaCompetitivaPage } from '@/pages/ventaja-competitiva'
import { FlotaPage } from '@/pages/flota'
import { TripulacionPage } from '@/pages/tripulacion'
import { TripulacionBarcoPage } from '@/pages/tripulacion-barco'
import { InstalacionesPage } from '@/pages/instalaciones'
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
// (/tours/semi-privado → /tours/charter-privado es la misma <Route>), y los
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
  return <TourPage key={slug} />
}

function EventoPorSlug() {
  const { slug } = useParams()
  return <EventoPage key={slug} />
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
        <Route path="/reservar/:slug" element={<ReservarPage />} />
        <Route path="/reservar/:slug/gracias" element={<GraciasPage />} />
        <Route path="/mi-reserva" element={<MiReservaPage />} />
        <Route path="/eventos/:slug" element={<EventoPorSlug />} />
        <Route path="/eventos/:slug/gracias" element={<GraciasEventoPage />} />
        {/* [v2 2026-07-28] `/sostenibilidad` → `/ventaja-competitiva`: el
            cliente encuadra esta página como su VENTAJA COMPETITIVA (slides
            57-64) y el slug sigue al encuadre. La vieja es URL indexada y
            enlazada desde fuera, así que redirige, NO devuelve 404 — y en
            producción con un 301 REAL (netlify.toml), que este <Navigate> no
            puede dar: aquí solo cubre la navegación dentro de la SPA. */}
        <Route path="/ventaja-competitiva" element={<VentajaCompetitivaPage />} />
        <Route path="/sostenibilidad" element={<Navigate to="/ventaja-competitiva" replace />} />
        {/* [v2 2026-07-27] Las 3 páginas en que se parte «Nosotros», según el
            menú nuevo que el cliente dictó en la reunión del 07-24. */}
        <Route path="/tripulacion" element={<TripulacionPage />} />
        {/* ⚠️ TEMPORAL — variante de /tripulacion para comparar dos ideas de
            diseño (el muro de caras contra el plano del barco), pedida por
            Samuel el 2026-07-28. No está en el menú ni en el sitemap: se llega
            desde el Dev Mode. SE BORRA en cuanto se decida cuál gana; ver la
            cabecera de pages/tripulacion-barco.tsx. */}
        <Route path="/tripulacion-barco" element={<TripulacionBarcoPage />} />
        <Route path="/instalaciones" element={<InstalacionesPage />} />
        <Route path="/flota" element={<FlotaPage />} />
        {/* ⚠️ SINGULAR. Es la fundación del cliente. NO confundir con
            `/fundaciones` (plural, abajo), que es la página interna de tokens. */}
        <Route path="/fundacion" element={<FundacionPage />} />
        {/* `/nosotros` DESAPARECE como página (reunión 07-24, 29:02: «no va a
            haber una página única de nosotros, sino estas tres cosas»). Pero es
            una URL indexada y enlazada desde fuera: redirige, NO devuelve 404.
            `replace` para no dejar basura en el historial del navegador. */}
        <Route path="/nosotros" element={<Navigate to="/tripulacion" replace />} />
        <Route path="/guias" element={<GuiasPage />} />
        <Route path="/faq" element={<FaqPage />} />
        {/* Blog (correcciones v1 del cliente, planes/06-blog.md). El artículo
            va DESPUÉS del índice: React Router v6 no lo necesita (no hay
            ambigüedad entre /blog y /blog/:slug) pero se lee mejor. */}
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<ArticuloPage />} />
        <Route path="/agentes-de-viaje" element={<AgentesPage />} />
        {/* Correcciones v1 del cliente (2026-07-22): página nueva. Los tres
            enlaces del footer ("Como proveedor…", "…creador…", "…afiliado")
            traen aquí con `?perfil=`, no a tres rutas gemelas. */}
        <Route path="/trabaja-con-nosotros" element={<TrabajaConNosotrosPage />} />
        {/* [v2 2026-07-28, plan 07 — slides 50-56] La página que el cliente
            pide detrás de su insignia amarilla «¿POR QUÉ RESERVAR CON
            NOSOTROS?». Reemplaza a `/reserva-directa` (retirada entera). */}
        <Route path="/por-que-reservar" element={<PorQueReservarPage />} />
        {/* La URL vieja NO devuelve 404: estaba enlazada desde el footer y
            desde «Ver comparación →» de la ficha, y se ha compartido por
            WhatsApp. `replace` para no dejar basura en el historial. */}
        <Route path="/reserva-directa" element={<Navigate to="/por-que-reservar" replace />} />
        <Route path="/contacto" element={<ContactoPage />} />
        <Route path="/legal/:slug" element={<LegalPage />} />
        {/* ⚠️⚠️ OJO: `/fundaciones` (PLURAL) NO es la fundación del cliente —
            es la página INTERNA de tokens del proyecto, la que documenta la
            paleta para el traspaso a Figma. La página de la Bávaro Reefs
            Foundation vive en `/fundacion` (SINGULAR), arriba en este mismo
            archivo. Se diferencian en UNA letra: decisión de Samuel del
            2026-07-26 para no perder la herramienta de tokens. Si vas a tocar
            una, comprueba cuál. */}
        <Route path="/fundaciones" element={<FundacionesPage />} />
        <Route path="*" element={<NoEncontradoPage />} />
      </Routes>
      {import.meta.env.DEV ? <DevMode /> : null}
    </>
  )
}

export default App
