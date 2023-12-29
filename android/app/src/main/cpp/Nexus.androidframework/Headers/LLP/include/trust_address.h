/*__________________________________________________________________________________________

            Hash(BEGIN(Satoshi[2010]), END(Sunny[2012])) == Videlicet[2014]++

            (c) Copyright The Nexus Developers 2014 - 2023

            Distributed under the MIT software license, see the accompanying
            file COPYING or http://www.opensource.org/licenses/mit-license.php.

            "ad vocem populi" - To the Voice of the People

____________________________________________________________________________________________*/

#pragma once
#ifndef NEXUS_LLP_INCLUDE_TRUST_ADDRESS_H
#define NEXUS_LLP_INCLUDE_TRUST_ADDRESS_H

#include <cstdint>
#include <Util/templates/serialize.h>
#include <LLP/include/base_address.h>

namespace LLP
{
    /** ConnectState
     *
     *  The different states an address can be in.
     *
     **/
    enum ConnectState
    {
        NEW        = (1 << 0),
        FAILED     = (1 << 1),
        DROPPED    = (1 << 2),
        CONNECTED  = (1 << 3)
    };

    #define CONNECT_FLAGS_ALL LLP::ConnectState::NEW       | \
                              LLP::ConnectState::FAILED    | \
                              LLP::ConnectState::DROPPED   | \
                              LLP::ConnectState::CONNECTED

    /** TrustAddress
     *
     *  This is an Address with additional information about its connectivity
     *  within the Nexus Network that is also extendable for building out
     *  meaningful relationships between nodes.
     *
     **/
    class TrustAddress : public BaseAddress
    {
        /* Tell compiler we are overloading Print. */
        using BaseAddress::Print;

    public:

        uint64_t nSession;    //total time since connected
        uint64_t nLastSeen;   //unified time last seen
        uint32_t nConnected;  //total number of successful connections
        uint32_t nDropped;    //total number of dropped connections
        uint32_t nFailed;     //total number of failed connections
        uint32_t nFails;      //consecutive number of failed connections
        uint32_t nLatency;    //the latency experienced by the connection
        uint32_t nHeight;     //last recorded block height for the connection
        uint8_t  nState;      //the flag for the state of connection
        uint8_t  nType;       //TODO: the type for serialization


        /* Comparison less than operator used for sorting */
        friend bool operator<(const TrustAddress &info1, const TrustAddress &info2);


        /** TrustAddress
         *
         *  Default constructor
         *
         **/
        TrustAddress();


        /** TrustAddress
         *
         *  Copy constructors
         *
         **/
        TrustAddress(const TrustAddress& other);
        TrustAddress(const BaseAddress& other);


        /** operator=
         *
         *  Copy assignment operators
         *
         **/
        TrustAddress &operator=(const BaseAddress& other);
        TrustAddress &operator=(const TrustAddress& other);


        /** ~TrustAddress
         *
         *  Default destructor
         *
         **/
        virtual ~TrustAddress();


        /* Serialization */
        IMPLEMENT_SERIALIZE
        (
            TrustAddress *pthis = const_cast<TrustAddress *>(this);
            BaseAddress *pAddr =  static_cast<BaseAddress *>(pthis);

            READWRITE(nLastSeen);
            READWRITE(nConnected);
            READWRITE(nDropped);
            READWRITE(nFailed);
            READWRITE(nFails);
            READWRITE(nLatency);
            READWRITE(nHeight);
            READWRITE(*pAddr);
        )


        /** Score
         *
         *  Calculates a score based on stats. A higher score is better.
         *
         **/
        double Score() const;


        /** Print
         *
         *  Prints information about this address.
         *
         **/
        virtual void Print();
    };

}

#endif
