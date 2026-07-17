import { Routes, Route } from 'react-router-dom'
import { HomePage } from '@/pages/home'
import { TourPage } from '@/pages/tour'
import { EventoPage } from '@/pages/evento'
import { FundacionesPage } from '@/pages/fundaciones'
import { ScrollAlNavegar } from '@/lib/scroll-al-navegar'
import { DevMode } from '@/dev/dev-mode'

function App() {
  return (
    <>
      {/* React Router no resetea el scroll al navegar — sin esto, entrar a una
          ficha desde el footer de la home aterriza con el scroll al fondo. */}
      <ScrollAlNavegar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tours/:slug" element={<TourPage />} />
        <Route path="/eventos/:slug" element={<EventoPage />} />
        <Route path="/fundaciones" element={<FundacionesPage />} />
      </Routes>
      {import.meta.env.DEV ? <DevMode /> : null}
    </>
  )
}

export default App
