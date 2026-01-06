import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'
import "./global.css";

import { AuthProvider } from './components/AuthProvider';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
