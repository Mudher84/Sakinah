const TEXT_MARKERS=["HadeethEnc.com","HadithEnc.com","المصدر: HadeethEnc","المصدر: HadithEnc"];

function isSourceLeaf(el){
 if(!el||el.children.length>0)return false;
 const text=(el.textContent||"").trim();
 if(!text||text.length>180)return false;
 return TEXT_MARKERS.some(m=>text.includes(m));
}

function clean(){
 document.querySelectorAll("p,small,div").forEach(el=>{
  if(!isSourceLeaf(el))return;
  el.style.display="none";
 });
}

export function installHideHadithSourceFooter(){
 clean();
 let queued=false;
 const run=()=>{
  if(queued)return;
  queued=true;
  requestAnimationFrame(()=>{queued=false;clean()});
 };
 new MutationObserver(run).observe(document.body,{childList:true,subtree:true});
 window.addEventListener("sakinah:feature",run);
}
