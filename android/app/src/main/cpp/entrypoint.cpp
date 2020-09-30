
#include <jni.h>
#include <android/log.h>

#include <LLC/include/random.h>
#include <iostream>
#include <sys/stat.h>
#include <LLP/include/global.h>
#include <LLP/include/port.h>
#include <LLP/types/apinode.h>
#include <LLP/types/rpcnode.h>
#include <LLP/types/miner.h>
#include <LLP/types/p2p.h>
#include <LLP/include/lisp.h>
#include <LLP/include/port.h>

#include <LLD/include/global.h>

#include <TAO/API/include/global.h>
#include <TAO/API/include/cmd.h>
#include <TAO/Ledger/include/create.h>
#include <TAO/Ledger/include/chainstate.h>
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
using namespace Legacy;
using namespace LLD;
using namespace TAO;
using namespace LLC;
using namespace LLP;
using namespace config;
using namespace encoding;

#define LOGI(...) \
  ((void)__android_log_print(ANDROID_LOG_INFO, "nexusmobile::", __VA_ARGS__))
#define LOG_D(...) __android_log_print(ANDROID_LOG_DEBUG, "Entrypoint", __VA_ARGS__)

extern "C" {

jint JNI_Onload(JavaVM* vm, void* reserved) {
    LOG_D ("JNI_OnLoad");
    JNIEnv* env;
    if(vm->GetEnv(reinterpret_cast<void **>(&env), JNI_VERSION_1_6) != JNI_OK           ) {
        LOG_D("Initial Get env error");
        return JNI_ERR;
    }
    else {
        return JNI_VERSION_1_6;
    }
}

JNIEXPORT jstring JNICALL
Java_com_nexus_mobile_android_MainActivity_stringFromJNI(JNIEnv *env, jobject thiz, jstring homepath) {
    {


        const char * res;

        jboolean isCopy;
        res = env->GetStringUTFChars(homepath, &isCopy);

        if (isCopy == JNI_TRUE) {
            (env)->ReleaseStringUTFChars(homepath, res);
        }

        LOG_D("a@@@@@@@@  %s", res);
        setenv("HOME",res,0);


        int argc = 8;
        char *argv[] = {
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

        LOG_D("HELLOOWW  %s", getenv("HOME"));
        LOG_D("argc %", argc);
        LOG_D("YOOO FAM");
        LOG_D("argv %", argv);

       /* Setup the timer timer. */
      runtime::timer timer;
      timer.Start();


      /* Handle all the signals with signal handler method. */
      SetupSignals();

        LOG_D("%s",std::string(getenv("HOME")).c_str() );

      ofstream myfile;
      string folder = std::string(getenv("HOME")) + "/Documents/Nexus" ;
      string fileLoc = std::string(folder + "/nexus.conf" );

      LOG_D("%s",folder.c_str());
      LOG_D("%s",fileLoc.c_str());

      struct stat statbuf;
      int isthere = stat(folder.c_str(), &statbuf);
        LOG_D("%d",isthere);
      if ( isthere < 0)
      {
        mode_t m = S_IRWXU | S_IRWXG | S_IRWXO;
        int aaaaaa = mkdir((std::string(getenv("HOME")) + "/Documents").c_str(),m);
                    int status = mkdir(folder.c_str(), m);
          LOG_D("%d",status);
      }
      int confthere = stat(fileLoc.c_str(), &statbuf);
        LOG_D("%d",confthere);
        cout << fileLoc << endl;
        myfile.open (fileLoc, std::fstream::in | std::fstream::out | std::fstream::app);
        if (confthere < 0)
        {
            LOG_D("!! WRITING FILE");
            // If file does not exist, write to it.
            myfile << "rpcuser=rpcuser\nrpcpassword=password\napiuser=apiserver\napipassword=password";


        }
        else
        {
            LOG_D("!! FILE EXISTS");

        }
        myfile.close();

        for (int i = 0; i < argc; i++) {

            LOG_D("argv[%d] = %s\n", i, argv[i]);
        }


        /* Read the configuration file. Pass argc and argv for possible -datadir setting */
        config::ReadConfigFile(config::mapArgs, config::mapMultiArgs, argc, argv);


        /* Parse out the parameters */
        config::ParseParameters(argc, argv);


        /* Once we have read in the CLI paramters and config file, cache the args into global variables*/
        config::CacheArgs();


        /* Initalize the debug logger. */
        debug::Initialize();


        /* Initialize network resources. (Need before RPC/API for WSAStartup call in Windows) */
        LLP::Initialize();


        /* Handle Commandline switch */
        for(int i = 1; i < argc; ++i)
        {
            if(!convert::IsSwitchChar(argv[i][0]))
            {
                int nRet = 0;

                /* As a helpful shortcut, if the method name includes a "/" then we will assume it is meant for the API
                   since none of the RPC commands support a "/" in the method name */
                bool fIsAPI = false;

                std::string endpoint = std::string(argv[i]);
                std::string::size_type pos = endpoint.find('/');
                if(pos != endpoint.npos || config::GetBoolArg(std::string("-api")))
                    fIsAPI = true;

                if(fIsAPI)
                    nRet = TAO::API::CommandLineAPI(argc, argv, i);
                else
                    nRet = TAO::API::CommandLineRPC(argc, argv, i);

                return env->NewStringUTF(0);
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
        if(!filesystem::exists(config::GetDataDir()) &&
            filesystem::create_directory(config::GetDataDir()))
        {
            debug::log(0, FUNCTION, "Generated Path ", config::GetDataDir());
        }

        /* Startup the time server. */
        LLP::TIME_SERVER = LLP::CreateTimeServer();


        #ifndef NO_WALLET
        /* Set up RPC server */
        if(!config::fClient.load())
        {
            /* Instantiate the RPC server */
            LLP::RPC_SERVER = LLP::CreateRPCServer();
        }
        #endif


        /* Startup timer stats. */
        uint32_t nElapsed = 0;


        /* Check for failures. */
        bool fFailed = config::fShutdown.load();
        if(!fFailed)
        {
            /* Initialize LLD. */
            LLD::Initialize();


            /* Initialize ChainState. */
            TAO::Ledger::ChainState::Initialize();


            /* Get the port for Tritium Server. Allow serverport or port params to be used (serverport takes preference)*/
            uint16_t nPort = static_cast<uint16_t>(config::GetArg(std::string("-port"), config::fTestNet.load() ? (TRITIUM_TESTNET_PORT + (config::GetArg("-testnet", 0) - 1)) : TRITIUM_MAINNET_PORT));
            nPort = static_cast<uint16_t>(config::GetArg(std::string("-serverport"), nPort));

            uint16_t nSSLPort = static_cast<uint16_t>(config::GetArg(std::string("-sslport"), config::fTestNet.load() ? (TRITIUM_TESTNET_SSL_PORT + (config::GetArg("-testnet", 0) - 1)) : TRITIUM_MAINNET_SSL_PORT));

            /* Initialize the Tritium Server. */
            LLP::TRITIUM_SERVER = LLP::CreateTAOServer<LLP::TritiumNode>(nPort, nSSLPort);


            /* Get the port for the P2P server. */
            nPort = static_cast<uint16_t>(config::GetArg(std::string("-p2pport"), config::fTestNet.load() ? TESTNET_P2P_PORT : MAINNET_P2P_PORT));
            nSSLPort = static_cast<uint16_t>(config::GetArg(std::string("-p2psslport"), config::fTestNet.load() ? TESTNET_P2P_SSL_PORT : MAINNET_P2P_SSL_PORT));
            /* Initialize the P2P Server */
            LLP::P2P_SERVER = LLP::CreateP2PServer<LLP::P2PNode>(nPort, nSSLPort);


            /* Initialize API Pointers. */
            TAO::API::Initialize();


            /* ensure that apiuser / apipassword has been configured */
            if((config::mapArgs.find("-apiuser") == config::mapArgs.end()
            || config::mapArgs.find("-apipassword") == config::mapArgs.end())
            && config::GetBoolArg("-apiauth", true))
            {
                debug::log(0, ANSI_COLOR_BRIGHT_RED, "!!!WARNING!!! API DISABLED", ANSI_COLOR_RESET);
                debug::log(0, ANSI_COLOR_BRIGHT_YELLOW, "You must set apiuser=<user> and apipassword=<password> in nexus.conf", ANSI_COLOR_RESET);
                debug::log(0, ANSI_COLOR_BRIGHT_YELLOW, "or commandline arguments.  If you intend to run the API server without", ANSI_COLOR_RESET);
                debug::log(0, ANSI_COLOR_BRIGHT_YELLOW, "authenticating requests (not recommended), please start with set apiauth=0", ANSI_COLOR_RESET);
            }
            else
            {
                /* Create the Core API Server. */
                LLP::API_SERVER = LLP::CreateAPIServer();
            }


            /* Hnalde manual connections for tritium server. */
            LLP::MakeConnections<LLP::TritiumNode>(LLP::TRITIUM_SERVER);


            /* Set up Mining Server */
            if(!config::fClient.load() && config::GetBoolArg(std::string("-mining")))
                  LLP::MINING_SERVER.store(LLP::CreateMiningServer());


            /* Elapsed Milliseconds from timer. */
            nElapsed = timer.ElapsedMilliseconds();
            timer.Stop();


            /* Startup performance metric. */
            debug::log(0, FUNCTION, "Started up in ", nElapsed, "ms");


            /* Set the initialized flags. */
            config::fInitialized.store(true);


            /* Initialize generator thread. */
            std::thread thread;
            if(config::GetBoolArg(std::string("-private")))
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
            if(config::GetBoolArg(std::string("-private")))
            {
                TAO::Ledger::PRIVATE_CONDITION.notify_all();
                thread.join();
            }
        }


        /* Shutdown metrics. */
        timer.Reset();


        /* Shutdown the API. */
        TAO::API::Shutdown();


        /* After all servers shut down, clean up underlying networking resources */
        LLP::Shutdown();


        /* Shutdown database instances. */
        LLD::Shutdown();

        /* Elapsed Milliseconds from timer. */
        nElapsed = timer.ElapsedMilliseconds();


        /* Startup performance metric. */
        debug::log(0, FUNCTION, "Closed in ", nElapsed, "ms");


        /* Close the debug log file once and for all. */
        debug::Shutdown();

        LOGI("calculation time: %" "sdfs", 999999);
        unsetenv("HOME");
        return env->NewStringUTF("Hello from JNI LIBS!");
    }



    }


}