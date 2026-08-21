package com.sakinah.app;

import android.app.Notification;
import android.app.Service;
import android.content.Intent;
import android.media.AudioAttributes;
import android.media.MediaPlayer;
import android.net.Uri;
import android.os.IBinder;
import android.os.PowerManager;
import androidx.core.app.NotificationCompat;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;

public class AdhanService extends Service {
    private MediaPlayer player;

    @Override public int onStartCommand(Intent intent,int flags,int startId){
        String prayer=intent!=null?intent.getStringExtra("prayer"):null;
        if(prayer==null||prayer.isBlank())prayer="prayer";
        Notification n=new NotificationCompat.Builder(this,"adhan")
            .setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
            .setContentTitle("مِرْآةُ الْمُسْلِمِ")
            .setContentText("الأذان · "+prayer)
            .setOngoing(true).build();
        startForeground(7001,n);
        android.content.SharedPreferences p=getSharedPreferences("sakinah",MODE_PRIVATE);
        String uri=p.getString("adhan_uri_"+prayer,"");
        if(uri==null||uri.isBlank())uri=p.getString("adhan_uri","");
        if(uri!=null&&!uri.isBlank()&&startUri(uri))return START_NOT_STICKY;
        String asset=p.getString("adhan_asset_"+prayer,"");
        if(asset!=null&&!asset.isBlank()&&startAsset(asset))return START_NOT_STICKY;
        stopSelf();
        return START_NOT_STICKY;
    }

    private boolean startUri(String uri){
        try{
            MediaPlayer m=new MediaPlayer();
            m.setAudioAttributes(new AudioAttributes.Builder().setUsage(AudioAttributes.USAGE_ALARM).setContentType(AudioAttributes.CONTENT_TYPE_MUSIC).build());
            m.setWakeMode(this,PowerManager.PARTIAL_WAKE_LOCK);
            m.setDataSource(this,Uri.parse(uri));
            m.setOnPreparedListener(mp->mp.start());
            m.setOnCompletionListener(mp->stopSelf());
            m.setOnErrorListener((mp,w,e)->{stopSelf();return true;});
            m.prepareAsync();player=m;return true;
        }catch(Exception e){return false;}
    }

    private boolean startAsset(String assetPath){
        try{
            String normalized=assetPath.startsWith("/")?assetPath.substring(1):assetPath;
            File dir=new File(getCacheDir(),"adhan_assets");if(!dir.exists())dir.mkdirs();
            String safe=normalized.replace('/','_').replace(' ','_');
            File out=new File(dir,safe);
            if(!out.exists()||out.length()==0){
                try(InputStream in=getAssets().open(normalized);FileOutputStream fos=new FileOutputStream(out)){
                    byte[] buf=new byte[32768];int n;while((n=in.read(buf))>0)fos.write(buf,0,n);
                }
            }
            return startUri(Uri.fromFile(out).toString());
        }catch(Exception e){return false;}
    }

    @Override public void onDestroy(){if(player!=null){try{player.stop();}catch(Exception ignored){}try{player.release();}catch(Exception ignored){}player=null;}super.onDestroy();}
    @Override public IBinder onBind(Intent intent){return null;}
}
