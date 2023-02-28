/*__________________________________________________________________________________________

(c) Hash(BEGIN(Satoshi[2010]), END(Sunny[2012])) == Videlicet[2014] ++

(c) Copyright The Nexus Developers 2014 2018

Distributed under the MIT software license, see the accompanying
file COPYING or http://www.opensource.org/licenses/mit-license.php.

"ad vocem populi" To the Voice of the People

____________________________________________________________________________________________*/

#pragma once
#ifndef NEXUS_TAO_LEDGER_TYPES_TRITIUM_MINTER_H
#define NEXUS_TAO_LEDGER_TYPES_TRITIUM_MINTER_H

#include <TAO/Ledger/types/stake_minter.h>

#include <TAO/Ledger/types/credentials.h>

#include <Util/include/allocators.h>

#include <atomic>
#include <thread>


/* Global TAO namespace. */
namespace TAO
{

    /* Ledger namespace. */
    namespace Ledger
    {

    /** @class TritiumMinter
     *
     * This class supports solo mining blocks on the Proof of Stake channel.
     *
     * It is implemented as a Singleton instance retrieved by calling GetInstance().
     *
     * Staking does not start, though, until Start() is called for the first time.
     * It requires single user mode, with a user account unlocked for staking before it will start successfully.
     *
     * The stake balance and trust score from the trust account will be used for Proof of Stake.
     * A new trust account register must be created for the active user account signature chain and balance
     * sent to this account before it can successfully stake.
     *
     * The initial stake transaction for a new trust account is the Genesis transaction using OP::GENESIS
     * in the block producer. Genesis commits the current available balance from the trust account to the stake balance.
     *
     * All subsequent stake transactions are Trust transactions and use OP::TRUST applied to the committed stake balance.
     *
     * Committed stake may be changed by a StakeChange stored in the local database. Added stake is moved from the available
     * balance in the trust account to the committed stake balance upon successfully mining a stake block. Although the added
     * amount is not moved until a block is found, it is immediately included in stake minting calculations. Stake
     * removed (unstake) is moved from committed stake to available balance (with associated trust cost) upon successfully
     * mining a stake block. The unstake amount continues to be included in minting calculations until it is moved.
     *
     * Staking operations can be suspended by calling Stop() (for example, when the account is locked)
     * and restarted by calling Start() again.
     *
     **/
    class TritiumMinter final : public TAO::Ledger::StakeMinter
    {
    public:
        /** Copy constructor deleted **/
        TritiumMinter(const TritiumMinter&) = delete;

        /** Copy assignment deleted **/
        TritiumMinter& operator=(const TritiumMinter&) = delete;


        /** Destructor **/
        ~TritiumMinter() {}


        /** GetInstance
         *
         * Retrieves the TritiumMinter.
         *
         * @return reference to the TritiumMinter instance
         *
         **/
        static TritiumMinter& GetInstance();


        /** Start
         *
         * Start the stake minter.
         *
         * Call this method to start the stake minter thread and begin mining Proof of Stake, or
         * to restart it after it was stopped.
         *
         * In general, this method should be called when a signature chain is unlocked for staking.
         *
         * If the system is configured not to run the TritiumMinter, this method will return false.
         *
         * After calling this method, the TritiumMinter thread may stay in suspended state if
         * the local node is synchronizing, or if it does not have any connections, yet.
         * In that case, it will automatically begin when sync is complete and connections
         * are available.
         *
         * @return true if the stake minter was started, false if it was already running or not started
         *
         */
        bool Start() override;


        /** Stop
         *
         * Stops the stake minter.
         *
         * Call this method to signal the stake minter thread stop Proof of Stake mining and end.
         * It can be restarted via a subsequent call to Start().
         *
         * Should be called whenever the wallet is locked, and on system shutdown.
         *
         * @return true if the stake minter was stopped, false if it was already stopped
         *
         */
        bool Stop() override;


    protected:
        /** CreateCoinstake
         *
         *  Create the coinstake transaction for a solo Proof of Stake block and add it as the candidate block producer.
         *
         *  @param[in] hashGenesis The genesis-id of the producer who is creating block
         *
         *  @return true if the coinstake was successfully created
         *
         **/
        bool CreateCoinstake(const uint256_t& hashGenesis) override;


        /** MintBlock
         *
         *  Initialize the staking process for solo Proof of Stake and call HashBlock() to perform block hashing.
         *
         *  @param[in] hashGenesis The genesis-id of the producer who is creating block
         *
         **/
        void MintBlock(const uint256_t& hashGenesis) override;


        /** CheckBreak
         *
         *  Check whether or not to stop hashing in HashBlock() to process block updates.
         *
         *  @return always false for solo staking
         *
         **/
        bool CheckBreak() override;


        /** CheckStale
         *
         *  Check that producer coinstake won't orphan any new transaction for the same hashGenesis received in mempool
         *  since starting work on the current block.
         *
         *  @return true if current block is stale
         *
         **/
        bool CheckStale() override;


        /** CalculateCoinstakeReward
         *
         *  Calculate the coinstake reward for a solo mined Proof of Stake block.
         *
         *  @param[in] nTime the time for which the reward will be calculated
         *
         *  @return the amount of reward paid by the block
         *
         **/
        uint64_t CalculateCoinstakeReward(uint64_t nTime) override;


    private:
        /** Set true when solo minter thread starts and remains true while it is running **/
        static std::atomic<bool> fStarted;


        /** Thread for operating the stake minter **/
        static std::thread stakeMinterThread;


        /** Constructor **/
        TritiumMinter() {}


        /** StakeMinterThread
         *
         *  Method run on its own thread to oversee stake minter operation using the methods in the
         *  tritium minter instance. The thread will continue running after initialized, but operation can
         *  be stopped/restarted by using the stake minter methods.
         *
         *  On shutdown, the thread will cease operation and wait for the minter destructor to tell it to exit/join.
         *
         *  @param[in] pTritiumMinter the minter thread will use this instance to perform all the tritium minter work
         *
         **/
        static void StakeMinterThread(TritiumMinter* pTritiumMinter);

        };

    }
}

#endif
