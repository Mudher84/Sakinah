const BRAND_EN="Muslim Mirror";
const BRAND_AR="مِرْآةُ الْمُسْلِمِ";
const HOME_NAVY="#102D43";

function cleanText(value){
 if(!value)return value;
 return value
  .replace(/SAKINAH/gi,BRAND_EN)
  .replace(/صباح\s+السكينة/g,"صباح الخير")
  .replace(/مساء\s+السكينة/g,"مساء الخير")
  .replace(/لحظة\s+سكينة/g,"لحظة هادئة")
  .replace(/سكينة/g,BRAND_AR);
}
function cleanVisibleText(root=document.body){
 if(!root)return;
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
 const nodes=[];
 while(walker.nextNode())nodes.push(walker.currentNode);
 for(const node of nodes){
  const next=cleanText(node.nodeValue||"");
  if(next!==node.nodeValue)node.nodeValue=next;
 }
}
function ensureHomeHeaderStyle(){
 if(document.getElementById("mm-home-header-ownership"))return;
 const style=document.createElement("style");
 style.id="mm-home-header-ownership";
 style.textContent=`
 html.mm-home-mounted .topbar,
 html.mm-home-mounted .phone>.topbar,
 html.mm-home-mounted main>.topbar,
 html.mm-home-mounted [data-mm-legacy-home-header="1"]{
  display:none!important;
  visibility:hidden!important;
  opacity:0!important;
  pointer-events:none!important;
  height:0!important;
  min-height:0!important;
  padding:0!important;
  margin:0!important;
  border:0!important;
  overflow:hidden!important;
 }
 html.mm-home-mounted .screen{padding-top:0!important}
 html.mm-home-mounted .responsiveAppStage,
 html.mm-home-mounted .appShell,
 html.mm-home-mounted .phone,
 html.mm-home-mounted .phone main,
 html.mm-home-mounted .phone .screen{
  background:${HOME_NAVY}!important;
 }
 `;
 document.head.appendChild(style);
}
function clearLegacyHomeHeaderMarks(){
 document.querySelectorAll('[data-mm-legacy-home-header="1"]').forEach(el=>el.removeAttribute("data-mm-legacy-home-header"));
}
function markActualLegacyHeader(){
 const nodes=[...document.querySelectorAll("body *")].filter(el=>{
  if(el.closest?.(".mm-reference-home"))return false;
  const direct=[...el.childNodes].some(n=>n.nodeType===Node.TEXT_NODE&&(n.nodeValue||"").trim()===BRAND_EN);
  return direct||(el.children.length===0&&(el.textContent||"").trim()===BRAND_EN);
 });
 for(const node of nodes){
  let el=node;
  for(let i=0;i<5&&el&&el!==document.body;i++,el=el.parentElement){
   const r=el.getBoundingClientRect();
   if(r.height>=36&&r.height<=100&&r.width>=Math.min(280,window.innerWidth*.62)){
    el.setAttribute("data-mm-legacy-home-header","1");
    break;
   }
  }
 }
}
function syncHomeHeader(){
 const home=!!document.querySelector(".mm-reference-home");
 document.documentElement.classList.toggle("mm-home-mounted",home);
 clearLegacyHomeHeaderMarks();
 if(home)markActualLegacyHeader();
}
export function installBrandIdentity(){
 document.documentElement.dataset.brandEn=BRAND_EN;
 document.documentElement.dataset.brandAr=BRAND_AR;
 if(!document.title||/Sakinah|سكينة/i.test(document.title))document.title=BRAND_EN;
 ensureHomeHeaderStyle();
 cleanVisibleText();
 syncHomeHeader();
 let queued=false;
 const run=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;cleanVisibleText();syncHomeHeader()})};
 new MutationObserver(run).observe(document.body,{childList:true,subtree:true,characterData:true});
 window.addEventListener("resize",run);
 window.addEventListener("sakinah:global-root",run);
 window.addEventListener("sakinah:feature",run);
 window.addEventListener("muslimmirror:dock",run);
}

export const MuslimMirrorBrand={en:BRAND_EN,ar:BRAND_AR};
