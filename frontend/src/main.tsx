import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Initialize theme from localStorage or default to dark
// This runs before React, so we set the initial class
const savedTheme = localStorage.getItem('theme')
if (savedTheme === 'light') {
  document.documentElement.classList.remove('dark')
} else {
  // Default to dark mode (if no preference saved or preference is dark)
  document.documentElement.classList.add('dark')
  if (!savedTheme) {
    localStorage.setItem('theme', 'dark')
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

