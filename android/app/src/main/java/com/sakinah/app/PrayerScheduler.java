package com.sakinah.app;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;

public final class PrayerScheduler {
    private PrayerScheduler(){}
    public static void schedule(Context c,String id,long at,String title){
        AlarmManager am=(AlarmManager)c.getSystemService(Context.ALARM_SERVICE);
        PendingIntent pi=pending(c,id,title);
        if(android.os.Build.VERSION.SDK_INT>=31 && !am.canScheduleExactAlarms()) am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP,at,pi);
        else am.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP,at,pi);
    }
    public static void cancel(Context c,String id){
        AlarmManager am=(AlarmManager)c.getSystemService(Context.ALARM_SERVICE);
        am.cancel(pending(c,id,id));
    }
    private static PendingIntent pending(Context c,String id,String title){
        Intent i=new Intent(c,PrayerAlarmReceiver.class).putExtra("id",id).putExtra("title",title);
        return PendingIntent.getBroadcast(c,id.hashCode(),i,PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE);
    }
}
