package com.nexus.mobile.android;

import android.app.Notification;
import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import android.provider.Settings;
import android.util.Log;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import androidx.core.content.ContextCompat;

import java.security.SecureRandom;
import java.util.Base64;


public class NexusService extends Service {

    protected NexusCore _nexuscore;
    protected Thread _servicethread;



    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onCreate() {

        _nexuscore = new NexusCore() {
            @Override
            public void run() {
                SecureRandom random = new SecureRandom();
                byte bytes[] = new byte[10];
                random.nextBytes(bytes);
                String userCreds[] = new String[]{Settings.Secure.getString(getBaseContext().getContentResolver(),
                        Settings.Secure.ANDROID_ID), Base64.getEncoder().encodeToString(bytes).replaceAll("([+/=])", "")};
                Log.d("NEXUS", "User " + userCreds[0] + " : " + userCreds[1]);

                MainActivity.startNexusCore(
                        getExternalFilesDir(null).getAbsolutePath(),
                        userCreds[0],
                        userCreds[1],
                        new String[]{"-apiport=8080","-manager=1", "-connect=node1.nexusoft.io", "-connect=node2.nexusoft.io", "-connect=node3.nexusoft.io", "-connect=node4.nexusoft.io", "-verbose=0"}
                );
                super.run();

            }

            @Override
            public void stop() {
                MainActivity.ShutDownNexusCore();
                super.stop();
            }
        };
        _servicethread = new Thread(_nexuscore);
        _servicethread.start();
        int notificationID = CoreStatus.notificationID;
        String channelID = CoreStatus.channelID;
        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, channelID)
                .setSmallIcon(R.mipmap.ic_notification)
                .setContentTitle("Core Active")
                .setContentText("Core is running in the background")
                .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                .setAutoCancel(false)
                .setColor(ContextCompat.getColor(this, R.color.colorPrimary))
                .setVisibility(NotificationCompat.VISIBILITY_PRIVATE)
                .setOngoing(true);

        Notification coreNotification = builder.build();
        //notificationManager.notify(notificationID,builder.bu;
        startForeground(notificationID, coreNotification);


        super.onCreate();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {

        return Service.START_NOT_STICKY;

    }

    @Override
    public void onDestroy() {
        Log.d("NEXUS::SERVICE", "On Destroy Called");
        _nexuscore.stop();
        _servicethread = null;
        stopForeground(STOP_FOREGROUND_REMOVE);
        stopSelf();
        super.onDestroy();
    }

    @Override
    public void onRebind(Intent intent) {
        super.onRebind(intent);
    }

    @Override
    public boolean onUnbind(Intent intent) {
        return super.onUnbind(intent);
    }

    @Override
    public void onTaskRemoved(Intent rootIntent) {
        super.onTaskRemoved(rootIntent);
    }


}
