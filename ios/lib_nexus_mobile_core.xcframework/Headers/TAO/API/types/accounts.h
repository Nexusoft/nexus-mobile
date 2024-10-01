/*__________________________________________________________________________________________

            Hash(BEGIN(Satoshi[2010]), END(Sunny[2012])) == Videlicet[2014]++

            (c) Copyright The Nexus Developers 2014 - 2023

            Distributed under the MIT software license, see the accompanying
            file COPYING or http://www.opensource.org/licenses/mit-license.php.

            "ad vocem populi" - To the Voice of the People

____________________________________________________________________________________________*/

#pragma once

#include <LLC/types/uint1024.h>

#include <TAO/API/types/exception.h>

#include <TAO/Register/types/address.h>

#include <Util/include/math.h>

#include <vector>
#include <set>

/* Global TAO namespace. */
namespace TAO::API
{
    /** @class Accounts
     *
     *  Manages a list of accounts and balances for debiting from multiple accounts.
     *
     **/
    class Accounts
    {
        /** Vector of addresses and balances to check against. **/
        std::vector<std::pair<TAO::Register::Address, uint64_t>> vAddresses;


        /** Set of addresses, to track duplicate entries. **/
        std::set<uint256_t> setAddresses;


        /** Iterator for our vector to get current account. **/
        mutable uint32_t nIterator;


        /** The decimals for this specific token. **/
        uint8_t nDecimals;

    public:


        /* Default constructor. */
        Accounts()
        : vAddresses   ( )
        , setAddresses ( )
        , nIterator    (0)
        , nDecimals    (0)
        {
        }


        /* Copy constructor. */
        Accounts(const Accounts& in)
        : vAddresses   (in.vAddresses)
        , setAddresses (in.setAddresses)
        , nIterator    (in.nIterator)
        , nDecimals    (in.nDecimals)
        {
        }


        /* Move constructor. */
        Accounts(Accounts&& in)
        : vAddresses   (std::move(in.vAddresses))
        , setAddresses (std::move(in.setAddresses))
        , nIterator    (std::move(in.nIterator))
        , nDecimals    (std::move(in.nDecimals))
        {
        }


        /** Copy assignment. **/
        Accounts& operator=(const Accounts& in)
        {
            vAddresses   = in.vAddresses;
            setAddresses = in.setAddresses;
            nIterator    = in.nIterator;
            nDecimals    = in.nDecimals;

            return *this;
        }


        /** Move assignment. **/
        Accounts& operator=(Accounts&& in)
        {
            vAddresses   = std::move(in.vAddresses);
            setAddresses = std::move(in.setAddresses);
            nIterator    = std::move(in.nIterator);
            nDecimals    = std::move(in.nDecimals);

            return *this;
        }


        /** Default destructor. **/
        ~Accounts()
        {
        }


        /** Constructor for decimals. **/
        Accounts(const uint8_t nDecimalsIn)
        : vAddresses   ( )
        , setAddresses ( )
        , nIterator    (0)
        , nDecimals    (nDecimalsIn)
        {
        }


        /** Operator-= overload
         *
         *  Adjusts the balance for the currently loaded account.
         *
         *  @param[in] nBalance The balance to deduct by.
         *
         **/
        Accounts& operator-=(const uint32_t nBalance)
        {
            /* If we have exhausted our list of address, otherwise throw here. */
            if(nIterator >= vAddresses.size())
                throw Exception(-52, "No more available accounts for debit");

            /* Check that we don't underflow here. */
            if(vAddresses[nIterator].second < nBalance)
                throw Exception(-69, "Insufficient funds");

            /* Adjust the balance for designated account. */
            vAddresses[nIterator].second -= nBalance;

            return *this;
        }


        /** Operator++ overload
         *
         *  Adjusts the iterator for the currently loaded account.
         *
         **/
        Accounts& operator++(int)
        {
            /* If we have exhausted our list of address, otherwise throw here. */
            if(++nIterator >= vAddresses.size())
                throw Exception(-52, "No more available accounts for debit");

            return *this;
        }


        /** Insert
         *
         *  Insert a new address to our addresses vector.
         *
         *  @param[in] hashAddress The address to add to the list.
         *  @param[in] nBalance The balance to add to the vector.
         *
         **/
        void Insert(const TAO::Register::Address& hashAddress, const uint64_t nBalance)
        {
            /* Check for duplicates (check to protect against misuse). */
            if(setAddresses.count(hashAddress))
                return;

            /* Add to set for duplicate checks. */
            setAddresses.insert(hashAddress);

            /* Add to our address vector. */
            vAddresses.push_back(std::make_pair(hashAddress, nBalance));
        }


        /** HasNext
         *
         *  Checks if we have another account to iterate to.
         *
         **/
        bool HasNext() const
        {
            return (nIterator < (vAddresses.size() - 1));
        }


        /** Empty
         *
         *  Checks if we have an empty account address set.
         *
         **/
        bool Empty() const
        {
            return vAddresses.empty();
        }


        /** GetFigures
         *
         *  Expand the log-10 decimal value by a base-10 power to obtain the figures.
         *
         **/
        uint64_t GetFigures() const
        {
            return math::pow(10, nDecimals);
        }


        /** GetBalance
         *
         *  Get the balance of current token account being iterated.
         *
         **/
        uint64_t GetBalance() const
        {
            /* If we have exhausted our list of address, otherwise throw here. */
            if(nIterator >= vAddresses.size())
                throw Exception(-52, "No more available accounts for debit");

            return vAddresses[nIterator].second;
        }


        /** MaxBalance
         *
         *  Get the max balance of current token for all accounts
         *
         **/
        uint64_t MaxBalance() const
        {
            /* Keep track of return value. */
            uint64_t nBalance = 0;

            /* Iterate all of our addresses. */
            for(const auto& rAddress : vAddresses)
                nBalance += rAddress.second;

            return nBalance;
        }


        /** Reset
         *
         *  Reset the iterator starting point to 0
         *
         **/
        void Reset() const
        {
            nIterator = 0;
        }


        /** GetAddress
         *
         *  Gets the current address of the account we are operating on.
         *
         **/
        TAO::Register::Address GetAddress() const
        {
            /* If we have exhausted our list of address, otherwise throw here. */
            if(nIterator >= vAddresses.size())
                throw Exception(-52, "No more available accounts for debit");

            return vAddresses[nIterator].first;
        }
    };
}
