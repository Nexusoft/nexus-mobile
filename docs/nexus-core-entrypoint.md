# Nexus Core

Documentation and explanation on how the c++ Nexus core interfaces with the native mobile languages.

##### iOS

[Core](/ios/nexusmobile/NexusCore.m)

[EntryPoint](/ios/nexusmobile/Suporting/entrypoint.cpp)

##### Android

[Core Service](/android/app/src/main/java/com/nexus/mobile/android/NexusService.java)

[Core](/android/app/src/main/java/com/nexus/mobile/android/NexusCore.java)

[EntryPoint](/android/app/src/main/cpp/entrypoint.cpp)

## iOS

There are 2 main files that handle running the core.

`entrypoint.cpp` will load the precompiled Nexus Library, setup the .Nexus folder, then start running the Nexus code.

`NexusCore.m` is the interface between the AppDelegate and the entrypoint.

`enterpoint.cpp` is very similar to the `main.cpp` file found in the LLL-TAO. There are four methods, start/stop, and two special methods for iOS. When the user minimizes the app, iOS will attempt to clean up any unused objects. This includes socket connections. Therefore we take down our connection when we minimize and restore when the app returns to the foreground.

`NexusCore.m` is simple and just passes arguments to the c++ code and starts the core in a new thread. `AppDelegate.m` generates a unique password for the user and starts the core, it also attaches the minimize and maximize events to the socketclean up methods.

The iOS version of the core is simpler to interface with considering iOS uses Objective-c, however iOS apps are sandboxed and should not interface with other apps. This is why the sockets must be closed on minimize and that a potential DAPP would have to have its own core code and login process.

## Android

There are 2 main files and one supporting file that handle running and supporting the core.

`entrypoint.cpp` will load the precompiled Nexus Library, setup the .Nexus folder, then start running the Nexus code.

`NexusCore.java` is a supporting abstract object that will hold the `run()` and `stop()` functions. This object is defined in `NexusService.java`

`NexusService.java` runs the foreground service that in turn runs the core in the background.

Java can not directly interface with c++ so the methods from the entrypoint that will be used in java code must be marked with `JNIEXPORT` which will export these methods to the java code. In addition the names of the methods must follow the JNI syntax. For example, the `startNexusCore` method that I want to run in `MainActivity`, is called `Java_com_nexus_mobile_android_MainActivity_startNexusCore`. Now in `MainActivity.java` I can include `startNexusCore` with the `native` modifier.

The main Nexus Library must also be loaded, do this by including `static{System.loadLibrary("nexusmobilelib");}`

The Main Activity can now start the Nexus Service. `NexusService.java`, extend the service object with `OnCreate` and `OnDestroy` being where most of the code lives. `OnCreate` implements the NexusCore object and starts the core. In `Run()` we generate a unique password for the API to use and pass any commandline parameters to the core. Since this a foreground service, we must trigger an always on notification or the Android Security system will force quit the app.

When the user minimized the app, the core will continue to run, therefore the binding to port 8080 will continue. This is handy if developers want to make a DAPP that uses the Nexus API.
