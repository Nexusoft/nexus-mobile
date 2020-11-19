package com.nexus.mobile.android;

import android.app.NotificationManager;
import android.content.Context;
import android.media.MediaScannerConnection;
import android.os.Bundle;

import android.os.SystemClock;
import android.provider.Settings;
import android.util.Log;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

import java.security.SecureRandom;
import java.util.Base64;

import expo.modules.splashscreen.SplashScreen;
import expo.modules.splashscreen.SplashScreenImageResizeMode;


class NexusCore implements  Runnable{

    public void run(){};
    public void stop(){};
}

public class MainActivity extends ReactActivity {

    private Thread thread;
    private  NexusCore nexuscore;

    private CoreStatus coreStatus;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    // SplashScreen.show(...) has to be called after super.onCreate(...)
    // Below line is handled by '@expo/configure-splash-screen' command and it's discouraged to modify it manually
    SplashScreen.show(this, SplashScreenImageResizeMode.CONTAIN, false);

        nexuscore = new NexusCore()
        {
            @Override
            public void run() {
                SecureRandom random = new SecureRandom();
                byte bytes[] = new byte[10];
                random.nextBytes(bytes);
                String userCreds[] = new String[]{Settings.Secure.getString(getBaseContext().getContentResolver(),
                        Settings.Secure.ANDROID_ID),Base64.getEncoder().encodeToString(bytes).replaceAll("([+/])","")};
                Log.d("NEXUS", "User " + userCreds[0]  + " : " + userCreds[1]);
                startNexusCore(
                        getFilesDir().getAbsolutePath(),
                        userCreds[0],
                        userCreds[1],
                        new String[]{"-manager=1", "-connect=node1.nexusoft.io", "-connect=node2.nexusoft.io", "-connect=node3.nexusoft.io", "-connect=node4.nexusoft.io","-verbose=1"}
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

      thread = new Thread(nexuscore);
      thread.setDaemon(true);
      thread.start();
      coreStatus = new CoreStatus(this);
  }

    public native String  startNexusCore(String homepath,String apiuser, String apipassword, String[] params);
    public  native  int ShutDownNexusCore();
    static{
        System.loadLibrary("nexusmobilelib");

    }


    // Possible change to OnStop ?
    @Override
    protected void onDestroy() {
        super.onDestroy();
        Log.d("NEXUS","&& ONDESTROY");
        NotificationManager notificationManager = (NotificationManager) this.getSystemService(Context.NOTIFICATION_SERVICE);
        notificationManager.cancelAll();
        nexuscore.stop();
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
