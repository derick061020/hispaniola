import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { ProveedorIdioma } from '@/lib/i18n'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      {/* Envuelve al router, no al reves: al cambiar de idioma se remonta el
          arbol entero (ver proveedor.tsx) y la ruta actual tiene que
          sobrevivir a ese remonte — quien cambia a español leyendo una ficha
          se queda en su ficha, no vuelve a la home. */}
      <ProveedorIdioma>
        <App />
      </ProveedorIdioma>
    </BrowserRouter>
  </StrictMode>,
)
