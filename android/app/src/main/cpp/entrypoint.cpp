
#include <jni.h>
#include <android/log.h>

#include <LLC/include/random.h>
#include <iostream>
#include <fstream>
#include <sys/stat.h>
#include <boost/filesystem.hpp>
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
Java_io_nexus_wallet_android_MainActivity_startNexusCore(JNIEnv *env, jobject thiz, jstring homepath, jstring apiUser ,jstring apiPassword , jobjectArray params) {
    {
        const char *res;
        const char *inApiUser;
        const char *inApiPassword;
        jboolean isCopy;

        res = env->GetStringUTFChars(homepath, &isCopy);
        inApiUser = env->GetStringUTFChars(apiUser,&isCopy);
        inApiPassword = env->GetStringUTFChars(apiPassword,&isCopy);

        setenv("HOME", res, 0);
        (env)->ReleaseStringUTFChars(homepath, res);

        int defaultArgSize = 2;
        int size = env->GetArrayLength(params);
        int argc = size + defaultArgSize;

        char *argv[argc];

        //Set Default params
        argv[0] = NULL;
        argv[1] = strdup("-client=1");


        for (int i = 0; i < size; ++i) {
            jstring string = (jstring) env->GetObjectArrayElement(params, i);
            const char *myarray = env->GetStringUTFChars(string, 0);
            LOG_D("@@:: Incoming Params:   %s", myarray);
            argv[defaultArgSize + i] = strdup(myarray);
            env->ReleaseStringUTFChars(string, myarray);
            env->DeleteLocalRef(string);
        }

        /* Setup the timer timer. */
        runtime::timer timer;
        timer.Start();

        /* Handle all the signals with signal handler method. */
        SetupSignals();

        LOG_D("Home Env: %s", std::string(getenv("HOME")).c_str());

        ofstream nexusConfFile;
        fstream nxsPolicyFile;
        struct stat statbuf;
        string nxsFolder = std::string(getenv("HOME")) + "/Nexus";
        string nxsPolicy = std::string(nxsFolder + "/db-policies.txt" );
        string nxsConf = std::string(nxsFolder + "/nexus.conf");

        LOG_D("Nexus Folder: %s", nxsFolder.c_str());
        LOG_D("Nexus Conf Location: %s", nxsConf.c_str());

        int nxsPolicyExists = stat(nxsPolicy.c_str(), &statbuf);
        int nxsFolderExists = stat(nxsFolder.c_str(), &statbuf);
        int nxsConfExists = stat(nxsConf.c_str(), &statbuf);
        int CURRENT_DB_POLICY = 4;

        LOG_D("Is Nexus Folder Already there? : %d", nxsFolderExists);
        LOG_D("Is Nexus Conf There? : %d", nxsConfExists);
        LOG_D("NXS POLICY FOund? : %d", nxsPolicyExists);

        if (nxsFolderExists < 0) {
            mode_t m = S_IRWXU | S_IRWXG | S_IRWXO;
            int status = mkdir((std::string(getenv("HOME"))).c_str(), m);
            LOG_D("Make Home Directory Status: %d", status);
            status = mkdir(nxsFolder.c_str(), m);
            LOG_D("Make Nexus Folder Status: %d", status);
        }
        

        nxsPolicyFile.open (nxsPolicy, std::fstream::in | std::fstream::out | std::fstream::trunc);

        if (nxsPolicyExists < 0)
        {
            // If No policy is there but the nexus folder is, then we need to delete
            if (nxsConfExists >= 0)
            {
                LOG_D("Deleting DB");
                boost::filesystem::remove_all(nxsFolder + "/client");
            }
        }
        else {


            if (nxsPolicyFile.is_open()) {
                LOG_D("Open success");
            }

            std::string line;
            std::vector<std::string> nxsPolicyFileLines;

            while (std::getline(nxsPolicyFile, line)) {
                nxsPolicyFileLines.push_back(line);
            }
            nxsPolicyFile.clear();
            nxsPolicyFile.seekg(0);
            if (nxsPolicyFileLines.size() > 0) {
                string dbpolicy = nxsPolicyFileLines[0];
                LOG_D("DB POLICY: %s",dbpolicy.c_str());
                int dbpolicynumber = int(dbpolicy.back() - '0');
                if (dbpolicynumber < CURRENT_DB_POLICY) {
                    LOG_D("Deleting DB");
                    boost::filesystem::remove_all(nxsFolder + "/client");
                }
            }
        }

        //TODO: Replace with vector write
        nxsPolicyFile << "dbpolicy:" << std::to_string(CURRENT_DB_POLICY) << '\n';
        nxsPolicyFile.close();


        nexusConfFile.open(nxsConf, std::fstream::in | std::fstream::out | std::fstream::app);
        if (nxsConfExists < 0) {
            LOG_D("!! WRITING FILE");
            // If file does not exist, write to it.
            string fileContent = "apiuser=" + string(inApiUser) +"\napipassword=" + string(inApiPassword);
            nexusConfFile
                    << fileContent ;


        } else {
            LOG_D("!! FILE EXISTS");

        }
        env->ReleaseStringUTFChars(apiPassword,inApiPassword);
        env->ReleaseStringUTFChars(apiUser,inApiUser);
        nexusConfFile.close();

        LOG_D("Listing All Params sent to core: ");
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


    /* Handle Commandline switch */
    for(int i = 1; i < argc; ++i)
    {
        /* Handle for commandline API/RPC */
        if(!convert::IsSwitchChar(argv[i][0]))
        {
            //Mobile does not support comandline switching
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


        /* Run our LLD indexing operations. */
        LLD::Indexing();


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


    /* Release network triggers. */
    LLP::Release();

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


        unsetenv("HOME");
        return env->NewStringUTF("Shutdown");
    }
}

    JNIEXPORT jint JNICALL
    Java_io_nexus_wallet_android_MainActivity_ShutDownNexusCore(JNIEnv *env, jobject thiz)
    {
        {
            LOG_D("### Set Shutdown Flag");
            Shutdown();
            return 0;
        }
    }

    JNIEXPORT jint  JNICALL
    Java_io_nexus_wallet_android_MainActivity_CloseListenSocket(JNIEnv *env, jobject thiz)
    {
        //LLP::CloseListening();
        return 0;
    }

    JNIEXPORT jint  JNICALL
    Java_io_nexus_wallet_android_MainActivity_OpenListenSocket(JNIEnv *env, jobject thiz)
    {
        //LLP::OpenListening();
        return 0;
    }


}