const FALLBACK_DATA={
 data:{
  timings:{Fajr:'04:18',Dhuhr:'12:07',Asr:'15:43',Maghrib:'18:35',Isha:'19:58'},
  date:{hijri:{day:'8',month:{ar:'ربيع الأول'},year:'1448'}}
 }
};

function fallbackResponse(){
 return new Response(JSON.stringify(FALLBACK_DATA),{
  status:200,
  headers:{'Content-Type':'application/json'}
 });
}

export function installPrayerFetchFallback(){
 const original=window.fetch?.bind(window);
 if(!original)return;
 window.fetch=async(input,init)=>{
  const url=typeof input==='string'?input:input?.url||'';
  if(!url.includes('api.aladhan.com/v1/timings'))return original(input,init);
  try{
   const controller=new AbortController();
   const timer=setTimeout(()=>controller.abort(),4500);
   const response=await original(input,{...init,signal:controller.signal});
   clearTimeout(timer);
   if(response?.ok)return response;
  }catch{}
  return fallbackResponse();
 };
}
