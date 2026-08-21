const CAIRO='Cairo, Tahoma, Arial, sans-serif';
const QURAN_SELECTOR=[
  '.quranMini','.quranHero','.quranAudioText','.quranMemo','.ayah','.mushaf',
  '[class*="quran-text"]','[class*="quranText"]','[class*="ayah-text"]','[class*="ayahText"]',
  '[data-quran]','[data-ayah]'
].join(',');
const SUPPORT_CLASS='mm-supporting-cairo';

function isQuran(el){
  if(!el||!(el instanceof Element))return false;
  return !!el.closest(QURAN_SELECTOR);
}
function directText(el){
  let out='';
  for(const n of el.childNodes){if(n.nodeType===Node.TEXT_NODE)out+=n.textContent||''}
  return out.replace(/\s+/g,' ').trim();
}
function looksSupporting(el){
  if(!(el instanceof HTMLElement)||isQuran(el))return false;
  if(['SCRIPT','STYLE','SVG','PATH','INPUT','TEXTAREA','SELECT'].includes(el.tagName))return false;
  if(el.closest('button')&&el.tagName!=='SMALL')return false;
  if(/^H[1]$/i.test(el.tagName))return false;
  const cls=`${el.className||''} ${el.id||''}`.toLowerCase();
  if(/subtitle|sub-title|description|desc\b|explainer|explanation|helper|support|caption|meta|eyebrow|sectionlabel|section-label|summary|hint/.test(cls))return true;
  if(el.hasAttribute('data-mm-subtitle')||el.hasAttribute('data-mm-description')||el.hasAttribute('data-mm-explainer'))return true;
  if(el.tagName==='P'||el.tagName==='SMALL')return true;
  if(/^H[23]$/i.test(el.tagName))return true;
  const txt=directText(el);
  if(!txt||txt.length<3||txt.length>240)return false;
  const s=getComputedStyle(el),size=parseFloat(s.fontSize)||16,op=parseFloat(s.opacity||'1');
  const childBlock=[...el.children].some(c=>['DIV','SECTION','ARTICLE','BUTTON','UL','OL'].includes(c.tagName));
  if(childBlock)return false;
  if(size<=13.5&&(op<.82||txt.length>=18))return true;
  return false;
}
function apply(root=document){
  const nodes=root instanceof Element?[root,...root.querySelectorAll('*')]:[...document.querySelectorAll('*')];
  nodes.forEach(el=>{
    if(!(el instanceof HTMLElement))return;
    if(isQuran(el)){el.classList.remove(SUPPORT_CLASS);return}
    if(looksSupporting(el))el.classList.add(SUPPORT_CLASS);
  });
}
function ensureStyle(){
  if(document.getElementById('mm-supporting-typography-runtime'))return;
  const s=document.createElement('style');
  s.id='mm-supporting-typography-runtime';
  s.textContent=`.${SUPPORT_CLASS}{font-family:${CAIRO}!important}.quranMini,.quranHero,.quranAudioText,.quranMemo,.ayah span,.mushaf .ayah span,[class*='quran-text'],[class*='quranText'],[class*='ayah-text'],[class*='ayahText'],[data-quran],[data-ayah]{font-family:'Amiri Quran','Noto Naskh Arabic','Amiri',serif!important}`;
  document.head.appendChild(s);
}
export function installSupportingTypography(){
  ensureStyle();
  apply();
  let queued=false;
  const run=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply()})};
  new MutationObserver(run).observe(document.body,{childList:true,subtree:true,characterData:true});
  ['sakinah:feature','sakinah:native','sakinah:devotion','muslimmirror:dock'].forEach(n=>window.addEventListener(n,run));
}
