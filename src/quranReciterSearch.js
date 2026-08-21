function normalizeArabic(value=''){
  return String(value)
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g,'')
    .replace(/[إأآٱ]/g,'ا')
    .replace(/ى/g,'ي')
    .replace(/ؤ/g,'و')
    .replace(/ئ/g,'ي')
    .replace(/ة/g,'ه')
    .replace(/\s+/g,' ')
    .trim();
}

function enhanceDropdown(dropdown){
  if(!dropdown || dropdown.dataset.mmReciterSearch==='1') return;
  const rows=[...dropdown.querySelectorAll(':scope > button')];
  if(!rows.length) return;

  dropdown.dataset.mmReciterSearch='1';

  const wrap=document.createElement('div');
  wrap.className='mm-reciter-search';
  Object.assign(wrap.style,{
    position:'sticky',top:'0',zIndex:'4',padding:'10px 10px 8px',
    background:'#1B2A36',borderBottom:'1px solid rgba(247,244,236,.07)'
  });

  const field=document.createElement('div');
  Object.assign(field.style,{
    height:'40px',display:'flex',alignItems:'center',gap:'8px',
    padding:'0 12px',borderRadius:'12px',background:'rgba(247,244,236,.07)',
    border:'1px solid rgba(192,160,98,.22)'
  });

  const icon=document.createElement('span');
  icon.textContent='⌕';
  Object.assign(icon.style,{fontSize:'18px',color:'#C0A062',lineHeight:'1'});

  const input=document.createElement('input');
  input.type='search';
  input.placeholder='ابحث عن قارئ';
  input.setAttribute('aria-label','البحث عن قارئ');
  Object.assign(input.style,{
    flex:'1',minWidth:'0',border:'0',outline:'0',background:'transparent',
    color:'#F7F4EC',font:'inherit',fontSize:'12px',textAlign:'right',direction:'rtl'
  });

  field.append(icon,input);
  wrap.appendChild(field);
  dropdown.prepend(wrap);

  input.addEventListener('input',()=>{
    const q=normalizeArabic(input.value);
    rows.forEach(row=>{
      const name=normalizeArabic(row.textContent||'');
      row.style.display=!q || name.includes(q) ? '' : 'none';
    });
  });

  requestAnimationFrame(()=>input.focus({preventScroll:true}));
}

function scan(){
  const root=document.querySelector('.mm-quran-player');
  if(!root) return;
  const reciterButtons=[...root.querySelectorAll('button')].filter(b=>{
    const t=(b.textContent||'').trim();
    return t.includes('القارئ') && (t.includes('▼') || t.includes('▲'));
  });
  reciterButtons.forEach(btn=>{
    const host=btn.parentElement;
    if(!host) return;
    const dropdown=[...host.children].find(el=>el!==btn && el.tagName==='DIV' && el.querySelector(':scope > button'));
    if(dropdown) enhanceDropdown(dropdown);
  });
}

export function installQuranReciterSearch(){
  scan();
  const mo=new MutationObserver(scan);
  mo.observe(document.documentElement,{subtree:true,childList:true});
}
