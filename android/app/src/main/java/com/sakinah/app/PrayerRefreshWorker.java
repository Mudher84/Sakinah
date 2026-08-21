package com.sakinah.app;

import android.content.Context;
import android.content.SharedPreferences;
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
        Context context=getApplicationContext();
        SharedPreferences prefs=context.getSharedPreferences("sakinah",Context.MODE_PRIVATE);
        try{
            String raw=prefs.getString("bridge_state","");
            if(raw==null||raw.isBlank())return Result.success();
            JSONObject bridge=new JSONObject(raw);
            double lat=bridge.optDouble("latitude",Double.NaN),lon=bridge.optDouble("longitude",Double.NaN);
            if(Double.isNaN(lat)||Double.isNaN(lon)){
                prefs.edit().putString("last_refresh_error","missing-location").apply();
                return Result.retry();
            }
            int method=bridge.optInt("method",4);
            int school=bridge.optInt("school",0);
            JSONObject cfg=bridge.optJSONObject("notifications");
            if(cfg==null)cfg=new JSONObject();

            ZoneId zone;
            try{zone=ZoneId.of(bridge.optString("timezone",ZoneId.systemDefault().getId()));}
            catch(Exception e){zone=ZoneId.systemDefault();}
            LocalDate today=LocalDate.now(zone);
            refreshDate(today,lat,lon,method,school,cfg,true);
            refreshDate(today.plusDays(1),lat,lon,method,school,cfg,false);
            prefs.edit().putLong("last_refresh_success",System.currentTimeMillis()).putString("last_refresh_error","").apply();
            SakinahWidgetProvider.refreshAll(context);
            return Result.success();
        }catch(Exception e){
            prefs.edit().putString("last_refresh_error",e.getClass().getSimpleName()).apply();
            return Result.retry();
        }
    }

    private void refreshDate(LocalDate date,double lat,double lon,int method,int school,JSONObject cfg,boolean isToday)throws Exception{
        Context context=getApplicationContext();
        JSONObject data=fetch(date,lat,lon,method,school);
        JSONObject timings=data.getJSONObject("timings");
        String tz=data.optJSONObject("meta")!=null?data.optJSONObject("meta").optString("timezone",ZoneId.systemDefault().getId()):ZoneId.systemDefault().getId();
        ZoneId zone;try{zone=ZoneId.of(tz);}catch(Exception e){zone=ZoneId.systemDefault();}
        String dateKey=date.toString();
        long now=System.currentTimeMillis();
        String nextPrayer="";
        String nextTime="";
        long nextAt=Long.MAX_VALUE;

        for(String p:PRAYERS){
            String alarmId=p+"@"+dateKey;
            if(!cfg.optBoolean(p,true)){
                PrayerScheduler.cancel(context,alarmId);
                continue;
            }
            String value=clean(timings.optString(p,""));
            if(value.isBlank())continue;
            long at=toEpoch(date,value,zone);
            if(at>now+30000L){
                PrayerScheduler.schedule(context,alarmId,p,at,"حان وقت صلاة "+ar(p));
                if(at<nextAt){nextAt=at;nextPrayer=p;nextTime=value;}
            }
        }

        String fridayId="FridayReminder@"+dateKey;
        if(cfg.optBoolean("friday",true)&&date.getDayOfWeek()==java.time.DayOfWeek.FRIDAY){
            long at=LocalDateTime.of(date,LocalTime.of(9,0)).atZone(zone).toInstant().toEpochMilli();
            if(at>now+30000L)PrayerScheduler.schedule(context,fridayId,"FridayReminder",at,"تذكير يوم الجمعة");
        }else PrayerScheduler.cancel(context,fridayId);

        JSONObject hijri=data.optJSONObject("date")!=null?data.optJSONObject("date").optJSONObject("hijri"):null;
        String ramadanId="RamadanReminder@"+dateKey;
        boolean ramadan=cfg.optBoolean("ramadan",true)&&hijri!=null&&hijri.optJSONObject("month")!=null&&hijri.optJSONObject("month").optInt("number",0)==9;
        if(ramadan){
            String fajr=clean(timings.optString("Fajr",""));
            if(!fajr.isBlank()){
                long at=toEpoch(date,fajr,zone)-30L*60L*1000L;
                if(at>now+30000L)PrayerScheduler.schedule(context,ramadanId,"RamadanReminder",at,"تذكير رمضان قبل الفجر");
            }
        }else PrayerScheduler.cancel(context,ramadanId);

        SharedPreferences p=context.getSharedPreferences("sakinah",Context.MODE_PRIVATE);
        long storedAt=p.getLong("next_prayer_at",0L);
        boolean shouldUpdate=isToday ? nextAt!=Long.MAX_VALUE : (storedAt<=now&&nextAt!=Long.MAX_VALUE);
        if(shouldUpdate){
            SharedPreferences.Editor e=p.edit()
                .putString("next_prayer",nextPrayer)
                .putString("next_prayer_time",nextTime)
                .putLong("next_prayer_at",nextAt);
            if(hijri!=null){
                String day=hijri.optString("day","");
                JSONObject month=hijri.optJSONObject("month");
                String monthAr=month==null?"":month.optString("ar",month.optString("en",""));
                String year=hijri.optString("year","");
                e.putString("hijri_date",(day+" "+monthAr+" "+year).trim());
            }
            e.apply();
        }
    }

    private JSONObject fetch(LocalDate date,double lat,double lon,int method,int school)throws Exception{
        String endpoint="https://api.aladhan.com/v1/timings/"+API_DATE.format(date)+"?latitude="+enc(String.valueOf(lat))+"&longitude="+enc(String.valueOf(lon))+"&method="+method+"&school="+school;
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
