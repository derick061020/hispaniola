import { Routes, Route } from 'react-router-dom'
import { HomePage } from '@/pages/home'
import { TourPage } from '@/pages/tour'
import { ReservarPage } from '@/pages/reservar'
import { GraciasPage } from '@/pages/gracias'
import { MiReservaPage } from '@/pages/mi-reserva'
import { EventoPage } from '@/pages/evento'
import { GraciasEventoPage } from '@/pages/gracias-evento'
import { SostenibilidadPage } from '@/pages/sostenibilidad'
import { NosotrosPage } from '@/pages/nosotros'
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
        <Route path="/nosotros" element={<NosotrosPage />} />
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
        <Route path="/fundaciones" element={<FundacionesPage />} />
        <Route path="*" element={<NoEncontradoPage />} />
      </Routes>
      {import.meta.env.DEV ? <DevMode /> : null}
    </>
  )
}

export default App
