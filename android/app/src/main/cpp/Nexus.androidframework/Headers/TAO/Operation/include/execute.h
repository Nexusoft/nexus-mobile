/*__________________________________________________________________________________________

            (c) Hash(BEGIN(Satoshi[2010]), END(Sunny[2012])) == Videlicet[2014] ++

            (c) Copyright The Nexus Developers 2014 - 2019

            Distributed under the MIT software license, see the accompanying
            file COPYING or http://www.opensource.org/licenses/mit-license.php.

            "ad vocem populi" - To the Voice of the People

____________________________________________________________________________________________*/

#pragma once

#include <cstdint>

/* Global TAO namespace. */
namespace TAO::Operation
{
    
    /* Forward declarations. */
    class Contract;


    /** Execute
     *
     *  Executes a given contract based on given flags
     *
     *  @param[in] contract The contract to execute
     *  @param[in] nFlags The flags to execute with.
     *
     *  @return True if operations executed successfully, false otherwise.
     *
     **/
    bool Execute(const Contract& contract, const uint8_t nFlags);


    /** Execute
     *
     *  Executes a given contract and calculates its cost
     *
     *  @param[in] contract The contract to execute
     *  @param[in] nFlags The flags to execute with.
     *  @param[out] nCost The calculated cost to execute this contract
     *
     *  @return True if operations executed successfully, false otherwise.
     *
     **/
    bool Execute(const Contract& contract, const uint8_t nFlags, uint64_t &nCost);

}
