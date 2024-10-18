package io.nexus.wallet.android;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import android.graphics.BitmapFactory;
import android.os.IBinder;
import android.provider.Settings;
import android.util.Log;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;
import androidx.core.content.ContextCompat;

import java.security.SecureRandom;
import java.util.Base64;
import android.os.Build;

/*

    Nexus Core. This is a foreground service.

 */

public class NexusService extends Service {

    protected NexusCore _nexuscore;
    protected Thread _servicethread;

    static final public String channelID = "core-status-channel";
    static final public int notificationID = 201409;

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

                MainActivity.startNexusCore(
                        getExternalFilesDir(null).getAbsolutePath(),
                        userCreds[0],
                        userCreds[1],
                        new String[]{"-manager=1", "-ssl=1" , "-apissl=1", "-apisslport=7080", "-apisslrequired=1", "-connect=node1.nexus.io", "-connect=lite4.nexenture.xyz", "-connect=node2.nexus.io", "-connect=node3.nexus.io" , "-verbose=3", "-terminateauth=0"}
                );
                super.run();

            }

            @Override
            public void stop() {
                MainActivity.ShutDownNexusCore();
                super.stop();
            }
        };
        SetUpCoreStatusChannel();
        _servicethread = new Thread(_nexuscore);
        _servicethread.start();
        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, channelID)
                .setLargeIcon(BitmapFactory.decodeResource(getResources(),R.drawable.notification_icon))
                .setSmallIcon(R.drawable.notification_icon)
                .setContentTitle("Core Active")
                .setContentText("Core is running in the background")
                .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                .setAutoCancel(false)
                .setColor(ContextCompat.getColor(this, R.color.colorPrimary))
                .setVisibility(NotificationCompat.VISIBILITY_PRIVATE)
                .setOngoing(true);

        Notification coreNotification = builder.build();
        startForeground(notificationID, coreNotification, ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE);

        super.onCreate();
    }

    public void SetUpCoreStatusChannel()
    {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            int importance = NotificationManager.IMPORTANCE_DEFAULT;
            NotificationChannel channel = new NotificationChannel(channelID, "Core Running Channel", importance);
            channel.setDescription("The Nexus Core Is running");
            NotificationManager notificationManager = this.getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {

        return Service.START_NOT_STICKY;

    }

    @Override
    public void onDestroy() {
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
