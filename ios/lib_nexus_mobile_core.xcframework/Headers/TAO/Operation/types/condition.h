/*__________________________________________________________________________________________

            Hash(BEGIN(Satoshi[2010]), END(Sunny[2012])) == Videlicet[2014]++

            (c) Copyright The Nexus Developers 2014 - 2023

            Distributed under the MIT software license, see the accompanying
            file COPYING or http://www.opensource.org/licenses/mit-license.php.

            "ad vocem populi" - To the Voice of the People

____________________________________________________________________________________________*/

#pragma once
#ifndef NEXUS_TAO_OPERATION_TYPES_VALIDATE_H
#define NEXUS_TAO_OPERATION_TYPES_VALIDATE_H

#include <TAO/Operation/types/stream.h>

#include <TAO/Register/types/basevm.h>
#include <TAO/Register/types/value.h>

#include <TAO/Ledger/types/transaction.h>

#include <stack>

namespace TAO
{

    namespace Operation
    {
        /** Validate
         *
         *  An object to handle the executing of validation scripts.
         *
         **/
        class Condition : public TAO::Register::BaseVM
        {
            /** Reference of the contract being execute. **/
            const Contract& contract;


            /** Reference of the contract that is calling validation. **/
            const Contract& caller;


            /** Build the stack for nested grouping. **/
            std::stack<std::pair<bool, uint8_t>> vEvaluate;


        public:


            /** Computational limits for validation script. **/
            uint64_t nCost;


            /** Default Constructor. **/
            Condition() = delete;


            /** Copy constructor. **/
            Condition(const Condition& condition);


            /** Move constructor. **/
            Condition(Condition&& condition) noexcept;


            /** Copy assignment. **/
            Condition& operator=(const Condition& condition) = delete;


            /** Move assignment. **/
            Condition& operator=(Condition&& condition)      = delete;


            /** Default Destructor **/
            virtual ~Condition();


            /** Default constructor. **/
            Condition(const Contract& contractIn, const Contract& callerIn, const int64_t nCostIn = 0);


            /** Execute
             *
             *  Execute the validation script.
             *
             **/
            bool Execute();


            /** Evaluate
             *
             *  Evaluate the validation script.
             *
             **/
            bool Evaluate();


            /** GetValue
             *
             *  Get a value from the register virtual machine.
             *
             **/
             bool GetValue(TAO::Register::Value& vRet);


            private:

            /** EvaluateV1
             *
             *  Evaluate the conditions for version 1 transactions.
             *
             **/
            bool EvaluateV1();


            /** EvaluateV1
             *
             *  Evaluate the conditions for version 2 transactions.
             *
             **/
            bool EvaluateV2();



        };
    }
}

#endif
