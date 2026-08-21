package com.sakinah.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

public class BootReceiver extends BroadcastReceiver {
    @Override public void onReceive(Context context, Intent intent) {
        context.getSharedPreferences("sakinah",Context.MODE_PRIVATE).edit().putBoolean("needs_reschedule",false).apply();
        PrayerRefreshWorker.ensureScheduled(context);
        PrayerRefreshWorker.runSoon(context);
        SakinahWidgetProvider.refreshAll(context);
    }
}
