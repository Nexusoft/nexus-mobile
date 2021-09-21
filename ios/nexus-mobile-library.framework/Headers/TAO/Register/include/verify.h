/*__________________________________________________________________________________________

            (c) Hash(BEGIN(Satoshi[2010]), END(Sunny[2012])) == Videlicet[2014] ++

            (c) Copyright The Nexus Developers 2014 - 2021

            Distributed under the MIT software license, see the accompanying
            file COPYING or http://www.opensource.org/licenses/mit-license.php.

            "ad vocem populi" - To the Voice of the People

____________________________________________________________________________________________*/

#pragma once
#ifndef NEXUS_TAO_REGISTER_INCLUDE_VERIFY_H
#define NEXUS_TAO_REGISTER_INCLUDE_VERIFY_H

#include <LLC/types/uint1024.h>

#include <TAO/Ledger/include/enum.h>

/* Global TAO namespace. */
namespace TAO
{

    /* Register layer. */
    namespace Operation
    {
        /* Forward declarations. */
        class Contract;
    }

    /* Register Layer namespace. */
    namespace Register
    {
        class State;

        /** Verify
         *
         *  Verify the pre-states of a register to current network state.
         *
         *  @param[in] contract The contract to verify.
         *  @param[out] mapStates The temporary states if pre-states rely on previous contracts.
         *  @param[in] nFlags The flags to verify for.
         *
         *  @return true if verified correctly, false otherwise.
         *
         **/
        bool Verify(const TAO::Operation::Contract& contract,
                    std::map<uint256_t, TAO::Register::State>& mapStates, const uint8_t nFlags = TAO::Ledger::FLAGS::BLOCK);

    }
}

#endif
