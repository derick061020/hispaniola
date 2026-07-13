import { Routes, Route } from 'react-router-dom'
import { HomePage } from '@/pages/home'
import { FundacionesPage } from '@/pages/fundaciones'
import { DevMode } from '@/dev/dev-mode'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/fundaciones" element={<FundacionesPage />} />
      </Routes>
      {import.meta.env.DEV ? <DevMode /> : null}
    </>
  )
}

export default App
