/*__________________________________________________________________________________________

            (c) Hash(BEGIN(Satoshi[2010]), END(Sunny[2012])) == Videlicet[2014] ++

            (c) Copyright The Nexus Developers 2014 - 2021

            Distributed under the MIT software license, see the accompanying
            file COPYING or http://www.opensource.org/licenses/mit-license.php.

            "ad vocem populi" - To the Voice of the People

____________________________________________________________________________________________*/

#pragma once
#ifndef NEXUS_LLD_INCLUDE_GLOBAL_H
#define NEXUS_LLD_INCLUDE_GLOBAL_H

#include <LLD/types/register.h>
#include <LLD/types/ledger.h>
#include <LLD/types/local.h>
#include <LLD/types/logical.h>
#include <LLD/types/client.h>
#include <LLD/types/legacy.h>
#include <LLD/types/trust.h>
#include <LLD/types/contract.h>

namespace LLD
{
    extern LogicalDB*    Logical;
    extern ContractDB*   Contract;
    extern RegisterDB*   Register;
    extern LedgerDB*     Ledger;
    extern LocalDB*      Local;
    extern ClientDB*     Client;

    //for legacy objects
    extern TrustDB*      Trust;
    extern LegacyDB*     Legacy;


    /** Initialize
     *
     *  Initialize the global LLD instances.
     *
     **/
    void Initialize();


    /** Indexing
     *
     *  Run our indexing entries and routines.
     *
     **/
    void Indexing();


    /** Shutdown
     *
     *  Shutdown and cleanup the global LLD instances.
     *
     **/
    void Shutdown();


    /** TxnRecover
     *
     *  Check the transactions for recovery.
     *
     **/
    void TxnRecovery();


    /** Txn Begin
     *
     *  Global handler for all LLD instances.
     *
     */
    void TxnBegin(const uint8_t nFlags = 0);


    /** Txn Abort
     *
     *  Global handler for all LLD instances.
     *
     */
    void TxnAbort(const uint8_t nFlags = 0);


    /** Txn Commit
     *
     *  Global handler for all LLD instances.
     *
     */
    void TxnCommit(const uint8_t nFlags = 0);
}

#endif
