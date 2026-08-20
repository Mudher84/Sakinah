const BRAND_EN="Muslim Mirror";
const BRAND_AR="مِرْآةُ الْمُسْلِمِ";

function replaceVisible(value){
 if(!value)return value;
 let out=value.replace(/SAKINAH/gi,BRAND_EN).replace(/\bSakinah\b/g,BRAND_EN);
 const trimmed=out.trim();
 if(trimmed==="سكينة")return out.replace("سكينة",BRAND_AR);
 out=out.replace(/مساء\s+السكينة/g,"مساء الخير")
        .replace(/صباح\s+السكينة/g,"صباح الخير")
        .replace(/لحظة\s+سكينة/g,"لحظة هادئة")
        .replace(/\bسكينة\b/g,"")
        .replace(/\s+·\s*$/g,"")
        .replace(/\s{2,}/g," ");
 return out;
}

function replaceText(root=document.body){
 if(!root)return;
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
 const nodes=[];
 while(walker.nextNode())nodes.push(walker.currentNode);
 for(const node of nodes){
  const value=node.nodeValue;
  if(!value)continue;
  const next=replaceVisible(value);
  if(next!==value)node.nodeValue=next;
 }
 document.querySelectorAll('[title],[aria-label]').forEach(el=>{
  for(const attr of ["title","aria-label"]){
   const value=el.getAttribute(attr);
   if(!value)continue;
   const next=replaceVisible(value);
   if(next!==value)el.setAttribute(attr,next);
  }
 });
 document.documentElement.dataset.brandEn=BRAND_EN;
 document.documentElement.dataset.brandAr=BRAND_AR;
 if(/Sakinah|سكينة/i.test(document.title))document.title=BRAND_EN;
}

export function installBrandIdentity(){
 replaceText();
 let queued=false;
 const run=()=>{
  if(queued)return;
  queued=true;
  requestAnimationFrame(()=>{queued=false;replaceText()});
 };
 new MutationObserver(run).observe(document.body,{childList:true,subtree:true,characterData:true});
 window.addEventListener("sakinah:feature",run);
 window.addEventListener("sakinah:global-root",run);
}

export const MuslimMirrorBrand={en:BRAND_EN,ar:BRAND_AR};