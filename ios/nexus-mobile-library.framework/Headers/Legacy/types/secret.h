/*__________________________________________________________________________________________

            (c) Hash(BEGIN(Satoshi[2010]), END(Sunny[2012])) == Videlicet[2014] ++

            (c) Copyright The Nexus Developers 2014 - 2021

            Distributed under the MIT software license, see the accompanying
            file COPYING or http://www.opensource.org/licenses/mit-license.php.

            "ad vocem populi" - To the Voice of the People

____________________________________________________________________________________________*/

#pragma once
#ifndef NEXUS_LEGACY_TYPES_SECRET_H
#define NEXUS_LEGACY_TYPES_SECRET_H

#include <LLC/include/eckey.h>
#include <Util/include/base58.h>

namespace Legacy
{

    /** A base58-encoded secret key */
    class NexusSecret : public encoding::CBase58Data
    {
    public:

        /** Default Constructor. **/
        NexusSecret();
        

        /** Copy Constructor. **/
        NexusSecret(const NexusSecret& secret);


        /** Move Constructor. **/
        NexusSecret(NexusSecret&& secret) noexcept;


        /** Copy assignment. **/
        NexusSecret& operator=(const NexusSecret& secret);


        /** Move assignment. **/
        NexusSecret& operator=(NexusSecret&& secret) noexcept;


        /** Destructor **/
        virtual ~NexusSecret();


        /** Constructor
         *
         *  Sets from a CSecret phrase (byte vector in secure allocator)
         *
         *  @param[in] vchSecret The secret allocator
         *  @param[in] fCompressed Flag if key is in compressed form.
         *
         **/
        NexusSecret(const LLC::CSecret& vchSecret, bool fCompressed);


        /** SetSecret
         *
         *  Sets from a CSecret phrase (byte vector in secure allocator)
         *
         *  @param[in] vchSecret The secret allocator
         *  @param[in] fCompressed Flag if key is in compressed form.
         *
         **/
        void SetSecret(const LLC::CSecret& vchSecret, bool fCompressed);


        /** GetSecret
         *
         *  Gets the CSecret phrase (byte vector in secure allocator)
         *
         *  @param[out] fCompressedOut Flag to denote if the secret is in a compressed form.
         *
         **/
        LLC::CSecret GetSecret(bool &fCompressedOut);


        /** IsValid
         *
         *  Check if object passes validity tests
         *
         *  @return true if secret is valid.
         *
         **/
        bool IsValid() const;


        /** SetString
         *
         *  Sets the secret from a Base58 encoded c-style string.
         *
         *  @param[in] pszSecret The c-style string input
         *
         **/
        bool SetString(const char* pszSecret);


        /** SetString
         *
         *  Sets the secret from a Base58 encoded std::string.
         *
         *  @param[in] strSecret The std::string input
         *
         **/
        bool SetString(const std::string& strSecret);

    };

}

#endif
