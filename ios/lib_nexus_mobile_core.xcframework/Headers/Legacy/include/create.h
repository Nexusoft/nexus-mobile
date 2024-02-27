/*__________________________________________________________________________________________

            Hash(BEGIN(Satoshi[2010]), END(Sunny[2012])) == Videlicet[2014]++

            (c) Copyright The Nexus Developers 2014 - 2023

            Distributed under the MIT software license, see the accompanying
            file COPYING or http://www.opensource.org/licenses/mit-license.php.

            "ad vocem populi" - To the Voice of the People

____________________________________________________________________________________________*/

#pragma once
#ifndef NEXUS_LEGACY_INCLUDE_CREATE_H
#define NEXUS_LEGACY_INCLUDE_CREATE_H

#include <Legacy/types/legacy.h>
#include <Legacy/types/coinbase.h>
#include <Legacy/types/reservekey.h>

#ifndef NO_WALLET
#include <Legacy/wallet/wallet.h>
#endif

namespace Legacy
{

    /** CreateBlock
     *
     *  Construct a new legacy block.
     *
     *  Adds the initial coinbase/coinstake transaction.
     *
     *  @param[in] coinbaseKey Key for receiving coinbase reward. Not used for staking channel.
     *
     *  @param[in] coinbaseRecipients Optional coinbase to allow multiple coinbase recipients.
     *
     *  @param[in] nChannel The minting channel creating the block.
     *
     *  @param[in] nID Used for coinbase input scriptsig. Not used for staking channel
     *
     *  @param[in, out] newBlock The block object being created.
     *
     *  @return true if block successfully created
     *
     **/
    bool CreateBlock(Legacy::ReserveKey& coinbaseKey, const Legacy::Coinbase& coinbaseRecipients, const uint32_t nChannel, const uint32_t nID, LegacyBlock& newBlock);


    /** CreateCoinstake
     *
     *  Create the Coinstake transaction for a legacy block.
     *
     *  This method only populates base data that does not rely on trust key. The stake minter will add the rest.
     *
     *  @param[in, out] coinstakeTx The Coinstake transaction to create.
     *
     *  @return true if transaction successfully created
     *
     **/
    bool CreateCoinstake(Transaction& coinstakeTx);


    /** CreateCoinbase
     *
     *  Create the Coinbase transaction for a legacy block.
     *
     *  @param[in] coinbaseKey Key for receiving coinbase reward.
     *
     *  @param[in] coinbaseRecipients Optional coinbase to allow multiple coinbase recipients.
     *
     *  @param[in] nChannel The minting channel creating the block.
     *
     *  @param[in] nID Used for coinbase input scriptsig.
     *
     *  @param[in] nNewBlockVersion The block version being created
     *
     *  @param[in, out] coinbaseTx The Coinbase transaction to create.
     *
     *  @return true if transaction successfully created
     *
     **/
    bool CreateCoinbase(Legacy::ReserveKey& coinbaseKey, const Legacy::Coinbase& coinbaseRecipients, const uint32_t nChannel,
                                   const uint32_t nID, const uint32_t nNewBlockVersion, Transaction& coinbaseTx);


    /** AddTransactions
     *
     *  Add transactions from mempool into the vtx for a legacy block.
     *
     *  @param[in, out] vtx The block transactions to populate.
     *
     **/
    void AddTransactions(std::vector<Transaction>& vtx);


#ifndef NO_WALLET

    /** SignBlock
     *
     *  Sign the block with the key that found the block.
     *
     *  @param[in, out] block The block to sign
     *
     *  @param[in] keystore The wallet containing the key that created the block (Coinbase/Coinstake generator)
     *
     *  @return true if the block was successfully signed
     *
     **/
    bool SignBlock(LegacyBlock& block, const KeyStore& keystore);


    /** CheckWork
     *
     * Work Check Before Submit.
     * This checks the work as a miner, a lot more conservatively than the network will check it
     * to ensure that you do not submit a bad block.
     *
     * This method does NOT submit the block to the network.
     *
     * @param[in] block The newly mined block
     *
     * @param[in] wallet Wallet containing key paid by Coinbase/Coinstake transaction
     *
     * @return true if the block checks out and is ok to submit
     *
     **/
    bool CheckWork(const LegacyBlock& block, Legacy::Wallet& wallet);

#endif

}

#endif
