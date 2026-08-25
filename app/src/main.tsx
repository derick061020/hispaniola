import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { ProveedorIdioma } from '@/lib/i18n'
import { ProveedorMoneda } from '@/lib/proveedor-moneda'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      {/* Envuelve al router, no al reves: al cambiar de idioma se remonta el
          arbol entero (ver proveedor.tsx) y la ruta actual tiene que
          sobrevivir a ese remonte — quien cambia a español leyendo una ficha
          se queda en su ficha, no vuelve a la home. */}
      <ProveedorIdioma>
        {/* Dentro del idioma: cambiarlo remonta todo igualmente, y así el
            formato de número (es-DO / en-US) ya está puesto cuando se pintan
            los precios convertidos. */}
        <ProveedorMoneda>
          <App />
        </ProveedorMoneda>
      </ProveedorIdioma>
    </BrowserRouter>
  </StrictMode>,
)
