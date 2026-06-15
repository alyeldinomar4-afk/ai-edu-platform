import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './i18n'; // Import i18n initialization
import { ThemeProvider } from './context/ThemeContext'

createRoot(document.getElementById('root')).render(

    <ThemeProvider>
      <App />
    </ThemeProvider>,
)
