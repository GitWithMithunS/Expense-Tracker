import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AppContextProvider } from './context/AppContext.jsx'
import TransactionProvider from "./context/TransactionContext.jsx"

createRoot(document.getElementById('root')).render(
  <TransactionProvider>
    <AppContextProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </AppContextProvider>
  </TransactionProvider>
)
