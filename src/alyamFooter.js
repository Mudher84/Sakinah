const FOOTER_HTML=`<footer class="sakinah-alyam-footer" data-sakinah-alyam-footer="1"><div class="sakinah-alyam-copy">جميع الحقوق محفوظة لاستوديو اليم</div><a href="https://wana84.com/" target="_blank" rel="noopener noreferrer">استوديو اليم - الطباعة والتصميم والبرمجيات</a><a class="sakinah-alyam-brand" dir="ltr" href="https://wana84.com/" target="_blank" rel="noopener noreferrer">ALYAMStudio.</a></footer>`;

function ensureStyle(){
 if(document.getElementById('sakinah-alyam-footer-style'))return;
 const s=document.createElement('style');
 s.id='sakinah-alyam-footer-style';
 s.textContent=`.sakinah-alyam-footer{margin:34px auto 8px;padding:22px 14px 18px;max-width:560px;text-align:center;border-top:1px solid rgba(16,16,15,.075);color:rgba(16,16,15,.56);font-family:inherit;line-height:1.85}.sakinah-alyam-footer .sakinah-alyam-copy{font-size:10.5px;margin-bottom:4px}.sakinah-alyam-footer a{display:block;width:max-content;max-width:100%;margin:2px auto;color:#8c7042;text-decoration:none;font-size:10.5px;transition:opacity .18s ease,color .18s ease}.sakinah-alyam-footer a:hover{color:#173B57}.sakinah-alyam-footer .sakinah-alyam-brand{direction:ltr;unicode-bidi:isolate;font-family:Fraunces,Georgia,serif;font-size:12px;letter-spacing:.04em;color:#173B57;font-weight:600;margin-top:5px}@media(max-width:430px){.sakinah-alyam-footer{margin-top:28px;padding-bottom:20px}.sakinah-alyam-footer .sakinah-alyam-copy,.sakinah-alyam-footer a{font-size:10px}.sakinah-alyam-footer .sakinah-alyam-brand{font-size:11.5px}}`;
 document.head.appendChild(s);
}

function profileScrollRoot(){
 const avatar=document.querySelector('button[aria-label="تغيير صورة البروفايل"],button[aria-label="Change profile image"]');
 if(!avatar)return null;
 let el=avatar.parentElement;
 while(el&&el!==document.body){
  const cs=getComputedStyle(el);
  if((cs.overflowY==='auto'||cs.overflowY==='scroll')&&cs.position==='absolute')return el;
  el=el.parentElement;
 }
 return null;
}

function addFooter(target){
 if(!target||target.querySelector(':scope > [data-sakinah-alyam-footer="1"]'))return;
 target.insertAdjacentHTML('beforeend',FOOTER_HTML);
}

function apply(){
 ensureStyle();
 addFooter(document.querySelector('.sakinah-live-content'));
 addFooter(profileScrollRoot());
}

export function installAlyamFooter(){
 apply();
 let queued=false;
 const run=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply()})};
 new MutationObserver(run).observe(document.body,{childList:true,subtree:true});
 window.addEventListener('sakinah:global-root',run);
 window.addEventListener('sakinah:feature',run);
}
