const BRAND_EN="Muslim Mirror";
const BRAND_AR="مِرْآةُ الْمُسْلِمِ";

function cleanText(value){
 if(!value)return value;
 return value
  .replace(/SAKINAH/gi,BRAND_EN)
  .replace(/صباح\s+السكينة/g,"صباح الخير")
  .replace(/مساء\s+السكينة/g,"مساء الخير")
  .replace(/لحظة\s+سكينة/g,"لحظة هادئة")
  .replace(/^\s*سكينة\s*$/g,BRAND_AR);
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
export function installBrandIdentity(){
 document.documentElement.dataset.brandEn=BRAND_EN;
 document.documentElement.dataset.brandAr=BRAND_AR;
 if(!document.title||/Sakinah|سكينة/i.test(document.title))document.title=BRAND_EN;
 cleanVisibleText();
 let queued=false;
 const run=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;cleanVisibleText()})};
 new MutationObserver(run).observe(document.body,{childList:true,subtree:true,characterData:true});
}

export const MuslimMirrorBrand={en:BRAND_EN,ar:BRAND_AR};
