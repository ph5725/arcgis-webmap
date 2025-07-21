import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import PrivatePortalMap from './assets/ArcgisMap.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrivatePortalMap />
  </StrictMode>,
)
