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

NSArray *userCre;

// Main Function for the thread
void* PosixThreadMainRoutine(void* data)
{
           char *my_argv[] = {
             NULL,
          strdup("-client=1"),
          strdup("-verbose=2"),
          strdup("-printtoconsole"),
          strdup("-manager=1"),
          strdup("-connect=node1.nexusoft.io"),
          strdup("-connect=node2.nexusoft.io"),
          strdup("-connect=node3.nexusoft.io"),
          strdup("-connect=node4.nexusoft.io"),
          NULL
     };
     const char *com = [userCre[0] UTF8String];
    const char *command = [userCre[1] UTF8String];
     startNexus(9, my_argv,strdup(com),strdup(command));
    return NULL;
}

// Start Nexus Core by launching a separate thread
void LaunchThread(NSArray *userCreds)
{
      userCre = userCreds;
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
