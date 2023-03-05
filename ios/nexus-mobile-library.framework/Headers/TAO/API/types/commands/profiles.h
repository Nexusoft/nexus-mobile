/*__________________________________________________________________________________________

            (c) Hash(BEGIN(Satoshi[2010]), END(Sunny[2012])) == Videlicet[2014] ++

            (c) Copyright The Nexus Developers 2014 - 2019

            Distributed under the MIT software license, see the accompanying
            file COPYING or http://www.opensource.org/licenses/mit-license.php.

            "ad vocem populi" - To the Voice of the People

____________________________________________________________________________________________*/

#pragma once

#include <TAO/API/types/base.h>

#include <Util/include/memory.h>

namespace TAO::Operation { class Contract;       }
namespace TAO::Ledger    { class Credentials; }

/* Global TAO namespace. */
namespace TAO::API
{
    /** Profiles
     *
     *  Profiles API Class.
     *  Manages the function pointers for all Profiles commands.
     *
     **/
    class Profiles : public Derived<Profiles>
    {
    public:

        /** Default Constructor. **/
        Profiles()
        : Derived<Profiles>()
        {
        }


        /** Initialize.
         *
         *  Sets the function pointers for this API.
         *
         **/
        void Initialize() final;


        /** Name
         *
         *  Returns the name of this API.
         *
         **/
        static std::string Name()
        {
            return "profiles";
        }


        /** Create
         *
         *  Creates a new session based on login credentials.
         *
         *  @param[in] jParams The parameters from the API call.
         *  @param[in] fHelp Trigger for help data.
         *
         *  @return The return object in JSON.
         *
         **/
        encoding::json Create(const encoding::json& jParams, const bool fHelp);


        /** Notifications
         *
         *  Lists the current notifications for given user's sigchain.
         *
         *  @param[in] jParams The parameters from the API call.
         *  @param[in] fHelp Trigger for help data.
         *
         *  @return The return object in JSON.
         *
         **/
        encoding::json Notifications(const encoding::json& jParams, const bool fHelp);


        /** Recover
         *
         *  Recovers a profile using recovery phrase.
         *
         *  @param[in] jParams The parameters from the API call.
         *  @param[in] fHelp Trigger for help data.
         *
         *  @return The return object in JSON.
         *
         **/
        encoding::json Recover(const encoding::json& jParams, const bool fHelp);


        /** Status
         *
         *  Gets the status of given profile
         *
         *  @param[in] jParams The parameters from the API call.
         *  @param[in] fHelp Trigger for help data.
         *
         *  @return The return object in JSON.
         *
         **/
        encoding::json Status(const encoding::json& jParams, const bool fHelp);


        /** Transactions
         *
         *  Lists the current transactions for given user's sigchain.
         *
         *  @param[in] jParams The parameters from the API call.
         *  @param[in] fHelp Trigger for help data.
         *
         *  @return The return object in JSON.
         *
         **/
        encoding::json Transactions(const encoding::json& jParams, const bool fHelp);


        /** Update
         *
         *  Updates a given sigchain's credentials or recovery phrase
         *
         *  @param[in] jParams The parameters from the API call.
         *  @param[in] fHelp Trigger for help data.
         *
         *  @return The return object in JSON.
         *
         **/
        encoding::json Update(const encoding::json& jParams, const bool fHelp);

    };
}
