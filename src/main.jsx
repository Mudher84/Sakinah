import React from 'react'
import ReactDOM from 'react-dom/client'
import SakinahDevotionLayer from './SakinahDevotionLayer.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SakinahDevotionLayer />
  </React.StrictMode>,
)

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(()=>{}));
}
