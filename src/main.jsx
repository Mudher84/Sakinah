import React from 'react'
import ReactDOM from 'react-dom/client'
import SakinahResponsiveShell from './SakinahResponsiveShell.jsx'
import { installTypographyBoost } from './typographyBoost.js'
import { installCelestialArc } from './celestialArc.js'
import { installHeroAtmosphere } from './heroAtmosphere.js'
import { installTimeFormatToggle } from './timeFormatToggle.js'
import { installPreviewToggle } from './previewToggle.js'
import { installProfileHook } from './profileHook.js'
import { installGlobalBackButtons } from './globalBackButtons.js'
import './index.css'
import './amiriExperiment.css'

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
installProfileHook()
installGlobalBackButtons()

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(()=>{}));
}
