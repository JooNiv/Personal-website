import React from 'react'
import ReactDOM from 'react-dom/client' // Import from 'react-dom/client'
import './styles/index.css'
import App from './App'

const rootElement = document.getElementById('root') // Get the root element

const root = ReactDOM.createRoot(rootElement) // Create a root using createRoot

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
