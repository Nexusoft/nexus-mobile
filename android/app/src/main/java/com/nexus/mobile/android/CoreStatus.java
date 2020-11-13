package com.nexus.mobile.android;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.graphics.Color;
import android.os.Build;

import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import androidx.core.content.ContextCompat;

/*
    This will create the status notification, a notification that will not go away until the core has been stopped.
*/
public class CoreStatus {

    static final public String channelID = "core-status-channel";
    static final public int notificationID = 201409;

    public CoreStatus(Context context){
        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, channelID)
                .setSmallIcon(R.mipmap.ic_notification)
                .setContentTitle("Core Active")
                .setContentText("Core is running in the background")
                .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                .setAutoCancel(false)
                .setColor(ContextCompat.getColor(context, R.color.colorPrimary))
                .setVisibility(NotificationCompat.VISIBILITY_PRIVATE)
                .setOngoing(true);
        NotificationManagerCompat notificationManager = NotificationManagerCompat.from(context);
        notificationManager.notify(notificationID, builder.build());
    }

    static public void SetUpCoreStatusChannel(Context context)
    {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            int importance = NotificationManager.IMPORTANCE_DEFAULT;
            NotificationChannel channel = new NotificationChannel(channelID, "Core Running Channel", importance);
            channel.setDescription("The Nexus Core Is running");
            NotificationManager notificationManager = context.getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }
    }
}
