import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import {AuthProvider} from './context/AuthContext.jsx'
import { AppDataProvider } from "./context/AppDataContext.jsx";
import { ToastProvider } from './context/ToastContext.jsx';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <AppDataProvider>
        <ToastProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        </ToastProvider>
      </AppDataProvider>
    </AuthProvider>
  </StrictMode>,
)

