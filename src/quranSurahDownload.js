const ACTIVE_ATTR='data-sakinah-download-active';

function safeName(value){
 return String(value||'سورة').replace(/[\\/:*?"<>|]+/g,'-').replace(/\s+/g,' ').trim();
}

function currentPlayer(){
 const page=document.querySelector('.sakinah-audio-page');
 if(!page)return null;
 const audio=page.querySelector('audio');
 if(!audio)return null;
 const src=audio.currentSrc||audio.src||'';
 if(!src)return null;
 const text=page.textContent||'';
 const m=text.match(/سورة\s+([^\n·]+)/);
 const surah=safeName(m?.[1]||'سورة');
 return {page,audio,src,surah};
}

function setButtonState(button,state){
 if(!button)return;
 if(state==='loading'){
  button.setAttribute(ACTIVE_ATTR,'1');
  button.dataset.sakinahOriginalHtml=button.innerHTML;
  button.innerHTML='<span style="font-size:18px">⏳</span><span>جارٍ التحميل</span>';
  button.disabled=true;
  button.style.opacity='.9';
  return;
 }
 const original=button.dataset.sakinahOriginalHtml;
 if(original)button.innerHTML=original;
 button.removeAttribute(ACTIVE_ATTR);
 button.disabled=false;
 button.style.opacity='';
 delete button.dataset.sakinahOriginalHtml;
}

async function downloadCurrent(button){
 if(button?.getAttribute(ACTIVE_ATTR)==='1')return;
 const player=currentPlayer();
 if(!player)return;
 setButtonState(button,'loading');
 const filename=`سكينة - سورة ${player.surah}.mp3`;
 try{
  const response=await fetch(player.src,{mode:'cors',cache:'no-store'});
  if(!response.ok)throw new Error(`HTTP ${response.status}`);
  const blob=await response.blob();
  if(!blob.size)throw new Error('empty');
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;
  a.download=filename;
  a.style.display='none';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),30000);
 }catch{
  const a=document.createElement('a');
  a.href=player.src;
  a.download=filename;
  a.target='_blank';
  a.rel='noopener';
  a.style.display='none';
  document.body.appendChild(a);
  a.click();
  a.remove();
 }finally{
  setTimeout(()=>setButtonState(button,'idle'),700);
 }
}

export function installQuranSurahDownload(){
 document.addEventListener('click',event=>{
  const button=event.target.closest?.('button');
  if(!button)return;
  const label=(button.textContent||'').trim();
  if(label!=='تحميل')return;
  if(!button.closest('.sakinah-audio-page'))return;
  event.preventDefault();
  event.stopPropagation();
  downloadCurrent(button);
 },true);
}
