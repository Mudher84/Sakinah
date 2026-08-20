const STYLE_ID="sakinah-adhan-kazan-bg";
const KAZAN_BG="https://commons.wikimedia.org/wiki/Special:Redirect/file/Kazan_Kremlin_Qolsharif_Mosque_08-2016_img2.jpg";

export function installAdhanKazanBackground(){
  if(document.getElementById(STYLE_ID)) return;
  const style=document.createElement("style");
  style.id=STYLE_ID;
  style.textContent=`
    #sakinah-adhan-moment .bg{
      background-image:url('${KAZAN_BG}')!important;
      background-size:cover!important;
      background-position:center 42%!important;
      background-repeat:no-repeat!important;
      filter:saturate(1.05) contrast(1.02) brightness(.68)!important;
      transform:scale(1.015)!important;
    }
    #sakinah-adhan-moment::after{
      content:'Photo: A.Savin · Wikipedia';
      position:absolute;
      left:10px;
      bottom:6px;
      z-index:3;
      font:8px/1.2 system-ui,sans-serif;
      color:rgba(255,255,255,.38);
      pointer-events:none;
    }
  `;
  document.head.appendChild(style);
}
