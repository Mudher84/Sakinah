package com.sakinah.app;

import android.content.Context;
import androidx.annotation.NonNull;
import androidx.work.Constraints;
import androidx.work.ExistingPeriodicWorkPolicy;
import androidx.work.NetworkType;
import androidx.work.PeriodicWorkRequest;
import androidx.work.WorkManager;
import androidx.work.Worker;
import androidx.work.WorkerParameters;
import org.json.JSONObject;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.TimeUnit;

public final class PrayerRefreshWorker extends Worker {
    private static final String UNIQUE="muslim-mirror-prayer-refresh";
    private static final String[] PRAYERS={"Fajr","Dhuhr","Asr","Maghrib","Isha"};
    private static final DateTimeFormatter API_DATE=DateTimeFormatter.ofPattern("dd-MM-yyyy");

    public PrayerRefreshWorker(@NonNull Context context,@NonNull WorkerParameters params){super(context,params);}

    public static void ensureScheduled(Context c){
        Constraints constraints=new Constraints.Builder().setRequiredNetworkType(NetworkType.CONNECTED).build();
        PeriodicWorkRequest request=new PeriodicWorkRequest.Builder(PrayerRefreshWorker.class,12,TimeUnit.HOURS)
            .setConstraints(constraints)
            .build();
        WorkManager.getInstance(c).enqueueUniquePeriodicWork(UNIQUE,ExistingPeriodicWorkPolicy.UPDATE,request);
    }

    public static void runSoon(Context c){
        androidx.work.OneTimeWorkRequest request=new androidx.work.OneTimeWorkRequest.Builder(PrayerRefreshWorker.class)
            .setConstraints(new Constraints.Builder().setRequiredNetworkType(NetworkType.CONNECTED).build())
            .build();
        WorkManager.getInstance(c).enqueue(request);
    }

    @NonNull @Override public Result doWork(){
        try{
            String raw=getApplicationContext().getSharedPreferences("sakinah",Context.MODE_PRIVATE).getString("bridge_state","");
            if(raw==null||raw.isBlank())return Result.success();
            JSONObject bridge=new JSONObject(raw);
            double lat=bridge.optDouble("latitude",Double.NaN),lon=bridge.optDouble("longitude",Double.NaN);
            if(Double.isNaN(lat)||Double.isNaN(lon))return Result.retry();
            int method=bridge.optInt("method",4);
            JSONObject cfg=bridge.optJSONObject("notifications");
            if(cfg==null)cfg=new JSONObject();

            ZoneId zone;
            try{zone=ZoneId.of(bridge.optString("timezone",ZoneId.systemDefault().getId()));}
            catch(Exception e){zone=ZoneId.systemDefault();}
            LocalDate today=LocalDate.now(zone);
            refreshDate(today,lat,lon,method,cfg);
            refreshDate(today.plusDays(1),lat,lon,method,cfg);
            return Result.success();
        }catch(Exception e){return Result.retry();}
    }

    private void refreshDate(LocalDate date,double lat,double lon,int method,JSONObject cfg)throws Exception{
        JSONObject data=fetch(date,lat,lon,method);
        JSONObject timings=data.getJSONObject("timings");
        String tz=data.optJSONObject("meta")!=null?data.optJSONObject("meta").optString("timezone",ZoneId.systemDefault().getId()):ZoneId.systemDefault().getId();
        ZoneId zone;try{zone=ZoneId.of(tz);}catch(Exception e){zone=ZoneId.systemDefault();}
        for(String p:PRAYERS){
            if(!cfg.optBoolean(p,true))continue;
            String value=clean(timings.optString(p,""));
            if(value.isBlank())continue;
            long at=toEpoch(date,value,zone);
            if(at>System.currentTimeMillis()+30000L)PrayerScheduler.schedule(getApplicationContext(),p,at,"حان وقت صلاة "+ar(p));
        }
        if(cfg.optBoolean("friday",true)&&date.getDayOfWeek()==java.time.DayOfWeek.FRIDAY){
            long at=LocalDateTime.of(date,LocalTime.of(9,0)).atZone(zone).toInstant().toEpochMilli();
            if(at>System.currentTimeMillis()+30000L)PrayerScheduler.schedule(getApplicationContext(),"FridayReminder",at,"تذكير يوم الجمعة");
        }
        JSONObject hijri=data.optJSONObject("date")!=null?data.optJSONObject("date").optJSONObject("hijri"):null;
        if(cfg.optBoolean("ramadan",true)&&hijri!=null&&hijri.optJSONObject("month")!=null&&hijri.optJSONObject("month").optInt("number",0)==9){
            String fajr=clean(timings.optString("Fajr",""));
            if(!fajr.isBlank()){
                long at=toEpoch(date,fajr,zone)-30L*60L*1000L;
                if(at>System.currentTimeMillis()+30000L)PrayerScheduler.schedule(getApplicationContext(),"RamadanReminder",at,"تذكير رمضان قبل الفجر");
            }
        }
    }

    private JSONObject fetch(LocalDate date,double lat,double lon,int method)throws Exception{
        String endpoint="https://api.aladhan.com/v1/timings/"+API_DATE.format(date)+"?latitude="+enc(String.valueOf(lat))+"&longitude="+enc(String.valueOf(lon))+"&method="+method;
        HttpURLConnection c=(HttpURLConnection)new URL(endpoint).openConnection();
        c.setConnectTimeout(12000);c.setReadTimeout(12000);c.setRequestProperty("Accept","application/json");
        int code=c.getResponseCode();if(code<200||code>=300)throw new IllegalStateException("HTTP "+code);
        StringBuilder s=new StringBuilder();try(BufferedReader r=new BufferedReader(new InputStreamReader(c.getInputStream(),StandardCharsets.UTF_8))){String line;while((line=r.readLine())!=null)s.append(line);}finally{c.disconnect();}
        JSONObject root=new JSONObject(s.toString());JSONObject data=root.optJSONObject("data");if(data==null)throw new IllegalStateException("No data");return data;
    }

    private static String enc(String s){return URLEncoder.encode(s,StandardCharsets.UTF_8);}
    private static String clean(String s){int i=s.indexOf(' ');return (i>=0?s.substring(0,i):s).trim();}
    private static long toEpoch(LocalDate date,String hhmm,ZoneId zone){String[] a=hhmm.split(":");int h=Integer.parseInt(a[0]),m=Integer.parseInt(a[1]);return ZonedDateTime.of(date,LocalTime.of(h,m),zone).toInstant().toEpochMilli();}
    private static String ar(String p){switch(p){case"Fajr":return"الفجر";case"Dhuhr":return"الظهر";case"Asr":return"العصر";case"Maghrib":return"المغرب";case"Isha":return"العشاء";default:return p;}}
}
