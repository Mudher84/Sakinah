import React from 'react'
import ReactDOM from 'react-dom/client'
import SakinahResponsiveShell from './SakinahResponsiveShell.jsx'
import { installTypographyBoost } from './typographyBoost.js'
import { installCelestialArc } from './celestialArc.js'
import { installHeroAtmosphere } from './heroAtmosphere.js'
import { installTimeFormatToggle } from './timeFormatToggle.js'
import { installPreviewToggle } from './previewToggle.js'
import { installGlobalBackButtons } from './globalBackButtons.js'
import { installFixedTitleMorph } from './fixedTitleMorph.js'
import { installAdhanMomentScreenV2 } from './adhanMomentScreenV2.js'
import { installAdhanKazanBackground } from './adhanBackgroundKazan.js'
import { installHideHadithSourceFooter } from './hideHadithSourceFooter.js'
import { installModernHadithCategoryIcons } from './modernHadithCategoryIcons.js'
import { installModernFamilyIcons } from './modernFamilyIcons.js'
import { installModernPersonalIcons } from './modernPersonalIcons.js'
import { installModernSystemIcons } from './modernSystemIcons.js'
import { installQuranSurahDownload } from './quranSurahDownload.js'
import { installQuranSurahAutoPlay } from './quranSurahAutoPlay.js'
import { installQuranPlayerActions } from './quranPlayerActions.js'
import { installLuxuryDockIcons } from './luxuryDockIcons.js'
import { installLivingHomeExperience } from './livingHomeExperience.js'
import { installLivingHomeRotation } from './livingHomeRotation.js'
import { installAlyamFooter } from './alyamFooter.js'
import './index.css'
import './amiriExperiment.css'
import './bodoniNumbers.css'
import './topbarBrandPulse.css'
import './playerControlsCenter.css'
import './dailyCardMotion.css'
import './profilePagePolish.css'

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
installFixedTitleMorph()
installAdhanMomentScreenV2()
installAdhanKazanBackground()
installHideHadithSourceFooter()
installModernHadithCategoryIcons()
installModernFamilyIcons()
installModernPersonalIcons()
installModernSystemIcons()
installQuranSurahDownload()
installQuranSurahAutoPlay()
installQuranPlayerActions()
installLuxuryDockIcons()
installLivingHomeExperience()
installLivingHomeRotation()
installAlyamFooter()

if ("serviceWorker" in navigator) {
  const localHost=["localhost","127.0.0.1","::1"].includes(window.location.hostname)
  if(localHost){
    navigator.serviceWorker.getRegistrations().then(list=>Promise.all(list.map(r=>r.unregister()))).catch(()=>{})
    if("caches" in window)caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith("sakinah-")).map(k=>caches.delete(k)))).catch(()=>{})
  }else{
    window.addEventListener("load",()=>navigator.serviceWorker.register("/sw.js").catch(()=>{}))
  }
}
