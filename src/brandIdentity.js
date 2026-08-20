const BRAND_EN="Muslim Mirror";
const BRAND_AR="مِرْآةُ الْمُسْلِمِ";

function replaceText(root=document.body){
 if(!root)return;
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
 const nodes=[];
 while(walker.nextNode())nodes.push(walker.currentNode);
 for(const node of nodes){
  const value=node.nodeValue;
  if(!value)continue;
  const trimmed=value.trim();
  if(trimmed==="SAKINAH")node.nodeValue=value.replace("SAKINAH",BRAND_EN);
  else if(trimmed==="سكينة")node.nodeValue=value.replace("سكينة",BRAND_AR);
 }
 document.querySelectorAll('[title],[aria-label]').forEach(el=>{
  for(const attr of ["title","aria-label"]){
   const value=el.getAttribute(attr);
   if(value==="SAKINAH")el.setAttribute(attr,BRAND_EN);
   else if(value==="سكينة")el.setAttribute(attr,BRAND_AR);
  }
 });
 document.documentElement.dataset.brandEn=BRAND_EN;
 document.documentElement.dataset.brandAr=BRAND_AR;
 if(document.title==="Sakinah"||document.title==="سكينة"||document.title.includes("Sakinah"))document.title=BRAND_EN;
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
