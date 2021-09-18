/*__________________________________________________________________________________________

            (c) Hash(BEGIN(Satoshi[2010]), END(Sunny[2012])) == Videlicet[2014] ++

            (c) Copyright The Nexus Developers 2014 - 2021

            Distributed under the MIT software license, see the accompanying
            file COPYING or http://www.opensource.org/licenses/mit-license.php.

            "ad vocem populi" - To the Voice of the People

____________________________________________________________________________________________*/

#pragma once
#ifndef NEXUS_LEGACY_INCLUDE_CONSTANTS_H
#define NEXUS_LEGACY_INCLUDE_CONSTANTS_H

#include <LLC/types/bignum.h>
#include <Util/include/base58.h>

#include <string>
#include <vector>


namespace Legacy
{

    /** Byte vector representation of false. **/
    const std::vector<uint8_t> vchFalse(0);


    /** Byte vector representation of zero. **/
    const std::vector<uint8_t> vchZero(0);


    /** Byte vector representation of true. **/
    const std::vector<uint8_t> vchTrue(1, 1);


    /** Big Number representation of zero. **/
    const LLC::CBigNum bnZero(0);


    /** Big Number representation of one. **/
    const LLC::CBigNum bnOne(1);


    /** Big Number representation of false. **/
    const LLC::CBigNum bnFalse(0);


    /** Big Number representation of true. **/
    const LLC::CBigNum bnTrue(1);


    /** Maximum size of numeric values. **/
    const size_t nMaxNumSize = 4;


    /** string used to sign Nexus messages **/
    const std::string strMessageMagic = "Nexus Signed Message:\n";


    /** Old legacy outdated threshold, currently a placeholder. **/
    const int64_t LOCKTIME_THRESHOLD = 500000000;


    /** The network current transaction version. **/
    const uint32_t TRANSACTION_CURRENT_VERSION = 2;

}

#endif
