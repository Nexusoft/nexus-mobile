/*__________________________________________________________________________________________

            (c) Hash(BEGIN(Satoshi[2010]), END(Sunny[2012])) == Videlicet[2014] ++

            (c) Copyright The Nexus Developers 2014 - 2021

            Distributed under the MIT software license, see the accompanying
            file COPYING or http://www.opensource.org/licenses/mit-license.php.

            "ad vocem populi" - To the Voice of the People

____________________________________________________________________________________________*/
#pragma once

#include <Util/include/json.h>
#include <TAO/Ledger/types/transaction.h>

/* Global TAO namespace. */
namespace TAO
{

    /* API Layer namespace. */
    namespace API
    {
        /** HasCondition
        *
        *  Determines if a contract contains a specific condition.  The method searches the bytes of the conditions stream to see
        *  if the pattern for condition exists somewhere within it 
        *
        *  @param[in] contract The contract to check
        *  @param[in] condition The contract to search for
        *
        *  @return true if the contract contains the condition
        *
        **/
        bool HasCondition(const TAO::Operation::Contract& contract, const TAO::Operation::Contract& condition);
        
        
        /** AddExpires
        *
        *  Checks the params for the existence of the "expires" field.  If supplied, a condition will be added to this contract
        *  for the expiration .
        *
        *  @param[in] params The parameters passed in the request
        *  @param[in] hashCaller The genesis hash of the API caller 
        *  @param[in] contract The contract to add the conditions to
        *  @param[in] fTokenizedDebit flag indicating if the contract is a debit to a tokenized asset 
        *
        *  @return true if the conditions were successfully added, otherwise false
        *
        **/
        bool AddExpires(const json::json& params, const uint256_t& hashCaller, TAO::Operation::Contract& contract, bool fTokenizedDebit);


        /** HasExpires
        *
        *  Determines if a contract has an expiration condition.  The method searches the bytes of the conditions stream to see
        *  if the pattern for an expiration condition exists somewhere in the conditions 
        *
        *  @param[in] contract The contract to check
        *
        *  @return true if the contract contains an expiration condition
        *
        **/
        bool HasExpires(const TAO::Operation::Contract& contract);
    
    } /* End API namespace */

}/* End TAO namespace */