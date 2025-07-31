import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PredictionProvider } from './contexts/PredictionContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PredictionProvider>
      <App />
    </PredictionProvider>
  </StrictMode>,
)
