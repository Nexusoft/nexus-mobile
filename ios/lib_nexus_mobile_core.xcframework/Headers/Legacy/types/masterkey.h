/*__________________________________________________________________________________________

			Hash(BEGIN(Satoshi[2010]), END(Sunny[2012])) == Videlicet[2014]++

			(c) Copyright The Nexus Developers 2014 - 2023

			Distributed under the MIT software license, see the accompanying
			file COPYING or http://www.opensource.org/licenses/mit-license.php.

			"ad vocem populi" - To the Voice of the People

____________________________________________________________________________________________*/

#pragma once
#ifndef NEXUS_LEGACY_TYPES_MASTERKEY_H
#define NEXUS_LEGACY_TYPES_MASTERKEY_H

#include <Util/templates/serialize.h>

#include <vector>

namespace Legacy
{

    /** @class MasterKey
     *
     *  Master key for wallet encryption
     *
     *  Private key encryption is done based on a MasterKey,
     *  which holds a salt and random encryption key.
     *
     *  MasterKeys are encrypted using AES-256-CBC using a key
     *  derived using derivation method nDerivationMethod
     *  (0 == EVP_sha512()) and derivation iterations nDeriveIterations.
     *  vchOtherDerivationParameters is provided for alternative algorithms
     *  which may require more parameters (such as scrypt).
     *
     *  For wallet, the wallet passphrase provides the key source for this derivation.
     *
     *  Wallet Private Keys are then encrypted using AES-256-CBC
     *  with the SK576 of the public key as the IV, and the
     *  master key's key as the encryption key (see CryptoKeyStore).
     *
     * Database key is mkey<ID>
     **/
    class MasterKey
    {
    public:

        /** Encrypted master key. Must be decrypted before use. **/
        std::vector<uint8_t> vchCryptedKey;


        /** Salt value used for encrypting master key value **/
        std::vector<uint8_t> vchSalt;


        /** Derivation method used for key context of master key encryption
         *  0 = EVP_sha512() = default, used for Nexus derivation
         *  1 = scrypt()
         **/
        uint32_t nDerivationMethod;


        /** Number of derivation iterations **/
        uint32_t nDeriveIterations;


        /** Use this for more parameters to key derivation, such as the various parameters to scrypt
         *
         *  @deprecated This value not used by Nexus but still defined to support wallets
         *  that have it in stored, serialized keys.
         *
         **/
        std::vector<uint8_t> vchOtherDerivationParameters;


        //serialization methods
        IMPLEMENT_SERIALIZE
        (
            READWRITE(vchCryptedKey);
            READWRITE(vchSalt);
            READWRITE(nDerivationMethod);
            READWRITE(nDeriveIterations);
            READWRITE(vchOtherDerivationParameters);
        )


        /** The default constructor. **/
        MasterKey();


        /** Copy Constructor. **/
        MasterKey(const MasterKey& key);


        /** Move Constructor. **/
        MasterKey(MasterKey&& key) noexcept;


        /** Copy Assignment. **/
        MasterKey& operator=(const MasterKey& key);


        /** Move Assignment. **/
        MasterKey& operator=(MasterKey&& key) noexcept;


        /** Default Destructor **/
        ~MasterKey();

    };

}

#endif
