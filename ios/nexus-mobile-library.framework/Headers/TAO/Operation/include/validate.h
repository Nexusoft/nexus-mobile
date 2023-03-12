/*__________________________________________________________________________________________

            (c) Hash(BEGIN(Satoshi[2010]), END(Sunny[2012])) == Videlicet[2014] ++

            (c) Copyright The Nexus Developers 2014 - 2021

            Distributed under the MIT software license, see the accompanying
            file COPYING or http://www.opensource.org/licenses/mit-license.php.

            "ad vocem populi" - To the Voice of the People

____________________________________________________________________________________________*/

#pragma once
#ifndef NEXUS_TAO_OPERATION_INCLUDE_VALIDATE_H
#define NEXUS_TAO_OPERATION_INCLUDE_VALIDATE_H

#include <LLC/types/uint1024.h>

/* Global TAO namespace. */
namespace TAO
{

    /* Register layer. */
    namespace Register
    {
        /* Forward declarations. */
        class State;
    }


    /* Operation Layer namespace. */
    namespace Operation
    {

        /* Forward declarations. */
        class Contract;


        /** Claim
         *
         *  Namespace to contain main functions for OP::CLAIM
         *
         **/
        namespace Validate
        {

            /** Commit
             *
             *  Commit validation proofs.
             *
             *  @param[in] contract The contract that is executing.
             *  @param[in] hashTx The transaction-id being claimed.
             *  @param[in] nContract The contract output being claimed.
             *  @param[in] hashCaller The contract caller.
             *  @param[in] nFlags Flags to the LLD instance.
             *
             *  @return true if successful.
             *
             **/
            bool Commit(const Contract& contract, const uint512_t& hashTx, const uint32_t nContract, const uint256_t& hashCaller, const uint8_t nFlags);


            /** Verify
             *
             *  Verify validation rules and caller.
             *
             *  @param[in] contract The contract that is executing.
             *  @param[in] condition The contract that is being verified.
             *  @param[out] nCost The calculated cost to execute the condition
             *
             *  @return true if successful.
             *
             **/
            bool Verify(const Contract& contract, const Contract& condition, uint64_t &nCost);
        }
    }
}

#endif
