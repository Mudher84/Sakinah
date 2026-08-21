import React from 'react'
import ReactDOM from 'react-dom/client'
import SakinahResponsiveShell from './SakinahResponsiveShell.jsx'
import DevMobileTest from './DevMobileTest.jsx'
import { installCelestialArc } from './celestialArc.js'
import { installHeroAtmosphere } from './heroAtmosphere.js'
import { installTimeFormatToggle } from './timeFormatToggle.js'
import { installPreviewToggle } from './previewToggle.js'
import { installGlobalBackButtons } from './globalBackButtons.js'
import { installAdhanMomentScreenV2 } from './adhanMomentScreenV2.js'
import { installHideHadithSourceFooter } from './hideHadithSourceFooter.js'
import { installModernFamilyIcons } from './modernFamilyIcons.js'
import { installModernPersonalIcons } from './modernPersonalIcons.js'
import { installModernSystemIcons } from './modernSystemIcons.js'
import { installLuxuryDockIcons } from './luxuryDockIcons.js'
import { installLuxuryAppIcons } from './luxuryAppIcons.js'
import { installLivingHomeExperience } from './livingHomeExperience.js'
import { installLivingHomeRotation } from './livingHomeRotation.js'
import { installAlyamFooter } from './alyamFooter.js'
import { installBrandIdentity } from './brandIdentity.js'
import './index.css'
import './amiriExperiment.css'
import './bodoniNumbers.css'
import './topbarBrandPulse.css'
import './playerControlsCenter.css'
import './dailyCardMotion.css'
import './profilePagePolish.css'
import './globalScrollbar.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SakinahResponsiveShell />
    <DevMobileTest />
  </React.StrictMode>,
)

installCelestialArc()
installHeroAtmosphere()
installTimeFormatToggle()
installPreviewToggle()
installGlobalBackButtons()
installAdhanMomentScreenV2()
installHideHadithSourceFooter()
installModernFamilyIcons()
installModernPersonalIcons()
installModernSystemIcons()
installLuxuryDockIcons()
installLuxuryAppIcons()
installLivingHomeExperience()
installLivingHomeRotation()
installAlyamFooter()
installBrandIdentity()

if ("serviceWorker" in navigator) {
  const localHost=["localhost","127.0.0.1","::1"].includes(window.location.hostname)
  if(localHost){
    navigator.serviceWorker.getRegistrations().then(list=>Promise.all(list.map(r=>r.unregister()))).catch(()=>{})
    if("caches" in window)caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith("sakinah-")).map(k=>caches.delete(k)))).catch(()=>{})
  }else{
    window.addEventListener("load",()=>navigator.serviceWorker.register("/sw.js").catch(()=>{}))
  }
}
