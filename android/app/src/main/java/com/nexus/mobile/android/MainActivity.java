package com.nexus.mobile.android;


import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;

import android.os.PowerManager;
import android.util.Log;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

import expo.modules.splashscreen.singletons.SplashScreen;
import expo.modules.splashscreen.SplashScreenImageResizeMode;


public class MainActivity extends ReactActivity {

    private  PowerManager.WakeLock wakeLock;


  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    // SplashScreen.show(...) has to be called after super.onCreate(...)
    // Below line is handled by '@expo/configure-splash-screen' command and it's discouraged to modify it manually
      SplashScreen.show(this, SplashScreenImageResizeMode.CONTAIN, ReactRootView.class, false);


        //Allow power to background
        PowerManager powerManager = (PowerManager) getSystemService(POWER_SERVICE);
        wakeLock = powerManager.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK,
                "Nexus::BackgroundTASK");
        wakeLock.acquire();

        // STARTS NEXUS CORE
        Intent _bgCore = new Intent(this,NexusService.class);
        startForegroundService(_bgCore);

  }

    public static native String  startNexusCore(String homepath,String apiuser, String apipassword, String[] params);
    public static native  int ShutDownNexusCore();
    static{
        System.loadLibrary("nexusmobilelib");

    }

    // Possible change to OnStop ?
    @Override
    protected void onDestroy() {
        NotificationManager notificationManager = (NotificationManager) this.getSystemService(Context.NOTIFICATION_SERVICE);
        notificationManager.cancelAll();
        wakeLock.release();
        Log.d("NEXUS","&& ONDESTROY");
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
