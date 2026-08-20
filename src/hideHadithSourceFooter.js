const TEXT_MARKERS=["HadeethEnc.com","HadithEnc.com","المصدر: HadeethEnc","المصدر: HadithEnc"];
function clean(){
 document.querySelectorAll("section,div,p,small").forEach(el=>{
  const text=(el.textContent||"").trim();
  if(!text)return;
  if(TEXT_MARKERS.some(m=>text.includes(m))&&text.length<220){
   const parent=el.closest("section")||el;
   parent.style.display="none";
  }
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
