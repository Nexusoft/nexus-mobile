package com.nexus.mobile.android;

import android.os.Bundle;

import android.os.SystemClock;
import android.util.Log;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

import expo.modules.splashscreen.SplashScreen;
import expo.modules.splashscreen.SplashScreenImageResizeMode;


class NexusCore implements  Runnable{

    public void run(){};
    public void stop(){};
}

public class MainActivity extends ReactActivity {

    private Thread thread;
    private  NexusCore nexuscore;

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
                startNexusCore(
                        getFilesDir().getAbsolutePath(),
                        "password",
                        new String[]{"-dns=0", "-manager=0", "-connect=test1.nexusminingpool.com", "-testnet=605", "-verbose=1"}
                );
                super.run();
            }

            @Override
            public void stop() {
                ShutDownNexusCore();
                super.stop();
            }
        };

      thread = new Thread(nexuscore);
      thread.setDaemon(true);
      thread.start();
  }

    public native String  startNexusCore(String homepath, String apipassword, String[] params);
    public  native  int ShutDownNexusCore();
    static{
        System.loadLibrary("nexusmobilelib");

    }


    // Possible change to OnStop ?
    @Override
    protected void onDestroy() {
        super.onDestroy();
        Log.d("NEXUS","&& ONDESTROY");
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
