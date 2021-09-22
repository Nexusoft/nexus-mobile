/*__________________________________________________________________________________________

            (c) Hash(BEGIN(Satoshi[2010]), END(Sunny[2012])) == Videlicet[2014] ++

            (c) Copyright The Nexus Developers 2014 - 2021

            Distributed under the MIT software license, see the accompanying
            file COPYING or http://www.opensource.org/licenses/mit-license.php.

            "ad vocem populi" - To the Voice of the People

____________________________________________________________________________________________*/

#pragma once
#ifndef NEXUS_LLD_INCLUDE_ADDRESS_H
#define NEXUS_LLD_INCLUDE_ADDRESS_H

#include <LLD/templates/sector.h>
#include <LLD/cache/binary_lru.h>
#include <LLD/keychain/hashmap.h>

#include <LLP/include/trust_address.h>

namespace LLD
{

    /** AddressDB
     *
     *  The database class for peer addresses to determine trust relationships.
     *
     **/
    class AddressDB : public SectorDatabase<BinaryHashMap, BinaryLRU>
    {
    public:


        /** The Database Constructor. To determine file location and the Bytes per Record. **/
        AddressDB(const uint16_t nPort, const uint8_t nFlagsIn = FLAGS::CREATE | FLAGS::WRITE,
            const uint32_t nBucketsIn = 77773, const uint32_t nCacheIn = 1024 * 1024);


        /** Default Destructor **/
        virtual ~AddressDB();


        /** EraseTrustAddress
         *
         *  Erases the Trust Address from the database.
         *
         *  @param[in] nKey The key for the data location.
         *
         *  @return True if the write is successful, false otherwise.
         *
         **/
        bool EraseTrustAddress(uint64_t nKey);


        /** WriteTrustAddress
         *
         *  Writes the Trust Address to the database.
         *
         *  @param[in] nKey The key for the data location.
         *  @param[in] addr The TrustAddress object to serialize to disk.
         *
         *  @return True if the write is successful, false otherwise.
         *
         **/
        bool WriteTrustAddress(uint64_t nKey, const LLP::TrustAddress &addr);


        /** ReadTrustAddress
         *
         *  Reads the Trust Address from the database.
         *
         *  @param[in] nKey The key for the data location.
         *  @param[in] addr The TrustAddress object to deserialize from disk.
         *
         *  @return True if the read is successful, false otherwise.
         *
         **/
        bool ReadTrustAddress(uint64_t nKey, LLP::TrustAddress &addr);


        /** WriteThisAddress
         *
         *  Writes this address to the database.
         *
         *  @param[in] nKey The key for the data location.
         *  @param[in] this The TrustAddress object to serialize to disk.
         *
         *  @return True if the write is successful, false otherwise.
         *
         **/
        bool WriteThisAddress(uint64_t nKey, const LLP::BaseAddress &this_addr);


        /** ReadThisAddress
         *
         *  Reads the this address from the database.
         *
         *  @param[in] nKey The key for the data location.
         *  @param[in] this_addr The TrustAddress object to deserialize from disk.
         *
         *  @return True if the read is successful, false otherwise.
         *
         **/
        bool ReadThisAddress(uint64_t nKey, LLP::BaseAddress &this_addr);


        /** WriteLastUpdate
         *
         *  Writes the last time DNS was updated.
         *
         *  @return True if the read is successful, false otherwise.
         *
         **/
        bool WriteLastUpdate();


        /** ReadLastUpdate
         *
         *  Reads the last time DNS was updated.
         *
         *  @param[out] nUpdated The last time that DNS was updated.
         *
         *  @return True if the read is successful, false otherwise.
         *
         **/
        bool ReadLastUpdate(uint64_t& nUpdated);
    };
}

#endif
