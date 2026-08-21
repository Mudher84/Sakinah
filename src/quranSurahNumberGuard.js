const ARABIC_DIGITS=['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
const toArabic=n=>String(n).replace(/\d/g,d=>ARABIC_DIGITS[Number(d)]);

function repairSurahNumbers(){
  const cards=[...document.querySelectorAll('.mm-quran-player .mm-surah-card')];
  cards.forEach((card,index)=>{
    const slot=card.querySelector(':scope > span:first-child');
    if(!slot)return;
    const expected=toArabic(index+1);
    if(slot.textContent!==expected || slot.children.length){
      slot.replaceChildren(document.createTextNode(expected));
    }
    slot.setAttribute('data-mm-surah-number',expected);
    slot.setAttribute('aria-label',`رقم السورة ${expected}`);
    Object.assign(slot.style,{
      fontFamily:'monospace',
      fontSize:'10px',
      color:'#B08D4F',
      minWidth:'22px',
      textAlign:'center',
      background:'transparent',
      boxShadow:'none'
    });
  });
}

export function installQuranSurahNumberGuard(){
  let queued=false;
  const schedule=()=>{
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{queued=false;repairSurahNumbers();});
  };
  repairSurahNumbers();
  const observer=new MutationObserver(schedule);
  observer.observe(document.documentElement,{subtree:true,childList:true,characterData:true});
  window.addEventListener('beforeunload',()=>observer.disconnect(),{once:true});
}
