# Nexus Wallet Mobile

![GitHub package.json version](https://img.shields.io/github/package-json/v/Nexusoft/nexus-mobile)

[<img src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg" height="50">](https://itunes.apple.com/us/app/nexus-mobile)
[<img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" height="50">](https://play.google.com/store/apps/details?id=io.nexus.wallet)

This is an React-Native app for Nexus. It is an example of what can comprise the 6th and 7th layers of the Nexus software stack, which are the Logical and Interface layers respectively.

If you would like to learn more about Nexus we encourage you to visit the [Nexus Website.](https://nexus.io/)

Desktop wallet with full node support is available here, [Nexus Desktop Interface.](https://github.com/Nexusoft/NexusInterface)

If you are interested in USING the Nexus Mobile Wallet then please download the app from the respective App Store. Only clone/checkout this repo if you are interested in developing the wallet.

## Build and Dev-server Instructions

To get started, you will first need to set up node.js (version 10 or higher) and npm (version 6 or higher) they come together as a package and can be found [here](https://nodejs.org). You will then need to clone into this repository, cd into the nexus-mobile dir, run `npm install`, then run the command `npm run start`.

This will run the Expo server, you must now interface into that server which you can do in many different ways.

### iOS

Expo and React Native use CocoaPods to install addtional modules to the project. You must install pods prior to running the xCode project, [CocoaPods.](https://cocoapods.org)
After instaliation cd into the `ios` folder, and run the command `pods install`. This will install all the pod componenets. Now open the `nexusmobile.xcworkspace` project in xcode.

Due to Apple's development rules you must have a development profile, one can get generated for free but only for simulator and your personal device.

### Android

Download and install Android Studios (Must have gradle 7.0+ support ie Artic Fox and above).

Open the `android` folder.

Make a `local.properties` text file in the android/ folder. Add and fill out these two properties 
``` 
sdk.dir=/location/to/android-sdk/version
org.gradle.java.home=/location/to/JDK
```
You can also add `openssl.dir` (which is the location to openssl) to override the precompiled packages. 

More can be [found here.](/docs/android-comprehensive-guide.md)

## Nexus Core

Nexus Mobile runs in two layers, the React layer with the UI and the native layer that runs the core. For iOS this is in Objective-c++ and android, Java. Each platform has an entrypoint file that will interface with the native code and nexus's c++ compiled library.

See the [Core Document for more.](/docs/nexus-core-entrypoint.md)

## Lite Mode

The mobile wallet only supports lite mode by default, removing the `-client=1` flag is not supported and may not behave correctly.

Lite Mode differs from using a full node on your desktop by only downloading the block headers, and only the logged in sigchain. Consider the nexus network as a parent and a lite node as a child, you can only interface with the parent/s but can not interface with other children. Since you are not contributing to the network, you can not stake or get rewarded for keeping yourself live.

## License

Nexus is released under the terms of the MIT license. See [COPYING](COPYING.MD) for more
information or see https://opensource.org/licenses/MIT.

## Contributing

If you would like to contribute as always submit a pull request.
