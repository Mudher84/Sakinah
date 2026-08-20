import React from 'react'
import ReactDOM from 'react-dom/client'
import SakinahResponsiveShell from './SakinahResponsiveShell.jsx'
import { installAdhanMomentScreenV2 } from './adhanMomentScreenV2.js'
import './index.css'
import './amiriExperiment.css'
import './bodoniNumbers.css'
import './playerControlsCenter.css'
import './dailyCardMotion.css'
import './profilePagePolish.css'
import './globalScrollbar.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SakinahResponsiveShell />
  </React.StrictMode>,
)

/* Muslim Mirror cleanup contract:
   React owns rendered layout/content. Legacy DOM-patching installers that
   append overlays, rewrite text/innerHTML, hide nodes, or observe the whole
   application tree are intentionally not started here. The Adhan moment is
   kept because it is an explicit runtime feature opened by an event, not a
   continuous layout patcher. */
installAdhanMomentScreenV2()

if ("serviceWorker" in navigator) {
  const localHost=["localhost","127.0.0.1","::1"].includes(window.location.hostname)
  if(localHost){
    navigator.serviceWorker.getRegistrations().then(list=>Promise.all(list.map(r=>r.unregister()))).catch(()=>{})
    if("caches" in window)caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith("sakinah-")).map(k=>caches.delete(k)))).catch(()=>{})
  }else{
    window.addEventListener("load",()=>navigator.serviceWorker.register("/sw.js").catch(()=>{}))
  }
}