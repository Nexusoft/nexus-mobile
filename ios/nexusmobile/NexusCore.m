//
//  NexusCore.m
//  Nexus Library
//
// Obj-c++ file that starts and stops the Nexus Core. Is objtective c so can interface with iOS Foundation
//

#import <Foundation/Foundation.h>

#include "NexusCore.h"
#include "entrypoint.hpp"

#include <assert.h>
#include <pthread.h>

// Main Function for the thread
void* PosixThreadMainRoutine(void* data)
{
           char *my_argv[] = {
             NULL,
          strdup("-client=1"),
          strdup("-verbose=2"),
          strdup("-printtoconsole"),
          NULL
     };
     
     startNexus(4, my_argv,strdup("password"));
     return NULL;
}

// Start Nexus Core by launching a separate thread
void LaunchThread()
{
     // Create the thread using POSIX routines.
     pthread_attr_t attr;
     pthread_t posixThreadID;
     int returnVal;
     returnVal = pthread_attr_init(&attr);
     assert(!returnVal);
     returnVal = pthread_attr_setdetachstate(&attr,  PTHREAD_CREATE_DETACHED);
     assert(!returnVal);
     int threadError = pthread_create(&posixThreadID, &attr, &PosixThreadMainRoutine, NULL);
     returnVal = pthread_attr_destroy(&attr);
     assert(!returnVal);
     if (threadError != 0)
     {
          // Report an error.
     }
}

// Shutdown Nexus, Important so that the CG can close out the sockets and cache
void ShutdownNexus()
{
  shutdownNexus();
}
