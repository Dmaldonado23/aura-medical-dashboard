import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/main.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Elemento raíz no encontrado. Asegúrese de que index.html tenga <div id="root"></div>')
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
