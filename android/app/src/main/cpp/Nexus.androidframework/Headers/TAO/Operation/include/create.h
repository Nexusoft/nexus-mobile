/*__________________________________________________________________________________________

            Hash(BEGIN(Satoshi[2010]), END(Sunny[2012])) == Videlicet[2014]++

            (c) Copyright The Nexus Developers 2014 - 2023

            Distributed under the MIT software license, see the accompanying
            file COPYING or http://www.opensource.org/licenses/mit-license.php.

            "ad vocem populi" - To the Voice of the People

____________________________________________________________________________________________*/

#pragma once
#ifndef NEXUS_TAO_OPERATION_INCLUDE_CREATE_H
#define NEXUS_TAO_OPERATION_INCLUDE_CREATE_H

#include <LLC/types/uint1024.h>

/* Global TAO namespace. */
namespace TAO
{

    /* Register layer. */
    namespace Register
    {
        /* Forward declarations. */
        class State;
        class Address;
    }


    /* Operation Layer namespace. */
    namespace Operation
    {

        /* Forward declarations. */
        class Contract;


        /** Create
         *
         *  Namespace to contain main functions for OP::CREATE
         *
         **/
        namespace Create
        {

            /** Commit
             *
             *  Commit the final state to disk.
             *
             *  @param[in] state The state to commit.
             *  @param[in] address The register address to commit.
             *  @param[in] nFees The fees required to create register.
             *  @param[in] nFlags Flags to the LLD instance.
             *
             *  @return true if successful.
             *
             **/
            bool Commit(const TAO::Register::State& state,
                const TAO::Register::Address& address, uint64_t& nCost, const uint8_t nFlags);


            /** Execute
             *
             *  Creates a new register if it doesn't exist.
             *
             *  @param[out] state The state register to operate on.
             *  @param[in] vchData The data script to write into register.
             *  @param[in] nTimestamp The timestamp to update register to.
             *
             *  @return true if successful.
             *
             **/
            bool Execute(TAO::Register::State &state, const std::vector<uint8_t>& vchData, const uint64_t nTimestamp);


            /** Verify
             *
             *  Verify create validation rules and caller.
             *
             *  @param[in] contract The contract to verify.
             *
             *  @return true if successful.
             *
             **/
            bool Verify(const Contract& contract);
        }
    }
}

#endif
