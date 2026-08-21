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
    page:'#0A1521',sheet:'#0D1B28',hero:'linear-gradient(180deg,#081522 0%,#0D2131 56%,#0A1825 100%)',paper:'#142431',text:'#EDF2F5',muted:'#A8B1B9',glow:'radial-gradient(circle at 78% 22%,rgba(190,205,225,.08),transparent 30%)'
  },
  fajr:{
    page:'#E9E1DA',sheet:'#F2EBE4',hero:'linear-gradient(180deg,#38556B 0%,#8A6D73 52%,#C38A6C 100%)',paper:'#FFF9F3',text:'#20394A',muted:'#7D8187',glow:'radial-gradient(circle at 76% 24%,rgba(255,206,157,.30),transparent 30%)'
  },
  morning:{
    page:'#F4EFE5',sheet:'#F8F4EC',hero:'linear-gradient(180deg,#315F7E 0%,#5F8CA2 54%,#A6B8B7 100%)',paper:'#FFFDF8',text:'#1C3B50',muted:'#838D94',glow:'radial-gradient(circle at 80% 24%,rgba(255,221,147,.28),transparent 31%)'
  },
  day:{
    page:'#F6F1E7',sheet:'#F8F4EC',hero:'linear-gradient(180deg,#1F5274 0%,#37769A 54%,#5D8FAB 100%)',paper:'#FFFDF9',text:'#1B3A50',muted:'#8C949B',glow:'radial-gradient(circle at 80% 22%,rgba(255,224,151,.24),transparent 30%)'
  },
  afternoon:{
    page:'#F3ECE0',sheet:'#F7F1E7',hero:'linear-gradient(180deg,#244D67 0%,#6A7480 54%,#A2766B 100%)',paper:'#FFF9F1',text:'#213847',muted:'#8E8783',glow:'radial-gradient(circle at 78% 27%,rgba(235,180,104,.26),transparent 31%)'
  },
  sunset:{
    page:'#E9DED2',sheet:'#F0E6DD',hero:'linear-gradient(180deg,#1C344A 0%,#70566A 50%,#A46158 100%)',paper:'#FFF7EF',text:'#243643',muted:'#8E7D79',glow:'radial-gradient(circle at 76% 31%,rgba(234,147,89,.30),transparent 31%)'
  },
  night:{
    page:'#101C28',sheet:'#132331',hero:'linear-gradient(180deg,#0A1724 0%,#123047 54%,#102435 100%)',paper:'#182A38',text:'#EAF0F3',muted:'#A6B0B7',glow:'radial-gradient(circle at 80% 23%,rgba(192,210,230,.09),transparent 30%)'
  }
}

function ensureStyle(){
  let style=document.getElementById('mm-dynamic-time-theme-style')
  if(style)return style
  style=document.createElement('style')
  style.id='mm-dynamic-time-theme-style'
  style.textContent=`
    .mm-reference-home,
    .mm-reference-frame,
    .mm-reference-sheet{transition:background-color 1200ms ease,color 900ms ease!important}
    .mm-prayer-hero{transition:background 1400ms ease,box-shadow 1200ms ease!important}
    .mm-prayer-hero:before{transition:background 1400ms ease!important}
    .mm-reference-home.mm-time-dark section:not(.mm-prayer-hero){color:var(--mm-time-text)!important}
    .mm-reference-home.mm-time-dark section:not(.mm-prayer-hero) button{color:inherit}
  `
  document.head.appendChild(style)
  return style
}

function applyTheme(){
  const root=document.querySelector('.mm-reference-home')
  if(!root)return
  const d=new Date()
  const hour=d.getHours()+d.getMinutes()/60
  const phase=phaseForHour(hour)
  const t=THEMES[phase]
  if(root.dataset.timeTheme===phase)return
  root.dataset.timeTheme=phase
  root.style.setProperty('--mm-time-page',t.page)
  root.style.setProperty('--mm-time-sheet',t.sheet)
  root.style.setProperty('--mm-time-paper',t.paper)
  root.style.setProperty('--mm-time-text',t.text)
  root.style.setProperty('--mm-time-muted',t.muted)
  root.style.background=t.page
  root.style.color=t.text
  root.classList.toggle('mm-time-dark',phase==='night'||phase==='deep-night')
  const frame=root.querySelector('.mm-reference-frame')
  const sheet=root.querySelector('.mm-reference-sheet')
  const hero=root.querySelector('.mm-prayer-hero')
  if(frame)frame.style.background=t.page
  if(sheet)sheet.style.background=t.sheet
  if(hero){
    hero.style.background=t.hero
    hero.style.boxShadow=phase==='night'||phase==='deep-night'?'0 18px 46px -30px rgba(0,0,0,.9)':'0 18px 45px -32px rgba(8,31,48,.75)'
  }
  let glow=document.getElementById('mm-dynamic-sky-glow')
  if(!glow&&hero){
    glow=document.createElement('div')
    glow.id='mm-dynamic-sky-glow'
    Object.assign(glow.style,{position:'absolute',inset:'0',zIndex:'-1',pointerEvents:'none',transition:'background 1400ms ease'})
    hero.prepend(glow)
  }
  if(glow)glow.style.background=t.glow
  root.querySelectorAll('section:not(.mm-prayer-hero)').forEach(section=>{
    if(section.style.backgroundColor||String(section.style.background).includes('rgb')||String(section.style.background).includes('#FFF')){
      section.style.background=t.paper
    }
  })
}

export function installDynamicTimeTheme(){
  ensureStyle()
  const start=()=>{
    applyTheme()
    const root=document.getElementById('root')
    const mo=new MutationObserver(()=>requestAnimationFrame(applyTheme))
    if(root)mo.observe(root,{subtree:true,childList:true})
    setInterval(applyTheme,60000)
    window.addEventListener('focus',applyTheme)
  }
  requestAnimationFrame(()=>requestAnimationFrame(start))
}
