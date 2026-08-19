package com.sakinah.app;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.widget.RemoteViews;

public class SakinahWidgetProvider extends AppWidgetProvider {
    @Override public void onUpdate(Context c, AppWidgetManager m, int[] ids){ for(int id:ids) update(c,m,id); }
    static void refreshAll(Context c){ AppWidgetManager m=AppWidgetManager.getInstance(c); ComponentName n=new ComponentName(c,SakinahWidgetProvider.class); for(int id:m.getAppWidgetIds(n)) update(c,m,id); }
    private static void update(Context c,AppWidgetManager m,int id){
        String prayer=c.getSharedPreferences("sakinah",Context.MODE_PRIVATE).getString("next_prayer","الصلاة القادمة");
        String time=c.getSharedPreferences("sakinah",Context.MODE_PRIVATE).getString("next_prayer_time","--:--");
        RemoteViews v=new RemoteViews(c.getPackageName(),R.layout.widget_sakinah);
        v.setTextViewText(R.id.widgetPrayer,prayer); v.setTextViewText(R.id.widgetTime,time);
        Intent open=new Intent(c,MainActivity.class); PendingIntent pi=PendingIntent.getActivity(c,0,open,PendingIntent.FLAG_IMMUTABLE|PendingIntent.FLAG_UPDATE_CURRENT); v.setOnClickPendingIntent(R.id.widgetTitle,pi);
        m.updateAppWidget(id,v);
    }
}
