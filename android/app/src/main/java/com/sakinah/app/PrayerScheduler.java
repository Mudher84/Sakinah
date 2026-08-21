package com.sakinah.app;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;

public final class PrayerScheduler {
    private PrayerScheduler(){}

    public static void schedule(Context c,String prayer,long at,String title){
        schedule(c,prayer,prayer,at,title);
    }

    public static void schedule(Context c,String alarmId,String prayer,long at,String title){
        AlarmManager am=(AlarmManager)c.getSystemService(Context.ALARM_SERVICE);
        PendingIntent pi=pending(c,alarmId,prayer,title);
        if(android.os.Build.VERSION.SDK_INT>=31 && !am.canScheduleExactAlarms()) am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP,at,pi);
        else am.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP,at,pi);
    }

    public static void cancel(Context c,String id){
        AlarmManager am=(AlarmManager)c.getSystemService(Context.ALARM_SERVICE);
        am.cancel(pending(c,id,id,id));
    }

    private static PendingIntent pending(Context c,String alarmId,String prayer,String title){
        Intent i=new Intent(c,PrayerAlarmReceiver.class)
            .putExtra("id",alarmId)
            .putExtra("prayer",prayer)
            .putExtra("title",title);
        return PendingIntent.getBroadcast(c,alarmId.hashCode(),i,PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE);
    }
}
