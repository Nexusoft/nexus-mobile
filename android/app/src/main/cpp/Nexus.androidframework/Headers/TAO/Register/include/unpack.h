/*__________________________________________________________________________________________

            (c) Hash(BEGIN(Satoshi[2010]), END(Sunny[2012])) == Videlicet[2014] ++

            (c) Copyright The Nexus Developers 2014 - 2019

            Distributed under the MIT software license, see the accompanying
            file COPYING or http://www.opensource.org/licenses/mit-license.php.

            "ad vocem populi" - To the Voice of the People

____________________________________________________________________________________________*/

#pragma once

#include <LLC/types/uint1024.h>

#include <TAO/Register/types/state.h>

#include <TAO/Ledger/types/transaction.h>

/* Global TAO namespace. */
namespace TAO::Register
{
    /** Unpack
     *
     *  Unpack a state register from a contract
     *
     *  @param[in] contract The contract to unpack from.
     *  @param[out] state the unpacked register
     *  @param[out] hashAddress the register address
     *
     *  @return true if register unpacked successfully
     *
     **/
    bool Unpack(const TAO::Operation::Contract& contract, State &state, uint256_t &hashAddress);


    /** Unpack
     *
     *  Unpack a source register address from a contract
     *
     *  @param[in] contract The contract to unpack from.
     *  @param[out] hashAddress register address to find.
     *
     *  @return true if the address unpacked successfully
     *
     **/
    bool Unpack(const TAO::Operation::Contract& contract, uint256_t &hashAddress);


    /** Unpack
     *
     *  Unpack a previous transaction hash and contract ID from a contract
     *
     *  @param[in] contract The contract to unpack from.
     *  @param[out] hashPrevTx finds a previous transaction
     *  @param[out] nContract the contract ID of the previous transaction
     *
     *  @return true if the previous tx hash and contract ID was unpacked successfully
     *
     **/
    bool Unpack(const TAO::Operation::Contract& contract, uint512_t& hashPrevTx, uint32_t& nContract);


    /** Unpack
     *
     *  Unpack the amount of NXS in contract.
     *
     *  Will unpack amount minted from coinbase, genesis, trust, ambassador, developer operations.
     *  Debit or credit unpack the amount debited or credited.
     *  Stake or unstake unpack the amount of NXS added to or removed from stake.
     *
     *  Other operations return false with nAmount of zero.
     *
     *  @param[in] contract The contract to unpack from.
     *  @param[out] nAmount NXS amount included in contract operation
     *
     *  @return true if the amount was unpacked successfully
     *
     **/
    bool Unpack(const TAO::Operation::Contract& contract, uint64_t& nAmount);


    /** Unpack
     *
     *  Unpack a contract to find it's primitive operation.
     *
     *  @param[in] tx the transaction to unpack
     *  @param[in] nCode op code value to test
     *
     *  @return true if the transaction contains the requested op code
     *
     **/
    bool Unpack(const TAO::Operation::Contract& contract, const uint8_t nCode);


    /** Unpack
     *
     *  Unpack an op legacy contract to find it's output script.
     *
     *  @param[in] tx the transaction to unpack
     *  @param[out] script The script to populate from the contract
     *
     *  @return true if the transaction contains the requested op code
     *
     **/
    bool Unpack(const TAO::Operation::Contract& contract, Legacy::Script& script);

}
