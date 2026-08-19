import React from 'react'
import ReactDOM from 'react-dom/client'
import SakinahNativeReadyLayer from './SakinahNativeReadyLayer.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SakinahNativeReadyLayer />
  </React.StrictMode>,
)

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(()=>{}));
}
