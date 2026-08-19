package com.sakinah.app;

import android.Manifest;
import android.app.Activity;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.OpenableColumns;
import android.webkit.GeolocationPermissions;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.core.app.ActivityCompat;
import org.json.JSONObject;

public class MainActivity extends Activity {
    private static final int REQ_ADHAN_AUDIO = 73;
    private WebView web;
    private String pendingPrayer = "";

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

    private void pickAdhanAudio(String prayer){
        pendingPrayer=prayer==null?"":prayer;
        Intent i=new Intent(Intent.ACTION_OPEN_DOCUMENT);
        i.addCategory(Intent.CATEGORY_OPENABLE);
        i.setType("audio/*");
        i.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION|Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION);
        startActivityForResult(i,REQ_ADHAN_AUDIO);
    }

    @Override protected void onActivityResult(int requestCode,int resultCode,Intent data){
        super.onActivityResult(requestCode,resultCode,data);
        if(requestCode!=REQ_ADHAN_AUDIO||resultCode!=RESULT_OK||data==null||data.getData()==null)return;
        Uri uri=data.getData();
        try{getContentResolver().takePersistableUriPermission(uri,Intent.FLAG_GRANT_READ_URI_PERMISSION);}catch(Exception ignored){}
        String key="adhan_uri_"+pendingPrayer;
        getSharedPreferences("sakinah",MODE_PRIVATE).edit().putString(key,uri.toString()).apply();
        String name=uri.getLastPathSegment();
        try(android.database.Cursor c=getContentResolver().query(uri,null,null,null,null)){
            if(c!=null&&c.moveToFirst()){
                int idx=c.getColumnIndex(OpenableColumns.DISPLAY_NAME);
                if(idx>=0)name=c.getString(idx);
            }
        }catch(Exception ignored){}
        final String prayer=pendingPrayer.replace("'","\\'");
        final String safeName=(name==null?"audio":name).replace("'","\\'");
        if(web!=null)web.post(()->web.evaluateJavascript("window.dispatchEvent(new CustomEvent('sakinah-adhan-picked',{detail:{prayer:'"+prayer+"',name:'"+safeName+"'}}));",null));
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

    public final class NativeBridge {
        private final Context context;
        NativeBridge(Context c){ context=c; }
        @JavascriptInterface public void saveBridgeState(String value){
            android.content.SharedPreferences.Editor e=context.getSharedPreferences("sakinah",MODE_PRIVATE).edit().putString("bridge_state",value);
            try{
                JSONObject j=new JSONObject(value);
                if(j.has("nextPrayer")) e.putString("next_prayer",j.optString("nextPrayer","الصلاة القادمة"));
                if(j.has("nextPrayerTime")) e.putString("next_prayer_time",j.optString("nextPrayerTime","--:--"));
                if(j.has("nextPrayerAt")) e.putLong("next_prayer_at",j.optLong("nextPrayerAt",0L));
                if(j.has("hijriDate")) e.putString("hijri_date",j.optString("hijriDate",""));
                if(j.has("widgetTheme")) e.putString("widget_theme",j.optString("widgetTheme","lapis"));
            }catch(Exception ignored){}
            e.apply();
        }
        @JavascriptInterface public String loadBridgeState(){ return context.getSharedPreferences("sakinah", MODE_PRIVATE).getString("bridge_state", "{}"); }
        @JavascriptInterface public void schedulePrayer(String id, long epochMillis, String title){ PrayerScheduler.schedule(context,id,epochMillis,title); }
        @JavascriptInterface public void cancelPrayer(String id){ PrayerScheduler.cancel(context,id); }
        @JavascriptInterface public void refreshWidget(){ SakinahWidgetProvider.refreshAll(context); }
        @JavascriptInterface public void setAdhanUri(String uri){ context.getSharedPreferences("sakinah",MODE_PRIVATE).edit().putString("adhan_uri",uri==null?"":uri).apply(); }
        @JavascriptInterface public void pickAdhan(String prayer){ runOnUiThread(()->pickAdhanAudio(prayer)); }
        @JavascriptInterface public void clearAdhan(String prayer){ context.getSharedPreferences("sakinah",MODE_PRIVATE).edit().remove("adhan_uri_"+prayer).apply(); }
    }
}
