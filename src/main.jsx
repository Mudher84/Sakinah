import React from 'react'
import ReactDOM from 'react-dom/client'
import SakinahResponsiveShell from './SakinahResponsiveShell.jsx'

// Runtime UI installers
import { installTimeFormatToggle } from './timeFormatToggle.js'
import { installPreviewToggle } from './previewToggle.js'
import { installGlobalBackButtons } from './globalBackButtons.js'
import { installAdhanMomentScreenV2 } from './adhanMomentScreenV2.js'
import { installHideHadithSourceFooter } from './hideHadithSourceFooter.js'
import { installLuxuryDockIcons } from './luxuryDockIcons.js'
import { installLuxuryAppIcons } from './luxuryAppIcons.js'
import { installKidsShelfLuxuryIcons } from './kidsShelfLuxuryIcons.js'
import { installRemainingCardLuxuryIcons } from './remainingCardLuxuryIcons.js'
import { installIconHostRepair } from './iconHostRepair.js'
import { installLivingHomeExperience } from './livingHomeExperience.js'
import { installLivingHomeRotation } from './livingHomeRotation.js'
import { installAlyamFooter } from './alyamFooter.js'
import { installBrandIdentity } from './brandIdentity.js'
import { installQuranLiveWaveform } from './quranLiveWaveform.js'
import { installQuranSurahNumberGuard } from './quranSurahNumberGuard.js'
import { installQuranSurahAutoPlay } from './quranSurahAutoPlay.js'
import { installQuranReciterSearch } from './quranReciterSearch.js'
import { installQuranContinuousPlayback } from './quranContinuousPlayback.js'
import { installHadithTodayRowFix } from './hadithTodayRowFix.js'
import { installSupportingTypography } from './supportingTypography.js'

// Global styles
import './index.css'
import './amiriExperiment.css'
import './bodoniNumbers.css'
import './topbarBrandPulse.css'
import './playerControlsCenter.css'
import './dailyCardMotion.css'
import './profilePagePolish.css'
import './globalScrollbar.css'
import './beatlyMirror.css'
import './quranTopTabsFix.css'
import './quranSurahNumberBadges.css'
import './quranSurahCompact.css'
import './quranPlayerControlsPolish.css'
import './quranDockSafeSpace.css'
import './dockSlimGlass.css'
import './globalTypography.css'
import './homeServiceIconCenter.css'
import './searchCairo.css'
import './androidTypography.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SakinahResponsiveShell />
  </React.StrictMode>,
)

installTimeFormatToggle()
installPreviewToggle()
installGlobalBackButtons()
installAdhanMomentScreenV2()
installHideHadithSourceFooter()
installLuxuryDockIcons()
installLuxuryAppIcons()
installKidsShelfLuxuryIcons()
installRemainingCardLuxuryIcons()
installIconHostRepair()
installLivingHomeExperience()
installLivingHomeRotation()
installAlyamFooter()
installBrandIdentity()
installQuranLiveWaveform()
installQuranSurahNumberGuard()
installQuranSurahAutoPlay()
installQuranReciterSearch()
installQuranContinuousPlayback()
installHadithTodayRowFix()
installSupportingTypography()

if ('serviceWorker' in navigator) {
  const localHost=['localhost','127.0.0.1','::1'].includes(window.location.hostname)
  if(localHost){
    navigator.serviceWorker.getRegistrations().then(list=>Promise.all(list.map(r=>r.unregister()))).catch(()=>{})
    if('caches' in window)caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('sakinah-')).map(k=>caches.delete(k)))).catch(()=>{})
  }else{
    window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}))
  }
}
