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


//testnet=605 connect=test1.nexusminingpool.com

// Main Function for the thread
void* PosixThreadMainRoutine(void* data)
{
           char *my_argv[] = {
             NULL,
          strdup("-client=1"),
          strdup("-verbose=0"),
          strdup("-manager=1"),
          strdup("-timeout=30"),
          strdup("-ssl=1"),
          strdup("-apissl=1"),
          strdup("-apisslport=7080"),
          strdup("-apisslrequired"),
            strdup("-connect=node1.nexus.io"),
            strdup("-connect=node2.nexus.io"),
            strdup("-connect=node3.nexus.io"),
            strdup("-connect=node4.nexus.io"),
            strdup("-connect=lite1.nexenture.xyz"),
            strdup("-connect=lite2.nexenture.xyz"),
            strdup("-connect=lite3.nexenture.xyz"),
          NULL
     };
     const char *com = [userCre[0] UTF8String];
    const char *command = [userCre[1] UTF8String];
     startNexus(16, my_argv,strdup(com),strdup(command));
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
       printf("$$ERROR");
          // Report an error.
     }
}

// Shutdown Nexus, Important so that the CG can close out the sockets and cache
void ShutdownNexus()
{
  shutdownNexus();
}

void CloseSocket()
{
  closeListening();
}

void OpenSocket()
{
  openListening();
}
