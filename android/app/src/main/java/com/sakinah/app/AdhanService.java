package com.sakinah.app;

import android.app.Notification;
import android.app.Service;
import android.content.Intent;
import android.media.MediaPlayer;
import android.net.Uri;
import android.os.IBinder;
import androidx.core.app.NotificationCompat;

public class AdhanService extends Service {
    private MediaPlayer player;
    @Override public int onStartCommand(Intent intent,int flags,int startId){
        Notification n=new NotificationCompat.Builder(this,"adhan")
            .setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
            .setContentTitle("سكينة")
            .setContentText("الأذان")
            .setOngoing(true).build();
        startForeground(7001,n);
        String uri=getSharedPreferences("sakinah",MODE_PRIVATE).getString("adhan_uri","");
        if(uri!=null && !uri.isBlank()){
            try{
                player=MediaPlayer.create(this, Uri.parse(uri));
                if(player!=null){ player.setOnCompletionListener(mp->stopSelf()); player.start(); return START_NOT_STICKY; }
            }catch(Exception ignored){}
        }
        stopSelf();
        return START_NOT_STICKY;
    }
    @Override public void onDestroy(){ if(player!=null){ try{player.stop();}catch(Exception ignored){} player.release(); player=null;} super.onDestroy(); }
    @Override public IBinder onBind(Intent intent){ return null; }
}
