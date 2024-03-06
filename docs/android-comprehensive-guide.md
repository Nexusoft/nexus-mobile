# Android Comprehensive Guide

TODO: Add more android specific caveats or tricks here.

### 1. Download Repo

Either download the latest codebase from release or git clone the repo. 

### 2. NPM Install

Open the project with your code editor of choice. In a new command line terminal, execute the command `npm install` to gather all dependencies.

### 3. Open Android Studio

To build Nexus Mobile you need to have gradle 7.0+, so make sure the version of Android Studio you download has that minimum support.  Open the project via the `nexus-mobile/android/` folder. Make sure you have the android SDK (must be able to target 33) and JDK installed, these can be done in the studio app or manually. 

You may need to make a local.properties file at `nexus-mobile/android/local.properties` and set both sdk.dir and org.gradle.java.home. These are paths, and you can see more info on the main Readme. 

### 4. Understand the Project

Take some time to understand the project and how it is structured. There is both a cpp and java scope that runs the backend and front end respectfully. The Nexus Code is run as an android service, allowing it to run in the background. The nexus code is compiled with make, and you can see the instructions in the cmakelist file. The Java portion uses Expo which in itself runs React-Native. 

### 5. Build 

Nexus Mobile only supports (out of the box) 64bit archs so make sure you select the correct one. Most phone use arm64 whereas pcs and simulators will use x86. First build the project, then you can either package production or hook up a phone to the computer for upload. 