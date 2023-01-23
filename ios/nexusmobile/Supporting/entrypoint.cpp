//
//  entrypoint.cpp
//  NexusLibrary
//
//
//  Pure c++ file that runs the core, sets up the Nexus folder, and creates a nexus.conf
//

#include "entrypoint.hpp"
#include <LLC/include/random.h>
#include <iostream>
#include <sys/stat.h>
#include <LLP/include/global.h>
#include <LLP/include/port.h>
#include <LLP/types/apinode.h>
#include <LLP/types/rpcnode.h>
#include <LLP/types/miner.h>
#include <LLP/include/lisp.h>
#include <LLP/include/port.h>

#include <LLD/include/global.h>

#include <TAO/API/include/global.h>
#include <TAO/API/include/cmd.h>
#include <TAO/Ledger/include/create.h>
#include <TAO/Ledger/include/chainstate.h>
#include <TAO/Ledger/include/dispatch.h>
#include <TAO/Ledger/types/stake_minter.h>
#include <TAO/Ledger/include/timelocks.h>

#include <Util/include/convert.h>
#include <Util/include/filesystem.h>
#include <Util/include/signals.h>
#include <Util/include/daemon.h>

#include <Util/include/config.h>
#include <Util/include/encoding.h>


#include <Legacy/include/ambassador.h>

using namespace std;

int startNexus (int argc, char** argv, char* inApiUserName , char* inApiPassword)
{
  

  /* Setup the timer timer. */
  runtime::timer timer;
  timer.Start();


  /* Handle all the signals with signal handler method. */
  SetupSignals();
  
  
  ofstream myfile;
  string folder = std::string(getenv("HOME")) + "/Documents/Nexus" ;
  string fileLoc = std::string(folder + "/nexus.conf" );
  struct stat statbuf;
  cout << folder << endl;
  int isthere = stat(folder.c_str(), &statbuf);
  cout << isthere << endl;
  if ( isthere < 0)
  {
    mode_t m = S_IRWXU | S_IRWXG | S_IRWXO;
                int status = mkdir(folder.c_str(), m);
         cout << status << endl;
  }
  int confthere = stat(fileLoc.c_str(), &statbuf);
  cout << confthere << endl;
    cout << fileLoc << endl;
    myfile.open (fileLoc, std::fstream::in | std::fstream::out | std::fstream::app);
    if (confthere < 0)
    {
      cout << "!! WRITING FILE" << endl;
        // If file does not exist, write to it.
        string fileContent = "apiuser=" + string(inApiUserName) + "\napipassword=" + string(inApiPassword);
        myfile << fileContent;
      
            
    }
    else
    {
      cout << "File Exists" << endl;
    
    }
    myfile.close();
    
    for (int i = 0; i < argc; i++) {
        printf("argv[%d] = %s\n", i, argv[i]);
    }


    /* Read the configuration file. Pass argc and argv for possible -datadir setting */
    config::ReadConfigFile(config::mapArgs, config::mapMultiArgs, argc, argv);


    /* Parse out the parameters */
    config::ParseParameters(argc, argv);


    /* Once we have read in the CLI paramters and config file, cache the args into global variables*/
    config::CacheArgs();


    /* Initalize the debug logger. */
    debug::Initialize();


    /* Handle Commandline switch */
    for(int i = 1; i < argc; ++i)
    {
        /* Handle for commandline API/RPC */
        if(!convert::IsSwitchChar(argv[i][0]))
        {
            /* As a helpful shortcut, if the method name includes a "/" then we will assume it is meant for the API. */
            const std::string strEndpoint = std::string(argv[i]);

            /* Handle for API if symbol detected. */
            if(strEndpoint.find('/') != strEndpoint.npos || config::GetBoolArg(std::string("-api")))
                return TAO::API::CommandLineAPI(argc, argv, i);

            return TAO::API::CommandLineRPC(argc, argv, i);
        }
    }


    /* Log the startup information now. */
    debug::LogStartup(argc, argv);


    /* Run the process as Daemon RPC/LLP Server if Flagged. */
    if(config::fDaemon)
    {
        debug::log(0, FUNCTION, "-daemon flag enabled. Running in background");
        Daemonize();
    }


    /* Create directories if they don't exist yet. */
    if(!::filesystem::exists(config::GetDataDir()) &&
        ::filesystem::create_directory(config::GetDataDir()))
    {
        debug::log(0, FUNCTION, "Generated Path ", config::GetDataDir());
    }


    /* Check for failures or shutdown. */
    bool fFailed = config::fShutdown.load();
    if(!fFailed)
    {
        /* Initialize LLD. */
        LLD::Initialize();


        /* Initialize dispatch relays. */
        TAO::Ledger::Dispatch::Initialize();


        /* Initialize ChainState. */
        TAO::Ledger::ChainState::Initialize();


        /* Check for reindexing entries. */
        LLD::Logical->IndexRegisters();


        /* Check for reindexing entries. */
        LLD::Register->IndexAddress();


        /* Initialize the Lower Level Protocol. */
        LLP::Initialize();


        /* Startup performance metric. */
        debug::log(0, FUNCTION, "Started up in ", timer.ElapsedMilliseconds(), "ms");


        /* Set the initialized flags. */
        config::fInitialized.store(true);


        /* Initialize generator thread. */
        std::thread thread;
        if(config::fHybrid.load())
            thread = std::thread(TAO::Ledger::ThreadGenerator);


        /* Wait for shutdown. */
        if(!config::GetBoolArg(std::string("-gdb")))
        {
            std::mutex SHUTDOWN_MUTEX;
            std::unique_lock<std::mutex> SHUTDOWN_LOCK(SHUTDOWN_MUTEX);
            SHUTDOWN.wait(SHUTDOWN_LOCK, []{ return config::fShutdown.load(); });
        }


        /* GDB mode waits for keyboard input to initiate clean shutdown. */
        else
        {
            getchar();
            config::fShutdown = true;
        }


        /* Stop stake minter if running. Minter ignores request if not running, so safe to just call both */
        TAO::Ledger::StakeMinter::GetInstance().Stop();


        /* Wait for the private condition. */
        if(config::fHybrid.load())
        {
            TAO::Ledger::PRIVATE_CONDITION.notify_all();
            thread.join();
        }


        /* Shutdown dispatch. */
        TAO::Ledger::Dispatch::Shutdown();
    }


    /* Shutdown metrics. */
    timer.Reset();


    /* Shutdown the API subsystems. */
    TAO::API::Shutdown();


    /* Shutdown network subsystem. */
    LLP::Shutdown();


    /* Shutdown LLL sub-systems. */
    LLD::Shutdown();


    /* Startup performance metric. */
    debug::log(0, FUNCTION, "Closed in ", timer.ElapsedMilliseconds(), "ms");


    /* Close the debug log file once and for all. */
    debug::Shutdown();


    return 0;
}

int shutdownNexus()
{
    Shutdown();
    return 0;
}


int closeListening()
{
  //LLP::closeListening();
  return 0;
}

int openListening()
{
  //LLP::openListening();
  return 0;
}
