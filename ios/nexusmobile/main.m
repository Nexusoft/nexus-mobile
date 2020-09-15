#import <UIKit/UIKit.h>

#import "AppDelegate.h"

#include "entrypoint.hpp"


#include <assert.h>
#include <pthread.h>
void* PosixThreadMainRoutine(void* data)
{
           char *my_argv[] = {
             NULL,
          strdup("-client=1"),
          strdup("-verbose=2"),
          strdup("-dns=0"),
          strdup("-manager=0"),
          strdup("-printtoconsole"),
          strdup("-connect=test1.nexusminingpool.com"),
          strdup("-testnet=605"),
          NULL
     };
     
     startNexus();
     runNexus(8, my_argv);
     return NULL;
}
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

int main(int argc, char * argv[]) {
  @autoreleasepool {
    LaunchThread();
    return UIApplicationMain(argc, argv, nil, NSStringFromClass([AppDelegate class]));
  }
}
