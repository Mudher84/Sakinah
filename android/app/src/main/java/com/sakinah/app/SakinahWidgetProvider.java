package com.sakinah.app;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.SystemClock;
import android.widget.RemoteViews;

public class SakinahWidgetProvider extends AppWidgetProvider {
    @Override public void onUpdate(Context c, AppWidgetManager m, int[] ids){ for(int id:ids) update(c,m,id); }
    static void refreshAll(Context c){ AppWidgetManager m=AppWidgetManager.getInstance(c); ComponentName n=new ComponentName(c,SakinahWidgetProvider.class); for(int id:m.getAppWidgetIds(n)) update(c,m,id); }

    private static String arPrayer(String p){
        if("Fajr".equals(p))return "الفجر";
        if("Dhuhr".equals(p))return "الظهر";
        if("Asr".equals(p))return "العصر";
        if("Maghrib".equals(p))return "المغرب";
        if("Isha".equals(p))return "العشاء";
        return p==null||p.isEmpty()?"الصلاة القادمة":p;
    }

    private static void update(Context c,AppWidgetManager m,int id){
        SharedPreferences p=c.getSharedPreferences("sakinah",Context.MODE_PRIVATE);
        String prayer=arPrayer(p.getString("next_prayer",""));
        String time=p.getString("next_prayer_time","--:--");
        String hijri=p.getString("hijri_date","");
        String theme=p.getString("widget_theme","lapis");
        long at=p.getLong("next_prayer_at",0L);
        RemoteViews v=new RemoteViews(c.getPackageName(),R.layout.widget_sakinah);
        v.setTextViewText(R.id.widgetPrayer,prayer);
        v.setTextViewText(R.id.widgetTime,time);
        v.setTextViewText(R.id.widgetHijri,hijri.isEmpty()?"سكينة":hijri);
        if(at>System.currentTimeMillis()){
            long base=SystemClock.elapsedRealtime()+(at-System.currentTimeMillis());
            v.setChronometer(R.id.widgetCountdown,base,"متبقي %s",true);
            v.setChronometerCountDown(R.id.widgetCountdown,true);
        }else{
            v.setChronometer(R.id.widgetCountdown,SystemClock.elapsedRealtime(),"متبقي --:--",false);
        }
        int bg,fg,accent;
        if("emerald".equals(theme)){bg=Color.rgb(35,72,64);fg=Color.WHITE;accent=Color.rgb(232,209,154);}
        else if("ivory".equals(theme)){bg=Color.rgb(247,242,232);fg=Color.rgb(23,59,87);accent=Color.rgb(142,118,66);}
        else{bg=Color.rgb(23,59,87);fg=Color.WHITE;accent=Color.rgb(240,213,143);}
        v.setInt(R.id.widgetRoot,"setBackgroundColor",bg);
        v.setTextColor(R.id.widgetTitle,fg);
        v.setTextColor(R.id.widgetPrayer,fg);
        v.setTextColor(R.id.widgetHijri,fg);
        v.setTextColor(R.id.widgetCountdown,fg);
        v.setTextColor(R.id.widgetTime,accent);
        Intent open=new Intent(c,MainActivity.class);
        PendingIntent pi=PendingIntent.getActivity(c,0,open,PendingIntent.FLAG_IMMUTABLE|PendingIntent.FLAG_UPDATE_CURRENT);
        v.setOnClickPendingIntent(R.id.widgetRoot,pi);
        m.updateAppWidget(id,v);
    }
}
