import React from 'react'
import ReactDOM from 'react-dom/client'
import SakinahResponsiveShell from './SakinahResponsiveShell.jsx'
import { installTypographyBoost } from './typographyBoost.js'
import { installCelestialArc } from './celestialArc.js'
import { installHeroAtmosphere } from './heroAtmosphere.js'
import { installTimeFormatToggle } from './timeFormatToggle.js'
import { installPreviewToggle } from './previewToggle.js'
import { installGlobalBackButtons } from './globalBackButtons.js'
import './index.css'
import './amiriExperiment.css'
import './bodoniNumbers.css'
import './topbarBrandPulse.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SakinahResponsiveShell />
  </React.StrictMode>,
)

installTypographyBoost()
installCelestialArc()
installHeroAtmosphere()
installTimeFormatToggle()
installPreviewToggle()
installGlobalBackButtons()

if ("serviceWorker" in navigator) {
  const localHost=["localhost","127.0.0.1","::1"].includes(window.location.hostname)
  if(localHost){
    navigator.serviceWorker.getRegistrations().then(list=>Promise.all(list.map(r=>r.unregister()))).catch(()=>{})
    if("caches" in window)caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith("sakinah-")).map(k=>caches.delete(k)))).catch(()=>{})
  }else{
    window.addEventListener("load",()=>navigator.serviceWorker.register("/sw.js").catch(()=>{}))
  }
}
