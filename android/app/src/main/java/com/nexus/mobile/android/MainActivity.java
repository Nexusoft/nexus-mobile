package com.nexus.mobile.android;

import android.os.Bundle;

import android.util.Log;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

import org.json.JSONObject;

import java.io.File;
import java.lang.reflect.Array;

import expo.modules.splashscreen.SplashScreen;
import expo.modules.splashscreen.SplashScreenImageResizeMode;

public class MainActivity extends ReactActivity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    // SplashScreen.show(...) has to be called after super.onCreate(...)
    // Below line is handled by '@expo/configure-splash-screen' command and it's discouraged to modify it manually
    SplashScreen.show(this, SplashScreenImageResizeMode.CONTAIN, false);




      Runnable runnable =
              () -> {
          startNexusCore(
                  getFilesDir().getAbsolutePath(),
                  new String[]{"-dns=0","-manager=0","-connect=test1.nexusminingpool.com", "-testnet=605", "-verbose=2"}
          );
      };

      Thread thread = new Thread(runnable);
      thread.start();


  }

  public native String  startNexusCore(String homepath, String[] params);
  static{
      System.loadLibrary("nexusmobilelib");

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
