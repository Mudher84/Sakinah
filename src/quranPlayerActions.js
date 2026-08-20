const FAVORITES_KEY='sakinah-quran-favorites-v1';

function readFavorites(){
 try{const v=JSON.parse(localStorage.getItem(FAVORITES_KEY)||'[]');return Array.isArray(v)?v:[]}catch{return []}
}
function writeFavorites(v){try{localStorage.setItem(FAVORITES_KEY,JSON.stringify(v));return true}catch{return false}}
function currentInfo(actions){
 const card=actions.closest('.sakinah-player-card');
 const audio=card?.parentElement?.querySelector('audio')||document.querySelector('.sakinah-audio-page audio');
 const src=audio?.currentSrc||audio?.src||'';
 const text=card?.textContent||'';
 const surah=(text.match(/سورة\s+([^·\n]+)/)?.[1]||'السورة').trim();
 const buttons=card?[...card.querySelectorAll('button')]:[];
 const reciter=(buttons.find(b=>!/إعادة|المفضلة|تحميل|قائمة السور/.test(b.textContent||'')&&(b.textContent||'').trim().length>2)?.textContent||'').trim();
 return {src,surah,reciter};
}
function safeName(s){return String(s||'surah').replace(/[\\/:*?"<>|]+/g,'-').trim()||'surah'}
async function downloadSurah(actions,button){
 const {src,surah,reciter}=currentInfo(actions);if(!src)return;
 const old=button.style.opacity;button.style.opacity='1';button.setAttribute('aria-busy','true');
 try{
  const r=await fetch(src,{mode:'cors'});if(!r.ok)throw new Error('download');
  const blob=await r.blob(),url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download=`سورة ${safeName(surah)}${reciter?` - ${safeName(reciter)}`:''}.mp3`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
 }catch{
  const a=document.createElement('a');a.href=src;a.download=`سورة ${safeName(surah)}.mp3`;a.target='_blank';a.rel='noopener';document.body.appendChild(a);a.click();a.remove();
 }finally{button.removeAttribute('aria-busy');button.style.opacity=old||'.72'}
}
function toggleFavorite(actions,button){
 const info=currentInfo(actions);if(!info.src)return;
 const list=readFavorites(),i=list.findIndex(x=>x.src===info.src);
 if(i>=0)list.splice(i,1);else list.unshift({...info,savedAt:Date.now()});
 writeFavorites(list);paintFavorite(actions,button);
 window.dispatchEvent(new CustomEvent('sakinah:quran-favorites-changed',{detail:{count:list.length}}));
}
function paintFavorite(actions,button){
 const {src}=currentInfo(actions),saved=!!src&&readFavorites().some(x=>x.src===src);
 button.dataset.saved=saved?'1':'0';button.style.color=saved?'#e1c37a':'white';button.style.opacity=saved?'1':'.72';
 const icon=button.querySelector('span');if(icon)icon.textContent=saved?'♥':'♡';
}
function enhance(){
 document.querySelectorAll('.sakinah-actions').forEach(actions=>{
  const buttons=[...actions.querySelectorAll(':scope > button')];
  buttons.forEach(btn=>{
   const txt=(btn.textContent||'').trim();
   let role='';if(txt.includes('المفضلة'))role='favorite';else if(txt.includes('تحميل'))role='download';else if(txt.includes('إعادة'))role='repeat';else if(txt.includes('قائمة السور'))role='surahs';
   if(!role)return;btn.dataset.quranAction=role;btn.title=role==='favorite'?'المفضلة':role==='download'?'تحميل السورة':role==='repeat'?'إعادة التشغيل':'قائمة السور';btn.setAttribute('aria-label',btn.title);
   const spans=[...btn.querySelectorAll(':scope > span')];if(spans.length>1)spans.slice(1).forEach(s=>{s.style.display='none'});
   btn.style.gap='0';
   if(role==='favorite'){paintFavorite(actions,btn);if(!btn.dataset.quranBound){btn.dataset.quranBound='1';btn.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();toggleFavorite(actions,btn)},true)}}
   if(role==='download'&&!btn.dataset.quranBound){btn.dataset.quranBound='1';btn.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();downloadSurah(actions,btn)},true)}
  })
 })
}
export function installQuranPlayerActions(){
 enhance();let queued=false;const run=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;enhance()})};
 new MutationObserver(run).observe(document.body,{childList:true,subtree:true});
 window.addEventListener('sakinah:feature',run);document.addEventListener('click',run,true);
}
