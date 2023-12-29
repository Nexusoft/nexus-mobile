/*__________________________________________________________________________________________

            Hash(BEGIN(Satoshi[2010]), END(Sunny[2012])) == Videlicet[2014]++

            (c) Copyright The Nexus Developers 2014 - 2023

            Distributed under the MIT software license, see the accompanying
            file COPYING or http://www.opensource.org/licenses/mit-license.php.

            "ad vocem populi" - To the Voice of the People

____________________________________________________________________________________________*/

#pragma once

#include <LLP/include/port.h>
#include <LLP/include/seeds.h>

#include <LLP/types/tritium.h>
#include <LLP/types/time.h>
#include <LLP/templates/server.h>

#include <LLP/types/apinode.h>
#include <LLP/types/filenode.h>
#include <LLP/types/lookup.h>
#include <LLP/types/rpcnode.h>
#include <LLP/types/miner.h>

namespace LLP
{
    /** Track our hostname so we don't have to call system every request. **/
    extern std::string strHostname;


    /** List of LLP Server Instances. **/
    extern Server<TritiumNode>*  TRITIUM_SERVER;
    extern Server<LookupNode>*   LOOKUP_SERVER;
    extern Server<TimeNode>*     TIME_SERVER;
    extern Server<APINode>*      API_SERVER;
    extern Server<FileNode>*     FILE_SERVER;
    extern Server<RPCNode>*      RPC_SERVER;
    extern Server<Miner>*        MINING_SERVER;


    /** Current session identifier. **/
    const extern uint64_t SESSION_ID;


    /** Initialize
     *
     *  Initialize the LLP.
     *
     **/
    bool Initialize();


    /** CloseListening
     *
     *  Closes the listening sockets on all running servers.
     *
     **/
    void CloseListening();


    /** OpenListening
     *
     *  Restarts the listening sockets on all running servers.
     *
     **/
    void OpenListening();


    /** Release
     *
     *  Release the LLP active triggers.
     *
     **/
    void Release();


    /** Shutdown
     *
     *  Shutdown the LLP.
     *
     **/
    void Shutdown();


    /** MakeConnections
     *
     *  Makes connections from -connect and -addnode arguments for the specified server.
     *
     *  @param[in] pServer The server to make connections with.
     *
     **/
    template <class ProtocolType>
    void MakeConnections(Server<ProtocolType> *pServer)
    {
        /* Check that the given server is active. */
        if(!pServer)
            return;

        /* Add core nexus.io nodes so that we get a quick connection to the network. */
        if(!config::fTestNet.load())
        {
            pServer->AddConnection("node1.nexus.io", pServer->GetPort(false), false, true);
            pServer->AddConnection("node2.nexus.io", pServer->GetPort(false), false, true);
            pServer->AddConnection("node3.nexus.io", pServer->GetPort(false), false, true);
            pServer->AddConnection("node4.nexus.io", pServer->GetPort(false), false, true);
        }

        /* -connect means try to establish a connection first. */
        if(config::HasArg("-connect"))
        {
            /* Add connections and resolve potential DNS lookups. */
            for(const auto& rAddress : config::mapMultiArgs["-connect"])
            {
                /* Flag indicating connection was successful */
                bool fConnected = false;

                /* First attempt SSL if configured */
                if(pServer->SSLEnabled())
                   fConnected = pServer->AddConnection(rAddress, pServer->GetPort(true), true, true);

                /* If SSL connection failed or was not attempted and SSL is not required, attempt on the non-SSL port */
                if(!fConnected && !pServer->SSLRequired())
                    fConnected = pServer->AddConnection(rAddress, pServer->GetPort(false), false, true);
            }
        }

        /* -addnode means add to address manager and let it make connections. */
        if(config::HasArg("-addnode"))
        {
            /* Add nodes and resolve potential DNS lookups. */
            for(const auto& rNode : config::mapMultiArgs["-addnode"])
                pServer->AddNode(rNode, true);
        }
    }


    /** CloseListening
     *
     *  Closes our listening sockets.
     *
     *  pServer The potential server.
     *
     **/
    template <class ProtocolType>
    void CloseSockets(Server<ProtocolType> *pServer)
    {
        /* Release our triggers. */
        if(pServer)
            pServer->NotifyTriggers();

        /* Close our listening socket now. */
        if(pServer)
            pServer->CloseListening();

        /* Disconnect all open sockets. */
        if(pServer)
            pServer->DisconnectAll();
    }


    /** OpenListening
     *
     *  Opens up our listening sockets.
     *
     *  pServer The potential server.
     *
     **/
    template <class ProtocolType>
    void OpenListening(Server<ProtocolType> *pServer)
    {
        /* Check if we need to release triggers first. */
        if(pServer)
            pServer->OpenListening();
    }


    /** Shutdown
     *
     *  Performs a shutdown and cleanup of resources on a server if it exists.
     *
     *  pServer The potential server.
     *
     **/
    template <class ProtocolType>
    void Release(Server<ProtocolType> *pServer)
    {
        /* Check if we need to release triggers first. */
        if(pServer)
            pServer->NotifyTriggers();
    }


    /** Shutdown
     *
     *  Performs a shutdown and cleanup of resources on a server if it exists.
     *
     *  pServer The potential server.
     *
     **/
    template <class ProtocolType>
    void Shutdown(Server<ProtocolType> *pServer)
    {
        /* Next we need to delete our server. */
        if(pServer)
            delete pServer;
    }

}
