package com.nexus.mobile.android;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.media.MediaScannerConnection;
import android.os.Bundle;

import android.os.PowerManager;
import android.os.SystemClock;
import android.provider.Settings;
import android.util.Log;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

import java.io.File;
import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.SocketException;
import java.net.UnknownHostException;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.Objects;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.ThreadPoolExecutor;

import expo.modules.splashscreen.singletons.SplashScreen;
import expo.modules.splashscreen.SplashScreenImageResizeMode;


class NexusCore implements  Runnable{

    public void run(){};
    public void stop(){};
}

public class MainActivity extends ReactActivity {

    private Thread thread;
    private  NexusCore nexuscore;
    private  PowerManager.WakeLock wakeLock;

    private CoreStatus coreStatus;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    // SplashScreen.show(...) has to be called after super.onCreate(...)
    // Below line is handled by '@expo/configure-splash-screen' command and it's discouraged to modify it manually
      SplashScreen.show(this, SplashScreenImageResizeMode.CONTAIN, ReactRootView.class, false);
      if(savedInstanceState == null) {

        boolean result = false;

        try {
            //Socket asdf = new Socket("localhost", 8080);
            //asdf.close();
            result = true;
        } catch(Exception e) {
            Log.e("NEXUS", String.valueOf(e.getCause()));
        }

        if (!result)
        {
            try {
              //  ServerSocket ggggg = new ServerSocket(8080);
              //  ggggg.close();
            } catch (Exception e) {
               //Log.e("NEXUS", String.valueOf(e.getCause()));
            }
            //CloseListenSocket();
        }

        Log.d("NEXUS", "#### " + result);

        nexuscore = new NexusCore() {
            @Override
            public void run() {
                SecureRandom random = new SecureRandom();
                byte bytes[] = new byte[10];
                random.nextBytes(bytes);
                String userCreds[] = new String[]{Settings.Secure.getString(getBaseContext().getContentResolver(),
                        Settings.Secure.ANDROID_ID), Base64.getEncoder().encodeToString(bytes).replaceAll("([+/=])", "")};
                Log.d("NEXUS", "User " + userCreds[0] + " : " + userCreds[1]);

                startNexusCore(
                        getExternalFilesDir(null).getAbsolutePath(),
                        userCreds[0],
                        userCreds[1],
                        new String[]{"-printtoconsole","-manager=1", "-connect=node1.nexusoft.io", "-connect=node2.nexusoft.io", "-connect=node3.nexusoft.io", "-connect=node4.nexusoft.io", "-verbose=0"}
                );
                super.run();

            }

            @Override
            public void stop() {
                ShutDownNexusCore();
                super.stop();
            }
        };
        CoreStatus.SetUpCoreStatusChannel(this);




        //thread = new Thread(nexuscore);
        //thread.setDaemon(false);

        //thread.start();
        coreStatus = new CoreStatus(this);
        PowerManager powerManager = (PowerManager) getSystemService(POWER_SERVICE);
        wakeLock = powerManager.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK,
                "Nexus::BackgroundTASK");
        wakeLock.acquire();

        Intent _bgCore = new Intent(this,NexusService.class);
        startForegroundService(_bgCore);
        //startService(_bgCore);




    }
    else
    {
        Log.d("NEXUS","%%%%%%%%%%%%%%%%%%%%%%%%%");
        Log.d("NEXUS",savedInstanceState.toString());
    }
  }

    public static native String  startNexusCore(String homepath,String apiuser, String apipassword, String[] params);
    public static native  int ShutDownNexusCore();
    static{
        System.loadLibrary("nexusmobilelib");

    }

    @Override
    protected void onPause() {
        //CloseListenSocket();
        Log.d("NeXUS" , "******* " + isFinishing());
        super.onPause();
        //CloseListenSocket();
    }

    @Override
    protected void onResume() {
        //CloseListenSocket();
        //OpenListenSocket();
        super.onResume();
        //OpenListenSocket();
    }

    @Override
    protected void onStop() {
        Log.d("Nexus", "$$$$$ ON STOP");

        //CloseListenSocket();
        super.onStop();
    }

    // Possible change to OnStop ?
    @Override
    protected void onDestroy() {
        NotificationManager notificationManager = (NotificationManager) this.getSystemService(Context.NOTIFICATION_SERVICE);
        notificationManager.cancelAll();
        wakeLock.release();
        Log.d("NEXUS","&& ONDESTROY");
        //nexuscore.stop();
        stopService(new Intent(this, NexusService.class));
        super.onDestroy();
        finish();
        super.finish();
        System.exit(0);
    }


    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "main";
    }



    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, getMainComponentName()) {
            @Override
            protected ReactRootView createRootView() {
                return new RNGestureHandlerEnabledRootView(MainActivity.this);
            }
        };
    }
}
