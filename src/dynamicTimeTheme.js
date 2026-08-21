function phaseForHour(hour){
  if(hour < 5) return 'deep-night'
  if(hour < 7) return 'fajr'
  if(hour < 11) return 'morning'
  if(hour < 15) return 'day'
  if(hour < 18) return 'afternoon'
  if(hour < 20) return 'sunset'
  return 'night'
}

const THEMES={
  'deep-night':{
    hero:'linear-gradient(180deg,#081522 0%,#0D2131 56%,#0A1825 100%)',glow:'radial-gradient(circle at 78% 22%,rgba(190,205,225,.08),transparent 30%)'
  },
  fajr:{
    hero:'linear-gradient(180deg,#38556B 0%,#8A6D73 52%,#C38A6C 100%)',glow:'radial-gradient(circle at 76% 24%,rgba(255,206,157,.30),transparent 30%)'
  },
  morning:{
    hero:'linear-gradient(180deg,#315F7E 0%,#5F8CA2 54%,#A6B8B7 100%)',glow:'radial-gradient(circle at 80% 24%,rgba(255,221,147,.28),transparent 31%)'
  },
  day:{
    hero:'linear-gradient(180deg,#1F5274 0%,#37769A 54%,#5D8FAB 100%)',glow:'radial-gradient(circle at 80% 22%,rgba(255,224,151,.24),transparent 30%)'
  },
  afternoon:{
    hero:'linear-gradient(180deg,#244D67 0%,#6A7480 54%,#A2766B 100%)',glow:'radial-gradient(circle at 78% 27%,rgba(235,180,104,.26),transparent 31%)'
  },
  sunset:{
    hero:'linear-gradient(180deg,#1C344A 0%,#70566A 50%,#A46158 100%)',glow:'radial-gradient(circle at 76% 31%,rgba(234,147,89,.30),transparent 31%)'
  },
  night:{
    hero:'linear-gradient(180deg,#0A1724 0%,#123047 54%,#102435 100%)',glow:'radial-gradient(circle at 80% 23%,rgba(192,210,230,.09),transparent 30%)'
  }
}

const PREVIEW_ALIASES={
  'deep-night':'deep-night',deepnight:'deep-night',
  fajr:'fajr',dawn:'fajr',
  morning:'morning',
  day:'day',noon:'day',
  afternoon:'afternoon',asr:'afternoon',
  sunset:'sunset',maghrib:'sunset',
  night:'night',isha:'night'
}

function previewPhase(){
  const raw=String(document.documentElement.dataset.mmTime||'').trim().toLowerCase()
  return PREVIEW_ALIASES[raw]||null
}

function ensureStyle(){
  let style=document.getElementById('mm-dynamic-time-theme-style')
  if(style)return style
  style=document.createElement('style')
  style.id='mm-dynamic-time-theme-style'
  style.textContent=`
    .mm-prayer-hero{transition:background 1400ms ease,box-shadow 1200ms ease!important}
    #mm-dynamic-sky-glow{transition:background 1400ms ease!important}
  `
  document.head.appendChild(style)
  return style
}

function clearOldWholePageTheme(root){
  root.classList.remove('mm-time-dark')
  root.style.removeProperty('--mm-time-page')
  root.style.removeProperty('--mm-time-sheet')
  root.style.removeProperty('--mm-time-paper')
  root.style.removeProperty('--mm-time-text')
  root.style.removeProperty('--mm-time-muted')
  root.style.removeProperty('background')
  root.style.removeProperty('color')
  const frame=root.querySelector('.mm-reference-frame')
  const sheet=root.querySelector('.mm-reference-sheet')
  if(frame)frame.style.removeProperty('background')
  if(sheet)sheet.style.removeProperty('background')
  root.querySelectorAll('section:not(.mm-prayer-hero)').forEach(section=>section.style.removeProperty('background'))
}

function applyTheme(){
  const root=document.querySelector('.mm-reference-home')
  if(!root)return
  const d=new Date()
  const hour=d.getHours()+d.getMinutes()/60
  const phase=previewPhase()||phaseForHour(hour)
  const t=THEMES[phase]
  if(!t)return

  clearOldWholePageTheme(root)

  const hero=root.querySelector('.mm-prayer-hero')
  if(!hero)return
  if(hero.dataset.timeTheme===phase)return
  hero.dataset.timeTheme=phase
  hero.style.background=t.hero
  hero.style.boxShadow=phase==='night'||phase==='deep-night'
    ?'0 18px 46px -30px rgba(0,0,0,.9)'
    :'0 18px 45px -32px rgba(8,31,48,.75)'

  let glow=document.getElementById('mm-dynamic-sky-glow')
  if(!glow){
    glow=document.createElement('div')
    glow.id='mm-dynamic-sky-glow'
    Object.assign(glow.style,{position:'absolute',inset:'0',zIndex:'-1',pointerEvents:'none'})
    hero.prepend(glow)
  }
  glow.style.background=t.glow
}

export function installDynamicTimeTheme(){
  ensureStyle()
  const start=()=>{
    applyTheme()
    const root=document.getElementById('root')
    const mo=new MutationObserver(()=>requestAnimationFrame(applyTheme))
    if(root)mo.observe(root,{subtree:true,childList:true})
    const htmlObserver=new MutationObserver(()=>{
      const hero=document.querySelector('.mm-prayer-hero')
      if(hero)delete hero.dataset.timeTheme
      requestAnimationFrame(applyTheme)
    })
    htmlObserver.observe(document.documentElement,{attributes:true,attributeFilter:['data-mm-time']})
    setInterval(applyTheme,60000)
    window.addEventListener('focus',applyTheme)
    window.mmPreviewTimeTheme=(phase)=>{
      if(phase==null||phase===''||phase==='auto') delete document.documentElement.dataset.mmTime
      else document.documentElement.dataset.mmTime=String(phase)
      return document.documentElement.dataset.mmTime||'auto'
    }
  }
  requestAnimationFrame(()=>requestAnimationFrame(start))
}
