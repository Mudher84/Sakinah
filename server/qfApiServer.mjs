import http from 'node:http';
import { URL } from 'node:url';
import { qfGet, listTafsirs, tafsirByVerse } from './quranFoundationProxy.mjs';

const port=Number(process.env.SAKINAH_API_PORT||8787);
const json=(res,status,body)=>{res.writeHead(status,{"content-type":"application/json; charset=utf-8","cache-control":"no-store"});res.end(JSON.stringify(body))};
const safeError=(res,e)=>json(res,500,{ok:false,error:e?.message||'server error'});

const server=http.createServer(async(req,res)=>{
  const u=new URL(req.url||'/',`http://${req.headers.host||'localhost'}`);
  if(req.method!=='GET')return json(res,405,{ok:false,error:'method not allowed'});
  try{
    if(u.pathname==='/api/qf/status'){
      const configured=Boolean(process.env.QF_CLIENT_ID&&process.env.QF_CLIENT_SECRET);
      if(!configured)return json(res,200,{ok:true,configured:false,environment:process.env.QF_ENV||'production'});
      const chapters=await qfGet('/content/api/v4/chapters');
      return json(res,200,{ok:true,configured:true,environment:process.env.QF_ENV||'production',chapters:Array.isArray(chapters?.chapters)?chapters.chapters.length:null});
    }
    if(u.pathname==='/api/qf/tafsirs'){
      const language=u.searchParams.get('language')||'ar';
      return json(res,200,await listTafsirs(language));
    }
    if(u.pathname==='/api/qf/tafsir'){
      const resourceId=u.searchParams.get('resourceId');
      const verseKey=u.searchParams.get('verseKey');
      if(!resourceId||!verseKey)return json(res,400,{ok:false,error:'resourceId and verseKey are required'});
      return json(res,200,await tafsirByVerse(resourceId,verseKey));
    }
    if(u.pathname==='/api/qf/hadith-references'){
      const ayahKey=u.searchParams.get('ayahKey');
      const language=u.searchParams.get('language')||'en';
      if(!ayahKey)return json(res,400,{ok:false,error:'ayahKey is required'});
      return json(res,200,await qfGet(`/content/api/v4/hadith-references/${encodeURIComponent(ayahKey)}`,{language}));
    }
    return json(res,404,{ok:false,error:'not found'});
  }catch(e){safeError(res,e)}
});

server.listen(port,()=>console.log(`Sakinah Quran Foundation proxy listening on :${port}`));
