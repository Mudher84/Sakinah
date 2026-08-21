const FALLBACK_POSITION={
 coords:{latitude:33.3152,longitude:44.3661,accuracy:50000,altitude:null,altitudeAccuracy:null,heading:null,speed:null},
 timestamp:Date.now()
};

export function installGeolocationFallback(){
 const geo=navigator.geolocation;
 if(!geo)return;
 const original=geo.getCurrentPosition?.bind(geo);
 if(!original)return;
 try{
  geo.getCurrentPosition=(success,error,options)=>{
   let settled=false;
   const ok=position=>{if(settled)return;settled=true;success?.(position)};
   const fail=err=>{
    if(settled)return;
    // The new home must never remain as --:-- just because browser/device
    // location permission is unavailable. Use Baghdad as a coarse Iraq
    // fallback; real device coordinates still win whenever permission works.
    ok({...FALLBACK_POSITION,timestamp:Date.now()});
    window.dispatchEvent(new CustomEvent('muslimmirror:location-fallback',{detail:{reason:err?.code||'unavailable'}}));
   };
   try{original(ok,fail,{...options,timeout:Math.min(options?.timeout||8000,8000)})}catch(err){fail(err)}
  };
 }catch{}
}
