/*__________________________________________________________________________________________

            (c) Hash(BEGIN(Satoshi[2010]), END(Sunny[2012])) == Videlicet[2014] ++

            (c) Copyright The Nexus Developers 2014 - 2021

            Distributed under the MIT software license, see the accompanying
            file COPYING or http://www.opensource.org/licenses/mit-license.php.

            "ad vocem populi" - To the Voice of the People

____________________________________________________________________________________________*/

#pragma once

#include <TAO/API/types/exception.h>

#include <Util/include/json.h>
#include <Util/include/string.h>
#include <Util/include/version.h>

#include <functional>
#include <memory>

/* Global TAO namespace. */
namespace TAO::API
{
    /** Function
     *
     *  Base class for all JSON based API methods
     *  Encapsulates the function pointer to the method to process the API request
     *
     **/
    class Function
    {
        /** The function pointer to be called. */
        std::function<encoding::json(const encoding::json&, bool)> tFunction;


        /** The activation timestamp. **/
        uint64_t nActivation;


        /** The deprecation version. **/
        uint32_t nMaxVersion;


        /** The deprecation message and info. **/
        std::string strMessage;


        /** The allowed nouns for this function. **/
        std::set<std::string> setNouns;


    public:


        /** Default Constructor. **/
        Function()
        : tFunction   ( )
        , nActivation (0)
        , nMaxVersion (0)
        , strMessage  ( )
        , setNouns    ( )
        {
        }


        /** Constructor
         *
         *  Base constructor with no deprecation data, only activation timestamp with default value to disabled.
         *  An activation timestamp of zero means that command activates with release of update, not at hard fork time.
         *
         *  @param[in] tFunctionIn The function to be executed by this class.
         *  @param[in] nActivationIn The activating timestamp if this method activates with hard fork. default value of 0.
         *
         **/
        Function(const std::function<encoding::json(const encoding::json&, bool)> tFunctionIn, const uint64_t nActivationIn = 0)
        : tFunction   (tFunctionIn)
        , nActivation (nActivationIn) //default: zero denotes there is no activation switch
        , nMaxVersion (0)
        , strMessage  ( )
        , setNouns    ( )
        {
        }


        /** Constructor
         *
         *  Base constructor with no deprecation data, only activation timestamp with default value to disabled.
         *  An activation timestamp of zero means that command activates with release of update, not at hard fork time.
         *
         *  @param[in] tFunctionIn The function to be executed by this class.
         *  @param[in] nActivationIn The activating timestamp if this method activates with hard fork. default value of 0.
         *
         **/
        Function(const std::function<encoding::json(const encoding::json&, bool)> tFunctionIn, const std::string& strNouns)
        : tFunction   (tFunctionIn)
        , nActivation (0) //default: zero denotes there is no activation switch
        , nMaxVersion (0)
        , strMessage  ( )
        , setNouns    ( )
        {
            /* Grab our nouns to add to the set. */
            ParseString(strNouns, ',', setNouns, true); //true to trim spaces
        }


        /** Constructor
         *
         *  Alternative constructor following value sequence of base constructor and no default parameters
         *
         *  @param[in] tFunctionIn The function to be executed by this class.
         *  @param[in] nActivationIn The activating timestamp if this method activates with hard fork.
         *  @param[in] nMaxVersionIn The maximum version this function can be called on.
         *  @param[in] strMessageIn The deprecation message including info for re-routes or alternative methods.
         *
         **/
        Function(const std::function<encoding::json(const encoding::json&, bool)> tFunctionIn,
                 const uint64_t nActivationIn, const uint32_t nMaxVersionIn, const std::string& strMessageIn)
        : tFunction   (tFunctionIn)
        , nActivation (nActivationIn)
        , nMaxVersion (nMaxVersionIn)
        , strMessage  (strMessageIn)
        , setNouns    ( )
        {
        }


        /** Constructor
         *
         *  Constructor for Deprecation with activation as a default parameter, generally for non-activating deprecation.
         *  An activation timestamp of zero means that command activates with release of update, not at hard fork time.
         *
         *  @param[in] tFunctionIn The function to be executed by this class.
         *  @param[in] nMaxVersionIn The maximum version this function can be called on.
         *  @param[in] strMessageIn The deprecation message including info for re-routes or alternative methods.
         *  @param[in] nActivationIn The activating timestamp if this method activates with hard fork, default value of 0.
         *
         **/
        Function(const std::function<encoding::json(const encoding::json&, bool)> tFunctionIn,
                 const uint32_t nMaxVersionIn, const std::string& strMessageIn, const uint64_t nActivationIn = 0)
        : tFunction   (tFunctionIn)
        , nActivation (nActivationIn)
        , nMaxVersion (nMaxVersionIn)
        , strMessage  (strMessageIn)
        , setNouns    ( )
        {
        }


        /** Execute
         *
         *  Executes the function pointer.
         *
         *  @param[in] jParams The json formatted parameters
         *  @param[in] fHelp Flag if help is invoked
         *
         *  @return The json formatted response.
         *
         **/
        encoding::json Execute(const encoding::json& jParams, const bool fHelp)
        {
            /* Check for activation status. */
            const uint64_t nTimestamp = runtime::unifiedtimestamp();
            if(nActivation != 0 && nTimestamp < nActivation)
                throw Exception(-1, "Method not available: activates in ", (nActivation - nTimestamp), " seconds");

            /* Check for deprecation status. */
            if(nMaxVersion != 0 && version::CLIENT_VERSION >= nMaxVersion)
                throw Exception(-3, "Method was deprecated at version ", version::version_string(nMaxVersion), ": ", strMessage);

            return tFunction(jParams, fHelp);
        }


        /** Status
         *
         *  Get status message for current function.
         *
         **/
        __attribute__((pure)) std::string Status() const
        {
            /* Check for activation status. */
            if(nActivation != 0 && runtime::unifiedtimestamp() < nActivation)
                return "inactive";

            /* Check for deprecation status messages ahead by one minor version increment. */
            if(nMaxVersion != 0)
            {
                /* Give deprecation message if in deprecation period. */
                if(version::CLIENT_VERSION < nMaxVersion)
                    return debug::safe_printstr("Method to be deprecated at version ", version::version_string(nMaxVersion), ": ", strMessage);

                return "deprecated";
            }

            return "active";
        }


        /** Supported
         *
         *  Checks if a specific noun is supported by the API.
         *
         **/
        __attribute__((pure)) bool Supported(const std::string& strNoun) const
        {
            return setNouns.count(strNoun);
        }


        /** Standards
         *
         *  Checks if a specific standards are generated by the API
         *
         **/
        __attribute__((pure)) bool Standards() const
        {
            return setNouns.empty();
        }
    };
}
