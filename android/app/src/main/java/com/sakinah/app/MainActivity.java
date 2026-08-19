package com.sakinah.app;

import android.Manifest;
import android.app.Activity;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.webkit.GeolocationPermissions;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.core.app.ActivityCompat;
import org.json.JSONObject;

public class MainActivity extends Activity {
    private WebView web;

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        createChannels();
        requestRuntimePermissions();
        web = new WebView(this);
        web.setWebViewClient(new WebViewClient());
        web.setWebChromeClient(new WebChromeClient(){
            @Override public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback){
                boolean granted=ActivityCompat.checkSelfPermission(MainActivity.this,Manifest.permission.ACCESS_FINE_LOCATION)==PackageManager.PERMISSION_GRANTED;
                callback.invoke(origin,granted,false);
            }
        });
        web.getSettings().setJavaScriptEnabled(true);
        web.getSettings().setDomStorageEnabled(true);
        web.getSettings().setGeolocationEnabled(true);
        web.getSettings().setAllowFileAccess(true);
        web.addJavascriptInterface(new NativeBridge(this), "SakinahNative");
        setContentView(web);
        web.loadUrl("file:///android_asset/index.html");
    }

    private void requestRuntimePermissions(){
        java.util.ArrayList<String> req=new java.util.ArrayList<>();
        if(ActivityCompat.checkSelfPermission(this,Manifest.permission.ACCESS_FINE_LOCATION)!=PackageManager.PERMISSION_GRANTED) req.add(Manifest.permission.ACCESS_FINE_LOCATION);
        if(Build.VERSION.SDK_INT>=33 && ActivityCompat.checkSelfPermission(this,Manifest.permission.POST_NOTIFICATIONS)!=PackageManager.PERMISSION_GRANTED) req.add(Manifest.permission.POST_NOTIFICATIONS);
        if(!req.isEmpty()) ActivityCompat.requestPermissions(this,req.toArray(new String[0]),41);
    }

    @Override public void onBackPressed() {
        if (web != null && web.canGoBack()) web.goBack(); else super.onBackPressed();
    }

    private void createChannels() {
        if (Build.VERSION.SDK_INT >= 26) {
            NotificationManager nm = getSystemService(NotificationManager.class);
            nm.createNotificationChannel(new NotificationChannel("prayer", "Prayer times", NotificationManager.IMPORTANCE_HIGH));
            nm.createNotificationChannel(new NotificationChannel("adhan", "Adhan", NotificationManager.IMPORTANCE_HIGH));
            nm.createNotificationChannel(new NotificationChannel("reminders", "Sakinah reminders", NotificationManager.IMPORTANCE_DEFAULT));
        }
    }

    public static final class NativeBridge {
        private final Context context;
        NativeBridge(Context c){ context=c; }
        @JavascriptInterface public void saveBridgeState(String value){
            android.content.SharedPreferences.Editor e=context.getSharedPreferences("sakinah",MODE_PRIVATE).edit().putString("bridge_state",value);
            try{
                JSONObject j=new JSONObject(value);
                if(j.has("nextPrayer")) e.putString("next_prayer",j.optString("nextPrayer","الصلاة القادمة"));
                if(j.has("nextPrayerTime")) e.putString("next_prayer_time",j.optString("nextPrayerTime","--:--"));
            }catch(Exception ignored){}
            e.apply();
        }
        @JavascriptInterface public String loadBridgeState(){ return context.getSharedPreferences("sakinah", MODE_PRIVATE).getString("bridge_state", "{}"); }
        @JavascriptInterface public void schedulePrayer(String id, long epochMillis, String title){ PrayerScheduler.schedule(context,id,epochMillis,title); }
        @JavascriptInterface public void cancelPrayer(String id){ PrayerScheduler.cancel(context,id); }
        @JavascriptInterface public void refreshWidget(){ SakinahWidgetProvider.refreshAll(context); }
        @JavascriptInterface public void setAdhanUri(String uri){ context.getSharedPreferences("sakinah",MODE_PRIVATE).edit().putString("adhan_uri",uri==null?"":uri).apply(); }
    }
}
