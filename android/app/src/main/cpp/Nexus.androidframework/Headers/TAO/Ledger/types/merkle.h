/*__________________________________________________________________________________________

            (c) Hash(BEGIN(Satoshi[2010]), END(Sunny[2012])) == Videlicet[2014] ++

            (c) Copyright The Nexus Developers 2014 - 2019

            Distributed under the MIT software license, see the accompanying
            file COPYING or http://www.opensource.org/licenses/mit-license.php.

            "ad vocem populi" - To the Voice of the People

____________________________________________________________________________________________*/

#pragma once
#ifndef NEXUS_TAO_LEDGER_TYPES_MERKLE_H
#define NEXUS_TAO_LEDGER_TYPES_MERKLE_H

#include <TAO/Ledger/types/transaction.h>

#include <vector>


/* Global TAO namespace. */
namespace TAO
{

    /* Ledger Layer namespace. */
    namespace Ledger
    {

        /** @class MerkleTx
         *
         *  Class to store more information about a transaction in the blockchain.
         *  Keeps track of the merkle path of the transaction to verify to block header.
         *
         **/
        class MerkleTx : public Transaction
        {
        public:


            /** The block containing this transaction. **/
            uint1024_t hashBlock;


            /** The merkle path to generate merkle root. **/
            std::vector<uint512_t> vMerkleBranch;


            /** The transaction index in block. **/
            uint32_t nIndex;


            /** The default constructor. Sets block state to Null. **/
            MerkleTx();


            /** Copy constructor. **/
            MerkleTx(const MerkleTx& tx);


            /** Move constructor. **/
            MerkleTx(MerkleTx&& tx) noexcept;


            /** Copy constructor. **/
            MerkleTx(const Transaction& tx);


            /** Move constructor. **/
            MerkleTx(Transaction&& tx) noexcept;


            /** Copy assignment. **/
            MerkleTx& operator=(const MerkleTx& tx);


            /** Move assignment. **/
            MerkleTx& operator=(MerkleTx&& tx) noexcept;


            /** Copy assignment. **/
            MerkleTx& operator=(const Transaction& tx);


            /** Move assignment. **/
            MerkleTx& operator=(Transaction&& tx) noexcept;


            /** Default Destructor **/
            virtual ~MerkleTx();


            /* serialization macros */
            IMPLEMENT_SERIALIZE
            (
                /* Contracts layers. */
                READWRITE(vContracts);

                /* Ledger layer */
                READWRITE(nVersion);
                READWRITE(nSequence);
                READWRITE(nTimestamp);
                READWRITE(hashNext);
                READWRITE(hashRecovery);
                READWRITE(hashGenesis);
                READWRITE(hashPrevTx);
                READWRITE(nKeyType);
                READWRITE(nNextType);

                /* Check for skipping public key. */
                if(!(nSerType & SER_GETHASH) && !(nSerType & SER_SKIPPUB))
                    READWRITE(vchPubKey);

                /* Handle for when not getting hash or skipsig. */
                if(!(nSerType & SER_GETHASH) && !(nSerType & SER_SKIPSIG))
                    READWRITE(vchSig);

                /* We don't want merkle information for gethash. */
                if(!(nSerType & SER_GETHASH))
                {
                    READWRITE(hashBlock);
                    READWRITE(vMerkleBranch);
                    READWRITE(nIndex);

                    /* Reset our cache if deserializing. */
                    if(fRead)
                        hashCache = 0;
                }
            )


            /** Check
             *
             *  Checks if this transaction has a valid merkle path.
             *
             *  @param[in] hashMerkleRoot The merkle root to check to.
             *
             *  @return True if merkle path is valid.
             *
             **/
            bool CheckMerkleBranch(const uint512_t& hashMerkleRoot) const;



            /** BuildMerkleBranch
             *
             *  Builds a merkle branch from block state.
             *
             *  @param[in] state The block state to build branch from.
             *
             *  @return true if build was a success.
             *
             **/
            bool BuildMerkleBranch(const BlockState& state);


            /** BuildMerkleBranch
             *
             *  Builds a merkle branch from block hash.
             *
             *  @param[in] hashConfirmed The block's hash to build merkle branch from.
             *
             *  @return true if build was a success.
             *
             **/
            bool BuildMerkleBranch(const uint1024_t& hashConfirmed);


            /** BuildMerkleBranch
             *
             *  Builds a merkle branch without any block data.
             *
             *  @return true if build was a success.
             *
             **/
            bool BuildMerkleBranch();


            /** CommitLookup
             *
             *  Commits a merkle transaction to lookup internal memory.
             *
             *  @param[in] hashRegister The register's hash that we are looking up.
             *
             *  @return true if commit was a success.
             *
             **/
            bool CommitLookup(const uint256_t& hashRegister);


            /** Verify
             *
             *  Verifies a merkle transaction against the block merkle root and internal checks.
             *
             *  @return true if the merkle transaction is valid.
             *
             **/
            bool Verify(const uint8_t nFlags = 0) const;

        };

    }

}

#endif
