const FALLBACK_POSITION={
 coords:{latitude:33.3152,longitude:44.3661,accuracy:50000,altitude:null,altitudeAccuracy:null,heading:null,speed:null},
 timestamp:Date.now()
};

export function installGeolocationFallback(){
 const nativeGeo=navigator.geolocation;
 if(!nativeGeo?.getCurrentPosition)return;
 const original=nativeGeo.getCurrentPosition.bind(nativeGeo);
 const fallback=reason=>({...FALLBACK_POSITION,timestamp:Date.now(),_mmFallbackReason:reason||'unavailable'});
 const getCurrentPosition=(success,error,options)=>{
  let settled=false;
  const ok=position=>{if(settled)return;settled=true;success?.(position)};
  const fail=err=>{
   if(settled)return;
   const pos=fallback(err?.code);
   ok(pos);
   window.dispatchEvent(new CustomEvent('muslimmirror:location-fallback',{detail:{reason:err?.code||'unavailable'}}));
  };
  const timer=setTimeout(()=>fail({code:'timeout'}),4500);
  const wrappedOk=position=>{clearTimeout(timer);ok(position)};
  const wrappedFail=err=>{clearTimeout(timer);fail(err)};
  try{original(wrappedOk,wrappedFail,{...options,timeout:Math.min(options?.timeout||4000,4000),maximumAge:300000})}catch(err){wrappedFail(err)}
 };
 const proxy={
  getCurrentPosition,
  watchPosition:(success,error,options)=>nativeGeo.watchPosition?.(success,error,options),
  clearWatch:id=>nativeGeo.clearWatch?.(id)
 };
 let installed=false;
 try{
  Object.defineProperty(navigator,'geolocation',{configurable:true,get:()=>proxy});
  installed=navigator.geolocation===proxy;
 }catch{}
 if(!installed){
  try{Object.defineProperty(nativeGeo,'getCurrentPosition',{configurable:true,value:getCurrentPosition});installed=true}catch{}
 }
 if(!installed){
  try{nativeGeo.getCurrentPosition=getCurrentPosition}catch{}
 }
}
