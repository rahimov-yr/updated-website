import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import { SettingsProvider } from './context/SettingsContext'
import App from './App'
import './styles/index.css'
import './styles/conference-pages.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <SettingsProvider>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </SettingsProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
