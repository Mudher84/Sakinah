package com.sakinah.app;

import android.Manifest;
import android.app.Activity;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.core.app.ActivityCompat;

public class MainActivity extends Activity {
    private WebView web;

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        createChannels();
        if (Build.VERSION.SDK_INT >= 33 && checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.POST_NOTIFICATIONS}, 41);
        }
        web = new WebView(this);
        web.setWebViewClient(new WebViewClient());
        web.setWebChromeClient(new WebChromeClient());
        web.getSettings().setJavaScriptEnabled(true);
        web.getSettings().setDomStorageEnabled(true);
        web.getSettings().setAllowFileAccess(true);
        web.addJavascriptInterface(new NativeBridge(this), "SakinahNative");
        setContentView(web);
        web.loadUrl("file:///android_asset/index.html");
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
        @JavascriptInterface public void saveBridgeState(String value){ context.getSharedPreferences("sakinah", MODE_PRIVATE).edit().putString("bridge_state", value).apply(); }
        @JavascriptInterface public String loadBridgeState(){ return context.getSharedPreferences("sakinah", MODE_PRIVATE).getString("bridge_state", "{}"); }
        @JavascriptInterface public void schedulePrayer(String id, long epochMillis, String title){ PrayerScheduler.schedule(context,id,epochMillis,title); }
        @JavascriptInterface public void cancelPrayer(String id){ PrayerScheduler.cancel(context,id); }
        @JavascriptInterface public void refreshWidget(){ SakinahWidgetProvider.refreshAll(context); }
    }
}
