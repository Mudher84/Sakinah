package com.sakinah.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

public class PrayerAlarmReceiver extends BroadcastReceiver {
    private static boolean isPrayer(String id){return "Fajr".equals(id)||"Dhuhr".equals(id)||"Asr".equals(id)||"Maghrib".equals(id)||"Isha".equals(id);}
    @Override public void onReceive(Context c, Intent i) {
        String id=i.getStringExtra("id"); if(id==null) id="prayer";
        String title=i.getStringExtra("title"); if(title==null) title="حان وقت الصلاة";
        String channel=isPrayer(id)?"prayer":"reminders";
        NotificationCompat.Builder b=new NotificationCompat.Builder(c,channel)
            .setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
            .setContentTitle("مِرْآةُ الْمُسْلِمِ")
            .setContentText(title)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true);
        try { NotificationManagerCompat.from(c).notify(id.hashCode(),b.build()); } catch(SecurityException ignored){}
        if(isPrayer(id)){
            Intent s=new Intent(c,AdhanService.class).putExtra("prayer",id);
            try { androidx.core.content.ContextCompat.startForegroundService(c,s); } catch(Exception ignored){}
        }
        PrayerRefreshWorker.ensureScheduled(c);
        PrayerRefreshWorker.runSoon(c);
        SakinahWidgetProvider.refreshAll(c);
    }
}
