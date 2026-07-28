import { Routes, Route, Navigate } from 'react-router-dom'
import { HomePage } from '@/pages/home'
import { TourPage } from '@/pages/tour'
import { ReservarPage } from '@/pages/reservar'
import { GraciasPage } from '@/pages/gracias'
import { MiReservaPage } from '@/pages/mi-reserva'
import { EventoPage } from '@/pages/evento'
import { GraciasEventoPage } from '@/pages/gracias-evento'
import { SostenibilidadPage } from '@/pages/sostenibilidad'
import { FlotaPage } from '@/pages/flota'
import { TripulacionPage } from '@/pages/tripulacion'
import { InstalacionesPage } from '@/pages/instalaciones'
import { FundacionPage } from '@/pages/fundacion'
import { GuiasPage } from '@/pages/guias'
import { FaqPage } from '@/pages/faq'
import { BlogPage } from '@/pages/blog'
import { ArticuloPage } from '@/pages/articulo'
import { AgentesPage } from '@/pages/agentes'
import { TrabajaConNosotrosPage } from '@/pages/trabaja-con-nosotros'
import { ReservaDirectaPage } from '@/pages/reserva-directa'
import { ContactoPage } from '@/pages/contacto'
import { LegalPage } from '@/pages/legal'
import { FundacionesPage } from '@/pages/fundaciones'
import { NoEncontradoPage } from '@/pages/no-encontrado'
import { ScrollAlNavegar } from '@/lib/scroll-al-navegar'
import { NavFlotante } from '@/components/home/nav-flotante'
import { Topbar } from '@/components/home/topbar'
import { DevMode } from '@/dev/dev-mode'

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
        <Route path="/tours/:slug" element={<TourPage />} />
        <Route path="/reservar/:slug" element={<ReservarPage />} />
        <Route path="/reservar/:slug/gracias" element={<GraciasPage />} />
        <Route path="/mi-reserva" element={<MiReservaPage />} />
        <Route path="/eventos/:slug" element={<EventoPage />} />
        <Route path="/eventos/:slug/gracias" element={<GraciasEventoPage />} />
        <Route path="/sostenibilidad" element={<SostenibilidadPage />} />
        {/* [v2 2026-07-27] Las 3 páginas en que se parte «Nosotros», según el
            menú nuevo que el cliente dictó en la reunión del 07-24. */}
        <Route path="/tripulacion" element={<TripulacionPage />} />
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
        <Route path="/reserva-directa" element={<ReservaDirectaPage />} />
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
